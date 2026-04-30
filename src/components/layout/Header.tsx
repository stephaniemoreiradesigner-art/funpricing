export function Header() {
  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <span className="text-sm text-gray-500">{todayFormatted}</span>
    </header>
  )
}
