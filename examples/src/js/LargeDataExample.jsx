import React from 'react';
import CheckboxTree, { CheckboxTreeProvider } from 'react-checkbox-tree';

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

function LargeDataExample() {
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
        <CheckboxTreeProvider>
            <CheckboxTree
                nodes={nodes}
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </CheckboxTreeProvider>
    );
}

export default LargeDataExample;
