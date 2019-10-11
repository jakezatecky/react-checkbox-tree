import PropTypes from 'prop-types';
import React from 'react';

class NativeCheckbox extends React.PureComponent {
    static propTypes = {
        indeterminate: PropTypes.bool,
    };

    static defaultProps = {
        indeterminate: false,
    };

    componentDidMount() {
        this.updateDeterminateProperty();
    }

    componentDidUpdate() {
        this.updateDeterminateProperty();
    }

    updateDeterminateProperty() {
        const { indeterminate } = this.props;

        this.checkbox.indeterminate = indeterminate;
    }

    render() {
        const props = { ...this.props };

        // Remove property that does not exist in HTML
        delete props.indeterminate;

        // Since we already implement space toggling selection,
        // the native checkbox no longer needs to be in the accessibility tree and in tab order
        // I.e, this is purely for visual rendering
        return <input {...props} ref={(c) => { this.checkbox = c; }} type="checkbox" aria-hidden tabIndex={-1} />;
    }
}

export default NativeCheckbox;
