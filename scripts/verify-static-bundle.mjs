import { createHash } from "node:crypto";
import { readFile, readdir, lstat } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_FILES = 20_000;
const MAX_BYTES = 256 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["html", "css", "js", "svg", "png", "jpg", "jpeg", "gif", "ico", "webp", "avif", "woff", "woff2", "txt", "xml", "webmanifest", "pdf"]);
const TEXT_EXTENSIONS = new Set(["html", "css", "js", "svg", "txt", "xml", "webmanifest"]);
const PROTECTED_TEXT = /DISCUSSIONBRIDGE_(?:CONNECTION_SECRET|SECRET_FILE)|\/srv\/www\/|<\?php|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/iu;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export async function verifyStaticBundle(root, host) {
  const siteRoot = resolve(root);
  const configuration = JSON.parse(await readFile(resolve(siteRoot, "wrangler.jsonc"), "utf8"));
  const assetRoot = resolve(siteRoot, configuration.assets?.directory ?? "");
  assert(assetRoot === resolve(siteRoot, "dist"), "Wrangler must serve this site's dist directory");
  assert(Array.isArray(configuration.routes) && configuration.routes.some((route) => route.pattern === host && route.custom_domain === true), "Wrangler custom domain does not match the expected host");
  assert(typeof configuration.name === "string" && configuration.name.length > 0, "Wrangler Worker name is missing");

  const rootStat = await lstat(assetRoot);
  assert(rootStat.isDirectory() && !rootStat.isSymbolicLink(), "Static bundle root must be a real directory");
  const files = [];
  const pending = [assetRoot];
  let totalBytes = 0;
  while (pending.length) {
    const directory = pending.pop();
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      assert(!entry.isSymbolicLink(), `Static bundle contains a symlink: ${relative(assetRoot, path)}`);
      if (entry.isDirectory()) { pending.push(path); continue; }
      assert(entry.isFile(), `Static bundle contains a non-file: ${relative(assetRoot, path)}`);
      const name = relative(assetRoot, path).split(sep).join("/");
      const extension = name.split(".").at(-1)?.toLowerCase();
      assert(ALLOWED_EXTENSIONS.has(extension), `Static bundle contains an unexpected file type: ${name}`);
      const bytes = await readFile(path);
      totalBytes += bytes.length;
      assert(files.length < MAX_FILES && totalBytes <= MAX_BYTES, "Static bundle exceeds the bounded preflight limits");
      if (TEXT_EXTENSIONS.has(extension)) assert(!PROTECTED_TEXT.test(bytes.toString("utf8")), `Static bundle contains protected server material: ${name}`);
      files.push({ name, size: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
    }
  }
  files.sort((left, right) => left.name.localeCompare(right.name, "en"));
  assert(files.some((file) => file.name === "index.html"), "Static bundle is missing its home page");
  assert(files.some((file) => file.name === "404.html"), "Static bundle is missing its 404 page");
  const digest = createHash("sha256").update(files.map((file) => `${file.name}\0${file.size}\0${file.sha256}\n`).join("")).digest("hex");
  return { worker: configuration.name, host, files: files.length, bytes: totalBytes, sha256: digest };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const host = process.argv[2];
  if (!host) { process.stderr.write("Expected the exact static-site hostname.\n"); process.exitCode = 2; }
  else {
    try { process.stdout.write(`${JSON.stringify(await verifyStaticBundle(process.cwd(), host))}\n`); }
    catch (error) { process.stderr.write(`Static bundle preflight failed: ${error.message}\n`); process.exitCode = 1; }
  }
}
