import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';

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

function CustomIconsExamples() {
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState(['Documents']);

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

export default CustomIconsExamples;
