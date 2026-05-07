'use client'

import { useState } from 'react'
import Link from 'next/link'
import { registerUser } from '@/app/actions/auth'

type Step = 'form' | 'success'

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setLoading(true)
    const result = await registerUser(form.email, form.password, form.full_name)

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
          <h2 className="text-xl font-bold text-gray-900">Cadastro enviado!</h2>
          <p className="text-sm text-gray-500">
            Seu cadastro foi recebido. O administrador irá liberar o seu acesso em breve.
          </p>
          <p className="text-xs text-gray-400">
            Verifique seu e-mail para confirmar o cadastro antes de fazer login.
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
          <h1 className="text-2xl font-bold text-gray-900">Primeiro acesso</h1>
          <p className="text-sm text-gray-500 mt-1">Crie sua conta para solicitar acesso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand)' }}>Nome completo *</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={set('full_name')}
              placeholder="Seu nome"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand)' }}>E-mail *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand)' }}>Senha *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={set('password')}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--brand)' }}>Confirmar senha *</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="Repita a senha"
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
            {loading ? 'Criando conta...' : 'Solicitar acesso'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Já tem acesso?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--brand)' }}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
