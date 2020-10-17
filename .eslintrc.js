module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "quotes": [
      "error",
      "double"
    ],
    "semi": [2, "always", { "omitLastInOneLineBlock": true}],
    "vue/no-v-html": "off",
  }
};