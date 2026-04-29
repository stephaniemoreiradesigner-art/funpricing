'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface MonthlyBar {
  month: string
  orcamentos: number
  propostas: number
  valor: number
}

interface StatusSlice {
  name: string
  value: number
  color: string
}

interface Props {
  monthly: MonthlyBar[]
  proposalsByStatus: StatusSlice[]
  contractsByStatus: StatusSlice[]
}

const BRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

const BRAND = '#307ca8'

export function StatsCharts({ monthly, proposalsByStatus, contractsByStatus }: Props) {
  return (
    <div className="space-y-6">
      {/* Atividade mensal */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Atividade dos últimos 6 meses</h3>
        <p className="text-xs text-gray-400 mb-5">Orçamentos e propostas criados por mês</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthly} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              cursor={{ fill: '#f9fafb' }}
            />
            <Bar dataKey="orcamentos" name="Orçamentos" fill={BRAND} radius={[4, 4, 0, 0]} />
            <Bar dataKey="propostas" name="Propostas" fill="#93c5fd" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Valor em propostas por mês */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Valor em propostas</h3>
          <p className="text-xs text-gray-400 mb-5">Total mensal das propostas criadas</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v) => [BRL(Number(v)), 'Valor']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Bar dataKey="valor" name="Valor" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pizza: propostas por status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Propostas por status</h3>
          <p className="text-xs text-gray-400 mb-5">Distribuição atual</p>
          {proposalsByStatus.every((s) => s.value === 0) ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">
              Nenhuma proposta ainda.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={proposalsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={72}
                  innerRadius={40}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {proposalsByStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [Number(v), 'propostas']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pizza: contratos por status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Contratos por status</h3>
        <p className="text-xs text-gray-400 mb-5">Distribuição atual dos contratos</p>
        {contractsByStatus.every((s) => s.value === 0) ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            Nenhum contrato ainda.
          </div>
        ) : (
          <div className="flex items-center justify-center gap-8">
            {contractsByStatus.map((s) => (
              <div key={s.name} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold"
                  style={{ backgroundColor: s.color }}
                >
                  {s.value}
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">{s.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
