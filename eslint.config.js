module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
        es2021: true,
      },
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "single"],
    },
    plugins: {
      react: require("eslint-plugin-react"),
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
  },
];
