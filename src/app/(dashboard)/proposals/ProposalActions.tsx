'use client'

import Link from 'next/link'
import { Eye, Trash2 } from 'lucide-react'
import { deleteProposal } from '@/app/actions/proposals'

interface Props {
  proposalId: string
}

export function ProposalActions({ proposalId }: Props) {
  async function handleDelete() {
    if (!confirm('Excluir esta proposta? Esta ação não pode ser desfeita.')) return
    await deleteProposal(proposalId)
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={`/proposals/${proposalId}`}
        className="text-gray-400 hover:text-[#307ca8] transition-colors"
        title="Ver proposta"
      >
        <Eye size={15} />
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
