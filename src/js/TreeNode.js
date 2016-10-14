import React from 'react';

class TreeNode extends React.Component {
	static propTypes = {
		children: React.PropTypes.node,
		checked: React.PropTypes.number,
		expanded: React.PropTypes.bool,
		rawChildren: React.PropTypes.any,
		onCheck: React.PropTypes.func,
		onExpand: React.PropTypes.func,
		title: React.PropTypes.string,
		value: React.PropTypes.string,
	};

	constructor(props) {
		super(props);

		this.onCheck = this.onCheck.bind(this);
		this.onExpand = this.onExpand.bind(this);
	}

	onCheck() {
		let isChecked = 0;

		// Toggle off/partial check state to checked
		if (this.props.checked === 0 || this.props.checked === 2) {
			isChecked = 1;
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
		if (this.props.children === null) {
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
		if (this.props.children !== null) {
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
		return (
			<li className="rct-node">
				<span className="rct-text">
					<span className="rct-collapse" onClick={this.onExpand} title="Toggle">
						{this.renderCollapseIcon()}
					</span>
					<label onClick={this.onCheck}>
						<span className="rct-checkbox">
							{this.renderCheckboxIcon()}
						</span>
						<span className="rct-icon">
							{this.renderNodeIcon()}
						</span>
						<span className="rct-title">
							{this.props.title}
						</span>
					</label>
				</span>
				{this.renderChildren()}
			</li>
		);
	}
}

export default TreeNode;
