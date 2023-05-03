import React, { useEffect, useState } from 'react';
import CheckboxTree, { CheckboxTreeProvider, useCheckboxTree } from 'react-checkbox-tree';

import { fileSystem as initialTreeState } from './data';

// NOTE: FilterWidget must be within CheckboxTreeProvider
// so useCheckboxTree can be used in FilterWidget function
function FilterExample() {
    return (
        <CheckboxTreeProvider>
            <FilterWidget />
        </CheckboxTreeProvider>
    );
}

function FilterWidget() {
    const [filterText, setFilterText] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [timeoutId, setTimeoutId] = useState();

    const { treeModel } = useCheckboxTree();

    const onCheck = (changedNodeKey, newTree) => {
        const changedNode = newTree.getNode(changedNodeKey);
        console.log(`changed node = ${changedNode.label}`);
        console.log(newTree.getChecked());
    };

    const onExpand = (changedNodeKey, newTree) => {
        const changedNode = newTree.getNode(changedNodeKey);
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
        treeModel.filter(filterTest);
        setActiveFilter(filterText);
    };

    //--------------------------------------------------------------------------
    useEffect(() => {
        // timeout is used here to buffer filter text input
        // so filtering does not occur on every key press
        const timeoutDelay = 500; // 0.5 seconds
        clearTimeout(timeoutId);

        // treeModel may not exist on first call
        if (treeModel) {
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
                treeModel.removeFilter();
                setActiveFilter('');
            }
        }
    }, [activeFilter, filterText, treeModel]);
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
                initialTreeState={initialTreeState}
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </div>
    );
}

export default FilterExample;
