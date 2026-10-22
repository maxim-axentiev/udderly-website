# Redirect proposal

Only one redirect is implemented, and only on the new staging site. Public WordPress and DNS were not changed.

| From | To | Clicks | Impressions | Status |
|---|---|---:|---:|---|
| `/private-mini-highland-experience` | `/mini-highland-cow-experience` | 2,876 | 212,375 | 301 on staging, both slash forms |

The WordPress page is still published in the extract, with stored robots `index`, focus keyword `private mini highland cow experience`, and Rank Math title `The Original Private Mini Highland Cow Experience | Udderly Ridiculous`. Turn this redirect on for the public site only when the consolidated page is published and its description covers a private session. Until then the staging destination is a 404.

## Proposed, not implemented

These destinations are existing routes or unpublished draft slugs. They are not in `redirects.ts`.

| From | To | Clicks | Why |
|---|---|---:|---|
| `/faqs` | `/faq` | 206 | WordPress title is FAQs. |
| `/adopt-an-animal/adopt-clara` | `/adopt-an-animal/clara` | 1,049 | Draft slug is `clara`. |
| `/winston` | `/animals-for-sale/winston` | 365 | Draft listing slug is `winston`. |
| `/adopt-an-animal/adopt-chicken` | `/adopt-an-animal/chicken` | 223 | Draft slug is `chicken`. |
| `/oreo` | `/animals-for-sale/oreo` | 161 | Draft listing slug is `oreo`. |
| `/gift-certificate` | `/gift-card` | 36 | WordPress title is Gift Certificate for Experiences. |
| `/adopt-an-animal/adopt-stanley` | `/adopt-an-animal/stanley` | 3 | Draft slug is `stanley`. |
| `/adopt-an-animal/adopt-greg` | `/adopt-an-animal/greg` | 1 | Draft slug is `greg`. |
| `/adopt-an-animal/adopt-sassafras` | `/adopt-an-animal/sassafras` | 1 | Draft slug is `sassafras`. |
| `/subscribe-to-newsletter` | `/newsletter` | 1 | WordPress title is Subscribe to Newsletter. |
| `/our-vision` | `/vision-values` | 0 | 1,174 impressions. Title is Our Vision. |
| `/privacy-policy-2` | `/privacy-policy` | 0 | WordPress slug ends in `-2`. |
| `/experiential-tourism-development` | `/corporate-training/experiential-tourism-development` | 0 | Title matches the program route. |
| `/private-miniature-donkey-lunch-picnic` | `/miniature-donkey-lunch-picnic` | 0 | Public path is already the WordPress URL and the canonical experience path. |
| `/private-miniature-donkey-sunset-picnic` | `/miniature-donkey-sunset-picnic` | 0 | Same as the lunch picnic. |

Do not enable the animal or adoption redirects until those drafts are published. A redirect to a 404 wastes the clicks.

## Left without a destination

These have clicks and no safe target:

| Path | Clicks | Impressions |
|---|---:|---:|
| `/mini-cattle-for-sale` | 477 | 11,012 |
| `/promotions` | 336 | 55,717 |
| `/cow-wedding` | 136 | 5,205 |
| `/team-building-farm-experiences` | 94 | 10,330 |
| `/cheryl-haskett` | 64 | 1,747 |
| `/escape-to-the-countryside-farm-glamping` | 53 | 1,869 |
| `/goatscaping` | 36 | 1,416 |

`/tower-of-goats` is a published WordPress page titled Tower of Goats. The new route is `/tower-of-goats-discovery-trail`. Those names are related and were not treated as the same URL. `/private-miniature-donkey-visits` is its own WordPress page. It was not folded into `/miniature-donkey-visits`. `/urbort-blog/alpaca-breeding` was not pointed at the `viral-alpaca-moment` draft. Media URLs under `/wp-content/` stay unmatched.
