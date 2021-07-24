# eslint-plugin-validate-declared-imports
Validates imports of typescripts globally declared modules 

## When to use
When you declare modules with typescript, filepaths are not validated to be correct.

Example:
```ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.styl' {
  const classes: { [key: string]: string };
  export default classes;
}
```

This will not throw an error, even though path is incorrect:
```ts
import styles from 'asdasdasdasdasd.module.css';
```

## Installation

You'll first need to install [ESLint](http://eslint.org):
```
$ npm i eslint --save-dev
```
Next, install `eslint-plugin-validate-declared-imports`:

```
$ npm install eslint-plugin-validate-declared-imports --save-dev
```


## Usage

Add `validate-declared-imports` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "validate-declared-imports"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "validate-declared-imports/no-unresolved-declared-imports": 
            ["error", { 
                "fileExtensions": [
                    ".jpg",
                    ".module.css",
                    ".module.css",
                    ".module.scss",
                    ".module.sass",
                    ".module.less",
                    ".module.styl"] }]
        
    }
}
```
