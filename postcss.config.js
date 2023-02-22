// eslint-disable-next-line import/no-extraneous-dependencies
const cssnano = require('cssnano');

module.exports = {
    plugins: [
        cssnano({
            discardComments: true,
        }),
    ],
};
