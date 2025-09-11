import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const propTypes = {
    indeterminate: PropTypes.bool,
};

function NativeCheckbox({ indeterminate = false, ...otherProps }) {
    const checkbox = useRef(null);

    useEffect(() => {
        checkbox.current.indeterminate = indeterminate;
    });

    return <input {...otherProps} ref={checkbox} type="checkbox" />;
}

NativeCheckbox.propTypes = propTypes;

export default NativeCheckbox;
