import pluginCypress from 'eslint-plugin-cypress/flat'

export default [
  {
    ignores: [
      'node_modules/**',
      'cypress/reports/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'cypress/downloads/**',
    ],
  },
  pluginCypress.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
    },
  },
  {
    files: ['cypress.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
  },
]
