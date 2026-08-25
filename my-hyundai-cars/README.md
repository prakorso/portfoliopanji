# My Hyundai Cars

A single-page site for **My Hyundai Cars** — an independent Hyundai consultation
service. Not a shop, not a marketplace, not the official Hyundai Indonesia site.

The whole experience lives at one route (`/`) and runs Hero → Discovery →
Personal → Business → Models → How It Works → Why Us → Final CTA → Footer.
Every conversion CTA opens WhatsApp; every navigation CTA smooth-scrolls;
Trade-In is the only outbound link, to Hasa Motor.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build
```

Stack: React 18 + TypeScript + Vite 6 + Tailwind CSS 4 + lucide-react.
Fonts (Inter Tight / Inter / IBM Plex Mono) are self-hosted via Fontsource, so
the page makes no third-party requests at runtime.

## Things you will want to change

| What | Where |
| --- | --- |
| WhatsApp sales number | `WHATSAPP_NUMBER` in `src/config/site.ts` |
| WhatsApp message copy | `WA_MESSAGES` in `src/config/site.ts` |
| Trade-In destination | `TRADE_IN_URL` in `src/config/site.ts` |
| Contact email | `CONTACT_EMAIL` in `src/config/site.ts` |
| Models in the carousel | `src/data/models.ts` |
| Section copy | `src/data/content.ts` |
| Navigation | `src/data/nav.ts` |

The number is deliberately defined once. `createWhatsAppLink(message)` and
`whatsAppLinkFor(intent)` are the only ways components build a WhatsApp URL.

### Adding a model

Append to `MODELS` in `src/data/models.ts`:

```ts
{ id: 'tucson', name: 'TUCSON', category: 'SUV', statement: '…', photo: '/models/tucson.jpg' }
```

`id` selects the studio render in `src/components/art/carSpecs.ts`. If the id has
no entry there, add one with `buildSpec({ lengthMm, heightMm, wheelbaseMm, … })` —
the generator derives the whole silhouette from real vehicle dimensions.

## About the imagery

This prototype was built in an environment with no access to external image
hosts, so the vehicle imagery is generated as vector studio renders rather than
photography. They are placeholders with the right proportions, not likenesses of
specific Hyundai vehicles.

Dropping in approved photography needs no refactor: give a model a `photo` URL
and `VehicleImage` renders it over the render. If the photo fails to load, the
render stays visible — the page has no broken-image state by construction.

## Deliberately not interactive

Model cards, Personal categories and Business categories are informational. They
carry no link, button, click handler, pointer cursor or hover affordance, and no
arrows. The only arrows on the page are the carousel's previous/next controls,
which sit outside the cards.
