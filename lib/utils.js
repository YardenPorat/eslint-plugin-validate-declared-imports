"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleCreator = ruleCreator;
exports.generatePathsList = generatePathsList;
exports.isTsPathsResolution = isTsPathsResolution;
exports.isPackageRequest = isPackageRequest;
exports.isRelativeRequest = isRelativeRequest;
const path_1 = __importDefault(require("path"));
const utils_1 = require("@typescript-eslint/utils");
const fs_1 = require("fs");
const typescript_1 = __importDefault(require("typescript"));
function ruleCreator(...args) {
    const createRule = utils_1.ESLintUtils.RuleCreator((ruleName) => ruleName);
    return createRule(...args);
}
function filterWithoutWildcardPaths(pathVal) {
    if (typeof pathVal === 'string') {
        return pathVal.replace(new RegExp('\\*', 'g'), '');
    }
    return pathVal
        .reduce((acc, pathString) => {
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
let pathsToMatch = [];
function generatePathsList() {
    var _a, _b;
    const tsPaths = path_1.default.resolve(path_1.default.resolve(process.cwd()), 'tsconfig.json');
    const { config } = typescript_1.default.readConfigFile(tsPaths, typescript_1.default.sys.readFile);
    const paths = (_a = config === null || config === void 0 ? void 0 : config.compilerOptions) === null || _a === void 0 ? void 0 : _a.paths;
    const baseUrl = (_b = config === null || config === void 0 ? void 0 : config.compilerOptions) === null || _b === void 0 ? void 0 : _b.baseUrl;
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
function isTsPathsResolution(request) {
    let isValid = false;
    pathsToMatch.forEach(([key, val]) => {
        const requestMatch = request.match(key);
        if (requestMatch) {
            const valueWithoutAsterisk = filterWithoutWildcardPaths(val);
            if (valueWithoutAsterisk) {
                const pathRes = path_1.default.resolve(`${request}`.replace(key, valueWithoutAsterisk));
                const exists = (0, fs_1.existsSync)(pathRes);
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
function isPackageRequest(request) {
    return !isRelativeRequest(request) && !path_1.default.isAbsolute(request);
}
function isRelativeRequest(request) {
    return request.startsWith('./') || request.startsWith('../') || request === '.' || request === '..';
}
//# sourceMappingURL=utils.js.map