import path from 'path';
import fs from 'fs';
import { ruleCreator } from '../utils';

export const noUnresolvedDeclaredImports = {
    'no-unresolved-declared-imports': ruleCreator({
        name: 'no-unresolved-declared-imports',
        defaultOptions: [],
        meta: {
            docs: { category: 'Best Practices', description: '', recommended: 'error' },
            type: 'problem',
            messages: {
                'no-unresolved-declared-imports': `The following filePath does not exist: {{filePath}}`,
            },
            schema: {},
        },
        create(context) {
            const nodeFileName = context.getFilename();

            return {
                ImportDeclaration(node) {
                    const { value: imported } = node.source;
                    if (node.importKind === 'value' && typeof imported === 'string') {
                        if (imported.endsWith('.st.css')) {
                            const filePath = path.resolve(nodeFileName, imported);
                            if (!fs.existsSync(filePath)) {
                                context.report({
                                    node,
                                    messageId: 'no-unresolved-declared-imports',
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
