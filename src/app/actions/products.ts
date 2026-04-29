'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface LaborItem { labor_id: string; hours: number }
interface ToolItem { name: string; monthly_cost: number }

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      is_active: formData.get('is_active') === 'true',
    })
    .select()
    .single()

  if (error || !product) throw error

  const laborItems: LaborItem[] = JSON.parse(formData.get('labor_items') as string || '[]')
  const toolItems: ToolItem[] = JSON.parse(formData.get('tool_items') as string || '[]')

  if (laborItems.length > 0) {
    await supabase.from('product_labor').insert(
      laborItems.map((item) => ({
        product_id: product.id,
        labor_id: item.labor_id,
        hours_allocated: item.hours,
      }))
    )
  }

  if (toolItems.length > 0) {
    await supabase.from('product_tools').insert(
      toolItems.map((item) => ({
        product_id: product.id,
        name: item.name,
        monthly_cost: item.monthly_cost,
      }))
    )
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  await supabase.from('products').update({
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id)

  await supabase.from('product_labor').delete().eq('product_id', id)
  await supabase.from('product_tools').delete().eq('product_id', id)

  const laborItems: LaborItem[] = JSON.parse(formData.get('labor_items') as string || '[]')
  const toolItems: ToolItem[] = JSON.parse(formData.get('tool_items') as string || '[]')

  if (laborItems.length > 0) {
    await supabase.from('product_labor').insert(
      laborItems.map((item) => ({
        product_id: id,
        labor_id: item.labor_id,
        hours_allocated: item.hours,
      }))
    )
  }

  if (toolItems.length > 0) {
    await supabase.from('product_tools').insert(
      toolItems.map((item) => ({
        product_id: id,
        name: item.name,
        monthly_cost: item.monthly_cost,
      }))
    )
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  await supabase.from('product_labor').delete().eq('product_id', id)
  await supabase.from('product_tools').delete().eq('product_id', id)
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  await supabase.from('products').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/admin/products')
}
