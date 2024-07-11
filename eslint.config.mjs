import { fixupConfigRules } from '@eslint/compat';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import sonarjs from 'eslint-plugin-sonarjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/libs/*.js', 'node_modules/**/*', '.env/**/*', 'dist/**/*'],
  },
  sonarjs.configs.recommended,
  ...fixupConfigRules(
    compat.extends(
      'plugin:react-hooks/recommended',
      'plugin:@tanstack/eslint-plugin-query/recommended'
    )
  ),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          modules: true,
        },
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {},
  },
];
