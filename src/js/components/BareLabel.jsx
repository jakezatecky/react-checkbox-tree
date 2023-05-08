import PropTypes from 'prop-types';
import React from 'react';

import Clickable from './Clickable';

const propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    onClick: PropTypes.func,
    onContextMenu: PropTypes.func,
};
const defaultProps = {
    children: null,
    title: null,
    onClick: null,
    onContextMenu: null,
};

export default function BareLabel({
    children,
    title,
    onClick,
    onContextMenu,
}) {
    const clickable = (typeof onClick === 'function');

    return (
        <span className="rct-bare-label" title={title}>
            {clickable ? (
                <Clickable
                    tabIndex={0}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    onKeyPress={onClick}
                >
                    {children}
                </Clickable>
            ) : children}
        </span>
    );
}

BareLabel.propTypes = propTypes;
BareLabel.defaultProps = defaultProps;
