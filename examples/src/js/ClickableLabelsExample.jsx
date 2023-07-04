import React, { useState } from 'react';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';

import { fileSystem as nodes } from './data';

const initialTree = new TreeModel(nodes);

function ClickExample() {
    const [tree, setTree] = useState(initialTree);
    const [clicked, setClicked] = useState({});

    const onChange = (newTree) => {
        setTree(newTree);
    };

    const onCheck = (changedNode, newTree) => {
        console.log(`changed node = ${changedNode.label}`);
        console.log(newTree.getChecked());
    };

    const onExpand = (changedNode, newTree) => {
        console.log(`changed node = ${changedNode.label} => expanded = ${changedNode.expanded}`);
        console.log(newTree.getExpanded());
    };

    const onClick = (node, tree) => {
        setClicked(node);
    };

    const notClickedText = '(none)';
    const displayText = clicked.value || notClickedText;

    return (
        <div className="clickable-labels">
            <CheckboxTree
                expandOnClick
                tree={tree}
                onChange={onChange}
                onCheck={onCheck}
                onClick={onClick}
                onExpand={onExpand}
            />
            <div className="clickable-labels-info">
                <strong>Clicked Node</strong>
                {`: ${displayText}`}
            </div>
        </div>
    );
}

export default ClickExample;
