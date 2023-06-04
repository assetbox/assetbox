---
sidebar_position: 3
---

# Static Build
Deploying static files in places such as s3 allows designers and developers to share the asset that exists in the project. It's like an in-house icon viewer.

Create a static file in the `assetbox.config.cjs` file based on the `category`.
Build output folder is `assetbox-dist`

In this case, the administrative portion is lost and replaced with read-only.
Can be used as an icon viewer

```sh
$ pnpm asset:static-build 
```

Please deploy `assetbox-dist` as it is