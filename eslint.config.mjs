import js from '@eslint/js'; // JS 기본 권장 규칙
import globals from 'globals'; // Node 등 전역 허용
import tseslint from 'typescript-eslint'; // TS 파서 + 규칙(Flat 지원)
import react from 'eslint-plugin-react'; // React 규칙
import reactHooks from 'eslint-plugin-react-hooks'; // Hooks 규칙
import reactNative from 'eslint-plugin-react-native'; // RN 전용 규칙
import unusedImports from 'eslint-plugin-unused-imports'; // 미사용 import 제거
import configPrettier from 'eslint-config-prettier'; // Prettier와 충돌 규칙 OFF
import prettierPlugin from 'eslint-plugin-prettier'

export default tseslint.config([
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 린트 대상 제외(빌드 산출물/네이티브/Expo 캐시)
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'android/**',
      'ios/**',
      '.expo/**',
      '.expo-shared/**',
    ],
  },

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
      parserOptions: {
        ecmaFeatures: {jsx: true},
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      'unused-imports': unusedImports,
      prettier: prettierPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'unused-imports/no-unused-imports': 'warn',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react-native/no-inline-styles': 'off',
      'react-native/no-unused-styles': 'warn',

      'prettier/prettier': 'error',
    },
  },

  {
    files: ['metro.config.js', 'tailwind.config.js', 'babel.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    }
  },

  configPrettier,
]);
