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

class SearchingExample extends React.Component {
    constructor() {
        super();

        this.state = {
            checked: [],
            expanded: [],
            nodes:[]
        };

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onFilterMouseUp = this.onFilterMouseUp.bind(this);
    }

    componentDidMount() {
        this.setState({ 
            nodes: nodes,
            checked: [
                '/app/Http/Controllers/WelcomeController.js',
                '/app/Http/routes.js',
                '/public/assets/style.css',
                '/public/index.html',
                '/.gitignore'
            ],
            expanded: [
                '/app'
            ]
        });
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }

    onFilterMouseUp(e) {
        let filter = e.target.value.trim();
        if (!filter) {
            return this.setState({ nodes: nodes });
        }

        let filtered = this.filteredNodes(JSON.parse(JSON.stringify(nodes)), filter, this.defaultMatcher);
        return this.setState({ nodes: filtered });
    }

    defaultMatcher(node, filter) {
        return node.label.trim().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    }

    filteredNodes(nodes, filter, matcher) {
        let expanded = [];
        return nodes
            .filter(node => {
                if (matcher(node, filter)) {
                    expanded.push(node.value);
                    this.setState({ expanded });
                    if (node.children && node.children.length) {
                        let children = node.children.filter(child => (matcher(child, filter)));
                        if (children.length > 0) {
                            Object.assign(node, { children: children });
                            return true;
                        }
                    }
                    return true;
                } else {
                    if (node.children && node.children.length) {
                        let children = node.children.filter(child => (matcher(child, filter)));
                        if (children.length > 0) {
                            expanded.push(node.value);
                            this.setState({ expanded });
                            Object.assign(node, { children: children });
                            return true;
                        }
                        return false;
                    }
                    return false;
                }
            });
    };

    render() {
    
        return (
            <div>
                <div className="input-group">
                    <span className="input-group-addon" id="search-bar">
                        <i className="fa fa-search" aria-hidden="true"/></span>
                    <input type="text" className="form-control" placeholder="Search"
                           aria-describedby="search-bar" onKeyUp={this.onFilterMouseUp}/>
                </div>
                <CheckboxTree
                    checked={this.state.checked}
                    expanded={this.state.expanded}
                    nodes={this.state.nodes}
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                />
            </div>
        );
    }
}

export default SearchingExample;
