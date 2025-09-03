module.exports = {
  // 此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,
  // 指定如何解析语法。可以为空，但若不为空，只能配该值
  parser: 'vue-eslint-parser',
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    // 指定ESlint的解析器
    parser: '@typescript-eslint/parser',
    // 允许使用ES语法
    ecmaVersion: 2020,
    // 允许使用import
    sourceType: 'module',
    // 允许解析JSX
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['vue', 'html', 'prettier'],
  rules: {
    quotes: ['error', 'single'],
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    'no-multiple-empty-lines': ['error', { max: 4 }],
    semi: ['error', 'never'],
    'linebreak-style': ['off', 'windows'],
    'no-plusplus': 'off',
    'comma-dangle': ['error', 'never'],
    eqeqeq: 'off',
    'space-before-function-paren': 'off',
    'import/no-anonymous-default-export': 'off',
    'vue/no-mutating-props': 'off',
    'no-prototype-builtins': 'off',
    'prefer-const': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'off',
    'no-debugger': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  }
}
