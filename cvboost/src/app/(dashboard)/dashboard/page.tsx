import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch recent generated CVs
  const { data: recentCVs } = await supabase
    .from('generated_cvs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch total count
  const { count: totalCVs } = await supabase
    .from('generated_cvs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <DashboardClient 
      profile={profile} 
      recentCVs={recentCVs || []} 
      totalCVs={totalCVs || 0} 
    />
  )
}


