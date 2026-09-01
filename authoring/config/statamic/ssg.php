<?php

return [
    'base_url' => config('app.url'),
    'destination' => storage_path('app/static'),
    'copy' => [],
    'symlinks' => [],
    'urls' => [],
    'exclude' => ['/cp', '/!/auth', '/!/graphql'],
    'enforce_trailing_slashes' => true,
    'pagination_route' => '{url}/{page_name}/{page_number}',
    'glide' => ['directory' => 'img', 'override' => true],
    'failures' => 'warnings',
];
