import * as React from 'react';

declare module "react-checkbox-tree" {
    interface Node {
        label: React.ReactNode;
        value: string;
        children?: Array<Node>;
        className?: string;
        disabled?: boolean;
        icon?: React.ReactNode;
        showCheckbox?: boolean;
        title?: string;
    }

    interface Icons {
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

    interface Language {
        collapseAll: string;
        expandAll: string;
        toggle: string;
    }

    interface CheckboxProps {
        nodes: Array<Node>;
        checked: Array<string>;
        expanded: Array<string>;
        onCheck: (checked: Array<string>) => void;
        onExpand: (expanded: Array<string>) => void;

        disabled?: boolean;
        expandDisabled?: boolean;
        expandOnClick?: boolean;
        icons?: Icons;
        id?: string;
        lang?: Language;
        name?: string;
        nameAsArray?: boolean;
        nativeCheckboxes?: boolean;
        noCascade?: boolean;
        onlyLeafCheckboxes?: boolean;
        optimisticToggle?: boolean;
        showExpandAll?: boolean;
        showNodeIcon?: boolean;
        showNodeTitle?: boolean;
        onClick?: (event: { checked: boolean, value: any }) => void;
    }

    export default class CheckboxTree extends React.Component<CheckboxProps> { }
}
