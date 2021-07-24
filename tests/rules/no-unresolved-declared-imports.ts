import { resolve } from 'path';

import { noUnresolvedDeclaredImports } from '../../src/rules/no-unresolved-declared-imports';
import { TSESLint } from '@typescript-eslint/experimental-utils';

const ruleTester = new TSESLint.RuleTester({
    parser: resolve('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
});

const validImport = resolve(__dirname, '../fixtures/style.st.css');
const invalidImport = resolve(__dirname, '../fixtures/abc.st.css');

ruleTester.run('no-unresolved-declared-imports', noUnresolvedDeclaredImports['no-unresolved-declared-imports'], {
    valid: [`import { style, classes } from '${validImport}';`],
    invalid: [
        {
            code: `import { style, classes } from '${invalidImport}';`,
            errors: [
                // each property here is optional
                // you can decide the level of your test
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
