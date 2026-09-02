import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const layout = await readFile(join(root, "authoring/resources/views/layout.antlers.html"), "utf8");
const style = layout.match(/<style>[\s\S]*?<\/style>/u)?.[0];
const footer = layout.match(/<footer class="db-footer">[\s\S]*?<\/footer>/u)?.[0];
if (!style || !footer) throw new Error("Authoring layout social boundary is incomplete");

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

const files = await htmlFiles(join(root, "dist"));
for (const file of files) {
  const current = await readFile(file, "utf8");
  if ((current.match(/<footer class="db-footer">/gu) ?? []).length !== 1) {
    throw new Error(`Unexpected footer boundary: ${file}`);
  }
  const updated = current
    .replace(/<style>[\s\S]*?<\/style>/u, style)
    .replace(/<footer class="db-footer">[\s\S]*?<\/footer>/u, footer);
  await writeFile(file, updated, "utf8");
}
console.log(`Refreshed ${files.length} generated Statamic SSG pages.`);
