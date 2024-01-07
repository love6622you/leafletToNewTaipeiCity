module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  // 指定如何解析语法
  parser: 'vue-eslint-parser',
  // 优先级低于 parse 的语法解析配置
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  // 继承某些已有的规则
  extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  rules: {
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效。
    'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
    // 變數未使用
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
      },
    ],
  },
};
