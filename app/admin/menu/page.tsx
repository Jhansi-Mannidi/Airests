'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { menuCategories, menuItems, getItemDiet, type DietType, type MenuItem } from '@/lib/mock-data'
import { DietMark, dietFilters } from '@/components/shared/diet-mark'
import { getRecipeForItem, useRecipes, type Recipe } from '@/lib/recipes'
import { GripVertical, Upload, Search, ChevronRight, X, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { downloadCsv, headerIndex, parseCsv } from '@/lib/export'

export default function MenuBuilderPage() {
  return (
    <Suspense>
      <MenuBuilderContent />
    </Suspense>
  )
}

function MenuBuilderContent() {
  const searchParams = useSearchParams()
  const itemParam = searchParams.get('item')
  const recipes = useRecipes()
  const [catalog, setCatalog] = useState<MenuItem[]>(() => menuItems.map((item) => ({ ...item })))
  const [activeCategory, setActiveCategory] = useState(menuCategories[0])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(menuItems.find((m) => m.category === menuCategories[0]) ?? null)
  const [importOpen, setImportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dietFilter, setDietFilter] = useState<'all' | DietType>('all')
  const [availability, setAvailability] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(menuItems.map((m) => [m.id, !m.soldOut])),
  )
  const [draftName, setDraftName] = useState('')
  const [draftDescription, setDraftDescription] = useState('')
  const [draftPrice, setDraftPrice] = useState('')
  const [draftDaypart, setDraftDaypart] = useState('All Day')
  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!itemParam) return
    const item = catalog.find((m) => m.id === itemParam)
    if (!item) return
    setSelectedItem(item)
    setActiveCategory(item.category)
  }, [itemParam, catalog])

  useEffect(() => {
    if (!selectedItem) return
    setDraftName(selectedItem.name)
    setDraftDescription(selectedItem.description)
    setDraftPrice(selectedItem.price.toFixed(2))
    setDraftDaypart(selectedItem.daypart ?? 'All Day')
  }, [selectedItem])

  const items = catalog.filter((m) => {
    if (m.category !== activeCategory) return false
    if (dietFilter !== 'all' && getItemDiet(m) !== dietFilter) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
  })

  return (
    <>
      <AdminTopbar title="Menu Builder" />
      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Categories panel */}
        <div className="flex shrink-0 flex-col border-b border-border bg-card lg:w-56 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Categories</h2>
          </div>
          <div className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  const first = catalog.find((m) => m.category === cat)
                  setSelectedItem(first ?? null)
                }}
                className={cn(
                  'flex shrink-0 items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  activeCategory === cat ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary',
                )}
              >
                <span className="flex items-center gap-2">
                  <GripVertical className="hidden size-3.5 opacity-60 lg:inline" />
                  {cat}
                </span>
                <span className={cn('text-xs', activeCategory === cat ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                  {catalog.filter((m) => m.category === cat).length}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-auto hidden border-t border-border p-3 lg:block">
            <button
              onClick={() => setImportOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Upload className="size-4" />
              Import Menu (CSV)
            </button>
          </div>
        </div>

        {/* Items panel */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="relative min-w-[10rem] flex-1 max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items…"
                className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {dietFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setDietFilter(filter.id)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
                    dietFilter === filter.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {filter.id !== 'all' && <DietMark diet={filter.id} size="sm" />}
                  {filter.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setImportOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary lg:hidden"
            >
              <Upload className="size-3.5" />
              Import
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Item</th>
                  <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Diet</th>
                  <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Price</th>
                  <th className="hidden px-4 py-2.5 font-medium md:table-cell">Modifiers</th>
                  <th className="hidden px-4 py-2.5 font-medium lg:table-cell">Recipe</th>
                  <th className="px-4 py-2.5 font-medium">Available</th>
                  <th className="px-2 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      'cursor-pointer border-b border-border/60 transition-colors hover:bg-secondary/60',
                      selectedItem?.id === item.id && 'bg-accent',
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{item.name}</p>
                          <div className="mt-0.5 sm:hidden">
                            <DietMark diet={getItemDiet(item)} showLabel size="sm" />
                          </div>
                          {availability[item.id] === false && <p className="text-xs text-danger">Sold Out</p>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-2.5 sm:table-cell">
                      <DietMark diet={getItemDiet(item)} showLabel size="sm" />
                    </td>
                    <td className="hidden px-4 py-2.5 font-mono tabular-nums text-foreground sm:table-cell">${item.price.toFixed(2)}</td>
                    <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">{item.modifierGroups?.length ?? 0} groups</td>
                    <td className="hidden px-4 py-2.5 text-muted-foreground lg:table-cell">
                      {(() => {
                        const recipe = getRecipeForItem(recipes, item.id)
                        if (!recipe) return '—'
                        const count = recipe.ingredients.length
                        return count === 1 ? '1 ingredient' : `${count} ingredients`
                      })()}
                    </td>
                    <td className="px-4 py-2.5">
                      <Switch
                        checked={availability[item.id] !== false}
                        onCheckedChange={(checked) => setAvailability((prev) => ({ ...prev, [item.id]: checked }))}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-2 py-2.5">
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No items match {query ? `“${query}”` : 'this category'}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Item detail editor */}
        {selectedItem && (
          <div className="hidden w-full shrink-0 flex-col overflow-y-auto bg-card lg:flex lg:w-96">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Item Details</h2>
              <button onClick={() => setSelectedItem(null)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image src={selectedItem.image || '/placeholder.svg'} alt={selectedItem.name} fill className="object-cover" />
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const url = URL.createObjectURL(file)
                    setCatalog((prev) => prev.map((item) => (item.id === selectedItem.id ? { ...item, image: url } : item)))
                    setSelectedItem((prev) => (prev ? { ...prev, image: url } : prev))
                    toast.success('Photo updated', { description: file.name })
                  }}
                />
                <button
                  onClick={() => photoRef.current?.click()}
                  className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-background"
                >
                  Change Photo
                </button>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Item Name</label>
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Diet type</label>
                <div className="flex items-center gap-2">
                  {(['veg', 'non-veg'] as const).map((diet) => (
                    <span
                      key={diet}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
                        getItemDiet(selectedItem) === diet
                          ? diet === 'veg'
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                            : 'border-red-700 bg-red-50 text-red-800'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      <DietMark diet={diet} size="sm" />
                      {diet === 'veg' ? 'Veg' : 'Non-Veg'}
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Detected from item name, description, and dietary tags.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                <textarea
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Price</label>
                  <input
                    value={draftPrice}
                    onChange={(e) => setDraftPrice(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Daypart</label>
                  <select
                    value={draftDaypart}
                    onChange={(e) => setDraftDaypart(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>All Day</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Linked Modifier Groups</label>
                <div className="space-y-1.5">
                  {(selectedItem.modifierGroups ?? []).map((g) => (
                    <div key={g.name} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                      <span className="text-foreground">{g.name}</span>
                      <span className="text-xs text-muted-foreground">{g.options.length} options</span>
                    </div>
                  ))}
                  {!selectedItem.modifierGroups?.length && (
                    <p className="text-xs text-muted-foreground">No modifier groups linked.</p>
                  )}
                  <button
                    onClick={() => {
                      const group = {
                        name: 'Notes',
                        required: false,
                        selectType: 'single' as const,
                        options: [{ name: 'No special notes', priceDelta: 0 }],
                      }
                      const next = {
                        ...selectedItem,
                        modifierGroups: [...(selectedItem.modifierGroups ?? []), group],
                      }
                      setSelectedItem(next)
                      setCatalog((prev) => prev.map((item) => (item.id === next.id ? next : item)))
                      toast.success('Modifier group added')
                    }}
                    className="w-full rounded-md border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary"
                  >
                    + Add Modifier Group
                  </button>
                </div>
              </div>
              <RecipePanel item={selectedItem} recipe={getRecipeForItem(recipes, selectedItem.id)} />
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">86 / Availability</p>
                  <p className="text-xs text-muted-foreground">Toggle off to hide from POS and web menus</p>
                </div>
                <Switch
                  checked={availability[selectedItem.id] !== false}
                  onCheckedChange={(checked) => setAvailability((prev) => ({ ...prev, [selectedItem.id]: checked }))}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const price = Number.parseFloat(draftPrice)
                    if (!draftName.trim() || Number.isNaN(price)) {
                      toast.error('Name and a valid price are required')
                      return
                    }
                    const next = {
                      ...selectedItem,
                      name: draftName.trim(),
                      description: draftDescription,
                      price,
                      daypart: draftDaypart,
                      soldOut: availability[selectedItem.id] === false,
                    }
                    setSelectedItem(next)
                    setCatalog((prev) => prev.map((item) => (item.id === next.id ? next : item)))
                    toast.success('Item saved', { description: 'Kept in this browser session only.' })
                  }}
                  className="flex-1 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setDraftName(selectedItem.name)
                    setDraftDescription(selectedItem.description)
                    setDraftPrice(selectedItem.price.toFixed(2))
                    setDraftDaypart(selectedItem.daypart ?? 'All Day')
                    toast.message('Edits discarded')
                  }}
                  className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {importOpen && (
        <ImportMenuModal
          onClose={() => setImportOpen(false)}
          onImport={(imported) => {
            setCatalog((prev) => [...imported, ...prev])
            setAvailability((prev) => ({
              ...prev,
              ...Object.fromEntries(imported.map((item) => [item.id, true])),
            }))
            if (imported[0]) {
              setActiveCategory(imported[0].category)
              setSelectedItem(imported[0])
            }
            setImportOpen(false)
            toast.success(`Imported ${imported.length} item${imported.length === 1 ? '' : 's'}`)
          }}
        />
      )}
    </>
  )
}

function RecipePanel({ item, recipe }: { item: MenuItem; recipe?: Recipe }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Kitchen recipe</label>
      <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground">
        Description is for guests. Ingredients and cook steps below come from Recipes and update when you save.
      </p>
      {recipe ? (
        <div className="space-y-2 rounded-md border border-border px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">{recipe.name}</p>
            <span className="text-xs text-muted-foreground">
              {recipe.station} · {recipe.prepMinutes} min · {recipe.yieldQty} plate{recipe.yieldQty === 1 ? '' : 's'}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Ingredients</p>
            <ul className="mt-1 space-y-0.5 text-xs text-foreground">
              {recipe.ingredients.map((line) => (
                <li key={line.id}>
                  {line.qty} {line.unit} {line.name}
                </li>
              ))}
              {recipe.ingredients.length === 0 && (
                <li className="text-muted-foreground">No ingredients saved yet.</li>
              )}
            </ul>
          </div>
          {recipe.steps.filter(Boolean).length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cook steps</p>
              <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-xs text-foreground">
                {recipe.steps.filter(Boolean).map((step, index) => (
                  <li key={`${index}-${step}`}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          <Link
            href={`/admin/recipes?item=${item.id}`}
            className="inline-block pt-1 text-xs font-semibold text-primary hover:underline"
          >
            Edit recipe
          </Link>
        </div>
      ) : (
        <Link
          href={`/admin/recipes?item=${item.id}`}
          className="block w-full rounded-md border border-dashed border-border px-3 py-2 text-center text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          + Create recipe
        </Link>
      )}
    </div>
  )
}

function ImportMenuModal({ onClose, onImport }: { onClose: () => void; onImport: (items: MenuItem[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsed, setParsed] = useState<MenuItem[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)

  function readFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please choose a .csv file')
      return
    }
    void file.text().then((text) => {
      const rows = parseCsv(text)
      if (rows.length === 0) {
        toast.error('That CSV is empty')
        return
      }
      const header = rows[0]
      const nameIdx = Math.max(headerIndex(header, 'name', 'item'), 0)
      const priceIdx = headerIndex(header, 'price')
      const catIdx = headerIndex(header, 'cat')
      const hasHeader = headerIndex(header, 'name', 'item', 'price', 'cat') >= 0
      const body = hasHeader ? rows.slice(1) : rows
      const nextWarnings: string[] = []
      const items: MenuItem[] = []

      body.forEach((row, index) => {
        const name = row[nameIdx]?.trim()
        if (!name) return
        const priceRaw = (priceIdx >= 0 ? row[priceIdx] : row[1]) ?? ''
        const price = Number.parseFloat(priceRaw.replace(/[^0-9.]/g, ''))
        const categoryRaw = (catIdx >= 0 ? row[catIdx] : row[2])?.trim()
        const category = categoryRaw && menuCategories.includes(categoryRaw) ? categoryRaw : menuCategories[0]
        if (Number.isNaN(price)) nextWarnings.push(`Missing price on “${name}”`)
        items.push({
          id: `imp-${Date.now()}-${index}`,
          name,
          description: 'Imported from CSV',
          price: Number.isNaN(price) ? 0 : price,
          category,
          image: '/placeholder.svg',
        })
      })

      setFileName(file.name)
      setParsed(items)
      setWarnings(nextWarnings)
      if (items.length === 0) toast.error('No menu rows found')
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-scrim p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Import Menu (CSV)</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) readFile(file)
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) readFile(file)
          }}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/40 px-6 py-10 text-center',
            dragging ? 'border-primary bg-accent' : 'border-border',
          )}
        >
          <Upload className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{fileName ?? 'Drag & drop your CSV file here'}</p>
          <p className="text-xs text-muted-foreground">Columns: name, price, category — or click to browse</p>
        </button>
        <button
          type="button"
          onClick={() =>
            downloadCsv('airests-menu-template', ['name', 'price', 'category'], [
              ['Classic Smash Burger', '12.50', 'Burgers'],
              ['House Salad', '8.50', 'Salads'],
              ['Kids Chicken Tenders', '', 'Starters'],
            ])
          }
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          Download CSV template
        </button>
        <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-3">
          {parsed.length === 0 ? (
            <p className="text-sm text-muted-foreground">Choose a file to validate items before import.</p>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Check className="size-4 text-success" />
                {parsed.length} item{parsed.length === 1 ? '' : 's'} validated
              </div>
              {warnings.length > 0 && (
                <div className="flex items-start gap-2 text-sm text-warning">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {warnings.length} warning{warnings.length === 1 ? '' : 's'} — {warnings.slice(0, 2).join('; ')}
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
          <button
            disabled={parsed.length === 0}
            onClick={() => onImport(parsed)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            Import {parsed.length || ''} {parsed.length === 1 ? 'Item' : 'Items'}
          </button>
        </div>
      </div>
    </div>
  )
}
