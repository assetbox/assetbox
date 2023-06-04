---
sidebar_position: 1
---

# Getting Started

AssetBox provides a visualization of the asset based on your front-end repository. It also provides a way to efficiently manage within a project by analyzing redundant management and the assets in use.


- **pnpm**

```sh
$ pnpm install @assetbox/cli @assetbox/manager -D
$ pnpm assetbox -v
```

- **yarn**

```sh
$ yarn add @assetbox/cli @assetbox/manager -D
$ yarn assetbox -v
```

- **npm**

```sh
$ npm install @assetbox/cli @assetbox/manager --save-dev
$ npm assetbox -v
```

# Setup


Open the package.json and change the script field.
```json twoslash title='package.json'
{
  "scripts": {
    "asset:manage": "assetbox manage",
    "asset:static-build": "assetbox static-build",
  }
}
```

Create config file
```sh
$ pnpm assetbox init # (or yarn or npm)
```

**Assume that you have the following folder structures.**
* src
  * assets/icons
    * heart.svg
    * fill-heart.svg
    * ...
  * assets/images
    * background.png
    * background.jpeg
    * ...
  * assets/animations
    * person.json (lottie)
    * ...
  * ...


```js twoslash title='assetbox.config.cjs'
// ---cut---
module.exports = {
  /**
    The key for `categories` will be the menu in the sidebar.
    Enter the folder locations for each category.
  **/
  categories: {
    Icon: ["./src/assets/icons/**/*"],
    Images: ["./src/assets/images/**/*"],
    Animations: ["./src/assets/animations/**/*"]
  },
  /**
    Enter the folder where the assets declared in `categories` are used.
    This is utilized for static analysis.
  **/
  trackingPaths: ["./src/**/*"],
}
```

```sh
$ pnpm assetbox manage # (or yarn or npm)
```

 <img
  alt="preview"
  src="https://user-images.githubusercontent.com/41789633/241983401-b6458ff1-f5a5-4f74-984d-f80b9dac83c2.png"
  />