# react-checkbox-tree

[![npm](https://img.shields.io/npm/v/react-checkbox-tree.svg?style=flat-square)](https://www.npmjs.com/package/react-checkbox-tree)
[![Build Status](https://img.shields.io/travis/jakezatecky/react-checkbox-tree/master.svg?style=flat-square)](https://travis-ci.org/jakezatecky/react-checkbox-tree)
[![Dependency Status](https://img.shields.io/david/jakezatecky/react-checkbox-tree.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-checkbox-tree)
[![devDependency Status](https://david-dm.org/jakezatecky/react-checkbox-tree/dev-status.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-checkbox-tree#info=devDependencies)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/react-checkbox-tree/master/LICENSE.txt)

> A simple and elegant checkbox tree for React.

![Demo](demo.gif)

## Usage

### Installation

Install the library using your favorite dependency manager:

``` shell
yarn add react-checkbox-tree
```

Using npm:

```
npm install react-checkbox-tree --save
```

> **Note** &ndash; This library makes use of [Font Awesome](http://fontawesome.io/) styles and expects them to be loaded in the browser.


### Include CSS

For your convenience, the library's styles can be consumed utilizing one of the following files:

* `node_modules/react-checkbox-tree/lib/react-checkbox-tree.css`
* `node_modules/react-checkbox-tree/src/less/react-checkbox-tree.less`
* `node_modules/react-checkbox-tree/src/scss/react-checkbox-tree.scss`

Either include one of these files in your stylesheets or utilize a CSS loader:

``` javascript
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
```


### Render Component

A quick usage example is included below. Note that the react-checkbox-tree component is [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components). In other words, it is stateless. You must update its `checked` and `expanded` properties whenever a change occurs.

``` javascript
import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

const nodes = [{
    value: 'mars',
    label: 'Mars',
    children: [
        { value: 'phobos', label: 'Phobos' },
        { value: 'deimos', label: 'Deimos' },
    ],
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
        return (
            <CheckboxTree
                nodes={nodes}
                checked={this.state.checked}
                expanded={this.state.expanded}
                onCheck={checked => this.setState({ checked })}
                onExpand={expanded => this.setState({ expanded })}
            />
        );
    }
}
```

All node objects **must** have a unique `value`. This value is serialized into the `checked` and `expanded` arrays and is also used for performance optimizations.

### Properties

| Property           | Type     | Description                                                                                      | Default     |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------ | ----------- |
| `nodes`            | array    | **Required**. Specifies the tree nodes and their children.                                       |             |
| `checked`          | array    | An array of checked node values.                                                                 | `[]`        |
| `disabled`         | bool     | If true, the component will be disabled and nodes cannot be checked.                             | `false`     |
| `expandDisabled`   | bool     | If true, the ability to expand nodes will be disabled.                                           | `false`     |
| `expanded`         | array    | An array of expanded node values.                                                                | `[]`        |
| `name`             | string   | Optional name for the hidden `<input>` element.                                                  | `undefined` |
| `nameAsArray`      | bool     | If true, the hidden `<input>` will encode its values as an array rather than a joined string.    | `false`     |
| `noCascade`        | bool     | If true, toggling a parent node will **not** cascade its check state to its children.            | `false`     |
| `optimisticToggle` | bool     | If true, toggling a partially-checked node will select all children. If false, it will deselect. | `true`      |
| `showNodeIcon`     | bool     | If true, each node will show a parent or leaf icon.                                              | `true`      |
| `onCheck`          | function | onCheck handler: `function(checked) {}`                                                          | `() => {}`  |
| `onExpand`         | function | onExpand handler: `function(expanded) {}`                                                        | `() => {}`  |

#### Node Properties

Individual nodes within the `nodes` property can have the following structure:

| Property    | Type   | Description                     |
| ----------- | ------ | ------------------------------- |
| `label`     | mixed  | **Required**. The node's label. |
| `value`     | mixed  | **Required**. The node's value. |
| `children`  | array  | An array of child nodes.        |
| `className` | string | A className to add to the node. |
| `icon`      | mixed  | A custom icon for the node.     |
| `disabled`  | bool   | Disable node.                   |
