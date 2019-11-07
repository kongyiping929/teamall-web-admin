import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import './Sidebar.scss';
import menuData from '../../routes/subRoutes';
import { withRouter } from 'react-router-dom';
const SubMenu = Menu.SubMenu;

@withRouter
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openKeys: ['sub1']
        };

        this.rootSubmenuKeys = menuData.map(item => item.name);
    }

    componentWillMount() {
        let { pathname } = this.props.location;

        pathname = pathname.substr(1).split('/');

        if (pathname[0] === '') return;

        this.setState({ openKeys: [pathname[0]] });
    }

    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    handleClick = (e) => {

    }

    render() {

        let { pathname } = this.props.location;

        pathname = pathname.substr(1).split('/');

        return (
            <Menu
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.handleClick}
                style={{ width: 240 }}
                selectedKeys={[pathname[1]]}
                mode="inline"
                className="sidebar_container"
            >
                {
                    menuData.map((sub, i) => (
                        <SubMenu key={sub.name} title={sub.title}>
                            {
                                sub.children.map((item, index) => (
                                    <Menu.Item key={item.key}>
                                        <Link to={item.path}>{item.title}</Link>
                                    </Menu.Item>
                                ))
                            }
                        </SubMenu>
                    ))
                }
            </Menu>
        );
    }
}

export default Sidebar;