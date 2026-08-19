'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Delete } from 'lucide-react'
import { AirestsMark } from '@/components/shared/airests-mark'
import { ConnectivityChip } from '@/components/shared/status-pill'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { brand, staff } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const PIN_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back']

export default function PosLoginPage() {
  const router = useRouter()
  const [pin, setPin] = React.useState('')
  const [now, setNow] = React.useState<Date | null>(null)

  React.useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000 * 30)
    return () => clearInterval(t)
  }, [])

  const matchedStaff = React.useMemo(() => {
    if (!pin) return null
    return staff.find((s) => s.pin.startsWith(pin)) ?? null
  }, [pin])

  function press(key: string) {
    if (key === 'clear') return setPin('')
    if (key === 'back') return setPin((p) => p.slice(0, -1))
    setPin((p) => {
      const next = (p + key).slice(0, 4)
      if (next.length === 4) {
        setTimeout(() => router.push('/pos'), 350)
      }
      return next
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <AirestsMark size="lg" />
        <div className="flex items-center gap-3">
          <ConnectivityChip state="online" />
          <ThemeToggle />
          <AppSwitcher />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-10">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
            {now?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ·{' '}
            {now?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Enter your PIN</h1>
          <div className="mt-1 h-6 text-sm font-medium text-primary">
            {matchedStaff ? `Welcome back, ${matchedStaff.name.split(' ')[0]}` : '\u00A0'}
          </div>
        </div>

        <div className="flex gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'flex size-4 items-center justify-center rounded-full border-2 border-primary/40 transition-colors',
                pin.length > i && 'border-primary bg-primary',
              )}
            />
          ))}
        </div>

        <div className="grid w-full max-w-xs grid-cols-3 gap-3">
          {PIN_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => press(key)}
              className={cn(
                'flex h-16 items-center justify-center rounded-xl border border-border bg-card text-xl font-semibold text-foreground shadow-sm transition-colors active:bg-accent',
                key === 'clear' && 'text-sm font-medium text-muted-foreground',
              )}
              aria-label={key === 'back' ? 'Backspace' : key === 'clear' ? 'Clear' : key}
            >
              {key === 'back' ? <Delete className="size-5" /> : key === 'clear' ? 'Clear' : key}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">Forgot your PIN? Ask your shift manager to reset it.</p>
      </main>

      <footer className="flex items-center justify-center px-6 pb-6 text-xs text-muted-foreground">
        {brand.registerName} — {brand.activeLocation}
      </footer>
    </div>
  )
}
