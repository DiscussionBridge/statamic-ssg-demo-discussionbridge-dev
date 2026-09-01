# Statamic SSG DiscussionBridge demo

This repository records the public static output boundary and the nonsecret
authoring delta for `statamic-ssg.demo.discussionbridge.dev`.

The protected authoring/build application runs separately as `statamicssg` on
the shared platform host. It uses Statamic's official SSG package and the exact
same `codeworkslabs/statamic-discussion-bridge` addon installed by the live
Flat and DB profiles. The current output was generated with addon
`0.1.0-alpha.14` at commit `cfe101d0e98728892fa4b1fea3c55d5f52d7e4a7`;
its presentation styles are deliberately emitted once per generated page so a
long-running SSG process cannot omit them after rendering its first page. The
uploaded Cloudflare Worker asset bundle contains
generated files only: it has no PHP runtime, Statamic control panel, receiver
credential, or adapter worker. Cloudflare currently injects its separately
managed Web Analytics beacon into live HTTP responses; that edge-added script
is not part of the committed or generated asset bundle.

Build order:

1. update the protected authoring application;
2. clear the Statamic Stache after content or template changes;
3. run `php please discussionbridge:ssg-prepare`;
4. run `php please ssg:generate`;
5. copy `storage/app/static` into `dist`;
6. verify and deploy the immutable generated output.

Never deploy when the DiscussionBridge preparation gate or SSG generation
fails.
