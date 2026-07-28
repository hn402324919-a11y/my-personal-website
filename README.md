# Chenynii Personal Website

This is the personal portfolio website for Chenynii. It contains the homepage, portfolio project sections, motion components, and public media assets needed to restore and continue development on a new computer.

## Tech Stack

- Vinext / Next.js
- React
- TypeScript
- Vite
- GSAP, Motion, Three.js, OGL
- Tailwind CSS / PostCSS
- Vercel deployment config

## Requirements

- Node.js `>=22.13.0`
- npm

## Install

```bash
git clone https://github.com/hn402324919-a11y/my-personal-website.git
cd my-personal-website
npm install
```

## Local Development

```bash
npm run dev
```

## Build Check

```bash
npm run build
```

For the full project check, run:

```bash
npm test
```

## Project Structure

- `app/`: main website routes, layout, styles, and page code
- `app/components/`: reusable visual and motion components
- `public/`: static images, videos, icons, Open Graph images, and portfolio media
- `tests/`: rendered HTML checks
- `build/`: build-related helper code
- `db/`, `drizzle/`, `worker/`, `examples/`: platform and optional data/runtime support
- `.openai/hosting.json`: OpenAI Sites hosting metadata
- `vercel.json`, `.vercelignore`: Vercel deployment configuration

## Public Assets

All website images and videos that must be restored on a new computer live under `public/` and are tracked by Git.

Important asset folders:

- `public/hero/`: hero images
- `public/media/`: video media
- `public/profile/`: profile photo
- `public/work/`: portfolio project images

Do not move or rename these files without also updating the paths used in the site code.

## Environment Variables

No required local `.env` file is currently needed for basic development and build checks.

Local and deployment tooling may set variables such as `VERCEL`, `NITRO_PRESET`, `WRANGLER_LOG_PATH`, and `CODEX_SANDBOX`. These are handled by scripts or the hosting environment.

## Vercel Deployment

The project is connected to this GitHub repository:

```text
https://github.com/hn402324919-a11y/my-personal-website.git
```

For Vercel, import or connect the GitHub repository, use Node.js `>=22.13.0`, and keep the existing deployment config files:

- `vercel.json`
- `.vercelignore`
- `package.json`
- `package-lock.json`

Before deploying from a new computer, verify locally with:

```bash
npm install
npm run build
```
