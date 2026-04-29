'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { UserRole } from '@/types'

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient()
  await supabase.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  const admin = createAdminClient()
  await admin.auth.admin.deleteUser(userId)
  revalidatePath('/admin/users')
}

export async function inviteUser(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const role = (formData.get('role') as UserRole) ?? 'user'

  const admin = createAdminClient()
  const supabase = await createClient()

  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { name },
  })

  if (error || !data.user) throw error

  await supabase.from('profiles').upsert({
    id: data.user.id,
    name,
    role,
  })

  revalidatePath('/admin/users')
}
