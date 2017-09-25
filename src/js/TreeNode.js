import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import nodeShape from './nodeShape';

class TreeNode extends React.Component {
    static propTypes = {
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        label: PropTypes.node.isRequired,
        optimisticToggle: PropTypes.bool.isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
        treeId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        onCheck: PropTypes.func.isRequired,
        onExpand: PropTypes.func.isRequired,

        children: PropTypes.node,
        className: PropTypes.string,
        icon: PropTypes.node,
        rawChildren: PropTypes.arrayOf(nodeShape),
    };

    static defaultProps = {
        children: null,
        className: null,
        icon: null,
        rawChildren: null,
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
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
            <button
                aria-label="Toggle"
                className="rct-collapse rct-collapse-btn"
                disabled={expandDisabled}
                title="Toggle"
                type="button"
                onClick={this.onExpand}
            >
                {this.renderCollapseIcon()}
            </button>
        );
    }

    renderCollapseIcon() {
        if (!this.props.expanded) {
            return <span className="rct-icon rct-icon-expand-close" />;
        }

        return <span className="rct-icon rct-icon-expand-open" />;
    }

    renderCheckboxIcon() {
        if (this.props.checked === 0) {
            return <span className="rct-icon rct-icon-uncheck" />;
        }

        if (this.props.checked === 1) {
            return <span className="rct-icon rct-icon-check" />;
        }

        return <span className="rct-icon rct-icon-half-check" />;
    }

    renderNodeIcon() {
        if (this.props.icon !== null) {
            return this.props.icon;
        }

        if (!this.hasChildren()) {
            return <span className="rct-icon rct-icon-leaf" />;
        }

        if (!this.props.expanded) {
            return <span className="rct-icon rct-icon-parent-close" />;
        }

        return <span className="rct-icon rct-icon-parent-open" />;
    }

    renderChildren() {
        if (!this.props.expanded) {
            return null;
        }

        return this.props.children;
    }

    render() {
        const {
            checked,
            className,
            disabled,
            label,
            showNodeIcon,
            treeId,
            value,
        } = this.props;
        const inputId = `${treeId}-${value}`;
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
                    <label htmlFor={inputId}>
                        <input
                            checked={checked === 1}
                            disabled={disabled}
                            id={inputId}
                            type="checkbox"
                            onChange={this.onCheck}
                        />
                        <span className="rct-checkbox">
                            {this.renderCheckboxIcon()}
                        </span>
                        {showNodeIcon ? (
                            <span className="rct-node-icon">
                                {this.renderNodeIcon()}
                            </span>
                        ) : null}
                        <span className="rct-title">
                            {label}
                        </span>
                    </label>
                </span>
                {this.renderChildren()}
            </li>
        );
    }
}

export default TreeNode;
