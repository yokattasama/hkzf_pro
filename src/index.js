import React from 'react';
import ReactDOM from 'react-dom';
// import 'antd-mobile/dist/antd-mobile.css'
import 'react-virtualized/styles.css';
// 自己写的样式需要放在最后防止层叠
import './assets/fonts/iconfont.css'

// 为防止组件库样式覆盖自定义样式，将组件引用放到最后

import App from './App';
import './index.css';


ReactDOM.render(<App />, document.getElementById('root'));
