---
title: Statamic SSG · Full comments
id: ssg-full
slug: discussionbridge/full-comments
template: default
blueprint: pages
discussionbridge_mode: full
discussionbridge_canonical_url: https://statamic-ssg.demo.discussionbridge.dev/discussionbridge/full-comments/
---
# Full comments on a static page

This mode keeps the page completely static while Discourse Core owns the live comments frame. The canonical page URL is the stable identity used to create or resolve its companion topic.

## Standard Discourse behavior

Sessions, moderation, reply composition, dynamic height, and topic state remain with The Bridge. Statamic SSG contributes the generated article and host-page navigation only.

## Upgrade path remains open

An operator can begin with this plugin-free mode and later adopt the same canonical discussion into a Bridge-managed record when the stronger workflow is needed.
