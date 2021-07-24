"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRelativeRequest = exports.noUnresolvedDeclaredImports = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
exports.noUnresolvedDeclaredImports = {
    'no-unresolved-declared-imports': utils_1.ruleCreator({
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
                            const filePath = path_1.default.resolve(nodeFileName, imported);
                            if (!fs_1.default.existsSync(filePath)) {
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
function isRelativeRequest(request) {
    return request.startsWith('./') || request.startsWith('../') || request === '.' || request === '..';
}
exports.isRelativeRequest = isRelativeRequest;
//# sourceMappingURL=no-unresolved-declared-imports.js.map