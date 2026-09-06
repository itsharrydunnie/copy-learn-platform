import { config } from '@pacepard/configs/eslint/base.js'

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  ...config,
]
