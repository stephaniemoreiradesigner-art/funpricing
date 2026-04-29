'use client'

import Link from 'next/link'
import { Send, Trash2 } from 'lucide-react'
import { deleteQuote } from '@/app/actions/quotes'

interface Props {
  quoteId: string
  clientId: string | null
}

export function QuoteActions({ quoteId, clientId }: Props) {
  async function handleDelete() {
    if (!confirm('Excluir este orçamento? Esta ação não pode ser desfeita.')) return
    await deleteQuote(quoteId)
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={`/proposals/new?quote_id=${quoteId}`}
        className="flex items-center gap-1.5 text-xs text-[#307ca8] font-medium hover:text-[#256690] transition-colors"
        title="Gerar proposta"
      >
        <Send size={14} />
        Proposta
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
