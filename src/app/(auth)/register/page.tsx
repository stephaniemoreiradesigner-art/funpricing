'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { createProfileAfterSignup } from '@/app/actions/auth'

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
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    })

    if (signUpError) {
      setError(
        signUpError.message.includes('already registered')
          ? 'Este e-mail já está cadastrado. Faça login.'
          : 'Erro ao criar conta. Tente novamente.'
      )
      setLoading(false)
      return
    }

    // Cria perfil no banco via server action (usa admin client)
    if (data.user) {
      await createProfileAfterSignup(data.user.id, form.email, form.full_name)
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
            Verifique também seu e-mail para confirmar o cadastro.
          </p>
          <Link
            href="/login"
            className="inline-block w-full mt-2 bg-[#307ca8] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#256690] transition-colors"
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#307ca8] mb-4">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Primeiro acesso</h1>
          <p className="text-sm text-gray-500 mt-1">Crie sua conta para solicitar acesso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={set('full_name')}
              placeholder="Seu nome"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={set('password')}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha *</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="Repita a senha"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#307ca8] hover:bg-[#256690] text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Solicitar acesso'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Já tem acesso?{' '}
          <Link href="/login" className="text-[#307ca8] font-medium hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
