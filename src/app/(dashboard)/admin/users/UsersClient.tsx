'use client'

import { useState } from 'react'
import { Trash2, Plus, Pencil, X, User } from 'lucide-react'
import { updateUser, deleteUser, inviteUser } from '@/app/actions/users'
import type { UserRole } from '@/types'

interface UserRow {
  id: string
  email: string
  name: string
  role: UserRole
  phone: string
  cnpj: string
  address: string
  created_at: string
}

interface Props {
  users: UserRow[]
  currentUserId: string
}

interface EditForm {
  full_name: string
  role: UserRole
  phone: string
  cnpj: string
  address: string
}

export function UsersClient({ users, currentUserId }: Props) {
  const [showInvite, setShowInvite] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<UserRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({ full_name: '', role: 'user', phone: '', cnpj: '', address: '' })
  const [saving, setSaving] = useState(false)

  function openEdit(user: UserRow) {
    setEditForm({ full_name: user.name, role: user.role, phone: user.phone, cnpj: user.cnpj, address: user.address })
    setEditingUser(user)
  }

  function closeEdit() {
    setEditingUser(null)
  }

  async function handleSave() {
    if (!editingUser) return
    setSaving(true)
    await updateUser(editingUser.id, {
      full_name: editForm.full_name,
      role: editForm.role,
      phone: editForm.phone || null,
      cnpj: editForm.cnpj || null,
      address: editForm.address || null,
    })
    setSaving(false)
    setEditingUser(null)
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
    <>
      {/* Modal de edição */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            {/* Header do modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#307ca8]/10 flex items-center justify-center">
                  <User size={18} className="text-[#307ca8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{editingUser.email}</p>
                  <p className="text-xs text-gray-400">Editar perfil</p>
                </div>
              </div>
              <button onClick={closeEdit} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Corpo do modal */}
            <div className="px-6 py-5 space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Dados pessoais</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Nome completo *</label>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm((f) => ({ ...f, full_name: e.target.value }))}
                      placeholder="Nome completo"
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">CNPJ / CPF</label>
                      <input
                        type="text"
                        value={editForm.cnpj}
                        onChange={(e) => setEditForm((f) => ({ ...f, cnpj: e.target.value }))}
                        placeholder="00.000.000/0000-00"
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">Telefone / WhatsApp</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Endereço</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                      placeholder="Rua, número, complemento, cidade - UF"
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Perfil de acesso</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                  disabled={editingUser.id === currentUserId}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Admin</option>
                </select>
                {editingUser.id === currentUserId && (
                  <p className="text-xs text-gray-400 mt-1">Não é possível alterar o próprio perfil.</p>
                )}
              </div>
            </div>

            {/* Footer do modal */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving || !editForm.full_name.trim()}
                className="bg-[#307ca8] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#256690] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Salvando...' : 'Salvar cadastro'}
              </button>
              <button
                onClick={closeEdit}
                className="border border-gray-300 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Painel de convite */}
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
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="email@exemplo.com"
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Perfil</label>
                <select
                  name="role"
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#307ca8] focus:border-transparent"
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
                const isMe = user.id === currentUserId
                return (
                  <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
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
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(user)}
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
    </>
  )
}
