import { resolve } from 'path';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import { noUnresolvedDeclaredImports } from '../../src/rules/no-unresolved-declared-imports';

const ruleTester = new TSESLint.RuleTester({
    parser: resolve('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
});

const options = [{ fileExtensions: ['.st.css'] }];
const validImport = resolve(__dirname, '../fixtures/style.st.css');
const invalidImport = resolve(__dirname, '../fixtures/abc.st.css');

ruleTester.run('no-unresolved-declared-imports', noUnresolvedDeclaredImports['no-unresolved-declared-imports'], {
    valid: [
        { code: `import { style, classes } from '${validImport}';`, options },
        { code: `import { style, classes } from './test/fixtures/style.st.css';`, options },
    ],
    invalid: [
        {
            code: `import { style, classes } from '${invalidImport}';`,
            options,
            errors: [
                {
                    messageId: 'no-unresolved-declared-imports',
                    data: {
                        filePath: invalidImport,
                    },
                },
            ],
        },
    ],
});
