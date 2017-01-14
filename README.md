# react-checkbox-tree

[![npm](https://img.shields.io/npm/v/react-checkbox-tree.svg?style=flat-square)](https://www.npmjs.com/package/react-checkbox-tree)
[![Dependency Status](https://img.shields.io/david/jakezatecky/react-checkbox-tree.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-checkbox-tree)
[![devDependency Status](https://david-dm.org/jakezatecky/react-checkbox-tree/dev-status.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-checkbox-tree#info=devDependencies)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/react-checkbox-tree/master/LICENSE.txt)

> Checkbox treeview for React.

![Demo](demo.gif)


## Installation

The easiest way to use react-checkbox-tree is to install from NPM and include it in your own React build process (e.g. using [Webpack](http://webpack.github.io/docs/what-is-webpack.html)):

```
npm install react-checkbox-tree --save
```

## Usage

A quick usage example is included below. Note that the react-checkbox-tree component is [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components). In other words, it is stateless. You must update its `checked` and `expanded` properties whenever a change occurs.

``` javascript
import CheckboxTree from 'react-checkbox-tree';

const nodes = [{
    value: 'node-1',
    title: 'Parent Node 1',
    children: [{
        value: 'node-1-1',
        title: 'Leaf Node 1-1',
    }, {
        value: 'node-1-2',
        title: 'Leaf Node 1-2'
    }],
}];

class Widget extends React.Component {
    constructor() {
        super();

        this.state = {
            checked: [],
            expanded: [],
        };
    }

    render() {
        const { checked, expanded } = this.state;

        return (
            <Tree
                name="tree_nodes"
                nodes={nodes}
                checked={checked}
                expanded={expanded}
                onCheck={checked => this.setState({ checked }}
                onExpand={expanded => this.setState({ expanded }}
            />
        );
    }
}
```

### Properties

| Property      | Type     | Description                                                                                   |
| ------------- | -------- | --------------------------------------------------------------------------------------------- |
| `nodes`       | array    | **Required**. Specifies the tree nodes and their children.                                    |
| `checked`     | array    | **Required**. An array of checked node values.                                                |
| `expanded`    | array    | **Required**. An array of expanded node values.                                               |
| `onCheck`     | function | onCheck handler: `function(checked) {}`                                                       |
| `onExpand`    | function | onExpand handler: `function(expanded) {}`                                                     |
| `name`        | string   | Optional name for the hidden `<input>` element.                                               |
| `nameAsArray` | bool     | If true, the hidden `<input>` will encode its values as an array rather than a joined string. |
