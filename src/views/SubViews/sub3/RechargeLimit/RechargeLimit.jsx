import React, { Component } from 'react';
import { Table, Modal, Input, message, Button } from 'antd';
import axios from '@axios';

// 预充值额度管理
class RechargeLimit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModel: false, // 模态框
            data: [], // 数据
            info: null, // 内容
            paramValue: '', // 输入框
        };

        this.columns = [
            {
                title: '预充值额度',
                align: 'center',
                dataIndex: 'dictDesc',
                key: 'dictDesc'
            },
            {
                title: '增值比例',
                align: 'center',
                dataIndex: '2',
                key: '2'
            },
            {
                title: '操作',
                align: 'center',
                dataIndex: 'paramCode',
                key: 'paramCode',
                render: (text, rowData, index) => text === 'INVESTMENT_QUOTA_0' ? null : (
                    <Button type="link" onClick={() => this.showModal(rowData)}>编辑额度</Button>
                    // <span className='color' onClick={() => this.showModal(rowData)}>编辑额度</span>
                )
            }
        ];
    }

    componentWillMount() {
        this.init();
    }

    init = () => {
        axios.post('/admin/rechargeOrder/quota/list')
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                console.log(data);
                
                this.setState({ data: data.responseBody.data});
            })
    }

    showModal = info => { // 显示模态框

        let { paramValue } = this.setState;

        paramValue = info.paramValue;

        this.setState({
            isModel: true,
            info,
            paramValue
        });
    }

    handleOk = (e) => { // 模态框确认

        // let { info, paramValue } = this.state;

        // if (paramValue % 1 !== 0) return message.error('请输入整数');

        // let data = { paramValue, paramCode: info.paramCode };

        // axios.post('/rechargerecord/sysparam/quota/upd', data)
        //     .then(({ data }) => {
        //         if (data.status !== "200") return message.error(data.error);
        //         message.success('操作成功');
        //         this.setState({
        //             isModel: false,
        //             info: null,
        //             paramValue: ''
        //         }, () => this.init());
        //     })
    }

    handleCancel = (e) => { // 模态框取消
        this.setState({
            isModel: false,
            info: null,
            paramValue: ''
        });
    }

    // 更改输入框值
    changeValue = e => this.setState({ paramValue: e.target.value });

    render() {
        return (
            <div>
                <Table
                    rowKey={(r, i) => i}
                    columns={this.columns}
                    dataSource={this.state.data}
                    bordered
                    size="middle"
                    style={{ textAlign: 'center' }}
                    pagination={false}
                />
                <Modal
                    title="额度编辑"
                    visible={this.state.isModel}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="mb15">
                        <span className="ml20 optionTip" style={{ marginLeft: 70 }}>输入额度:</span>
                        <Input placeholder="输入额度不能为0" style={{ width: '50%', marginLeft: 20 }} value={this.state.paramValue} onChange={e => this.changeValue(e)} />
                    </div>
                    <div>
                        <span className="ml20 optionTip" style={{ marginLeft: 70 }}>增值比例:</span>
                        <Input placeholder="输入额度不能为0" style={{ width: '50%', marginLeft: 20 }} value={this.state.paramValue} onChange={e => this.changeValue(e)} />
                    </div>

                </Modal>
            </div>
        )
    }
}

export default RechargeLimit;