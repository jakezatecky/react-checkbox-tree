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
        super();

        const model = new NodeModel(props);
        model.flattenNodes(props.nodes);
        model.deserializeLists({
            checked: props.checked,
            expanded: props.expanded,
        });

        this.state = {
            id: `rct-${nanoid(7)}`,
            model,
        };

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onExpandAll = this.onExpandAll.bind(this);
        this.onCollapseAll = this.onCollapseAll.bind(this);
    }

    componentWillReceiveProps({ nodes, checked, expanded }) {
        if (!isEqual(this.props.nodes, nodes)) {
            this.state.model.flattenNodes(nodes);
        }

        this.state.model.deserializeLists({ checked, expanded });
    }

    onCheck(nodeInfo) {
        const { noCascade, onCheck } = this.props;
        const model = this.state.model.clone();
        const node = model.getNode(nodeInfo.value);

        model.toggleChecked(nodeInfo, nodeInfo.checked, noCascade);
        onCheck(model.serializeList('checked'), { ...nodeInfo, children: node.self.children });
    }

    onExpand(nodeInfo) {
        const { onExpand } = this.props;
        const model = this.state.model.clone();
        const node = model.getNode(nodeInfo.value);

        model.toggleNode(nodeInfo.value, 'expanded', nodeInfo.expanded);
        onExpand(model.serializeList('expanded'), { ...nodeInfo, children: node.self.children });
    }

    onExpandAll() {
        this.expandAllNodes();
    }

    onCollapseAll() {
        this.expandAllNodes(false);
    }

    getShallowCheckState(node, noCascade) {
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

    expandAllNodes(expand = true) {
        const { onExpand } = this.props;

        onExpand(
            this.state.model.clone()
                .expandAllNodes(expand)
                .serializeList('expanded'),
        );
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
            onlyLeafCheckboxes,
            optimisticToggle,
            showNodeTitle,
            showNodeIcon,
            onClick,
        } = this.props;
        const { id, model } = this.state;
        const { icons: defaultIcons } = CheckboxTree.defaultProps;

        const treeNodes = nodes.map((node) => {
            const key = `${node.value}`;
            const flatNode = model.getNode(node.value);
            const children = flatNode.isParent ? this.renderTreeNodes(node.children, node) : null;

            // Get the check state after all children check states have been determined
            flatNode.checkState = this.getShallowCheckState(node, noCascade);

            // Show checkbox only if this is a leaf node or showCheckbox is true
            const showCheckbox = onlyLeafCheckboxes ? flatNode.isLeaf : flatNode.showCheckbox;

            // Render only if parent is expanded or if there is no root parent
            const parentExpanded = parent.value ? model.getNode(parent.value).expanded : true;

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
