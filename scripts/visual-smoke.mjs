import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4173";
const routes = [
  "/", "/pricing.html", "/get-started.html", "/how-it-works.html",
  "/managed-service.html", "/industries.html", "/demos.html", "/faq.html",
  "/about.html", "/blog/", "/insights/", "/learning-center/", "/challenge/",
  "/privacy.html", "/terms.html", "/trust-lab.html",
  "/receptionist-intelligence.html"
];
const viewports = [{ name: "mobile", width: 360, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 }];
const screenshotRoutes = new Set(["/", "/pricing.html", "/get-started.html"]);
const browser = await chromium.launch({ headless: true });
const failures = [];
fs.mkdirSync("artifacts/site-qa", { recursive: true });

try {
  for (const viewport of viewports) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      try {
        const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 30000 });
        assert(response && response.status() === 200, `${route}: expected HTTP 200`);
        await page.locator("h1").first().waitFor({ state: "visible", timeout: 8000 });
        const layout = await page.evaluate(() => ({
          width: window.innerWidth,
          documentWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          h1Count: document.querySelectorAll("h1").length
        }));
        assert(layout.documentWidth <= layout.width + 2,
          `${route}: horizontal overflow at ${viewport.width}px (${layout.documentWidth}px)`);
        assert(layout.h1Count >= 1, `${route}: missing visible page heading`);
        if (route === "/get-started.html") {
          const required = await page.locator("input[required], select[required], textarea[required]").count();
          const consent = await page.locator('input[type="checkbox"][required]').count();
          assert(required >= 5, "Discovery form: expected at least five required controls");
          assert(consent >= 1, "Discovery form: required privacy consent checkbox missing");
        }
        if (screenshotRoutes.has(route)) {
          const name = route === "/" ? "home" : route.replace(/^\\//, "").replace(".html", "");
          await page.screenshot({ path: path.join("artifacts/site-qa", `${name}-${viewport.name}.png`), fullPage: true });
        }
        console.log(`PASS ${route} @ ${viewport.width}px`);
      } catch (error) {
        failures.push(`${route} @ ${viewport.width}px: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error("Visual smoke tests failed:\\n- " + failures.join("\\n- "));
  process.exit(1);
}
console.log("Responsive browser smoke tests passed at 360px, 768px and 1280px.");
