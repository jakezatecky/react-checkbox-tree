import React, { useState } from 'react';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';

import { fileSystem as nodes } from './data';

const initialTree = new TreeModel(nodes);

function DisabledExample() {
    const [tree, setTree] = useState(initialTree);

    const onChange = (newTree) => {
        setTree(newTree);
    };

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

    return (
        <CheckboxTree
            disabled
            tree={tree}
            onChange={onChange}
            onCheck={onCheck}
            onExpand={onExpand}
        />
    );
}

export default DisabledExample;
