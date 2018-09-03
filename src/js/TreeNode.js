import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import NativeCheckbox from './NativeCheckbox';
import iconsShape from './iconsShape';
import nodeShape from './nodeShape';

class TreeNode extends React.Component {
    static propTypes = {
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        icons: iconsShape.isRequired,
        label: PropTypes.node.isRequired,
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
        rawChildren: PropTypes.arrayOf(nodeShape),
        showCheckbox: PropTypes.bool,
        title: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        className: null,
        expandOnClick: false,
        icon: null,
        rawChildren: null,
        showCheckbox: true,
        title: null,
        onClick: () => {},
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onCheck() {
        let isChecked = false;

        // Toggle off state to checked
        if (this.props.checked === 0) {
            isChecked = true;
        }

        // Toggle partial state based on cascade model
        if (this.props.checked === 2) {
            isChecked = this.props.optimisticToggle;
        }

        this.props.onCheck({
            value: this.props.value,
            checked: isChecked,
            children: this.props.rawChildren,
        });
    }

    onClick() {
        let isChecked = false;

        if (this.props.checked === 1) {
            isChecked = true;
        }

        // Get partial state based on cascade model
        if (this.props.checked === 2) {
            isChecked = this.props.optimisticToggle;
        }

        // Auto expand if enabled
        if (this.hasChildren() && this.props.expandOnClick) {
            this.onExpand();
        }

        this.props.onClick({
            value: this.props.value,
            checked: isChecked,
            children: this.props.rawChildren,
        });
    }

    onExpand() {
        this.props.onExpand({
            value: this.props.value,
            expanded: !this.props.expanded,
        });
    }

    hasChildren() {
        return this.props.rawChildren !== null;
    }

    renderCollapseButton() {
        const { expandDisabled } = this.props;

        if (!this.hasChildren()) {
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
                title="Toggle"
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
        const { checked, icons: { uncheck, check, halfCheck } } = this.props;

        if (checked === 0) {
            return uncheck;
        }

        if (checked === 1) {
            return check;
        }

        return halfCheck;
    }

    renderNodeIcon() {
        const { expanded, icon, icons: { leaf, parentClose, parentOpen } } = this.props;

        if (icon !== null) {
            return icon;
        }

        if (!this.hasChildren()) {
            return leaf;
        }

        if (!expanded) {
            return parentClose;
        }

        return parentOpen;
    }

    renderBareLabel(children) {
        const { onClick, title } = this.props;

        const clickable = onClick.toString() !== TreeNode.defaultProps.onClick.toString();

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
            label,
            title,
            treeId,
            value,
            onClick,
        } = this.props;

        const clickable = onClick.toString() !== TreeNode.defaultProps.onClick.toString();
        const inputId = `${treeId}-${String(value).split(' ').join('_')}`;

        const render = [(
            <label key={0} htmlFor={inputId} title={title}>
                <NativeCheckbox
                    checked={checked === 1}
                    disabled={disabled}
                    id={inputId}
                    indeterminate={checked === 2}
                    onChange={this.onCheck}
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
        const { className, disabled } = this.props;
        const nodeClass = classNames({
            'rct-node': true,
            'rct-node-parent': this.hasChildren(),
            'rct-node-leaf': !this.hasChildren(),
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
