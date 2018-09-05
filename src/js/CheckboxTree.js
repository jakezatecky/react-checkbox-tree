import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import nanoid from 'nanoid';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import TreeNode from './TreeNode';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import listShape from './shapes/listShape';
import nodeShape from './shapes/nodeShape';

class CheckboxTree extends React.Component {
    static propTypes = {
        nodes: PropTypes.arrayOf(nodeShape).isRequired,

        checked: listShape,
        disabled: PropTypes.bool,
        expandDisabled: PropTypes.bool,
        expandOnClick: PropTypes.bool,
        expanded: listShape,
        icons: iconsShape,
        lang: languageShape,
        name: PropTypes.string,
        nameAsArray: PropTypes.bool,
        nativeCheckboxes: PropTypes.bool,
        noCascade: PropTypes.bool,
        onlyLeafCheckboxes: PropTypes.bool,
        optimisticToggle: PropTypes.bool,
        showExpandAll: PropTypes.bool,
        showNodeIcon: PropTypes.bool,
        showNodeTitle: PropTypes.bool,
        onCheck: PropTypes.func,
        onClick: PropTypes.func,
        onExpand: PropTypes.func,
    };

    static defaultProps = {
        checked: [],
        disabled: false,
        expandDisabled: false,
        expandOnClick: false,
        expanded: [],
        icons: {
            check: <span className="rct-icon rct-icon-check" />,
            uncheck: <span className="rct-icon rct-icon-uncheck" />,
            halfCheck: <span className="rct-icon rct-icon-half-check" />,
            expandClose: <span className="rct-icon rct-icon-expand-close" />,
            expandOpen: <span className="rct-icon rct-icon-expand-open" />,
            expandAll: <span className="rct-icon rct-icon-expand-all" />,
            collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
            parentClose: <span className="rct-icon rct-icon-parent-close" />,
            parentOpen: <span className="rct-icon rct-icon-parent-open" />,
            leaf: <span className="rct-icon rct-icon-leaf" />,
        },
        lang: {
            collapseAll: 'Collapse all',
            expandAll: 'Expand all',
            toggle: 'Toggle',
        },
        name: undefined,
        nameAsArray: false,
        nativeCheckboxes: false,
        noCascade: false,
        onlyLeafCheckboxes: false,
        optimisticToggle: true,
        showExpandAll: false,
        showNodeIcon: true,
        showNodeTitle: false,
        onCheck: () => {},
        onClick: () => {},
        onExpand: () => {},
    };

    constructor(props) {
        super(props);

        this.id = `rct-${nanoid(7)}`;
        this.flatNodes = {};

        this.flattenNodes(props.nodes);
        this.deserializeLists({
            checked: props.checked,
            expanded: props.expanded,
        });

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onExpandAll = this.onExpandAll.bind(this);
        this.onCollapseAll = this.onCollapseAll.bind(this);
    }

    componentWillReceiveProps({ nodes, checked, expanded }) {
        if (!isEqual(this.props.nodes, nodes)) {
            this.flattenNodes(nodes);
        }

        this.deserializeLists({ checked, expanded });
    }

    onCheck(nodeInfo) {
        const { noCascade, onCheck } = this.props;
        const node = this.flatNodes[nodeInfo.value];

        this.toggleChecked(nodeInfo, nodeInfo.checked, noCascade);
        onCheck(this.serializeList('checked'), { ...nodeInfo, children: node.self.children });
    }

    onExpand(nodeInfo) {
        const { onExpand } = this.props;
        const node = this.flatNodes[nodeInfo.value];

        this.toggleNode(nodeInfo.value, 'expanded', nodeInfo.expanded);
        onExpand(this.serializeList('expanded'), { ...nodeInfo, children: node.self.children });
    }

    onExpandAll() {
        this.expandAllNodes();
    }

    onCollapseAll() {
        this.expandAllNodes(false);
    }

    getShallowCheckState(node, noCascade) {
        const flatNode = this.flatNodes[node.value];

        if (flatNode.isLeaf || noCascade) {
            return flatNode.checked ? 1 : 0;
        }

        if (this.isEveryChildChecked(node)) {
            return 1;
        }

        if (this.isSomeChildChecked(node)) {
            return 2;
        }

        return 0;
    }

    getDisabledState(node, parent, disabledProp, noCascade) {
        if (disabledProp) {
            return true;
        }

        if (!noCascade && parent.disabled) {
            return true;
        }

        return Boolean(node.disabled);
    }

    nodeHasChildren(node) {
        return Array.isArray(node.children) && node.children.length > 0;
    }

    expandAllNodes(expand = true) {
        const { onExpand } = this.props;

        Object.keys(this.flatNodes).forEach((value) => {
            if (this.flatNodes[value].isParent) {
                this.flatNodes[value].expanded = expand;
            }
        });

        onExpand(this.serializeList('expanded', null));
    }

    toggleChecked(node, isChecked, noCascade) {
        const flatNode = this.flatNodes[node.value];

        if (flatNode.isLeaf || noCascade) {
            if (node.disabled) return;
            // Set the check status of a leaf node or an uncoupled parent
            this.toggleNode(node.value, 'checked', isChecked);
        } else {
            // Percolate check status down to all children
            flatNode.self.children.forEach((child) => {
                this.toggleChecked(child, isChecked, noCascade);
            });
        }
    }

    toggleNode(nodeValue, key, toggleValue) {
        this.flatNodes[nodeValue][key] = toggleValue;
    }

    flattenNodes(nodes, parentNode = {}) {
        if (!Array.isArray(nodes) || nodes.length === 0) {
            return;
        }

        nodes.forEach((node) => {
            const isParent = this.nodeHasChildren(node);

            this.flatNodes[node.value] = {
                isParent,
                isLeaf: !isParent,
                parent: parentNode,
                self: node,
                showCheckbox: node.showCheckbox !== undefined ? node.showCheckbox : true,
            };
            this.flattenNodes(node.children, node);
        });
    }

    deserializeLists(lists) {
        // Reset values to false
        Object.keys(this.flatNodes).forEach((value) => {
            Object.keys(lists).forEach((listKey) => {
                this.flatNodes[value][listKey] = false;
            });
        });

        // Deserialize values and set their nodes to true
        Object.keys(lists).forEach((listKey) => {
            lists[listKey].forEach((value) => {
                if (this.flatNodes[value] !== undefined) {
                    this.flatNodes[value][listKey] = true;
                }
            });
        });
    }

    serializeList(key) {
        const list = [];

        Object.keys(this.flatNodes).forEach((value) => {
            if (this.flatNodes[value][key]) {
                list.push(value);
            }
        });

        return list;
    }

    isEveryChildChecked(node) {
        return node.children.every(child => this.flatNodes[child.value].checkState === 1);
    }

    isSomeChildChecked(node) {
        return node.children.some(child => this.flatNodes[child.value].checkState > 0);
    }

    renderTreeNodes(nodes, parent = {}) {
        const {
            disabled,
            expandDisabled,
            expandOnClick,
            icons,
            lang,
            noCascade,
            onlyLeafCheckboxes,
            optimisticToggle,
            showNodeTitle,
            showNodeIcon,
            onClick,
        } = this.props;
        const { icons: defaultIcons } = CheckboxTree.defaultProps;

        const treeNodes = nodes.map((node) => {
            const key = `${node.value}`;
            const flatNode = this.flatNodes[node.value];
            const children = flatNode.isParent ? this.renderTreeNodes(node.children, node) : null;
            const nodeDisabled = this.getDisabledState(node, parent, disabled, noCascade);

            // Get the check state after all children check states are determined
            flatNode.checkState = this.getShallowCheckState(node, noCascade);

            // Show checkbox only if this is a leaf node or showCheckbox is true
            const showCheckbox = onlyLeafCheckboxes ? flatNode.isLeaf : flatNode.showCheckbox;

            // Render only if parent is expanded or if there is no root parent
            const parentExpanded = parent.value ? this.flatNodes[parent.value].expanded : true;

            if (!parentExpanded) {
                return null;
            }

            return (
                <TreeNode
                    key={key}
                    checked={flatNode.checkState}
                    className={node.className}
                    disabled={nodeDisabled}
                    expandDisabled={expandDisabled}
                    expandOnClick={expandOnClick}
                    expanded={flatNode.expanded}
                    icon={node.icon}
                    icons={{ ...defaultIcons, ...icons }}
                    label={node.label}
                    lang={lang}
                    optimisticToggle={optimisticToggle}
                    isLeaf={flatNode.isLeaf}
                    isParent={flatNode.isParent}
                    showCheckbox={showCheckbox}
                    showNodeIcon={showNodeIcon}
                    title={showNodeTitle ? node.title || node.label : node.title}
                    treeId={this.id}
                    value={node.value}
                    onCheck={this.onCheck}
                    onClick={onClick}
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

    renderExpandAll() {
        const { icons: { expandAll, collapseAll }, lang, showExpandAll } = this.props;

        if (!showExpandAll) {
            return null;
        }

        return (
            <div className="rct-options">
                <Button
                    className="rct-option rct-option-expand-all"
                    title={lang.expandAll}
                    onClick={this.onExpandAll}
                >
                    {expandAll}
                </Button>
                <Button
                    className="rct-option rct-option-collapse-all"
                    title={lang.collapseAll}
                    onClick={this.onCollapseAll}
                >
                    {collapseAll}
                </Button>
            </div>
        );
    }

    renderHiddenInput() {
        const { name, nameAsArray } = this.props;

        if (name === undefined) {
            return null;
        }

        if (nameAsArray) {
            return this.renderArrayHiddenInput();
        }

        return this.renderJoinedHiddenInput();
    }

    renderArrayHiddenInput() {
        const { checked, name: inputName } = this.props;

        return checked.map((value) => {
            const name = `${inputName}[]`;

            return <input key={value} name={name} type="hidden" value={value} />;
        });
    }

    renderJoinedHiddenInput() {
        const { checked, name } = this.props;
        const inputValue = checked.join(',');

        return <input name={name} type="hidden" value={inputValue} />;
    }

    render() {
        const { disabled, nodes, nativeCheckboxes } = this.props;
        const treeNodes = this.renderTreeNodes(nodes);

        const className = classNames({
            'react-checkbox-tree': true,
            'rct-disabled': disabled,
            'rct-native-display': nativeCheckboxes,
        });

        return (
            <div className={className}>
                {this.renderExpandAll()}
                {this.renderHiddenInput()}
                {treeNodes}
            </div>
        );
    }
}

export default CheckboxTree;
