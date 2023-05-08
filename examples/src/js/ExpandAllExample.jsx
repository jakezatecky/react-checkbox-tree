import React from 'react';
import CheckboxTree, { CheckboxTreeProvider } from 'react-checkbox-tree';

import { fileSystem as nodes } from './data';

function ExpandAllExample() {
    const onCheck = (changedNodeKey, newTree) => {
        const changedNode = newTree.getNode(changedNodeKey);
        console.log(`changed node = ${changedNode.label}`);
        console.log(newTree.getChecked());
    };

    const onExpand = (changedNodeKey, newTree) => {
        console.log(changedNodeKey);
        const changedNode = newTree.getNode(changedNodeKey);
        console.log(`changed node = ${changedNode.label} => expanded = ${changedNode.expanded}`);
        console.log(newTree.getExpanded());
    };

    return (
        <CheckboxTreeProvider>
            <CheckboxTree
                nodes={nodes}
                showExpandAll
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </CheckboxTreeProvider>
    );
}

export default ExpandAllExample;
