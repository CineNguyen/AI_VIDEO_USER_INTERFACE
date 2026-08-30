# AI Video Agent v2

## UI v2
- Colorful AI Agent SaaS dashboard
- Login / Register screen
- Google / Gmail login
- Phone OTP login
- Demo login when Supabase is not configured
- Gradient cards, animated activity, dashboard statistics
- API Connections and video-generation workflow

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Real authentication
Set Supabase environment variables in `.env.local`, then configure:
- Google provider
- Phone / SMS provider
- Redirect URL

## Security
Never commit API keys. The demo app stores a user's API key only in React memory for the current browser session.
