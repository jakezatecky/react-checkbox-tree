import React from 'react';
import ReactDOM from 'react-dom';

import BasicExample from './js/BasicExample';
import CustomIconsExample from './js/CustomIconsExample';
import DisabledExample from './js/DisabledExample';
import NoCascadeExample from './js/NoCascadeExample';
import PessimisticToggleExample from './js/PessimisticToggleExample';
import LargeDataExample from './js/LargeDataExample';
import SearchingExample from './js/SearchingExample';

ReactDOM.render(<BasicExample />, document.getElementById('basic-example'));
ReactDOM.render(<CustomIconsExample />, document.getElementById('custom-icons-example'));
ReactDOM.render(<DisabledExample />, document.getElementById('disabled-example'));
ReactDOM.render(<NoCascadeExample />, document.getElementById('no-cascade-example'));
ReactDOM.render(<PessimisticToggleExample />, document.getElementById('pessimistic-toggle-example'));
ReactDOM.render(<LargeDataExample />, document.getElementById('large-data-example'));
ReactDOM.render(<SearchingExample />, document.getElementById('searching-example'));
