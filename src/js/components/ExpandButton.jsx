import PropTypes from 'prop-types';
import { useContext } from 'react';

import { IconContext, LanguageContext } from '#js/contexts.js';
import Button from '#js/components/Button.jsx';

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
    const { expandClose, expandOpen } = useContext(IconContext);
    const { collapseNode, expandNode } = useContext(LanguageContext);
    const icon = expanded ? expandOpen : expandClose;
    const title = expanded ? collapseNode : expandNode;

    if (isLeaf) {
        return (
            <span className="rct-collapse">
                <span className="rct-icon" />
            </span>
        );
    }

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
