import fs from "node:fs";

const legalPages = [
  "privacy.html",
  "terms.html",
  "ai-compliance.html",
  "recording-notice.html",
  "sms-terms.html",
];
const requiredNavLinks = [
  '["Privacy","/privacy.html"',
  '["Terms","/terms.html"',
];
const errors = [];
for (const file of legalPages) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required legal page: ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes('href="./legal.css"')) errors.push(`${file}: missing shared legal.css`);
  if (!html.includes('src="/site-header.js"')) errors.push(`${file}: missing shared site navigation script`);
  if (!html.includes('class="legal-footer"')) errors.push(`${file}: missing consistent legal footer`);
  if (!/Effective\s+[A-Z][a-z]+\s+\d{1,2},\s+\d{4}/i.test(html)) errors.push(`${file}: missing or unrecognized effective date`);
  if ((file === "privacy.html" || file === "terms.html") && html.includes('class="legal-nav"')) {
    errors.push(`${file}: duplicate local legal navigation should be omitted in favor of the shared site header`);
  }
}
if (!fs.existsSync("site-header.js")) {
  errors.push("Missing site-header.js");
} else {
  const header = fs.readFileSync("site-header.js", "utf8");
  for (const link of requiredNavLinks) {
    if (!header.includes(link)) errors.push(`site-header.js: shared navigation missing legal destination ${link}`);
  }
}
if (!fs.existsSync("legal.css")) {
  errors.push("Missing legal.css");
} else {
  const css = fs.readFileSync("legal.css", "utf8");
  for (const token of [
    "--legal-bg: #0b141c",
    "--legal-text: #f1f6f4",
    "--legal-muted: #c3d0d2",
    "background: var(--legal-bg) !important",
    "font-size: 16px !important",
    ":focus-visible",
    "@media (max-width: 600px)",
  ]) {
    if (!css.includes(token)) errors.push(`legal.css: required readability rule missing: ${token}`);
  }
}
if (errors.length) {
  console.error("Legal readability checks failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Passed: ${legalPages.length} legal pages use the shared readable layout and global navigation, effective dates and consistent footer.`);
