module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    extraFileExtensions: ['.cjs']
  },
  ignorePatterns: ['/lib/**/*'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'comma-dangle': ['error', 'never'],
    'quote-props': ['error', 'as-needed'],
    semi: 'off',
    indent: 'off',
    'object-curly-spacing': ['error', 'always'],
    'operator-linebreak': 'off',
    'import/no-unresolved': 0,
    'linebreak-style': ['error', 'unix']
  }
}
