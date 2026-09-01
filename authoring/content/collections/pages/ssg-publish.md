---
title: Statamic SSG · Publishing through The Bridge
id: ssg-publish
slug: discussionbridge/publishing-through-the-bridge
template: default
blueprint: pages
discussionbridge_publish: true
---
# A build prepared before it is published

This entry opts into DiscussionBridge inside the protected Statamic authoring application. Before static generation begins, the addon reconciles delivery state and resolves the entry into one durable Bridge Record and one companion topic.

## Stable across rebuilds

The identity comes from the Statamic site, collection, and entry—not a mutable build folder. Rebuilding the generated site resolves the same record instead of creating a replacement topic.

## Static delivery, live discussion

The article becomes generated HTML. The discussion remains a live, credential-free frame owned by The Bridge, so replies and moderation do not wait for another static build.
