'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const payload = {
    id: user!.id,
    name: formData.get('name') as string,
    phone: (formData.get('phone') as string) || null,
    address: (formData.get('address') as string) || null,
    cnpj: (formData.get('cnpj') as string) || null,
  }

  // upsert garante que funciona mesmo sem registro de perfil existente
  await supabase.from('profiles').upsert(payload, { onConflict: 'id' })

  revalidatePath('/settings')
}
