import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const propTypes = {
    indeterminate: PropTypes.bool,
};
const defaultProps = {
    indeterminate: false,
};

function NativeCheckbox({ indeterminate, ...otherProps }) {
    const checkbox = useRef(null);

    useEffect(() => {
        checkbox.current.indeterminate = indeterminate;
    });

    return <input {...otherProps} ref={checkbox} type="checkbox" />;
}

NativeCheckbox.propTypes = propTypes;
NativeCheckbox.defaultProps = defaultProps;

export default NativeCheckbox;
