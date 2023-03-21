import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { KEYS } from '../constants';
import { IconContext } from '../contexts';
import ExpandButton from './ExpandButton';
import NativeCheckbox from './NativeCheckbox';
import NodeIcon from './NodeIcon';

class TreeNode extends React.PureComponent {
    static contextType = IconContext;

    static propTypes = {
        checkKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        isLeaf: PropTypes.bool.isRequired,
        isParent: PropTypes.bool.isRequired,
        label: PropTypes.node.isRequired,
        optimisticToggle: PropTypes.bool.isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
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
        showCheckbox: PropTypes.bool,
        title: PropTypes.string,
        treeId: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        className: null,
        expandOnClick: false,
        icon: null,
        showCheckbox: true,
        title: null,
        treeId: null,
        onClick: null,
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onCheckboxKeyUp = this.onCheckboxKeyUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onCheck() {
        const { value, onCheck } = this.props;

        onCheck({
            value,
            checked: this.getCheckState({ toggle: true }),
        });
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
            isParent,
            value,
            onClick,
        } = this.props;

        // Auto expand if enabled
        if (isParent && expandOnClick) {
            this.onExpand();
        }

        onClick({ value, checked: this.getCheckState({ toggle: false }) });
    }

    onExpand() {
        const { expanded, value, onExpand } = this.props;

        onExpand({ value, expanded: !expanded });
    }

    getCheckState({ toggle }) {
        const { checked, optimisticToggle } = this.props;

        // Toggle off state to checked
        if (checked === 0 && toggle) {
            return true;
        }

        // Node is already checked and we are not toggling
        if (checked === 1 && !toggle) {
            return true;
        }

        // Get/toggle partial state based on cascade model
        if (checked === 2) {
            return optimisticToggle;
        }

        return false;
    }

    renderExpandButton() {
        const { expandDisabled, expanded, isLeaf } = this.props;

        return (
            <ExpandButton
                disabled={expandDisabled}
                expanded={expanded}
                isLeaf={isLeaf}
                onClick={this.onExpand}
            />
        );
    }

    renderCheckboxIcon() {
        const { uncheck, check, halfCheck } = this.context;
        const { checked } = this.props;

        if (checked === 0) {
            return uncheck;
        }

        if (checked === 1) {
            return check;
        }

        return halfCheck;
    }

    renderBareLabel(children) {
        const { onClick, title } = this.props;
        const clickable = onClick !== null;

        return (
            <span className="rct-bare-label" title={title}>
                {clickable ? (
                    <span
                        className="rct-node-clickable"
                        role="button"
                        tabIndex={0}
                        onClick={this.onClick}
                        onKeyPress={this.onClick}
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
            title,
            treeId,
            value,
            onClick,
        } = this.props;
        const clickable = onClick !== null;
        const valueId = String(value).split(' ').join('_');
        const inputId = treeId ? `${treeId}-${valueId}` : null;

        const render = [(
            <label key={0} htmlFor={inputId} title={title}>
                <NativeCheckbox
                    checked={checked === 1}
                    disabled={disabled}
                    id={inputId}
                    indeterminate={checked === 2}
                    onChange={() => {}}
                    onClick={this.onCheck}
                    onKeyUp={this.onCheckboxKeyUp}
                />
                <span
                    aria-hidden="true"
                    className="rct-checkbox"
                    role="presentation"
                >
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
                    role="button"
                    tabIndex={0}
                    onClick={this.onClick}
                    onKeyPress={this.onClick}
                >
                    {children}
                </span>
            ));
        }

        return render;
    }

    renderLabel() {
        const {
            expanded,
            icon,
            isLeaf,
            label,
            showCheckbox,
            showNodeIcon,
        } = this.props;
        const labelChildren = (
            <>
                {showNodeIcon && (
                    <NodeIcon expanded={expanded} icon={icon} isLeaf={isLeaf} />
                )}
                <span className="rct-title">{label}</span>
            </>
        );

        if (!showCheckbox) {
            return this.renderBareLabel(labelChildren);
        }

        return this.renderCheckboxLabel(labelChildren);
    }

    renderChildren() {
        const { children, expanded } = this.props;

        if (!expanded) {
            return null;
        }

        return children;
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
                    {this.renderExpandButton()}
                    {this.renderLabel()}
                </span>
                {this.renderChildren()}
            </li>
        );
    }
}

export default TreeNode;
