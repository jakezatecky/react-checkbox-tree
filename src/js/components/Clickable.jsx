import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
    children: PropTypes.node,
    tabIndex: PropTypes.number,
    onClick: PropTypes.func,
};
const defaultProps = {
    children: null,
    tabIndex: 0,
    onClick: null,
};

// this component wraps children with a clickable span

function Clickable({ children, tabIndex, onClick }) {
    return (
        <span
            className="rct-node-clickable"
            role="button"
            tabIndex={tabIndex}
            onClick={onClick}
            onKeyPress={onClick}
        >
            {children}
        </span>
    );
}

Clickable.propTypes = propTypes;
Clickable.defaultProps = defaultProps;

export default Clickable;
