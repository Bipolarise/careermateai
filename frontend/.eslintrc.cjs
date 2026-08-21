module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    // Pin resolution of the relative `project` path to this directory so linting
    // works regardless of the cwd the ESLint process was started from (editor,
    // CI, or the repo-root pre-commit hook), not just when run from `frontend/`.
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist', 'coverage', 'playwright-report', 'test-results', '*.config.js'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['vite.config.ts', 'playwright.config.ts', 'e2e/**'],
      },
    ],
    // Every label/control pair here is associated via matching htmlFor/id, not DOM
    // nesting (labels sit next to, not around, their controls) — that's a fully
    // valid a11y pattern, so only check for it instead of also requiring nesting.
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'htmlFor' }],
    // This codebase uses ES6 default parameters for optional props (the modern
    // functional-component idiom), not the legacy static defaultProps.
    'react/require-default-props': ['error', { ignoreFunctionalComponents: true }],
    // `_id` is MongoDB's/Mongoose's convention, coming straight through API responses.
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
