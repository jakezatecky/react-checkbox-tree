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
		rawChildren: React.PropTypes.arrayOf(React.PropTypes.shape(nodeShape)),
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
		if (this.props.rawChildren === null) {
			return <i className="fa" />;
		}

		if (!this.props.expanded) {
			return <i className="fa fa-chevron-right" />;
		}

		return <i className="fa fa-chevron-down" />;
	}

	renderCheckboxIcon() {
		if (this.props.checked === 0) {
			return <i className="fa fa-square-o" />;
		}

		if (this.props.checked === 1) {
			return <i className="fa fa-check-square-o" />;
		}

		return <i className="fa fa-check-square-o rct-half-checked" />;
	}

	renderNodeIcon() {
		if (this.props.rawChildren !== null) {
			if (!this.props.expanded) {
				return <i className="fa fa-folder-o" />;
			}

			return <i className="fa fa-folder-open-o" />;
		}

		return <i className="fa fa-file-o" />;
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
					<button className="rct-collapse" title="Toggle" onClick={this.onExpand}>
						{this.renderCollapseIcon()}
					</button>
					<label htmlFor={inputId}>
						<input checked={checked === 1} id={inputId} type="checkbox" onChange={this.onCheck} />
						<span className="rct-checkbox">
							{this.renderCheckboxIcon()}
						</span>
						<span className="rct-icon">
							{this.renderNodeIcon()}
						</span>
						<span className="rct-label">
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
