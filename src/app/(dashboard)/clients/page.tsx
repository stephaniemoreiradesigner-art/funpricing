import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ClientActions } from './ClientActions'
import type { Client } from '@/types'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  const isAdmin = profile?.role === 'admin'

  let query = supabase.from('clients').select('*').order('razao_social')
  if (!isAdmin) query = query.eq('created_by', user!.id)

  const { data: clients } = await query

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin ? 'Todos os clientes cadastrados.' : 'Seus clientes cadastrados.'}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="flex items-center gap-2 bg-[#307ca8] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#256690] transition-colors"
        >
          <Plus size={16} />
          Novo cliente
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!clients || clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users size={36} className="text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">Nenhum cliente cadastrado</p>
            <p className="text-xs text-gray-400 mt-1">Comece adicionando seu primeiro cliente.</p>
            <Link
              href="/clients/new"
              className="mt-4 bg-[#307ca8] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#256690] transition-colors"
            >
              + Novo cliente
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-medium">Empresa</th>
                <th className="text-left px-6 py-3 font-medium">Responsável</th>
                <th className="text-left px-6 py-3 font-medium">Contato</th>
                <th className="text-left px-6 py-3 font-medium">Cidade / UF</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {(clients as Client[]).map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{client.razao_social}</p>
                    {client.nome_fantasia && (
                      <p className="text-xs text-gray-400 mt-0.5">{client.nome_fantasia}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {client.responsible ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-0.5">
                      {client.phone && <p>{client.phone}</p>}
                      {client.email && <p className="text-xs">{client.email}</p>}
                      {!client.phone && !client.email && '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {client.city && client.state
                      ? `${client.city} / ${client.state}`
                      : client.city || client.state || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <ClientActions client={client} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
