import React, { useState } from 'react';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';

const nodes = [
    {
        value: 'Documents',
        label: 'Documents',
        children: [
            {
                value: 'Employee Evaluations.zip',
                label: 'Employee Evaluations.zip',
                icon: <i className="far fa-file-archive" />,
            },
            {
                value: 'Expense Report.pdf',
                label: 'Expense Report.pdf',
                icon: <i className="far fa-file-pdf" />,
            },
            {
                value: 'notes.txt',
                label: 'notes.txt',
                icon: <i className="far fa-file-alt" />,
            },
        ],
    },
    {
        value: 'Photos',
        label: 'Photos',
        children: [
            {
                value: 'nyan-cat.gif',
                label: 'nyan-cat.gif',
                icon: <i className="far fa-file-image" />,
            },
            {
                value: 'SpaceX Falcon9 liftoff.jpg',
                label: 'SpaceX Falcon9 liftoff.jpg',
                icon: <i className="far fa-file-image" />,
            },
        ],
    },
];

const initialTree = new TreeModel(nodes);

function CustomIconsExample() {
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

export default CustomIconsExample;
