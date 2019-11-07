import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { withRouter } from 'react-router-dom';
import subRoutes from '../../routes/subRoutes';

@withRouter
class Crumbs extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        let { pathname } = this.props.location;

        pathname = pathname.substr(1).split('/');

        let list = [], eleList = [];

        for (let i = 0; i < subRoutes.length; i++) {
            if (pathname[0] === subRoutes[i]['name']) {
                list[0] = subRoutes[i]['title'];
                for (let j = 0; j < subRoutes[i]['children'].length; j++) {
                    if (pathname[1] === subRoutes[i]['children'][j]['key']) {
                        list[1] = subRoutes[i]['children'][j]['title'];
                        break;
                    }
                }
                break;
            }
        }

        eleList = list.map((item, i) => (
            <Breadcrumb.Item key={ i }>{ item }</Breadcrumb.Item>
        ));
        
        return (
            <Breadcrumb>
                { eleList }
            </Breadcrumb>
        )
    }
}

export default Crumbs;