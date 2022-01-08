"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRelativeRequest = exports.isPackageRequest = exports.ruleCreator = void 0;
const path_1 = __importDefault(require("path"));
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
function ruleCreator(...args) {
    const createRule = experimental_utils_1.ESLintUtils.RuleCreator((ruleName) => ruleName);
    return createRule(...args);
}
exports.ruleCreator = ruleCreator;
/**
 * @param request
 * @returns true if given string is a node_modules package request
 */
function isPackageRequest(request) {
    return !isRelativeRequest(request) && !path_1.default.isAbsolute(request);
}
exports.isPackageRequest = isPackageRequest;
function isRelativeRequest(request) {
    return request.startsWith('./') || request.startsWith('../') || request === '.' || request === '..';
}
exports.isRelativeRequest = isRelativeRequest;
//# sourceMappingURL=utils.js.map