import * as React from 'react';

declare module "react-checkbox-tree" {
    interface Node {
        label: React.ReactNode;
        value: string;
        children?: Array<Node>;
        className?: string;
        disabled?: boolean;
        icon?: JSX.Element;
        showCheckbox?: boolean;
        title?: string;
    }

    interface Icons {
        check?: JSX.Element;
        uncheck?: JSX.Element;
        halfCheck?: JSX.Element;
        expandOpen?: JSX.Element;
        expandClose?: JSX.Element;
        expandAll?: JSX.Element;
        collapseAll?: JSX.Element;
        parentClose?: JSX.Element;
        parentOpen?: JSX.Element;
        leaf?: JSX.Element;
    }

    interface Language {
        collapseAll: string;
        expandAll: string;
        toggle: string;
    }

    interface CheckboxProps {
        nodes: Array<Node>;

        checkModel?: string;
        checked?: Array<string>;
        disabled?: boolean;
        expandDisabled?: boolean;
        expandOnClick?: boolean;
        expanded?: Array<string>;
        icons?: Icons;
        iconsClass?: string;
        lang?: Language;
        name?: string;
        nameAsArray?: boolean;
        nativeCheckboxes?: boolean;
        noCascade?: boolean;
        onlyLeafCheckboxes?: boolean;
        optimisticToggle?: boolean;
        showExpandAll?: boolean;
        showNodeIcon?: boolean;
        showNodeTitles?: boolean;
        onCheck?: (checked: Array<string>) => void;
        onClick?: (event: { checked: boolean, value: any }) => void;
        onExpand?: (expanded: Array<string>) => void;
    }

    export default class CheckboxTree extends React.Component<CheckboxProps> { }
}
