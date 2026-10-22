# Redirect proposal

Only one redirect is implemented, and only on the new staging site.

| From | To | Status | Why |
|---|---|---|---|
| `/private-mini-highland-experience` | `/mini-highland-cow-experience` | 301 | The private visit is consolidated onto the existing Mini Highland Cow page. |
| `/private-mini-highland-experience/` | `/mini-highland-cow-experience` | 301 | The same rule. The trailing slash is normalized before matching. |

No other redirect is proposed. These were not added because the WordPress export and Search Console page export were not available:

- Homepage aliases
- `/stay` to `/farm-glamping`
- `/corporate` to `/corporate-training`
- `/our-farm` to the market, ice cream, or story
- `/urbort` to `/urbort-blog`
- Individual animal, blog, and experience URLs from WordPress

Those older homepage links were already corrected inside the published homepage document. That is not the same as an HTTP redirect for visitors who still have the old URL.

Do not copy this staging rule into WordPress, Cloudflare, or DNS from this change.
