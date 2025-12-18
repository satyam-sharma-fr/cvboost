import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CVResultClient from './CVResultClient'

interface CVPageProps {
  params: Promise<{ id: string }>
}

export default async function CVPage({ params }: CVPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the generated CV
  const { data: cv, error } = await supabase
    .from('generated_cvs')
    .select('*, documents(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !cv) {
    notFound()
  }

  return <CVResultClient cv={cv} />
}


