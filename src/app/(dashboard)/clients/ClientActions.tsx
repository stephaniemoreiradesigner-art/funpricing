'use client'

import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteClientAction } from '@/app/actions/clients'
import type { Client } from '@/types'

export function ClientActions({ client }: { client: Client }) {
  async function handleDelete() {
    if (!confirm(`Excluir "${client.razao_social}"? Esta ação não pode ser desfeita.`)) return
    await deleteClientAction(client.id)
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={`/clients/${client.id}`}
        className="text-gray-400 hover:text-[#307ca8] transition-colors"
        title="Editar"
      >
        <Pencil size={15} />
      </Link>
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500 transition-colors"
        title="Excluir"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
