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

Below is a minimal example. Note that `CheckboxTree` is an [uncontrolled][docs-controlled] component. The tree state is stored in a context provided by `CheckboxTreeProvider`. This allows the `CheckboxTreeProvider` to be moved up in the React component tree to save the `CheckboxTree` state between component mounts. An example would be having the `CheckboxTree` inside a tab which unmounts when the selected tab changes.

``` jsx
import React from 'react';
import CheckboxTree, { CheckboxTreeProvider } from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

const nodes = [{
  value: 'mars',
  label: 'Mars',
  children: [
    { value: 'phobos', label: 'Phobos' },
    { value: 'deimos', label: 'Deimos' },
  ],
}];

function Widget() {
  return (
    <CheckboxTreeProvider>
      <CheckboxTree
        nodes={nodes}
        checked={checked}
        expanded={expanded}
        onCheck={(nodeKey, updatedTreeModel) => {
          const node = updatedTreeModel.getNode(nodeKey);
        }}
        onExpand={(nodeKey, updatedTreeModel) => {
          const node = updatedTreeModel.getNode(nodeKey);
        }}
      />
    </CheckboxTreeProvider>
  );
}
```

> **Note** &ndash; All node objects **must** have a unique `value`.

#### Initial State of the CheckboxTree

The ***initial*** state of the `CheckboxTree` is supplied to the `nodes` property. This property is used on the first mounting of the `CheckboxTree` component. A `TreeModel` is used internally by `CheckboxTree` to maintain consistent state. Subsequent mounting and rendering of the tree uses the state saved in the context provided by the `CheckboxTreeProvider`.

#### Changing the Default Icons

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

### Properties

| Property             | Type     | Description                                                                                                            | Default          |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `nodes`              | array    | **Required**. Specifies the ***initial*** state of the tree nodes and their children.                                                             |                  |
| `checkKeys`          | array    | A list of [keyboard keys][mdn-key] that will trigger a toggle of the check status of a node.                           | `[' ', 'Enter']` |
| `checkModel`         | string   | Specifies which checked nodes should be extracted to the `checked` array. Accepts `'leaf'` or `'all'`.                 | `'leaf'`         |
| `checked`            | array    | An array of checked node values.                                                                                       | `[]`             |
| `direction`          | string   | A string that specify whether the direction of the component is left-to-right (`'ltr'`) or right-to-left (`'rtl'`).    | `'ltr'`          |
| `disabled`           | bool     | If true, the component will be disabled and nodes cannot be checked.                                                   | `false`          |
| `expandDisabled`     | bool     | If true, the ability to expand nodes will be disabled.                                                                 | `false`          |
| `expandOnClick`      | bool     | If true, nodes will be expanded by clicking on labels. Requires a non-empty `onClick` function.                        | `false`          |
| `expanded`           | array    | An array of expanded node values.                                                                                      | `[]`             |
| `icons`              | object   | An object containing the mappings for the various icons and their components. See **Changing the Default Icons**.      | `{ ... }`        |
| `iconsClass`         | string   | A string that specifies which icons class to utilize. Currently, `'fa4'` and `'fa5'` are supported.                    | `'fa5'`          |
| `id`                 | string   | A string to be used for the HTML ID of the rendered tree and its nodes.                                                | `null`           |
| `lang`               | object   | A key-value pairing of localized text. See [`src/js/lang/default.js`][lang-file] for a list of keys.                   | `{ ... }`        |
| `name`               | string   | Optional name for the hidden `<input>` element.                                                                        | `undefined`      |
| `nameAsArray`        | bool     | If true, the hidden `<input>` will encode its values as an array rather than a joined string.                          | `false`          |
| `nativeCheckboxes`   | bool     | If true, native browser checkboxes will be used instead of pseudo-checkbox icons.                                      | `false`          |
| `noCascadeChecks`    | bool     | If true, toggling a parent node will **not** cascade its check state to its children. See also `percolateChecks`.      | `false`          |
| `noCascadeDisabled`  | bool     | If true, toggling a parent node will **not** cascade its disabled state to its children.                               | `false`          |
| `onlyLeafCheckboxes` | bool     | If true, checkboxes will only be shown for leaf nodes.                                                                 | `false`          |
| `optimisticToggle`   | bool     | If true, toggling a partially-checked node will select all children. If false, it will deselect. Requires`noCascade=false`. | `true`           |
| `showExpandAll`      | bool     | If true, buttons for expanding and collapsing all parent nodes will appear in the tree.                                | `false`          |
| `showNodeIcon`       | bool     | If true, each node will show a parent or leaf icon.                                                                    | `true`           |
| `showNodeTitle`      | bool     | If true, the `label` of each node will become the `title` of the resulting DOM node. Overridden by `node.title`.       | `false`          |
| `onCheck`            | function | onCheck handler: `function(nodeKey, updatedTreeModel) {}`   see [discussion](#oncheck-and-onexpand) below                                                            | `() => {}`       |
| `onClick`            | function | onClick handler: `function(nodeKey, updatedTreeModel) {}`. If set, `onClick` will be called when a node's label has been clicked.     | `null`           |
| `onContextMenu`      | function | onContextMenu handler: `function(event, nodeKey, updatedTreeModel) {}`. Triggers when right-clicking a node element.   | `null`           |
| `onExpand`           | function | onExpand handler: `function(nodeKey, updatedTreeModel) {}`                                                             | `() => {}`       |

#### `onCheck` and `onExpand`

#### Node Properties

Individual nodes within the `nodes` property can have the following structure:

| Property       | Type   | Description                                                              | Default |
| -------------- | ------ | ------------------------------------------------------------------------ | ------- |
| `label`        | mixed  | **Required**. The node's label.                                          |         |
| `value`        | mixed  | **Required**. The node's value.  Must be unique.                         |         |
| `children`     | array  | An array of child nodes. Can be an empty array to denote a parent node.  | `null`  |
| `className`    | string | A className to add to the node.                                          | `null`  |
| `checked`      | bool   | Whether the node is checked.                                             | `false` |
| `disabled`     | bool   | Whether the node should be disabled.                                     | `false` |
| `expanded`     | bool   | Whether the node is expanded (parent nodes).                             | `false` |
| `icon`         | mixed  | A custom icon for the node.                                              | `null`  |
| `showCheckbox` | bool   | Whether the node should show a checkbox.                                 | `true`  |
| `title`        | string | A custom `title` attribute for the node.                                 | `null`  |

### TreeModel Public Properties and Methods

The updated `TreeModel` instance is supplied to the `onCheck` and `onExpand` handlers as the second argument.

| Property/Method      | Type     | Description                                                                     |
| -------------------- | -------- | ------------------------------------------------------------------------------- |
| `nodes`              | object   | object holding the nodes of the tree indexed by their `value` property.         |
| `rootKeys`           | array    | list of node `value` properties of the level '0' nodes.                         |
| `options`            | object   | collection of properties passed from the input 'props' of `CheckboxTree`.       |
| `clone  `            | function | method to clone the `TreeModel`: `function()`                                   |
| `expandAllNodes`     | function | method to expand all parent nodes: `function()`                                 |
| `expandNodesToLevel` | function | method to expand parent nodes down to a particular level: `function(level)`     |
| `filter`             | function | method to filter nodes: `function(testFunc)` see further explanation below      |
| `getChecked`         | function | method to get list of checked nodes: `function()`  list contents based upon `checkModel` |
| `getDisabled`        | function | method to get list of disabled nodes: `function()`                              |
| `getExpanded`        | function | method to get list of expanded nodes: `function()`                              |
| `getNode`            | function | method to get a particular node from the tree: `function(nodeKey)`              |
| `removeFilter`       | function | method to remove the filter from the TreeModel: `function()`       |
| `setNewOptions`      | function | method to change the options in the TreeModel: `function(newOptions)`              |
| `setNodeProp`        | function | method to set a property on a particular node in the TreeModel: `function(nodeKey, propertyName, value)`              |
| `toggleChecked`      | function | method to toggle the check status of a particular node: `function(nodeKey)`     |
| `toggleDisabled`     | function | method to toggle the disabled status of a particular node: `function(nodeKey)`  |
| `toggleExpanded`     | function | method to toggle the expanded status of a particular node: `function(nodeKey)`  |

### Filtering Nodes

This is a way to reduce the tree by filtering the visible nodes.   TODO: expand on this section....

[docs-controlled]: https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
[docs-state-hooks]: https://react.dev/reference/react/useState
[font-awesome]: https://fontawesome.com
[lang-file]: https://github.com/jakezatecky/react-dual-listbox/blob/master/src/js/lang/default.js
[mdn-key]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
[react-fontawesome]: https://github.com/FortAwesome/react-fontawesome
