import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4173";
const routes = [
  "/", "/pricing.html", "/get-started.html", "/how-it-works.html",
  "/managed-service.html", "/industries.html", "/demos.html", "/faq.html",
  "/about.html", "/blog/", "/insights/", "/learning-center/", "/challenge/",
  "/privacy.html", "/terms.html", "/trust-lab.html", "/receptionist-intelligence.html"
];
const viewports = [
  { name: "mobile", width: 360, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 }
];
const screenshotRoutes = new Set(["/", "/pricing.html", "/get-started.html", "/blog/", "/learning-center/"]);
const browser = await chromium.launch({ headless: true });
const failures = [];
fs.mkdirSync("artifacts/site-qa", { recursive: true });

try {
  for (const viewport of viewports) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      try {
        const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 30000 });
        assert(response && response.status() === 200, route + ": expected HTTP 200");
        await page.locator("h1").first().waitFor({ state: "visible", timeout: 8000 });
        const layout = await page.evaluate(() => ({
          width: window.innerWidth,
          documentWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          h1Count: document.querySelectorAll("h1").length,
          overflowNodes: [...document.querySelectorAll("body *")].map((el) => {
            const r = el.getBoundingClientRect();
            return { tag: el.tagName.toLowerCase(), id: el.id, className: typeof el.className === "string" ? el.className.slice(0, 100) : "", left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
          }).filter((x) => x.right > window.innerWidth + 1 || x.left < -1 || x.scrollWidth > x.clientWidth + 2).sort((a, b) => b.right - a.right).slice(0, 8)
        }));
        assert(layout.documentWidth <= layout.width + 2,
          route + ": horizontal overflow at " + viewport.width + "px (" + layout.documentWidth + "px); elements=" + JSON.stringify(layout.overflowNodes));
        assert(layout.h1Count >= 1, route + ": missing visible page heading");
        if (route === "/pricing.html" && viewport.width === 360) {
          const toggle = page.locator(".site-global-toggle");
          await toggle.waitFor({ state: "visible", timeout: 5000 });
          await toggle.click();
          assert(await toggle.getAttribute("aria-expanded") === "true", "Mobile navigation did not expand");
          assert(await page.locator(".site-global-nav").isVisible(), "Mobile navigation panel is not visible");
          await toggle.click();
        }
        if (route === "/get-started.html") {
          const required = await page.locator("input[required], select[required], textarea[required]").count();
          const consent = await page.locator('input[type="checkbox"][required]').count();
          assert(required >= 5, "Discovery form: expected at least five required controls");
          assert(consent >= 1, "Discovery form: required privacy consent checkbox missing");
        }
        if (screenshotRoutes.has(route)) {
          const name = route.split("/").filter(Boolean).join("-").replace(".html", "") || "home";
          try {
            await page.screenshot({ path: path.join("artifacts/site-qa", name + "-" + viewport.name + ".png"), fullPage: false, timeout: 10000 });
          } catch (error) {
            console.warn("Screenshot skipped for " + route + " @ " + viewport.width + "px: " + error.message);
          }
        }
        console.log("PASS " + route + " @ " + viewport.width + "px");
      } catch (error) {
        failures.push(route + " @ " + viewport.width + "px: " + error.message);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error("Visual smoke tests failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("Responsive browser smoke tests passed at 360px, 768px and 1280px.");
