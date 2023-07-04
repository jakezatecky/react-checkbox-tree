import React, { useState } from 'react';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';

function makeLargeDataSet() {
    const parents = [];

    for (let i = 0; i < 100; i += 1) {
        const children = [];

        for (let j = 0; j < 200; j += 1) {
            children.push({
                value: `node-0-${i}-${j}`,
                label: `Node 0-${i}-${j}`,
            });
        }

        parents.push({
            value: `node-0-${i}`,
            label: `Node 0-${i}`,
            children,
        });
    }

    return [{
        value: 'node-0',
        label: 'Node 0',
        children: parents,
    }];
}

const nodes = makeLargeDataSet();
const initialTree = new TreeModel(nodes);

function LargeDataExample() {
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

export default LargeDataExample;
