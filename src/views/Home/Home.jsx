import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'
import Crumbs from '../../components/Crumbs/Crumbs'
import './Home.scss'
import subRoutes from '../../routes/subRoutes'
import Cookie from 'js-cookie'

const routesAll = subRoutes.map(route => route.children)
let routes = []

routesAll.forEach(parent => {
    parent.forEach(route => {
        routes.push(route)
    })
})

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        if (!Cookie.get('state')) return this.props.history.push('/login')

        let { pathname } = this.props.location

        pathname = pathname.substr(1).split('/')

        if (!pathname[0]) this.props.history.push('/sub1/100')
    }

    componentWillReceiveProps() {
        if (!Cookie.get('state')) return this.props.history.push('/login');
    }

    render() {
        return (
            <div className="index_page">

                <Header />

                <Sidebar />

                <div className="index_crumbs">
                    <Crumbs />
                </div>

                <div className="index_container">
                    <div className="index_view">
                        <Switch>
                            { routes.map(route => <Route path={ route.path } key={ route.key } component={ route.component ? route.component : null } />) }
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home