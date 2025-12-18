import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client lazily at runtime (not at build time)
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

const CV_OPTIMIZATION_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) optimization specialist and professional resume writer with 15+ years of experience in HR and recruitment.

Your task is to optimize a candidate's CV/resume for a specific job posting while maintaining authenticity and truthfulness.

## CRITICAL RULES:
1. NEVER invent or fabricate experience, skills, or qualifications
2. ONLY enhance, reorganize, and rephrase existing content
3. Match terminology to the job description where the candidate has equivalent skills
4. Quantify achievements using numbers from the original CV or reasonable estimates based on context
5. Use ATS-friendly formatting with standard section headers

## OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string | null",
    "portfolio": "string | null"
  },
  "summary": "string (2-4 sentences, tailored to job)",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "string (Month Year)",
      "endDate": "string (Month Year or Present)",
      "highlights": ["string (achievement-focused bullet points)"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "location": "string",
      "graduationDate": "string",
      "gpa": "string | null",
      "highlights": ["string | null"]
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "languages": ["string"],
    "certifications": ["string"]
  },
  "atsScore": number (0-100),
  "keywordMatchPercentage": number (0-100),
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "suggestions": ["string (actionable improvement tips)"]
}

## OPTIMIZATION STRATEGY:
1. Professional Summary: Write a compelling 2-4 sentence summary highlighting the most relevant experience for this specific role
2. Experience: Reorder to prioritize most relevant roles, rewrite bullets to match job keywords, use action verbs, quantify results
3. Skills: Reorganize to put job-relevant skills first, match exact terminology from job description
4. Keywords: Naturally incorporate keywords from the job description throughout the CV
5. ATS Compliance: Use standard headers, no special characters, clean formatting`

function buildOptimizationPrompt(
  originalCV: string,
  jobDescription: string,
  options: {
    language?: string
    isAnonymous?: boolean
  }
) {
  return `
## ORIGINAL CV:
${originalCV}

## TARGET JOB DESCRIPTION:
${jobDescription}

## INSTRUCTIONS:
${options.isAnonymous ? '- Replace name with "[CANDIDATE NAME]", email with "[EMAIL]", phone with "[PHONE]", location with "[LOCATION]"' : ''}
- Output language: ${options.language === 'en' ? 'English' : options.language === 'de' ? 'German' : options.language === 'fr' ? 'French' : options.language === 'es' ? 'Spanish' : 'English'}
- Optimize this CV for the target job while following all rules above
- Return ONLY valid JSON, no markdown or explanation`
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { generatedCvId, extractedText, jobDescription, isAnonymous, language } = body

    if (!generatedCvId || !extractedText || !jobDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_remaining, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isFreeUser = profile.subscription_tier === 'free'
    if (isFreeUser && profile.credits_remaining <= 0) {
      return NextResponse.json({ error: 'No credits remaining. Please upgrade your plan.' }, { status: 402 })
    }

    // Update status to processing
    await supabase
      .from('generated_cvs')
      .update({
        status: 'processing',
        processing_started_at: new Date().toISOString(),
      })
      .eq('id', generatedCvId)

    // Generate optimized CV with OpenAI
    let optimizedContent
    try {
      const openai = getOpenAIClient()
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: CV_OPTIMIZATION_SYSTEM_PROMPT },
          {
            role: 'user',
            content: buildOptimizationPrompt(extractedText, jobDescription, {
              language,
              isAnonymous,
            }),
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4000,
      })

      const content = completion.choices[0].message.content
      if (!content) {
        throw new Error('No content returned from OpenAI')
      }

      optimizedContent = JSON.parse(content)
    } catch (openaiError) {
      console.error('OpenAI error:', openaiError)
      
      // Update status to failed
      await supabase
        .from('generated_cvs')
        .update({
          status: 'failed',
          error_message: openaiError instanceof Error ? openaiError.message : 'OpenAI processing failed',
        })
        .eq('id', generatedCvId)

      return NextResponse.json({ error: 'Failed to generate optimized CV' }, { status: 500 })
    }

    // Update the generated CV record with results
    await supabase
      .from('generated_cvs')
      .update({
        optimized_content: optimizedContent,
        ats_score: optimizedContent.atsScore,
        keyword_match_percentage: optimizedContent.keywordMatchPercentage,
        suggestions: optimizedContent.suggestions,
        status: 'completed',
        processing_completed_at: new Date().toISOString(),
      })
      .eq('id', generatedCvId)

    // Deduct credit for free users
    if (isFreeUser) {
      await supabase
        .from('profiles')
        .update({ credits_remaining: profile.credits_remaining - 1 })
        .eq('id', user.id)
    }

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: 'cv_generated',
      metadata: { generated_cv_id: generatedCvId },
    })

    return NextResponse.json({ 
      success: true, 
      data: optimizedContent,
      cvId: generatedCvId 
    })
  } catch (error) {
    console.error('Error in generate-cv:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}


