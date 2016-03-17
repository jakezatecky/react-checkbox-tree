import React from 'react';

class TreeNode extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
		nameAsArray: React.PropTypes.bool,
		value: React.PropTypes.string,
		title: React.PropTypes.string,
		children: React.PropTypes.node,
		checked: React.PropTypes.number,
		collapsed: React.PropTypes.bool,
		rawChildren: React.PropTypes.any,
		onCheck: React.PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			collapsed: props.collapsed,
		};

		this.handleCollapseClick = this.handleCollapseClick.bind(this);
		this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
	}

	getCollapseIcon() {
		if (this.props.children === null) {
			return <i className="fa" />;
		}

		if (this.state.collapsed) {
			return <i className="fa fa-chevron-right" />;
		}

		return <i className="fa fa-chevron-down" />;
	}

	getCheckboxIcon() {
		if (this.props.checked === 0) {
			return <i className="fa fa-square-o" />;
		}

		if (this.props.checked === 1) {
			return <i className="fa fa-check-square-o" />;
		}

		return <i className="fa fa-check-square-o rct-half-checked" />;
	}

	getNodeIcon() {
		if (this.props.children !== null) {
			if (this.state.collapsed) {
				return <i className="fa fa-folder-o" />;
			}

			return <i className="fa fa-folder-open-o" />;
		}

		return <i className="fa fa-file-o" />;
	}

	getHiddenInput() {
		if (this.props.name === undefined || !this.props.nameAsArray) {
			return null;
		}

		const name = `${this.props.name}[]`;

		if (this.props.checked === 1) {
			return <input name={name} value={this.props.value} type="hidden" />;
		}

		return null;
	}

	getChildren() {
		if (this.state.collapsed) {
			return null;
		}

		return this.props.children;
	}

	handleCollapseClick() {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}

	handleCheckboxClick() {
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

	render() {
		return (
			<li className="rct-node">
				<span className="rct-text">
					<span className="rct-collapse" onClick={this.handleCollapseClick} title="toggle">
						{this.getCollapseIcon()}
					</span>
					<label onClick={this.handleCheckboxClick}>
						<span className="rct-checkbox">
							{this.getCheckboxIcon()}
						</span>
						<span className="rct-icon">
							{this.getNodeIcon()}
						</span>
						<span className="rct-title">
							{this.props.title}
						</span>
						{this.getHiddenInput()}
					</label>
				</span>
				{this.getChildren()}
			</li>
		);
	}
}

export default TreeNode;
