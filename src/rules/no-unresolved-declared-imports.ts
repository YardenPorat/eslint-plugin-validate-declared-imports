import fs from 'fs';
import { resolve, dirname } from 'path';
import { isPackageRequest, ruleCreator } from '../utils';

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
                    const { value: importRequest } = node.source;
                    if (node.importKind === 'value' && typeof importRequest === 'string') {
                        if (fileExtensions.some((el) => importRequest.endsWith(el))) {
                            if (isPackageRequest(importRequest)) {
                                try {
                                    if (!existingFiles.has(importRequest)) {
                                        require.resolve(importRequest, { paths: [nodeFileName] });
                                        existingFiles.add(importRequest);
                                    }
                                } catch (err) {
                                    context.report({
                                        node,
                                        messageId: ruleName,
                                        data: {
                                            filePath: importRequest,
                                        },
                                    });
                                }
                            } else {
                                const filePath = resolve(dirname(nodeFileName), importRequest);
                                if (!doesPathExist(filePath)) {
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
                    }
                },
            };
        },
    }),
};

function doesPathExist(filePath: string) {
    return existingFiles.has(filePath) ? true : fs.existsSync(filePath) ? (existingFiles.add(filePath), true) : false;
}
