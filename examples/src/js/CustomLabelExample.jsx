import React, { useState } from 'react';
import CheckboxTree, { CheckboxTreeProvider } from 'react-checkbox-tree';

import { mapLayerTreeSmall as initialTreeState } from './data';

const CustomLabel = ({node, onChange}) => {
    const onChangeHandler = (e) => {
        const nodeKey = e.target.name;
        const value = e.target.value;
        onChange(nodeKey, value);
    }

    return (
        <div
            style={{
                border: "1px solid lightgrey",
                borderRadius: "8px",
                margin: "2px",
                padding: "3px 8px",
                minWidth: "180px",
                backgroundColor: "lightblue"
            }}
        >
            <div>
                {node.label}
            </div>
            <div style={{display: 'flex'}}>
                <label htmlFor="volume">opacity:</label>
                <span>
                    <input
                        type="range"
                        id={node.value}
                        name={node.value}
                        min="0"
                        max="100"
                        onChange={onChangeHandler}
                        style={{
                            display: "block",
                            margin: '0.4rem',
                            opacity: 1,
                            width: "100px",
                            height: "2px",
                        }}
                    />
                </span>
            </div>
        </div>
    );
}

function CustomLabelExample() {
    const [nodeKey, setNodeKey] = useState('');
    const [value, setValue] = useState('');

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

    // this handler gets passed by CheckboxTree through TreeNode
    // along with the CustomLabel replacing the DefaultLabel
    const onLeafLabelChangeHandler = (nodeKey, value) => {
        setNodeKey(nodeKey);
        setValue(value);
    }

    const defaultText = '(none)';
    const displayText = nodeKey || defaultText;

    return (
        <div className="clickable-labels">
            <CheckboxTreeProvider>
                <CheckboxTree
                    initialTreeState={initialTreeState}
                    LeafLabelComponent={CustomLabel}
                    onLeafLabelChange={onLeafLabelChangeHandler}
                    onCheck={onCheck}
                    onExpand={onExpand}
                />
            </CheckboxTreeProvider>
            <div className="clickable-labels-info">
                <strong>layer</strong>
                {`: ${displayText}`}
                <br/>
                Slider Value
                {`: ${value}`}

            </div>
        </div>
    );
}

export default CustomLabelExample;
