'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Trash2, Download, Loader2, FileCheck2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { TemplateFile } from './page'

type TemplateType = 'contract' | 'proposal'

const TEMPLATE_INFO: Record<TemplateType, { label: string; description: string; prefix: string }> = {
  contract: {
    label: 'Modelo de Contrato',
    description: 'Arquivo base para geração de contratos',
    prefix: 'contract',
  },
  proposal: {
    label: 'Modelo de Proposta',
    description: 'Arquivo base para geração de propostas',
    prefix: 'proposal',
  },
}

const ACCEPTED = '.docx,.doc,.odt,.pdf'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface Props {
  initialContract: TemplateFile | null
  initialProposal: TemplateFile | null
}

export function FilesClient({ initialContract, initialProposal }: Props) {
  const router = useRouter()
  const [files, setFiles] = useState<Record<TemplateType, TemplateFile | null>>({
    contract: initialContract,
    proposal: initialProposal,
  })
  const [uploading, setUploading] = useState<TemplateType | null>(null)
  const [deleting, setDeleting] = useState<TemplateType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const contractRef = useRef<HTMLInputElement>(null)
  const proposalRef = useRef<HTMLInputElement>(null)
  const refs: Record<TemplateType, React.RefObject<HTMLInputElement | null>> = {
    contract: contractRef,
    proposal: proposalRef,
  }

  async function handleUpload(type: TemplateType, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(type)

    const ext = file.name.split('.').pop()
    const path = `${TEMPLATE_INFO[type].prefix}.${ext}`
    const supabase = createClient()

    // Remove arquivo anterior com extensão diferente, se existir
    const current = files[type]
    if (current && current.name !== path) {
      await supabase.storage.from('templates').remove([current.name])
    }

    const { error: uploadError } = await supabase.storage
      .from('templates')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setError(`Erro ao enviar o arquivo: ${uploadError.message}`)
      setUploading(null)
      e.target.value = ''
      return
    }

    const { data: urlData } = supabase.storage.from('templates').getPublicUrl(path)
    setFiles((prev) => ({
      ...prev,
      [type]: {
        name: path,
        size: file.size,
        url: urlData.publicUrl,
        updatedAt: new Date().toISOString(),
      },
    }))

    setUploading(null)
    e.target.value = ''
    router.refresh()
  }

  async function handleDelete(type: TemplateType) {
    const current = files[type]
    if (!current) return
    if (!confirm(`Excluir o modelo "${TEMPLATE_INFO[type].label}"? Esta ação não pode ser desfeita.`)) return

    setDeleting(type)
    const supabase = createClient()
    const { error: delError } = await supabase.storage.from('templates').remove([current.name])

    if (delError) {
      setError(`Erro ao excluir: ${delError.message}`)
    } else {
      setFiles((prev) => ({ ...prev, [type]: null }))
      router.refresh()
    }
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {(['contract', 'proposal'] as TemplateType[]).map((type) => {
        const info = TEMPLATE_INFO[type]
        const current = files[type]
        const isUploading = uploading === type
        const isDeleting = deleting === type

        return (
          <div key={type} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4">
              {/* Info do template */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  current ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  {current
                    ? <FileCheck2 size={22} className="text-green-600" />
                    : <FileText size={22} className="text-gray-400" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{info.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{info.description}</p>

                  {current ? (
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs font-medium text-gray-700 truncate">{current.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatSize(current.size)} · Enviado em {formatDate(current.updatedAt)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2 italic">Nenhum arquivo enviado</p>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 shrink-0">
                {current && (
                  <>
                    <a
                      href={current.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-[#307ca8] transition-colors"
                      title="Baixar modelo"
                    >
                      <Download size={16} />
                    </a>
                    <button
                      onClick={() => handleDelete(type)}
                      disabled={isDeleting}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                      title="Excluir modelo"
                    >
                      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </>
                )}

                <button
                  onClick={() => refs[type].current?.click()}
                  disabled={isUploading}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                    current
                      ? 'border border-[#307ca8] text-[#307ca8] hover:bg-[#307ca8]/5'
                      : 'bg-[#307ca8] text-white hover:bg-[#256690]'
                  }`}
                >
                  {isUploading
                    ? <><Loader2 size={15} className="animate-spin" /> Enviando...</>
                    : <><Upload size={15} /> {current ? 'Substituir' : 'Fazer upload'}</>
                  }
                </button>

                <input
                  ref={refs[type] as React.RefObject<HTMLInputElement>}
                  type="file"
                  accept={ACCEPTED}
                  className="hidden"
                  onChange={(e) => handleUpload(type, e)}
                />
              </div>
            </div>

            {/* Tipos aceitos */}
            {!current && (
              <p className="text-xs text-gray-300 mt-4 border-t border-gray-100 pt-3">
                Aceito: .docx, .doc, .odt, .pdf
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
