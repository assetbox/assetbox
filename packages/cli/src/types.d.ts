import type { AssetBoxData } from "@assetbox/tools";
export {};

declare global {
  // TODO: not yet scheme
  interface Window {
    __ASSET_DATA__: AssetBoxData;
  }
}
