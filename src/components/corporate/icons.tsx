import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    />
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12.5 9.2 17 19 7" />
    </Icon>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5L15 15" />
    </Icon>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="9" r="3" />
      <circle cx="16" cy="10" r="2.2" />
      <path d="M4.5 18.5c.6-2.4 2.4-3.8 4.5-3.8s3.9 1.4 4.5 3.8" />
      <path d="M14.5 14.8c1.6.2 3 .9 3.6 2.7" />
    </Icon>
  )
}

export function MonitorIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </Icon>
  )
}

export function CoffeeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 8h9v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <path d="M15 9h1.5a2.5 2.5 0 0 1 0 5H15" />
      <path d="M8 4.5c.4.8.4 1.4 0 2.2" />
      <path d="M11 4.5c.4.8.4 1.4 0 2.2" />
    </Icon>
  )
}

export function CarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 14.5 6 8.5A2 2 0 0 1 7.8 7h8.4a2 2 0 0 1 1.8 1.5l2 6" />
      <path d="M4 14.5h16V17a1 1 0 0 1-1 1h-1.2" />
      <path d="M6.2 18H5a1 1 0 0 1-1-1v-2.5" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </Icon>
  )
}

export function TreesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21v-6" />
      <path d="m12 15-4 0 4-5 4 5Z" />
      <path d="m12 10-3.2 0L12 5l3.2 5Z" />
    </Icon>
  )
}

export function ShuffleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 4h4v4" />
      <path d="M20 4 4 20" />
      <path d="M16 20h4v-4" />
      <path d="m4 4 5 5" />
      <path d="m13 13 7 7" />
    </Icon>
  )
}

export function PuzzleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4h3a1 1 0 0 1 1 1v1a2 2 0 1 0 4 0V5a1 1 0 0 1 1-1h3v5h-2a2 2 0 1 0 0 4h2v6H4v-6h2a2 2 0 1 0 0-4H4V4h4" />
    </Icon>
  )
}

export function SlidersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <circle cx="16" cy="7" r="2" />
      <path d="M4 17h2" />
      <path d="M10 17h10" />
      <circle cx="8" cy="17" r="2" />
    </Icon>
  )
}

export function AwardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="9" r="5" />
      <path d="m9 13.5-1 7 4-2 4 2-1-7" />
    </Icon>
  )
}

export function StarGlyphIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 3 2.4 5 5.6.8-4 3.9.9 5.5L12 16.8 7.1 18.2l.9-5.5-4-3.9 5.6-.8Z" />
    </Icon>
  )
}

export function ThumbsUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 11v8H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h3Z" />
      <path d="M8 11 11 4.5A2 2 0 0 1 14.5 6V9H19a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 18 19H8" />
    </Icon>
  )
}

export function SparklesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="m5 12 4 .5" />
      <path d="m15 11.5 4 .5" />
      <path d="m7 7 2.5 2.5" />
      <path d="m14.5 14.5 2.5 2.5" />
      <path d="m17 7-2.5 2.5" />
      <path d="m9.5 14.5-2.5 2.5" />
    </Icon>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 19s-7-4.2-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.8-7 9-7 9Z" />
    </Icon>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </Icon>
  )
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10v4l12 4V6L4 10Z" />
      <path d="M16 9.5c1.5.6 2.5 1.6 2.5 2.5s-1 1.9-2.5 2.5" />
      <path d="M7 14.5V18a2 2 0 0 0 2 2h.5" />
    </Icon>
  )
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    </Icon>
  )
}

export function LandmarkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10h16" />
      <path d="M6 10v7" />
      <path d="M10 10v7" />
      <path d="M14 10v7" />
      <path d="M18 10v7" />
      <path d="M3 17h18" />
      <path d="m4 10 8-5 8 5" />
    </Icon>
  )
}

export function TractorIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="7" cy="17" r="2.5" />
      <circle cx="17" cy="16" r="3" />
      <path d="M9.5 17H14" />
      <path d="M14 16V8h4l2 4v4" />
      <path d="M7 14.5V9h5" />
    </Icon>
  )
}

export function HotelIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20V6h10v14" />
      <path d="M14 10h6v10" />
      <path d="M8 9h2" />
      <path d="M8 13h2" />
      <path d="M3 20h18" />
    </Icon>
  )
}

export function UtensilsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 3v8" />
      <path d="M4 3v4a2 2 0 0 0 4 0V3" />
      <path d="M6 11v10" />
      <path d="M16 3c-2 3-2 6 0 8v10" />
      <path d="M16 11h2" />
    </Icon>
  )
}

export function PaletteIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4a8 8 0 1 0 0 16h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1-2-2 6 6 0 0 1 2-10Z" />
      <circle cx="8" cy="10" r="0.8" fill="currentColor" />
      <circle cx="10" cy="7" r="0.8" fill="currentColor" />
      <circle cx="14" cy="7" r="0.8" fill="currentColor" />
    </Icon>
  )
}

export function BuildingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 20V5h8v15" />
      <path d="M13 9h6v11" />
      <path d="M8 8h2" />
      <path d="M8 12h2" />
      <path d="M16 13h2" />
      <path d="M3 20h18" />
    </Icon>
  )
}

export function WineIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4h8l-1 6a4 4 0 0 1-8 0L8 4Z" />
      <path d="M12 14v6" />
      <path d="M9 20h6" />
    </Icon>
  )
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.2 2.2 3.3 4.8 3.3 8S14.2 17.8 12 20c-2.2-2.2-3.3-4.8-3.3-8S9.8 6.2 12 4Z" />
    </Icon>
  )
}
