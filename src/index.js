import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './static/css/common.css';
import './static/css/reset.css';
import Root from './root';
import './componments/header.css';
import './componments/progress.css';
import './page/player.css';
import './componments/musiclistitem.css';
import './componments/cover.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
