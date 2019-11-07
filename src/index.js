import "@babel/polyfill"
import React from 'react'
import { render } from 'react-dom'
import * as serviceWorker from './serviceWorker'
import App from './App.jsx'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/index'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

import './assets/css/reset.css'
import './assets/css/base.css'

render(
    <Provider store={store}>
        <Router>
            <LocaleProvider locale={zhCN}>
                <Route path="/" component={App} />
            </LocaleProvider>
        </Router>
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
