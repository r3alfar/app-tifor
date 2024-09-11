import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  // { files: ["**/*.ts", "**/.tsx"] },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
        },
      ],
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ]
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended,
];