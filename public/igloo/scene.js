// srcdoc inherits the parent's origin, while location.origin is "null" for
// about:srcdoc. window.origin preserves the actual same-origin message target.
const origin = window.origin;
let phase = 'loading';
let phasePayload = {};
const send = (type, payload = {}) => {
  phase = type;
  phasePayload = payload;
  parent.postMessage({ source: 'cv-igloo', type, ...payload }, origin);
};
let api;
let latest = { progress: 0, active: true, paused: false, reduced: false };
let staticFrame = '';

function update() {
  if (!api) return;
  const progress = latest.reduced ? 0 : latest.progress;
  api.setProgress(progress);
  if (!latest.active) {
    staticFrame = '';
    api.setActive(false);
  } else if (latest.paused || latest.reduced) {
    const key = `${progress}:${innerWidth}:${innerHeight}:${latest.reduced}`;
    if (key !== staticFrame) {
      api.renderOnce();
      staticFrame = key;
    }
  } else {
    staticFrame = '';
    api.setActive(true);
  }
}

window.addEventListener('message', event => {
  if (event.origin !== origin || event.source !== parent || event.data?.source !== 'cv-portfolio') return;
  const message = event.data;
  if (message.type === 'hello') {
    if (phase !== 'loading') send(phase, phasePayload);
  } else if (message.type === 'pointer' && api && !latest.paused && !latest.reduced && latest.active) {
    api.setPointer(Math.max(0, Math.min(1, Number(message.x) || 0)), Math.max(0, Math.min(1, Number(message.y) || 0)));
  } else if (message.type === 'state') {
    latest = { progress: Math.max(0, Math.min(1, Number(message.progress) || 0)), active: !!message.active, paused: !!message.paused, reduced: !!message.reduced };
    update();
  }
});
window.addEventListener('resize', () => { staticFrame = ''; update(); });
window.addEventListener('pagehide', () => api?.setActive(false));

function supportsWebGL2() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}

if (supportsWebGL2()) {
  import('./assets/igloo-runtime.js').then(({ createPortfolioExperience }) =>
    createPortfolioExperience(document.querySelector('#scene'))
  ).then(result => {
    api = result;
    update();
    requestAnimationFrame(() => requestAnimationFrame(() => send('ready')));
  }).catch(error => {
    console.error('Portfolio scene failed', error);
    send('error', { message: 'The 3D scene could not be loaded.' });
  });
} else send('error', { message: 'WebGL2 unavailable.' });

// Read-only diagnostics for integration verification; no engine internals exposed.
export function getSceneState() { return { ...latest, renderer: api?.getState() }; }
