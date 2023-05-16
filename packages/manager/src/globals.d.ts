import { AssetBoxData } from "./App";
export {};

declare global {
  // TODO: not yet scheme
  interface Window {
    __ASSET_DATA__: AssetBoxData;
  }
}
