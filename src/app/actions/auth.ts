'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function createProfileAfterSignup(userId: string, email: string, fullName: string) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const admin = createAdminClient()
    await admin.from('profiles').upsert(
      { id: userId, email, full_name: fullName, role: 'user', is_active: true },
      { onConflict: 'id' }
    )
  } catch {
    // perfil será criado no primeiro login pelo layout
  }
}
