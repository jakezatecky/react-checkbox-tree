import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const nodes = [
    {
        value: 'base_layers',
        label: 'base layers',
        isRadioGroup: true,
        children: [
            {
                value: 'default_base_layer',
                label: 'default',
            },
            {
                value: 'streets',
                label: 'streets',
            },
            {
                value: 'satellite',
                label: 'satellite',
            },
            {
                value: 'orthophotos',
                label: 'orthophotos',
                isRadioGroup: true,
                children: [
                    {
                        value: 'b&w',
                        label: 'black & white',
                        isRadioGroup: true,
                        children: [
                            {
                                value: 'b&w-2005',
                                label: '2005',
                            },
                            {
                                value: 'b&w-2010',
                                label: '2010',
                            },
                            {
                                value: 'b&w-2015',
                                label: '2015',
                            },
                            {
                                value: 'b&w-2018',
                                label: '2018',
                            },
                        ],
                    },
                    {
                        value: 'color',
                        label: 'color',
                        isRadioGroup: true,
                        children: [
                            {
                                value: 'color-2005',
                                label: '2005',
                            },
                            {
                                value: 'color-2010',
                                label: '2010',
                            },
                            {
                                value: 'color-2015',
                                label: '2015',
                            },
                            {
                                value: 'color-2018',
                                label: '2018',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        value: 'overlays',
        label: 'overlays',
        children: [
            {
                value: 'parcels',
                label: 'parcels',
                children: [
                    {
                        value: 'parcels/outline',
                        label: 'outline',
                    },
                    {
                        value: 'parcels/special',
                        label: 'special',
                        isRadioGroup: true,
                        children: [
                            {
                                value: 'parcels/special/farm_use',
                                label: 'farm use',
                                children: [
                                    {
                                        value: 'type',
                                        label: 'type',
                                        children: [
                                            {
                                                value: 'livestock',
                                                label: 'livestock',
                                            },
                                            {
                                                value: 'crops',
                                                label: 'crops',
                                            },
                                        ]
                                    },
                                    {
                                        value: 'size',
                                        label: 'size',
                                        children: [
                                            {
                                                value: 'size/small',
                                                label: 'small',
                                            },
                                            {
                                                value: 'size/medium',
                                                label: 'medium',
                                            },
                                            {
                                                value: 'size/large',
                                                label: 'large',
                                            },
                                        ]
                                    },
                                ]
                            },
                            {
                                value: 'parcels/special/permit',
                                label: 'permit',
                            },
                            {
                                value: 'parcels/special/zoning',
                                label: 'zoning',
                            },
                        ]
                    },
                    {
                        value: 'parcels/text',
                        label: 'text',
                        children: [
                            {
                                value: 'pin_number',
                                label: 'pin number',
                            },
                            {
                                value: 'acreage',
                                label: 'acreage',
                            },
                            {
                                value: 'lotlines',
                                label: 'lotlines',
                            },
                        ]
                    },
                ]
            },
            {
                value: 'land_features',
                label: 'land features',
                children: [
                    {
                        value: 'contours',
                        label: 'contours',
                    },
                    {
                        value: 'flood_zones',
                        label: 'flood_zones',
                    },
                    {
                        value: 'land_cover',
                        label: 'land cover',
                    },
                    {
                        value: 'water_features',
                        label: 'water features',
                    },
                ]
            },
            {
                value: 'schools',
                label: 'schools',
                children: [
                    {
                        value: 'elementary',
                        label: 'elementary',
                    },
                    {
                        value: 'middle',
                        label: 'middle',
                    },
                    {
                        value: 'high',
                        label: 'high',
                    },
                ]
            },
        ],
    },
];

class RadioExample extends React.Component {
    constructor() {
        super();

        this.state = {
            checked: [
                'base_layers',
                'default_base_layer',
                'color',
                'parcels/outline',
                'parcels/special',
                'crops',
                'size/small',
                'size/medium',
                'size/large',
                'middle',
                'high',
                'pin_number',
                'acreage',
                'lotlines',
            ],
            expanded: [
                'base_layers',
                'orthophotos',
                'b&w',
                'color',
                'overlays',
                'parcels',
                'parcels/special',
                'parcels/special/farm_use',
                'parcels/special/permit',
                'type',
                'size',
            ],
        };

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
                nodes={nodes}
                onCheck={this.onCheck}
                onExpand={this.onExpand}
            />
        );
    }
}

export default RadioExample;
