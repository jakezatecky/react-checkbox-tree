import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const initialNodes = [
    {
        value: '/app',
        label: 'app',
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
];

/* eslint-disable react/jsx-one-expression-per-line */
class ClickExample extends React.Component {
    state = {
        nodes: initialNodes,
        clicked: {},
    };

    onCheck = (node, nodes) => {
        this.setState({ nodes });
    }

    onClick = (clicked) => {
        this.setState({ clicked });
    }

    onExpand = (node, nodes) => {
        this.setState({ nodes });
    }

    render() {
        const { nodes, clicked } = this.state;
        const notClickedText = '(none)';

        return (
            <div className="clickable-labels">
                <CheckboxTree
                    iconsClass="fa5"
                    nodes={nodes}
                    expandOnClick
                    onCheck={this.onCheck}
                    onClick={this.onClick}
                    onExpand={this.onExpand}
                />
                <div className="clickable-labels-info">
                    <strong>Clicked Node</strong>: {clicked.value || notClickedText}
                </div>
            </div>
        );
    }
}

export default ClickExample;
