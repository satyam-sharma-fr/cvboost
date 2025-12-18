'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  CreditCard,
  Menu,
  X,
  Plus,
  Zap,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Profile } from '@/types'

interface DashboardNavProps {
  user: Profile | null
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/cvs', label: 'My CVs', icon: FileText },
    { href: '/pricing', label: 'Upgrade', icon: CreditCard },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">CV<span className="gradient-text">Boost</span></span>
              <span className="text-[9px] text-muted-foreground tracking-wider uppercase hidden sm:block">powered by äsk us!</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 ${
                    isActive(item.href) 
                      ? 'bg-[#009444]/10 text-[#A8C531] border border-[#009444]/30' 
                      : 'text-muted-foreground hover:text-white hover:bg-[#009444]/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="https://aesk.ch" target="_blank">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-muted-foreground hover:text-[#A8C531]"
              >
                <Globe className="w-4 h-4" />
                aesk.ch
              </Button>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Credits Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A120D] border border-[#1A2F22]">
              <Zap className="w-4 h-4 text-[#A8C531]" />
              <span className="text-sm font-medium text-white">
                {user?.subscription_tier === 'free' 
                  ? `${user?.credits_remaining || 0} credit${user?.credits_remaining !== 1 ? 's' : ''}`
                  : 'Unlimited'
                }
              </span>
            </div>

            {/* Create CV Button */}
            <Link href="/create">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-gradient-to-r from-[#009444] to-[#00A84D] hover:from-[#00A84D] hover:to-[#4D9E56] text-white border-0 shadow-lg shadow-[#009444]/20">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Create CV</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </motion.div>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-[#009444]/30">
                    <AvatarImage src={user?.avatar_url || undefined} alt={user?.full_name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-[#009444] to-[#A8C531] text-white font-bold">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#0A120D] border-[#1A2F22]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user?.full_name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#1A2F22]" />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Badge 
                    className={`${
                      user?.subscription_tier === 'premium' 
                        ? 'bg-gradient-to-r from-[#A8C531] to-[#B5D334] text-[#0D3B22]'
                        : user?.subscription_tier === 'paid'
                        ? 'bg-gradient-to-r from-[#009444] to-[#00A84D] text-white'
                        : 'bg-[#1A2F22] text-[#A8C531] border border-[#009444]/30'
                    }`}
                  >
                    {user?.subscription_tier?.toUpperCase() || 'FREE'} PLAN
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1A2F22]" />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-white">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-400 focus:text-red-400 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-[#1A2F22] bg-[#050A07]"
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${
                    isActive(item.href) 
                      ? 'bg-[#009444]/10 text-[#A8C531]' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link 
              href="https://aesk.ch" 
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground"
              >
                <Globe className="w-4 h-4" />
                Visit aesk.ch
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
