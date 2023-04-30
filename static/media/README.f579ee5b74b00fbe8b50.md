# Ron Gorai's Configuration for ESlint, Stylelint, and Prettier

Designed to be used for React, SCSS, Node.js, and TypeScript.

## Steps to use:
### 1. `yarn add -D @rgorai/eslint-config`
Install the package as a dev dependency.

### 2. `yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-import eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks prettier stylelint stylelint-config-standard-scss stylelint-prettier typescript`
Install peer dependencies.

### 3. Add the following to your `package.json`. 
Feel free to add your own config options here as well. It is recommended to reload the window in VS Code after this in order for the ESlint and Stylelint extensions (if you have them) to properly utilize the installed config files.
```
"eslintConfig": {
  "extends": "@rgorai/eslint-config/.eslintrc"
},
"prettier": "@rgorai/eslint-config/.prettierrc.js",
"stylelint": {
  "extends": "@rgorai/eslint-config/.stylelintrc"
},

// if you use lint-staged
"lint-staged": {
  "*": "yarn lint"
}
```

### 4. If you are using VS Code, it is recommended to add the following to your `settings.json` to disable extension highlighting for Prettier.
```
"eslint.rules.customizations": [
  {
    "rule": "prettier/prettier",
    "severity": "off"
  }
]
```

### 5. `yarn lint`
Lint all .tsx, .ts, .jsx, .js, and .scss files in your folder at once.
