import classNames from 'classnames';
import PropTypes from 'prop-types';
import { memo, useCallback, useContext } from 'react';

import { KEYS } from '#js/constants.js';
import { IconContext } from '#js/contexts.js';
import ExpandButton from '#js/components/ExpandButton.jsx';
import NativeCheckbox from '#js/components/NativeCheckbox.jsx';
import NodeIcon from '#js/components/NodeIcon.jsx';

const propTypes = {
    checkKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
    checked: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    expandDisabled: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    isLeaf: PropTypes.bool.isRequired,
    isParent: PropTypes.bool.isRequired,
    label: PropTypes.node.isRequired,
    optimisticToggle: PropTypes.bool.isRequired,
    showNodeIcon: PropTypes.bool.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    onCheck: PropTypes.func.isRequired,
    onExpand: PropTypes.func.isRequired,

    children: PropTypes.node,
    className: PropTypes.string,
    expandOnClick: PropTypes.bool,
    icon: PropTypes.node,
    showCheckbox: PropTypes.bool,
    title: PropTypes.string,
    treeId: PropTypes.string,
    onClick: PropTypes.func,
    onContextMenu: PropTypes.func,
};

function TreeNode({
    checkKeys,
    checked,
    disabled,
    expandDisabled,
    expanded,
    isLeaf,
    isParent,
    label,
    optimisticToggle,
    showNodeIcon,
    value,
    onCheck,
    onExpand,
    children = null,
    className = null,
    expandOnClick = false,
    icon = null,
    showCheckbox = true,
    title = null,
    treeId = null,
    onClick = null,
    onContextMenu = null,
}) {
    const { uncheck, check, halfCheck } = useContext(IconContext);

    const getCheckState = useCallback(({ toggle }) => {
        // Toggle off state to checked
        if (checked === 0 && toggle) {
            return true;
        }

        // Node is already checked and we are not toggling
        if (checked === 1 && !toggle) {
            return true;
        }

        // Get/toggle partial state based on cascade model
        if (checked === 2) {
            return optimisticToggle;
        }

        return false;
    }, [checked, optimisticToggle]);

    const handleCheck = useCallback(() => {
        onCheck({
            value,
            checked: getCheckState({ toggle: true }),
        });
    }, [getCheckState, onCheck, value]);

    const handleCheckboxKeyUp = useCallback((event) => {
        const { key } = event;

        // Prevent default spacebar behavior from interfering with user settings
        if (key === KEYS.SPACEBAR) {
            event.preventDefault();
        }

        if (checkKeys.includes(key)) {
            handleCheck();
        }
    }, [checkKeys, handleCheck]);

    const handleExpand = useCallback(() => {
        onExpand({ value, expanded: !expanded });
    }, [expanded, onExpand, value]);

    function handleClick() {
        // Auto expand if enabled
        if (isParent && expandOnClick) {
            handleExpand();
        }

        onClick({ value, checked: getCheckState({ toggle: false }) });
    }

    function handleClickKeyDown(event) {
        // Prevent the spacebar from scrolling the page
        if (event.key === KEYS.SPACEBAR) {
            event.preventDefault();
        }

        if (checkKeys.includes(event.key)) {
            handleClick();
        }
    }

    function renderCheckboxIcon() {
        if (checked === 0) {
            return uncheck;
        }

        if (checked === 1) {
            return check;
        }

        return halfCheck;
    }

    function renderBareLabel(labelChildren) {
        const clickable = onClick !== null;

        return (
            <span className="rct-bare-label" title={title}>
                {clickable ? (
                    <span
                        className="rct-node-clickable"
                        role="button"
                        tabIndex={0}
                        onClick={handleClick}
                        onContextMenu={onContextMenu}
                        onKeyDown={handleClickKeyDown}
                    >
                        {labelChildren}
                    </span>
                ) : labelChildren}
            </span>
        );
    }

    function renderCheckboxLabel(labelChildren) {
        const clickable = onClick !== null;
        const valueId = String(value).split(' ').join('_');
        const inputId = treeId ? `${treeId}-${valueId}` : null;

        const render = [(
            <label key={0} htmlFor={inputId} title={title} onContextMenu={onContextMenu}>
                <NativeCheckbox
                    checked={checked === 1}
                    disabled={disabled}
                    id={inputId}
                    indeterminate={checked === 2}
                    onChange={() => {}}
                    onClick={handleCheck}
                    onKeyUp={handleCheckboxKeyUp}
                />
                <span
                    aria-hidden="true"
                    className="rct-checkbox"
                    role="presentation"
                >
                    {renderCheckboxIcon()}
                </span>
                {!clickable ? labelChildren : null}
            </label>
        )];

        if (clickable) {
            render.push((
                <span
                    key={1}
                    className="rct-node-clickable"
                    role="button"
                    tabIndex={0}
                    onClick={handleClick}
                    onContextMenu={onContextMenu}
                    onKeyDown={handleClickKeyDown}
                >
                    {labelChildren}
                </span>
            ));
        }

        return render;
    }

    function renderLabel() {
        const labelChildren = (
            <>
                {showNodeIcon ? <NodeIcon expanded={expanded} icon={icon} isLeaf={isLeaf} /> : null}
                <span className="rct-label">{label}</span>
            </>
        );

        if (!showCheckbox) {
            return renderBareLabel(labelChildren);
        }

        return renderCheckboxLabel(labelChildren);
    }

    const nodeClass = classNames({
        'rct-node': true,
        'rct-node-leaf': isLeaf,
        'rct-node-parent': !isLeaf,
        'rct-node-expanded': !isLeaf && expanded,
        'rct-node-collapsed': !isLeaf && !expanded,
        'rct-disabled': disabled,
    }, className);

    return (
        <li className={nodeClass}>
            <span className="rct-text">
                <ExpandButton
                    disabled={expandDisabled}
                    expanded={expanded}
                    isLeaf={isLeaf}
                    onClick={handleExpand}
                />
                {renderLabel()}
            </span>
            {expanded ? children : null}
        </li>
    );
}

TreeNode.propTypes = propTypes;

// Memoized to preserve the shallow-compare behavior of the previous `PureComponent`
export default memo(TreeNode);
