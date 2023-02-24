import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { IconContext, LanguageContext } from '../contexts';
import Button from './Button';

const propTypes = {
    disabled: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    isLeaf: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

function ExpandButton({
    disabled,
    expanded,
    isLeaf,
    onClick,
}) {
    if (isLeaf) {
        return (
            <span className="rct-collapse">
                <span className="rct-icon" />
            </span>
        );
    }

    const { expandClose, expandOpen } = useContext(IconContext);
    const { collapseNode, expandNode } = useContext(LanguageContext);
    const icon = expanded ? expandOpen : expandClose;
    const title = expanded ? collapseNode : expandNode;

    return (
        <Button
            className="rct-collapse rct-collapse-btn"
            disabled={disabled}
            title={title}
            onClick={onClick}
        >
            {icon}
        </Button>
    );
}

ExpandButton.propTypes = propTypes;

export default ExpandButton;
