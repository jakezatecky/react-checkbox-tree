declare module "react-checkbox-tree" 
{
    interface Node 
    {
        label: string;
        value: string;
        children?: Array<Node>;
        className?: string;
        disabled?: boolean;
        icon?: JSX.Element;
        showCheckbox?: boolean;
    }

    interface CheckboxProps 
    {
        nodes: Array<Node>;
        checked: Array<string>;
        expanded: Array<string>;
        onCheck: (checked: Array<string>) => void;
        onExpand: (expanded: Array<string>) => void;

        disabled?: boolean;
        expandDisabled?: boolean;
        expandOnClick?: boolean;
        name?: string;
        nameAsArray?: boolean;
        nativeCheckboxes?: boolean;
        noCascade?: boolean;
        onlyLeafCheckboxes?: boolean;
        optimisticToggle?: boolean;
        showNodeIcon?: boolean;
        onClick?: (clicked: string) => void;
    }

    export default class CheckboxTree extends React.Component<CheckboxProps> { }
}