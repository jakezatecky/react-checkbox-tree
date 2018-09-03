import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';
import nanoid from 'nanoid';

import Button from './Button';
import TreeNode from './TreeNode';
import iconsShape from './iconsShape';
import languageShape from './languageShape';
import listShape from './listShape';
import nodeShape from './nodeShape';

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
        this.nodes = {};

        this.flattenNodes(props.nodes);
        this.unserializeLists({
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

        this.unserializeLists({ checked, expanded });
    }

    onCheck(node) {
        const { noCascade, onCheck } = this.props;

        this.toggleChecked(node, node.checked, noCascade);
        onCheck(this.serializeList('checked'), node);
    }

    onExpand(node) {
        const { onExpand } = this.props;

        this.toggleNode('expanded', node, node.expanded);
        onExpand(this.serializeList('expanded'), node);
    }

    onExpandAll() {
        this.expandAllNodes();
    }

    onCollapseAll() {
        this.expandAllNodes(false);
    }

    getFormattedNodes(nodes) {
        return nodes.map((node) => {
            const formatted = { ...node };

            formatted.checked = this.nodes[node.value].checked;
            formatted.expanded = this.nodes[node.value].expanded;
            formatted.showCheckbox = node.showCheckbox !== undefined ? node.showCheckbox : true;

            if (this.nodes[node.value].isParent) {
                formatted.children = this.getFormattedNodes(formatted.children);
            } else {
                formatted.children = null;
            }

            return formatted;
        });
    }

    getCheckState(node, noCascade) {
        if (node.children === null || noCascade) {
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

        Object.keys(this.nodes).forEach((value) => {
            if (this.nodes[value].isParent) {
                this.nodes[value].expanded = expand;
            }
        });

        onExpand(this.serializeList('expanded', null));
    }

    toggleChecked(node, isChecked, noCascade) {
        if (node.children === null || noCascade) {
            // Set the check status of a leaf node or an uncoupled parent
            this.toggleNode('checked', node, isChecked);
        } else {
            // Percolate check status down to all children
            node.children.forEach((child) => {
                this.toggleChecked(child, isChecked);
            });
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
            const isParent = this.nodeHasChildren(node);

            this.nodes[node.value] = {
                isParent,
                isLeaf: !isParent,
            };
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
                if (this.nodes[value] !== undefined) {
                    this.nodes[value][listKey] = true;
                }
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
            const checked = this.getCheckState(node, noCascade);
            const isLeaf = node.children === null;
            const children = this.renderChildNodes(node);
            const nodeDisabled = this.getDisabledState(node, parent, disabled, noCascade);
            // Show checkbox only if this is a leaf node or showCheckbox is true
            const showCheckbox = onlyLeafCheckboxes ? isLeaf : node.showCheckbox;

            return (
                <TreeNode
                    key={key}
                    checked={checked}
                    className={node.className}
                    disabled={nodeDisabled}
                    expandDisabled={expandDisabled}
                    expandOnClick={expandOnClick}
                    expanded={node.expanded}
                    icon={node.icon}
                    icons={{ ...defaultIcons, ...icons }}
                    label={node.label}
                    lang={lang}
                    optimisticToggle={optimisticToggle}
                    rawChildren={node.children}
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

    renderChildNodes(node) {
        if (node.children !== null && node.expanded) {
            return this.renderTreeNodes(node.children, node);
        }

        return null;
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
        const className = classNames({
            'react-checkbox-tree': true,
            'rct-disabled': this.props.disabled,
            'rct-native-display': this.props.nativeCheckboxes,
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
