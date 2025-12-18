'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus, 
  FileText, 
  Zap, 
  TrendingUp, 
  Clock, 
  Download,
  Eye,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Profile, GeneratedCV } from '@/types'
import { formatDistanceToNow } from '@/lib/utils'

interface DashboardClientProps {
  profile: Profile | null
  recentCVs: GeneratedCV[]
  totalCVs: number
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function DashboardClient({ profile, recentCVs, totalCVs }: DashboardClientProps) {
  const isFreeUser = profile?.subscription_tier === 'free'
  const hasCredits = (profile?.credits_remaining || 0) > 0 || !isFreeUser

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Completed</Badge>
      case 'processing':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Failed</Badge>
      default:
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Pending</Badge>
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground">
              {hasCredits 
                ? "Ready to optimize your next CV? Let's get started."
                : "You've used your free credit. Upgrade to create more CVs."
              }
            </p>
          </div>
          <Link href="/create">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#009444] to-[#00A84D] hover:from-[#00A84D] hover:to-[#4D9E56] text-white border-0 shadow-lg shadow-[#009444]/20"
              disabled={!hasCredits}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New CV
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total CVs Created
              </CardTitle>
              <FileText className="h-4 w-4 text-[#A8C531]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCVs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time generations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Credits Remaining
              </CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isFreeUser ? profile?.credits_remaining || 0 : '∞'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isFreeUser ? 'Free tier' : `${profile?.subscription_tier} plan`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. ATS Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {recentCVs.length > 0 
                  ? Math.round(recentCVs.reduce((acc, cv) => acc + (cv.ats_score || 0), 0) / recentCVs.filter(cv => cv.ats_score).length) || '—'
                  : '—'
                }%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on recent CVs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Plan
              </CardTitle>
              <Sparkles className="h-4 w-4 text-[#A8C531]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">
                {profile?.subscription_tier || 'Free'}
              </div>
              {isFreeUser && (
                <Link href="/pricing">
                  <p className="text-xs text-[#A8C531] mt-1 hover:text-[#B5D334] transition-colors">
                    Upgrade for unlimited →
                  </p>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade Banner for Free Users */}
        {isFreeUser && (
          <motion.div variants={fadeInUp}>
            <Card className="bg-gradient-to-r from-[#009444]/10 via-[#4D9E56]/10 to-[#A8C531]/10 border-[#009444]/20">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009444] to-[#A8C531] flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Unlock Unlimited CV Generations + Job Assistance</h3>
                      <p className="text-muted-foreground text-sm">
                        Upgrade to Pro and get unlimited ATS-optimized CVs plus exclusive job placement assistance from äsk us! AG.
                      </p>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-[#009444] to-[#A8C531] hover:from-[#00A84D] hover:to-[#B5D334] text-white border-0 whitespace-nowrap">
                      Upgrade Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent CVs */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent CVs</h2>
            {totalCVs > 5 && (
              <Link href="/dashboard/cvs">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>

          {recentCVs.length > 0 ? (
            <div className="grid gap-4">
              {recentCVs.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-[#009444]/30 transition-colors">
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            cv.status === 'completed' 
                              ? 'bg-green-500/10' 
                              : cv.status === 'processing'
                              ? 'bg-yellow-500/10'
                              : cv.status === 'failed'
                              ? 'bg-red-500/10'
                              : 'bg-gray-500/10'
                          }`}>
                            {cv.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                            {cv.status === 'processing' && <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />}
                            {cv.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-400" />}
                            {cv.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">
                                {cv.job_title || 'Untitled Position'}
                              </h3>
                              {getStatusBadge(cv.status)}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {cv.job_company || 'Company not specified'}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(cv.created_at))}
                              </span>
                              {cv.ats_score && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3 text-green-400" />
                                  {cv.ats_score}% ATS Score
                                </span>
                              )}
                              <Badge variant="secondary" className="text-xs capitalize">
                                {cv.template_style}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {cv.status === 'completed' && (
                            <>
                              <Link href={`/cv/${cv.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                PDF
                              </Button>
                            </>
                          )}
                          {cv.status === 'processing' && (
                            <Button variant="outline" size="sm" disabled>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* ATS Score Progress */}
                      {cv.ats_score && cv.status === 'completed' && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">ATS Compatibility</span>
                            <span className={`font-medium ${
                              cv.ats_score >= 80 ? 'text-green-400' :
                              cv.ats_score >= 60 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {cv.ats_score}%
                            </span>
                          </div>
                          <Progress 
                            value={cv.ats_score} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#009444]/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[#A8C531]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No CVs created yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Create your first optimized CV by uploading your resume and a job description.
                  </p>
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-[#009444] to-[#A8C531] hover:from-[#00A84D] hover:to-[#B5D334] text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First CV
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Quick Tips */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Match Keywords',
                description: 'Our AI extracts key skills from job descriptions and naturally incorporates them.',
                icon: Sparkles,
                color: 'from-[#009444] to-[#00A84D]'
              },
              {
                title: 'Quantify Results',
                description: 'We help highlight your achievements with numbers and metrics.',
                icon: TrendingUp,
                color: 'from-[#4D9E56] to-[#6B8F4D]'
              },
              {
                title: 'ATS-Friendly Format',
                description: 'All templates are designed to pass applicant tracking systems.',
                icon: CheckCircle2,
                color: 'from-[#A8C531] to-[#B5D334]'
              }
            ].map((tip, index) => (
              <Card key={tip.title} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tip.color} flex items-center justify-center mb-4`}>
                    <tip.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}


