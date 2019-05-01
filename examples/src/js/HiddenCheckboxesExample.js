import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const initialNodes = [
    {
        value: 'favorite-empires',
        label: 'Favorite Empires',
        expanded: true,
        children: [
            {
                value: 'classical-era',
                label: 'Classical Era',
                expanded: true,
                children: [
                    {
                        value: 'persian',
                        label: 'First Persian Empire',
                        checked: true,
                    },
                    {
                        value: 'qin',
                        label: 'Qin Dynasty',
                    },
                    {
                        value: 'spqr',
                        label: 'Roman Empire',
                        checked: true,
                    },
                ],
            },
            {
                value: 'medieval-era',
                label: 'Medieval Era',
                expanded: true,
                children: [
                    {
                        value: 'abbasid',
                        label: 'Abbasid Caliphate',
                    },
                    {
                        value: 'byzantine',
                        label: 'Byzantine Empire',
                        checked: true,
                    },
                    {
                        value: 'holy-roman',
                        label: 'Holy Roman Empire',
                        checked: true,
                    },
                    {
                        value: 'ming',
                        label: 'Ming Dynasty',
                    },
                    {
                        value: 'mongol',
                        label: 'Mongol Empire',
                    },
                ],
            },
            {
                value: 'modern-era',
                label: 'Modern Era',
                children: [
                    {
                        value: 'aztec',
                        label: 'Aztec Empire',
                    },
                    {
                        value: 'british',
                        label: 'British Empire',
                    },
                    {
                        value: 'inca',
                        label: 'Inca Empire',
                        checked: true,
                    },
                    {
                        value: 'qing',
                        label: 'Qing Dynasty',
                        showCheckbox: false,
                    },
                    {
                        value: 'russian',
                        label: 'Russian Empire',
                    },
                    {
                        value: 'spanish',
                        label: 'Spanish Empire',
                    },
                ],
            },
        ],
    },
];

class HiddenCheckboxesExample extends React.Component {
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
                iconsClass="fa5"
                nodes={nodes}
                onlyLeafCheckboxes
                onCheck={this.onCheck}
                onExpand={this.onExpand}
            />
        );
    }
}

export default HiddenCheckboxesExample;
