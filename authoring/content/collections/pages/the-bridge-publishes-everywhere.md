---
id: 48065d0b-0cd9-4370-a0d4-0c20f915c799
blueprint: page
title: 'The Bridge publishes everywhere'
discussionbridge_native_publication: true
discussionbridge_resource_id: f16184e8-ac9f-44d7-9b9d-436131936ed3
discussionbridge_topic_id: 53
discussionbridge_topic_url: 'https://bridge.demo.discussionbridge.dev/t/the-bridge-publishes-everywhere/53'
discussionbridge_source_revision: 'post:149:version:2'
discussionbridge_publish: false
---

<p>DiscussionBridge keeps a discussion independent from any one CMS while letting each platform present the same forum-owned source as native content. This article is the canonical source for the first <strong>Discourse as Publisher</strong> demonstration.</p>
<h2>One source, native destinations</h2>
<p>The Bridge owns this article, its revision history, author, moderation, and replies. Each authorized adapter receives an exact source revision and materializes a genuine platform record—not an iframe and not a manually copied page.</p>
<p>The first publication set targets Astro, WordPress, Ghost, Statamic Flat, Statamic DB, Statamic SSG, and Hugo. Every destination retains its own native URL and platform identity while pointing back to this topic as the discussion authority.</p>
<h2>Idempotent publication</h2>
<p>A destination creates its native record once. Repeating the same publication revision is a no-op. Editing this first post advances the source revision, allowing each adapter to update the existing native record without changing its Bridge resource, destination URL, or topic.</p>
<pre><code class="lang-mermaid">flowchart LR
  B[The Bridge] --&gt; A[Astro]
  B --&gt; W[WordPress]
  B --&gt; G[Ghost]
  B --&gt; SF[Statamic Flat]
  B --&gt; SD[Statamic DB]
  B --&gt; SS[Statamic SSG]
  B --&gt; H[Hugo]
</code></pre>
<h2>Portable presentation, forum-owned discussion</h2>
<p>Destination themes control typography and layout. DiscussionBridge transports bounded cooked content plus exact provenance. Replies remain on The Bridge and can appear through Simple, Full, or fullInteractive discussion modes without transferring moderation or login authority to a CMS.</p>
<p>This is the flagship workflow in action: <strong>publish once from The Bridge, materialize natively everywhere, and keep the discussion free.</strong></p>
<h2>Revision propagation</h2>
<p>This controlled update proves that one Discourse revision updates all seven native platform records in place without changing their destination identity.</p><hr><aside class="discussionbridge-publication"><p><strong>Published from <a href="https://bridge.demo.discussionbridge.dev/t/the-bridge-publishes-everywhere/53">The Bridge</a></strong></p><p>Source author: DiscussionBridge · Revision post:149:version:2 · Statamic 6 · DiscussionBridge for Statamic 0.1.0-alpha.16</p></aside>