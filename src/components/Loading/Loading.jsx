import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import S from './Loading.module.scss';

@connect(
    state => ({ loading: state.loading })
)
class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return this.props.loading ? (
            <div className={S.container}>
                <div className={S.loading}>
                    <Spin tip="加载中..."></Spin>
                </div>
            </div>
        ) : null
    }
}

export default Loading;