# Abizer & Jumana — Wedding Invitation

A cinematic, single-page wedding invitation site: envelope opens on tap, background
music starts, then the invitation, countdown, three-day timeline, and RSVP/location
sections are revealed on scroll.

## File structure

```
index.html          all content/markup
css/style.css        all styling (colors, type, layout, animation)
js/main.js            envelope logic, music, countdown, "add to calendar", scroll reveal
```

No build step, no dependencies to install — it's plain HTML/CSS/JS, so it deploys as-is.

## 1. Put it on GitHub

```bash
cd wedding-site
git init
git add .
git commit -m "Wedding invitation site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(Or just create a new repo on github.com and use "Add file → Upload files" with this folder.)

## 2. Deploy on Vercel

1. Go to https://vercel.com → **Add New Project**.
2. Import the GitHub repo you just created.
3. Framework preset: choose **Other** (this is a static site — no build command,
   no output directory needed).
4. Click **Deploy**.

Vercel will give you a URL like `abizer-jumana.vercel.app`. You can attach a custom
domain later from the project's **Settings → Domains** tab.

Every time you push to `main`, Vercel redeploys automatically.

## 3. Things you'll likely want to fill in later

Open `js/main.js` and edit the `CONFIG` object at the top:

```js
var CONFIG = {
  youtubeVideoId: "ZZCg8QYodOI",     // already set from the link you sent
  countdownTarget: "2026-10-23T00:00:00",
  rsvpUrl: ""                         // add a form/WhatsApp/mailto link to activate RSVP
};
```

- **RSVP**: until `rsvpUrl` is set, the button is visible but inactive (as requested —
  nothing was invented). Add a Google Form link, WhatsApp `https://wa.me/...` link, or
  `mailto:` address here to switch it on.
- **Location**: the `.location__card` block in `index.html` is a placeholder. Once a
  venue is confirmed, replace the text and optionally embed a Google Maps iframe.
- **Music**: currently points at the YouTube video ID from the link you shared
  (`ZZCg8QYodOI`). Playback starts the moment the envelope is tapped — that's the same
  user gesture mobile browsers require anyway, so it plays reliably on iPhone and
  Android without needing a separate "tap to enable sound" step.

## 4. A note on the background music

Browsers don't allow embedding a raw audio stream directly from a YouTube Music link,
so the site uses YouTube's official embeddable player (muted from view, no visible
video) and starts it the moment someone taps the envelope. If you'd rather use a direct
audio file (MP3), that's a cleaner and more reliable option — drop it in an `/assets`
folder and swap the YouTube logic in `main.js` for a plain `<audio>` element; I can do
this swap for you if you send the audio file.

## 5. Testing on mobile before sending on WhatsApp

- Open the deployed Vercel URL on your own phone first.
- Check: envelope fits on screen without scrolling, tap opens smoothly, music starts,
  Arabic text reads right-to-left correctly, "Add to Calendar" buttons open Google
  Calendar, and the Instagram link at the bottom opens the right profile.
