// Uses a locally installed Chrome/Chromium; no network or npm dependencies.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const candidates = [process.env.CV_BROWSER, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean);
const browser = candidates.find(existsSync);
if (!browser) throw new Error('Install Chrome/Chromium or set CV_BROWSER to the browser executable.');
const profile = mkdtempSync(join(tmpdir(), 'developer-cv-'));
const output = join(root, 'public/Theodore_Nelson_CV_Junior_Developer.pdf');
try {
  const result = spawnSync(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--no-pdf-header-footer', '--allow-file-access-from-files', `--user-data-dir=${profile}`, `--print-to-pdf=${output}`, pathToFileURL(join(root, 'cv-junior-developer.html')).href], { encoding: 'utf8', timeout: 60000 });
  if (result.error || result.status !== 0) throw result.error ?? new Error(result.stderr);
  if (!existsSync(output)) throw new Error('Browser did not generate the PDF.');
  console.log(`Generated ${output}`);
} finally { rmSync(profile, { recursive: true, force: true }); }
