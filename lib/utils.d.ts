import { ESLintUtils } from '@typescript-eslint/experimental-utils';
export declare function ruleCreator(...args: Parameters<ReturnType<typeof ESLintUtils.RuleCreator>>): import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleModule<string, readonly unknown[], import("@typescript-eslint/utils/dist/ts-eslint/Rule").RuleListener>;
export declare function generatePathsList(): void;
/**
 * @description validates if the tspaths resolution is valid
 */
export declare function isTsPathsResolution(request: string): boolean;
/**
 * @param request
 * @returns true if given string is a node_modules package request
 */
export declare function isPackageRequest(request: string): boolean;
export declare function isRelativeRequest(request: string): boolean;
//# sourceMappingURL=utils.d.ts.map