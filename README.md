# yusha-blog

Vite + React blog studio: dashboard, dynamic blog pages, and a TipTap-based editor that exports JSON.

## Stack

- Vite
- React
- React Router
- TanStack Query
- TipTap
- Tailwind CSS
- shadcn/ui

## Getting started

```sh
npm i
npm run dev
```

Build and preview:

```sh
npm run build
npm run preview
```

## Routes

- `/` — blog dashboard with tag filtering
- `/editor` — compose and export blog JSON
- `/:blogName` — individual blog page (slug from `public/blogs.json`)
