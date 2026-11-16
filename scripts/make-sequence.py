"""
Generate the scroll-driven hero frame sequence from a single real render.

Story (t = 0 -> 1):
  overcast concrete-grey house, lights off
  -> camera dollies in
  -> lights switch on zone by zone (stone wall, living, dining, upper floor, garden, pool)
  -> only lit areas regain colour, sky deepens to dusk, soft bloom

Usage:
  python -I scripts/make-sequence.py "<path/to/render.png>" [frames=120]

Writes public/sequence/desktop/0001.webp ... and public/sequence/mobile/0001.webp ...
"""
import sys
import os
import numpy as np
import cv2

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/assets/villa-dusk-src.png"
N = int(sys.argv[2]) if len(sys.argv) > 2 else 120
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sequence")
DESK = (1440, 720)   # 2:1
MOB = (750, 1000)    # 3:4

img = cv2.imread(SRC, cv2.IMREAD_COLOR).astype(np.float32) / 255.0
H, W = img.shape[:2]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
xn, yn = xx / W, yy / H

hsv = cv2.cvtColor((img * 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
hh, ss, vv = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255

# ---------- masks ----------
warm = ((hh >= 8) & (hh <= 32)).astype(np.float32) * np.clip((ss - 0.35) / 0.4, 0, 1) * np.clip((vv - 0.55) / 0.35, 0, 1)
pool = ((hh >= 80) & (hh <= 100)).astype(np.float32) * np.clip((ss - 0.35) / 0.3, 0, 1) * (yn > 0.82) * np.clip((vv - 0.45) / 0.3, 0, 1)
# pool lamps / bollard heads: small, very bright, low-saturation blobs near the ground
_w = (((vv > 0.9) & (ss < 0.3)) & (yn > 0.74)).astype(np.uint8)
_n, _lab, _stats, _ = cv2.connectedComponentsWithStats(_w)
_keep = np.zeros(_n, np.float32)
_keep[1:] = ((_stats[1:, cv2.CC_STAT_AREA] >= 6) & (_stats[1:, cv2.CC_STAT_AREA] <= 900)).astype(np.float32)
white = _keep[_lab]
light = np.clip(cv2.GaussianBlur(warm, (0, 0), 3) * 1.7 + cv2.GaussianBlur(pool, (0, 0), 3) * 1.2
                + cv2.GaussianBlur(white, (0, 0), 4) * 1.8, 0, 1)
sky = ((hh > 95) & (hh < 135) & (vv > 0.55)).astype(np.float32) * (yn < 0.55)
sky = cv2.GaussianBlur(sky, (0, 0), 6)

# ---------- when each pixel's light switches on ----------
def zone_time(x, y):
    t = np.full_like(x, 0.62)                                    # garden / misc
    t = np.where((x < 0.29) & (y > 0.45) & (y < 0.82), 0.28, t)  # stone wall washers
    t = np.where((x >= 0.28) & (x < 0.53) & (y > 0.48) & (y < 0.8), 0.36, t)  # living
    t = np.where((x >= 0.53) & (x < 0.76) & (y > 0.48) & (y < 0.8), 0.44, t)  # dining
    t = np.where((x > 0.36) & (x < 0.86) & (y < 0.48), 0.52, t)  # upper floor
    t = np.where(y > 0.82, 0.68, t)                              # pool + paths
    return t

on_time = zone_time(xn, yn)
# per-component jitter so panes don't all flip at once
bin_ = (light > 0.25).astype(np.uint8)
bin_ = cv2.dilate(bin_, np.ones((7, 7), np.uint8))
n_cc, labels = cv2.connectedComponents(bin_)
rng = np.random.default_rng(7)
jitter = rng.uniform(-0.035, 0.035, n_cc).astype(np.float32)
jitter[0] = 0
on_time = on_time + jitter[labels]
on_time = cv2.GaussianBlur(on_time, (0, 0), 4)

# ---------- prepared states ----------
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)[..., None].repeat(3, axis=2)
cool = np.array([0.36, 0.33, 0.30], np.float32)  # BGR — unlit glass reflecting an overcast sky
unlit = img * (1 - light[..., None]) + (np.minimum(gray, 0.5) * 0.9 + cool * 0.12) * light[..., None]
glow_src = img * light[..., None]
bloom = cv2.GaussianBlur(glow_src, (0, 0), 22)
dusk_sky = np.array([0.42, 0.26, 0.18], np.float32)  # deep blue in BGR


def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def ease(x):
    return 1 - (1 - x) ** 3


def frame(t: float) -> np.ndarray:
    L = smooth(0, 0.05, t - on_time)                 # light switch per pixel
    # tiny flicker right as each zone ignites
    flick = 1 - 0.35 * np.exp(-((t - on_time - 0.012) ** 2) / 0.00004) * (L > 0)
    Lm = (light * L * flick)[..., None]
    scene = unlit * (1 - Lm) + img * Lm

    d = smooth(0.3, 1.0, t)                          # dusk amount
    sat = 0.1 + 0.55 * smooth(0.25, 0.95, t)         # world saturation
    sat_px = np.maximum(sat, np.clip(Lm[..., 0] * 1.3, 0, 1))[..., None]
    g = cv2.cvtColor(np.clip(scene, 0, 1), cv2.COLOR_BGR2GRAY)[..., None]
    scene = g + (scene - g) * sat_px

    # overcast lift at start, dusk drop at end
    lift = 0.08 * (1 - smooth(0.0, 0.5, t))
    scene = scene * (1 - 0.22 * d * (1 - Lm)) + lift
    scene = scene * (1 - sky[..., None] * 0.5 * d) + dusk_sky * sky[..., None] * 0.5 * d
    scene = scene + bloom * (0.4 * smooth(0.3, 0.9, t)) * L[..., None]
    # hue-preserving highlight clamp (avoids orange clipping to yellow-green)
    peak = np.maximum(scene.max(axis=2, keepdims=True), 1.0)
    scene = scene / peak

    # vignette
    vig = 1 - 0.28 * d * (((xn - 0.5) ** 2) * 1.2 + ((yn - 0.55) ** 2) * 1.6)
    scene = scene * vig[..., None]
    return np.clip(scene, 0, 1)


def camera(f: np.ndarray, t: float, out_wh, aspect):
    z = 1 + 0.17 * ease(t)
    cx = W * (0.5 + 0.02 * ease(t))
    cy = H * (0.5 + 0.06 * ease(t))
    ch = H / z
    cw = ch * aspect
    if cw > W / z * 1.0 and aspect >= W / H:
        cw = W / z
        ch = cw / aspect
    x0 = int(np.clip(cx - cw / 2, 0, W - cw))
    y0 = int(np.clip(cy - ch / 2, 0, H - ch))
    crop = f[y0:y0 + int(ch), x0:x0 + int(cw)]
    return cv2.resize(crop, out_wh, interpolation=cv2.INTER_AREA if crop.shape[1] > out_wh[0] else cv2.INTER_CUBIC)


os.makedirs(os.path.join(ROOT, "desktop"), exist_ok=True)
os.makedirs(os.path.join(ROOT, "mobile"), exist_ok=True)
for i in range(N):
    t = i / (N - 1)
    f = frame(t)
    d = camera(f, t, DESK, DESK[0] / DESK[1])
    m = camera(f, t, MOB, MOB[0] / MOB[1])
    name = f"{i + 1:04d}.webp"
    cv2.imwrite(os.path.join(ROOT, "desktop", name), (d * 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 60])
    cv2.imwrite(os.path.join(ROOT, "mobile", name), (m * 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 58])
    if i % 20 == 0:
        print(f"frame {i + 1}/{N}")
print("done", N, "frames ->", ROOT)
