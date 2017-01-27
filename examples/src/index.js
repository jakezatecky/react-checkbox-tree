import React from 'react';
import ReactDOM from 'react-dom';

import BasicExample from './js/BasicExample';
import PessimisticToggleExample from './js/PessimisticToggleExample';

ReactDOM.render(<BasicExample />, document.getElementById('basic-example'));
ReactDOM.render(<PessimisticToggleExample />, document.getElementById('pessimistic-toggle-example'));
