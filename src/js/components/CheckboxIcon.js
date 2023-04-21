import PropTypes from 'prop-types';
import React from 'react';
import { IconContext } from '../contexts';

class CheckboxIcon extends React.PureComponent {
    static propTypes = {
        checked: PropTypes.number.isRequired,
        isRadioNode: PropTypes.bool.isRequired,
        noCascade: PropTypes.bool.isRequired,
    };

    static contextType = IconContext;

    render() {
        const { checked, isRadioNode, noCascade } = this.props;

        const {
            uncheck, check, halfCheck, radioOn, radioOff,
        } = this.context;

        if (isRadioNode) {
            if (checked === 0) {
                return radioOff;
            }

            return radioOn;
        }

        if (checked === 0) {
            return uncheck;
        }

        if (checked === 1 || (checked === 2 && noCascade)) {
            return check;
        }

        return halfCheck;
    }
}

export default CheckboxIcon;
