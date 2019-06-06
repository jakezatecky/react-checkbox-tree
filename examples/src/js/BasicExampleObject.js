import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const initialNodes = {
    label: 'Root',
    value: '*root*',
    expanded: true,
    children: [
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
            label: 'RadioTest',
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
                            label: 'radio2',
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
                            label: 'radio3',
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
    ],
};

class BasicExampleObject extends React.Component {
    state = {
        nodes: initialNodes,
    };

    onCheck = (node, nodes, checkedArray) => {
        this.setState({ nodes });
        // console.log(checkedArray);
    }

    onExpand = (node, nodes) => {
        this.setState({ nodes });
    }

    render() {
        const { nodes } = this.state;

        return (
            <CheckboxTree
                style={{ flex: '1' }}
                checkModel="all"
                iconsClass="fa5"
                nodes={nodes}
                useCheckedArray
                onCheck={this.onCheck}
                onExpand={this.onExpand}
            />
        );
    }
}

export default BasicExampleObject;
