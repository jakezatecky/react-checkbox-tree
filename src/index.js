const tree = require('./js/CheckboxTree').default;
const utils = require('./js/utils');

module.exports = {
    default: tree,
    ...utils,
};
