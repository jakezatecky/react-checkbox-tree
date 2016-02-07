# react-checkbox-tree

Checkbox treeview for React.

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

    return <CheckboxTree node={nodes} />;
}
```
