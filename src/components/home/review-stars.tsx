import { StarIcon } from '@/components/icons'

export function ReviewStars({
  rating,
  label,
  size = 16,
}: {
  rating: number | null
  label: string
  size?: number
}) {
  const filled = rating ? Math.round(Math.min(Math.max(rating, 0), 5)) : 5

  return (
    <span className="flex gap-0.5 text-primary-accent" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} size={size} filled={i < filled} />
      ))}
    </span>
  )
}
