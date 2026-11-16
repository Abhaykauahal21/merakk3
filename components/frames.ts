/**
 * Tiny shared signal: the hero calls markFramesReady() once the first coarse pass of
 * frames is loaded; the loader waits on whenFramesReady() (with a timeout) before exiting.
 */
let ready = false;
const waiters: (() => void)[] = [];

export function markFramesReady() {
  if (ready) return;
  ready = true;
  waiters.splice(0).forEach((fn) => fn());
}

export function whenFramesReady(timeoutMs = 5000): Promise<void> {
  if (ready) return Promise.resolve();
  return new Promise((resolve) => {
    const t = setTimeout(resolve, timeoutMs);
    waiters.push(() => {
      clearTimeout(t);
      resolve();
    });
  });
}
