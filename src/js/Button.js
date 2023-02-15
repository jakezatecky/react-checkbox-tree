import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
};
const defaultProps = {
    title: null,
};

function Button({ children, title, ...props }) {
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
Button.defaultProps = defaultProps;

export default Button;
