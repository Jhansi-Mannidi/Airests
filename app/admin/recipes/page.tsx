'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { inventoryItems, menuItems } from '@/lib/mock-data'
import {
  emptyRecipe,
  getRecipeForItem,
  loadRecipes,
  newIngredientId,
  recipeFoodCost,
  recipeStations,
  recipeUnits,
  saveRecipes,
  type Recipe,
  type RecipeIngredient,
} from '@/lib/recipes'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Search } from 'lucide-react'

export default function RecipesPage() {
  return (
    <Suspense>
      <RecipesContent />
    </Suspense>
  )
}

function RecipesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemParam = searchParams.get('item')

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [draft, setDraft] = useState<Recipe | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const loaded = loadRecipes()
    setRecipes(loaded)
    const existing = itemParam ? getRecipeForItem(loaded, itemParam) : undefined
    if (itemParam && !existing) {
      const created = emptyRecipe(itemParam)
      setDraft(created)
      setIsNew(true)
    } else if (existing) {
      setDraft(structuredClone(existing))
      setIsNew(false)
    } else if (loaded[0]) {
      setDraft(structuredClone(loaded[0]))
      setIsNew(false)
    } else {
      setDraft(emptyRecipe())
      setIsNew(true)
    }
    setReady(true)
  }, [itemParam])

  const selectedItem = menuItems.find((m) => m.id === draft?.menuItemId)
  const foodCost = draft ? recipeFoodCost(draft) : 0
  const sellPrice = selectedItem?.price ?? 0
  const itemsWithoutRecipe = useMemo(
    () => menuItems.filter((m) => !recipes.some((r) => r.menuItemId === m.id)),
    [recipes],
  )
  const visibleRecipes = recipes.filter((recipe) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    const item = menuItems.find((m) => m.id === recipe.menuItemId)
    return `${recipe.name} ${recipe.station} ${item?.category ?? ''}`.toLowerCase().includes(q)
  })

  function selectRecipe(recipe: Recipe) {
    setDraft(structuredClone(recipe))
    setIsNew(false)
  }

  function startNew(menuItemId = itemsWithoutRecipe[0]?.id ?? '') {
    setDraft(emptyRecipe(menuItemId))
    setIsNew(true)
  }

  function updateDraft(patch: Partial<Recipe>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  function updateIngredient(id: string, patch: Partial<RecipeIngredient>) {
    setDraft((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ingredients: prev.ingredients.map((line) => (line.id === id ? { ...line, ...patch } : line)),
      }
    })
  }

  function addIngredient(inventoryId?: string) {
    const stock = inventoryItems.find((i) => i.id === inventoryId)
    const line: RecipeIngredient = {
      id: newIngredientId(),
      inventoryId: stock?.id,
      name: stock?.name ?? '',
      qty: 1,
      unit: stock?.unit ?? 'ea',
    }
    setDraft((prev) => (prev ? { ...prev, ingredients: [...prev.ingredients, line] } : prev))
  }

  function save() {
    if (!draft) return
    if (!draft.menuItemId) {
      toast.error('Pick a menu item first')
      return
    }
    if (!draft.name.trim()) {
      toast.error('Give the recipe a name')
      return
    }
    const cleaned: Recipe = {
      ...draft,
      name: draft.name.trim(),
      yieldQty: Math.max(1, Number(draft.yieldQty) || 1),
      prepMinutes: Math.max(1, Number(draft.prepMinutes) || 1),
      ingredients: draft.ingredients.filter((line) => line.name.trim()),
      steps: draft.steps.map((s) => s.trim()).filter(Boolean),
    }
    const next = isNew
      ? [...recipes.filter((r) => r.menuItemId !== cleaned.menuItemId), cleaned]
      : recipes.map((r) => (r.id === cleaned.id ? cleaned : r))
    const already = recipes.find((r) => r.menuItemId === cleaned.menuItemId && r.id !== cleaned.id)
    const merged = already ? next.filter((r) => r.id !== already.id) : next
    saveRecipes(merged)
    setRecipes(merged)
    setDraft(cleaned)
    setIsNew(false)
    toast.success('Recipe saved — showing on Menu Builder', {
      description: `${cleaned.name} · ${cleaned.ingredients.length} ingredients`,
    })
    router.push(`/admin/menu?item=${cleaned.menuItemId}`)
  }

  function removeRecipe() {
    if (!draft || isNew) {
      setDraft(recipes[0] ? structuredClone(recipes[0]) : emptyRecipe())
      setIsNew(!recipes[0])
      return
    }
    const next = recipes.filter((r) => r.id !== draft.id)
    saveRecipes(next)
    setRecipes(next)
    setDraft(next[0] ? structuredClone(next[0]) : emptyRecipe())
    setIsNew(!next[0])
    toast.success('Recipe removed')
  }

  if (!ready || !draft) return null

  return (
    <>
      <AdminTopbar title="Recipes" />
      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex shrink-0 flex-col border-b border-border bg-card lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Kitchen recipes</h2>
              <p className="text-xs text-muted-foreground">{recipes.length} linked to the menu</p>
            </div>
            <button
              type="button"
              onClick={() => startNew()}
              className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              + New
            </button>
          </div>
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes…"
                className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="max-h-[42vh] flex-1 space-y-1 overflow-y-auto px-2 pb-3 lg:max-h-none">
            {visibleRecipes.map((recipe) => {
              const item = menuItems.find((m) => m.id === recipe.menuItemId)
              const active = !isNew && draft.id === recipe.id
              return (
                <button
                  key={recipe.id}
                  type="button"
                  onClick={() => selectRecipe(recipe)}
                  className={cn(
                    'w-full rounded-md px-3 py-2.5 text-left transition-colors',
                    active ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary',
                  )}
                >
                  <p className="truncate text-sm font-medium">{recipe.name}</p>
                  <p className={cn('mt-0.5 text-xs', active ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                    {item?.category ?? 'Unlinked'} · {recipe.ingredients.length} ingredients · {recipe.station}
                  </p>
                </button>
              )
            })}
            {visibleRecipes.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                {query ? 'No recipes match this search.' : 'No recipes yet. Create one for a menu item.'}
              </p>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className="border-b border-border px-4 py-3 md:px-6">
            <p className="text-sm text-muted-foreground">
              A recipe is for the kitchen, not the guest. The menu description still sells the dish. This list tells
              Priya what to pull from the walk-in and how to cook one plate.
            </p>
          </div>

          <div className="mx-auto w-full max-w-3xl space-y-5 p-4 md:p-6">
            {isNew && (
              <div className="rounded-lg border border-dashed border-primary/40 bg-accent px-3 py-2 text-sm text-foreground">
                Creating a new recipe{selectedItem ? ` for ${selectedItem.name}` : ''}. Save to keep it in this browser session.
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Linked menu item
                <select
                  value={draft.menuItemId}
                  onChange={(e) => {
                    const id = e.target.value
                    const item = menuItems.find((m) => m.id === id)
                    updateDraft({ menuItemId: id, name: item?.name ?? draft.name })
                  }}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a dish…</option>
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                      {recipes.some((r) => r.menuItemId === item.id && r.id !== draft.id) ? ' (has recipe)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                Recipe name
                <input
                  value={draft.name}
                  onChange={(e) => updateDraft({ name: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <label className="block text-xs font-medium text-muted-foreground">
                Kitchen station
                <select
                  value={draft.station}
                  onChange={(e) => updateDraft({ station: e.target.value as Recipe['station'] })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {recipeStations.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                Makes (plates)
                <input
                  type="number"
                  min={1}
                  value={draft.yieldQty}
                  onChange={(e) => updateDraft({ yieldQty: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                Prep time (min)
                <input
                  type="number"
                  min={1}
                  value={draft.prepMinutes}
                  onChange={(e) => updateDraft({ prepMinutes: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="rounded-md border border-border px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">Est. food cost</p>
                <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-foreground">${foodCost.toFixed(2)}</p>
                {sellPrice > 0 && (
                  <p className="text-[11px] text-muted-foreground">{Math.round((foodCost / sellPrice) * 100)}% of ${sellPrice.toFixed(2)}</p>
                )}
              </div>
            </div>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Ingredients</h3>
                  <p className="text-xs text-muted-foreground">What comes out of inventory when this dish is sold.</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Item</th>
                      <th className="w-24 px-3 py-2 font-medium">Qty</th>
                      <th className="w-28 px-3 py-2 font-medium">Unit</th>
                      <th className="w-10 px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {draft.ingredients.map((line) => (
                      <tr key={line.id} className="border-t border-border">
                        <td className="px-3 py-2">
                          <input
                            value={line.name}
                            onChange={(e) => updateIngredient(line.id, { name: e.target.value, inventoryId: undefined })}
                            placeholder="Ingredient name"
                            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            step={0.25}
                            value={line.qty}
                            onChange={(e) => updateIngredient(line.id, { qty: Number(e.target.value) })}
                            className="w-full rounded-md border border-border bg-background px-2 py-1.5 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={line.unit}
                            onChange={(e) => updateIngredient(line.id, { unit: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                          >
                            {recipeUnits.map((u) => (
                              <option key={u}>{u}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() =>
                              setDraft((prev) =>
                                prev ? { ...prev, ingredients: prev.ingredients.filter((i) => i.id !== line.id) } : prev,
                              )
                            }
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-danger"
                            aria-label="Remove ingredient"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {draft.ingredients.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No ingredients yet. Add from inventory below.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (!e.target.value) return
                    addIngredient(e.target.value)
                    e.target.value = ''
                  }}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">+ Add from inventory…</option>
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.onHand} {item.unit} on hand)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addIngredient()}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <Plus className="size-3.5" />
                  Custom ingredient
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground">Cook steps</h3>
              <p className="mb-2 text-xs text-muted-foreground">Short instructions for the station. Not shown to guests.</p>
              <div className="space-y-2">
                {draft.steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="mt-2 w-5 shrink-0 text-xs font-semibold text-muted-foreground">{index + 1}.</span>
                    <input
                      value={step}
                      onChange={(e) =>
                        setDraft((prev) =>
                          prev
                            ? { ...prev, steps: prev.steps.map((s, i) => (i === index ? e.target.value : s)) }
                            : prev,
                        )
                      }
                      placeholder="What should the cook do?"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) =>
                          prev ? { ...prev, steps: prev.steps.filter((_, i) => i !== index) } : prev,
                        )
                      }
                      className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-danger"
                      aria-label="Remove step"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setDraft((prev) => (prev ? { ...prev, steps: [...prev.steps, ''] } : prev))}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  + Add step
                </button>
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={save}
                className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Save recipe
              </button>
              <button
                type="button"
                onClick={removeRecipe}
                className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {isNew ? 'Cancel' : 'Delete recipe'}
              </button>
              {draft.menuItemId && (
                <Link href={`/admin/menu?item=${draft.menuItemId}`} className="ml-auto text-sm font-medium text-primary hover:underline">
                  Back to Menu Builder
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
