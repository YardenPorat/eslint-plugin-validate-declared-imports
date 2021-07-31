import path from 'path';
import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export function ruleCreator(...args: Parameters<ReturnType<typeof ESLintUtils.RuleCreator>>) {
    const createRule = ESLintUtils.RuleCreator((ruleName) => ruleName);
    return createRule(...args);
}

/**
 * @param request
 * @returns true if given string is a node_modules package request
 */
export function isPackageRequest(request: string) {
    return !isRelativeRequest(request) && !path.isAbsolute(request);
}

export function isRelativeRequest(request: string) {
    return request.startsWith('./') || request.startsWith('../') || request === '.' || request === '..';
}
