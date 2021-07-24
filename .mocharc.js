module.exports = {
    require: ['@ts-tools/node/r'],
    extension: ['js', 'json', 'ts', 'tsx'],
    slow: 200,
    timeout: 10000,
    colors: true,
    bail: false,
    reporter: 'spec',
};
