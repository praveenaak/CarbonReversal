import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest"; // Import the Jest plugin

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Browser globals
        ...globals.node, // Node.js globals (if needed)
        ...globals.jest, // Jest globals to fix the unknown key issue
      },
    },
    plugins: {
      jest: pluginJest, // Add the Jest plugin
      react: pluginReact, // Add the React plugin
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.recommended,
  {
    rules: {
      // Add any custom rules or overrides here if needed
    },
  },
];
