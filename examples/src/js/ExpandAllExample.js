import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { fileSystem as nodes } from './common';

function ExpandAllExample() {
    const [checked, setChecked] = useState([
        '/app/Http/Controllers/WelcomeController.js',
        '/app/Http/routes.js',
        '/public/assets/style.css',
        '/public/index.html',
        '/.gitignore',
    ]);
    const [expanded, setExpanded] = useState(['/app']);

    const onCheck = (value) => {
        setChecked(value);
    };

    const onExpand = (value) => {
        setExpanded(value);
    };

    return (
        <div className="expand-all-container">
            <CheckboxTree
                checked={checked}
                expanded={expanded}
                nodes={nodes}
                showExpandAll
                onCheck={onCheck}
                onExpand={onExpand}
            />
        </div>
    );
}

export default ExpandAllExample;
