import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import nanoid from 'nanoid';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import NodeModel from './NodeModel';
import TreeNode from './TreeNode';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import listShape from './shapes/listShape';
import nodeShape from './shapes/nodeShape';

const SUPPORTED_KEYS = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'End',
    'Home',
    'Enter',
    ' ',
];

// Clamp a number so that it is within the range [min, max]
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

class CheckboxTree extends React.Component {
    static propTypes = {
        nodes: PropTypes.arrayOf(nodeShape).isRequired,

        checked: listShape,
        disabled: PropTypes.bool,
        expandDisabled: PropTypes.bool,
        expandOnClick: PropTypes.bool,
        expanded: listShape,
        icons: iconsShape,
        id: PropTypes.string,
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
        id: null,
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
        onClick: null,
        onExpand: () => {},
    };

    constructor(props) {
        super(props);

        const model = new NodeModel(props);
        model.flattenNodes(props.nodes);
        model.deserializeLists({
            checked: props.checked,
            expanded: props.expanded,
        });

        this.state = {
            focusedNodeIndex: null,
            id: props.id || `rct-${nanoid(7)}`,
            model,
            prevProps: props,
        };

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onNodeClick = this.onNodeClick.bind(this);
        this.onExpandAll = this.onExpandAll.bind(this);
        this.onCollapseAll = this.onCollapseAll.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    // eslint-disable-next-line react/sort-comp
    static getDerivedStateFromProps(newProps, prevState) {
        const { model, prevProps } = prevState;
        const { disabled, id, nodes } = newProps;
        let newState = { ...prevState, prevProps: newProps };

        // Apply new properties to model
        model.setProps(newProps);

        // Since flattening nodes is an expensive task, only update when there is a node change
        if (!isEqual(prevProps.nodes, nodes) || prevProps.disabled !== disabled) {
            model.flattenNodes(nodes);
        }

        if (id !== null) {
            newState = { ...newState, id };
        }
        model.deserializeLists({
            checked: newProps.checked,
            expanded: newProps.expanded,
        });

        return newState;
    }

    onCheck(nodeInfo) {
        const { noCascade, onCheck } = this.props;
        const model = this.state.model.clone();
        const node = model.getNode(nodeInfo.value);

        model.toggleChecked(nodeInfo, nodeInfo.checked, noCascade);
        onCheck(model.serializeList('checked'), { ...node, ...nodeInfo });
    }

    onExpand(nodeInfo) {
        const { onExpand } = this.props;
        const model = this.state.model.clone();
        const node = model.getNode(nodeInfo.value);

        model.toggleNode(nodeInfo.value, 'expanded', nodeInfo.expanded);
        onExpand(model.serializeList('expanded'), { ...node, ...nodeInfo });
    }

    onNodeClick(nodeInfo) {
        const { onClick } = this.props;
        const { model } = this.state;
        const node = model.getNode(nodeInfo.value);

        onClick({ ...node, ...nodeInfo });
    }

    onExpandAll() {
        this.expandAllNodes();
    }

    onCollapseAll() {
        this.expandAllNodes(false);
    }

    onFocus() {
        const isFirstFocus = this.state.focusedNodeIndex === null;
        if (isFirstFocus) {
            this.setState({ focusedNodeIndex: 0 });
        }
    }

    onKeyDown(e) {
        const keyEligibleForFirstLetterNavigation = e.key.length === 1 &&
            !e.ctrlKey && !e.metaKey && !e.altKey;
        // abort early so that we don't try to intercept common browser keystrokes like alt+d
        if (!SUPPORTED_KEYS.includes(e.key) && !keyEligibleForFirstLetterNavigation) {
            return;
        }

        const { focusedNodeIndex, model } = this.state;
        const currentlyFocusedNode = model.getNode(this.visibleNodes[focusedNodeIndex || 0]);
        let newFocusedNodeIndex = focusedNodeIndex || 0;
        const isExpandingEnabled = !this.props.expandDisabled && !this.props.disabled;

        e.preventDefault(); // disable built-in scrolling
        switch (e.key) {
            case 'ArrowDown':
                newFocusedNodeIndex += 1;
                break;
            case 'ArrowUp':
                newFocusedNodeIndex -= 1;
                break;
            case 'Home':
                newFocusedNodeIndex = 0;
                break;
            case 'End':
                newFocusedNodeIndex = this.visibleNodes.length - 1;
                break;
            case 'ArrowRight':
                if (currentlyFocusedNode && currentlyFocusedNode.isParent) {
                    if (currentlyFocusedNode.expanded) {
                        // we can increment focused index to get the first child
                        // because visibleNodes is an pre-order traversal of the tree
                        newFocusedNodeIndex += 1;
                    } else if (isExpandingEnabled) {
                        // expand the currently focused node
                        this.onExpand({ value: currentlyFocusedNode.value, expanded: true });
                    }
                }
                break;
            case 'ArrowLeft':
                if (!currentlyFocusedNode) {
                    return;
                }
                if (currentlyFocusedNode.isParent && currentlyFocusedNode.expanded &&
                    isExpandingEnabled) {
                    // collapse the currently focused node
                    this.onExpand({ value: currentlyFocusedNode.value, expanded: false });
                } else {
                    // Move focus to the parent of the current node, if any
                    // parent is the first element to the left of the currently focused element
                    // with a lower tree depth since visibleNodes is an pre-order traversal
                    const parent = this.visibleNodes.slice(0, focusedNodeIndex)
                        .reverse()
                        .find(val => model.getNode(val).treeDepth < currentlyFocusedNode.treeDepth);
                    if (parent) {
                        newFocusedNodeIndex = this.visibleNodes.indexOf(parent);
                    }
                }
                break;
            default:
                if (keyEligibleForFirstLetterNavigation) {
                    const next = this.visibleNodes.slice((focusedNodeIndex || 0) + 1)
                        .find((val) => {
                            const { label } = model.getNode(val);
                            // for now, we only support first-letter nav to
                            // nodes with string labels, not jsx elements
                            return label.startsWith ? label.startsWith(e.key) : false;
                        });
                    if (next) {
                        newFocusedNodeIndex = this.visibleNodes.indexOf(next);
                    }
                }
                break;
        }

        newFocusedNodeIndex = clamp(newFocusedNodeIndex, 0, this.visibleNodes.length - 1);
        this.setState({ focusedNodeIndex: newFocusedNodeIndex });
    }

    expandAllNodes(expand = true) {
        const { onExpand } = this.props;

        onExpand(
            this.state.model.clone()
                .expandAllNodes(expand)
                .serializeList('expanded'),
        );
    }

    determineShallowCheckState(node, noCascade) {
        const flatNode = this.state.model.getNode(node.value);

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

    isEveryChildChecked(node) {
        return node.children.every(child => this.state.model.getNode(child.value).checkState === 1);
    }

    isSomeChildChecked(node) {
        return node.children.some(child => this.state.model.getNode(child.value).checkState > 0);
    }

    renderTreeNodes(nodes, parent = {}) {
        const {
            expandDisabled,
            expandOnClick,
            icons,
            lang,
            noCascade,
            onClick,
            onlyLeafCheckboxes,
            optimisticToggle,
            showNodeTitle,
            showNodeIcon,
        } = this.props;
        const { focusedNodeIndex, id, model } = this.state;
        const { icons: defaultIcons } = CheckboxTree.defaultProps;

        const treeNodes = nodes.map((node) => {
            const parentExpanded = parent.value ? model.getNode(parent.value).expanded : true;
            if (parentExpanded) {
                // visible only if parent is expanded or if there is no root parent
                this.visibleNodes.push(node.value);
            }
            const key = node.value;
            const flatNode = model.getNode(node.value);
            const children = flatNode.isParent ? this.renderTreeNodes(node.children, node) : null;

            // Determine the check state after all children check states have been determined
            // This is done during rendering as to avoid an additional loop during the
            // deserialization of the `checked` property
            flatNode.checkState = this.determineShallowCheckState(node, noCascade);

            // Show checkbox only if this is a leaf node or showCheckbox is true
            const showCheckbox = onlyLeafCheckboxes ? flatNode.isLeaf : flatNode.showCheckbox;

            // Render only if parent is expanded or if there is no root parent
            if (!parentExpanded) {
                return null;
            }

            return (
                <TreeNode
                    key={key}
                    checked={flatNode.checkState}
                    className={node.className}
                    disabled={flatNode.disabled}
                    expandDisabled={expandDisabled}
                    expandOnClick={expandOnClick}
                    expanded={flatNode.expanded}
                    hasFocus={this.visibleNodes[focusedNodeIndex] === node.value}
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
                    treeId={id}
                    value={node.value}
                    onCheck={this.onCheck}
                    onClick={onClick && this.onNodeClick}
                    onExpand={this.onExpand}
                >
                    {children}
                </TreeNode>
            );
        });

        return (
            <ol role="presentation">
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
        const { focusedNodeIndex } = this.state;
        const isFirstFocus = focusedNodeIndex === null;
        this.visibleNodes = []; // an pre-order traversal of the tree for keyboard support
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
                <div
                    onFocus={this.onFocus}
                    onKeyDown={this.onKeyDown}
                    role="tree"
                    // Only include top-level node in tab order if it has never gained focus before
                    tabIndex={isFirstFocus ? 0 : -1}
                >
                    {treeNodes}
                </div>
            </div>
        );
    }
}

export default CheckboxTree;
