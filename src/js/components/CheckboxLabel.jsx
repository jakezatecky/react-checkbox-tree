import PropTypes from 'prop-types';
import React from 'react';

import NativeCheckbox from './NativeCheckbox';
import CheckboxIcon from './CheckboxIcon';
import Clickable from './Clickable';

const propTypes = {
    checked: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    noCascade: PropTypes.bool.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    onCheck: PropTypes.func.isRequired,

    children: PropTypes.node,
    clickable: PropTypes.bool,
    isRadioNode: PropTypes.bool,
    title: PropTypes.string,
    treeId: PropTypes.string,
    onCheckboxKeyUp: PropTypes.func,
    onClick: PropTypes.func,
    onContextMenu: PropTypes.func,
};
const defaultProps = {
    children: null,
    clickable: false,
    isRadioNode: false,
    title: null,
    treeId: null,
    onCheckboxKeyUp: null,
    onClick: null,
    onContextMenu: null,
};

export default function CheckboxLabel(props) {
    const {
        checked,
        children,
        clickable,
        disabled,
        isRadioNode,
        noCascade,
        title,
        treeId,
        value,
        onCheck,
        onCheckboxKeyUp,
        onClick,
        onContextMenu,
    } = props;

    const valueId = String(value).split(' ').join('_');
    const inputId = treeId ? `${treeId}-${valueId}` : null;

    return (
        <>
            <label key={0} htmlFor={inputId} title={title} onContextMenu={onContextMenu}>
                <NativeCheckbox
                    checked={checked === 1}
                    disabled={disabled}
                    id={inputId}
                    indeterminate={checked === 2}
                    isRadioNode={isRadioNode}
                    onChange={() => {}}
                    onClick={onCheck}
                    onKeyUp={onCheckboxKeyUp}
                />
                <span
                    aria-hidden="true"
                    className="rct-checkbox"
                    role="presentation"
                >
                    <CheckboxIcon
                        checked={checked}
                        isRadioNode={isRadioNode}
                        noCascade={noCascade}
                    />
                </span>

                {!clickable ? children : null}
            </label>

            {clickable ? (
                <Clickable
                    key={1}
                    tabIndex={0}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    onKeyPress={onClick}
                >
                    {children}
                </Clickable>
            ) : null}
        </>
    );
}

CheckboxLabel.propTypes = propTypes;
CheckboxLabel.defaultProps = defaultProps;
