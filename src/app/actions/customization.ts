'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveCustomization(formData: FormData) {
  const supabase = await createClient()

  const payload = {
    company_name: formData.get('company_name') as string,
    logo_url: (formData.get('logo_url') as string) || null,
    brand_color: formData.get('brand_color') as string,
    updated_at: new Date().toISOString(),
  }

  const { data: existing } = await supabase
    .from('customization')
    .select('id')
    .maybeSingle()

  if (existing) {
    await supabase.from('customization').update(payload).eq('id', existing.id)
  } else {
    await supabase.from('customization').insert(payload)
  }

  revalidatePath('/admin/customization')
}
