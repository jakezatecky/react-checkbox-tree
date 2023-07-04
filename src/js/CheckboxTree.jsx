import classNames from 'classnames';
// import isEqual from 'lodash/isEqual';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

// import CheckboxTreeError from './CheckboxTreeError';

import TreeModel from './models/TreeModel';

import GlobalActions from './components/GlobalActions';
import HiddenInput from './components/HiddenInput';
import TreeNode from './components/TreeNode';
import defaultLang from './lang/default';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
// import listShape from './shapes/listShape';
// import nodeShape from './shapes/nodeShape';
// import treeShape from './shapes/treeShape';
import { KEYS } from './constants';
import { IconContext, LanguageContext } from './contexts';

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
    radioOff: <span className="rct-icon rct-icon-radio-off" />,
    radioOn: <span className="rct-icon rct-icon-radio-on" />,
};

const propTypes = {
    tree: PropTypes.instanceOf(TreeModel).isRequired,
    onChange: PropTypes.func.isRequired,

    LabelComponent: PropTypes.func,
    LeafLabelComponent: PropTypes.func,
    ParentLabelComponent: PropTypes.func,
    checkKeys: PropTypes.arrayOf(PropTypes.string),
    checkModel: PropTypes.oneOf(['leaf', 'all']),
    direction: PropTypes.string,
    disabled: PropTypes.bool,
    expandDisabled: PropTypes.bool,
    expandOnClick: PropTypes.bool,
    icons: iconsShape,
    iconsClass: PropTypes.string,
    id: PropTypes.string,
    lang: languageShape,
    name: PropTypes.string,
    nameAsArray: PropTypes.bool,
    nativeCheckboxes: PropTypes.bool,
    noCascadeChecks: PropTypes.bool,
    noCascadeDisabled: PropTypes.bool,
    onlyLeafCheckboxes: PropTypes.bool,
    optimisticToggle: PropTypes.bool,
    showExpandAll: PropTypes.bool,
    showNodeIcon: PropTypes.bool,
    showNodeTitle: PropTypes.bool,
    onCheck: PropTypes.func,
    onClick: PropTypes.func,
    onContextMenu: PropTypes.func,
    onExpand: PropTypes.func,
    onLabelChange: PropTypes.func,
    onLeafLabelChange: PropTypes.func,
    onParentLabelChange: PropTypes.func,
};

const defaultProps = {
    checkKeys: [KEYS.SPACEBAR, KEYS.ENTER],
    checkModel: 'leaf',
    direction: 'ltr',
    disabled: false,
    expandDisabled: false,
    expandOnClick: false,
    icons: defaultIcons,
    iconsClass: 'fa5',
    id: null,
    lang: defaultLang,
    LabelComponent: null,
    LeafLabelComponent: null,
    ParentLabelComponent: null,
    name: undefined,
    nameAsArray: false,
    nativeCheckboxes: false,
    noCascadeChecks: false,
    noCascadeDisabled: false,
    onlyLeafCheckboxes: false,
    optimisticToggle: true,
    showExpandAll: false,
    showNodeIcon: true,
    showNodeTitle: false,
    onCheck: () => {},
    onClick: null,
    onContextMenu: null,
    onExpand: () => {},
    onLabelChange: null,
    onLeafLabelChange: null,
    onParentLabelChange: null,
};

export default function CheckboxTree({
    direction,
    disabled,
    expandDisabled,
    icons,
    iconsClass,
    id,
    lang,
    name,
    nameAsArray,
    nativeCheckboxes,
    showExpandAll,
    tree,
    checkKeys,
    expandOnClick,
    onChange,
    onCheck,
    onClick,
    onContextMenu,
    onExpand,
    onlyLeafCheckboxes,
    showNodeTitle,
    showNodeIcon,
    // for tree model
    checkModel,
    LabelComponent,
    LeafLabelComponent,
    ParentLabelComponent,
    noCascadeChecks,
    noCascadeDisabled,
    optimisticToggle,
    onLabelChange,
    onLeafLabelChange,
    onParentLabelChange,
}) {
    const mergedLang = combineMemoized(lang, defaultLang);
    const mergedIcons = combineMemoized(icons, defaultIcons);

    // save nodes prop to check for new value in useEffect
    // const [prevNodes, setPreviousNodes] = useState();

    // bundle props passed to TreeModel
    // TODO: how should these be added to TreeModel??????
    const treeOptions = useMemo(() => ({
        checkModel,
        noCascadeChecks,
        noCascadeDisabled,
        optimisticToggle,
    }), [
        checkModel,
        noCascadeChecks,
        noCascadeDisabled,
        optimisticToggle,
    ]);

    // insert or update options in tree
    tree.updateOptions(treeOptions);

    //--------------------------------------------------------------------------

    // TODO: this may not be needed as TreeModel is required
    // should throw error?
    if (!(tree instanceof TreeModel)) {
        return null;
    }

    //--------------------------------------------------------------------------
    // methods

    // TODO: is this needed?
    /*
    const onChangeHandler = () => {

    };
    */

    const onCheckHandler = (nodeKey) => {
        const newTree = tree.toggleChecked(nodeKey);
        const checkedNode = newTree.getNode(nodeKey);

        // TODO: should toggleChecked return false if no change??
        // probably...

        // toggleChecked returns original tree if the check is not
        // changed due to being disabled or being an already checked
        // radio node so we ignore the check change attempt
        if (newTree !== tree) {
            onCheck(checkedNode, newTree);
            onChange(newTree);
        }
    };

    const onCollapseAll = () => {
        const newTree = tree.expandAllNodes(false);
        // onExpand('', newTree);
        onChange(newTree);
    };

    const onContextMenuHandler = (node) => (event) => {
        if (typeof onContextMenu === 'function') {
            onContextMenu(event, node);
        }
    };

    const onExpandHandler = (nodeKey) => {
        const newTree = tree.toggleExpanded(nodeKey);
        const expandedNode = newTree.getNode(nodeKey);
        onExpand(expandedNode, newTree);
        onChange(newTree);
    };

    const onExpandAll = () => {
        if (!expandDisabled) {
            const newTree = tree.expandAllNodes(true);
            // onExpand('', newTree);
            onChange(newTree);
        }
    };

    const onNodeClick = (nodeKey) => {
        const clickedNode = tree.getNode(nodeKey);
        onClick(clickedNode, tree);
    };

    const renderTreeNodes = (childKeys, ancestorDisabled = false) => {
        const treeNodes = childKeys.map((nodeKey) => {
            const node = tree.getNode(nodeKey);

            const parent = node.parentKey ? tree.getNode(node.parentKey) : null;

            // render only if not marked hidden by filter or
            // if parent is expanded or if there is no parent
            const parentExpanded = parent ? parent.expanded : true;
            if (node.isHiddenByFilter || !parentExpanded) {
                return null;
            }

            // render child nodes here after determining to render this node
            let children = null;
            if (node.isParent) {
                // determine if child nodes should be disabled
                const disabledByAncestor = !noCascadeDisabled && (
                    ancestorDisabled || node.disabled ||
                    (node.isRadioGroup && node.checkState === 0)
                );

                children = renderTreeNodes(node.childKeys, disabledByAncestor);
            }

            // Show checkbox only if this is a leaf node or showCheckbox is true
            const showCheckbox = onlyLeafCheckboxes ? node.isLeaf : node.showCheckbox;

            // Prepare node information for context menu usage
            const nodeContext = {
                ...node,
                checked: (node.checkState > 0),
                expanded: node.expanded,
            };

            return (
                <TreeNode
                    key={node.value}
                    LabelComponent={LabelComponent}
                    LeafLabelComponent={LeafLabelComponent}
                    ParentLabelComponent={ParentLabelComponent}
                    checkKeys={checkKeys}
                    disabled={disabled || ancestorDisabled || node.disabled}
                    expandDisabled={expandDisabled}
                    expandOnClick={expandOnClick}
                    noCascadeChecks={noCascadeChecks}
                    node={node}
                    showCheckbox={showCheckbox}
                    showNodeIcon={showNodeIcon}
                    showNodeTitle={showNodeTitle}
                    treeId={id}
                    onCheck={onCheckHandler}
                    onClick={onClick && onNodeClick}
                    onContextMenu={onContextMenuHandler(nodeContext)}
                    onExpand={onExpandHandler}
                    onLabelChange={onLabelChange}
                    onLeafLabelChange={onLeafLabelChange}
                    onParentLabelChange={onParentLabelChange}
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
    };

    //--------------------------------------------------------------------------
    // render CheckboxTree
    const treeNodes = renderTreeNodes(tree.rootKeys);

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
                            onCollapseAll={onCollapseAll}
                            onExpandAll={onExpandAll}
                        />
                    ) : null}

                    {name !== undefined ? (
                        <HiddenInput
                            checked={tree.getChecked()}
                            name={name}
                            nameAsArray={nameAsArray}
                        />
                    ) : null}

                    {treeNodes}
                </div>
            </IconContext.Provider>
        </LanguageContext.Provider>
    );
}

CheckboxTree.propTypes = propTypes;
CheckboxTree.defaultProps = defaultProps;
