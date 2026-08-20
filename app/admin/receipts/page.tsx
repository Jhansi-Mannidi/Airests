'use client'

import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { Switch } from '@/components/ui/switch'

export default function ReceiptsAdminPage() {
  return (
    <>
      <AdminTopbar title="Receipt Customization" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <section className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Guest receipt (basic V1)</h2>
            <label className="block text-xs font-medium text-muted-foreground">
              Header
              <input defaultValue="Riverside Grill — Downtown" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Footer
              <input defaultValue="Thank you — airests.app" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </label>
            {[
              'Show tax breakdown',
              'Show tip line',
              'Show tender + last 4',
              'Show refund policy',
            ].map((label) => (
              <div key={label} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-sm text-foreground">{label}</span>
                <Switch defaultChecked />
              </div>
            ))}
            <button onClick={() => toast.success('Receipt template saved')} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
              Save template
            </button>
          </section>
          <aside className="rounded-xl border border-dashed border-border bg-card p-5 font-mono text-[11px] leading-relaxed text-foreground">
            <p className="text-center font-bold">RIVERSIDE GRILL</p>
            <p className="text-center">Downtown Austin</p>
            <p className="my-2 border-t border-dashed" />
            <p>Smash Burger ........ $12.50</p>
            <p>Sales tax 8.25% ............. $1.03</p>
            <p>Card •••• 4242</p>
            <p className="font-bold">Total ................ $13.53</p>
            <p className="my-2 border-t border-dashed" />
            <p>Tip: __________</p>
            <p className="text-center">airests.app</p>
          </aside>
        </div>
      </main>
    </>
  )
}
