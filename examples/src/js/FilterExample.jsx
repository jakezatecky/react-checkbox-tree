import React, { Component } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { fileSystem as nodes } from './common';

class FilterExample extends Component {
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
        filteredNodes: nodes,
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
        const { filterText } = this.state;

        // Reset nodes back to unfiltered state
        if (!filterText) {
            this.setState({ filteredNodes: nodes });

            return;
        }

        this.setState({
            filteredNodes: nodes.reduce(this.filterNodes, []),
        });
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
            let addNode = { ...node };
            // check if node is not in expanded list, add it
            if (children.length) {
                addNode.children = children;
            }
            filtered.push(addNode);
        }

        return filtered;
    }

    render() {
        const {
            checked,
            expanded,
            filterText,
            filteredNodes,
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
                    nodes={filteredNodes}
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                />
            </div>
        );
    }
}

export default FilterExample;
