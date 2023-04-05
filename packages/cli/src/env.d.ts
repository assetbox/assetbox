interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly ESBUILD_PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
