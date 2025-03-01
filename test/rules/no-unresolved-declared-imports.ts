import fs from '@file-services/node';
import { resolve } from 'path';
import { TSESLint } from '@typescript-eslint/utils';
import { noUnresolvedDeclaredImports } from '../../src/rules/no-unresolved-declared-imports';

const parserPath = require.resolve('@typescript-eslint/parser');
const ruleTester = new TSESLint.RuleTester({
    parser: parserPath,
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
});

const TESTING_PACKAGE = 'test-cases';
const options = [{ fileExtensions: ['.st.css', '.png'] }];
const fixturesPath = resolve(__dirname, '../fixtures');
fs.copyDirectorySync(fixturesPath, resolve(__dirname, `../../node_modules/${TESTING_PACKAGE}`));

const invalidCases = {
    absoluteStCss: resolve(fixturesPath, 'abc.st.css'),
    relativeStCss: './test/fixtures/abc.st.css',
    packageStCss: `${TESTING_PACKAGE}/abc.st.css`,
    relativePng: './test/fixtures/abc.png',
    packagePng: `${TESTING_PACKAGE}/abc.png`,
    tsPathsPng: '@test/fixtures/abc.png',
};

ruleTester.run('no-unresolved-declared-imports', noUnresolvedDeclaredImports['no-unresolved-declared-imports'], {
    valid: [
        { code: `import { style, classes } from '${resolve(fixturesPath, 'style.st.css')}';`, options },
        { code: `import { style, classes } from './test/fixtures/style.st.css';`, options },
        { code: `import { style, classes } from '${TESTING_PACKAGE}/style.st.css';`, options },
        { code: `import Img from '${resolve(fixturesPath, 'star.png')}';`, options },
        { code: `import Img from '${TESTING_PACKAGE}/star.png';`, options },
        { code: `import Img from '@test/fixtures/star.png';`, options },
    ],
    invalid: [
        {
            code: `import { style, classes } from '${invalidCases.absoluteStCss}';`,
            options,
            errors: [
                {
                    messageId: 'no-unresolved-declared-imports',
                    data: {
                        filePath: invalidCases.absoluteStCss,
                    },
                },
            ],
        },
        {
            code: `import { style, classes } from '${invalidCases.relativeStCss}';`,
            options,
            errors: [
                {
                    messageId: 'no-unresolved-declared-imports',
                    data: {
                        filePath: resolve(__dirname, '../..', invalidCases.relativeStCss),
                    },
                },
            ],
        },
        {
            code: `import { style, classes } from '${invalidCases.packageStCss}';`,
            options,
            errors: [
                {
                    messageId: 'no-unresolved-declared-imports',
                    data: {
                        filePath: invalidCases.packageStCss,
                    },
                },
            ],
        },
        {
            code: `import Img from '${invalidCases.relativePng}';`,
            options,
            errors: [
                {
                    messageId: 'no-unresolved-declared-imports',
                    data: {
                        filePath: resolve(__dirname, '../..', invalidCases.relativePng),
                    },
                },
            ],
        },
        {
            code: `import Img from '${invalidCases.packagePng}';`,
            options,
            errors: [
                {
                    messageId: 'no-unresolved-declared-imports',
                    data: {
                        filePath: invalidCases.packagePng,
                    },
                },
            ],
        },
        {
            code: `import Img from '${invalidCases.tsPathsPng}';`,
            options,
            errors: [
                {
                    messageId: 'no-unresolved-declared-imports',
                    data: {
                        filePath: invalidCases.tsPathsPng,
                    },
                },
            ],
        },
    ],
});
