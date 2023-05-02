export {};

declare global {
  interface Window {
    __ASSET_DATA__: {
      assetFiles: string[];
      dupeFiles: string[];
    };
  }
}
