import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import checkFile from 'eslint-plugin-check-file';
import oxlint from 'eslint-plugin-oxlint';
import preferArrow from 'eslint-plugin-prefer-arrow-functions';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// typescript-eslint не поддерживает TS 7 (нужен TS JS API), поэтому здесь
// только правила без информации о типах. Проверки с типами выполняет oxlint
// (--type-aware, tsgolint), а правила, уже покрытые oxlint, отключает
// eslint-plugin-oxlint в конце конфига.
export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
  }),
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
  ]),
  {
    files: ['**/*.{js,mjs,ts,mts}'],
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      'prefer-arrow': preferArrow,
      'check-file': checkFile,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/max-len': ['error', {
        code: 80,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'check-file/filename-naming-convention': ['error', {
        'src/**/*.!(test).ts': 'KEBAB_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '_.*',
        argsIgnorePattern: '^_',
      }],

      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

      // rules from htmlacademy config
      'no-template-curly-in-string': 'error',
      'no-use-before-define': ['error', { functions: false }],
      'accessor-pairs': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'camelcase': 'error',
      'eqeqeq': ['error', 'always'],
      'no-alert': 'error',
      'no-nested-ternary': 'error',
      'no-return-assign': 'error',
      'no-shadow': ['error', { hoist: 'all' }],
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'radix': 'error',
      // end rules from htmlacademy config

      'prefer-arrow/prefer-arrow-functions': ['error', {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      }],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
);
