'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { staff as seedStaff, roles, permissionMatrix } from '@/lib/mock-data'
import { UserPlus, Check, X, Search, Download } from 'lucide-react'
import { downloadCsv, fileStamp } from '@/lib/export'
import { cn } from '@/lib/utils'
import { AnimatePresence, m } from 'framer-motion'

type DirectoryPerson = (typeof seedStaff)[number] & { email?: string; phone?: string; invited?: boolean }

const roleTone: Record<string, string> = {
  Server: 'bg-info/15 text-info',
  Bartender: 'bg-info/15 text-info',
  Kitchen: 'bg-warning/15 text-warning',
  Host: 'bg-muted text-muted-foreground',
  'Shift Manager': 'bg-accent text-accent-foreground',
  'General Manager': 'bg-primary/15 text-primary',
  'Owner/Admin': 'bg-primary/15 text-primary',
}

export default function StaffPage() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [people, setPeople] = useState<DirectoryPerson[]>(() => seedStaff.map((s) => ({ ...s })))

  const filteredStaff = people.filter((s) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      (s.email?.toLowerCase().includes(q) ?? false)
    )
  })

  return (
    <>
      <AdminTopbar title="Staff & Roles" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          {/* Staff table */}
          <section className="rounded-xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Staff Directory</h2>
                <p className="text-xs text-muted-foreground">
                  {filteredStaff.length === people.length
                    ? `${people.length} team members across all locations`
                    : `${filteredStaff.length} of ${people.length} team members`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search staff, role, or location…"
                    className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64"
                  />
                </div>
                <button
                  onClick={() => setInviteOpen(true)}
                  className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <UserPlus className="size-4" />
                  <span className="hidden sm:inline">Invite Staff</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Role</th>
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">PIN Status</th>
                    <th className="hidden px-4 py-2.5 font-medium md:table-cell">Last Clock-In</th>
                    <th className="px-4 py-2.5 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((s) => (
                    <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/50">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                            {s.initials}
                          </div>
                          <span className="font-medium text-foreground">{s.name}</span>
                          {s.invited && (
                            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                              Invite sent
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', roleTone[s.role])}>
                          {s.role}
                        </span>
                      </td>
                      <td className="hidden px-4 py-2.5 sm:table-cell">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 text-xs font-medium',
                            s.status === 'Clocked In' ? 'text-success' : 'text-muted-foreground',
                          )}
                        >
                          <span className={cn('size-1.5 rounded-full', s.status === 'Clocked In' ? 'bg-success' : 'bg-muted-foreground')} />
                          {s.status}
                        </span>
                      </td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">{s.lastClockIn}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{s.location}</td>
                    </tr>
                  ))}
                  {filteredStaff.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No staff match &quot;{query}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Role permission matrix */}
          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold text-foreground">Role Permission Matrix</h2>
              <p className="text-xs text-muted-foreground">Control what each role can access across POS, KDS, and Admin</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="sticky left-0 bg-card px-4 py-2.5 font-medium">Permission</th>
                    {roles.map((r) => (
                      <th key={r} className="px-4 py-2.5 text-center font-medium">
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionMatrix.map((row) => (
                    <tr key={row.permission} className="border-b border-border/60 last:border-0">
                      <td className="sticky left-0 bg-card px-4 py-2.5 font-medium text-foreground">{row.permission}</td>
                      {roles.map((r) => {
                        const allowed = (row as Record<string, boolean | string>)[r] as boolean
                        return (
                          <td key={r} className="px-4 py-2.5 text-center">
                            {allowed ? (
                              <Check className="mx-auto size-4 text-success" />
                            ) : (
                              <X className="mx-auto size-4 text-muted-foreground/40" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Time cards — today</h2>
                <p className="text-xs text-muted-foreground">Clock-in/out from POS writes here. Export for payroll after Z close.</p>
              </div>
              <button
                onClick={() =>
                  downloadCsv(
                    `airests-payroll-${fileStamp()}`,
                    ['Name', 'Role', 'Clock in', 'Status', 'Location'],
                    people.map((person) => [person.name, person.role, person.lastClockIn, person.status, person.location]),
                  )
                }
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <Download className="size-4" />
                Export payroll CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">In</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {people.slice(0, 8).map((s) => (
                    <tr key={s.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-2.5 font-medium">{s.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{s.lastClockIn}</td>
                      <td className="px-4 py-2.5">{s.status}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{s.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {inviteOpen && (
          <InviteStaffModal
            key="invite-staff"
            onClose={() => setInviteOpen(false)}
            onInvite={(person) => {
              setPeople((prev) => [person, ...prev])
              setInviteOpen(false)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function InviteStaffModal({
  onClose,
  onInvite,
}: {
  onClose: () => void
  onInvite: (person: DirectoryPerson) => void
}) {
  const [name, setName] = useState('')
  const [role, setRole] = useState(roles[0])
  const [location, setLocation] = useState('Downtown')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function send() {
    const fullName = name.trim()
    const mail = email.trim()
    const mobile = phone.trim()
    if (!fullName) {
      setError('Enter a full name.')
      return
    }
    if (!mail && !mobile) {
      setError('Add an email or a mobile number so they can receive the invite.')
      return
    }
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError('Enter a valid work email.')
      return
    }
    if (pin && !/^\d{4}$/.test(pin)) {
      setError('PIN must be 4 digits, or leave it blank to let them set it from the invite.')
      return
    }

    const initials = fullName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    onInvite({
      id: `st-invite-${Date.now()}`,
      name: fullName,
      initials: initials || 'NW',
      role,
      pin: pin || '0000',
      status: 'Clocked Out',
      lastClockIn: 'Invite pending',
      location,
      email: mail || undefined,
      phone: mobile || undefined,
      invited: true,
    })

    const via = [mail && `email ${mail}`, mobile && `SMS ${mobile}`].filter(Boolean).join(' and ')
    toast.success(`Invite sent to ${fullName}`, {
      description: `Sent by ${via}. PIN is for the POS register, not for opening the message.`,
    })
  }

  return (
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center modal-scrim p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <m.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Invite Staff</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          Name and PIN only create a login on the register. They will not know unless you send the invite to an email or
          phone.
        </p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jennings"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Downtown</option>
                <option>Riverside</option>
                <option>Domain</option>
                <option>South Congress</option>
                <option>Lakeline</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Work email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@riversidegrill.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Mobile (SMS)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(512) 555-0140"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">POS PIN (optional)</label>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="4-digit PIN for the register"
              maxLength={4}
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">This is what they type on POS login. It is not sent as the invite itself.</p>
          </div>
          {error && <p className="text-xs font-medium text-danger">{error}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
          <button
            onClick={send}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Send invite
          </button>
        </div>
      </m.div>
    </m.div>
  )
}
