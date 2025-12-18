'use client'

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState, useCallback } from 'react'
import { 
  Upload, 
  FileText, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  ChevronRight,
  Play,
  Target,
  Brain,
  Rocket,
  Globe,
  Briefcase,
  Camera,
  ImageIcon,
  Lock,
  Mail,
  Crown,
  Quote,
  Building2,
  Award,
  UserCheck,
  Handshake
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
}

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
          const duration = 2000
          const steps = 60
          const increment = numericValue / steps
          let current = 0
          
          const timer = setInterval(() => {
            current += increment
            if (current >= numericValue) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              setDisplayValue(Math.floor(current).toString())
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])
  
  return <span ref={ref}>{displayValue}{suffix}</span>
}

// Floating particles component
function FloatingParticles() {
  return (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}

// Animated stripes background
function AnimatedStripes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute inset-0 flex"
        initial={{ x: '-50%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(40)].map((_, i) => {
          const colors = [
            'bg-[#0D3B22]', 'bg-[#143D28]', 'bg-[#009444]', 'bg-[#00A84D]',
            'bg-[#4D9E56]', 'bg-[#6B8F4D]', 'bg-[#7A9A50]', 'bg-[#A8C531]', 'bg-[#B5D334]'
          ]
          return (
            <motion.div
              key={i}
              className={`h-full w-[50px] ${colors[i % colors.length]}`}
              style={{ opacity: 0.08 }}
              animate={{
                opacity: [0.05, 0.12, 0.05],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

// 3D Card component
function Card3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg'])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Photo Upload Component for Lead Magnet
function PhotoUploadSection() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [email, setEmail] = useState('')
  const [wantJobs, setWantJobs] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
      setIsProcessing(true)
      // Simulate AI processing
      setTimeout(() => {
        setIsProcessing(false)
        setShowResult(true)
      }, 3000)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleDownloadClick = () => {
    setShowEmailGate(true)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would capture the lead
    console.log('Lead captured:', { email, wantJobs })
    // For demo, show success
    alert('Photo downloaded! Check your email for the full resolution version.')
    setShowEmailGate(false)
  }

  const resetUpload = () => {
    setUploadedImage(null)
    setShowResult(false)
    setShowEmailGate(false)
    setIsProcessing(false)
  }

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 radial-gradient-lime opacity-30" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 px-5 py-2 text-sm bg-[#A8C531]/15 text-[#A8C531] border border-[#A8C531]/30">
            <Camera className="w-4 h-4 mr-2" />
            Free AI Tool
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Get a Professional Headshot{' '}
            <span className="gradient-text">in Seconds</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI transforms any photo into a LinkedIn-ready professional headshot. 
            No photographer, no studio, no waiting.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              {[
                { icon: Sparkles, text: 'AI-optimized lighting and contrast', color: 'text-[#A8C531]' },
                { icon: ImageIcon, text: 'Professional background removal', color: 'text-[#00A84D]' },
                { icon: Target, text: 'LinkedIn & resume-ready format', color: 'text-[#4D9E56]' },
                { icon: Zap, text: 'Instant results — free preview', color: 'text-[#B5D334]' },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0A120D]/50 border border-[#1A2F22] hover:border-[#009444]/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-[#009444]/10 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#009444] to-[#A8C531] border-2 border-[#050A07]" />
                ))}
              </div>
              <span>Used by <span className="text-[#A8C531] font-semibold">50,000+</span> professionals</span>
            </div>
          </motion.div>

          {/* Right side - Upload Zone */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card3D>
              <div className="relative p-8 rounded-3xl bg-[#0A120D] border border-[#1A2F22] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#009444]/5 via-transparent to-[#A8C531]/5" />
                
                <AnimatePresence mode="wait">
                  {!uploadedImage ? (
                    /* Upload Zone */
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#1A2F22] hover:border-[#009444] rounded-2xl p-12 text-center cursor-pointer transition-all hover:bg-[#009444]/5 group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        />
                        <motion.div
                          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#009444]/20 to-[#A8C531]/20 flex items-center justify-center group-hover:scale-110 transition-transform"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Upload className="w-10 h-10 text-[#A8C531]" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">Drop your photo here</h3>
                        <p className="text-muted-foreground mb-4">or click to browse</p>
                        <p className="text-xs text-muted-foreground">Supports JPG, PNG (max 10MB)</p>
                      </div>
                    </motion.div>
                  ) : isProcessing ? (
                    /* Processing State */
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative text-center py-12"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-[#1A2F22] border-t-[#A8C531]"
                      />
                      <h3 className="text-xl font-semibold mb-4">AI is enhancing your photo...</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          ✓ Analyzing lighting conditions
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                        >
                          ✓ Optimizing background
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 }}
                        >
                          ✓ Enhancing professional appearance
                        </motion.p>
                      </div>
                    </motion.div>
                  ) : showResult ? (
                    /* Result State */
                    <motion.div
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Before */}
                        <div className="relative">
                          <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/80 text-white text-xs rounded-full">
                            Before
                          </div>
                          <div className="aspect-square rounded-xl overflow-hidden bg-[#1A2F22]">
                            <Image
                              src={uploadedImage}
                              alt="Original"
                              width={200}
                              height={200}
                              className="w-full h-full object-cover opacity-70"
                            />
                          </div>
                        </div>
                        {/* After */}
                        <div className="relative">
                          <div className="absolute top-2 left-2 px-2 py-1 bg-[#009444] text-white text-xs rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> After
                          </div>
                          <div className="aspect-square rounded-xl overflow-hidden bg-[#1A2F22] relative">
                            <Image
                              src={uploadedImage}
                              alt="Enhanced"
                              width={200}
                              height={200}
                              className="w-full h-full object-cover brightness-110 contrast-105 saturate-110"
                            />
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="px-3 py-1 bg-black/50 rounded text-white/70 text-xs font-medium rotate-[-15deg]">
                                CVBoost
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!showEmailGate ? (
                        <div className="space-y-4">
                          <Button
                            onClick={handleDownloadClick}
                            className="w-full h-14 bg-gradient-to-r from-[#009444] to-[#A8C531] hover:from-[#00A84D] hover:to-[#B5D334] text-white text-lg font-semibold"
                          >
                            <Lock className="w-5 h-5 mr-2" />
                            Download Full Quality — Free
                          </Button>
                          <button
                            onClick={resetUpload}
                            className="w-full text-sm text-muted-foreground hover:text-white transition-colors"
                          >
                            ← Try another photo
                          </button>
                        </div>
                      ) : (
                        /* Email Gate */
                        <motion.form
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onSubmit={handleEmailSubmit}
                          className="space-y-4"
                        >
                          <div className="p-4 rounded-xl bg-[#009444]/10 border border-[#009444]/30">
                            <div className="flex items-center gap-2 text-[#A8C531] text-sm font-medium mb-3">
                              <Lock className="w-4 h-4" />
                              Enter your email to download
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                  type="email"
                                  required
                                  placeholder="your.email@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-[#0A120D] border border-[#1A2F22] focus:border-[#009444] outline-none transition-colors"
                                />
                              </div>
                              <Button
                                type="submit"
                                className="h-12 px-6 bg-gradient-to-r from-[#009444] to-[#A8C531]"
                              >
                                <Download className="w-5 h-5" />
                              </Button>
                            </div>
                            <label className="flex items-center gap-2 mt-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={wantJobs}
                                onChange={(e) => setWantJobs(e.target.checked)}
                                className="w-4 h-4 rounded border-[#1A2F22]"
                              />
                              <span className="text-sm text-muted-foreground">
                                Send me job opportunities matching my profile
                              </span>
                            </label>
                          </div>
                          <p className="text-xs text-center text-muted-foreground">
                            By downloading, you agree to our Terms & Privacy Policy
                          </p>
                        </motion.form>
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </Card3D>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Two Paths Section Component
function TwoPathsSection() {
  const [hoveredPath, setHoveredPath] = useState<'a' | 'b' | null>(null)

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            How Can We <span className="gradient-text">Help You</span> Today?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your path and let&apos;s get you where you want to be
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Path A - Stand Out */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setHoveredPath('a')}
            onMouseLeave={() => setHoveredPath(null)}
          >
            <Link href="/signup?path=standout">
              <Card3D className="h-full">
                <motion.div
                  animate={{
                    borderColor: hoveredPath === 'a' ? 'rgba(0, 168, 77, 0.5)' : 'rgba(26, 47, 34, 1)',
                    y: hoveredPath === 'a' ? -8 : 0,
                  }}
                  className="relative p-8 md:p-10 rounded-3xl bg-[#0A120D] border-2 border-[#1A2F22] h-full overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#009444]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <motion.div
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#009444] to-[#4D9E56] flex items-center justify-center mb-6"
                      animate={{ rotate: hoveredPath === 'a' ? 5 : 0, scale: hoveredPath === 'a' ? 1.05 : 1 }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#A8C531] transition-colors">
                      I Need to Stand Out
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Get an AI-optimized resume and professional headshot that make recruiters stop scrolling.
                    </p>

                    <ul className="space-y-3 mb-8">
                      {[
                        'AI CV optimization',
                        'Professional AI headshot',
                        'ATS-beating format',
                        'Instant downloads'
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-[#A8C531] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      <motion.div
                        className="flex items-center gap-2 text-[#A8C531] font-semibold"
                        animate={{ x: hoveredPath === 'a' ? 5 : 0 }}
                      >
                        Boost My Profile
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                      <span className="text-sm text-muted-foreground">Free • No credit card</span>
                    </div>
                  </div>
                </motion.div>
              </Card3D>
            </Link>
          </motion.div>

          {/* Path B - Get a Job */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onMouseEnter={() => setHoveredPath('b')}
            onMouseLeave={() => setHoveredPath(null)}
          >
            <Link href="/signup?path=getjob">
              <Card3D className="h-full">
                <motion.div
                  animate={{
                    borderColor: hoveredPath === 'b' ? 'rgba(168, 197, 49, 0.5)' : 'rgba(26, 47, 34, 1)',
                    y: hoveredPath === 'b' ? -8 : 0,
                  }}
                  className="relative p-8 md:p-10 rounded-3xl bg-[#0A120D] border-2 border-[#1A2F22] h-full overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A8C531]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Popular badge */}
                  <div className="absolute -top-0 -right-0">
                    <div className="bg-gradient-to-r from-[#009444] to-[#A8C531] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-3xl">
                      MOST POPULAR
                    </div>
                  </div>
                  
                  <div className="relative">
                    <motion.div
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A8C531] to-[#B5D334] flex items-center justify-center mb-6"
                      animate={{ rotate: hoveredPath === 'b' ? 5 : 0, scale: hoveredPath === 'b' ? 1.05 : 1 }}
                    >
                      <Rocket className="w-10 h-10 text-white" />
                    </motion.div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#A8C531] transition-colors">
                      I Need a Job
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Let our Swiss recruiters connect you with opportunities you won&apos;t find on job boards.
                    </p>

                    <ul className="space-y-3 mb-8">
                      {[
                        'Everything in "Stand Out"',
                        'Personal recruiter matching',
                        'Access to hidden jobs',
                        'Interview preparation'
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-[#A8C531] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      <motion.div
                        className="flex items-center gap-2 text-[#A8C531] font-semibold"
                        animate={{ x: hoveredPath === 'b' ? 5 : 0 }}
                      >
                        Get Matched With Jobs
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                      <span className="text-sm text-muted-foreground">Real human support</span>
                    </div>
                  </div>
                </motion.div>
              </Card3D>
            </Link>
          </motion.div>
        </div>

        {/* Try Tools Free */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-[#0A120D] border border-[#1A2F22]">
            <span className="text-muted-foreground">Or try our AI tools free:</span>
            <Link href="#ai-photo">
              <Button variant="ghost" size="sm" className="text-[#A8C531] hover:text-white hover:bg-[#009444]/20">
                <Camera className="w-4 h-4 mr-2" />
                AI Photo
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="ghost" size="sm" className="text-[#A8C531] hover:text-white hover:bg-[#009444]/20">
                <FileText className="w-4 h-4 mr-2" />
                AI CV
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Marketing Manager',
      location: 'Zürich',
      image: null,
      quote: 'I uploaded my CV on Monday. By Thursday, äsk us! had me interviewing at three companies. I started my new job in 3 weeks.',
      rating: 5,
      company: 'Now at Nestlé'
    },
    {
      name: 'Michael K.',
      role: 'Software Engineer',
      location: 'Basel',
      image: null,
      quote: 'The AI CV optimizer caught things I never would have. My interview callback rate went from 10% to over 60%.',
      rating: 5,
      company: 'Now at Roche'
    },
    {
      name: 'Anna L.',
      role: 'Finance Analyst',
      location: 'Geneva',
      image: null,
      quote: 'Finally, a platform that actually gets you jobs — not just helps you apply. The recruiter support is incredible.',
      rating: 5,
      company: 'Now at UBS'
    }
  ]

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0A120D]/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 px-5 py-2 text-sm bg-[#009444]/15 text-[#A8C531] border border-[#009444]/30">
            <Star className="w-4 h-4 mr-2" />
            Success Stories
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Real People, <span className="gradient-text">Real Jobs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands who&apos;ve landed their dream jobs with CVBoost + äsk us!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card3D className="h-full">
                <div className="relative p-8 rounded-2xl bg-[#0A120D] border border-[#1A2F22] hover:border-[#009444]/50 transition-all h-full">
                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-[#009444]/30 mb-4" />
                  
                  {/* Quote */}
                  <p className="text-lg mb-6 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#A8C531] text-[#A8C531]" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#009444] to-[#A8C531]" />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.location}</div>
                      <div className="text-sm text-[#A8C531]">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-6">Our candidates work at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {['Nestlé', 'UBS', 'Roche', 'Novartis', 'Credit Suisse', 'ABB'].map((company) => (
              <div key={company} className="text-xl font-bold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const [, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050A07]">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050A07]" />
        <AnimatedStripes />
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 radial-gradient" />
        
        {/* Floating orbs */}
        <motion.div
          className="orb orb-green w-[800px] h-[800px] -top-[200px] -left-[200px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="orb orb-lime w-[600px] h-[600px] top-[40%] -right-[150px]"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="orb orb-forest w-[500px] h-[500px] bottom-[10%] left-[20%]"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <FloatingParticles />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">CV<span className="gradient-text">Boost</span></span>
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase">powered by äsk us!</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors animated-underline">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors animated-underline">
                How it Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-white transition-colors animated-underline">
                Pricing
              </Link>
              <Link href="https://aesk.ch" target="_blank" className="text-sm text-muted-foreground hover:text-white transition-colors animated-underline flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                aesk.ch
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="sm" className="bg-gradient-to-r from-[#009444] to-[#00A84D] hover:from-[#00A84D] hover:to-[#4D9E56] text-white border-0 shadow-lg shadow-[#009444]/20">
                    Get Started Free
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <Badge className="mb-8 px-5 py-2 text-sm bg-[#009444]/15 text-[#A8C531] border border-[#009444]/30 backdrop-blur-sm">
                <Handshake className="w-4 h-4 mr-2" />
                12,000+ Swiss Professionals Placed • AI-Powered
              </Badge>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-hero font-bold tracking-tight mb-8 leading-[1.1]"
            >
              We Don&apos;t Just Build Resumes —{' '}
              <span className="relative inline-block">
                <span className="gradient-text animate-text-glow">We Land You Jobs</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#009444] via-[#A8C531] to-[#B5D334] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              AI-powered CVs that pass ATS systems. Professional headshots in seconds.{' '}
              <span className="text-[#A8C531]">Real Swiss recruiters</span>{' '}
              who open doors. Everything you need to get hired.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link href="/signup">
                <motion.div 
                  whileHover={{ scale: 1.03, y: -2 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="lg" className="h-16 px-10 text-lg bg-gradient-to-r from-[#009444] via-[#00A84D] to-[#4D9E56] hover:from-[#00A84D] hover:via-[#4D9E56] hover:to-[#A8C531] text-white border-0 glow-intense font-semibold group">
                    Get Matched With Jobs
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-[#1A2F22] hover:border-[#009444] hover:bg-[#009444]/10 group">
                  <Play className="mr-2 w-5 h-5 text-[#A8C531] group-hover:scale-110 transition-transform" />
                  See How It Works
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              variants={fadeInUp}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground"
            >
              {[
                { icon: CheckCircle2, text: 'Free AI tools — no credit card' },
                { icon: Briefcase, text: 'Real recruiter support' },
                { icon: Shield, text: 'Swiss data protection' },
              ].map((item, i) => (
                <motion.div 
                  key={item.text}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <item.icon className="w-4 h-4 text-[#A8C531]" />
                  {item.text}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual - Value Props Grid */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-24 relative max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: 'AI That Actually Works',
                  description: 'Not generic templates. Our AI tailors every bullet point to the exact job you want.',
                  color: 'from-[#009444] to-[#00A84D]'
                },
                {
                  icon: UserCheck,
                  title: 'Real Swiss Recruiters',
                  description: 'We don\'t just hand you a PDF. Our recruiters actively pitch you to hiring managers.',
                  color: 'from-[#4D9E56] to-[#A8C531]'
                },
                {
                  icon: Building2,
                  title: 'Jobs You Won\'t Find',
                  description: 'Access exclusive roles from our employer network that never make it to job boards.',
                  color: 'from-[#A8C531] to-[#B5D334]'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card3D className="h-full">
                    <div className="relative p-8 rounded-2xl bg-[#0A120D] border border-[#1A2F22] hover:border-[#009444]/50 transition-all h-full card-hover overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#009444]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.div 
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <item.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#A8C531] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>
            
            {/* Floating badges */}
            <motion.div
              className="absolute -top-6 -right-6 md:right-10 px-4 py-2 bg-[#0A120D] border border-[#009444]/30 rounded-xl shadow-lg backdrop-blur-sm"
              animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-[#A8C531]" />
                <span className="text-white font-medium">89% Interview Rate</span>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 md:left-10 px-4 py-2 bg-[#0A120D] border border-[#A8C531]/30 rounded-xl shadow-lg backdrop-blur-sm"
              animate={{ y: [0, 8, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-[#A8C531]" />
                <span className="text-white font-medium">CHF 95K Avg Salary</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Two Paths Section */}
      <TwoPathsSection />

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-[#1A2F22]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm text-muted-foreground uppercase tracking-widest">
              Trusted by professionals across Switzerland
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            {[
              { value: '12K+', label: 'Jobs Filled', icon: Briefcase },
              { value: '89%', label: 'Get Interviews', icon: TrendingUp },
              { value: '4.9', label: '"They actually got me hired"', icon: Star, suffix: '★' },
              { value: '95K', label: 'Average Salary (CHF)', icon: Award, prefix: 'CHF ' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#009444]/10 mb-4 group-hover:bg-[#009444]/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-7 h-7 text-[#A8C531]" />
                </motion.div>
                <div className="text-4xl md:text-5xl font-bold gradient-text-static">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Photo Enhancer Section */}
      <div id="ai-photo">
        <PhotoUploadSection />
      </div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* How it Works Section */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 px-5 py-2 text-sm bg-[#009444]/15 text-[#A8C531] border border-[#009444]/30">
              Your Journey
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              From Upload to <span className="gradient-text">Employment</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three steps to your dream job
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#009444] via-[#A8C531] to-[#B5D334] opacity-30" />
            
            {[
              {
                step: '01',
                icon: Sparkles,
                title: 'Boost Your Profile',
                description: 'AI optimizes your CV for ATS systems. Get a professional headshot instantly. Stand out from day one.',
                gradient: 'from-[#0D3B22] to-[#009444]'
              },
              {
                step: '02',
                icon: Users,
                title: 'Get Discovered',
                description: 'Enter our talent pool seen by top Swiss employers. Our recruiters review your profile and match you with opportunities.',
                gradient: 'from-[#009444] to-[#4D9E56]'
              },
              {
                step: '03',
                icon: Rocket,
                title: 'Land The Job',
                description: 'Our recruiters personally pitch you to hiring managers. Get interview prep. Start your new career.',
                gradient: 'from-[#4D9E56] to-[#A8C531]'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                <Card3D className="h-full">
                  <div className="relative p-8 rounded-2xl bg-[#0A120D] border border-[#1A2F22] group-hover:border-[#009444]/50 transition-all duration-500 h-full card-hover">
                    {/* Step number */}
                    <div className="absolute -top-5 left-8 text-7xl font-bold text-[#009444]/10 group-hover:text-[#009444]/20 transition-colors">
                      {item.step}
                    </div>
                    
                    {/* Icon */}
                    <motion.div 
                      className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#A8C531] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0A120D]/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 px-5 py-2 text-sm bg-[#009444]/15 text-[#A8C531] border border-[#009444]/30">
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="gradient-text">Get Hired</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI tools + Human expertise = Your dream job
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'ATS Optimization',
                description: 'Beat applicant tracking systems with perfectly formatted, keyword-rich resumes that get noticed.',
                gradient: 'from-[#A8C531] to-[#B5D334]'
              },
              {
                icon: Camera,
                title: 'AI Professional Headshots',
                description: 'Transform any photo into a LinkedIn-ready professional headshot. No photographer needed.',
                gradient: 'from-[#009444] to-[#00A84D]'
              },
              {
                icon: Briefcase,
                title: 'Recruiter Matching',
                description: 'Get matched with dedicated recruiters from äsk us! who actively pitch you to employers.',
                gradient: 'from-[#4D9E56] to-[#6B8F4D]'
              },
              {
                icon: Clock,
                title: '60-Second Generation',
                description: 'Get your optimized resume in under a minute, not hours of manual editing.',
                gradient: 'from-[#00A84D] to-[#4D9E56]'
              },
              {
                icon: Building2,
                title: 'Hidden Job Access',
                description: 'Access exclusive opportunities from our employer network that never hit job boards.',
                gradient: 'from-[#6B8F4D] to-[#A8C531]'
              },
              {
                icon: Target,
                title: 'Interview Preparation',
                description: 'Get coached by our recruiters on how to ace interviews for your specific role.',
                gradient: 'from-[#0D3B22] to-[#009444]'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card3D className="h-full">
                  <div className="group p-8 rounded-2xl bg-[#0A120D] border border-[#1A2F22] hover:border-[#009444]/50 transition-all duration-500 h-full card-hover">
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#A8C531] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 px-5 py-2 text-sm bg-[#009444]/15 text-[#A8C531] border border-[#009444]/30">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Choose Your{' '}
              <span className="gradient-text">Career Path</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you&apos;re ready for more firepower.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Explorer Tier */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
            >
              <Card3D className="h-full">
                <div className="relative p-8 rounded-2xl bg-[#0A120D] border border-[#1A2F22] h-full">
                  <h3 className="text-2xl font-bold mb-2">Explorer</h3>
                  <p className="text-muted-foreground text-sm mb-6">Test the waters</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">CHF 0</span>
                    <span className="text-muted-foreground">/forever</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {['1 CV generation', '1 AI headshot', 'All templates', 'PDF download', 'ATS score'].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#A8C531] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block">
                    <Button variant="outline" className="w-full h-12 border-[#1A2F22] hover:border-[#009444] hover:bg-[#009444]/10">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </Card3D>
            </motion.div>

            {/* Job Seeker Tier */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:-mt-4 md:mb-4"
            >
              <Card3D className="h-full">
                <div className="relative p-8 rounded-2xl gradient-border gradient-border-animated glow-intense h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#009444] to-[#A8C531] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Job Seeker</h3>
                  <p className="text-muted-foreground text-sm mb-6">Active search mode</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold gradient-text-static">CHF 29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {[
                      'Unlimited CV generations',
                      '5 AI headshots/month',
                      'All premium templates',
                      'PDF & DOCX download',
                      'ATS score & detailed tips',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#A8C531] shrink-0" />
                        {feature}
                      </li>
                    ))}
                    <li className="flex items-center gap-3 text-sm font-semibold text-[#A8C531]">
                      <Briefcase className="w-5 h-5 text-[#A8C531] shrink-0" />
                      Recruiter Access from äsk us!
                    </li>
                  </ul>
                  <Link href="/signup?plan=jobseeker" className="block">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full h-12 bg-gradient-to-r from-[#009444] to-[#A8C531] hover:from-[#00A84D] hover:to-[#B5D334] text-white font-semibold border-0">
                        Start 7-Day Trial
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </Card3D>
            </motion.div>

            {/* Career Accelerator Tier */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card3D className="h-full">
                <div className="relative p-8 rounded-2xl bg-[#0A120D] border border-[#1A2F22] h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#1A2F22] text-[#A8C531] text-xs font-medium rounded-full flex items-center gap-1 border border-[#009444]/30">
                    <Crown className="w-3 h-3" />
                    Premium
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Career Accelerator</h3>
                  <p className="text-muted-foreground text-sm mb-6">Fast-track your career</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">CHF 49</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {[
                      'Everything in Job Seeker',
                      'Unlimited AI headshots',
                      'AI cover letters',
                      'LinkedIn optimization',
                      'Interview coaching',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#A8C531] shrink-0" />
                        {feature}
                      </li>
                    ))}
                    <li className="flex items-center gap-3 text-sm font-semibold text-[#A8C531]">
                      <Briefcase className="w-5 h-5 text-[#A8C531] shrink-0" />
                      Priority Job Placement
                    </li>
                  </ul>
                  <Link href="/signup?plan=accelerator" className="block">
                    <Button variant="outline" className="w-full h-12 border-[#1A2F22] hover:border-[#009444] hover:bg-[#009444]/10">
                      Start Premium Trial
                    </Button>
                  </Link>
                </div>
              </Card3D>
            </motion.div>
          </div>

          {/* Recruiter Access Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="relative p-8 rounded-2xl bg-gradient-to-r from-[#009444]/10 via-[#4D9E56]/10 to-[#A8C531]/10 border border-[#009444]/30">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009444] to-[#A8C531] flex items-center justify-center shrink-0">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">🎯 Included: Real Recruiter Access</h3>
                  <p className="text-muted-foreground">
                    Your profile enters our talent pool. Swiss employers search for candidates like you. 
                    Our recruiters actively pitch you for roles. <span className="text-[#A8C531]">This alone is worth CHF 500+ at other agencies.</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 askus-stripes" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#009444]/30 via-[#0A120D]/90 to-[#A8C531]/20" />
            <div className="absolute inset-0 noise" />
            
            <div className="relative text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Ready to Land Your{' '}
                  <span className="gradient-text">Dream Job</span>?
                </h2>
              </motion.div>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join 12,000+ professionals who&apos;ve found their next opportunity with CVBoost + äsk us!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -2 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-[#009444] to-[#A8C531] hover:from-[#00A84D] hover:to-[#B5D334] text-white border-0 glow-intense font-semibold">
                      Get Started Free
                      <Rocket className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="https://aesk.ch" target="_blank">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/20 hover:border-[#A8C531] hover:bg-[#A8C531]/10">
                      Learn About äsk us!
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1A2F22]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">CV<span className="gradient-text">Boost</span></span>
                  <span className="text-[10px] text-muted-foreground tracking-wider uppercase">powered by äsk us!</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                AI-powered career tools + real Swiss recruiters. We don&apos;t just help you apply — we help you get hired.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-red-600 relative">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-white" />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-white" />
                </div>
                <span className="text-xs text-muted-foreground">Made in Switzerland</span>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-[#A8C531] transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-[#A8C531] transition-colors">Pricing</Link></li>
                <li><Link href="#ai-photo" className="hover:text-[#A8C531] transition-colors">AI Photo</Link></li>
                <li><Link href="#" className="hover:text-[#A8C531] transition-colors">Templates</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="https://aesk.ch" target="_blank" className="hover:text-[#A8C531] transition-colors">About äsk us!</Link></li>
                <li><Link href="https://aesk.ch" target="_blank" className="hover:text-[#A8C531] transition-colors">Careers</Link></li>
                <li><Link href="https://aesk.ch" target="_blank" className="hover:text-[#A8C531] transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-[#A8C531] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#A8C531] transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-[#A8C531] transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#1A2F22] flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CVBoost by äsk us! AG. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-[#A8C531] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-[#A8C531] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="https://instagram.com" target="_blank" className="text-muted-foreground hover:text-[#A8C531] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
