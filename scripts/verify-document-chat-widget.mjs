import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';

const port = Number(process.env.VERIFY_PORT || 5176);
const baseUrl = `http://127.0.0.1:${port}`;
const screenshotDir = resolve('qa-screenshots');

const browserCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA || ''}\\Google\\Chrome\\Application\\chrome.exe`,
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

const executablePath = browserCandidates.find((candidate) => existsSync(candidate));

if (!executablePath) {
  throw new Error('Chrome 또는 Edge 실행 파일을 찾을 수 없습니다.');
}

mkdirSync(screenshotDir, { recursive: true });

function startDevServer() {
  const viteBin = resolve('node_modules', 'vite', 'bin', 'vite.js');
  const env = Object.fromEntries(
    Object.entries({ ...process.env, BROWSER: 'none' }).filter(([, value]) => value !== undefined),
  );

  return spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', String(port)], {
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

async function waitForServer(server) {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < 30000) {
    if (server.exitCode !== null) {
      throw new Error(`Vite 서버가 먼저 종료되었습니다. exit=${server.exitCode}`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolveTimeout) => setTimeout(resolveTimeout, 400));
  }

  throw new Error(`Vite 서버 대기 시간이 초과되었습니다. ${lastError?.message || ''}`.trim());
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));

  if (Math.max(overflow.body, overflow.document) > overflow.viewport + 1) {
    throw new Error(`${label}에서 가로 오버플로우가 발생했습니다: ${JSON.stringify(overflow)}`);
  }
}

async function verifyDesktopWidget(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/#/dashboard`, { waitUntil: 'networkidle' });
  await assertNoHorizontalOverflow(page, 'desktop dashboard');

  await page.locator('.document-chat-fab').click();
  const widget = page.locator('.document-chat-widget');
  const dragHandle = page.locator('.document-chat-widget-drag-handle');

  await widget.waitFor({ state: 'visible', timeout: 5000 });
  await dragHandle.waitFor({ state: 'visible', timeout: 5000 });

  const before = await widget.boundingBox();
  const handleBox = await dragHandle.boundingBox();
  if (!before || !handleBox) {
    throw new Error('드래그 가능한 위젯 영역을 찾지 못했습니다.');
  }

  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x - 140, handleBox.y + 110, { steps: 8 });
  await page.mouse.up();

  const after = await widget.boundingBox();
  if (!after || (Math.abs(after.x - before.x) < 20 && Math.abs(after.y - before.y) < 20)) {
    throw new Error(`드래그 후 위젯 위치가 충분히 바뀌지 않았습니다. before=${JSON.stringify(before)} after=${JSON.stringify(after)}`);
  }

  await assertNoHorizontalOverflow(page, 'desktop widget');
  await page.screenshot({ path: resolve(screenshotDir, 'document-chat-widget-desktop.png'), fullPage: true });
}

async function verifyMobileWidget(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/#/dashboard`, { waitUntil: 'networkidle' });
  await page.locator('.document-chat-fab').click();

  const widget = page.locator('.document-chat-widget');
  await widget.waitFor({ state: 'visible', timeout: 5000 });

  const box = await widget.boundingBox();
  if (!box) {
    throw new Error('모바일 위젯 영역을 찾지 못했습니다.');
  }

  if (box.x < -1 || box.y < -1 || box.x + box.width > 391 || box.y + box.height > 845) {
    throw new Error(`모바일 위젯이 뷰포트 밖으로 벗어났습니다: ${JSON.stringify(box)}`);
  }

  await assertNoHorizontalOverflow(page, 'mobile widget');
  await page.screenshot({ path: resolve(screenshotDir, 'document-chat-widget-mobile.png'), fullPage: true });
}

const server = startDevServer();

try {
  await waitForServer(server);

  const browser = await chromium.launch({ executablePath, headless: true });
  const desktopPage = await browser.newPage();

  try {
    await verifyDesktopWidget(desktopPage);
    await desktopPage.close();

    const mobilePage = await browser.newPage();
    await verifyMobileWidget(mobilePage);
    await mobilePage.close();
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}
