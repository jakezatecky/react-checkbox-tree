// Use CommonJS export to trick Webpack into working around the issues that
// window.[module].default is set rather than window.[module]
//
// See: https://github.com/webpack/webpack/issues/706

module.exports = require('./js/Tree.js').default;
