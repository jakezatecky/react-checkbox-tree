import classNames from 'classnames';
// import isEqual from 'lodash/isEqual';
import memoize from 'lodash/memoize';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

// import CheckboxTreeError from './CheckboxTreeError';

import TreeModel from './models/TreeModel';

import GlobalActions from './components/GlobalActions';
import HiddenInput from './components/HiddenInput';
import TreeNode from './components/TreeNode';
import defaultLang from './lang/default';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';
// import listShape from './shapes/listShape';
import nodeShape from './shapes/nodeShape';
// import treeShape from './shapes/treeShape';
import { KEYS } from './constants';
import { IconContext, LanguageContext } from './contexts';
import { useCheckboxTree } from './CheckboxTreeContext';

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
    initialTreeState,
    checkKeys,
    expandOnClick,
    onCheck,
    onClick,
    onContextMenu,
    onExpand,
    onlyLeafCheckboxes,
    showNodeTitle,
    showNodeIcon,
    // for tree model
    checkModel,
    noCascade,
    optimisticToggle,
}) {
    const mergedLang = combineMemoized(lang, defaultLang);
    const mergedIcons = combineMemoized(icons, defaultIcons);

    // get the treeModel from CheckboxTreeProvider
    const { treeModel, setTreeModel } = useCheckboxTree();

    //--------------------------------------------------------------------------
    // insert the inital tree state into TreeModel
    useEffect(() => {
        // options are from props
        const options = {
            checkModel, disabled, noCascade, optimisticToggle, setTreeModel,
        };

        const newTreeModel = new TreeModel(initialTreeState, options);
        setTreeModel(newTreeModel);
    }, [initialTreeState]);

    // TODO: how to handle changed props?

    //--------------------------------------------------------------------------

    // there is no treeModel until first useEffect above is run
    if (!(treeModel instanceof TreeModel)) {
        return null;
    }

    //--------------------------------------------------------------------------
    // methods

    const onCheckHandler = (nodeKey) => {
        const newTreeModel = treeModel.toggleChecked(nodeKey);

        // TODO: should toggleChecked return false if no change??
        // probably...

        // toggleChecked returns original treeModel if the check is not
        // changed due to being disabled or being an already checked
        // radio node so we ignore the check change attempt
        if (newTreeModel !== treeModel) {
            setTreeModel(newTreeModel);
            onCheck(nodeKey, newTreeModel);
        }
    };

    const onCollapseAll = () => {
        const newTreeModel = treeModel.expandAllNodes(false);
        onExpand('', newTreeModel);
        setTreeModel(newTreeModel);
    };

    // TODO: this needs review
    const onContextMenuHandler = (node) => (event) => {
        onContextMenu(event, node);
    };

    const onExpandHandler = (nodeKey) => {
        const newTreeModel = treeModel.toggleExpanded(nodeKey);
        setTreeModel(newTreeModel);
        onExpand(nodeKey, newTreeModel);
    };

    const onExpandAll = () => {
        if (!expandDisabled) {
            const newTreeModel = treeModel.expandAllNodes(true);
            setTreeModel(newTreeModel);
            onExpand('', newTreeModel);
        }
    };

    const onNodeClick = (nodeKey) => {
        onClick(treeModel.getNode(nodeKey));
    };

    const renderTreeNodes = (childKeys) => {
        const treeNodes = childKeys.map((nodeKey) => {
            const node = treeModel.getNode(nodeKey);
            const parent = node.parentKey ? treeModel.getNode(node.parentKey) : null;

            // render only if not marked hidden by filter or
            // if parent is expanded or if there is no parent
            const parentExpanded = parent ? parent.expanded : true;
            if (node.isHiddenByFilter || !parentExpanded) {
                return null;
            }

            // render child nodes here after determining to render this node
            const children = node.isParent ? renderTreeNodes(node.childKeys) : null;

            // Show checkbox only if this is a leaf node or showCheckbox is true
            const showCheckbox = onlyLeafCheckboxes ? node.isLeaf : node.showCheckbox;

            // Prepare node information for context menu usage
            const nodeContext = {
                ...node,
                checked: node.checkState,
                expanded: node.expanded,
            };

            return (
                <TreeNode
                    key={node.value}
                    checkKeys={checkKeys}
                    disabled={disabled}
                    expandDisabled={expandDisabled}
                    expandOnClick={expandOnClick}
                    noCascade={noCascade}
                    node={node}
                    showCheckbox={showCheckbox}
                    showNodeIcon={showNodeIcon}
                    title={showNodeTitle ? node.title || node.label : node.title}
                    treeId={id}
                    onCheck={onCheckHandler}
                    onClick={onClick && onNodeClick}
                    onContextMenu={onContextMenuHandler(nodeContext)}
                    onExpand={onExpandHandler}
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

    const treeNodes = renderTreeNodes(treeModel.rootKeys);

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
                            checked={treeModel.getCheckedArray()}
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

CheckboxTree.propTypes = {
    initialTreeState: PropTypes.arrayOf(nodeShape).isRequired,

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

CheckboxTree.defaultProps = {
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
    onContextMenu: null,
    onExpand: () => {},
};
