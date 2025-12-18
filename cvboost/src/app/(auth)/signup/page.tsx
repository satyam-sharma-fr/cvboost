'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, User, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Check your email to confirm your account!')
      router.push('/login?message=Check your email to confirm your account')
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('provider is not enabled')) {
          toast.error('Google sign-up is not yet configured. Please use email signup.')
        } else {
          toast.error(error.message)
        }
        setIsGoogleLoading(false)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
      setIsGoogleLoading(false)
    }
  }

  const passwordStrength = () => {
    if (password.length === 0) return { score: 0, label: '', color: '' }
    if (password.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (password.length < 8) return { score: 2, label: 'Fair', color: 'bg-yellow-500' }
    if (password.length < 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { score: 3, label: 'Good', color: 'bg-[#A8C531]' }
    }
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { score: 4, label: 'Strong', color: 'bg-[#009444]' }
    }
    return { score: 2, label: 'Fair', color: 'bg-yellow-500' }
  }

  const strength = passwordStrength()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile logo */}
      <div className="lg:hidden text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-white">CV<span className="gradient-text">Boost</span></span>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">powered by äsk us!</span>
          </div>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Create your account</h1>
        <p className="text-muted-foreground">
          Start optimizing your resume for free
        </p>
      </div>

      {/* Benefits */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 p-4 rounded-xl bg-[#009444]/10 border border-[#009444]/30"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#A8C531]" />
          <span className="text-sm font-medium text-[#A8C531]">Free trial includes:</span>
        </div>
        <div className="space-y-2 text-sm">
          {[
            '1 free CV optimization',
            'All professional templates',
            'ATS compatibility score',
          ].map((benefit, index) => (
            <motion.div 
              key={benefit} 
              className="flex items-center gap-2 text-white/80"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <CheckCircle2 className="w-4 h-4 text-[#A8C531]" />
              {benefit}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Google Sign Up */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          variant="outline"
          className="w-full h-12 text-base border-[#1A2F22] hover:border-[#009444] hover:bg-[#009444]/10 bg-[#0A120D]"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </motion.div>

      <div className="relative my-8">
        <Separator className="bg-[#1A2F22]" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050A07] px-4 text-sm text-muted-foreground">
          or continue with email
        </span>
      </div>

      {/* Email Sign Up Form */}
      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-10 h-12 bg-[#0A120D] border-[#1A2F22] focus:border-[#009444] focus:ring-[#009444]/20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-[#0A120D] border-[#1A2F22] focus:border-[#009444] focus:ring-[#009444]/20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12 bg-[#0A120D] border-[#1A2F22] focus:border-[#009444] focus:ring-[#009444]/20"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {password.length > 0 && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <motion.div
                    key={level}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: level <= strength.score ? 1 : 1 }}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      level <= strength.score ? strength.color : 'bg-[#1A2F22]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: <span className={`font-medium ${
                  strength.score >= 3 ? 'text-[#A8C531]' : 
                  strength.score >= 2 ? 'text-yellow-500' : 'text-red-500'
                }`}>{strength.label}</span>
              </p>
            </motion.div>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="submit"
            className="w-full h-12 text-base bg-gradient-to-r from-[#009444] to-[#00A84D] hover:from-[#00A84D] hover:to-[#4D9E56] text-white border-0 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </motion.div>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        By signing up, you agree to our{' '}
        <Link href="/terms" className="text-[#A8C531] hover:text-[#B5D334] transition-colors">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-[#A8C531] hover:text-[#B5D334] transition-colors">
          Privacy Policy
        </Link>
      </p>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link 
          href="/login" 
          className="text-[#A8C531] hover:text-[#B5D334] transition-colors font-medium"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
