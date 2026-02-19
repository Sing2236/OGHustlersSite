import "dotenv/config";
import { spawnSync } from "node:child_process";

const projectRef =
  process.env.SUPABASE_PROJECT_REF ||
  (process.env.EXPO_PUBLIC_SUPABASE_URL || "")
    .replace(/^https?:\/\//, "")
    .replace(/\.supabase\.co\/?$/, "");

const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!projectRef) {
  console.error("Missing SUPABASE_PROJECT_REF or EXPO_PUBLIC_SUPABASE_URL in .env");
  process.exit(1);
}

if (!dbPassword) {
  console.error("Missing SUPABASE_DB_PASSWORD in .env");
  process.exit(1);
}

const linkResult = spawnSync(
  "npx",
  ["supabase", "link", "--project-ref", projectRef, "--password", dbPassword, "--yes"],
  { stdio: "inherit", shell: process.platform === "win32" }
);

if (linkResult.status !== 0) {
  process.exit(linkResult.status ?? 1);
}

const pushResult = spawnSync(
  "npx",
  ["supabase", "db", "push", "--include-all", "--yes"],
  { stdio: "inherit", shell: process.platform === "win32" }
);

process.exit(pushResult.status ?? 0);
