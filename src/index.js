import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App';

import '@icon-park/react/styles/index.css'  //引入icon的全局样式
import './assets/less/index.less'           //引入自定义全局样式 base 和 reset



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);


