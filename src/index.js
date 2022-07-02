import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App';

import '@icon-park/react/styles/index.css'  //引入icon的全局样式
import './assets/less/index.less'           //引入自定义全局样式 base 和 reset
import 'react-lazy-load-image-component/src/effects/blur.css';  //导入lazy-load的css

// resize 重新加载页面
window.onresize = () => {
  console.log('resize');
  window.location.reload()
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);


