# CS2 Market Viewer

A static SPA using the local Steam Community Market snapshot in `docs/data/items.json`.

## Run locally
From this folder, run `npm run fetch:items` with Node.js 18+, then serve with `npx serve docs` and open the printed URL. An HTTP server is required for modules and JSON fetch.

## Hero image
Place an original image you have rights to use at `cs2-site/docs/assets/hero.jpg`. CSS uses a dark gradient fallback if the file is absent.

## UI
Amber and charcoal styling, sticky responsive navigation, two clipped auto-advancing hero rows, responsive item grid, 400 ms case-insensitive partial search, keyboard accessible detail modal, skeleton, empty and error states, and footer links. Data loads only from local `docs/data/items.json`.
