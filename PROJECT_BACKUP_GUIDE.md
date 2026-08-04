# Project Backup Guide

## 1. Project Purpose

This repository contains Chenynii's personal portfolio website. It is used to present profile information, selected work, visual case studies, motion interactions, and public media assets.

The goal of this guide is to make the project easy to restore on a new computer.

## 2. Tech Stack

- Vinext / Next.js
- React
- TypeScript
- Vite
- GSAP, Motion, Three.js, OGL
- Tailwind CSS / PostCSS
- Vercel deployment configuration

## 3. Local Development Requirements

- Node.js `>=22.13.0`
- npm
- Git
- Access to the GitHub repository
- Optional: Vercel account access for deployment

## 4. New Computer Setup Steps

1. Install Node.js `>=22.13.0`.
2. Install Git.
3. Sign in to GitHub.
4. Clone this repository.
5. Install dependencies with `npm install`.
6. Start local development with `npm run dev`.
7. Run a build check with `npm run build` before deploying.

## 5. Clone the Project

```bash
git clone https://github.com/hn402324919-a11y/my-personal-website.git
cd my-personal-website
```

## 6. Install Dependencies

```bash
npm install
```

The project includes `package.json`, `package-lock.json`, and `pnpm-lock.yaml`. For the current recovery flow, use npm unless the package manager strategy is changed later.

## 7. Start Local Development

```bash
npm run dev
```

If the default dev port is already in use, follow the terminal output and use the available local URL.

## 8. Deployment

The project includes Vercel deployment files:

- `vercel.json`
- `.vercelignore`

To deploy with Vercel:

1. Connect the GitHub repository in Vercel.
2. Confirm the Node.js version is compatible with `>=22.13.0`.
3. Use the existing build configuration from `package.json`.
4. Run `npm run build` locally before deploying.
5. Deploy from Vercel after the GitHub repository is up to date.

Do not deploy local-only folders such as `node_modules/`, `dist/`, `.vercel/`, `.vinext/`, or `.wrangler/`.

## 9. Current Version Notes

- Current branch: `main`
- Latest deployment records: see `PROJECT_LOG.md`
- Remote repository: `https://github.com/hn402324919-a11y/my-personal-website.git`
- Public website assets are stored under `public/` and tracked by Git.
- No required local `.env` file is currently needed for basic development and build checks.

## 10. Notes and Cautions

- Do not rename or move files under `public/` unless the website code is updated at the same time.
- Keep `public/hero/`, `public/media/`, `public/profile/`, and `public/work/` backed up through Git.
- `.env*` files are ignored by Git. If environment variables are added later, create or update an `.env.example` file or document them here.
- `.DS_Store`, `node_modules/`, build output, and platform cache folders should stay untracked.
- Before switching computers, confirm `git status` is clean and the latest commit exists on GitHub.
- Before deployment, run `npm run build` successfully.
