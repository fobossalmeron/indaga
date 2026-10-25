import assert from 'node:assert/strict';

// Exercise the real Next.js screens against the isolated Better Auth fixture.
// Treasure data is stubbed: this test never sends email or writes real scans.
export async function testHandoffUI(auth, emails, authOrigin) {
  const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
  const browser = await chromium.launch({ headless: true, ...(process.env.HANDOFF_BROWSER_CHANNEL ? { channel: process.env.HANDOFF_BROWSER_CHANNEL } : {}) });
  const appOrigin = process.env.HANDOFF_APP_ORIGIN || 'http://localhost:3000';
  const errors = [];
  const hunt = { id: 'test-hunt', name: 'TEST 2026', year: 2026, is_active: true, total_treasures: 1, start_date: null, end_date: null };
  const treasure = { id: 'test-treasure', hunt_id: hunt.id, treasure_code: 'BAR-1900', treasure_name: 'Bar 1900', treasure_secret: 'Prueba', scanned_at: new Date().toISOString() };
  async function context() {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 852 } });
    await ctx.route('**/api/auth/**', async route => {
      const request = route.request();
      const target = new URL(request.url());
      const headers = { ...await request.allHeaders(), origin: authOrigin };
      const response = await auth.handler(new Request(`${authOrigin}${target.pathname}${target.search}`, {
        method: request.method(), headers,
        ...(request.method() !== 'GET' ? { body: request.postData() } : {}),
      }));
      for (const value of response.headers.getSetCookie()) {
        const [pair, ...attributes] = value.split(';');
        const separator = pair.indexOf('=');
        const maxAge = attributes.find(a => /^\s*max-age=/i.test(a));
        await ctx.addCookies([{
          name: pair.slice(0, separator), value: pair.slice(separator + 1),
          domain: new URL(appOrigin).hostname, path: '/', httpOnly: /httponly/i.test(value), sameSite: 'Lax',
          ...(maxAge ? { expires: Date.now() / 1000 + Number(maxAge.split('=')[1]) } : {}),
        }]);
      }
      const responseHeaders = Object.fromEntries(response.headers);
      delete responseHeaders['set-cookie'];
      if (responseHeaders.location) responseHeaders.location = responseHeaders.location.replace(authOrigin, appOrigin);
      await route.fulfill({ status: response.status, headers: responseHeaders, body: await response.text() });
    });
    await ctx.route('**/api/treasure-scan', route => route.fulfill({ json: { success: true, redirect: '/treasures?year=2026&scanned=BAR-1900' } }));
    await ctx.route('**/api/treasure-data?*', route => route.fulfill({ json: {
      hunt, progress: null, scannedTreasures: [treasure], allTreasures: [treasure], availableHunts: [hunt],
    } }));
    ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    return ctx;
  }
  try {
    const original = await context();
    const other = await context();
    const page = await original.newPage();
    await page.goto(`${appOrigin}/2026/t/BAR-1900`);
    await page.getByLabel('Correo electrónico').fill('ui-handoff@example.test');
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await page.getByText('Para continuar, haz clic en el enlace enviado a').waitFor();
    const mail = emails.at(-1);
    assert.equal(mail.email, 'ui-handoff@example.test');
    const chrome = await other.newPage();
    await chrome.goto(mail.url.replace(authOrigin, appOrigin));
    await chrome.waitForURL('**/treasures?**', { timeout: 30000 });
    await page.waitForURL('**/treasures?**', { timeout: 30000 });
    assert.equal(new URL(page.url()).searchParams.get('confetti'), 'seen');
    assert.equal(new URL(chrome.url()).searchParams.get('confetti'), 'seen');
    await page.getByRole('heading', { name: 'Bar 1900', exact: true }).waitFor();
    await chrome.getByRole('heading', { name: 'Bar 1900', exact: true }).waitFor();
    // A new tab shares the browser proof/session without visiting the old tab.
    const nextScan = await original.newPage();
    await nextScan.goto(`${appOrigin}/2026/t/BAR-1900`);
    await nextScan.waitForURL('**/treasures?**', { timeout: 30000 });
    await nextScan.getByRole('heading', { name: 'Bar 1900', exact: true }).waitFor();
    assert.equal(emails.filter(mail => mail.email === 'ui-handoff@example.test').length, 1);
    const closedContext = await context();
    const closed = await closedContext.newPage();
    await closed.goto(`${appOrigin}/2026/t/BAR-1900`);
    await closed.getByLabel('Correo electrónico').fill('closed-tab@example.test');
    await closed.getByRole('button', { name: 'Continuar', exact: true }).click();
    await closed.getByText('Para continuar, haz clic en el enlace enviado a').waitFor();
    const closedMail = emails.at(-1);
    await closed.close();
    const verifierContext = await context();
    const verifier = await verifierContext.newPage();
    await verifier.goto(closedMail.url.replace(authOrigin, appOrigin));
    await verifier.waitForURL('**/treasures?**', { timeout: 30000 });
    const fresh = await closedContext.newPage();
    await fresh.goto(`${appOrigin}/2026/t/BAR-1900`);
    await fresh.waitForURL('**/treasures?**', { timeout: 30000 });
    assert.equal(emails.filter(mail => mail.email === 'closed-tab@example.test').length, 1);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ui: 'passed', originalTabRecoveredAutomatically: true, secondBrowserContinues: true, nextQRSkipsLogin: true, originalTabClosedRecovery: true, confettiNotRepeated: true, pageErrors: errors }));
  } finally {
    await browser.close();
  }
}
