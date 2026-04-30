'use client'

import { useState } from 'react'
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react'
import { updateUser, deleteUser, inviteUser } from '@/app/actions/users'
import type { UserRole } from '@/types'

interface UserRow {
  id: string
  email: string
  name: string
  role: UserRole
  created_at: string
}

interface Props {
  users: UserRow[]
  currentUserId: string
}

export function UsersClient({ users, currentUserId }: Props) {
  const [showInvite, setShowInvite] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState<UserRole>('user')
  const [savingId, setSavingId] = useState<string | null>(null)

  function startEdit(user: UserRow) {
    setEditingId(user.id)
    setEditName(user.name)
    setEditRole(user.role)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleSave(userId: string) {
    setSavingId(userId)
    await updateUser(userId, editName, editRole)
    setSavingId(null)
    setEditingId(null)
  }

  async function handleDelete(user: UserRow) {
    if (!confirm(`Excluir o usuário "${user.name || user.email}"? Esta ação não pode ser desfeita.`)) return
    setDeletingId(user.id)
    await deleteUser(user.id)
    setDeletingId(null)
  }

  async function handleInvite(formData: FormData) {
    setInviting(true)
    await inviteUser(formData)
    setInviting(false)
    setShowInvite(false)
  }

  return (
    <div className="space-y-4">
      {showInvite && (
        <form
          action={handleInvite}
          className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-800">Adicionar novo usuário</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome</label>
              <input
                type="text"
                name="full_name"
                required
                placeholder="Nome completo"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">E-mail *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="email@exemplo.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Perfil</label>
              <select
                name="role"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
              >
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            O usuário será criado sem senha. Envie o link de redefinição de senha pelo painel do Supabase.
          </p>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={inviting}
              className="bg-[#307ca8] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#256690] transition-colors disabled:opacity-50"
            >
              {inviting ? 'Criando...' : 'Criar usuário'}
            </button>
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="border border-gray-300 text-gray-600 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900">Usuários</h3>
            <p className="text-xs text-gray-400 mt-0.5">{users.length} cadastrado{users.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 bg-[#307ca8] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#256690] transition-colors"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">Nome</th>
              <th className="text-left px-6 py-3 font-medium">E-mail</th>
              <th className="text-left px-6 py-3 font-medium">Perfil</th>
              <th className="text-left px-6 py-3 font-medium">Desde</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isEditing = editingId === user.id
              const isSaving = savingId === user.id
              const isMe = user.id === currentUserId

              return (
                <tr
                  key={user.id}
                  className={`border-b border-gray-100 last:border-0 transition-colors ${isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                        placeholder="Nome completo"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#307ca8]/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-[#307ca8]">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {user.name || '—'}
                          {isMe && <span className="ml-1.5 text-xs text-gray-400">(você)</span>}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-3 text-sm text-gray-500">{user.email}</td>

                  <td className="px-6 py-3">
                    {isEditing ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as UserRole)}
                        className="bg-white text-gray-900 border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-3 text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(user.id)}
                            disabled={isSaving}
                            className="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                            title="Salvar"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Cancelar"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(user)}
                            className="text-gray-400 hover:text-[#307ca8] transition-colors"
                            title="Editar usuário"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={isMe || deletingId === user.id}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isMe ? 'Não é possível excluir sua própria conta' : 'Excluir usuário'}
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
