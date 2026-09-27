import {
    useState,
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { fileSystem as nodes } from './common.js';

function getNodeValues(nodeList) {
    return nodeList.flatMap((node) => [node.value, ...getNodeValues(node.children || [])]);
}

// The tree only reports on the nodes it is given, so keep any values hidden by the filter
function mergeHiddenValues(previousValues, visibleValues, newValues) {
    return [
        ...previousValues.filter((value) => !visibleValues.has(value)),
        ...newValues,
    ];
}

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

    const visibleValues = useMemo(() => new Set(getNodeValues(filteredNodes)), [filteredNodes]);

    const onCheck = useCallback((checkedValues) => {
        setChecked((prevChecked) => mergeHiddenValues(prevChecked, visibleValues, checkedValues));
    }, [visibleValues]);

    const onExpand = useCallback((expandedValues) => {
        setExpanded((prevExpanded) => (
            mergeHiddenValues(prevExpanded, visibleValues, expandedValues)
        ));
    }, [visibleValues]);

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
