module.exports = {
  "parser": "babel-eslint",
    "extends": "airbnb",
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    // https://github.com/yannickcr/eslint-plugin-react/blob/ecc327a63a779deb625414c61e617798ad912dbf/docs/rules/sort-comp.md
    "react/sort-comp": [1, {
      order: [
        'type-annotations',
        'static-methods',
        'lifecycle',
        'render',
        'everything-else',
      ],    
    }],
  },
};
