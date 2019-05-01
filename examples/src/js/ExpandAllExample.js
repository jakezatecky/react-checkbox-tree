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
                children: [
                    {
                        value: '/app/Http/Controllers',
                        label: 'Controllers',
                        children: [{
                            value: '/app/Http/Controllers/WelcomeController.js',
                            label: 'WelcomeController.js',
                            checked: true,
                        }],
                    },
                    {
                        value: '/app/Http/routes.js',
                        label: 'routes.js',
                        checked: true,
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
                    checked: true,
                }],
            },
            {
                value: '/public/index.html',
                label: 'index.html',
                checked: true,
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
        checked: true,
    },
    {
        value: '/README.md',
        label: 'README.md',
    },
];

class ExpandAllExample extends React.Component {
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
            <div className="expand-all-container">
                <CheckboxTree
                    iconsClass="fa5"
                    nodes={nodes}
                    showExpandAll
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                />
            </div>
        );
    }
}

export default ExpandAllExample;
