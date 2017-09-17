import * as React from "react"

export interface TreeNode {
    label: string;
    value: any;
    children?: TreeNode[];
    className?: string;
    icon?: string;
}

interface CheckboxTreeProps {
    nodes: TreeNode[];
    className?: string;
    checked?: string[];
    disabled?: boolean;
    expandDisabled?: boolean;
    expanded?: string[];
    name?: string;
    nameAsArray?: boolean;
    noCascade?: boolean;
    optimisticToggle?: boolean;
    showNodeIcon?: boolean;
    onCheck?(checked: string[]): void;
    onExpand?(checked: string[]): void;
}

export class CheckboxTree extends React.Component<CheckboxTreeProps, any> { }