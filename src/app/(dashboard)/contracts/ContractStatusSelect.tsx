'use client'

import { useState } from 'react'
import { updateContractStatus } from '@/app/actions/contracts'
import type { ContractStatus } from '@/types'

const STATUS_OPTIONS: { value: ContractStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pendente', color: 'bg-amber-50 text-amber-700' },
  { value: 'signed', label: 'Assinado', color: 'bg-blue-50 text-blue-700' },
  { value: 'completed', label: 'Concluído', color: 'bg-green-50 text-green-700' },
]

interface Props {
  id: string
  currentStatus: ContractStatus
}

export function ContractStatusSelect({ id, currentStatus }: Props) {
  const [status, setStatus] = useState<ContractStatus>(currentStatus)
  const [saving, setSaving] = useState(false)

  const current = STATUS_OPTIONS.find((o) => o.value === status)

  async function handleChange(next: ContractStatus) {
    if (next === status) return
    setSaving(true)
    setStatus(next)
    await updateContractStatus(id, next)
    setSaving(false)
  }

  return (
    <div className="relative inline-block">
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as ContractStatus)}
        className={`appearance-none text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#307ca8] disabled:opacity-60 ${current?.color}`}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
