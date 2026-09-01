---
title: Statamic SSG · Simple comments
id: ssg-simple
template: default
blueprint: pages
discussionbridge_mode: simple
discussionbridge_topic_id: 40
---
# Simple comments in generated HTML

The article and its initial visible comments are ordinary static markup. During generation, the addon retrieves a bounded public reply snapshot from The Bridge, sanitizes it, and places it below this content. On each page load, a credential-free browser refresh replaces that fallback with the current public replies.

## Lightweight by default

The initial page remains small. New replies appear without rebuilding the site. Additional comments use the native **Show more comments** disclosure, and a bounded ceiling sends longer conversations back to The Bridge.

## No plugin credential in the browser

Simple mode is intentionally plugin-free. It needs no Bridge Record and ships no receiver secret with the generated site.
