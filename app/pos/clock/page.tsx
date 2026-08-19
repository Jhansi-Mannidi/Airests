'use client'

import * as React from 'react'
import { Delete, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { staff } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const SIGNED_IN_ID = 'st-1'
const PIN_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back']
const MANAGER_ROLES = new Set(['Shift Manager', 'General Manager', 'Owner/Admin'])

type StaffMember = (typeof staff)[number]
type PunchTarget = { person: StaffMember; next: 'Clocked In' | 'Clocked Out' }

function nowLabel() {
  return `Today, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}

export default function ClockPage() {
  const signedIn = staff.find((s) => s.id === SIGNED_IN_ID) ?? staff[0]
  const downtown = staff.filter((s) => s.location === 'Downtown')
  const managers = downtown.filter((s) => MANAGER_ROLES.has(s.role))

  const [status, setStatus] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(downtown.map((s) => [s.id, s.status])),
  )
  const [lastPunch, setLastPunch] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(downtown.map((s) => [s.id, s.lastClockIn])),
  )
  const [audit, setAudit] = React.useState<Record<string, string>>({})
  const [confirmSelf, setConfirmSelf] = React.useState<PunchTarget | null>(null)
  const [pinTarget, setPinTarget] = React.useState<PunchTarget | null>(null)
  const [pin, setPin] = React.useState('')
  const [pinError, setPinError] = React.useState('')
  const [override, setOverride] = React.useState(false)

  function applyPunch(person: StaffMember, next: 'Clocked In' | 'Clocked Out', how: string) {
    setStatus((prev) => ({ ...prev, [person.id]: next }))
    setLastPunch((prev) => ({ ...prev, [person.id]: nowLabel() }))
    setAudit((prev) => ({ ...prev, [person.id]: how }))
    toast.success(`${person.name} ${next.toLowerCase()}`, { description: how })
  }

  function requestPunch(person: StaffMember) {
    const next = status[person.id] === 'Clocked In' ? 'Clocked Out' : 'Clocked In'
    const target = { person, next }
    if (person.id === signedIn.id) {
      setConfirmSelf(target)
      return
    }
    setPin('')
    setPinError('')
    setOverride(false)
    setPinTarget(target)
  }

  function press(key: string) {
    if (key === 'clear') {
      setPin('')
      setPinError('')
      return
    }
    if (key === 'back') {
      setPin((p) => p.slice(0, -1))
      setPinError('')
      return
    }
    setPin((p) => {
      const next = (p + key).slice(0, 4)
      if (next.length === 4) queueMicrotask(() => submitPin(next))
      return next
    })
  }

  function submitPin(value: string) {
    if (!pinTarget) return
    if (override) {
      const manager = managers.find((m) => m.pin === value)
      if (!manager) {
        setPinError('Not a manager PIN. Tomas is 5510. Elena is 8890.')
        setPin('')
        return
      }
      applyPunch(
        pinTarget.person,
        pinTarget.next,
        `Manager override by ${manager.name} · entered on Maria’s register`,
      )
      closePin()
      return
    }
    if (value !== pinTarget.person.pin) {
      setPinError(`Wrong PIN for ${pinTarget.person.name.split(' ')[0]}. Punch cancelled.`)
      setPin('')
      return
    }
    applyPunch(pinTarget.person, pinTarget.next, `${pinTarget.person.name} entered their own PIN`)
    closePin()
  }

  function closePin() {
    setPinTarget(null)
    setPin('')
    setPinError('')
    setOverride(false)
  }

  const sorted = [...downtown].sort((a, b) => {
    if (a.id === signedIn.id) return -1
    if (b.id === signedIn.id) return 1
    const aOn = status[a.id] === 'Clocked In' ? 0 : 1
    const bOn = status[b.id] === 'Clocked In' ? 0 : 1
    return aOn - bOn
  })

  return (
    <div className="pos-canvas flex h-dvh flex-col">
      <PosTopBar title="Time Clock" backHref="/pos" />
      <main className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-4 rounded-xl bg-card p-4 ring-1 ring-border">
          <p className="text-sm font-semibold text-foreground">Signed in as {signedIn.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            You can punch <span className="font-medium text-foreground">yourself</span> after a confirm.
            For anyone else, that person must enter <span className="font-medium text-foreground">their own PIN</span>.
            Maria cannot clock the whole team out by accident.
          </p>
        </div>

        <div className="space-y-2">
          {sorted.map((s) => {
            const on = status[s.id] === 'Clocked In'
            const mine = s.id === signedIn.id
            return (
              <div
                key={s.id}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 ring-1',
                  mine ? 'ring-primary/40' : 'ring-border',
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {s.name}
                    {mine && <span className="ml-2 text-xs font-medium text-primary">You</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.role} · last punch {lastPunch[s.id]}
                  </p>
                  {audit[s.id] && <p className="mt-0.5 text-[11px] text-muted-foreground">{audit[s.id]}</p>}
                </div>
                <Button
                  variant={on ? 'outline' : 'default'}
                  size="sm"
                  className={cn('h-8 shrink-0', on && 'border-success/40 text-success hover:bg-success/10')}
                  onClick={() => requestPunch(s)}
                >
                  {on ? 'Clock out' : 'Clock in'}
                </Button>
              </div>
            )
          })}
        </div>
      </main>

      <Dialog open={!!confirmSelf} onOpenChange={(open) => !open && setConfirmSelf(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmSelf?.next === 'Clocked Out' ? 'Clock yourself out?' : 'Clock yourself in?'}
            </DialogTitle>
            <DialogDescription>
              This punch is only for {signedIn.name}. It will not change anyone else’s time card.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSelf(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!confirmSelf) return
                applyPunch(confirmSelf.person, confirmSelf.next, 'Punched by Maria Alvarez (own PIN session)')
                setConfirmSelf(null)
              }}
            >
              Yes, {confirmSelf?.next === 'Clocked Out' ? 'clock me out' : 'clock me in'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pinTarget} onOpenChange={(open) => !open && closePin()}>
        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {override ? 'Manager override' : `Enter ${pinTarget?.person.name.split(' ')[0]}’s PIN`}
            </DialogTitle>
            <DialogDescription>
              {override
                ? `A shift manager PIN is required to ${pinTarget?.next === 'Clocked Out' ? 'clock out' : 'clock in'} ${pinTarget?.person.name} without their PIN.`
                : `Maria cannot punch ${pinTarget?.person.name.split(' ')[0]} unless that person types their own 4-digit PIN.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-3 py-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'size-3.5 rounded-full border-2 border-primary/40',
                  pin.length > i && 'border-primary bg-primary',
                )}
              />
            ))}
          </div>
          {pinError && <p className="text-center text-xs font-medium text-danger">{pinError}</p>}

          <div className="grid grid-cols-3 gap-2">
            {PIN_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => press(key)}
                className={cn(
                  'flex h-12 items-center justify-center rounded-lg border border-border bg-background text-lg font-semibold text-foreground active:bg-secondary',
                  key === 'clear' && 'text-xs font-medium text-muted-foreground',
                )}
                aria-label={key === 'back' ? 'Backspace' : key === 'clear' ? 'Clear' : key}
              >
                {key === 'back' ? <Delete className="size-4" /> : key === 'clear' ? 'Clear' : key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setOverride((v) => !v)
              setPin('')
              setPinError('')
            }}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ShieldAlert className="size-3.5" />
            {override ? 'Back to employee PIN' : 'They forgot PIN — manager override'}
          </button>
          <Button variant="outline" onClick={closePin}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
