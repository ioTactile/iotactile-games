import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier";

export default withNuxt(
  {
    ignores: ["functions/**"],
  },
  eslintConfigPrettier,
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/unified-signatures": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "nuxt/prefer-import-meta": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "no-useless-assignment": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "vue/return-in-computed-property": "off",
      "import/no-duplicates": "off",
    },
  },
);
