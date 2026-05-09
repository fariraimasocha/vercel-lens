<p align="center">
  <img src="docs/logopop.png" width="100" style="border-radius: 20px" />
</p>

<h1 align="center">VercelLens</h1>

<p align="center">
  Vercel Web Analytics on your Android phone.<br>
  Open source, no ads.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" /></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React%20Native-Expo-black.svg" /></a>
  <a href="https://github.com/fariraimasocha/vercel-lens/stargazers"><img src="https://img.shields.io/github/stars/fariraimasocha/vercel-lens?style=flat&color=yellow" /></a>
</p>

## Features

- **Projects Dashboard** — All your Vercel projects with framework info, last commit, and live deploy indicator
- **Multi-account** — Add multiple Vercel accounts and switch between them from the Projects screen
- **Live Deploy Indicator** — Visual indicator when a deployment is recent
- **Analytics** — Visitors, page views, bounce rate with % change badges
- **Interactive Chart** — Animated line chart with peak and average markers
- **Full Breakdowns** — Pages, routes, hostnames, referrers, countries, devices, browsers, OS, and more
- **Search** — Filter projects by name, domain, or framework
- **Pull to Refresh** — Live data from the Vercel API
- **Dark Mode** — Pure black (#000000) Vercel-style design
- **Secure** — Vercel tokens stored with Expo SecureStore, open source code

## Tech Stack

- **React Native** + **Expo** — Cross-platform mobile app
- **React Navigation** — Tab and stack navigation
- **Zustand** — Auth and state management
- **Victory Native** + **Skia** — Interactive analytics charts
- **Expo SecureStore** — Secure token storage
- **TypeScript** — Fully typed throughout

## Repository Structure

```
vercellens/
├── android/      # React Native / Expo app
│   ├── src/
│   │   ├── auth/         # Auth manager and secure storage
│   │   ├── components/   # Reusable UI components
│   │   ├── constants/    # Colors and theme
│   │   ├── hooks/        # Data fetching hooks
│   │   ├── models/       # TypeScript data models
│   │   ├── network/      # Vercel API client
│   │   └── screens/      # App screens
│   └── assets/           # Icons and images
└── web/          # Landing page
```

## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/fariraimasocha/vercel-lens.git
   cd vercel-lens/android
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the dev server
   ```bash
   npm start
   ```

4. Run on Android
   ```bash
   npm run android
   ```

### Vercel Tokens

The app authenticates using [Vercel personal access tokens](https://vercel.com/account/tokens):

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create a token with your account scope
3. Paste it into the app on the login screen
4. Add more accounts from the account switcher in Projects

## API

The app uses two Vercel API hosts:

| Host | Endpoints | Auth |
|------|-----------|------|
| `api.vercel.com` | `/v2/user`, `/v9/projects`, `/v9/projects/{id}` | Bearer token |
| `vercel.com/api` | `/web-analytics/*` | Bearer token |

Analytics endpoints use `groupBy`: `path`, `route`, `hostname`, `referrer`, `country`, `device_type`, `client_name`, `os_name`, `event_name`, `query_params`

## Disclaimer

VercelLens is **not** affiliated with, endorsed by, or sponsored by Vercel Inc. Vercel and the Vercel logo are trademarks of Vercel Inc. This is an independent, open-source project that uses Vercel's public API with user-provided authentication tokens.

## License

[MIT](LICENSE)

## Contact

- **Email**: fariraimasocha@gmail.com
- **X**: [@fariraijames](https://x.com/fariraijames)
- **LinkedIn**: [fariraimasocha](https://www.linkedin.com/in/fariraimasocha/)
- **Issues**: [github.com/fariraimasocha/vercel-lens/issues](https://github.com/fariraimasocha/vercel-lens/issues)

---

<p align="center">Built with ❤︎ by <a href="https://x.com/fariraijames">Farirai Masocha</a></p>
