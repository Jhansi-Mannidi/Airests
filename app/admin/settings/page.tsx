import { AdminTopbar } from '@/components/admin/admin-topbar'
import { restaurantProfile, brand } from '@/lib/mock-data'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
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
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Gratuity for Parties 6+</p>
                  <p className="text-xs text-muted-foreground">Apply 20% service charge automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Kitchen Throttle Alerts</p>
                  <p className="text-xs text-muted-foreground">Notify managers when ticket times exceed 10 min</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Allow Offline Order Entry</p>
                  <p className="text-xs text-muted-foreground">Queue orders locally when connection drops</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
