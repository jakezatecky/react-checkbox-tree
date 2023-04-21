import PropTypes from 'prop-types';
import React from 'react';

export default function BareLabel({
    children,
    clickable,
    title,
    onClick,
    onContextMenu,
}) {
    return (
        <span className="rct-bare-label" title={title}>
            {clickable ? (
                <span
                    className="rct-node-clickable"
                    role="button"
                    tabIndex={0}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    onKeyPress={onClick}
                >
                    {children}
                </span>
            ) : children}
        </span>
    );
}

BareLabel.propTypes = {

    children: PropTypes.node,
    clickable: PropTypes.bool,
    title: PropTypes.string,
    onClick: PropTypes.func,
    onContextMenu: PropTypes.func,
};

BareLabel.defaultProps = {
    children: null,
    clickable: true,
    title: null,
    onClick: null,
    onContextMenu: null,
};
