import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const parents = [];

for (let i = 0; i < 100; i += 1) {
    const children = [];

    for (let j = 0; j < 200; j += 1) {
        children.push({
            value: `node-0-${i}-${j}`,
            label: `Node 0-${i}-${j}`,
        });
    }

    parents.push({
        value: `node-0-${i}`,
        label: `Node 0-${i}`,
        children,
    });
}

const initialNodes = [{
    value: 'node-0',
    label: 'Node 0',
    children: parents,
}];

class LargeDataExample extends React.Component {
    state = {
        nodes: initialNodes,
    };

    onCheck = (node, nodes) => {
        this.setState({ nodes });
    }

    onExpand = (node, nodes) => {
        this.setState({ nodes });
    }

    render() {
        const { nodes } = this.state;

        return (
            <CheckboxTree
                iconsClass="fa5"
                nodes={nodes}
                onCheck={this.onCheck}
                onExpand={this.onExpand}
            />
        );
    }
}

export default LargeDataExample;
