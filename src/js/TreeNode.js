import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import NativeCheckbox from './NativeCheckbox';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';

class TreeNode extends React.Component {
    static propTypes = {
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        hasFocus: PropTypes.bool.isRequired,
        icons: iconsShape.isRequired,
        isLeaf: PropTypes.bool.isRequired,
        isParent: PropTypes.bool.isRequired,
        label: PropTypes.node.isRequired,
        lang: languageShape.isRequired,
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
        showCheckbox: PropTypes.bool,
        title: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        children: null,
        className: null,
        expandOnClick: false,
        icon: null,
        showCheckbox: true,
        title: null,
        onClick: () => {},
    };

    constructor(props) {
        super(props);

        this.nodeRef = React.createRef();

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    componentDidUpdate(prevProps) {
        // Move focus for keyboard users
        const isReceivingFocus = this.props.hasFocus && !prevProps.hasFocus;
        if (isReceivingFocus) {
            this.nodeRef.current.focus();
        }
    }

    onCheck() {
        const { value, onCheck } = this.props;

        onCheck({ value, checked: this.getCheckState({ toggle: true }) });
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

    onKeyDown(e) {
        if (e.key === ' ') {
            e.preventDefault(); // prevent scrolling
            e.stopPropagation(); // prevent parent nodes from toggling their checked state
            if (!this.props.disabled) {
                this.onCheck();
            }
        }
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
                // hide this button from the accessibility tree, as there is full keyboard control
                aria-hidden
                className="rct-collapse rct-collapse-btn"
                disabled={expandDisabled}
                title={lang.toggle}
                onClick={this.onExpand}
                tabIndex={-1}
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

        // Disable the lints about this control not being accessible
        // We already provide full keyboard control, so this is clickable for mouse users
        // eslint-disable-next-line max-len
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        return (
            <span className="rct-bare-label" title={title}>
                {clickable ? (
                    <span
                        className="rct-node-clickable"
                        onClick={this.onClick}
                    >
                        {children}
                    </span>
                ) : children}
            </span>
        );
        // eslint-disable-next-line max-len
        /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
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
        const inputId = `${treeId}-${String(value).split(' ').join('_')}`;

        const render = [(
            <label key={0} htmlFor={inputId} title={title}>
                <NativeCheckbox
                    checked={checked === 1}
                    disabled={disabled}
                    id={inputId}
                    indeterminate={checked === 2}
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
                // We can disable the lint here, since keyboard functionality is already provided
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <span
                    key={1}
                    className="rct-node-clickable"
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

        return this.props.isParent ? (
            <div role="group">
                {this.props.children}
            </div>
        ) : (
            this.props.children
        );
    }

    render() {
        const {
            checked,
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
        let ariaChecked = checked === 1 ? 'true' : 'false';
        if (checked === 2) {
            ariaChecked = 'mixed';
        }

        return (
            <li
                aria-checked={ariaChecked}
                aria-disabled={disabled}
                aria-expanded={this.props.isParent ? expanded || false : null}
                className={nodeClass}
                onKeyDown={this.onKeyDown}
                ref={this.nodeRef}
                role="treeitem"
                tabIndex={this.props.hasFocus ? 0 : -1}
            >
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
