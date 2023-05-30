<div align="center">
  <img src="https://github.com/assetbox/assetbox/assets/41789633/5e8e549e-e00f-4f90-a6c7-dc6c34ed4881" height="70" />
  <br />
  <br />
  
  [![NPM](https://img.shields.io/npm/v/@assetbox/cli)](https://www.npmjs.com/package/@assetbox/cli)
  
  <img width="1419" alt="image" src="https://github.com/assetbox/assetbox/assets/41789633/b6458ff1-f5a5-4f74-984d-f80b9dac83c2">


  
  <p>
    Visualizes and manages icon and image files within your frontend project.
    <br />
    Static analysis also tracks where the asset is being used.
  </p>
</div>
  

* [Installation](#Installation)  
* [Getting Started for manage](#Getting-Started-for-manage)  
* [Static Build](#Static-Build)
* [Coverage](#Coverage) 
* [How does it work?](#How-does-it-work?)

## Installation

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

## Getting Started for manage

Open the package.json and change the script field.
```json
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


* **assetbox.config.cjs**
```js
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
$ pnpm asset:manage
```

## Static Build
Create a static file in the `assetbox.config.cjs` file based on the `category`.
Build output folder is `assetbox-dist`

In this case, the administrative portion is lost and replaced with read-only.
Can be used as an icon viewer

```sh
$ pnpm asset:static-build 
```

## Coverage
<img width="234" alt="image" src="https://github.com/assetbox/assetbox/assets/41789633/c98eaeda-079a-424b-bdfc-487a6aac5fdf">

`Used Coverage` quantifies whether all assets are used.  
* (Used assets count / All assets count)  
  
`Unique Coverage` quantifies whether all assets have no duplicates.  
* ((All assets count - Duplicated assets count) / All assets count)  


## How does it work?

### How does where an asset is being used work?
Search for all strings `"`, `'` with a regular expression and match them with the paths to the assets in the assetbox. 

For example
```js
import Example from "../../example.svg";
```

Finds `"../../example.svg"`, converts it to a relative path, and matches it with the paths of the assets in the assetbox. 
