# CHANGELOG

## [v1.0.0](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.6.4...v1.0.0) (2017-09-21)

### New Features

* [#49]: Add the ability to specify `disabled` to individual nodes
* [#50]: Allow `node.label` to be any valid React node

### Usability

* [#51]: Apply additional background color when a node is active

## [v0.6.4](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.6.3...v0.6.4) (2017-07-22)

### Bug Fixes

* [#42]: Fix npm package not aligning with Git version

## [v0.6.3](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.6.2...v0.6.3) (2017-05-30)

The **v0.6.x** series will likely be the last series before the **v1.0** release. The API is not expected to significantly change, but new features will not be added to pre-1.0 versions.

### New Features

* [#35]: Add `disabled` and `expandDisabled` options to `<CheckboxTree>`

## [v0.6.2](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.6.1...v0.6.2) (2017-05-25)

### New Features

* [#34]: Add `noCascade` option to decouple parent check state from children

## [v0.6.1](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.6.0...v0.6.1) (2017-05-09)

### Other

* [#33]: Add a `prepublish` command to ensure that the `./lib` folder is built before package is published to npm

## [v0.6.0](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.5.2...v0.6.0) (2017-05-06)

### New Features

* [#32]: Allow customization of `className` at the node level
* [#30]: Add `showNodeIcon` property to optionally remove node icons

### Other

* [#14]: Component performance when rendering and updating a large number of nodes has been significantly increased

## [v0.5.2](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.5.1...v0.5.2) (2017-05-03)

### Bug Fixes

* [#31]: Fix issue where expand buttons would submit a parent form

## [v0.5.1](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.5.0...v0.5.1) (2017-03-21)

### New Features

* [#27]: Add `rct-node-leaf` and `rct-node-parent` classes to the TreeNode `<li>` element

## [v0.5.0](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.4.2...v0.5.0) (2017-03-12)

### Breaking Changes

* [#20]: Remove deprecated `title` property in `nodes` (use `label` instead)

### New Features

* [#2]: Allow customization of icons via CSS
* [#26]: Allow icon customization at node level

## [v0.4.2](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.4.1...v0.4.2) (2017-02-27)

### Bug Fixes

* [#22]: Remove expand-like behavior on nodes without children
* [#23]: Fix issue where property validation was not occurring on node items

## [v0.4.1](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.4.0...v0.4.1) (2017-02-15)

### Deprecations

* [#20]: Add support for `label` in `nodes` property and deprecate `title`

### New Features

* [#21]: Add greater accessibility support

## [v0.4.0](https://github.com/jakezatecky/react-checkbox-tree/compare/v0.3.0...v0.4.0) (2017-01-27)

### Bug Fixes

* [#17]: Auto-prefix CSS styles to support older browsers
* [#18]: Remove unnecessary margin on tree lists

### New Features

* [#15]: Provide `optimisticToggle` configuration to toggle child nodes optimistically or pessimistically
