import PropTypes from 'prop-types';
import React from 'react';

import listShape from '../shapes/listShape';

const propTypes = {
    checked: listShape.isRequired,
    name: PropTypes.string.isRequired,
    nameAsArray: PropTypes.bool.isRequired,
};

function renderInputArray(name, checked) {
    const inputName = `${name}[]`;

    return checked.map((value) => (
        <input key={value} name={inputName} type="hidden" value={value} />
    ));
}

function HiddenInput({ checked, name, nameAsArray }) {
    if (nameAsArray) {
        return <>{renderInputArray(name, checked)}</>;
    }

    return <input name={name} type="hidden" value={checked.join(',')} />;
}

HiddenInput.propTypes = propTypes;

export default HiddenInput;
