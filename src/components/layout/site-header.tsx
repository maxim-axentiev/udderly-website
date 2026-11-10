import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { ChevronDownIcon, CloseIcon, MenuIcon } from '@/components/icons'
import { chromeLinkProps, type ChromeNavItem, type SiteChrome } from '@/lib/site-chrome'

const topLink =
  'font-display text-[0.95rem] font-bold uppercase text-headline no-underline decoration-secondary-accent decoration-[3px] underline-offset-8 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-accent rounded-sm'

function DesktopDropdown({ group, alignEnd = false }: { group: ChromeNavItem; alignEnd?: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const id = `nav-${group.label.toLowerCase().replace(/\s+/g, '-')}`

  useEffect(() => {
    if (!open) return
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!ref.current?.contains(document.activeElement)) setOpen(false)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          setOpen(false)
          toggleRef.current?.focus()
        }
      }}
    >
      <div className="flex items-center gap-1">
        {group.href ? (
          <a href={group.href} className={topLink} {...chromeLinkProps({ label: group.label, href: group.href, openInNewTab: group.openInNewTab })}>
            {group.label}
          </a>
        ) : (
          <button
            type="button"
            className={topLink}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={id}
          >
            {group.label}
          </button>
        )}
        <button
          type="button"
          ref={toggleRef}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={id}
          aria-label={`${open ? 'Close' : 'Open'} ${group.label} menu`}
          className="rounded-sm p-0.5 text-headline focus-visible:outline-2 focus-visible:outline-primary-accent"
        >
          <ChevronDownIcon size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div id={id} className={`absolute top-full z-50 pt-4 ${alignEnd ? 'right-0' : 'left-1/2 -translate-x-1/2'} ${open ? 'block' : 'hidden'}`}>
        <ul className="w-72 border-2 border-headline bg-background p-2 shadow-[7px_7px_0_var(--color-secondary-accent)]">
          {group.children?.map((child) => (
            <li key={`${child.href}-${child.label}`}>
              <a
                href={child.href}
                onClick={() => setOpen(false)}
                className="block rounded-sm px-4 py-3 font-display text-base font-bold uppercase text-headline no-underline hover:bg-farm-beige focus-visible:bg-farm-beige focus-visible:outline-2 focus-visible:outline-primary-accent"
                {...chromeLinkProps(child)}
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MobileGroup({ group, onNavigate }: { group: ChromeNavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  const id = `m-nav-${group.label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <li className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between py-4 text-left font-display text-xl font-bold uppercase text-headline"
      >
        {group.label}
        <ChevronDownIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <ul id={id} className={`${open ? 'block' : 'hidden'} pb-3 pl-4`}>
        {group.href ? (
          <li>
            <a href={group.href} onClick={onNavigate} className="block py-2.5 font-display text-lg font-semibold uppercase text-headline no-underline hover:text-primary-accent">
              {group.label}
            </a>
          </li>
        ) : null}
        {group.children?.map((child) => (
          <li key={`${child.href}-${child.label}`}>
            <a
              href={child.href}
              onClick={onNavigate}
              className="block py-2.5 font-display text-lg font-semibold uppercase text-headline no-underline hover:text-primary-accent"
              {...chromeLinkProps(child)}
            >
              {child.label}
            </a>
          </li>
        ))}
      </ul>
    </li>
  )
}

export function SiteHeader({ chrome }: { chrome: SiteChrome }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)')
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    if (!mobileOpen) return () => { document.body.style.overflow = '' }

    const toggle = mobileToggleRef.current
    const panel = mobilePanelRef.current
    panel?.querySelector<HTMLElement>('button, a[href]')?.focus()

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMobileOpen(false)
        toggle?.focus()
      }
      if (event.key !== 'Tab' || !panel || !toggle) return
      const focusable = [toggle, ...panel.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')]
        .filter((item) => item.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onEscape)
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b-2 border-headline bg-background">
      <div className="mx-auto flex min-h-24 max-w-[1500px] items-center justify-between gap-6 px-5 md:px-8">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="group flex w-44 shrink-0 items-center rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary-accent md:w-56"
          aria-label={`${chrome.siteName} home`}
        >
          <img src="/images/udderly-logo.png" alt="" width={1588} height={629} className="block h-auto w-full" />
        </Link>

        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-6" aria-label="Main navigation">
          {chrome.primaryNav.map((group, index) =>
            group.children?.length ? (
              <DesktopDropdown key={group.label} group={group} alignEnd={index >= chrome.primaryNav.length - 2} />
            ) : (
              <a key={group.label} href={group.href} className={topLink} {...(group.href ? chromeLinkProps({ ...group, href: group.href }) : {})}>
                {group.label}
              </a>
            ),
          )}
        </nav>

        <button
          ref={mobileToggleRef}
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          className="flex size-12 items-center justify-center rounded-full border-2 border-headline bg-farm-beige text-headline xl:hidden"
        >
          {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {mobileOpen ? (
        <div
          ref={mobilePanelRef}
          id="mobile-nav"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-6rem)] overflow-y-auto border-b-2 border-headline bg-background px-5 pb-8 shadow-[0_7px_0_var(--color-secondary-accent)] xl:hidden"
        >
          <nav aria-label="Mobile navigation">
            <ul>
              {chrome.primaryNav.map((group) =>
                group.children?.length ? (
                  <MobileGroup key={group.label} group={group} onNavigate={() => setMobileOpen(false)} />
                ) : (
                  <li key={group.label} className="border-b border-border">
                    <a
                      href={group.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 font-display text-xl font-bold uppercase text-headline no-underline"
                      {...(group.href ? chromeLinkProps({ ...group, href: group.href }) : {})}
                    >
                      {group.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
