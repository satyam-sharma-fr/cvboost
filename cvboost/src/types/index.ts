export type SubscriptionTier = 'free' | 'paid' | 'premium'
export type DocumentType = 'cv' | 'cover_letter' | 'certificate'
export type TemplateStyle = 'professional' | 'modern' | 'minimal' | 'creative'
export type CVStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: SubscriptionTier
  credits_remaining: number
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  file_name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  extracted_text: string | null
  parsed_data: Record<string, unknown> | null
  document_type: DocumentType
  created_at: string
}

export interface GeneratedCV {
  id: string
  user_id: string
  source_document_id: string | null
  job_title: string | null
  job_company: string | null
  job_description: string
  job_url: string | null
  template_style: TemplateStyle
  is_anonymous: boolean
  has_ai_avatar: boolean
  avatar_gender: string | null
  language: string
  optimized_content: OptimizedCVContent | null
  ats_score: number | null
  keyword_match_percentage: number | null
  suggestions: string[] | null
  pdf_path: string | null
  docx_path: string | null
  status: CVStatus
  error_message: string | null
  processing_started_at: string | null
  processing_completed_at: string | null
  created_at: string
}

export interface OptimizedCVContent {
  contact: {
    name: string
    email: string
    phone: string
    location: string
    linkedin: string | null
    portfolio: string | null
  }
  summary: string
  experience: {
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    highlights: string[]
  }[]
  education: {
    degree: string
    institution: string
    location: string
    graduationDate: string
    gpa: string | null
    highlights: string[]
  }[]
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
    certifications: string[]
  }
  atsScore: number
  keywordMatchPercentage: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
}

export interface CVCreationState {
  step: number
  // Step 1: Document Upload
  uploadedFile: File | null
  extractedText: string
  // Step 2: Job Details
  jobTitle: string
  jobCompany: string
  jobDescription: string
  jobUrl: string
  // Step 3: Preferences
  templateStyle: TemplateStyle
  isAnonymous: boolean
  hasAIAvatar: boolean
  avatarGender: 'male' | 'female' | 'neutral'
  language: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string | null
  tier: SubscriptionTier
  status: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}


