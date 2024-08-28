export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Add your ESLint rules here
      semi: ["error", "always"],
      quotes: ["error", "single"],
      // ...other rules
    },
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      // ...other extends
    ],
    plugins: [
      "react",
      // ...other plugins
    ],
  },
];
