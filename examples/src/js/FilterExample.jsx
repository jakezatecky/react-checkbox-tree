import { useState, useCallback, useEffect } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { fileSystem as nodes } from './common.js';

function FilterExample() {
    const [checked, setChecked] = useState([
        '/app/Http/Controllers/WelcomeController.js',
        '/app/Http/routes.js',
        '/public/assets/style.css',
        '/public/index.html',
        '/.gitignore',
    ]);
    const [expanded, setExpanded] = useState(['/app']);
    const [filterText, setFilterText] = useState('');
    const [filteredNodes, setFilteredNodes] = useState(nodes);

    const onCheck = useCallback((checkedValues) => {
        setChecked(checkedValues);
    }, []);

    const onExpand = useCallback((expandedValues) => {
        setExpanded(expandedValues);
    }, []);

    const onFilterChange = useCallback((e) => {
        setFilterText(e.target.value);
    }, []);

    useEffect(() => {
        const nodeMatchesSearchString = ({ label }) => (
            label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1
        );

        const filterNodes = (filtered, node) => {
            if (nodeMatchesSearchString(node)) {
                // Node's label matches the search string
                filtered.push(node);
            } else {
                // Find if any children match the search string or have descendants who do
                const filteredChildren = (node.children || []).reduce(filterNodes, []);

                // If so, render these children
                if (filteredChildren.length > 0) {
                    filtered.push({ ...node, children: filteredChildren });
                }
            }

            return filtered;
        };

        // Reset nodes back to unfiltered state
        if (!filterText) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFilteredNodes(nodes);

            return;
        }

        setFilteredNodes(nodes.reduce(filterNodes, []));
    }, [filterText]);

    return (
        <div className="filter-container">
            <input
                className="filter-text"
                placeholder="Search..."
                type="text"
                value={filterText}
                onChange={onFilterChange}
            />
            <CheckboxTree
                checked={checked}
                expanded={expanded}
                nodes={filteredNodes}
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </div>
    );
}

export default FilterExample;
