import React from 'react';
import CheckboxTree, { CheckboxTreeProvider } from 'react-checkbox-tree';

import initialTreeState from './data/mapLayerTree';

function RadioButtonExample() {
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
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </CheckboxTreeProvider>
    );
}

export default RadioButtonExample;
