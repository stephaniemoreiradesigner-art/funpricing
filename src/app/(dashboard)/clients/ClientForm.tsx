'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientAction, updateClientAction } from '@/app/actions/clients'
import type { Client } from '@/types'

const BRAZIL_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

interface Props {
  client?: Client
}

export function ClientForm({ client }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    if (client) {
      formData.set('id', client.id)
      await updateClientAction(formData)
    } else {
      await createClientAction(formData)
    }
    setSaving(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Dados da empresa */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Dados da empresa</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Razão social *" name="razao_social" defaultValue={client?.razao_social} required placeholder="Nome empresarial completo" />
          </div>
          <div className="sm:col-span-2">
            <Field label="Nome fantasia" name="nome_fantasia" defaultValue={client?.nome_fantasia ?? ''} placeholder="Nome comercial" />
          </div>
          <Field label="CNPJ" name="cnpj" defaultValue={client?.cnpj ?? ''} placeholder="00.000.000/0000-00" />
          <Field label="Inscrição Estadual" name="ie" defaultValue={client?.ie ?? ''} placeholder="IE" />
          <Field label="Inscrição Municipal" name="im" defaultValue={client?.im ?? ''} placeholder="IM" />
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Endereço</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Field label="Logradouro" name="address" defaultValue={client?.address ?? ''} placeholder="Rua, número, complemento" />
          </div>
          <Field label="CEP" name="zip" defaultValue={client?.zip ?? ''} placeholder="00000-000" />
          <div className="sm:col-span-2">
            <Field label="Cidade" name="city" defaultValue={client?.city ?? ''} placeholder="Cidade" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Estado</label>
            <select
              name="state"
              defaultValue={client?.state ?? ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
            >
              <option value="">—</option>
              {BRAZIL_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contato</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <Field label="Responsável" name="responsible" defaultValue={client?.responsible ?? ''} placeholder="Nome do responsável" />
          </div>
          <Field label="Telefone / WhatsApp" name="phone" defaultValue={client?.phone ?? ''} placeholder="(00) 00000-0000" type="tel" />
          <div className="sm:col-span-2">
            <Field label="E-mail" name="email" defaultValue={client?.email ?? ''} placeholder="contato@empresa.com" type="email" />
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#307ca8] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#256690] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : client ? 'Salvar alterações' : 'Cadastrar cliente'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/clients')}
          className="border border-gray-300 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = 'text',
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
      />
    </div>
  )
}
