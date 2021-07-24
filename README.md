# eslint-plugin-validate-declared-imports
Validates globally declared typings

## When to use
Add `validate-
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
        "validate-declared-imports/no-unresolved-declared-imports": ["error", { "fileExtensions": [".jpg"] }]
        
    }
}
```
