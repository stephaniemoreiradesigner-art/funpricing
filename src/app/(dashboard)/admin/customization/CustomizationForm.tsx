'use client'

import { useState } from 'react'
import { saveCustomization } from '@/app/actions/customization'

interface Customization {
  company_name: string | null
  logo_url: string | null
  brand_color: string | null
}

interface Props {
  config: Customization | null
}

const DEFAULT_COLOR = '#307ca8'

export function CustomizationForm({ config }: Props) {
  const [color, setColor] = useState(config?.brand_color ?? DEFAULT_COLOR)
  const [logoUrl, setLogoUrl] = useState(config?.logo_url ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    await saveCustomization(formData)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Identidade */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Identidade da empresa</h3>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Nome da empresa</label>
          <input
            type="text"
            name="company_name"
            defaultValue={config?.company_name ?? ''}
            placeholder="Ex: Agência FanPricing"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">Aparece nas propostas enviadas aos clientes.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">URL do logotipo</label>
          <input
            type="url"
            name="logo_url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://sua-empresa.com/logo.png"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            Cole a URL de uma imagem PNG ou SVG hospedada (Cloudinary, S3, etc.).
          </p>
        </div>

        {/* Preview da logo */}
        {logoUrl && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Preview do logotipo"
              className="h-10 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <p className="text-xs text-gray-400">Preview do logotipo</p>
          </div>
        )}
      </div>

      {/* Cor da marca */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Cor da marca</h3>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="color"
              name="brand_color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-14 h-14 rounded-xl border border-gray-300 cursor-pointer p-0.5"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{color.toUpperCase()}</p>
            <p className="text-xs text-gray-400 mt-0.5">Usada em botões, destaques e PDF das propostas.</p>
          </div>
        </div>

        {/* Swatches de sugestão */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Sugestões</p>
          <div className="flex gap-2 flex-wrap">
            {['#307ca8', '#1a56db', '#7c3aed', '#059669', '#dc2626', '#d97706', '#374151'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                title={c}
                className="w-8 h-8 rounded-lg border-2 transition-all"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? '#111' : 'transparent',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-lg p-4 border border-gray-200 space-y-2">
          <p className="text-xs text-gray-500 mb-2">Preview</p>
          <button
            type="button"
            className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: color }}
          >
            Botão principal
          </button>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
              F
            </div>
            <span className="text-sm font-bold" style={{ color }}>FanPricing</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#307ca8] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#256690] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : 'Salvar personalização'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">✓ Salvo com sucesso</span>
        )}
      </div>
    </form>
  )
}
