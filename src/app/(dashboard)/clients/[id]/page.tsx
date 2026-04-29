import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientForm } from '../ClientForm'
import type { Client } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditClientPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/clients" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editar cliente</h2>
          <p className="text-sm text-gray-500 mt-0.5">{client.razao_social}</p>
        </div>
      </div>

      <ClientForm client={client as Client} />
    </div>
  )
}
