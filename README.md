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

## Deploy to Render

Create a **Web Service** from this GitHub repository with:

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Runtime:** Node

Add `GEMINI_API_KEY` in the Render service's environment settings. Set `APP_URL` to
the deployed service URL if password-reset emails are configured. Configure SMTP
variables only if the app needs to send email. Never commit `.env` files or local
account data; those are excluded by `.gitignore`.
