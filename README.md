# Merakk Studios — website

Architecture & interiors studio website.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · GSAP + ScrollTrigger · Framer Motion · Lenis

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Hero scroll sequence

The hero scrubs an image sequence on a `<canvas>`. Frames live in `public/sequence/{desktop,mobile}`
and are generated from a video:

```bash
python -I scripts/video-to-frames.py "path/to/video.mp4" 85
```

(needs Python with `opencv-python` and `Pillow`). `manifest.json` stores the frame count.

## Content

Editable content (projects, team, awards, journal, FAQ, contact, stats) is in `lib/data.ts`.
Several items are placeholders — see comments there.
