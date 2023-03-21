import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { IconContext } from '../contexts';

const propTypes = {
    expanded: PropTypes.bool.isRequired,
    isLeaf: PropTypes.bool.isRequired,

    icon: PropTypes.node,
};
const defaultProps = {
    icon: null,
};

function NodeIcon({ expanded, icon, isLeaf }) {
    const { leaf, parentClose, parentOpen } = useContext(IconContext);

    function getIcon() {
        if (icon !== null) {
            return icon;
        }

        if (isLeaf) {
            return leaf;
        }

        if (!expanded) {
            return parentClose;
        }

        return parentOpen;
    }

    return <span className="rct-node-icon">{getIcon()}</span>;
}

NodeIcon.propTypes = propTypes;
NodeIcon.defaultProps = defaultProps;

export default NodeIcon;
