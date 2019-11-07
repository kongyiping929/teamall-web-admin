import React from 'react'
import Async from '../components/AsyncComponent/AsyncComponent'

const Home = Async(() => import('../views/Home/Home.jsx'))
const Login = Async(() => import('../views/Login/Login.jsx'))

export default [
    { path: '/login', component: Login },
    { path: '/', component: Home }
] 