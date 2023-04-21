import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const propTypes = {
    indeterminate: PropTypes.bool,
    isRadioNode: PropTypes.bool,
};
const defaultProps = {
    indeterminate: false,
    isRadioNode: false,
};

function NativeCheckbox({ indeterminate, isRadioNode, ...otherProps }) {
    const checkbox = useRef(null);

    useEffect(() => {
        checkbox.current.indeterminate = indeterminate;
    });

    return (
        <input
            {...otherProps}
            ref={checkbox}
            type={isRadioNode ? 'radio' : 'checkbox'}
        />
    );
}

NativeCheckbox.propTypes = propTypes;
NativeCheckbox.defaultProps = defaultProps;

export default NativeCheckbox;
