"""
Turn a video into the hero's scroll image sequence (high quality WebP).

Usage:
  python -I scripts/video-to-frames.py "<path/to/clip.mp4>" [frames=144]

Writes:
  public/sequence/desktop/0001.webp ...  (1920x1080)
  public/sequence/mobile/0001.webp  ...  (960x540)
  public/sequence/poster.jpg             (first frame, for instant paint)
  public/sequence/manifest.json          ({"frames": N, "width": .., "height": ..})

Hero.tsx reads manifest.json, so changing the frame count needs no code change.
"""
import json
import os
import shutil
import sys

import cv2
from PIL import Image, ImageFilter

SRC = sys.argv[1]
N = int(sys.argv[2]) if len(sys.argv) > 2 else 144
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sequence")
SETS = {
    "desktop": {"w": 1920, "q": 74},
    "mobile": {"w": 960, "q": 74},
}

cap = cv2.VideoCapture(SRC)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
if total <= 0:
    sys.exit("Could not read video: " + SRC)
N = min(N, total)
picks = [round(i * (total - 1) / (N - 1)) for i in range(N)]

# read sequentially (more reliable than seeking) and keep the picked frames
wanted = set(picks)
frames = {}
i = 0
while True:
    ok, f = cap.read()
    if not ok:
        break
    if i in wanted:
        frames[i] = f
    i += 1
cap.release()

for name in SETS:
    shutil.rmtree(os.path.join(ROOT, name), ignore_errors=True)
    os.makedirs(os.path.join(ROOT, name), exist_ok=True)

h0, w0 = next(iter(frames.values())).shape[:2]
written = 0
for idx, fi in enumerate(picks):
    f = frames.get(fi)
    if f is None:  # fall back to nearest decoded frame
        f = frames[min(frames, key=lambda k: abs(k - fi))]
    im = Image.fromarray(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))
    for name, cfg in SETS.items():
        w = cfg["w"]
        out = im if w == w0 else im.resize((w, round(w * h0 / w0)), Image.LANCZOS)
        if w < w0:
            out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
        out.save(os.path.join(ROOT, name, f"{idx + 1:04d}.webp"), "WEBP", quality=cfg["q"], method=6)
    if idx == 0:
        im.resize((1280, round(1280 * h0 / w0)), Image.LANCZOS).save(os.path.join(ROOT, "poster.jpg"), quality=82)
    written += 1
    if idx % 24 == 0:
        print(f"{idx + 1}/{N}")

with open(os.path.join(ROOT, "manifest.json"), "w") as fh:
    json.dump({"frames": written, "width": w0, "height": h0}, fh)
print(f"wrote {written} frames from {total} source frames -> {ROOT}")
