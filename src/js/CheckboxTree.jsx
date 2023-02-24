import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import React from 'react';

import GlobalActions from './components/GlobalActions';
import HiddenInput from './components/HiddenInput';
import TreeNode from './components/TreeNode';
import defaultLang from './lang/default';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
import listShape from './shapes/listShape';
import nodeShape from './shapes/nodeShape';
import { CHECK_MODEL, KEYS } from './constants';
import { IconContext, LanguageContext } from './contexts';
import NodeModel from './NodeModel';

const defaultIcons = {
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
};

class CheckboxTree extends React.Component {
    static propTypes = {
        nodes: PropTypes.arrayOf(nodeShape).isRequired,

        checkKeys: PropTypes.arrayOf(PropTypes.string),
        checkModel: PropTypes.oneOf([CHECK_MODEL.LEAF, CHECK_MODEL.ALL]),
        checked: listShape,
        direction: PropTypes.string,
        disabled: PropTypes.bool,
        expandDisabled: PropTypes.bool,
        expandOnClick: PropTypes.bool,
        expanded: listShape,
        icons: iconsShape,
        iconsClass: PropTypes.string,
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
        checkKeys: [KEYS.SPACEBAR, KEYS.ENTER],
        checkModel: CHECK_MODEL.LEAF,
        checked: [],
        direction: 'ltr',
        disabled: false,
        expandDisabled: false,
        expandOnClick: false,
        expanded: [],
        icons: defaultIcons,
        iconsClass: 'fa5',
        id: null,
        lang: defaultLang,
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
            model,
            prevProps: props,
        };

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onNodeClick = this.onNodeClick.bind(this);
        this.onExpandAll = this.onExpandAll.bind(this);
        this.onCollapseAll = this.onCollapseAll.bind(this);

        this.combineMemorized = memoize((icons1, icons2) => ({ ...icons1, ...icons2 })).bind(this);
    }

    static getDerivedStateFromProps(newProps, prevState) {
        const { model, prevProps } = prevState;
        const { disabled, nodes } = newProps;
        const newState = { ...prevState, prevProps: newProps };

        // Apply new properties to model
        model.setProps(newProps);

        // Since flattening nodes is an expensive task, only update when there is a node change
        if (!isEqual(prevProps.nodes, nodes) || prevProps.disabled !== disabled) {
            model.reset();
            model.flattenNodes(nodes);
        }

        model.deserializeLists({
            checked: newProps.checked,
            expanded: newProps.expanded,
        });

        return newState;
    }

    onCheck(nodeInfo) {
        const { checkModel, noCascade, onCheck } = this.props;
        const { model } = this.state;
        const newModel = model.clone();
        const node = newModel.getNode(nodeInfo.value);

        newModel.toggleChecked(nodeInfo, nodeInfo.checked, checkModel, noCascade);
        onCheck(newModel.serializeList('checked'), { ...node, ...nodeInfo });
    }

    onExpand(nodeInfo) {
        const { onExpand } = this.props;
        const { model } = this.state;
        const newModel = model.clone();
        const node = newModel.getNode(nodeInfo.value);

        newModel.toggleNode(nodeInfo.value, 'expanded', nodeInfo.expanded);
        onExpand(newModel.serializeList('expanded'), { ...node, ...nodeInfo });
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

    expandAllNodes(expand = true) {
        const { onExpand } = this.props;
        const { model } = this.state;

        onExpand(
            model.clone()
                .expandAllNodes(expand)
                .serializeList('expanded'),
        );
    }

    determineShallowCheckState(node, noCascade) {
        const { model } = this.state;
        const flatNode = model.getNode(node.value);

        if (flatNode.isLeaf || noCascade || node.children.length === 0) {
            // Note that an empty parent node tracks its own state
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
        const { model } = this.state;

        return node.children.every(
            (child) => model.getNode(child.value).checkState === 1,
        );
    }

    isSomeChildChecked(node) {
        const { model } = this.state;

        return node.children.some(
            (child) => model.getNode(child.value).checkState > 0,
        );
    }

    renderTreeNodes(nodes, parent = {}) {
        const {
            checkKeys,
            expandDisabled,
            expandOnClick,
            id,
            noCascade,
            onClick,
            onlyLeafCheckboxes,
            optimisticToggle,
            showNodeTitle,
            showNodeIcon,
        } = this.props;
        const { model } = this.state;

        const treeNodes = nodes.map((node) => {
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
            const parentExpanded = parent.value ? model.getNode(parent.value).expanded : true;

            if (!parentExpanded) {
                return null;
            }

            return (
                <TreeNode
                    key={key}
                    checkKeys={checkKeys}
                    checked={flatNode.checkState}
                    className={node.className}
                    disabled={flatNode.disabled}
                    expandDisabled={expandDisabled}
                    expandOnClick={expandOnClick}
                    expanded={flatNode.expanded}
                    icon={node.icon}
                    isLeaf={flatNode.isLeaf}
                    isParent={flatNode.isParent}
                    label={node.label}
                    optimisticToggle={optimisticToggle}
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
            <ol>
                {treeNodes}
            </ol>
        );
    }

    renderGlobalOptions() {
        const { showExpandAll } = this.props;

        if (!showExpandAll) {
            return null;
        }

        return <GlobalActions onCollapseAll={this.onCollapseAll} onExpandAll={this.onExpandAll} />;
    }

    renderHiddenInput() {
        const { checked, name, nameAsArray } = this.props;

        return name === undefined ? null : (
            <HiddenInput checked={checked} name={name} nameAsArray={nameAsArray} />
        );
    }

    render() {
        const {
            direction,
            disabled,
            icons,
            iconsClass,
            id,
            lang,
            nodes,
            nativeCheckboxes,
        } = this.props;
        const mergedIcons = this.combineMemorized(defaultIcons, icons);
        const treeNodes = this.renderTreeNodes(nodes);

        const className = classNames({
            'react-checkbox-tree': true,
            'rct-disabled': disabled,
            [`rct-icons-${iconsClass}`]: true,
            'rct-native-display': nativeCheckboxes,
            'rct-direction-rtl': direction === 'rtl',
        });

        return (
            <div className={className} id={id}>
                <LanguageContext.Provider value={lang}>
                    <IconContext.Provider value={mergedIcons}>
                        {this.renderGlobalOptions()}
                        {this.renderHiddenInput()}
                        {treeNodes}
                    </IconContext.Provider>
                </LanguageContext.Provider>
            </div>
        );
    }
}

export default CheckboxTree;
