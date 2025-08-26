/// <reference types="vite/client" />

// envs for renderer process ONLY, the one in types/env.d.ts should be global

interface ImportMetaEnv {
  readonly VITE_STARTGG_AUTH_TOKEN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}