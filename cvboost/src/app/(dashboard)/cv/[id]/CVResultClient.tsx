'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Copy, 
  CheckCircle2,
  TrendingUp,
  Target,
  Lightbulb,
  FileText,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import type { GeneratedCV, OptimizedCVContent } from '@/types'

interface CVResultClientProps {
  cv: GeneratedCV & { documents: { file_name: string } | null }
}

export default function CVResultClient({ cv }: CVResultClientProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const content = cv.optimized_content as OptimizedCVContent | null

  if (cv.status === 'processing') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold mb-2">Generating Your Optimized CV</h1>
          <p className="text-muted-foreground mb-8">
            Our AI is analyzing your resume and tailoring it for the job. This usually takes about 60 seconds.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            <span className="text-sm text-muted-foreground">Processing...</span>
          </div>
        </div>
      </div>
    )
  }

  if (cv.status === 'failed') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😔</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Generation Failed</h1>
          <p className="text-muted-foreground mb-4">
            {cv.error_message || 'Something went wrong while generating your CV.'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/create">
              <Button>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">No content available</p>
          <Link href="/dashboard">
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      // In a production app, you'd generate the PDF server-side
      // For now, we'll create a simple print-friendly version
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${content.contact.name} - Resume</title>
            <style>
              body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; }
              h1 { font-size: 28px; margin-bottom: 5px; }
              h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #1a365d; padding-bottom: 5px; margin-top: 25px; color: #1a365d; }
              .contact { color: #666; font-size: 12px; margin-bottom: 20px; }
              .summary { font-style: italic; color: #444; margin-bottom: 20px; }
              .job { margin-bottom: 15px; }
              .job-title { font-weight: bold; }
              .job-company { color: #666; font-size: 14px; }
              .job-highlights { margin-top: 8px; padding-left: 20px; }
              .job-highlights li { margin-bottom: 4px; font-size: 14px; }
              .skills { display: flex; flex-wrap: wrap; gap: 8px; }
              .skill { background: #f0f0f0; padding: 4px 12px; border-radius: 4px; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>${content.contact.name}</h1>
            <div class="contact">
              ${content.contact.email} | ${content.contact.phone} | ${content.contact.location}
              ${content.contact.linkedin ? ` | ${content.contact.linkedin}` : ''}
            </div>
            
            <h2>Professional Summary</h2>
            <p class="summary">${content.summary}</p>
            
            <h2>Professional Experience</h2>
            ${content.experience.map(exp => `
              <div class="job">
                <div class="job-title">${exp.title}</div>
                <div class="job-company">${exp.company} | ${exp.location} | ${exp.startDate} - ${exp.endDate}</div>
                <ul class="job-highlights">
                  ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
            
            <h2>Education</h2>
            ${content.education.map(edu => `
              <div class="job">
                <div class="job-title">${edu.degree}</div>
                <div class="job-company">${edu.institution} | ${edu.graduationDate}</div>
              </div>
            `).join('')}
            
            <h2>Skills</h2>
            <div class="skills">
              ${[...content.skills.technical, ...content.skills.soft].map(skill => 
                `<span class="skill">${skill}</span>`
              ).join('')}
            </div>
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
      toast.success('PDF ready for download!')
    } catch (error) {
      toast.error('Failed to generate PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {cv.job_title || 'Optimized CV'}
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              {cv.job_company && `${cv.job_company} • `}
              {cv.template_style} template
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCopyLink}>
            {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - CV Preview */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              {/* CV Preview */}
              <div className="bg-white text-gray-900 p-8 md:p-12">
                {/* Header */}
                <div className="border-b-2 border-indigo-600 pb-6 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.contact.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {content.contact.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {content.contact.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {content.contact.location}
                    </span>
                    {content.contact.linkedin && (
                      <span className="flex items-center gap-1">
                        <Linkedin className="w-4 h-4" />
                        {content.contact.linkedin}
                      </span>
                    )}
                    {content.contact.portfolio && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {content.contact.portfolio}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <section className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{content.summary}</p>
                </section>

                {/* Experience */}
                <section className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Professional Experience
                  </h2>
                  <div className="space-y-5">
                    {content.experience.map((exp, idx) => (
                      <div key={idx}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                          <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{exp.company} • {exp.location}</p>
                        <ul className="list-disc list-inside space-y-1">
                          {exp.highlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="text-sm text-gray-700">{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </h2>
                  <div className="space-y-3">
                    {content.education.map((edu, idx) => (
                      <div key={idx}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <span className="text-sm text-gray-500">{edu.graduationDate}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{edu.institution} • {edu.location}</p>
                        {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills */}
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3">
                    Skills
                  </h2>
                  <div className="space-y-2">
                    {content.skills.technical.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Technical: </span>
                        <span className="text-sm text-gray-700">{content.skills.technical.join(' • ')}</span>
                      </div>
                    )}
                    {content.skills.soft.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Soft Skills: </span>
                        <span className="text-sm text-gray-700">{content.skills.soft.join(' • ')}</span>
                      </div>
                    )}
                    {content.skills.languages.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Languages: </span>
                        <span className="text-sm text-gray-700">{content.skills.languages.join(' • ')}</span>
                      </div>
                    )}
                    {content.skills.certifications.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Certifications: </span>
                        <span className="text-sm text-gray-700">{content.skills.certifications.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Scores & Suggestions */}
        <div className="space-y-6">
          {/* ATS Score Card */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                ATS Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className={`text-5xl font-bold ${getScoreColor(content.atsScore)}`}>
                  {content.atsScore}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {content.atsScore >= 80 ? 'Excellent' : content.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
              <Progress value={content.atsScore} className={`h-2 ${getScoreBg(content.atsScore)}`} />
            </CardContent>
          </Card>

          {/* Keyword Match Card */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Keyword Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className={`text-5xl font-bold ${getScoreColor(content.keywordMatchPercentage)}`}>
                  {content.keywordMatchPercentage}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {content.matchedKeywords.length} keywords matched
                </p>
              </div>
              <Progress value={content.keywordMatchPercentage} className="h-2" />
              
              <Separator className="my-4" />
              
              <Tabs defaultValue="matched" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="matched">Matched</TabsTrigger>
                  <TabsTrigger value="missing">Missing</TabsTrigger>
                </TabsList>
                <TabsContent value="matched" className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {content.matchedKeywords.map((keyword, idx) => (
                      <Badge key={idx} className="bg-green-500/10 text-green-400 border-green-500/20">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="missing" className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {content.missingKeywords.map((keyword, idx) => (
                      <Badge key={idx} className="bg-red-500/10 text-red-400 border-red-500/20">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Suggestions Card */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Improvement Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {content.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/create" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Optimize for Another Job
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    View All CVs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


