import "dotenv/config";
import { spawnSync } from "node:child_process";

const dbUrl =
  process.env.SUPABASE_DB_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_DB_URL ||
  process.env.DATABASE_URL;

if (!dbUrl) {
  console.error(
    "Missing DB URL. Set SUPABASE_DB_URL (preferred) or DATABASE_URL in .env before running db:init."
  );
  process.exit(1);
}

const result = spawnSync(
  "npx",
  ["supabase", "db", "push", "--db-url", dbUrl, "--include-all", "--yes"],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
