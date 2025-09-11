import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
};

function Button({ children, title = null, ...props }) {
    return (
        <button
            aria-label={title}
            title={title}
            type="button"
            {...props}
        >
            {children}
        </button>
    );
}

Button.propTypes = propTypes;

export default Button;
