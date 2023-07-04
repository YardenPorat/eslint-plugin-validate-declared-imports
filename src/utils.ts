import path from 'path';
import { ESLintUtils } from '@typescript-eslint/experimental-utils';
import { existsSync } from 'fs';
import ts from 'typescript';

export function ruleCreator(...args: Parameters<ReturnType<typeof ESLintUtils.RuleCreator>>) {
    const createRule = ESLintUtils.RuleCreator((ruleName) => ruleName);
    return createRule(...args);
}

function filterWithoutWildcardPaths(pathVal: string[] | string): string {
    if (typeof pathVal === 'string') {
        return pathVal.replace(new RegExp('\\*', 'g'), '');
    }

    return pathVal
        .reduce<string[]>((acc, pathString: string) => {
            if (pathString === '*') {
                return acc;
            }
            const newPathString = pathString.replace('*', '');

            if (newPathString) {
                acc.push(newPathString);
            }

            return acc;
        }, [])
        .join('');
}

let pathsToMatch: [string, string][] = [];

export function generatePathsList() {
    const tsPaths = path.resolve(path.resolve(process.cwd()), 'tsconfig.json');
    const { config } = ts.readConfigFile(tsPaths, ts.sys.readFile);

    const paths: Record<string, string[]> = config?.compilerOptions?.paths;
    const baseUrl: string = config?.compilerOptions?.baseUrl;
    if (paths && typeof paths === 'object') {
        pathsToMatch = [];
        Object.entries(paths).forEach(([key, val]) => {
            const hasAsterisk = key.slice(-1);
            if (hasAsterisk != '*') {
                return;
            }

            const keyWithoutAsterisk = key.slice(0, -1);
            let newValue = filterWithoutWildcardPaths(val);

            if (baseUrl) {
                newValue = `${baseUrl}${newValue}`;
            }

            // pushes a tuple to be used when iterating off imports
            pathsToMatch.push([keyWithoutAsterisk, newValue]);
        });
    }
}

/**
 * @description validates if the ts paths resolution is valid
 */
export function isTsPathsResolution(request: string) {
    let isValid = false;

    pathsToMatch.forEach(([key, val]) => {
        const requestMatch = request.match(key);
        if (requestMatch) {
            const valueWithoutAsterisk = filterWithoutWildcardPaths(val);
            if (valueWithoutAsterisk) {
                const pathRes = path.resolve(`${request}`.replace(key, valueWithoutAsterisk));
                const exists = existsSync(pathRes);

                if (exists) {
                    isValid = true;
                    return true;
                }
            }
        }
        return isValid;
    });

    return isValid;
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
