# react-checkbox-tree

[![npm](https://img.shields.io/npm/v/react-checkbox-tree.svg?style=flat-square)](https://www.npmjs.com/package/react-checkbox-tree)
[![Build Status](https://img.shields.io/github/actions/workflow/status/jakezatecky/react-checkbox-tree/main.yml?branch=master&style=flat-square)](https://github.com/jakezatecky/react-checkbox-tree/actions/workflows/main.yml)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/react-checkbox-tree/master/LICENSE.txt)

> A simple and elegant checkbox tree for React.

![Demo](demo.gif)

## Usage

### Installation

Install the library using your favorite dependency manager:

```
yarn add react-checkbox-tree
```

Using npm:

```
npm install react-checkbox-tree --save
```

> **Note** &ndash; By default, this library makes use of [Font Awesome][font-awesome] styles and expects them to be loaded in the browser.

### Include CSS

The library's styles are available through one of the following files:

* `node_modules/react-checkbox-tree/lib/react-checkbox-tree.css`
* `node_modules/react-checkbox-tree/src/scss/react-checkbox-tree.scss`

Either include one of these files in your stylesheets or utilize a CSS loader:

``` javascript
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
```

### Render Component

Below is a minimal example. Note that `CheckboxTree` is a [controlled][docs-controlled] component. 

``` jsx
import React, { useState } from 'react';
import CheckboxTree, { TreeModel } from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const nodes = [{
  value: 'mars',
  label: 'Mars',
  children: [
    { value: 'phobos', label: 'Phobos' },
    { value: 'deimos', label: 'Deimos' },
  ],
}];

// optional inputs for TreeModel
const options = {
  checkModel: 'all,'
};

const initialTree = new TreeModel(nodes, options);

function Widget() {
  const [tree, setTree] = useState(initialTree);
  
  return (
    <CheckboxTree
      tree={tree}
      onChange={(updatedTree) => {
        setTree(updatedTree);
      }}
      onCheck={(node, updatedTree) => {
        console.log(node.label);
        console.log(updatedTree.getChecked());
      }}
      onExpand={(node, updatedTree) => {
        console.log(node.label);
        console.log(updatedTree.getExpanded());
      }}
    />
  );
}
```

### Initial State of the CheckboxTree

The initial state of the `CheckBoxTree` is defined by an array of *node* objects (`nodes`). This array is input to the [`TreeModel` class](#treemodel-class) to create the `tree` prop for `CheckboxTree`.

### Node Properties

Individual nodes within the `nodes` array must have the following structure:

| Property       | Type   | Description                                                              | Default |
| -------------- | ------ | ------------------------------------------------------------------------ | ------- |
| `label`        | mixed  | **Required**. The node's label.                                          |         |
| `value`        | mixed  | **Required**. The node's value.  Must be **unique**.                     |         |
| `children`     | array  | An array of child nodes. Can be an empty array to denote a parent node.  | `null`  |
| `className`    | string | A className to add to the node.                                          | `null`  |
| `checked`      | bool   | Whether the node is checked.                                             | `false` |
| `disabled`     | bool   | Whether the node should be disabled.                                     | `false` |
| `expanded`     | bool   | Whether the node is expanded (parent nodes).                             | `false` |
| `icon`         | mixed  | A custom icon for the node.                                              | `null`  |
| `showCheckbox` | bool   | Whether the node should show a checkbox.                                 | `true`  |
| `title`        | string | A custom `title` attribute for the node.                                 | `null`  |

> **Note**: any additional properties included in an input node will be included in that node in the `TreeModel` instance.

### TreeModel Class

A `TreeModel` class instance defines the state of a `CheckboxTree`. The constructor takes two arguments.
* `nodes` - the array of nodes defining the [inital state](#initial-state-of-the-checkboxtree) (**required**)
* `options` - an object of [control properties](#control-properties) (optional)

```
const tree = new TreeModel(nodes, options);
```

#### Control Properties

| Control Property     | Type     | Description                                                                                                            | Default          |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `checkModel`         | string   | Specifies which checked nodes should be extracted to the `checked` array. Accepts `'leaf'`, `'parent'` or `'all'`.     | `'leaf'`         |
| `noCascadeChecks`    | bool     | If true, toggling a parent node will **not** cascade its check state to its children.                                    | `false`          |
| `noCascadeDisabled`  | bool     | If true, toggling a parent node will **not** cascade its disabled state to its children.                                | `false`          |
| `optimisticToggle`   | bool     | If true, toggling a partially-checked node will select all children. If false, it will deselect. Requires`noCascadeChecks=false`. | `true`           |

#### TreeModel Public properties

> **Note**: these properties are **read-only**. Use the `TreeModel` [methods](#treemodel-public-methods) below to manipulate the data in the `TreeModel` instance.

| Property             | Type     | Description                                                    |
| -------------------- | -------- | -------------------------------------------------------------- |
| `rootKeys`           | array    | list of node `value` properties of the level '0' nodes.        |
| `options`            | object   | [Control Properties](#control-properties)                      |

#### TreeModel Public Methods

> **Note**: any `TreeModel` method which changes the state will return an updated `TreeModel` instance (`newTree`). This instance should be saved to state to update `CheckBoxTree`.

```
const newTree = tree.toggleChecked(node.value);
setTree(newTree);
```

| Method               | Type     | Description                                                    |
| -------------------- | -------- | -------------------------------------------------------------- |
| `clone`              | function | clone the `TreeModel` instance: `clone() => newTree`           |
| `expandAllNodes`     | function | expand all parent nodes: `expandAllNodes() => newTree`         |
| `expandNodesToLevel` | function | expand parent nodes down to a particular level: `expandNodesToLevel(level) => newTree` |
| `filter`             | function | filter nodes visible in tree (see [Filtering Nodes](#filtering-nodes)): `filter(testFunc) => newTree` |
| `getChecked`         | function | get list of `node.value` for checked nodes based upon `checkModel`: `getChecked() => checkedArray` |
| `getDisabled`        | function | get list of `node.value` for disabled nodes: `getDisabled() => disabledArray`           |
| `getExpanded`        | function | get list `node.value` for of expanded nodes: `getExpanded() => expandedArray`           |
| `getNode`            | function | get a particular node from the tree: `getNode(nodeKey) => node`  |
| `removeFilter`       | function | remove the filter from the TreeModel: `removeFilter() => newTree` |
| `setNodeProp`        | function | set a property on a particular node in the TreeModel: `setNodeProp(nodeKey, propertyName, value) => newTree` |
| `toggleChecked`      | function | toggle the check status of a particular node: `toggleChecked(nodeKey) => newTree` |
| `toggleDisabled`     | function | toggle the disabled status of a particular node: `toggleDisabled(nodeKey) => newTree` |
| `toggleExpanded`     | function | toggle the expanded status of a particular node: `toggleExpanded(nodeKey) => newTree` |
| `updateOptions`      | function | change the options in the TreeModel: `updateOptions(newOptions) => newTree`  |

### CheckBoxTree Component

#### Properties

| Property             | Type     | Description                                     | Default      |
| -------------------- | -------- | ----------------------------------------------- | ------------ |
| `tree`               | TreeModel | **Required**. A TreeModel instance defining the current state of the CheckBoxTree. |                  |
| `checkKeys`          | array    | A list of [keyboard keys][mdn-key] that will trigger a toggle of the check status of a node. | `[' ', 'Enter']` |
| `direction`          | string   | A string that specify whether the direction of the component is left-to-right (`'ltr'`) or right-to-left (`'rtl'`). | `'ltr'`          |
| `disabled`           | bool     | If true, the component will be disabled and nodes cannot be checked. | `false` |
| `expandDisabled`     | bool     | If true, the ability to expand nodes will be disabled. | `false`     |
| `expandOnClick`      | bool     | If true, nodes will be expanded by clicking on labels. Requires a non-empty `onClick` function. | `false`          |
| `icons`              | object   | An object containing the mappings for the various icons and their components. See [Changing the Default Icons](#changing-the-default-icons).      | `{ ... }`       |
| `iconsClass`         | string   | A string that specifies which icons class to utilize. Currently, `'fa4'` and `'fa5'` are supported. | `'fa5'`       |
| `id`                 | string   | A string to be used for the HTML ID of the rendered tree and its nodes. | `null` |
| `lang`               | object   | A key-value pairing of localized text. See [`src/js/lang/default.js`][lang-file] for a list of keys. | `{ ... }`        |
| `name`               | string   | Optional name for the hidden `<input>` element. | `undefined`      |
| `nameAsArray`        | bool     | If true, the hidden `<input>` will encode its values as an array rather than a joined string. | `false`          |
| `nativeCheckboxes`   | bool     | If true, native browser checkboxes will be used instead of pseudo-checkbox icons. | `false`          |
| `onlyLeafCheckboxes` | bool     | If true, checkboxes will only be shown for leaf nodes. | `false`   |
| `showExpandAll`      | bool     | If true, buttons for expanding and collapsing all parent nodes will appear in the tree. | `false`          |
| `showNodeIcon`       | bool     | If true, each node will show a parent or leaf icon.    | `true` |
| `showNodeTitle`      | bool     | If true, the `label` of each node will become the `title` of the resulting DOM node. Overridden by `node.title`. | `false`          |
| `onChange`           | function | **Required**. `onChange` handler (see [Event Handlers](#event-handlers)): `onChange(updatedTree) {}` Called when there is a state change in the tree.   | `() => {}`       |
| `onCheck`            | function | `onCheck` handler (see [Event Handlers](#event-handlers)): `onCheck(node, updatedTree) {}` | `() => {}`       |
| `onClick`            | function | `onClick` handler (see [Event Handlers](#event-handlers)): `onClick(node, updatedTree) {}`. If set, `onClick` will be called when a node's label has been clicked. | `null`           |
| `onContextMenu`      | function | `onContextMenu` handler (see [Event Handlers](#event-handlers)): `onContextMenu(event, node, updatedTree) {}`. Triggers when right-clicking a node element. | `null`           |
| `onExpand`           | function | `onExpand` handler (see [Event Handlers](#event-handlers)): `onExpand(node, updatedTree) {}` | `() => {}`  |

> **TODO** add definitions for these properties  - see also [Replacing Default Label Components](#replacing-default-label-components)

```
LabelComponent: PropTypes.func,
LeafLabelComponent: PropTypes.func,
ParentLabelComponent: PropTypes.func,
onLabelChange: PropTypes.func,
onLeafLabelChange: PropTypes.func,
onParentLabelChange: PropTypes.func,
```

### Changing the Default Icons

By default, **react-checkbox-tree** uses Font Awesome 5/6 for the various icons that appear in the tree. To utilize Font Awesome 4 icons, simply pass in `iconsClass="fa4"`:

``` jsx
<CheckboxTree
    ...
    iconsClass="fa4"
/>
```

To change the rendered icons entirely, simply pass in the `icons` property and override the defaults. Note that you can override as many or as little icons as you like:

``` jsx
<CheckboxTree
    ...
    icons={{
        check: <span className="rct-icon rct-icon-check" />,
        uncheck: <span className="rct-icon rct-icon-uncheck" />,
        halfCheck: <span className="rct-icon rct-icon-half-check" />,
        expandClose: <span className="rct-icon rct-icon-expand-close" />,
        expandOpen: <span className="rct-icon rct-icon-expand-open" />,
        expandAll: <span className="rct-icon rct-icon-expand-all" />,
        collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
        parentClose: <span className="rct-icon rct-icon-parent-close" />,
        parentOpen: <span className="rct-icon rct-icon-parent-open" />,
        leaf: <span className="rct-icon rct-icon-leaf" />,
    }}
/>
```

If you are using the [`react-fontawesome`][react-fontawesome] library, you can also directly substitute those icons:

``` jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

...

<CheckboxTree
    ...
    icons={{
        check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon="check-square" />,
        uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['fas', 'square']} />,
        halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square" />,
        expandClose: <FontAwesomeIcon className="rct-icon rct-icon-expand-close" icon="chevron-right" />,
        expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon="chevron-down" />,
        expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon="plus-square" />,
        collapseAll: <FontAwesomeIcon className="rct-icon rct-icon-collapse-all" icon="minus-square" />,
        parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder" />,
        parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open" />,
        leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file" />
    }}
/>
```


### Event Handlers

> **TODO**: add explanatory text here... `onChange`, `onCheck`, `onClick`, `oncContextMenu`, `onExpand` ...

### Filtering Nodes

The nodes visible in the `CheckBoxTree` can be filtered using the `TreeModel.filter` method.

The `filter` method takes one argument, a test function which determines if the node should be visible. This test function will be provided each node as it's first argument.

```
// function to determine if node should be visible
// returns Boolean
const filterTest = (node) => (
    // node's label matches the search string
    node.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1
);

const filteredTree = tree.filter(filterTest);
setTree(filteredTree);

```
 See [FilterExample](examples/src/js/FilterExample.jsx) for a complete example.
 
### Replacing Default Label Components
 
 > **TODO**: add explanatory text here...

[docs-controlled]: https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
[docs-state-hooks]: https://react.dev/reference/react/useState
[font-awesome]: https://fontawesome.com
[lang-file]: https://github.com/jakezatecky/react-dual-listbox/blob/master/src/js/lang/default.js
[mdn-key]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
[react-fontawesome]: https://github.com/FortAwesome/react-fontawesome
