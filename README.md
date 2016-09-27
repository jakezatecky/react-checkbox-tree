# react-checkbox-tree

[![npm](https://img.shields.io/npm/v/react-checkbox-tree.svg?style=flat-square)](https://www.npmjs.com/package/react-checkbox-tree)
[![Dependency Status](https://img.shields.io/david/jakezatecky/react-checkbox-tree.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-checkbox-tree)
[![devDependency Status](https://david-dm.org/jakezatecky/react-checkbox-tree/dev-status.svg?style=flat-square)](https://david-dm.org/jakezatecky/react-checkbox-tree#info=devDependencies)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/jakezatecky/react-checkbox-tree/master/LICENSE.txt)

> Checkbox treeview for React.

![Demo](demo.gif)


# Usage

Install the library:

``` shell
npm install react-checkbox-tree --save
```

Then render the component:

``` javascript
import CheckboxTree from 'react-checkbox-tree';

...

render() {
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

    return <CheckboxTree nodes={nodes} />;
}
```
