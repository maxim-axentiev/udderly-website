const CATEGORY_LABELS: Record<string, string> = {
  farmExperience: 'Farm experience',
  workshop: 'Workshop',
  overnight: 'Overnight stay',
  event: 'Event',
  seasonal: 'Seasonal experience',
  other: 'Experience',
}

const SEASON_LABELS: Record<string, string> = {
  yearRound: 'Year-round',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
}

const SESSION_LABELS: Record<string, string> = {
  shared: 'Shared',
  private: 'Private',
  either: 'Shared or private',
}

export function experienceCategoryLabel(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  return CATEGORY_LABELS[value] ?? value
}

export function experienceSeasonLabel(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  return SEASON_LABELS[value] ?? value
}

export function experienceSessionLabel(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  return SESSION_LABELS[value] ?? value
}
