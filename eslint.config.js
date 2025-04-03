// 配置文档: https://eslint.nodejs.cn/
import { defineFlatConfig } from 'eslint-define-config'
import configPrettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import js from '@eslint/js'

/** @type {import('eslint-define-config').FlatESLintConfig} */
export default defineFlatConfig([
  {
    ...js.configs.recommended,
    plugins: {
      prettier: pluginPrettier
    },
    languageOptions: {
      globals: {
        ...js.configs.recommended.globals,
        global: 'writeable',
        process: 'readonly',
        console: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      ...configPrettier.rules,
      ...pluginPrettier.configs.recommended.rules,
      /*
       * Eslint规则配置
       * 配置文档: https://eslint.nodejs.cn/docs/latest/rules/
       */
      // 需要 let 或 const 而不是 var
      'no-var': 'error',
      // 禁止使用未定义的变量
      'no-undef': 'error',
      // 禁止在定义变量之前使用变量
      'no-use-before-define': 'off',
      // 声明后永远不会重新分配的变量需要 const 声明
      'prefer-const': 'error',
      // 禁止不规则空格
      'no-irregular-whitespace': 'off',
      // 禁止使用 debugger
      'no-debugger': 'off',
      // 禁止未使用的变量
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      // 使用 prettier 插件
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  }
])
