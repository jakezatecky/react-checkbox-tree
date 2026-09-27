import { useState } from 'react';
import CheckboxTree, { checkAllNodes } from 'react-checkbox-tree';

import { fileSystem as nodes } from './common.js';

function CheckAllExample() {
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState(['/app']);

    const onCheck = (value) => {
        setChecked(value);
    };

    const onExpand = (value) => {
        setExpanded(value);
    };

    return (
        <>
            <div className="check-all-actions">
                <button
                    className="check-all-btn"
                    type="button"
                    onClick={() => setChecked(checkAllNodes(nodes))}
                >
                    Check all
                </button>
                <button
                    className="check-all-btn"
                    type="button"
                    onClick={() => setChecked([])}
                >
                    Uncheck all
                </button>
            </div>
            <CheckboxTree
                checked={checked}
                expanded={expanded}
                nodes={nodes}
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </>
    );
}

export default CheckAllExample;
