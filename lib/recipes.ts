import { inventoryItems, menuItems } from '@/lib/mock-data'
import { useEffect, useState } from 'react'

export const recipeStations = ['Grill', 'Fry', 'Salad', 'Expo', 'Bar'] as const
export type RecipeStation = (typeof recipeStations)[number]

export const recipeUnits = ['ea', 'slices', 'oz', 'lb', 'g', 'ml', 'cup', 'tbsp', 'heads'] as const

export type RecipeIngredient = {
  id: string
  inventoryId?: string
  name: string
  qty: number
  unit: string
}

export type Recipe = {
  id: string
  menuItemId: string
  name: string
  station: RecipeStation
  yieldQty: number
  prepMinutes: number
  ingredients: RecipeIngredient[]
  steps: string[]
}

export const defaultRecipes: Recipe[] = [
  {
    id: 'rc-1',
    menuItemId: 'mi-1',
    name: 'Classic Smash Burger',
    station: 'Grill',
    yieldQty: 1,
    prepMinutes: 8,
    ingredients: [
      { id: 'ri-1', inventoryId: 'inv-2', name: 'Angus smash patties', qty: 2, unit: 'ea' },
      { id: 'ri-2', inventoryId: 'inv-1', name: 'Brioche buns', qty: 1, unit: 'ea' },
      { id: 'ri-3', inventoryId: 'inv-5', name: 'American cheese', qty: 1, unit: 'slices' },
      { id: 'ri-4', inventoryId: 'inv-8', name: 'Pickle chips', qty: 0.5, unit: 'oz' },
      { id: 'ri-5', inventoryId: 'inv-7', name: 'House sauce', qty: 0.75, unit: 'oz' },
    ],
    steps: [
      'Toast the brioche bun cut-side down.',
      'Smash two patties on a hot plancha; season.',
      'Add cheese to the top patty to melt.',
      'Sauce the bun, stack patties, pickles, close, and send.',
    ],
  },
  {
    id: 'rc-2',
    menuItemId: 'mi-3',
    name: 'Mushroom Swiss Burger',
    station: 'Grill',
    yieldQty: 1,
    prepMinutes: 10,
    ingredients: [
      { id: 'ri-6', inventoryId: 'inv-2', name: 'Angus smash patties', qty: 1, unit: 'ea' },
      { id: 'ri-7', inventoryId: 'inv-1', name: 'Brioche buns', qty: 1, unit: 'ea' },
      { id: 'ri-8', inventoryId: 'inv-6', name: 'Swiss cheese', qty: 1, unit: 'slices' },
      { id: 'ri-9', inventoryId: 'inv-10', name: 'Sautéed mushrooms', qty: 2, unit: 'oz' },
      { id: 'ri-10', inventoryId: 'inv-13', name: 'Garlic aioli', qty: 0.5, unit: 'oz' },
    ],
    steps: [
      'Warm mushrooms on the flat top.',
      'Grill the patty to temp; top with Swiss and mushrooms.',
      'Aioli the toasted bun and assemble.',
    ],
  },
  {
    id: 'rc-3',
    menuItemId: 'mi-7',
    name: 'Classic Caesar Salad',
    station: 'Salad',
    yieldQty: 1,
    prepMinutes: 5,
    ingredients: [
      { id: 'ri-11', inventoryId: 'inv-3', name: 'Romaine', qty: 0.5, unit: 'heads' },
      { id: 'ri-12', inventoryId: 'inv-14', name: 'Caesar dressing', qty: 1.5, unit: 'oz' },
      { id: 'ri-13', inventoryId: 'inv-15', name: 'Parmesan', qty: 0.5, unit: 'oz' },
      { id: 'ri-14', inventoryId: 'inv-16', name: 'Garlic croutons', qty: 1, unit: 'oz' },
    ],
    steps: [
      'Chop and dry the romaine.',
      'Toss with dressing, parmesan, and croutons.',
      'Plate and finish with extra parmesan.',
    ],
  },
]

const STORAGE_KEY = 'airests-recipes'

let cachedRecipes: Recipe[] | null = null
const listeners = new Set<() => void>()

function emitRecipesChanged() {
  listeners.forEach((listener) => listener())
}

export function subscribeRecipes(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function emptyRecipe(menuItemId = ''): Recipe {
  const item = menuItems.find((m) => m.id === menuItemId)
  return {
    id: `rc-${Date.now()}`,
    menuItemId,
    name: item?.name ?? 'New recipe',
    station: item?.category === 'Salads' || item?.category === 'Bowls' ? 'Salad' : item?.category === 'Drinks' ? 'Bar' : 'Grill',
    yieldQty: 1,
    prepMinutes: 8,
    ingredients: [],
    steps: [''],
  }
}

export function loadRecipes(): Recipe[] {
  if (typeof window === 'undefined') return defaultRecipes
  if (cachedRecipes) return cachedRecipes
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      cachedRecipes = defaultRecipes.map((r) => structuredClone(r))
      return cachedRecipes
    }
    const parsed = JSON.parse(raw) as Recipe[]
    cachedRecipes = Array.isArray(parsed) ? parsed : defaultRecipes.map((r) => structuredClone(r))
    return cachedRecipes
  } catch {
    cachedRecipes = defaultRecipes.map((r) => structuredClone(r))
    return cachedRecipes
  }
}

export function saveRecipes(recipes: Recipe[]) {
  cachedRecipes = recipes
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
  }
  emitRecipesChanged()
}

export function getRecipeForItem(recipes: Recipe[], menuItemId: string) {
  return recipes.find((r) => r.menuItemId === menuItemId)
}

export function recipeFoodCost(recipe: Recipe) {
  return recipe.ingredients.reduce((sum, line) => {
    const stock = inventoryItems.find((i) => i.id === line.inventoryId || i.name === line.name)
    const unitCost = stock?.cost ?? 0
    return sum + line.qty * unitCost
  }, 0)
}

export function newIngredientId() {
  return `ri-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadRecipes())

  useEffect(() => {
    const refresh = () => setRecipes(loadRecipes())
    refresh()
    return subscribeRecipes(refresh)
  }, [])

  return recipes
}

