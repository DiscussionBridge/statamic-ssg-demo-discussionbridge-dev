import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

const layoutUrl = new URL("../authoring/resources/views/layout.antlers.html", import.meta.url);

function occurrences(source, token) {
  return source.split(token).length - 1;
}

test("canonical authoring layout owns one production-gated metadata and analytics fallback", async () => {
  const source = await readFile(layoutUrl, "utf8");

  assert.equal(occurrences(source, '<link rel="canonical"'), 1);
  assert.equal(occurrences(source, '<meta property="og:image"'), 1);
  assert.equal(occurrences(source, '<meta name="twitter:image"'), 1);
  assert.equal(occurrences(source, "G-K9SYR7QENF"), 2);
  assert.equal(occurrences(source, '{{ if config:app:env == "production" }}'), 1);
  assert.equal(occurrences(source, "https://statamic-ssg.demo.discussionbridge.dev"), 1);
  assert.match(source, /w\.location\.origin !== 'https:\/\/statamic-ssg\.demo\.discussionbridge\.dev'/);
  assert.match(source, /w\.__discussionBridgeDemoGa/);
  assert.match(source, /googletagmanager\.com\/gtag\/js\?id=/);

  const productionBlock = source.match(
    /{{ if config:app:env == "production" }}([\s\S]*?){{ \/if }}/,
  );
  assert.ok(productionBlock, "analytics must remain inside the production guard");
  assert.match(productionBlock[1], /<script>[\s\S]*G-K9SYR7QENF[\s\S]*<\/script>/);
});

test("analytics executes only for the canonical public origin and has one owner", async () => {
  const source = await readFile(layoutUrl, "utf8");
  const script = source.match(
    /<!-- DiscussionBridge demo analytics: G-K9SYR7QENF -->\s*<script>([\s\S]*?)<\/script>/,
  )?.[1];
  assert.ok(script, "analytics program must be extractable from the production block");

  const host = "statamic-ssg.demo.discussionbridge.dev";
  const cases = [
    ["ordinary", `https://${host}`, "/article/", false, false, 1],
    ["existing-loader", `https://${host}`, "/article/", true, false, 0],
    ["existing-marker", `https://${host}`, "/article/", false, true, 0],
    ["wrong-host", "https://preview.example", "/article/", false, false, 0],
    ["http", `http://${host}`, "/article/", false, false, 0],
    ["alternate-port", `https://${host}:8443`, "/article/", false, false, 0],
    ["preview", `https://${host}`, "/p/unpublished/", false, false, 0],
    ["admin", `https://${host}`, "/ghost/", false, false, 0],
  ];

  for (const [name, origin, pathname, hasLoader, hasMarker, expected] of cases) {
    const children = [];
    const window = { location: { origin, pathname } };
    if (hasMarker) window.__discussionBridgeDemoGa = true;
    const document = {
      querySelector: () => (hasLoader ? {} : null),
      createElement: (tag) => ({ tag }),
      head: { appendChild: (node) => children.push(node) },
    };
    const context = vm.createContext({ window, document, Date });

    vm.runInContext(script, context);
    vm.runInContext(script, context);

    assert.equal(children.length, expected, `${name}: loader count`);
    assert.equal(
      (window.dataLayer ?? []).filter((entry) => entry[0] === "config").length,
      expected,
      `${name}: config count`,
    );
  }
});
