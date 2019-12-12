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
    state = {
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
        nodesFiltered: nodes,
        nodes,
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.filterTree = this.filterTree.bind(this);
        this.filterNodes = this.filterNodes.bind(this);
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }

    onFilterChange(e) {
        this.setState({ filterText: e.target.value }, this.filterTree);
    }

    filterTree() {
        // Reset nodes back to unfiltered state
        if (!this.state.filterText) {
            this.setState((prevState) => ({
                nodesFiltered: prevState.nodes,
            }));

            return;
        }

        const nodesFiltered = (prevState) => (
            { nodesFiltered: prevState.nodes.reduce(this.filterNodes, []) }
        );

        this.setState(nodesFiltered);
    }

    filterNodes(filtered, node) {
        const { filterText } = this.state;
        const children = (node.children || []).reduce(this.filterNodes, []);

        if (
            // Node's label matches the search string
            node.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1 ||
            // Or a children has a matching node
            children.length
        ) {
            filtered.push({ ...node, children });
        }

        return filtered;
    }

    render() {
        const {
            checked,
            expanded,
            filterText,
            nodesFiltered,
        } = this.state;

        return (
            <div className="filter-container">
                <input
                    className="filter-text"
                    placeholder="Search..."
                    type="text"
                    value={filterText}
                    onChange={this.onFilterChange}
                />
                <CheckboxTree
                    checked={checked}
                    expanded={expanded}
                    iconsClass="fa5"
                    nodes={nodesFiltered}
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                />
            </div>
        );
    }
}

export default FilterExample;
