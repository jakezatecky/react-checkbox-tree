import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const nodes = [
    {
        value: 'favorite-empires',
        label: 'Favorite Empires',
        children: [
            {
                value: 'classical-era',
                label: 'Classical Era',
                children: [
                    {
                        value: 'persian',
                        label: 'First Persian Empire',
                    },
                    {
                        value: 'qin',
                        label: 'Qin Dynasty',
                    },
                    {
                        value: 'spqr',
                        label: 'Roman Empire',
                    },
                ],
            },
            {
                value: 'medieval-era',
                label: 'Medieval Era',
                children: [
                    {
                        value: 'abbasid',
                        label: 'Abbasid Caliphate',
                    },
                    {
                        value: 'byzantine',
                        label: 'Byzantine Empire',
                    },
                    {
                        value: 'holy-roman',
                        label: 'Holy Roman Empire',
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
                    },
                    {
                        value: 'qing',
                        label: 'Qing Dynasty',
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
        checked: [
            'persian',
            'spqr',
            'byzantine',
            'holy-roman',
            'inca',
        ],
        expanded: [
            'favorite-empires',
            'classical-era',
            'medieval-era',
        ],
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }

    render() {
        const { checked, expanded } = this.state;

        return (
            <CheckboxTree
                checked={checked}
                expanded={expanded}
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
