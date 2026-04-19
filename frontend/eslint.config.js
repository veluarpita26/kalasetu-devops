import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      js,
      react: pluginReact,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // React recommended rules
  pluginReact.configs.flat.recommended,

  // 🔥 Your overrides MUST be last
  {
    rules: {
      "no-unused-vars": "warn",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
