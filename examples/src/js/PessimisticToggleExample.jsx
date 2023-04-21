import React from 'react';
import CheckboxTree, { CheckboxTreeProvider } from 'react-checkbox-tree';

import { fileSystem as initialTreeState } from './data';

function PessimisticToggleExample() {
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
                initialTreeState={initialTreeState}
                optimisticToggle={false}
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </CheckboxTreeProvider>
    );
}

export default PessimisticToggleExample;
