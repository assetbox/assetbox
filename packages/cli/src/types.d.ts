import { AssetBoxData } from "@assetbox/manager";
export {};

declare global {
  // TODO: not yet scheme
  interface Window {
    __ASSET_DATA__: AssetBoxData;
  }
}
