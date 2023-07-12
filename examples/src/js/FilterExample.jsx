import React, { useEffect, useState } from 'react';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';

import { fileSystem as nodes } from './data';

const initialTree = new TreeModel(nodes);

function FilterExample() {
    const [tree, setTree] = useState(initialTree);
    const [filterText, setFilterText] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [timeoutId, setTimeoutId] = useState();

    const onChange = (newTree) => {
        setTree(newTree);
    };

    const onCheck = (changedNode, newTree) => {
        console.log(`changed node = ${changedNode.label}`);
        console.log(newTree.getChecked());
    };

    const onExpand = (changedNode, newTree) => {
        console.log(`changed node = ${changedNode.label} => expanded = ${changedNode.expanded}`);
        console.log(newTree.getExpanded());
    };

    const onFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    // function to determine if node meets filter test
    // returns Boolean
    const filterTest = (node) => (
        // node's label matches the search string
        node.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1
    );

    const applyFilter = () => {
        const filteredTree = tree.filter(filterTest);
        setActiveFilter(filterText);
        setTree(filteredTree);
    };

    //--------------------------------------------------------------------------
    useEffect(() => {
        // timeout is used here to buffer filter text input
        // so filtering does not occur on every key press
        const timeoutDelay = 500; // 0.5 seconds
        clearTimeout(timeoutId);

        if (filterText !== '') {
            // filter is requested
            if (filterText !== activeFilter) {
                // filter has changed
                const newTimeoutId = setTimeout(applyFilter, timeoutDelay);
                setTimeoutId(newTimeoutId);
            }
        } else if (activeFilter !== '') {
            // no filter requested but there was one previously
            // restore whole tree
            const unFilteredTree = tree.removeFilter();
            setTree(unFilteredTree);
            setActiveFilter('');
        }
    }, [activeFilter, filterText, tree]);
    //--------------------------------------------------------------------------

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
                tree={tree}
                onChange={onChange}
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </div>
    );
}

export default FilterExample;
