import React, { Component } from 'react';
import { message } from 'antd'
import axios from '@axios'
import Cookie from 'js-cookie';
import './Login.scss'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '', // 账号
            passWord: '' // 密码
        }
    }

    changeVal = (e, type) => {
        this.setState({ [type]: e.target.value });
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let { userName, passWord } = this.state;
        
        if (userName.trim().length === 0 || passWord.trim().length === 0)
            return message.error('账号或密码不能为空');

        axios.post('/admin/common/login', {
            userName,
            passWord
        })
            .then(({ data }) => {
                console.log(data);
                if (data.code !== '200') return message.error(data.message);

                Cookie.set('state', data.responseBody.data);

                message.success('登录成功');

                this.props.history.push('/sub1/100');

            })

    }

    render() {

        let { userName, passWord } = this.state
        let { changeVal, onSubmit } = this

        return (
            <div className="SignIn_main">

                <div className="SignIn_form_box">
                    <h4 className="SignIn_title">后台管理系统</h4>
                    <form
                        className="SignIn_form"
                        onSubmit={onSubmit}
                    >
                        <div className="SignIn_form_text">
                            <input
                                type="text"
                                className="Rectangle-2"
                                placeholder="请输入用户名"
                                value={userName}
                                onChange={e => changeVal(e, 'userName')}
                            />
                        </div>
                        <div className="SignIn_form_text" style={{ marginBottom: 18 }}>
                            <input
                                type="password"
                                className="Rectangle-2"
                                placeholder="请输入密码"
                                value={passWord}
                                onChange={e => changeVal(e, 'passWord')}
                            />
                        </div>
                        <button type="submit" className="SignIn_form_button">
                            登录
                        </button>
                    </form>
                </div>

            </div>
        )
    }
}

export default Login