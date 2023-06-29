import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';

import NodeModel from '../../../src/js/models/NodeModel';

import { mapLayerTreeSmall as nodes } from './data';

const initialTree = new TreeModel(nodes);

const propTypes = {
    node: PropTypes.instanceOf(NodeModel).isRequired,
    onChange: PropTypes.func,
};

const defaultProps = {
    onChange: null,
};

function CustomLabel({ node, onChange }) {
    const onChangeHandler = (e) => {
        const nodeKey = e.target.name;
        const { value } = e.target;
        onChange(nodeKey, value);
    };

    return (
        <div
            style={{
                border: '1px solid lightgrey',
                borderRadius: '8px',
                margin: '2px',
                padding: '3px 8px',
                minWidth: '180px',
                backgroundColor: 'lightblue',
            }}
        >
            <div>
                {node.label}
            </div>
            <div style={{ display: 'flex' }}>
                <label htmlFor="volume">opacity:</label>
                <span>
                    <input
                        id={node.value}
                        max="100"
                        min="0"
                        name={node.value}
                        style={{
                            display: 'block',
                            margin: '0.4rem',
                            opacity: 1,
                            width: '100px',
                            height: '2px',
                        }}
                        type="range"
                        onChange={onChangeHandler}
                    />
                </span>
            </div>
        </div>
    );
}
CustomLabel.propTypes = propTypes;
CustomLabel.defaultProps = defaultProps;

function CustomLabelExample() {
    const [tree, setTree] = useState(initialTree);
    const [nodeKey, setNodeKey] = useState('');
    const [value, setValue] = useState('');

    const onChange = (newTree) => {
        setTree(newTree);
    };

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
    const onLeafLabelChangeHandler = (key, newValue) => {
        setNodeKey(key);
        setValue(newValue);
    };

    const defaultText = '(none)';
    const displayText = nodeKey || defaultText;

    return (
        <div className="clickable-labels">
            <CheckboxTree
                LeafLabelComponent={CustomLabel}
                tree={tree}
                onChange={onChange}
                onCheck={onCheck}
                onExpand={onExpand}
                onLeafLabelChange={onLeafLabelChangeHandler}
            />
            <div className="clickable-labels-info">
                <strong>layer</strong>
                {`: ${displayText}`}
                <br />
                Slider Value
                {`: ${value}`}

            </div>
        </div>
    );
}

export default CustomLabelExample;
