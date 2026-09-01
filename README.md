# Statamic SSG DiscussionBridge demo

This repository records the public static output boundary and the nonsecret
authoring delta for `statamic-ssg.demo.discussionbridge.dev`.

The protected authoring/build application runs separately as `statamicssg` on
the shared platform host. It uses Statamic's official SSG package and the same
`codeworkslabs/statamic-discussion-bridge` addon product used by the live Flat
and DB profiles. The current SSG output was generated with addon
`0.1.0-alpha.19` at commit `355a1d5643a078694a6bb7c19a29dc47fc299811`;
its presentation styles are deliberately emitted once per generated page so a
long-running SSG process cannot omit them after rendering its first page.
Simple pages include a generated, sanitized reply snapshot and a bundled
credential-free browser refresh for current public replies. The uploaded
Cloudflare Worker asset bundle contains
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

The ten-page generated estate includes two shared-topic demonstrations plus the native Discourse-as-Publisher
entry at `/discussionbridge/the-bridge-publishes-everywhere/`. Its authoring
record is a genuine Statamic entry with explicit native-materialization
authority and source revision `post:149:version:1`; the public bundle contains
neither the connection secret nor a PHP runtime.
