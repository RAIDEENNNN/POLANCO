# Polanco Motors

A responsive, single-page premium car dealership website built with plain HTML, CSS, and JavaScript. It has no build step and can be deployed to any static host.

## Run locally

Run the full website and backend API with Node.js 18 or newer:

```sh
npm start
```

Then visit `http://localhost:4173`.

Opening `index.html` directly still works as an offline frontend preview, but enquiries are only saved when the Node server is running.

## API

- `GET /api/health` — service status
- `GET /api/vehicles` — complete inventory; accepts `?type=suv`
- `GET /api/promotions` — active promotional offers
- `GET /api/config` — public WhatsApp and social configuration
- `POST /api/leads` — validates and stores customer enquiries

New enquiries are stored in `data/leads.json`. For a public launch, replace this file storage with a managed database and restrict access to customer data.

## Before launch

1. Copy `.env.example` values into your hosting provider's environment settings and replace all placeholder social URLs.
2. Connect `POST /api/leads` to your CRM or managed database for production.
3. Confirm the displayed address, phone number, opening hours, vehicle prices, and financing rate.
4. Download and self-host the remote vehicle photography if the site must work fully offline.

## Included

- Responsive desktop and mobile layout
- Filterable vehicle inventory
- Interactive vehicle detail dialogs
- Live financing calculator
- Mobile navigation
- Concierge enquiry form
- Accessible keyboard interactions and reduced-motion support
- Search/social metadata, favicon, and crawler configuration
- Click-to-call, email, and WhatsApp contact links
- Twelve-vehicle inventory powered by an API
- On-page promotions powered by an API
- Validated enquiry capture with rate limiting and JSON persistence
- Configurable Instagram, Facebook, TikTok, X, YouTube, and WhatsApp links

## Project files

- `index.html` — page structure and content
- `styles.css` — responsive visual system
- `script.js` — inventory, dialogs, navigation, and finance logic
- `assets/favicon.svg` — Polanco browser icon
- `server.js` — dependency-free Node.js website server and REST API
- `data/vehicles.json` — inventory database
- `data/promotions.json` — promotional campaigns
- `data/leads.json` — locally stored customer enquiries
- `.env.example` — deployment configuration reference
- `robots.txt` — crawler rules
# POLANCO
