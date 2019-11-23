import React, { Component } from 'react'
import { Dropdown, Avatar, message, Menu, Icon } from 'antd'
import './Header.scss'
import axios from '@axios';
import photo from '../../assets/img/touxiang.jpg'
import { withRouter } from 'react-router-dom'
import Cookie from 'js-cookie'

@withRouter
class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    logout = () => {
        axios.post('/admin/common/logout')
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                Cookie.remove('state')
                message.success('退出成功');
                this.props.history.push('/login')
            })
    }

    render() {

        const menu = (
            <Menu>
                <Menu.Item onClick={this.logout}>
                    退出
                </Menu.Item>
            </Menu>
        );

        return (
            <div className="header_container">
                <div className="fl header_left clearfix">
                    {/* <div className="header_logo">
                        <img src={ Logo } alt=""/>
                    </div> */}
                    <h1>后台管理系统</h1>
                </div>
                <div className="fr">
                    <Dropdown overlay={menu} placement="bottomCenter">
                        <div>
                            <Avatar src={photo} size="large" style={{ marginRight: 10 }} />
                            <Icon type="caret-down" />
                        </div>
                    </Dropdown>
                </div>
            </div>
        )
    }
}

export default Header;