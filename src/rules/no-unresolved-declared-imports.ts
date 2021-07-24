import { resolve, dirname } from 'path';
import fs from 'fs';
import { ruleCreator } from '../utils';

const ruleName = 'no-unresolved-declared-imports';

type IOptions = {
    fileExtensions: string[];
};

const existingFiles: Set<string> = new Set();

export const noUnresolvedDeclaredImports = {
    [ruleName]: ruleCreator({
        name: ruleName,
        defaultOptions: [],
        meta: {
            docs: { category: 'Best Practices', description: '', recommended: 'error' },
            type: 'problem',
            messages: {
                [ruleName]: `The following filePath does not exist: {{filePath}}`,
            },
            schema: [
                //TODO make required
                {
                    type: 'object',
                    properties: {
                        fileExtensions: {
                            type: 'array',
                            uniqueItems: true,
                            items: {
                                type: 'string',
                            },
                        },
                    },
                },
            ],
        },
        create(context) {
            const nodeFileName = context.getFilename();
            const { fileExtensions } = context.options[0] as IOptions;
            if (!fileExtensions.length) {
                throw new Error('Must receive file extension(s) as a rule option');
            }

            return {
                ImportDeclaration(node) {
                    const { value: imported } = node.source;
                    if (node.importKind === 'value' && typeof imported === 'string') {
                        if (fileExtensions.some((el) => imported.endsWith(el))) {
                            const filePath = resolve(dirname(nodeFileName), imported);
                            const exist = existingFiles.has(filePath)
                                ? true
                                : fs.existsSync(filePath)
                                ? (existingFiles.add(filePath), true)
                                : false;
                            if (!exist) {
                                context.report({
                                    node,
                                    messageId: ruleName,
                                    data: {
                                        filePath,
                                    },
                                });
                            }
                        }
                    }
                },
            };
        },
    }),
};

export function isRelativeRequest(request: string) {
    return request.startsWith('./') || request.startsWith('../') || request === '.' || request === '..';
}
