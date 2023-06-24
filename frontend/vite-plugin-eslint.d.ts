declare module 'vite-plugin-eslint' {
  import { type Linter } from 'eslint';
  import { type Plugin } from 'vite';

  type EslintPluginOptions = {
    [key: string]: unknown;
    cache?: boolean;
    eslint: Linter.Config;
    throwOnWarning?: boolean;
  };

  export default function eslintPlugin(options?: EslintPluginOptions): Plugin;
}
