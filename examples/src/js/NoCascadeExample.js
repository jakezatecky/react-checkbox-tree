import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { fileSystem as nodes } from './common';

function NoCascadeExample() {
    const [checked, setChecked] = useState([
        '/app/Http/Controllers/WelcomeController.js',
        '/app/Http/routes.js',
        '/public/assets/style.css',
        '/public/index.html',
        '/.gitignore',
    ]);
    const [expanded, setExpanded] = useState([
        '/app',
        '/app/Http',
    ]);

    const onCheck = (value) => {
        setChecked(value);
    };

    const onExpand = (value) => {
        setExpanded(value);
    };

    return (
        <CheckboxTree
            checked={checked}
            expanded={expanded}
            noCascade
            nodes={nodes}
            onCheck={onCheck}
            onExpand={onExpand}
        />
    );
}

export default NoCascadeExample;
