import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const nodes = [
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
                    value: '/app/Http/Providers/EventServiceProvider.js',
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

class FilterExample extends React.Component {
    constructor() {
        super();

        this.state = {
            checked: [
                '/app/Http/Controllers/WelcomeController.js',
                '/app/Http/routes.js',
                '/public/assets/style.css',
                '/public/index.html',
                '/.gitignore',
            ],
            expanded: [
                '/app',
            ],
            filterText: '',
            nodes: nodes,
            nodesFiltered: nodes
        };

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.setFilterText = this.setFilterText.bind(this);
        this.filterTree = this.filterTree.bind(this);
        this.nodeFilter = this.nodeFilter.bind(this);
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }
    
    nodeFilter (node: Node) {
        const children = (node.children || []).map(this.nodeFilter).filter(c => c !== null);

        return node.label.indexOf(this.state.filterText) !== -1 || children.length ? {...node, children: children } : null;
    }

    filterTree () {
        if (!this.state.filterText) {
            return this.setState({
                nodesFiltered: this.state.nodes
            });
        }

        const nodesFiltered = this.state.nodes.map(this.nodeFilter).filter(n => n !== null);

        this.setState({
            nodesFiltered: nodesFiltered
        });
    }
    
    setFilterText(e) {
        this.setState({filterText: e.target.value}, this.filterTree);
    }

    render() {
        const { checked, expanded } = this.state;

        return (
            <div>
                <input type='text' placeholder='Search' value={ this.state.filterText } onChange={ this.setFilterText } />
                <CheckboxTree
                    checked={checked}
                    expanded={expanded}
                    nodes={this.state.nodesFiltered}
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                />
            </div>
        );
    }
}

export default FilterExample;
