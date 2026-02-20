import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const docsDir = path.join(root, "docs");
const indexFile = path.join(docsDir, "index.html");

if (!existsSync(distDir)) {
  console.error("Missing dist folder. Run `npm run build:web` first.");
  process.exit(1);
}

rmSync(docsDir, { recursive: true, force: true });
mkdirSync(docsDir, { recursive: true });
cpSync(distDir, docsDir, { recursive: true });

if (!existsSync(indexFile)) {
  console.error("Export succeeded but docs/index.html is missing.");
  process.exit(1);
}

const html = readFileSync(indexFile, "utf8")
  .replaceAll('src="/_expo/', 'src="./_expo/')
  .replaceAll('href="/_expo/', 'href="./_expo/')
  .replaceAll('src="/favicon', 'src="./favicon')
  .replaceAll('href="/favicon', 'href="./favicon');

writeFileSync(indexFile, html, "utf8");
writeFileSync(path.join(docsDir, "404.html"), html, "utf8");
writeFileSync(path.join(docsDir, ".nojekyll"), "", "utf8");

console.log("Prepared docs/ for GitHub Pages deployment.");
