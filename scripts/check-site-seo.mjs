import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const excluded = (file) => {
  const p = file.replaceAll("\\", "/");
  return p.startsWith("admin/") || p.startsWith("client/") ||
    p.startsWith("partner-portal/") ||
    ["newsletter-admin.html", "partners-admin.html", "trust-lab-admin.html",
     "checkout.html", "checkout-complete.html"].includes(p);
};
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && full.endsWith(".html") ? [full] : [];
  });
}
const files = walk(root).map((f) => path.relative(root, f).replaceAll("\\", "/"));
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const urls = [...sitemap.matchAll(/<loc>\s*(https:\/\/star69ai\.com[^<]+)\s*<\/loc>/g)].map((m) => m[1]);
const problems = [];

for (const file of files.filter((f) => !excluded(f))) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const head = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0] ?? "";
  const title = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = head.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1];
  const canonical = head.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (!title) problems.push(file + ": missing title");
  if (!description || description.length < 50 || description.length > 180)
    problems.push(file + ": missing or unusually sized meta description");
  if (!canonical) problems.push(file + ": missing canonical URL");
  else if (!canonical.startsWith("https://star69ai.com/"))
    problems.push(file + ": canonical is outside the production domain");
  if (h1Count < 1) problems.push(file + ": missing H1");
  if (canonical && !urls.includes(canonical))
    problems.push(file + ": canonical URL is missing from sitemap (" + canonical + ")");
}

const requiredDisallows = ["/client/", "/admin/", "/partner-portal/", "/partners-admin.html", "/trust-lab-admin.html", "/newsletter-admin.html"];
for (const route of requiredDisallows) {
  if (!robots.includes("Disallow: " + route)) problems.push("robots.txt: missing " + route + " exclusion");
}

for (const url of urls) {
  const pathname = new URL(url).pathname;
  const candidate = pathname.endsWith("/") ? pathname + "index.html" : pathname;
  const file = candidate.replace(/^\//, "");
  if (!fs.existsSync(path.join(root, file))) problems.push("sitemap.xml: URL has no matching file " + url);
}
if (new Set(urls).size !== urls.length) problems.push("sitemap.xml: duplicate URLs");

if (problems.length) {
  console.error("Site SEO checks failed:\n- " + problems.join("\n- "));
  process.exit(1);
}
console.log(\`Site SEO checks passed: \${files.filter((f) => !excluded(f)).length} public HTML pages checked; \${urls.length} sitemap URLs validated.\`);
