import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; //Provider Component
import App from './components/App'; //Import our App
import store from './store';


ReactDOM.render(
    <Provider store = { store }>
      <App />
    </Provider>, 
    document.getElementById('root')
);