'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Palette, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  Globe,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useCVCreationStore } from '@/store/cv-creation'
import { createClient } from '@/lib/supabase/client'
import type { TemplateStyle } from '@/types'

const steps = [
  { id: 1, title: 'Upload CV', icon: Upload, description: 'Upload your existing resume' },
  { id: 2, title: 'Job Details', icon: Briefcase, description: 'Paste the job description' },
  { id: 3, title: 'Preferences', icon: Palette, description: 'Customize your output' },
  { id: 4, title: 'Review', icon: CheckCircle2, description: 'Review and generate' },
]

const templates: { id: TemplateStyle; name: string; description: string; color: string }[] = [
  { id: 'professional', name: 'Professional', description: 'Traditional & corporate', color: 'from-slate-600 to-slate-800' },
  { id: 'modern', name: 'Modern', description: 'Clean & contemporary', color: 'from-indigo-500 to-purple-600' },
  { id: 'minimal', name: 'Minimal', description: 'Simple & elegant', color: 'from-gray-400 to-gray-600' },
  { id: 'creative', name: 'Creative', description: 'Bold & unique', color: 'from-pink-500 to-orange-400' },
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
]

export default function CreateCVPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  
  const {
    step,
    setStep,
    nextStep,
    prevStep,
    uploadedFile,
    setUploadedFile,
    extractedText,
    setExtractedText,
    jobTitle,
    jobCompany,
    jobDescription,
    jobUrl,
    setJobDetails,
    templateStyle,
    isAnonymous,
    hasAIAvatar,
    avatarGender,
    language,
    setPreferences,
    reset,
  } = useCVCreationStore()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploadedFile(file)
    
    // For now, we'll just read text files. In production, you'd use PDF parsing
    if (file.type === 'text/plain') {
      const text = await file.text()
      setExtractedText(text)
    } else {
      // Simulate text extraction for demo
      setExtractedText(`[Content extracted from ${file.name}]\n\nThis would contain the parsed text from your PDF or DOCX file. The AI will use this content to optimize your resume.`)
    }
    
    toast.success('File uploaded successfully!')
  }, [setUploadedFile, setExtractedText])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = () => {
    setUploadedFile(null)
    setExtractedText('')
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return uploadedFile !== null && extractedText !== ''
      case 2:
        return jobDescription.trim().length > 50
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Please sign in to continue')
        router.push('/login')
        return
      }

      // Create document record
      const { data: document, error: docError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          file_name: uploadedFile?.name || 'uploaded_cv',
          file_path: 'temp/' + Date.now(), // In production, upload to storage
          extracted_text: extractedText,
          document_type: 'cv',
        })
        .select()
        .single()

      if (docError) throw docError

      // Create generated CV record
      const { data: generatedCV, error: cvError } = await supabase
        .from('generated_cvs')
        .insert({
          user_id: user.id,
          source_document_id: document.id,
          job_title: jobTitle || null,
          job_company: jobCompany || null,
          job_description: jobDescription,
          job_url: jobUrl || null,
          template_style: templateStyle,
          is_anonymous: isAnonymous,
          has_ai_avatar: hasAIAvatar,
          avatar_gender: hasAIAvatar ? avatarGender : null,
          language: language,
          status: 'processing',
        })
        .select()
        .single()

      if (cvError) throw cvError

      // Call the API to generate the CV
      const response = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generatedCvId: generatedCV.id,
          extractedText,
          jobDescription,
          templateStyle,
          isAnonymous,
          language,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to generate CV')
      }

      toast.success('CV generated successfully!')
      reset()
      router.push(`/cv/${generatedCV.id}`)
    } catch (error) {
      console.error('Error generating CV:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate CV')
    } finally {
      setIsGenerating(false)
    }
  }

  const progress = (step / steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Create Optimized CV</h1>
          <Button variant="ghost" onClick={() => router.back()}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
        
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                disabled={s.id > step}
                className={`flex items-center gap-2 ${s.id <= step ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  s.id < step 
                    ? 'bg-green-500 text-white' 
                    : s.id === step 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {s.id < step ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-sm font-medium ${s.id === step ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
              </button>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block w-12 h-px mx-4 ${
                  s.id < step ? 'bg-green-500' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <Progress value={progress} className="h-1" />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Upload CV */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Upload Your Resume</h2>
                <p className="text-muted-foreground">
                  Upload your existing CV in PDF, DOCX, or TXT format. We&apos;ll extract the content and use it as the base for optimization.
                </p>
              </div>

              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : 'border-border hover:border-indigo-500/50 hover:bg-secondary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your resume'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOCX, TXT (max 10MB)
                  </p>
                </div>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                          <Badge variant="secondary" className="mt-2 bg-green-500/10 text-green-400 border-green-500/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Content extracted
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeFile}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {extractedText && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <Label className="mb-2 block">Extracted Content Preview</Label>
                        <div className="p-4 rounded-lg bg-secondary/50 max-h-48 overflow-y-auto">
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                            {extractedText.slice(0, 500)}
                            {extractedText.length > 500 && '...'}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Job Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Job Details</h2>
                <p className="text-muted-foreground">
                  Paste the job description you&apos;re applying for. The more detailed, the better the optimization.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title (Optional)</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobDetails({ jobTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobCompany">Company Name (Optional)</Label>
                  <Input
                    id="jobCompany"
                    placeholder="e.g., Google"
                    value={jobCompany}
                    onChange={(e) => setJobDetails({ jobCompany: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job Listing URL (Optional)</Label>
                <Input
                  id="jobUrl"
                  placeholder="https://..."
                  value={jobUrl}
                  onChange={(e) => setJobDetails({ jobUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">
                  Job Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDetails({ jobDescription: e.target.value })}
                  className="min-h-[300px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {jobDescription.length} characters · Minimum 50 required
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-2">Customize Your CV</h2>
                <p className="text-muted-foreground">
                  Choose your preferred template and settings for the optimized CV.
                </p>
              </div>

              {/* Template Selection */}
              <div className="space-y-4">
                <Label>Select Template Style</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setPreferences({ templateStyle: template.id })}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        templateStyle === template.id
                          ? 'border-indigo-500 bg-indigo-500/5'
                          : 'border-border hover:border-indigo-500/50'
                      }`}
                    >
                      {templateStyle === template.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                        </div>
                      )}
                      <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${template.color} mb-3 flex items-center justify-center`}>
                        <FileText className="w-8 h-8 text-white/50" />
                      </div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <Label>Output Language</Label>
                <Select value={language} onValueChange={(value) => setPreferences({ language: value })}>
                  <SelectTrigger className="w-full sm:w-64">
                    <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Privacy Options */}
              <div className="space-y-4">
                <Label>Privacy Options</Label>
                
                <Card className="bg-card border-border">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isAnonymous ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">Anonymous Mode</p>
                          <p className="text-sm text-muted-foreground">
                            Replace personal details with placeholders
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setPreferences({ isAnonymous: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Generate AI Avatar</p>
                          <p className="text-sm text-muted-foreground">
                            Create a professional avatar for your CV
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={hasAIAvatar}
                        onCheckedChange={(checked) => setPreferences({ hasAIAvatar: checked })}
                        disabled={isAnonymous}
                      />
                    </div>
                    
                    {hasAIAvatar && !isAnonymous && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <Label className="mb-2 block">Avatar Style</Label>
                        <div className="flex gap-2">
                          {(['male', 'female', 'neutral'] as const).map((gender) => (
                            <Button
                              key={gender}
                              variant={avatarGender === gender ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPreferences({ avatarGender: gender })}
                              className={avatarGender === gender ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
                            >
                              {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Review & Generate</h2>
                <p className="text-muted-foreground">
                  Review your settings and generate your optimized CV.
                </p>
              </div>

              <div className="grid gap-4">
                {/* Summary Cards */}
                <Card className="bg-card border-border">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      <p className="font-medium">Source Document</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{uploadedFile?.name}</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Briefcase className="w-5 h-5 text-indigo-400" />
                      <p className="font-medium">Target Position</p>
                    </div>
                    <p className="text-sm">
                      {jobTitle || 'Not specified'} 
                      {jobCompany && ` at ${jobCompany}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {jobDescription.length} characters of job description
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Palette className="w-5 h-5 text-indigo-400" />
                      <p className="font-medium">Output Settings</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="capitalize">{templateStyle} Template</Badge>
                      <Badge variant="secondary">{languages.find(l => l.code === language)?.name}</Badge>
                      {isAnonymous && <Badge variant="secondary">Anonymous</Badge>}
                      {hasAIAvatar && <Badge variant="secondary">AI Avatar</Badge>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* What happens next */}
              <Card className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium mb-2">What happens next?</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• AI analyzes your resume and the job description</li>
                        <li>• Keywords and skills are matched and optimized</li>
                        <li>• Professional summary is tailored to the role</li>
                        <li>• ATS-friendly formatting is applied</li>
                        <li>• You get a downloadable PDF in ~60 seconds</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1}
          className={step === 1 ? 'invisible' : ''}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step < 4 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 glow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Optimized CV
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}


