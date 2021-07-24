"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleCreator = void 0;
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
function ruleCreator(...args) {
    const createRule = experimental_utils_1.ESLintUtils.RuleCreator((ruleName) => ruleName);
    return createRule(...args);
}
exports.ruleCreator = ruleCreator;
//# sourceMappingURL=utils.js.map