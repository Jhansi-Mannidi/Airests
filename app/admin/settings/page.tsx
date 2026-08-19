'use client'

import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { restaurantProfile, brand } from '@/lib/mock-data'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const modes = ['QSR', 'Fast Casual', 'Full Service'] as const

export default function SettingsPage() {
  const [mode, setMode] = useState<(typeof modes)[number]>('Full Service')
  const [paused, setPaused] = useState(false)

  return (
    <>
      <AdminTopbar title="Settings" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Business Profile</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Business Name</label>
                <input defaultValue={brand.tenantName} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Primary Location Address</label>
                <input defaultValue={restaurantProfile.address} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Hours</label>
                <input defaultValue={restaurantProfile.hours} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Prep time shown online</label>
                <input defaultValue={restaurantProfile.prepTime} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Service mode</h2>
            <p className="mt-1 text-xs text-muted-foreground">QSR hides floor plan. Full service shows tables, transfers, and coursing.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold',
                    mode === m ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-4">
              <Row label="Coursing (apps vs entrees)" hint="Fire kitchen by course" defaultChecked={mode === 'Full Service'} />
              <Row label="Floor plan on POS" hint="Required for full service" defaultChecked={mode !== 'QSR'} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Pause online ordering</p>
                  <p className="text-xs text-muted-foreground">Throttle / stop web + aggregator intake</p>
                </div>
                <Switch checked={paused} onCheckedChange={setPaused} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
            <div className="mt-4 space-y-4">
              <Row label="Auto-Gratuity for Parties 6+" hint="Apply 20% service charge automatically" defaultChecked />
              <Row label="Kitchen Throttle Alerts" hint="Notify managers when ticket times exceed 10 min" defaultChecked />
              <Row label="Allow Offline Order Entry" hint="Queue orders locally when connection drops" defaultChecked />
              <Row label="Admin MFA" hint="Required before commercial V1" defaultChecked />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Payment security</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Airests does not store PAN. Card data stays on the terminal / hosted fields. PCI DSS v4.0.1 scope is the provider boundary.
            </p>
            <button
              onClick={() => toast.success('Settings saved')}
              className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              Save settings
            </button>
          </section>
        </div>
      </main>
    </>
  )
}

function Row({ label, hint, defaultChecked }: { label: string; hint: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}
