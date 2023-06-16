<div align="center">
  <img src="https://github.com/assetbox/assetbox/assets/41789633/5e8e549e-e00f-4f90-a6c7-dc6c34ed4881" height="70" />
  <br />
  <br />
  
  [![NPM](https://img.shields.io/npm/v/@assetbox/cli)](https://www.npmjs.com/package/@assetbox/cli)
  
  <img width="1419" alt="image" src="https://github.com/assetbox/assetbox/assets/41789633/9a3a72a2-52ee-4e22-a2e6-ab80fab64cf9">
  
  <p>
    Visualizes and manages icon and image files within your frontend project.
    <br />
    Static analysis also tracks where the asset is being used.
  </p>
  
  [Visit Docs](https://assetbox.github.io)  
  [Demo](https://github.com/assetbox/demo)
  
</div>

* [Installation](#Installation)  
* [Manage](#Manage) 
* [Static Build](#Static-Build) 
* [Icon Build](#Icon-Build) 
* [Contributor Guide](#Contributor-Guide) 

## Installation

- **pnpm**

```sh
$ pnpm install @assetbox/cli -D
$ pnpm assetbox -v
```

- **yarn**

```sh
$ yarn add @assetbox/cli -D
$ yarn assetbox -v
```

- **npm**

```sh
$ npm install @assetbox/cli --save-dev
$ npm assetbox -v
```

## Manage
The local management server runs.
You can check if the asset that exists in the project is being used or duplicated.

[Getting Started](https://assetbox.github.io/docs/getting-started)  
[Duplicated Assets Guide](https://assetbox.github.io/docs/category/duplicated-assets-guide)  


## Static Build
Create a static file in the `assetbox.config.cjs` file based on the `category`.
Build output folder is `assetbox-dist`

In this case, the administrative portion is lost and replaced with read-only.
Can be used as an icon viewer

[Static Build Demo](https://assetbox.github.io/demo)  
[Static Build Guide](https://assetbox.github.io/docs/static-build)    


## Icon Build
Transfiles SVG files to component code for SVG code sharing.

You can create an common icon library by using Monorepo or by distributing it to npm.

[Icon Build Demo](https://www.npmjs.com/package/@assetbox/demo?activeTab=code)  
[Icon Build Guide](https://assetbox.github.io/docs/icon-build)  


## Contributor Guide

If you want a pull request for bugs or performance improvement, please check the following guide.  
[CONTRIBUTING.md](https://github.com/assetbox/assetbox/blob/main/CONTRIBUTING.md)
