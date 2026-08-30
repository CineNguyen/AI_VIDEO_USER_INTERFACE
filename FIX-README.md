# AI Video Agent v2 - FIXED

This release fixes:

1. `Module not found: Can't resolve '@/lib/supabase'`
2. TypeScript alias configuration (`@/*`)
3. Missing `lib/supabase.ts`
4. Next.js JSX configuration compatibility

## Run

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm install
npm run dev
```

Then open:

http://localhost:3000

## Important

The app can be opened with **Demo Login** without configuring Supabase.

For real Google Login and Phone OTP, copy `.env.example` to `.env.local`
and configure your Supabase credentials.
