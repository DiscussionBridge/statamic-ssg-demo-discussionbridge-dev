import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { verifyStaticBundle } from "../scripts/verify-static-bundle.mjs";

const HOST = "statamic-ssg.demo.discussionbridge.dev";

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "discussionbridge-static-preflight-"));
  await mkdir(join(root, "dist"));
  await writeFile(join(root, "wrangler.jsonc"), JSON.stringify({ name: "statamic-ssg-demo", assets: { directory: "./dist" }, routes: [{ pattern: HOST, custom_domain: true }] }));
  await writeFile(join(root, "dist", "index.html"), "<!doctype html><title>Demo</title>");
  await writeFile(join(root, "dist", "404.html"), "<!doctype html><title>Not found</title>");
  return root;
}

test("valid static bundle has a stable content inventory", async (t) => {
  const root = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  const first = await verifyStaticBundle(root, HOST);
  assert.equal(first.files, 2);
  assert.equal(first.host, HOST);
  assert.equal(first.sha256, (await verifyStaticBundle(root, HOST)).sha256);
  await writeFile(join(root, "dist", "index.html"), "<!doctype html><title>Changed</title>");
  assert.notEqual((await verifyStaticBundle(root, HOST)).sha256, first.sha256);
});

test("preflight rejects wrong host, protected content and executable files", async (t) => {
  const root = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  await assert.rejects(verifyStaticBundle(root, "other.example"), /custom domain/u);
  await writeFile(join(root, "dist", "index.html"), "DISCUSSIONBRIDGE_CONNECTION_SECRET=unsafe");
  await assert.rejects(verifyStaticBundle(root, HOST), /protected server material/u);
  await writeFile(join(root, "dist", "index.html"), "<!doctype html><title>Demo</title>");
  await writeFile(join(root, "dist", "wp-config.php"), "<?php");
  await assert.rejects(verifyStaticBundle(root, HOST), /unexpected file type/u);
});

test("preflight rejects a symlink inside the bundle", async (t) => {
  const root = await fixture();
  t.after(() => rm(root, { recursive: true, force: true }));
  try { await symlink(join(root, "dist", "index.html"), join(root, "dist", "linked.html")); }
  catch (error) {
    if (error.code === "EPERM") { t.skip("This Windows account cannot create symlinks"); return; }
    throw error;
  }
  await assert.rejects(verifyStaticBundle(root, HOST), /symlink/u);
});
