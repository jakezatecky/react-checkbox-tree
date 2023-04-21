import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { KEYS } from '../constants';
import { IconContext } from '../contexts';

import NodeModel from '../models/NodeModel';

import BareLabel from './BareLabel';
import CheckboxLabel from './CheckboxLabel';
import ExpandButton from './ExpandButton';
import LabelChildren from './LabelChildren';

class TreeNode extends React.PureComponent {
    static contextType = IconContext;

    static propTypes = {
        checkKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        noCascade: PropTypes.bool.isRequired,
        node: PropTypes.instanceOf(NodeModel).isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
        onCheck: PropTypes.func.isRequired,
        onExpand: PropTypes.func.isRequired,

        children: PropTypes.node,
        expandOnClick: PropTypes.bool,
        showCheckbox: PropTypes.bool,
        title: PropTypes.string,
        treeId: PropTypes.string,
        onClick: PropTypes.func,
        onContextMenu: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        expandOnClick: false,
        showCheckbox: true,
        title: null,
        treeId: null,
        onClick: null,
        onContextMenu: null,
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onCheckboxKeyUp = this.onCheckboxKeyUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onCheck() {
        const { node, onCheck } = this.props;
        onCheck(node.value);
    }

    onCheckboxKeyUp(event) {
        const { checkKeys } = this.props;
        const { key } = event;

        // Prevent default spacebar behavior from interfering with user settings
        if (KEYS.SPACEBAR) {
            event.preventDefault();
        }

        if (checkKeys.includes(key)) {
            this.onCheck();
        }
    }

    onClick() {
        const {
            expandOnClick,
            node,
            onClick,
        } = this.props;

        // Auto expand if enabled
        if (node.isParent && expandOnClick) {
            this.onExpand();
        }

        onClick(node.value);
    }

    onExpand() {
        const { node, onExpand } = this.props;
        onExpand(node.value);
    }

    render() {
        const {
            children,
            disabled,
            expandDisabled,
            noCascade,
            node,
            showCheckbox,
            showNodeIcon,
            title,
            treeId,
            onClick,
            onContextMenu,
        } = this.props;

        const {
            checkState,
            className,
            expanded,
            icon,
            isLeaf,
            label,
            value,
        } = node;

        const nodeDisabled = disabled || node.disabled;

        const nodeClass = classNames({
            'rct-node': true,
            'rct-node-leaf': isLeaf,
            'rct-node-parent': !isLeaf,
            'rct-node-expanded': !isLeaf && expanded,
            'rct-node-collapsed': !isLeaf && !expanded,
            'rct-disabled': nodeDisabled,
        }, className);

        const clickable = onClick !== null;
        const labelChildren = (
            <LabelChildren
                expanded={expanded}
                icon={icon}
                isLeaf={isLeaf}
                label={label}
                showNodeIcon={showNodeIcon}
            />
        );

        return (
            <li className={nodeClass}>
                <span className="rct-text">
                    <ExpandButton
                        disabled={expandDisabled}
                        expanded={expanded}
                        isLeaf={isLeaf}
                        onClick={this.onExpand}
                    />

                    {showCheckbox ? (
                        <CheckboxLabel
                            checked={checkState}
                            clickable={clickable}
                            disabled={nodeDisabled}
                            isRadioNode={node.isRadioNode}
                            noCascade={noCascade}
                            title={title}
                            treeId={treeId}
                            value={value}
                            onCheck={this.onCheck}
                            onCheckboxKeyUp={this.onCheckboxKeyUp}
                            onClick={this.onClick}
                            onContextMenu={onContextMenu}
                        >
                            {labelChildren}
                        </CheckboxLabel>

                    ) : (
                        <BareLabel
                            clickable={clickable}
                            title={title}
                            onClick={this.onClick}
                            onContextMenu={onContextMenu}
                        >
                            {labelChildren}
                        </BareLabel>
                    )}
                </span>
                {expanded ? children : null}
            </li>
        );
    }
}

export default TreeNode;
