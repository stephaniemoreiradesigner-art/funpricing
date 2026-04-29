'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { createProduct, updateProduct } from '@/app/actions/products'
import { formatCurrency } from '@/lib/calculations'
import type { Labor, Product, MarkupConfig } from '@/types'

interface LaborItem { tempId: string; labor_id: string; hours: number }
interface ToolItem { tempId: string; name: string; monthly_cost: number }

interface Props {
  product?: Product
  laborOptions: Labor[]
  markup: MarkupConfig | null
}

export function ProductForm({ product, laborOptions, markup }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [laborItems, setLaborItems] = useState<LaborItem[]>(
    product?.product_labor?.map((pl) => ({
      tempId: pl.id,
      labor_id: pl.labor_id,
      hours: pl.hours_allocated,
    })) ?? []
  )

  const [toolItems, setToolItems] = useState<ToolItem[]>(
    product?.product_tools?.map((pt) => ({
      tempId: pt.id,
      name: pt.name,
      monthly_cost: pt.monthly_cost,
    })) ?? []
  )

  const markupResult = markup?.markup_result ?? 1

  const laborCost = laborItems.reduce((sum, item) => {
    const labor = laborOptions.find((l) => l.id === item.labor_id)
    return sum + (labor?.hourly_rate ?? 0) * item.hours
  }, 0)

  const toolsCost = toolItems.reduce((sum, item) => sum + item.monthly_cost, 0)
  const totalPrice = laborCost * markupResult + toolsCost

  function addLabor() {
    setLaborItems((prev) => [
      ...prev,
      { tempId: crypto.randomUUID(), labor_id: laborOptions[0]?.id ?? '', hours: 0 },
    ])
  }

  function removeLabor(tempId: string) {
    setLaborItems((prev) => prev.filter((i) => i.tempId !== tempId))
  }

  function updateLaborField<K extends keyof LaborItem>(tempId: string, field: K, value: LaborItem[K]) {
    setLaborItems((prev) => prev.map((i) => i.tempId === tempId ? { ...i, [field]: value } : i))
  }

  function addTool() {
    setToolItems((prev) => [
      ...prev,
      { tempId: crypto.randomUUID(), name: '', monthly_cost: 0 },
    ])
  }

  function removeTool(tempId: string) {
    setToolItems((prev) => prev.filter((i) => i.tempId !== tempId))
  }

  function updateToolField<K extends keyof ToolItem>(tempId: string, field: K, value: ToolItem[K]) {
    setToolItems((prev) => prev.map((i) => i.tempId === tempId ? { ...i, [field]: value } : i))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Checkbox não aparece no FormData quando desmarcado
    formData.set('is_active', formData.get('is_active_check') === 'on' ? 'true' : 'false')
    formData.delete('is_active_check')

    formData.set('labor_items', JSON.stringify(
      laborItems.map(({ labor_id, hours }) => ({ labor_id, hours }))
    ))
    formData.set('tool_items', JSON.stringify(
      toolItems.map(({ name, monthly_cost }) => ({ name, monthly_cost }))
    ))

    if (product) {
      formData.set('id', product.id)
      await updateProduct(formData)
    } else {
      await createProduct(formData)
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações básicas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Informações básicas</h3>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Nome do produto *</label>
          <input
            type="text"
            name="name"
            defaultValue={product?.name ?? ''}
            required
            placeholder="Ex: Gestão de Redes Sociais"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Descrição</label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ''}
            placeholder="Descreva o que está incluso neste produto..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            name="is_active_check"
            defaultChecked={product?.is_active ?? true}
            className="w-4 h-4 accent-[#307ca8]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-800">
            Produto ativo (disponível para orçamentos)
          </label>
        </div>
      </div>

      {/* Mão de obra */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Mão de obra</h3>
            <p className="text-xs text-gray-400 mt-0.5">Horas mensais alocadas por profissional</p>
          </div>
          <button
            type="button"
            onClick={addLabor}
            disabled={laborOptions.length === 0}
            className="flex items-center gap-1.5 text-sm text-[#307ca8] font-medium hover:text-[#256690] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={15} />
            Adicionar
          </button>
        </div>

        {laborOptions.length === 0 && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            Nenhuma mão de obra cadastrada. Vá em <strong>Admin → Mão de Obra</strong> para cadastrar profissionais antes.
          </p>
        )}

        {laborItems.length === 0 && laborOptions.length > 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum profissional adicionado ainda.
          </p>
        )}

        <div className="space-y-2">
          {laborItems.map((item) => {
            const labor = laborOptions.find((l) => l.id === item.labor_id)
            const itemCost = (labor?.hourly_rate ?? 0) * item.hours * markupResult
            return (
              <div key={item.tempId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <select
                  value={item.labor_id}
                  onChange={(e) => updateLaborField(item.tempId, 'labor_id', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                >
                  {laborOptions.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} ({l.level === 'junior' ? 'Júnior' : l.level === 'pleno' ? 'Pleno' : 'Sênior'}) — {formatCurrency(l.hourly_rate)}/h
                    </option>
                  ))}
                </select>

                <div className="relative w-28">
                  <input
                    type="number"
                    value={item.hours}
                    min={0}
                    step={1}
                    onChange={(e) => updateLaborField(item.tempId, 'hours', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 pr-6 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">h</span>
                </div>

                <span className="text-sm text-gray-500 w-28 text-right shrink-0">
                  {formatCurrency(itemCost)}
                </span>

                <button
                  type="button"
                  onClick={() => removeLabor(item.tempId)}
                  className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ferramentas / assinaturas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ferramentas e assinaturas</h3>
            <p className="text-xs text-gray-400 mt-0.5">Custos mensais de ferramentas usadas neste produto</p>
          </div>
          <button
            type="button"
            onClick={addTool}
            className="flex items-center gap-1.5 text-sm text-[#307ca8] font-medium hover:text-[#256690] transition-colors"
          >
            <Plus size={15} />
            Adicionar
          </button>
        </div>

        {toolItems.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhuma ferramenta adicionada ainda.
          </p>
        )}

        <div className="space-y-2">
          {toolItems.map((item) => (
            <div key={item.tempId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateToolField(item.tempId, 'name', e.target.value)}
                placeholder="Ex: Adobe Creative Cloud"
                className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
              />
              <div className="relative w-36">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                <input
                  type="number"
                  value={item.monthly_cost}
                  min={0}
                  step={0.01}
                  onChange={(e) => updateToolField(item.tempId, 'monthly_cost', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => removeTool(item.tempId)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview de preço */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview de preço</h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Custo de mão de obra</span>
            <span>{formatCurrency(laborCost)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Markup aplicado ({markupResult.toFixed(4)}×)</span>
            <span>{formatCurrency(laborCost * markupResult - laborCost)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Ferramentas (sem markup)</span>
            <span>{formatCurrency(toolsCost)}</span>
          </div>
          <div className="h-px bg-blue-200 my-2" />
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Preço mensal</span>
            <span className="text-[#307ca8]">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
        {!markup && (
          <p className="text-xs text-amber-600 mt-3">
            Configure o markup em <strong>Admin → Markup</strong> para preços precisos.
          </p>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#307ca8] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#256690] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : product ? 'Salvar alterações' : 'Criar produto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="border border-gray-300 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
