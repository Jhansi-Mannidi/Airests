import { cn } from '@/lib/utils'
import { getItemDiet, type DietType, type MenuItem } from '@/lib/mock-data'

export function DietMark({
  diet,
  showLabel = false,
  size = 'md',
  className,
}: {
  diet: DietType
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}) {
  const veg = diet === 'veg'
  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      title={veg ? 'Vegetarian' : 'Non-vegetarian'}
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-[2px] border bg-white',
          veg ? 'border-emerald-700' : 'border-red-700',
          size === 'sm' ? 'size-3.5' : 'size-4',
        )}
      >
        <span
          className={cn(
            'rounded-full',
            veg ? 'bg-emerald-700' : 'bg-red-700',
            size === 'sm' ? 'size-1.5' : 'size-2',
          )}
        />
      </span>
      {showLabel && (
        <span className={cn('text-[11px] font-semibold', veg ? 'text-emerald-700' : 'text-red-700')}>
          {veg ? 'Veg' : 'Non-Veg'}
        </span>
      )}
    </span>
  )
}

export function ItemDietMark({
  item,
  showLabel = false,
  size = 'md',
  className,
}: {
  item: MenuItem
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}) {
  return <DietMark diet={getItemDiet(item)} showLabel={showLabel} size={size} className={className} />
}

export const dietFilters: Array<{ id: 'all' | DietType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'veg', label: 'Veg' },
  { id: 'non-veg', label: 'Non-Veg' },
]
