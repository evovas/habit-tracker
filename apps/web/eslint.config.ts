import featureSliced from '@conarti/eslint-plugin-feature-sliced';
import eslint from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import checkFile from 'eslint-plugin-check-file';
import compat from 'eslint-plugin-compat';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import oxlint from 'eslint-plugin-oxlint';
import preferArrow from 'eslint-plugin-prefer-arrow-functions';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Для правил с типизацией typescript-eslint использует TS 6 (см. .pnpmfile.cjs),
// поскольку TS 7 пока не имеет совместимого JS API.
export default defineConfig(
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '.pnpmfile.cjs',
  ]),
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  eslintReact.configs['strict-type-checked'],
  eslintReact.configs['naming-convention'],
  reactHooks.configs.flat['recommended-latest'],
  reactRefreshPlugin.configs.vite,
  jsxA11y.flatConfigs.strict,
  reactYouMightNotNeedAnEffect.configs.strict,
  compat.configs['flat/recommended'],
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: true,
  }),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['stylelint.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
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
      // Форматирование (в OXLint его нет)
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/max-len': ['error', {
        code: 80,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignorePattern: 'd=.*|<!--.*|className=.*|src=.*|href=.*',
      }],

      // Имена файлов и папок: компоненты в PascalCase, хуки (useFoo.ts) —
      // camelCase в любом слайсе FSD, остальное в kebab-case. Шаблоны не
      // пересекаются: плагин проверяет файл по всем подходящим шаблонам.
      'check-file/filename-naming-convention': ['error', {
        'src/**/!(main).tsx': 'PASCAL_CASE',
        'src/**/!(use[A-Z]*).ts': 'KEBAB_CASE',
        'src/**/use[A-Z]*.ts': 'CAMEL_CASE',
      }, {
        ignoreMiddleExtensions: true,
      }],
      // `@x` — папка для кросс-импортов между сущностями в FSD
      'check-file/folder-naming-convention': ['error', {
        'src/**/': 'KEBAB_CASE',
      }, {
        ignoreWords: ['@x'],
      }],

      // Имена переменных, функций и типов
      '@typescript-eslint/naming-convention': ['error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
        {
          // PascalCase — для компонентов, UPPER_CASE — для констант
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'parameter',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE'],
        },
      ],

      '@stylistic/jsx-one-expression-per-line': 'off',

      'prefer-arrow/prefer-arrow-functions': ['error', {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      }],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // Дубли правил OXLint (react/*, react-hooks/*) — проверяет OXLint
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/jsx-no-children-prop': 'off',
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/no-direct-mutation-state': 'off',
      '@eslint-react/dom-no-find-dom-node': 'off',
      '@eslint-react/dom-no-render-return-value': 'off',
      '@eslint-react/jsx-no-comment-textnodes': 'off',
      '@eslint-react/jsx-no-useless-fragment': 'off',
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
      '@eslint-react/dom-no-dangerously-set-innerhtml-with-children': 'off',
      '@eslint-react/dom-no-script-url': 'off',
      '@eslint-react/dom-no-unsafe-iframe-sandbox': 'off',
      '@eslint-react/dom-no-missing-iframe-sandbox': 'off',
      '@eslint-react/dom-no-void-elements-with-children': 'off',
      '@eslint-react/dom-no-missing-button-type': 'off',
      '@eslint-react/dom-no-unsafe-target-blank': 'off',
      '@eslint-react/jsx-no-namespace': 'off',
      '@eslint-react/no-missing-key': 'off',
      '@eslint-react/no-children-count': 'off',
      '@eslint-react/no-children-for-each': 'off',
      '@eslint-react/no-children-map': 'off',
      '@eslint-react/no-children-only': 'off',
      '@eslint-react/no-children-to-array': 'off',
      '@eslint-react/no-component-will-mount': 'off',
      '@eslint-react/no-component-will-receive-props': 'off',
      '@eslint-react/no-component-will-update': 'off',
      '@eslint-react/no-unsafe-component-will-mount': 'off',
      '@eslint-react/no-unsafe-component-will-receive-props': 'off',
      '@eslint-react/no-unsafe-component-will-update': 'off',
      '@eslint-react/no-set-state-in-component-did-mount': 'off',
      '@eslint-react/no-set-state-in-component-did-update': 'off',
      '@eslint-react/no-set-state-in-component-will-update': 'off',
      '@eslint-react/no-unstable-default-props': 'off',
      '@eslint-react/no-nested-component-definitions': 'off',
      '@eslint-react/no-unstable-context-value': 'off',
      '@eslint-react/no-class-component': 'off',
      '@eslint-react/error-boundaries': 'off',
      '@eslint-react/purity': 'off',
      '@eslint-react/set-state-in-render': 'off',
      '@eslint-react/static-components': 'off',
      '@eslint-react/unsupported-syntax': 'off',
      '@eslint-react/use-memo': 'off',
      // Дубли правил react-hooks; их проверяет OXLint
      '@eslint-react/rules-of-hooks': 'off',
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/set-state-in-effect': 'off',
    },
  },
  {
    files: ['*.config.{js,mjs,cjs,ts,mts}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'check-file/filename-naming-convention': 'off',
      'compat/compat': 'off',
    },
  },
  featureSliced(),
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    rules: {
      '@conarti/feature-sliced/import-order': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/shared/ui/icons.ts', 'src/shared/ui/HugeIcon.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{
          name: '@hugeicons/core-free-icons',
          message: 'Use IconName from @/shared/ui — add icon to shared/ui/icons.ts',
        }],
      }],
    },
  },
  // Всё, что умеет OXLint (включая type-aware), ESLint не проверяет.
  // Должно идти последним.
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json', {
    typeAware: true,
  }),
);
