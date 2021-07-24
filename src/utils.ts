import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export function ruleCreator(
    ...args: Parameters<ReturnType<typeof ESLintUtils.RuleCreator>>
) {
    const createRule = ESLintUtils.RuleCreator((ruleName) => ruleName);
    return createRule(...args);
}
