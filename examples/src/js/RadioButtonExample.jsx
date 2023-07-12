import React, { useState } from 'react';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';

import nodes from './data/mapLayerTree';

const initialTree = new TreeModel(nodes);

function RadioButtonExample() {
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
            tree={tree}
            onChange={onChange}
            onCheck={onCheck}
            onExpand={onExpand}
        />
    );
}

export default RadioButtonExample;
