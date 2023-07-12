import React, { useState } from 'react';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';

import { fileSystemRadio as nodes } from './data';

const initialTree = new TreeModel(nodes);

function NativeCheckboxExample() {
    const [tree, setTree] = useState(initialTree);

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

    return (
        <CheckboxTree
            nativeCheckboxes
            tree={tree}
            onChange={onChange}
            onCheck={onCheck}
            onExpand={onExpand}
        />
    );
}

export default NativeCheckboxExample;
