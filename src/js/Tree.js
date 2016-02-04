import React from 'react';

import TreeNode from './TreeNode.js';

class Tree extends React.Component {
	static propTypes = {
		nodes: React.PropTypes.array,
		checked: React.PropTypes.array,
	};

	getFormattedNodes(nodes) {
		return nodes.map((node) => {
			const formatted = Object.create(node);

			formatted.checked = this.props.checked.indexOf(node.value) > -1;

			if (this.hasChildren(node)) {
				formatted.children = this.getFormattedNodes(formatted.children);
			}

			return formatted;
		});
	}

	getTreeNodes(nodes) {
		const treeNodes = nodes.map((node, index) => {
			const checked = this.isChecked(node);
			const children = this.getChildNodes(node);

			return (
				<TreeNode
					key={index}
					value={node.value}
					title={node.title}
					checked={checked}
					collapsed={node.collapsed}
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

	getChildNodes(node) {
		if (this.hasChildren(node)) {
			return this.getTreeNodes(node.children);
		}

		return null;
	}

	isChecked(node) {
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

	render() {
		const nodes = this.getFormattedNodes(this.props.nodes);
		const treeNodes = this.getTreeNodes(nodes);

		return (
			<div className="react-checkbox-tree">
				{treeNodes}
			</div>
		);
	}
}

export default Tree;
