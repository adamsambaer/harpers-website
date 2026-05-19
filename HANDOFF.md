# Harper's Website — Handoff Notes

## Private Events Booking Form

The booking form on the Private Events section is built and styled, but needs one final step before it goes live: connecting it to Formspree so submissions actually arrive in an inbox.

### What Formspree does
Formspree receives the form submission and emails it to whatever address you choose. No server, no code — it just works.

### Setup steps (takes ~5 minutes)

1. Go to **formspree.io** and create a free account
   - Use whatever email should receive the booking requests
   - Shelly Toth is the listed contact (517-333-4040) — ideally use her email, or add it as a notification recipient after signup

2. Inside Formspree, click **New Form**
   - Name it something like "Harper's Private Events Booking"
   - Formspree will give you a unique URL like: `https://formspree.io/f/xpznabcd`

3. Open **index.html** and go to line 562
   - Find this line:
     ```
     action="https://formspree.io/f/YOUR_FORM_ID"
     ```
   - Replace `YOUR_FORM_ID` with the actual ID from step 2, for example:
     ```
     action="https://formspree.io/f/xpznabcd"
     ```

4. Save the file, commit, and push to GitHub
   - The form will be live immediately

### What a submission looks like
Formspree sends a plain email with all fields: name, email, phone, event type, date, guest count, space preference, and any notes.

### Free plan limits
Formspree's free tier allows 50 submissions per month. For a private events form that sees occasional traffic, this should be more than enough. If they ever exceed it, paid plans start at $10/month.

### Spam protection
The form already includes a hidden honeypot field that Formspree uses to filter out bots. No extra setup needed.

---

## GitHub Repository
The site is hosted via GitHub. Any file changes need to be committed and pushed to take effect on the live site.

---

## Contact
Built by Adam Sabaer — revivemobileauto@gmail.com
