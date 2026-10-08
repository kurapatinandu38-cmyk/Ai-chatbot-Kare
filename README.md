<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# KARE AI Chatbot

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`
3. Run the app:
   `npm run dev`

## Deploy frontend and API together on Vercel

Import this GitHub repository as a Vercel project. The included `vercel.json`
builds the Vite frontend into `dist`, while `api/[...path].ts` exposes the Express
API as a Vercel function under `/api/*`.

Add `GEMINI_API_KEY` in the Vercel project's environment variables. Leave
`VITE_API_BASE_URL` unset when both frontend and API are on this project. Set
`APP_URL` to the deployed Vercel URL if password-reset emails are configured, and
configure SMTP variables only when outbound email is needed. Redeploy after
changing environment variables.

Vercel functions have ephemeral local storage. Keep account and application data
in a persistent database such as Firestore; never commit `.env` files or local
account data, which are excluded by `.gitignore`.
