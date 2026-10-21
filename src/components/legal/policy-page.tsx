import { Fragment } from 'react'

import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import type { LegalPageContent } from '@/lib/legal/resolve'

function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*.*?\*\*|https:\/\/[^\s]+|info@udderlyridiculousfarmlife\.com|Privacy Policy|Cookies Policy)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('https://')) {
      const href = part.replace(/\.$/, '')
      return (
        <a key={index} href={href} className="break-words underline hover:text-primary-accent">
          {part}
        </a>
      )
    }
    if (part.includes('@')) {
      return (
        <a key={index} href={`mailto:${part}`} className="break-words underline hover:text-primary-accent">
          {part}
        </a>
      )
    }
    if (part === 'Privacy Policy' || part === 'Cookies Policy') {
      const href = part === 'Privacy Policy' ? '/privacy-policy' : '/cookies-policy'
      return (
        <a key={index} href={href} className="underline hover:text-primary-accent">
          {part}
        </a>
      )
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}

export function LegalPolicyPage({ page }: { page: LegalPageContent }) {
  return (
    <article className="bg-background px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-5xl font-black uppercase leading-tight text-headline md:text-6xl">
          {page.title}
        </h1>
        {page.body ? (
          <div className="mt-8 text-base leading-7">
            <PortableTextRenderer value={page.body} />
          </div>
        ) : (
          <div className="mt-8 space-y-6 text-base leading-7">
            {page.blocks.map((block, index) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={index} className="pt-5 font-display text-2xl font-bold text-headline">
                    {block.text}
                  </h2>
                )
              }
              if (block.type === 'list') {
                return (
                  <ul key={index} className="list-disc space-y-2 pl-6">
                    {block.items.map((item) => (
                      <li key={item}>
                        <InlineText text={item} />
                      </li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={index}>
                  {block.lines.map((line, lineIndex) => (
                    <Fragment key={line}>
                      {lineIndex > 0 ? <br /> : null}
                      <InlineText text={line} />
                    </Fragment>
                  ))}
                </p>
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}
