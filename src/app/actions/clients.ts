'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function extractClientPayload(formData: FormData) {
  return {
    razao_social: formData.get('razao_social') as string,
    nome_fantasia: (formData.get('nome_fantasia') as string) || null,
    cnpj: (formData.get('cnpj') as string) || null,
    ie: (formData.get('ie') as string) || null,
    im: (formData.get('im') as string) || null,
    address: (formData.get('address') as string) || null,
    city: (formData.get('city') as string) || null,
    zip: (formData.get('zip') as string) || null,
    state: (formData.get('state') as string) || null,
    responsible: (formData.get('responsible') as string) || null,
    phone: (formData.get('phone') as string) || null,
    email: (formData.get('email') as string) || null,
  }
}

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('clients').insert({
    ...extractClientPayload(formData),
    created_by: user!.id,
  })

  revalidatePath('/clients')
  redirect('/clients')
}

export async function updateClientAction(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  await supabase.from('clients').update(extractClientPayload(formData)).eq('id', id)

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  redirect('/clients')
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient()
  await supabase.from('clients').delete().eq('id', id)
  revalidatePath('/clients')
}

export async function importClientsCSV(
  rows: Array<{
    razao_social: string
    nome_fantasia?: string | null
    cnpj?: string | null
    ie?: string | null
    im?: string | null
    responsible?: string | null
    phone?: string | null
    email?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
  }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const records = rows.map((row) => ({ ...row, created_by: user!.id }))
  await supabase.from('clients').insert(records)
  revalidatePath('/clients')
}
