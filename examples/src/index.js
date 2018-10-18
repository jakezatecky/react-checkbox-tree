import React from 'react';
import ReactDOM from 'react-dom';

import BasicExample from './js/BasicExample';
import CustomIconsExample from './js/CustomIconsExample';
import ClickableLabelsExample from './js/ClickableLabelsExample';
import DisabledExample from './js/DisabledExample';
import ExpandAllExample from './js/ExpandAllExample';
import HiddenCheckboxesExample from './js/HiddenCheckboxesExample';
import NoCascadeExample from './js/NoCascadeExample';
import LargeDataExample from './js/LargeDataExample';
import PessimisticToggleExample from './js/PessimisticToggleExample';
import FilterExample from './js/FilterExample';

ReactDOM.render(<BasicExample />, document.getElementById('basic-example'));
ReactDOM.render(<CustomIconsExample />, document.getElementById('custom-icons-example'));
ReactDOM.render(<DisabledExample />, document.getElementById('disabled-example'));
ReactDOM.render(<NoCascadeExample />, document.getElementById('no-cascade-example'));
ReactDOM.render(<PessimisticToggleExample />, document.getElementById('pessimistic-toggle-example'));
ReactDOM.render(<ClickableLabelsExample />, document.getElementById('clickable-labels-example'));
ReactDOM.render(<HiddenCheckboxesExample />, document.getElementById('hidden-checkboxes-example'));
ReactDOM.render(<ExpandAllExample />, document.getElementById('expand-all-example'));
ReactDOM.render(<LargeDataExample />, document.getElementById('large-data-example'));
ReactDOM.render(<FilterExample />, document.getElementById('filter-example'));
