'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, TrendingUp, Star, Users } from 'lucide-react'

// Animated stripes component
function AnimatedStripes() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        className="absolute inset-0 flex"
        initial={{ x: '-50%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(30)].map((_, i) => {
          const colors = [
            'bg-[#0D3B22]', 'bg-[#143D28]', 'bg-[#009444]', 'bg-[#00A84D]',
            'bg-[#4D9E56]', 'bg-[#6B8F4D]', 'bg-[#7A9A50]', 'bg-[#A8C531]', 'bg-[#B5D334]'
          ]
          return (
            <motion.div
              key={i}
              className={`h-full w-[60px] ${colors[i % colors.length]}`}
              style={{ opacity: 0.5 }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-[#050A07]">
      {/* Left side - Branding with äsk us! colors */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated stripe background */}
        <AnimatedStripes />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D3B22]/90 via-[#050A07]/70 to-transparent" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#009444]/20 blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#A8C531]/20 blur-[100px]"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">CV<span className="gradient-text">Boost</span></span>
              <span className="text-xs text-white/60 tracking-wider uppercase">powered by äsk us!</span>
            </div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Transform Your Resume<br />
              <span className="gradient-text">Into a Job Magnet</span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Our Swiss-precision AI analyzes job descriptions and optimizes your CV to beat 
              applicant tracking systems and land more interviews.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 mb-10"
          >
            {[
              'AI-powered resume optimization',
              'Beat ATS systems with 94% success rate',
              'Multiple professional templates',
              'Swiss data protection standards'
            ].map((feature, index) => (
              <motion.div 
                key={feature}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-[#A8C531]" />
                <span className="text-white/80">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-[#0A120D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#009444]/30"
          >
            <p className="text-white/90 italic mb-4">
              "CVBoost helped me land 3 interviews in my first week of job searching. 
              The ATS optimization made all the difference!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#009444] to-[#A8C531]" />
              <div>
                <p className="text-white font-medium">Marco Müller</p>
                <p className="text-white/50 text-sm">Software Engineer at ABB</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { value: '50K+', label: 'Resumes Optimized', icon: TrendingUp },
              { value: '89%', label: 'Success Rate', icon: Users },
              { value: '4.9★', label: 'User Rating', icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text-static">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#050A07]">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
