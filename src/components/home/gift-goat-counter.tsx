import { useEffect, useRef, useState } from 'react'

export function GiftGoatCounter({ target = 118 }: { target?: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const run = () => {
      if (started.current) return
      started.current = true

      if (reduceMotion.matches) {
        setValue(target)
        return
      }

      const duration = 3000
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(eased * target))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && run()),
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target])

  return (
    <span
      ref={ref}
      className="block font-display text-[clamp(5rem,14vw,10rem)] font-black leading-[0.8] text-primary-accent tabular-nums"
    >
      {value}
    </span>
  )
}
