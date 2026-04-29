'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('profiles').update({
    name: formData.get('name') as string,
    phone: (formData.get('phone') as string) || null,
    address: (formData.get('address') as string) || null,
    cnpj: (formData.get('cnpj') as string) || null,
  }).eq('id', user!.id)

  revalidatePath('/settings')
}
