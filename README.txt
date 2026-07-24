Stable Money — landing site (static)
====================================

Pages
-----
index.html  → Home
fd.html     → Fixed Deposit
rd.html     → Recurring Deposit
cc.html     → FD-Backed Credit Card
styles.css  → shared styles
script.js   → shared scripts
kbc-amitabh.jpg → KBC hero/lead image

Keep ALL files in the SAME folder — the pages link to styles.css,
script.js and kbc-amitabh.jpg by relative path.

View locally
------------
Unzip, then double-click index.html. (Be online — bank logos,
avatars and the desktop QR load from the internet.)

Host a live link (recommended)
------------------------------
Option A — Vercel:
  1. Put these files in a folder (root level, no subfolder).
  2. Go to vercel.com → New Project → drag the folder, or connect a Git repo.
  3. Framework preset: "Other". No build command. Output dir: ./  (root)
  4. Deploy → you get a public https URL to share.

Option B — Netlify Drop (fastest, no account needed):
  Go to app.netlify.com/drop and drag the unzipped folder in.

Notes
-----
- Lead form is client-side only; wire the OTP send/verify to your API
  (marked in script.js). "Book on App" opens the OneLink / QR.
