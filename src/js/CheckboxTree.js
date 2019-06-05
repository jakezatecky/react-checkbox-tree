import classNames from 'classnames';
import nanoid from 'nanoid';
import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import constants from './constants';
import TreeNode from './TreeNode';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
// import listShape from './shapes/listShape';
import nodeShape from './shapes/nodeShape';

class CheckboxTree extends React.Component {
    static propTypes = {
        nodes: PropTypes.oneOfType([
            nodeShape,
            PropTypes.arrayOf(nodeShape),
        ]).isRequired,

        checkModel: PropTypes.oneOf([constants.CheckModel.LEAF, constants.CheckModel.ALL]),
        disabled: PropTypes.bool,
        expandDisabled: PropTypes.bool,
        expandOnClick: PropTypes.bool,
        icons: iconsShape,
        iconsClass: PropTypes.string,
        // id: PropTypes.string, // removed to pass eslint
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
        checkModel: constants.CheckModel.LEAF,
        disabled: false,
        expandDisabled: false,
        expandOnClick: false,
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
            radioOff: <span className="rct-icon rct-icon-radio-off" />,
            radioOn: <span className="rct-icon rct-icon-radio-on" />,
        },
        iconsClass: 'fa4',
        // id: null, // removed to pass eslint
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

    static getDerivedStateFromProps(props, state) {
        const { id, icons } = props;
        const newState = { ...state };

        let stateChanged = false;

        if (id && id !== state.id) {
            newState.id = id;
            stateChanged = true;
        }

        if (icons !== CheckboxTree.defaultProps.icons && icons !== state.prevIconsProp) {
            let iconsChanged = false;
            const newIcons = { ...state.icons };
            const keys = Object.keys(icons);
            keys.forEach((key) => {
                if (!state.icons[key] || icons[key] !== state.icons[key]) {
                    iconsChanged = true;
                    newIcons[key] = icons[key];
                }
            });
            if (iconsChanged) {
                newState.icons = newIcons;
                newState.prevIconsProp = icons;
                stateChanged = true;
            }
        }

        if (stateChanged) {
            return newState;
        }

        return null;
    }

    state = {
        id: `rct-${nanoid(7)}`,
        icons: { ...CheckboxTree.defaultProps.icons },
        prevIconsProp: {},
    }

    // This instance variable is used to store the parent of each node (keyed on node.value)
    // for use when updating nodes during onCheck(), onExpand() and updateParentNodes().
    parents = {}

    updateParentNodes = (node) => {
        let newNode = node;
        const updateChildren = (child) => {
            if (child.value === newNode.value) {
                return newNode;
            }
            return child;
        };

        let parent;
        while (this.parents[newNode.value]) {
            parent = { ...this.parents[newNode.value] };
            parent.children = parent.children.map(updateChildren);
            newNode = parent;
        }

        // return root node
        return parent;
    }

    updateRadioSiblings = (node, parent) => {
        const newChildren = parent.children.map((child) => {
            if (child.value === node.value) {
                return node;
            }
            return { ...child, checked: false };
        });

        return { ...parent, children: newChildren };
    }

    onCheck = (node) => {
        const { nodes, onCheck } = this.props;
        const parent = this.parents[node.value];

        if (parent.radioGroup) {
            this.parents[node.value] = this.updateRadioSiblings(node, parent);
        }

        const root = this.updateParentNodes(node);

        if (Array.isArray(nodes)) {
            onCheck(node, root.children);
        } else {
            onCheck(node, root);
        }
    }

    onExpand = (node) => {
        const { nodes, onExpand } = this.props;
        const root = this.updateParentNodes(node);
        if (Array.isArray(nodes)) {
            onExpand(node, root.children);
        } else {
            onExpand(node, root);
        }
    }

    onNodeClick = (node) => {
        const { onClick } = this.props;
        onClick(node);
    }

    onExpandAll = () => {
        this.expandAllNodes();
    }

    onCollapseAll = () => {
        this.expandAllNodes(false);
    }

    expandAllNodes = (expand = true) => {
        const { nodes, onExpand } = this.props;
        const expandNodes = (node) => {
            if (node.children && node.children.length > 0) {
                const children = node.children.map(expandNodes);
                return { ...node, expanded: expand, children };
            }
            return node;
        };

        // walk tree and set all parent nodes expanded
        if (Array.isArray(nodes)) {
            const newNodes = nodes.map(expandNodes);
            onExpand(newNodes[0], newNodes);
        } else {
            const root = { ...nodes };
            const newChildren = root.children.map(expandNodes);
            onExpand(newChildren[0], root);
        }
    }

    isParent(node) {
        return !!(node.children && node.children.length > 0);
    }

    renderTreeNodes(nodes, parent, checkedArray = [], forceDisabled = false) {
        const {
            checkModel,
            disabled,
            expandDisabled,
            expandOnClick,
            lang,
            noCascade,
            onClick,
            onlyLeafCheckboxes,
            optimisticToggle,
            showNodeTitle,
            showNodeIcon,
        } = this.props;

        const { icons, id } = this.state;

        // These two variables will be in the Object returned by this function
        // as numFullcheck and numPartialCheck. See recursive call below.
        let state1counter = 0; // number of nodes in the nodes array with checkState === 1
        let state2counter = 0;// number of nodes in the nodes array with checkState === 2
        const treeNodes = nodes.map((node) => {
            this.parents[node.value] = parent;

            const key = node.value;
            const isParent = this.isParent(node);
            const isRadioGroup = !!node.radioGroup;
            const isRadioNode = !!parent.radioGroup;

            /*
            //---------------------------------------------------------------
            // this checks for multiple checked === true nodes in a RadioGroup
            // This fixes the problem by mutating the prop!
            if (isRadioGroup) {
                const numChecked = node.children.filter(child => child.checked).length;
                if (numChecked !== 1) {
                    // set checked = true for first child as default
                    const defaultChecked = 0;
                    for (let i = 0, ii = node.children.length; i < ii; i += 1) {
                        // esLint-disable-next-line no-param-reassign
                        node.children[i].checked = (i === defaultChecked);
                    }
                }
            }
            //---------------------------------------------------------------
            */

            // determine if node needs to be disabled
            // node.disabled defaults to false here if undefined
            let nodeDisabled = disabled || forceDisabled || !!node.disabled;

            // handle the case where there are onlyLeafCheckboxes
            // or a radioGroup node has no checkbox
            if (isRadioNode &&
                !parent.checked &&
                (!onlyLeafCheckboxes || parent.showCheckbox)
            ) {
                nodeDisabled = true;
            }

            // determine if node's children need to be disabled
            // disableChildren is passed as the 4th argument to renderTreeNodes
            // in the recursive call below
            let disableChildren = forceDisabled || (nodeDisabled && !noCascade);
            if (isRadioNode) {
                disableChildren = !node.checked || nodeDisabled;
            }

            // process chidren first so checkState calculation will know the
            // number of chidren checked
            // numFullcheck is the number of children with checkstate === 1
            // numPartialCheck is the number of children with checkstate === 1
            let children; // rendered children TreeNodes
            let numFullcheck; // the number of children with checkstate === 1
            let numPartialCheck; // the number of children with checkstate === 1
            if (isParent) {
                ({ children, numFullcheck, numPartialCheck } =
                    this.renderTreeNodes(node.children, node, checkedArray, disableChildren));
            }

            // calculate checkState for this node and
            // increment appropriate checkState counter for the nodes.map() loop
            let checkState;
            if (!isParent || noCascade || isRadioGroup || isRadioNode) {
                checkState = node.checked ? 1 : 0;
                if (checkState) {
                    state1counter += 1;
                }
            } else if (numFullcheck === node.children.length) {
                checkState = 1;
                state1counter += 1;
            } else if (numFullcheck + numPartialCheck === 0) {
                checkState = 0;
            } else {
                checkState = 2;
                state2counter += 1;
            }

            // build checkedArray
            if (checkState === 1 && !nodeDisabled) {
                if (isRadioNode) {
                    if (parent.checked) {
                        checkedArray.push(node.value);
                    }
                } else if ((noCascade) ||
                    (checkModel === constants.CheckModel.ALL) ||
                    (checkModel === constants.CheckModel.LEAF && !isParent)
                ) {
                    checkedArray.push(node.value);
                }
            }

            // Render only if parent is expanded or if there is no root parent
            if (!parent.expanded) {
                return null;
            }

            // NOTE: variables calculated below here are not needed if node is not rendered

            let { showCheckbox } = node; // if undefined, TreeNode.defaultProps will be used
            if (parent.radioGroup) {
                showCheckbox = true;
            } else if (onlyLeafCheckboxes) { // overrides node.showCheckbox
                showCheckbox = !isParent;
            }

            return (
                <TreeNode
                    key={key}
                    checked={checkState}
                    className={node.className}
                    disabled={nodeDisabled}
                    expandDisabled={expandDisabled}
                    expandOnClick={expandOnClick}
                    expanded={!!node.expanded}
                    icon={node.icon}
                    icons={icons}
                    label={node.label}
                    lang={lang}
                    optimisticToggle={optimisticToggle}
                    isLeaf={!isParent}
                    isParent={isParent}
                    isRadioGroup={node.radioGroup}
                    isRadioNode={parent.radioGroup}
                    showCheckbox={showCheckbox}
                    showNodeIcon={showNodeIcon}
                    title={showNodeTitle ? node.title || node.label : node.title}
                    treeId={id}
                    value={node.value}

                    onCheck={this.onCheck}
                    onClick={onClick && this.onNodeClick}
                    onExpand={this.onExpand}

                    noCascade={noCascade}
                    node={node}
                    unrenderedChildren={node.children}
                >
                    {children}
                </TreeNode>
            );
        });

        return {
            checkedArray,
            numFullcheck: state1counter,
            numPartialCheck: state2counter,
            children: (
                <ol>
                    {treeNodes}
                </ol>
            ),
        };
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

    renderHiddenInput(checkedArray) {
        const { name, nameAsArray } = this.props;

        if (name === undefined) {
            return null;
        }

        if (nameAsArray) {
            return this.renderArrayHiddenInput(checkedArray);
        }

        return this.renderJoinedHiddenInput(checkedArray);
    }

    renderArrayHiddenInput(checkedArray) {
        const { name: inputName } = this.props;

        return checkedArray.map((value) => {
            const name = `${inputName}[]`;

            return <input key={value} name={name} type="hidden" value={value} />;
        });
    }

    renderJoinedHiddenInput(checkedArray) {
        const { name } = this.props;
        const inputValue = checkedArray.join(',');

        return <input name={name} type="hidden" value={inputValue} />;
    }

    render() {
        const {
            disabled,
            iconsClass,
            nodes,
            nativeCheckboxes,
        } = this.props;

        // reset for this render - values set in renderTreeNodes()
        this.parents = {};

        let root;
        if (Array.isArray(nodes)) {
            root = {
                value: '*root*',
                label: 'Root',
                expanded: true,
                children: [...nodes],
            };
        } else {
            root = nodes;
        }
        const { children, checkedArray } = this.renderTreeNodes(root.children, root);

        const className = classNames({
            'react-checkbox-tree': true,
            'rct-disabled': disabled,
            [`rct-icons-${iconsClass}`]: true,
            'rct-native-display': nativeCheckboxes,
        });

        return (
            <div className={className}>
                {this.renderExpandAll()}
                {this.renderHiddenInput(checkedArray)}
                {children}
            </div>
        );
    }
}

export default CheckboxTree;
