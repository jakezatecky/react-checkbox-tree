import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { fileSystem as nodes } from './common';

function ClickExample() {
    const [checked, setChecked] = useState([
        '/app/Http/Controllers/WelcomeController.js',
        '/app/Http/routes.js',
        '/public/assets/style.css',
        '/public/index.html',
        '/.gitignore',
    ]);
    const [expanded, setExpanded] = useState(['/app']);
    const [clicked, setClicked] = useState({});

    const onCheck = (value) => {
        setChecked(value);
    };

    const onExpand = (value) => {
        setExpanded(value);
    };

    const onClick = (value) => {
        setClicked(value);
    };

    const notClickedText = '(none)';
    const displayText = clicked.value || notClickedText;

    return (
        <div className="clickable-labels">
            <CheckboxTree
                checked={checked}
                expandOnClick
                expanded={expanded}
                nodes={nodes}
                onCheck={onCheck}
                onClick={onClick}
                onExpand={onExpand}
            />
            <div className="clickable-labels-info">
                <strong>Clicked Node</strong>
                {`: ${displayText}`}
            </div>
        </div>
    );
}

export default ClickExample;
