# Statamic SSG DiscussionBridge demo

This repository records the public static output boundary and the nonsecret
authoring delta for `statamic-ssg.demo.discussionbridge.dev`.

The protected authoring/build application runs separately as `statamicssg` on
the shared platform host. It uses Statamic's official SSG package and the exact
same `codeworkslabs/statamic-discussion-bridge` addon installed by the live
Flat and DB profiles. The deployed Cloudflare Worker serves generated files
only: it has no PHP runtime, Statamic control panel, receiver credential, or
adapter worker.

Build order:

1. update the protected authoring application;
2. run `php please discussionbridge:ssg-prepare`;
3. run `php please ssg:generate`;
4. copy `storage/app/static` into `dist`;
5. verify and deploy the immutable generated output.

Never deploy when the DiscussionBridge preparation gate or SSG generation
fails.
