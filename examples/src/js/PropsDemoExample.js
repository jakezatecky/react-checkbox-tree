import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const initialNodes = [
    {
        value: '/app',
        label: 'app',
        expanded: true,
        children: [
            {
                value: '/app/Http',
                label: 'Http',
                expanded: true,
                children: [
                    {
                        value: '/app/Http/Controllers',
                        label: 'Controllers',
                        expanded: true,
                        children: [{
                            value: '/app/Http/Controllers/WelcomeController.js',
                            label: 'WelcomeController.js',
                            checked: true,
                        }],
                    },
                    {
                        value: '/app/Http/routes.js',
                        label: 'routes.js',
                    },
                ],
            },
            {
                value: '/app/Providers',
                label: 'Providers',
                children: [{
                    value: '/app/Providers/EventServiceProvider.js',
                    label: 'EventServiceProvider.js',
                }],
            },
        ],
    },
    {
        value: '/radioGroup',
        label: 'RadioGroup Test',
        expanded: true,
        radioGroup: true,
        children: [
            {
                value: 'radio1',
                label: 'radio1',
            },
            {
                value: 'radio2',
                label: 'radio2',
                children: [
                    {
                        value: 'radio2-1',
                        label: 'radio2-1',
                        expanded: true,
                        children: [
                            {
                                value: 'radio2-1-1',
                                label: 'radio2-1-1',
                            },
                            {
                                value: 'radio2-1-2',
                                label: 'radio2-1-2',
                            },
                            {
                                value: 'radio2-1-3',
                                label: 'radio2-1-3',
                            },
                        ],
                    },
                    {
                        value: 'radio2-2',
                        label: 'radio2-2',
                    },
                    {
                        value: 'radio2-3',
                        label: 'radio2-3',
                    },
                ],
            },
            {
                value: 'radio3',
                label: 'radio3',
                radioGroup: true,
                children: [
                    {
                        value: 'radio3-1',
                        label: 'radio3-1',
                    },
                    {
                        value: 'radio3-2',
                        label: 'radio3-2',
                    },
                    {
                        value: 'radio3-3',
                        label: 'radio3-3',
                    },
                ],
            },
        ],
    },
    {
        value: '/config',
        label: 'config',
        disabled: true,
        children: [
            {
                value: '/config/app.js',
                label: 'app.js',
            },
            {
                value: '/config/database.js',
                label: 'database.js',
            },
        ],
    },
    {
        value: '/public',
        label: 'public',
        children: [
            {
                value: '/public/test.html',
                label: 'test.html',
            },
            {
                value: '/public/assets/',
                label: 'assets',
                children: [{
                    value: '/public/assets/style.css',
                    label: 'style.css',
                }],
            },
            {
                value: '/public/index.html',
                label: 'index.html',
            },
        ],
    },
    {
        value: '/.env',
        label: '.env',
    },
    {
        value: '/.gitignore',
        label: '.gitignore',
    },
    {
        value: '/README.md',
        label: 'README.md',
    },
];

const initialParams = [
    {
        label: 'checkModel',
        value: 'checkModel',
        radioGroup: true,
        checked: true,
        default: true,
        expanded: true,
        children: [
            {
                label: 'all',
                value: 'all',
                checked: true,
                default: true,
            },
            {
                label: 'leaf',
                value: 'leaf',
                checked: false,
                default: false,
            },
        ],
    },
    {
        label: 'disabled',
        value: 'disabled',
        checked: false,
        default: false,
    },
    {
        label: 'expandDisabled',
        value: 'expandDisabled',
        checked: false,
        default: false,
    },
    {
        label: 'expandOnClick',
        value: 'expandOnClick',
        checked: false,
        default: false,
    },
    {
        label: 'iconsClass',
        value: 'iconsClass',
        radioGroup: true,
        checked: true,
        default: true,
        expanded: true,
        children: [
            {
                label: 'fa4',
                value: 'fa4',
                checked: false,
                default: false,
            },
            {
                label: 'fa5',
                value: 'fa5',
                checked: true,
                default: true,
            },
        ],
    },
    {
        label: 'name',
        value: 'name',
        radioGroup: true,
        checked: true,
        default: true,
        expanded: true,
        children: [
            {
                label: 'none',
                value: '',
                checked: true,
                default: true,
            },
            {
                label: '"HiddenInput"',
                value: 'HiddenInput',
                checked: false,
                default: false,
            },
        ],
    },
    {
        label: 'nameAsArray',
        value: 'nameAsArray',
        checked: false,
        default: false,
    },
    {
        label: 'nativeCheckboxes',
        value: 'nativeCheckboxes',
        checked: false,
        default: false,
    },
    {
        label: 'noCascade',
        value: 'noCascade',
        checked: false,
        default: false,
    },
    {
        label: 'onlyLeafCheckboxes',
        value: 'onlyLeafCheckboxes',
        checked: false,
        default: false,
    },
    {
        label: 'optimisticToggle',
        value: 'optimisticToggle',
        checked: true,
        default: true,
    },
    {
        label: 'showExpandAll',
        value: 'showExpandAll',
        checked: false,
        default: false,
    },
    {
        label: 'showNodeIcon',
        value: 'showNodeIcon',
        checked: true,
        default: true,
    },
    {
        label: 'shodeNodeTitle',
        value: 'shodeNodeTitle',
        checked: false,
        default: false,
    },
];

class PropsDemoExample extends React.Component {
    state = {
        clicked: {
            value: 'nothing yet',
        },
        nodes: initialNodes,
        checkboxParams: initialParams,
        checkedArray: [
            'not populated yet',
            'check something',
        ],
    };

    onCheck = (node, nodes, checkedArray) => {
        this.setState({ nodes, checkedArray });
    }


    onClick = (clicked) => {
        // console.log(`clicked = ${clicked.value}`);
        this.setState({ clicked });
    }

    onExpand = (node, nodes) => {
        this.setState({ nodes });
    }

    onParameterChange = (param, params) => {
        this.setState({ checkboxParams: params });
    }

    getParams = () => {
        const { checkboxParams } = this.state;
        const params = {};
        checkboxParams.forEach((param) => {
            if (!param.radioGroup) {
                params[param.value] = param.checked || false;
            } else if (param.checked) {
                param.children.forEach((child) => {
                    if (child.checked) {
                        params[param.value] = child.value;
                    }
                });
            }
        });
        return params;
    }

    restoreDefaultParams = () => {
        const { checkboxParams } = this.state;
        const newParams = [];
        checkboxParams.forEach((param) => {
            const newParam = { ...param };
            newParam.checked = param.default || false;
            if (param.radioGroup) {
                const newChildren = param.children.map((child) => {
                    const newChild = { ...child };
                    newChild.checked = newChild.default || false;
                    return newChild;
                });
                newParam.children = newChildren;
            }
            newParams.push(newParam);
        });
        this.setState({ checkboxParams: newParams });
    }

    render() {
        const {
            checkboxParams,
            clicked,
            nodes,
            checkedArray,
        } = this.state;

        const style3 = {
            width: '30%',
            margin: '5px',
            border: '1px solid green',
            padding: '5px 0px 5px 5px',
        };

        const params = this.getParams();

        // to test "expandOnClick"
        let clickHandler;
        if (params.expandOnClick) {
            clickHandler = this.onClick;
        }

        const checkedItems = checkedArray.map(item => (
            <span
                key={item}
                style={{ fontSize: ' 12px' }}
            >
                {item}
                ,
                <br />
            </span>
        ));

        return (
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <CheckboxTree
                        style={{ flex: '1' }}
                        {...params}
                        nodes={nodes}
                        onCheck={this.onCheck}
                        onClick={clickHandler}
                        onExpand={this.onExpand}
                    />
                </div>
                <div style={style3}>
                    <p>
                        Clicked:&nbsp;
                        {clicked.value}
                    </p>
                    <p>
                    checked = [
                        <br />
                        {checkedItems}
                    ]
                    </p>
                </div>
                <div style={style3}>
                    <p>
                        CheckboxTree props
                    </p>
                    <CheckboxTree
                        style={{ flex: '1', paddingBottom: '5px' }}
                        checkModel="all"
                        iconsClass="fa5"
                        nodes={checkboxParams}
                        onCheck={this.onParameterChange}
                        onExpand={() => {}}
                    />
                    <button
                        type="button"
                        style={{ marginTop: '15px' }}
                        onClick={this.restoreDefaultParams}
                    >
                        reset defaults
                    </button>
                </div>
            </div>
        );
    }
}

export default PropsDemoExample;
