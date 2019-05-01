import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const initialNodes = [
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

class CustomIconsExamples extends React.Component {
    state = {
        nodes: initialNodes,
    };


    onCheck = (node, nodes) => {
        this.setState({ nodes });
    }

    onExpand = (node, nodes) => {
        this.setState({ nodes });
    }

    render() {
        const { nodes } = this.state;

        return (
            <CheckboxTree
                id="CustomIconsExamples-customID"
                iconsClass="fa5"
                nodes={nodes}
                onCheck={this.onCheck}
                onExpand={this.onExpand}
            />
        );
    }
}

export default CustomIconsExamples;
