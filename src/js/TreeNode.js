
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import NativeCheckbox from './NativeCheckbox';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import nodeShape from './shapes/nodeShape';


class TreeNode extends React.Component {
    static propTypes = {
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        icons: iconsShape.isRequired,
        isLeaf: PropTypes.bool.isRequired,
        isParent: PropTypes.bool.isRequired,
        label: PropTypes.node.isRequired,
        lang: languageShape.isRequired,
        node: nodeShape.isRequired,
        optimisticToggle: PropTypes.bool.isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
        treeId: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        onCheck: PropTypes.func.isRequired,
        onExpand: PropTypes.func.isRequired,

        children: PropTypes.node,
        className: PropTypes.string,
        expandOnClick: PropTypes.bool,
        icon: PropTypes.node,
        isRadioGroup: PropTypes.bool,
        isRadioNode: PropTypes.bool,
        noCascade: PropTypes.bool,
        showCheckbox: PropTypes.bool,
        title: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        className: null,
        expandOnClick: false,
        icon: null,
        isRadioGroup: false,
        isRadioNode: false,
        noCascade: false,
        showCheckbox: true,
        title: null,
        onClick: () => {},
    };

    onCheck = () => {
        const { node, onCheck, isRadioNode } = this.props;
        let newNode;
        if (isRadioNode) {
            newNode = { ...node, checked: !node.checked };
        } else {
            newNode = this.toggleChecked(node);
        }
        onCheck(newNode);
    }

    onClick = () => {
        const {
            node,
            isParent,
            expandOnClick,
            onClick,
        } = this.props;

        let newNode = node;
        // Auto expand if enabled
        if (expandOnClick && isParent && !node.expanded) {
            newNode = this.onExpand();
        }

        onClick(newNode);
    }

    onExpand = () => {
        const { node, onExpand } = this.props;
        const newNode = { ...node, expanded: !node.expanded };
        onExpand(newNode);
        return newNode;
    }

    shouldComponentUpdate = (nextProps) => {
        const keys = Object.keys(nextProps);
        for (let i = 0, ii = keys.length; i < ii; i += 1) {
            const key = keys[i];
            if (key !== 'children') {
                if (nextProps[key] !== this.props[key]) {
                    return true;
                }
            }
        }
        return false;
    }

    toggleChecked = (node, checkState) => {
        const {
            checked,
            isRadioGroup,
            noCascade,
            optimisticToggle,
        } = this.props;

        let newCheckState;
        if (checkState === undefined) {
            if (isRadioGroup) {
                newCheckState = !checked;
            } else {
                newCheckState = (checked === 2) ? optimisticToggle : !checked;
            }
        } else {
            newCheckState = checkState;
        }

        if (!noCascade && (node.children && node.children.length > 0) && !isRadioGroup) {
            const newChildren =
                node.children.map(child => this.toggleChecked(child, newCheckState));
            return { ...node, children: newChildren };
        }
        return { ...node, checked: newCheckState };
    }

    renderCollapseButton() {
        const { expandDisabled, isLeaf, lang } = this.props;

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
                disabled={expandDisabled}
                title={lang.toggle}
                onClick={this.onExpand}
            >
                {this.renderCollapseIcon()}
            </Button>
        );
    }

    renderCollapseIcon() {
        const { expanded, icons: { expandClose, expandOpen } } = this.props;

        if (!expanded) {
            return expandClose;
        }

        return expandOpen;
    }

    renderCheckboxIcon() {
        const {
            checked,
            icons: {
                uncheck,
                check,
                halfCheck,
                radioOff,
                radioOn,
            },
            isRadioNode,
        } = this.props;

        if (checked === 0) {
            return isRadioNode ? radioOff : uncheck;
        }

        if (checked === 1) {
            return isRadioNode ? radioOn : check;
        }

        return halfCheck;
    }

    renderNodeIcon() {
        const {
            expanded,
            icon,
            icons: { leaf, parentClose, parentOpen },
            isLeaf,
        } = this.props;

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

    renderBareLabel(children) {
        const { onClick, title } = this.props;
        const clickable = onClick !== null;

        return (
            <span className="rct-bare-label" title={title}>
                {clickable ? (
                    <span
                        className="rct-node-clickable"
                        onClick={this.onClick}
                        onKeyPress={this.onClick}
                        role="button"
                        tabIndex={0}
                    >
                        {children}
                    </span>
                ) : children}
            </span>
        );
    }

    renderCheckboxLabel(children) {
        const {
            checked,
            disabled,
            isRadioNode,
            title,
            treeId,
            value,
            onClick,
        } = this.props;
        const clickable = onClick !== null;
        const inputId = `${treeId}-${String(value).split(' ').join('_')}`;

        const render = [(
            <label key={0} htmlFor={inputId} title={title}>
                <NativeCheckbox
                    checked={checked === 1}
                    disabled={disabled}
                    id={inputId}
                    indeterminate={checked === 2}
                    isRadioNode={isRadioNode}
                    onClick={this.onCheck}
                    onChange={() => {}}
                />
                <span className="rct-checkbox">
                    {this.renderCheckboxIcon()}
                </span>
                {!clickable ? children : null}
            </label>
        )];

        if (clickable) {
            render.push((
                <span
                    key={1}
                    className="rct-node-clickable"
                    onClick={this.onClick}
                    onKeyPress={this.onClick}
                    role="link"
                    tabIndex={0}
                >
                    {children}
                </span>
            ));
        }

        return render;
    }

    renderLabel() {
        const { label, showCheckbox, showNodeIcon } = this.props;
        const labelChildren = [
            showNodeIcon ? (
                <span key={0} className="rct-node-icon">
                    {this.renderNodeIcon()}
                </span>
            ) : null,
            <span key={1} className="rct-title">
                {label}
            </span>,
        ];

        if (!showCheckbox) {
            return this.renderBareLabel(labelChildren);
        }

        return this.renderCheckboxLabel(labelChildren);
    }

    renderChildren() {
        if (!this.props.expanded) {
            return null;
        }

        return this.props.children;
    }

    render() {
        const {
            className,
            disabled,
            expanded,
            isLeaf,
        } = this.props;
        const nodeClass = classNames({
            'rct-node': true,
            'rct-node-leaf': isLeaf,
            'rct-node-parent': !isLeaf,
            'rct-node-expanded': !isLeaf && expanded,
            'rct-node-collapsed': !isLeaf && !expanded,
            'rct-disabled': disabled,
        }, className);

        return (
            <li className={nodeClass}>
                <span className="rct-text">
                    {this.renderCollapseButton()}
                    {this.renderLabel()}
                </span>
                {this.renderChildren()}
            </li>
        );
    }
}

export default TreeNode;
