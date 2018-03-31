import React from 'react';
import ReactDOM from 'react-dom';

import BasicExample from './js/BasicExample';
import CustomIconsExample from './js/CustomIconsExample';
import DisabledExample from './js/DisabledExample';
import HiddenCheckboxesExample from './js/HiddenCheckboxesExample';
import NoCascadeExample from './js/NoCascadeExample';
import PessimisticToggleExample from './js/PessimisticToggleExample';
import LargeDataExample from './js/LargeDataExample';

ReactDOM.render(<BasicExample />, document.getElementById('basic-example'));
ReactDOM.render(<CustomIconsExample />, document.getElementById('custom-icons-example'));
ReactDOM.render(<DisabledExample />, document.getElementById('disabled-example'));
ReactDOM.render(<HiddenCheckboxesExample />, document.getElementById('hidden-checkboxes-example'));
ReactDOM.render(<NoCascadeExample />, document.getElementById('no-cascade-example'));
ReactDOM.render(<PessimisticToggleExample />, document.getElementById('pessimistic-toggle-example'));
ReactDOM.render(<LargeDataExample />, document.getElementById('large-data-example'));
