import React from 'react';

import nodeShape from './nodeShape';

class TreeNode extends React.Component {
	static propTypes = {
		checked: React.PropTypes.number.isRequired,
		expanded: React.PropTypes.bool.isRequired,
		label: React.PropTypes.string.isRequired,
		optimisticToggle: React.PropTypes.bool.isRequired,
		treeId: React.PropTypes.string.isRequired,
		value: React.PropTypes.string.isRequired,
		onCheck: React.PropTypes.func.isRequired,
		onExpand: React.PropTypes.func.isRequired,

		children: React.PropTypes.node,
		rawChildren: React.PropTypes.arrayOf(nodeShape),
	};

	static defaultProps = {
		children: null,
		rawChildren: undefined,
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

		// Toggle partial state based on model
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

	renderCollapseIcon() {
		if (!this.props.expanded) {
			return <i className="rct-icon rct-icon-expand-close" />;
		}

		return <i className="rct-icon rct-icon-expand-open" />;
	}

	renderCollapseButton() {
		if (this.props.rawChildren === null) {
			return (
				<span className="rct-collapse">
					<i className="rct-icon" />
				</span>
			);
		}

		return (
			<button aria-label="Toggle" className="rct-collapse rct-collapse-btn" title="Toggle" onClick={this.onExpand}>
				{this.renderCollapseIcon()}
			</button>
		);
	}

	renderCheckboxIcon() {
		if (this.props.checked === 0) {
			return <i className="rct-icon rct-icon-uncheck" />;
		}

		if (this.props.checked === 1) {
			return <i className="rct-icon rct-icon-check" />;
		}

		return <i className="rct-icon rct-icon-half-check" />;
	}

	renderNodeIcon() {
		if (this.props.rawChildren === null) {
			return <i className="rct-icon rct-icon-leaf" />;
		}

		if (!this.props.expanded) {
			return <i className="rct-icon rct-icon-parent-close" />;
		}

		return <i className="rct-icon rct-icon-parent-open" />;
	}

	renderChildren() {
		if (!this.props.expanded) {
			return null;
		}

		return this.props.children;
	}

	render() {
		const { checked, treeId, label, value } = this.props;
		const inputId = `${treeId}-${value}`;

		return (
			<li className="rct-node">
				<span className="rct-text">
					{this.renderCollapseButton()}
					<label htmlFor={inputId}>
						<input checked={checked === 1} id={inputId} type="checkbox" onChange={this.onCheck} />
						<span className="rct-checkbox">
							{this.renderCheckboxIcon()}
						</span>
						<span className="rct-node-icon">
							{this.renderNodeIcon()}
						</span>
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
