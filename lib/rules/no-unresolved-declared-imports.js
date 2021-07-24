"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noUnresolvedDeclaredImports = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const utils_1 = require("../utils");
const ruleName = 'no-unresolved-declared-imports';
const existingFiles = new Set();
exports.noUnresolvedDeclaredImports = {
    [ruleName]: utils_1.ruleCreator({
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
            const { fileExtensions } = context.options[0];
            if (!fileExtensions.length) {
                throw new Error('Must receive file extension(s) as a rule option');
            }
            return {
                ImportDeclaration(node) {
                    const { value: imported } = node.source;
                    if (node.importKind === 'value' && typeof imported === 'string') {
                        if (fileExtensions.some((el) => imported.endsWith(el))) {
                            if (imported[0] === '@') {
                                try {
                                    const filePath = require.resolve(imported, { paths: [nodeFileName] });
                                    doesPathExist(filePath);
                                }
                                catch (err) {
                                    context.report({
                                        node,
                                        messageId: ruleName,
                                        data: {
                                            filePath: imported,
                                        },
                                    });
                                }
                            }
                            else {
                                const filePath = path_1.resolve(path_1.dirname(nodeFileName), imported);
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
function doesPathExist(filePath) {
    return existingFiles.has(filePath) ? true : fs_1.default.existsSync(filePath) ? (existingFiles.add(filePath), true) : false;
}
//# sourceMappingURL=no-unresolved-declared-imports.js.map