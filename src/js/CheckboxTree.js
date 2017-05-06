import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import shortid from 'shortid';

import TreeNode from './TreeNode';
import nodeShape from './nodeShape';

class CheckboxTree extends React.Component {
	static propTypes = {
		nodes: PropTypes.arrayOf(nodeShape).isRequired,

		checked: PropTypes.arrayOf(PropTypes.string),
		expanded: PropTypes.arrayOf(PropTypes.string),
		name: PropTypes.string,
		nameAsArray: PropTypes.bool,
		optimisticToggle: PropTypes.bool,
		showNodeIcon: PropTypes.bool,
		onCheck: PropTypes.func,
		onExpand: PropTypes.func,
	};

	static defaultProps = {
		checked: [],
		expanded: [],
		name: undefined,
		nameAsArray: false,
		nodes: [],
		optimisticToggle: true,
		showNodeIcon: true,
		onCheck: () => {},
		onExpand: () => {},
	};

	constructor(props) {
		super(props);

		this.id = `rct-${shortid.generate()}`;
		this.nodes = {};

		this.flattenNodes(props.nodes);
		this.unserializeLists({
			checked: props.checked,
			expanded: props.expanded,
		});

		this.onCheck = this.onCheck.bind(this);
		this.onExpand = this.onExpand.bind(this);
	}

	componentWillReceiveProps({ nodes, checked, expanded }) {
		if (!isEqual(this.props.nodes, nodes)) {
			this.flattenNodes(nodes);
		}

		this.unserializeLists({ checked, expanded });
	}

	onCheck(node) {
		const { onCheck } = this.props;

		this.toggleChecked(node, node.checked);
		onCheck(this.serializeList('checked'));
	}

	onExpand(node) {
		const { onExpand } = this.props;

		this.toggleNode('expanded', node, node.expanded);
		onExpand(this.serializeList('expanded'));
	}

	getFormattedNodes(nodes) {
		return nodes.map((node) => {
			const formatted = { ...node };

			formatted.checked = this.nodes[node.value].checked;
			formatted.expanded = this.nodes[node.value].expanded;

			if (Array.isArray(node.children) && node.children.length > 0) {
				formatted.children = this.getFormattedNodes(formatted.children);
			} else {
				formatted.children = null;
			}

			return formatted;
		});
	}

	getCheckState(node) {
		if (node.children === null) {
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

	toggleChecked(node, isChecked) {
		if (node.children !== null) {
			// Percolate check status down to all children
			node.children.forEach((child) => {
				this.toggleChecked(child, isChecked);
			});
		} else {
			// Set leaf to check/unchecked state
			this.toggleNode('checked', node, isChecked);
		}
	}

	toggleNode(key, node, toggleValue) {
		this.nodes[node.value][key] = toggleValue;
	}

	flattenNodes(nodes) {
		if (!Array.isArray(nodes) || nodes.length === 0) {
			return;
		}

		nodes.forEach((node) => {
			this.nodes[node.value] = {};
			this.flattenNodes(node.children);
		});
	}

	unserializeLists(lists) {
		// Reset values to false
		Object.keys(this.nodes).forEach((value) => {
			Object.keys(lists).forEach((listKey) => {
				this.nodes[value][listKey] = false;
			});
		});

		// Unserialize values and set their nodes to true
		Object.keys(lists).forEach((listKey) => {
			lists[listKey].forEach((value) => {
				this.nodes[value][listKey] = true;
			});
		});
	}

	serializeList(key) {
		const list = [];

		Object.keys(this.nodes).forEach((value) => {
			if (this.nodes[value][key]) {
				list.push(value);
			}
		});

		return list;
	}

	isEveryChildChecked(node) {
		return node.children.every((child) => {
			if (child.children !== null) {
				return this.isEveryChildChecked(child);
			}

			return child.checked;
		});
	}

	isSomeChildChecked(node) {
		return node.children.some((child) => {
			if (child.children !== null) {
				return this.isSomeChildChecked(child);
			}

			return child.checked;
		});
	}

	renderTreeNodes(nodes) {
		const treeNodes = nodes.map((node) => {
			const key = `${node.value}`;
			const checked = this.getCheckState(node);
			const children = this.renderChildNodes(node);

			return (
				<TreeNode
					key={key}
					checked={checked}
					className={node.className}
					expanded={node.expanded}
					icon={node.icon}
					label={node.label}
					optimisticToggle={this.props.optimisticToggle}
					rawChildren={node.children}
					showNodeIcon={this.props.showNodeIcon}
					treeId={this.id}
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
		if (node.children !== null && node.expanded) {
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

export default CheckboxTree;
