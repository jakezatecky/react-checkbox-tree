import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';

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
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);

    const onCheck = (value) => {
        setChecked(value);
    };

    const onExpand = (value) => {
        setExpanded(value);
    };

    return (
        <CheckboxTree
            checked={checked}
            expanded={expanded}
            nodes={nodes}
            onCheck={onCheck}
            onExpand={onExpand}
        />
    );
}

export default LargeDataExample;
