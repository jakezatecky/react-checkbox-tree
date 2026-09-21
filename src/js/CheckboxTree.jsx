import classNames from 'classnames';
import { deepEqual } from 'fast-equals';
import memoize from 'lodash.memoize';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';

import GlobalActions from '#js/components/GlobalActions.jsx';
import HiddenInput from '#js/components/HiddenInput.jsx';
import TreeNode from '#js/components/TreeNode.jsx';
import defaultLang from '#js/lang/default.js';
import iconsShape from '#js/shapes/iconsShape.js';
import languageShape from '#js/shapes/languageShape.js';
import listShape from '#js/shapes/listShape.js';
import nodeShape from '#js/shapes/nodeShape.js';
import { CHECK_MODEL, KEYS } from '#js/constants.js';
import { IconContext, LanguageContext } from '#js/contexts.js';
import NodeModel from '#js/NodeModel.js';

const combineMemoized = memoize((newValue, defaultValue) => ({ ...defaultValue, ...newValue }));

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

// Defaults are hoisted so that their identities remain stable between renders
const defaultCheckKeys = [KEYS.SPACEBAR, KEYS.ENTER];
const defaultList = [];
const noop = () => {};

const propTypes = {
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
    onContextMenu: PropTypes.func,
    onExpand: PropTypes.func,
};

/**
 * Derive a `NodeModel` from the current props.
 *
 * Since flattening nodes is an expensive task, it is only re-done when the nodes have changed
 * +deeply_ (a new array with identical contents does not count) or when a property that is
 * derived into the flattened nodes changes. Applying the checked/expanded lists only requires a
 * cheaper clone of the flattened model.
 */
function useNodeModel({
    checked,
    disabled,
    expanded,
    nodes,
    noCascade,
}) {
    const [stableNodes, setStableNodes] = useState(nodes);
    let currentNodes = stableNodes;

    if (!deepEqual(stableNodes, nodes)) {
        setStableNodes(nodes);
        currentNodes = nodes;
    }

    const flatModel = useMemo(() => {
        const newModel = new NodeModel({ disabled, noCascade });

        newModel.flattenNodes(currentNodes);

        return newModel;
    }, [currentNodes, disabled, noCascade]);

    return useMemo(() => {
        const newModel = flatModel.clone();

        newModel.deserializeLists({ checked, expanded });

        return newModel;
    }, [flatModel, checked, expanded]);
}

function CheckboxTree({
    nodes,
    checkKeys = defaultCheckKeys,
    checkModel = CHECK_MODEL.LEAF,
    checked = defaultList,
    direction = 'ltr',
    disabled = false,
    expandDisabled = false,
    expandOnClick = false,
    expanded = defaultList,
    icons = defaultIcons,
    iconsClass = 'fa5',
    id = null,
    lang = defaultLang,
    name = undefined,
    nameAsArray = false,
    nativeCheckboxes = false,
    noCascade = false,
    onlyLeafCheckboxes = false,
    optimisticToggle = true,
    showExpandAll = false,
    showNodeIcon = true,
    showNodeTitle = false,
    onCheck = noop,
    onClick = null,
    onContextMenu = null,
    onExpand = noop,
}) {
    const model = useNodeModel({
        checked,
        disabled,
        expanded,
        nodes,
        noCascade,
    });

    const handleCheck = useCallback((nodeInfo) => {
        const newModel = model.clone();
        const node = newModel.getNode(nodeInfo.value);

        newModel.toggleChecked(nodeInfo, nodeInfo.checked, checkModel, noCascade);
        onCheck(newModel.serializeList('checked'), { ...node, ...nodeInfo });
    }, [checkModel, model, noCascade, onCheck]);

    const handleExpand = useCallback((nodeInfo) => {
        const newModel = model.clone();
        const node = newModel.getNode(nodeInfo.value);

        newModel.toggleNode(nodeInfo.value, 'expanded', nodeInfo.expanded);
        onExpand(newModel.serializeList('expanded'), { ...node, ...nodeInfo });
    }, [model, onExpand]);

    const handleNodeClick = useCallback((nodeInfo) => {
        const node = model.getNode(nodeInfo.value);

        onClick({ ...node, ...nodeInfo });
    }, [model, onClick]);

    const expandAllNodes = useCallback((expand = true) => {
        onExpand(
            model.clone()
                .expandAllNodes(expand)
                .serializeList('expanded'),
        );
    }, [model, onExpand]);

    const handleExpandAll = useCallback(() => {
        expandAllNodes();
    }, [expandAllNodes]);

    const handleCollapseAll = useCallback(() => {
        expandAllNodes(false);
    }, [expandAllNodes]);

    function createContextMenuHandler(node) {
        return (event) => {
            onContextMenu(event, node);
        };
    }

    function isEveryChildChecked(node) {
        return node.children.every(
            (child) => model.getNode(child.value).checkState === 1,
        );
    }

    function isSomeChildChecked(node) {
        return node.children.some(
            (child) => model.getNode(child.value).checkState > 0,
        );
    }

    function determineShallowCheckState(node) {
        const flatNode = model.getNode(node.value);

        if (flatNode.isLeaf || noCascade || node.children.length === 0) {
            // Note that an empty parent node tracks its own state
            return flatNode.checked ? 1 : 0;
        }

        if (isEveryChildChecked(node)) {
            return 1;
        }

        if (isSomeChildChecked(node)) {
            return 2;
        }

        return 0;
    }

    function renderTreeNodes(treeNodes, parent = {}) {
        const renderedNodes = treeNodes.map((node) => {
            const key = node.value;
            const flatNode = model.getNode(node.value);
            const children = flatNode.isParent ? renderTreeNodes(node.children, node) : null;

            // Determine the check state after all children check states have been determined
            // This is done during rendering as to avoid an additional loop during the
            // deserialization of the `checked` property
            flatNode.checkState = determineShallowCheckState(node);

            // Show checkbox only if this is a leaf node or showCheckbox is true
            const showCheckbox = onlyLeafCheckboxes ? flatNode.isLeaf : flatNode.showCheckbox;

            // Render only if parent is expanded or if there is no root parent
            const parentExpanded = parent.value !== undefined ? (
                model.getNode(parent.value).expanded
            ) : true;

            if (!parentExpanded) {
                return null;
            }

            // Prepare node information for context menu usage
            const nodeContext = {
                ...node,
                checked: flatNode.checkState,
                expanded: flatNode.expanded,
            };

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
                    onCheck={handleCheck}
                    onClick={onClick ? handleNodeClick : null}
                    onContextMenu={onContextMenu ? createContextMenuHandler(nodeContext) : null}
                    onExpand={handleExpand}
                >
                    {children}
                </TreeNode>
            );
        });

        return (
            <ol>
                {renderedNodes}
            </ol>
        );
    }

    const mergedLang = combineMemoized(lang, defaultLang);
    const mergedIcons = combineMemoized(icons, defaultIcons);
    const treeNodes = renderTreeNodes(nodes);

    const className = classNames({
        'react-checkbox-tree': true,
        'rct-disabled': disabled,
        [`rct-icons-${iconsClass}`]: true,
        'rct-native-display': nativeCheckboxes,
        'rct-direction-rtl': direction === 'rtl',
    });

    return (
        <LanguageContext.Provider value={mergedLang}>
            <IconContext.Provider value={mergedIcons}>
                <div className={className} id={id}>
                    {showExpandAll ? (
                        <GlobalActions
                            onCollapseAll={handleCollapseAll}
                            onExpandAll={handleExpandAll}
                        />
                    ) : null}
                    {name !== undefined ? (
                        <HiddenInput checked={checked} name={name} nameAsArray={nameAsArray} />
                    ) : null}
                    {treeNodes}
                </div>
            </IconContext.Provider>
        </LanguageContext.Provider>
    );
}

CheckboxTree.propTypes = propTypes;

export default CheckboxTree;
