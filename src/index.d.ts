import * as React from 'react';

export interface Node {
    label: React.ReactNode;
    value: string;
    children?: Array<Node>;
    className?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    showCheckbox?: boolean;
    title?: string;
}

export interface OnCheckNode extends Node {
    checked: boolean;
}

export interface OnExpandNode extends Node {
    expanded: boolean;
}

export interface Icons {
    check?: React.ReactNode;
    uncheck?: React.ReactNode;
    halfCheck?: React.ReactNode;
    expandOpen?: React.ReactNode;
    expandClose?: React.ReactNode;
    expandAll?: React.ReactNode;
    collapseAll?: React.ReactNode;
    parentClose?: React.ReactNode;
    parentOpen?: React.ReactNode;
    leaf?: React.ReactNode;
}

export interface Language {
    collapseAll: string;
    collapseNode: string;
    expandAll: string;
    expandNode: string;
}

export interface CheckboxProps {
    nodes: Array<Node>;

    checkModel?: 'leaf' | 'all';
    checked?: Array<string>;
    direction?: 'ltr' | 'rtl';
    disabled?: boolean;
    expandDisabled?: boolean;
    expandOnClick?: boolean;
    expanded?: Array<string>;
    icons?: Icons;
    iconsClass?: string;
    id?: string;
    lang?: Language;
    listTag?: 'ol' | 'ul';
    name?: string;
    nameAsArray?: boolean;
    nativeCheckboxes?: boolean;
    noCascade?: boolean;
    onlyLeafCheckboxes?: boolean;
    optimisticToggle?: boolean;
    preserveUnknownValues?: boolean;
    showExpandAll?: boolean;
    showNodeIcon?: boolean;
    showNodeTitle?: boolean;
    onCheck?: (checked: Array<string>, node: OnCheckNode) => void;
    onClick?: (node: OnCheckNode) => void;
    onExpand?: (expanded: Array<string>, node: OnExpandNode) => void;
}

export default class CheckboxTree extends React.Component<CheckboxProps> {}

export function checkAllNodes (
    nodes: Array<Node>,
    options?: { checkModel?: 'leaf' | 'all', noCascade?: boolean },
): Array<string>

export function expandNodesToLevel (nodes: Array<Node>, targetLevel: number): Array<string>
