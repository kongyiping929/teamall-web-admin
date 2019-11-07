import React, { Component } from 'react'
import Loading from './components/Loading/Loading.jsx'
import { Switch, Route } from 'react-router-dom'
import routes from './routes'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div id="app">
                { this.props.loading ? <Loading /> : null }
                <Switch>
                    {routes.map((route, key) => <Route path={route.path} component={route.component} key={key} />)}
                </Switch>
            </div>
        )
    }
}

export default App