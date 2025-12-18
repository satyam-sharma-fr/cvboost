import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CVsListClient from './CVsListClient'

export default async function CVsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all generated CVs
  const { data: cvs } = await supabase
    .from('generated_cvs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <CVsListClient cvs={cvs || []} />
}


