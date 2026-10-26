import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  // TODO: Delete after development
  {
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
]);
