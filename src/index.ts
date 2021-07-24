import { noUnresolvedDeclaredImports } from './rules/no-unresolved-declared-imports';

// import all rules in lib/rules
module.exports = {
    rules: {
        ...noUnresolvedDeclaredImports,
    },
};
