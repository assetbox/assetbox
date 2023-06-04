---
sidebar_position: 6
---

# How does it work ?

## How does where an asset is being used work?
Search for all strings `"`, `'` with a regular expression and match them with the paths to the assets in the assetbox. 

For example
```js
import Example from "../../example.svg";
```

Finds `"../../example.svg"`, converts it to a relative path, and matches it with the paths of the assets in the assetbox. 

