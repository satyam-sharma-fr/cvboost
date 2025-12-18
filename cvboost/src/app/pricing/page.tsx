'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  CheckCircle2, 
  Sparkles, 
  Zap,
  ArrowLeft,
  Crown,
  Briefcase,
  Globe,
  ArrowRight,
  Camera,
  Users,
  Rocket,
  Shield,
  Handshake,
  Building2,
  Target,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050A07]">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">CV<span className="gradient-text">Boost</span></span>
                <span className="text-[9px] text-muted-foreground tracking-wider uppercase">powered by äsk us!</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <Link href="https://aesk.ch" target="_blank">
                <Button variant="ghost" className="text-muted-foreground hover:text-[#A8C531]">
                  <Globe className="w-4 h-4 mr-2" />
                  aesk.ch
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050A07]" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 radial-gradient" />
        <motion.div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#009444]/20 to-[#A8C531]/10 blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#A8C531]/15 to-[#009444]/10 blur-[100px]"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-5 py-2 text-sm bg-[#009444]/15 text-[#A8C531] border border-[#009444]/30">
              <Rocket className="w-4 h-4 mr-2" />
              Choose Your Career Path
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Invest in Your <span className="gradient-text">Future</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free. Get AI-powered tools. Unlock recruiter access when you&apos;re ready to accelerate.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Explorer Tier */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="relative"
            >
              <div className="relative p-8 rounded-2xl bg-[#0A120D] border border-[#1A2F22] h-full hover:border-[#009444]/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A2F22] to-[#0A120D] flex items-center justify-center border border-[#1A2F22]">
                    <Sparkles className="w-6 h-6 text-[#A8C531]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Explorer</h3>
                    <p className="text-muted-foreground text-sm">Test the waters</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold">CHF 0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {[
                    { text: '1 CV generation', icon: CheckCircle2 },
                    { text: '1 AI professional headshot', icon: Camera },
                    { text: 'All 4 professional templates', icon: CheckCircle2 },
                    { text: 'ATS compatibility score', icon: Target },
                    { text: 'PDF download', icon: CheckCircle2 },
                    { text: 'Keyword matching', icon: CheckCircle2 },
                  ].map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3 text-sm">
                      <feature.icon className="w-5 h-5 text-[#A8C531] shrink-0" />
                      {feature.text}
                    </li>
                  ))}
                </ul>
                
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full h-12 border-[#1A2F22] hover:border-[#009444] hover:bg-[#009444]/10">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Job Seeker Tier */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative md:-mt-4 md:mb-4"
            >
              <div className="relative p-8 rounded-2xl gradient-border glow-intense h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#009444] to-[#A8C531] text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009444] to-[#4D9E56] flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Job Seeker</h3>
                    <p className="text-muted-foreground text-sm">Active search mode</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold gradient-text-static">CHF 29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {[
                    { text: 'Unlimited CV generations', icon: CheckCircle2 },
                    { text: '5 AI headshots per month', icon: Camera },
                    { text: 'All professional templates', icon: CheckCircle2 },
                    { text: 'PDF & DOCX download', icon: CheckCircle2 },
                    { text: 'ATS score & detailed tips', icon: Target },
                    { text: 'Keyword matching & suggestions', icon: CheckCircle2 },
                    { text: 'Priority AI processing', icon: Zap },
                    { text: 'Email support', icon: CheckCircle2 },
                  ].map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3 text-sm">
                      <feature.icon className="w-5 h-5 text-[#A8C531] shrink-0" />
                      {feature.text}
                    </li>
                  ))}
                  {/* Recruiter Access Highlight */}
                  <li className="flex items-center gap-3 text-sm pt-2 border-t border-[#1A2F22]">
                    <Handshake className="w-5 h-5 text-[#A8C531] shrink-0" />
                    <span className="font-semibold text-[#A8C531]">Recruiter Access from äsk us! AG</span>
                  </li>
                </ul>
                
                <Link href="/signup?plan=jobseeker" className="block">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full h-12 bg-gradient-to-r from-[#009444] to-[#A8C531] hover:from-[#00A84D] hover:to-[#B5D334] text-white font-semibold border-0">
                      Start 7-Day Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  No credit card required
                </p>
              </div>
            </motion.div>

            {/* Career Accelerator Tier */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative p-8 rounded-2xl bg-[#0A120D] border border-[#1A2F22] h-full hover:border-[#009444]/30 transition-colors">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#1A2F22] text-[#A8C531] text-sm font-medium rounded-full flex items-center gap-1 border border-[#009444]/30">
                  <Crown className="w-4 h-4" />
                  Premium
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A8C531] to-[#B5D334] flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Career Accelerator</h3>
                    <p className="text-muted-foreground text-sm">Fast-track your career</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold">CHF 49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {[
                    { text: 'Everything in Job Seeker', icon: CheckCircle2 },
                    { text: 'Unlimited AI headshots', icon: Camera },
                    { text: 'AI cover letter generation', icon: CheckCircle2 },
                    { text: 'LinkedIn profile optimization', icon: CheckCircle2 },
                    { text: 'Personal career coach AI', icon: Users },
                    { text: 'Resume A/B testing', icon: Target },
                    { text: 'Priority support', icon: Zap },
                  ].map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3 text-sm">
                      <feature.icon className="w-5 h-5 text-[#A8C531] shrink-0" />
                      {feature.text}
                    </li>
                  ))}
                  {/* Priority Job Placement */}
                  <li className="flex items-center gap-3 text-sm pt-2 border-t border-[#1A2F22]">
                    <Building2 className="w-5 h-5 text-[#A8C531] shrink-0" />
                    <span className="font-semibold text-[#A8C531]">Priority Job Placement by äsk us!</span>
                  </li>
                </ul>
                
                <Link href="/signup?plan=accelerator" className="block">
                  <Button variant="outline" className="w-full h-12 border-[#1A2F22] hover:border-[#009444] hover:bg-[#009444]/10">
                    Start Premium Trial
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Recruiter Access Value Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative p-8 rounded-2xl bg-gradient-to-r from-[#009444]/10 via-[#4D9E56]/10 to-[#A8C531]/10 border border-[#009444]/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#009444]/5 to-transparent" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#009444] to-[#A8C531] flex items-center justify-center shrink-0">
                  <Handshake className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white">🎯 Included: Real Recruiter Access</h3>
                  <p className="text-muted-foreground mb-4">
                    As a paid subscriber, your profile enters our exclusive talent pool. Swiss employers actively search for candidates like you. 
                    Our recruiters from äsk us! AG personally pitch you to hiring managers and help you land interviews.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-[#A8C531] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Direct employer connections
                    </span>
                    <span className="text-[#A8C531] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Hidden job opportunities
                    </span>
                    <span className="text-[#A8C531] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Worth CHF 500+ at other agencies
                    </span>
                  </div>
                </div>
                <Link href="https://aesk.ch" target="_blank">
                  <Button variant="outline" className="whitespace-nowrap border-[#009444]/30 hover:border-[#A8C531] hover:bg-[#009444]/10">
                    Learn About äsk us!
                    <Globe className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Compare Plans</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1A2F22]">
                    <th className="text-left py-4 px-4 text-muted-foreground font-medium">Feature</th>
                    <th className="text-center py-4 px-4 text-muted-foreground font-medium">Explorer</th>
                    <th className="text-center py-4 px-4 text-[#A8C531] font-medium">Job Seeker</th>
                    <th className="text-center py-4 px-4 text-muted-foreground font-medium">Accelerator</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'CV Generations', explorer: '1', seeker: 'Unlimited', accelerator: 'Unlimited' },
                    { feature: 'AI Headshots', explorer: '1', seeker: '5/month', accelerator: 'Unlimited' },
                    { feature: 'Templates', explorer: 'All 4', seeker: 'All 4', accelerator: 'All 4 + Custom' },
                    { feature: 'ATS Score', explorer: '✓', seeker: '✓ + Tips', accelerator: '✓ + Tips' },
                    { feature: 'Export Formats', explorer: 'PDF', seeker: 'PDF + DOCX', accelerator: 'PDF + DOCX' },
                    { feature: 'AI Cover Letters', explorer: '—', seeker: '—', accelerator: '✓' },
                    { feature: 'LinkedIn Optimization', explorer: '—', seeker: '—', accelerator: '✓' },
                    { feature: 'Recruiter Access', explorer: '—', seeker: '✓', accelerator: 'Priority' },
                    { feature: 'Interview Coaching', explorer: '—', seeker: '—', accelerator: '✓' },
                    { feature: 'Support', explorer: 'Community', seeker: 'Email', accelerator: 'Priority' },
                  ].map((row, idx) => (
                    <tr key={row.feature} className={`border-b border-[#1A2F22] ${idx % 2 === 0 ? 'bg-[#0A120D]/30' : ''}`}>
                      <td className="py-4 px-4 text-sm">{row.feature}</td>
                      <td className="py-4 px-4 text-sm text-center text-muted-foreground">{row.explorer}</td>
                      <td className="py-4 px-4 text-sm text-center text-[#A8C531] font-medium">{row.seeker}</td>
                      <td className="py-4 px-4 text-sm text-center text-muted-foreground">{row.accelerator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: 'How does the free plan work?',
                  a: 'You get 1 free CV generation and 1 AI headshot with no credit card required. Perfect to test the platform before upgrading.'
                },
                {
                  q: 'What is Recruiter Access from äsk us! AG?',
                  a: 'As a paid subscriber, your profile enters our talent pool. Our Swiss recruiters actively match you with employers and pitch you for roles — like having a personal career agent.'
                },
                {
                  q: 'Can I cancel my subscription anytime?',
                  a: 'Yes, cancel anytime with no questions asked. You\'ll keep access until the end of your billing period.'
                },
                {
                  q: 'What file formats are supported?',
                  a: 'Upload in PDF, DOCX, or TXT format. Download your optimized CV in PDF or DOCX.'
                },
                {
                  q: 'Is my data secure?',
                  a: 'Yes. We use Swiss-grade encryption and never share your data. Your CVs are stored securely and you can delete them anytime.'
                },
                {
                  q: 'How does Priority Job Placement work?',
                  a: 'Career Accelerator subscribers get first access to exclusive job opportunities and dedicated 1-on-1 support from äsk us! recruitment specialists.'
                }
              ].map((faq, idx) => (
                <motion.div 
                  key={idx} 
                  className="p-6 rounded-xl bg-[#0A120D] border border-[#1A2F22] hover:border-[#009444]/30 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <h3 className="font-semibold mb-2 text-white">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#A8C531]" />
              <span>Swiss Data Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#A8C531]" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#A8C531]" />
              <span>12,000+ Placed</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#A8C531]" />
              <span>Cancel Anytime</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join 12,000+ professionals who&apos;ve found their next opportunity with CVBoost + äsk us!
            </p>
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Button size="lg" className="h-14 px-10 bg-gradient-to-r from-[#009444] to-[#A8C531] hover:from-[#00A84D] hover:to-[#B5D334] text-white font-semibold border-0 shadow-lg shadow-[#009444]/20">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
