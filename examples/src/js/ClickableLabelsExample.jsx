import React, { useState } from 'react';
import CheckboxTree, { CheckboxTreeProvider } from 'react-checkbox-tree';

import { fileSystem as nodes } from './data';

function ClickExample() {
    const [clicked, setClicked] = useState({});

    const onCheck = (changedNodeKey, newTree) => {
        const changedNode = newTree.getNode(changedNodeKey);
        console.log(`changed node = ${changedNode.label}`);
        console.log(newTree.getChecked());
    };

    const onExpand = (changedNodeKey, newTree) => {
        const changedNode = newTree.getNode(changedNodeKey);
        console.log(`changed node = ${changedNode.label} => expanded = ${changedNode.expanded}`);
        console.log(newTree.getExpanded());
    };

    const onClick = (nodeKey, treeModel) => {
        const node = treeModel.getNode(nodeKey);
        setClicked(node);
    };

    const notClickedText = '(none)';
    const displayText = clicked.value || notClickedText;

    return (
        <div className="clickable-labels">
            <CheckboxTreeProvider>
                <CheckboxTree
                    expandOnClick
                    nodes={nodes}
                    onCheck={onCheck}
                    onClick={onClick}
                    onExpand={onExpand}
                />
            </CheckboxTreeProvider>
            <div className="clickable-labels-info">
                <strong>Clicked Node</strong>
                {`: ${displayText}`}
            </div>
        </div>
    );
}

export default ClickExample;
