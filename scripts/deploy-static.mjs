import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { verifyStaticBundle } from "./verify-static-bundle.mjs";

const host = "statamic-ssg.demo.discussionbridge.dev";
const dryRun = process.argv.length === 3 && process.argv[2] === "--dry-run";
if (process.argv.length > (dryRun ? 3 : 2)) {
  process.stderr.write("Only --dry-run is supported.\n");
  process.exitCode = 2;
} else {
  try {
    process.stdout.write(`Static bundle verified: ${JSON.stringify(await verifyStaticBundle(process.cwd(), host))}\n`);
    const wrangler = resolve("node_modules", "wrangler", "bin", "wrangler.js");
    const args = [wrangler, "deploy", "--config", "wrangler.jsonc", ...(dryRun ? ["--dry-run"] : ["--strict"])];
    const child = spawn(process.execPath, args, { stdio: "inherit", cwd: process.cwd(), windowsHide: true });
    process.exitCode = await new Promise((resolveExit, reject) => {
      child.once("error", reject);
      child.once("exit", (code) => resolveExit(code ?? 1));
    });
  } catch (error) {
    process.stderr.write(`Static deployment stopped: ${error.message}\n`);
    process.exitCode = 1;
  }
}
