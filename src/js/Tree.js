import React from 'react';

import TreeNode from './TreeNode';
import nodeShape from './nodeShape';

class Tree extends React.Component {
	static propTypes = {
		onCheck: React.PropTypes.func.isRequired,
		onExpand: React.PropTypes.func.isRequired,

		checked: React.PropTypes.arrayOf(React.PropTypes.string),
		expanded: React.PropTypes.arrayOf(React.PropTypes.string),
		name: React.PropTypes.string,
		nameAsArray: React.PropTypes.bool,
		nodes: React.PropTypes.arrayOf(
			React.PropTypes.oneOfType([
				React.PropTypes.shape(nodeShape),
				React.PropTypes.shape({
					...nodeShape,
					children: React.PropTypes.arrayOf(nodeShape),
				}),
			]),
		),
	};

	static defaultProps = {
		checked: [],
		expanded: [],
		name: undefined,
		nameAsArray: false,
		nodes: [],
	};

	constructor(props) {
		super(props);

		this.onCheck = this.onCheck.bind(this);
		this.onExpand = this.onExpand.bind(this);
	}

	onCheck(node) {
		const { checked } = this.props;
		const isChecked = node.checked;

		this.setCheckState(checked, node, isChecked);

		this.props.onCheck(checked);
	}

	onExpand(node) {
		const isExpanded = node.expanded;
		const expanded = this.props.expanded;
		const nodeIndex = expanded.indexOf(node.value);

		if (!isExpanded && nodeIndex > -1) {
			// Node is now collapsed, remove from expanded list
			expanded.splice(nodeIndex, 1);
		} else if (isExpanded && nodeIndex === -1) {
			// Add node to expanded list
			expanded.push(node.value);
		}

		this.props.onExpand(expanded);
	}

	getFormattedNodes(nodes) {
		const { checked, expanded } = this.props;

		return nodes.map((node) => {
			const formatted = Object.create(node);

			formatted.checked = checked.indexOf(node.value) > -1;
			formatted.expanded = expanded.indexOf(node.value) > -1;

			if (this.hasChildren(node)) {
				formatted.children = this.getFormattedNodes(formatted.children);
			}

			return formatted;
		});
	}

	getCheckState(node) {
		if (this.hasChildren(node) === false) {
			return node.checked ? 1 : 0;
		}

		if (this.isEveryChildChecked(node)) {
			return 1;
		}

		if (this.isSomeChildChecked(node)) {
			return 2;
		}

		return 0;
	}

	setCheckState(checked, node, isChecked) {
		if (this.hasChildren(node)) {
			// Percolate check status down to all children
			node.children.forEach((child) => {
				this.setCheckState(checked, child, isChecked);
			});
		} else {
			// Set leaf to check/unchecked state
			const index = checked.indexOf(node.value);

			if (index > -1) {
				checked.splice(index, 1);
			}

			if (isChecked) {
				checked.push(node.value);
			}
		}
	}

	isEveryChildChecked(node) {
		return node.children.every((child) => {
			if (this.hasChildren(child)) {
				return this.isEveryChildChecked(child);
			}

			return child.checked;
		});
	}

	isSomeChildChecked(node) {
		return node.children.some((child) => {
			if (this.hasChildren(child)) {
				return this.isSomeChildChecked(child);
			}

			return child.checked;
		});
	}

	hasChildren(node) {
		if (typeof node.children !== 'object') {
			return false;
		}

		return node.children.length > 0;
	}

	renderTreeNodes(nodes) {
		const treeNodes = nodes.map((node, index) => {
			const key = `${index}-${node.value}`;
			const checked = this.getCheckState(node);
			const children = this.renderChildNodes(node);

			return (
				<TreeNode
					key={key}
					checked={checked}
					expanded={node.expanded}
					rawChildren={node.children}
					title={node.title}
					value={node.value}
					onCheck={this.onCheck}
					onExpand={this.onExpand}
				>
					{children}
				</TreeNode>
			);
		});

		return (
			<ol>
				{treeNodes}
			</ol>
		);
	}

	renderChildNodes(node) {
		if (this.hasChildren(node)) {
			return this.renderTreeNodes(node.children);
		}

		return null;
	}

	renderHiddenInput() {
		if (this.props.name === undefined) {
			return null;
		}

		if (this.props.nameAsArray) {
			return this.renderArrayHiddenInput();
		}

		return this.renderJoinedHiddenInput();
	}

	renderArrayHiddenInput() {
		return this.props.checked.map((value) => {
			const name = `${this.props.name}[]`;

			return <input key={value} name={name} type="hidden" value={value} />;
		});
	}

	renderJoinedHiddenInput() {
		const checked = this.props.checked.join(',');

		return <input name={this.props.name} type="hidden" value={checked} />;
	}

	render() {
		const nodes = this.getFormattedNodes(this.props.nodes);
		const treeNodes = this.renderTreeNodes(nodes);

		return (
			<div className="react-checkbox-tree">
				{this.renderHiddenInput()}
				{treeNodes}
			</div>
		);
	}
}

export default Tree;
