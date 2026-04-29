'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/profile'
import type { Profile } from '@/types'

interface Props {
  profile: Profile
}

export function ProfileForm({ profile }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    await updateProfile(formData)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Dados pessoais</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-800 mb-1">Nome completo *</label>
          <input
            type="text"
            name="name"
            defaultValue={profile.name ?? ''}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">CNPJ / CPF</label>
          <input
            type="text"
            name="cnpj"
            defaultValue={profile.cnpj ?? ''}
            placeholder="00.000.000/0000-00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Telefone / WhatsApp</label>
          <input
            type="tel"
            name="phone"
            defaultValue={profile.phone ?? ''}
            placeholder="(00) 00000-0000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-800 mb-1">Endereço</label>
          <input
            type="text"
            name="address"
            defaultValue={profile.address ?? ''}
            placeholder="Rua, número, complemento, cidade - UF"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#307ca8] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#256690] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : 'Salvar cadastro'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">✓ Salvo com sucesso</span>
        )}
      </div>
    </form>
  )
}
