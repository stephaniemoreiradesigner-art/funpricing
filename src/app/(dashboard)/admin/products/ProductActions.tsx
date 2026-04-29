'use client'

import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteProduct } from '@/app/actions/products'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export function ProductActions({ product }: Props) {
  async function handleDelete() {
    if (!confirm(`Excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`)) return
    await deleteProduct(product.id)
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={`/admin/products/${product.id}`}
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
