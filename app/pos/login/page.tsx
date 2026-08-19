'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Delete } from 'lucide-react'
import { AirestsMark } from '@/components/shared/airests-mark'
import { ConnectivityChip } from '@/components/shared/status-pill'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { brand, staff } from '@/lib/mock-data'
import { writeSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import { m } from 'framer-motion'
import { Stagger, StaggerItem } from '@/components/motion/primitives'

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
        const person = staff.find((entry) => entry.pin === next)
        if (person) writeSession(person)
        setTimeout(() => router.push('/pos'), 350)
      }
      return next
    })
  }

  return (
    <div className="page-canvas flex min-h-dvh flex-col font-sans lg:flex-row">
      <aside className="pos-ink relative hidden overflow-hidden lg:flex lg:w-[42%] lg:flex-col lg:justify-between lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 size-80 rounded-full bg-primary/10 blur-3xl" />
        <AirestsMark size="lg" className="relative" />
        <div className="relative max-w-sm">
          <p className="text-sm font-medium text-white/55">Windows POS</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight">Clock in. Own the floor.</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            {brand.registerName} · {brand.activeLocation}
          </p>
        </div>
        <p className="relative text-xs text-white/40">Riverside Hospitality Group</p>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5 md:px-10">
          <AirestsMark size="lg" className="lg:hidden" />
          <div className="ml-auto flex items-center gap-2.5">
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
              <m.div
                key={i}
                className={cn(
                  'flex size-4 items-center justify-center rounded-full border-2 border-primary/40',
                  pin.length > i && 'border-primary bg-primary',
                )}
                animate={pin.length > i ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.22 }}
              />
            ))}
          </div>

          <Stagger className="grid w-full max-w-xs grid-cols-3 gap-3" delay={0.03}>
            {PIN_KEYS.map((key) => (
              <StaggerItem key={key}>
                <m.button
                  type="button"
                  onClick={() => press(key)}
                  whileTap={{ scale: 0.94 }}
                  className={cn(
                    'flex h-16 w-full items-center justify-center rounded-xl border border-border bg-card text-xl font-semibold text-foreground shadow-sm hover:border-primary/35',
                    key === 'clear' && 'text-sm font-medium text-muted-foreground',
                  )}
                  aria-label={key === 'back' ? 'Backspace' : key === 'clear' ? 'Clear' : key}
                >
                  {key === 'back' ? <Delete className="size-5" /> : key === 'clear' ? 'Clear' : key}
                </m.button>
              </StaggerItem>
            ))}
          </Stagger>

          <p className="text-xs text-muted-foreground">Forgot your PIN? Ask your shift manager to reset it.</p>
        </main>

        <footer className="flex items-center justify-center px-6 pb-6 text-xs text-muted-foreground lg:hidden">
          {brand.registerName} — {brand.activeLocation}
        </footer>
      </div>
    </div>
  )
}
