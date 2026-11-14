# Account setup checklist

Everything the live site needs to send emails and let you into `/admin`. Do these in order; each takes 5–10 minutes.
All values go in **Vercel → diggsultra → Settings → Environment Variables**: https://vercel.com/diggs2/diggsultra/settings/environment-variables
Apply each one to **Production** and **Preview**. Redeploy once at the end (Deployments → ⋯ → Redeploy).

## 1. Basics (2 minutes)

| Name | Value |
|---|---|
| `ADMIN_EMAIL` | `tylerrthompsonn68@gmail.com` (the only account allowed into /admin, and where booking alerts go) |
| `AUTH_SECRET` | Run `openssl rand -base64 33` in Terminal and paste the result. Mark it **Sensitive**. |

## 2. Google login for /admin

1. Go to https://console.cloud.google.com and create a project named **DiggsUltra**.
2. **APIs & Services → OAuth consent screen:** choose **External**. App name "DiggsUltra Admin", with your Gmail as the support email. Under **Test users**, add `tylerrthompsonn68@gmail.com`. (Leaving it in "Testing" is fine, since only you log in.)
3. **APIs & Services → Credentials → Create credentials → OAuth client ID:**
   - Application type: **Web application**
   - Authorized JavaScript origins: `https://diggsultra.com`
   - Authorized redirect URIs:
     - `https://diggsultra.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (for local testing)
4. Copy the **Client ID** → `AUTH_GOOGLE_ID` and the **Client secret** → `AUTH_GOOGLE_SECRET` (mark it Sensitive).

Login works on diggsultra.com only. Preview links have random URLs that Google won't accept, which is fine for an admin page.

## 3. Emails (Resend)

1. Sign up at https://resend.com (free plan: 3,000 emails/month).
2. **Domains → Add domain:** `diggsultra.com`, region **US East**.
3. Resend shows 3–4 DNS records. Your DNS is on Vercel, so they go in **Vercel → Domains → diggsultra.com → DNS Records**. Claude can add them once you say OK.
4. Once Resend shows the domain as **Verified**: **API Keys → Create** with "Sending access" → `RESEND_API_KEY` (Sensitive).
5. `EMAIL_FROM` = `Diggs <bookings@diggsultra.com>` (any address @diggsultra.com works; replies go to your Gmail).

## 4. Spam protection (optional but recommended)

1. Cloudflare dashboard → **Turnstile → Add widget**. Hostnames: `diggsultra.com`, `localhost`. Mode: **Managed**.
2. Site key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, secret key → `TURNSTILE_SECRET_KEY` (Sensitive).

## Then

Redeploy, submit a test booking on https://diggsultra.com/book, and check:
- The confirmation lands in the test inbox.
- The alert lands in your Gmail, and its "Open in admin" button logs you in with Google and opens the request.
