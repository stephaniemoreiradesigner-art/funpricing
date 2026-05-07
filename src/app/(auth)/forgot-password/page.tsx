'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordReset } from '@/app/actions/auth'

type Step = 'form' | 'success'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await sendPasswordReset(email)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('success')
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">E-mail enviado!</h2>
          <p className="text-sm text-gray-500">
            Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha em instantes.
          </p>
          <Link
            href="/login"
            className="inline-block w-full mt-2 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--brand)' }}
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <div className="mb-6 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ backgroundColor: 'var(--brand)' }}
          >
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Esqueceu a senha?</h1>
          <p className="text-sm text-gray-500 mt-1">Informe seu e-mail para receber o link de redefinição</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand)' }}>
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--brand)' }}
          >
            {loading ? 'Enviando...' : 'Enviar link de redefinição'}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-gray-100 text-center">
          <Link href="/login" className="text-sm font-medium hover:underline" style={{ color: 'var(--brand)' }}>
            ← Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}
