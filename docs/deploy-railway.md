# Deploy to Railway

This project deploys to Railway on every push to `main` via GitHub Actions.

## One-time setup

The workflow needs a `RAILWAY_TOKEN` secret in the GitHub repo. Generate it once:

1. Go to https://railway.com/account/tokens (Railway dashboard -> Account Settings -> Tokens)
2. Click "Create Token"
3. Name it `gh-dash-actions` (or any name you recognize)
4. Copy the token value (you only see it once)
5. Go to https://github.com/davidsilva131/gh-dash/settings/secrets/actions
6. Click "New repository secret"
   - Name: `RAILWAY_TOKEN`
   - Value: paste the token
7. Click "Add secret"

That's it. The next push to `main` will trigger the deploy.

## What the workflow does

On every push to `main` (and on manual trigger via the Actions tab):

1. Checks out the repo
2. Sets up pnpm 10 + Node 22
3. `pnpm install --frozen-lockfile`
4. `pnpm test` — runs the Vitest suite
5. `pnpm build` — Astro production build
6. Installs Railway CLI v5.30.1
7. `railway up --detach` — uploads the working tree and triggers a new deployment

The deploy is non-blocking (`--detach`): the GitHub Action finishes as soon as the upload starts. The actual build + healthcheck happens in Railway and is visible in the Railway dashboard.

## Why the workflow does NOT use `railway deploy` (the action)

`railway deploy` from a GitHub Action does work, but it builds in Railway's infra using Nixpacks (matching the local `railway.json`). The `railway up` approach does the build **locally in the Action runner** and uploads the artifact, which is faster but can drift from Railway's Nixpacks environment.

For this project we want Railway to build with Nixpacks (consistent with `railway.json`), so the workflow uses `railway up --detach` which tells Railway to rebuild from the uploaded source.

## Concurrency

The workflow uses `concurrency: railway-deploy-${{ github.ref }}` with `cancel-in-progress: false` so that two pushes in quick succession deploy in order (the second one waits for the first to finish), not in parallel (which would race on the same service).

## Healthcheck

The service uses the `railway.json` healthcheck at `/`. The Astro server must bind to `0.0.0.0:3000` (configured in the existing `railway.json`). If the deploy fails with `service unavailable`, see the `railway-deployment` skill for the pinning-port gotcha.
