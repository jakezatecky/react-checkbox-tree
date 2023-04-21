import PropTypes from 'prop-types';
import React from 'react';

import NodeIcon from './NodeIcon';

export default function LabelChildren({
    expanded,
    icon,
    isLeaf,
    label,
    showNodeIcon,
}) {
    return (
        <>
            {showNodeIcon && (
                <NodeIcon expanded={expanded} icon={icon} isLeaf={isLeaf} />
            )}
            <span className="rct-label">{label}</span>
        </>
    );
}

LabelChildren.propTypes = {
    isLeaf: PropTypes.bool.isRequired,
    label: PropTypes.node.isRequired,
    showNodeIcon: PropTypes.bool.isRequired,

    expanded: PropTypes.bool,
    icon: PropTypes.node,
};

LabelChildren.defaultProps = {
    expanded: false,
    icon: null,
};
