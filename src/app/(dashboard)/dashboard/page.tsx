import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/calculations'
import { FileText, Send, FileSignature, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  const isAdmin = profile?.role === 'admin'

  const filter = isAdmin ? {} : { created_by: user!.id }

  const [
    { count: quotesCount },
    { count: proposalsCount },
    { count: contractsCount },
  ] = await Promise.all([
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('proposals').select('*', { count: 'exact', head: true }),
    supabase.from('contracts').select('*', { count: 'exact', head: true }),
  ])

  const cards = [
    {
      label: 'Orçamentos',
      value: quotesCount ?? 0,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      href: '/quotes',
    },
    {
      label: 'Propostas',
      value: proposalsCount ?? 0,
      icon: Send,
      color: 'bg-cyan-50 text-cyan-600',
      href: '/proposals',
    },
    {
      label: 'Contratos',
      value: contractsCount ?? 0,
      icon: FileSignature,
      color: 'bg-green-50 text-green-600',
      href: '/contracts',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Resumo do mês</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{String(card.value).padStart(2, '0')}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-[#307ca8]" />
          <h3 className="font-semibold text-gray-900">Ações rápidas</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/quotes/new"
            className="bg-[#307ca8] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#256690] transition-colors"
          >
            + Novo orçamento
          </a>
          <a
            href="/clients/new"
            className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            + Novo cliente
          </a>
        </div>
      </div>
    </div>
  )
}
