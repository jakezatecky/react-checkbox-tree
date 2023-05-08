import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { KEYS } from '../constants';
import { IconContext } from '../contexts';

import NodeModel from '../models/NodeModel';

import BareLabel from './BareLabel';
import CheckboxLabel from './CheckboxLabel';
import ExpandButton from './ExpandButton';
import DefaultLabel from './DefaultLabel';

class TreeNode extends React.PureComponent {
    static contextType = IconContext;

    static propTypes = {
        checkKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        node: PropTypes.instanceOf(NodeModel).isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
        onCheck: PropTypes.func.isRequired,
        onExpand: PropTypes.func.isRequired,

        LabelComponent: PropTypes.func,
        LeafLabelComponent: PropTypes.func,
        ParentLabelComponent: PropTypes.func,
        children: PropTypes.node,
        expandOnClick: PropTypes.bool,
        noCascadeChecks: PropTypes.bool,
        showCheckbox: PropTypes.bool,
        showNodeTitle: PropTypes.bool,
        treeId: PropTypes.string,
        onClick: PropTypes.func,
        onContextMenu: PropTypes.func,
        onLabelChange: PropTypes.func,
        onLeafLabelChange: PropTypes.func,
        onParentLabelChange: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        expandOnClick: false,
        LabelComponent: null,
        LeafLabelComponent: null,
        ParentLabelComponent: null,
        noCascadeChecks: false,
        showCheckbox: true,
        showNodeTitle: false,
        treeId: null,
        onClick: null,
        onContextMenu: null,
        onLabelChange: null,
        onLeafLabelChange: null,
        onParentLabelChange: null,
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

        if (onClick) {
            onClick(node.value);
        }
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
            node,
            showNodeIcon,
            showNodeTitle,
            onClick,
            LabelComponent,
            LeafLabelComponent,
            ParentLabelComponent,
            onContextMenu,
            onLabelChange,
            onLeafLabelChange,
            onParentLabelChange,
            noCascadeChecks,
            showCheckbox,
            treeId,
        } = this.props;

        const nodeDisabled = disabled || node.disabled;
        const nodeTitle = showNodeTitle ? (node.title || node.label) : node.title;

        const nodeClass = classNames({
            'rct-node': true,
            'rct-node-leaf': node.isLeaf,
            'rct-node-parent': !node.isLeaf,
            'rct-node-expanded': !node.isLeaf && node.expanded,
            'rct-node-collapsed': !node.isLeaf && !node.expanded,
            'rct-disabled': nodeDisabled,
        }, node.className);

        let Label;
        let labelChangeHandler;
        if (node.isLeaf) {
            Label = LeafLabelComponent || LabelComponent || DefaultLabel;
            labelChangeHandler = onLeafLabelChange || onLabelChange;
        } else {
            // parent
            Label = ParentLabelComponent || LabelComponent || DefaultLabel;
            labelChangeHandler = onParentLabelChange || onLabelChange;
        }

        return (
            <li className={nodeClass}>
                <span className="rct-text">
                    <ExpandButton
                        disabled={expandDisabled}
                        expanded={node.expanded}
                        isLeaf={node.isLeaf}
                        onClick={this.onExpand}
                    />

                    {showCheckbox ? (
                        <CheckboxLabel
                            checked={node.checkState}
                            disabled={nodeDisabled}
                            isRadioNode={node.isRadioNode}
                            noCascadeChecks={noCascadeChecks}
                            title={nodeTitle}
                            treeId={treeId}
                            value={node.value}
                            onCheck={this.onCheck}
                            onCheckboxKeyUp={this.onCheckboxKeyUp}
                            onClick={onClick && this.onClick}
                            onContextMenu={onContextMenu}
                        >
                            <Label
                                node={node}
                                showNodeIcon={showNodeIcon}
                                onChange={labelChangeHandler}
                            />
                        </CheckboxLabel>

                    ) : (
                        <BareLabel
                            title={nodeTitle}
                            onClick={onClick && this.onClick}
                            onContextMenu={onContextMenu}
                        >
                            <Label
                                node={node}
                                showNodeIcon={showNodeIcon}
                            />
                        </BareLabel>
                    )}
                </span>

                {node.expanded ? children : null}

            </li>
        );
    }
}

export default TreeNode;
