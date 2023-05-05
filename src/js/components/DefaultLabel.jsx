import PropTypes from 'prop-types';
import React from 'react';

import NodeIcon from './NodeIcon';
import NodeModel from '../models/NodeModel';

const propTypes = {
    node: PropTypes.instanceOf(NodeModel).isRequired,
    showNodeIcon: PropTypes.bool.isRequired,
};

export default function DefaultLabel({
    node,
    showNodeIcon,
}) {
    const {
        expanded,
        icon,
        isLeaf,
        label,
    } = node;

    return (
        <>
            {showNodeIcon && (
                <NodeIcon expanded={expanded} icon={icon} isLeaf={isLeaf} />
            )}
            <span className="rct-label">{label}</span>
        </>
    );
}

DefaultLabel.propTypes = propTypes;
