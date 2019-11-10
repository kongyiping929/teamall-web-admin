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
            info: {}, // 内容
            quota: 0,
            rate: 0,
            paramValue: '', // 输入框
        };

        this.columns = [
            {
                title: '预充值额度',
                align: 'center',
                dataIndex: 'quota',
                key: 'quota'
            },
            {
                title: '增值比例',
                align: 'center',
                dataIndex: 'rate',
                key: 'rate'
            },
            {
                title: '操作',
                align: 'center',
                dataIndex: 'dictTypeCode',
                key: 'dictTypeCode',
                render: (text, rowData, index) => text === 'INVESTMENT_QUOTA_0' ? null : (
                    <Button type="link" onClick={() => this.showModal(rowData)}>编辑额度</Button>
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
                this.setState({ data: data.responseBody.data});
            })
    }

    showModal = info => { // 显示模态框
        this.setState({
            isModel: true,
            info,
            quota: info.quota,
            rate: info.rate,
        });
    }

    handleOk = (e) => { // 模态框确认

        let { info, quota, rate } = this.state;

        if (!/^([0-9]\d*(\.\d*[1-9])?)/.test(quota)) return message.error('请输入正确的额度，大于0');

        if (!/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,4})?))$/.test(rate)) return message.error('请输入正确的增值比例，最多四位小数');

        let data = { dictTypeCode: info.dictTypeCode, quotaDictVo: { quota: Number(quota), rate: Number(rate)}}
        axios.post('/admin/rechargeOrder/updquota', data)
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                message.success(data.message);
                this.setState({
                    isModel: false,
                    info: {},
                    quota: 0,
                    rate: 0,
                }, () => this.init());
            })
    }

    handleCancel = (e) => { // 模态框取消
        this.setState({
            isModel: false,
            info: {},
            quota: 0,
            rate: 0,
        });
    }

    // 更改输入框值
    changeValue = (e, type) => this.setState({ [type]: e.target.value });

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
                        <Input placeholder="输入额度不能为0" style={{ width: '50%', marginLeft: 20 }} value={this.state.quota} onChange={e => this.changeValue(e, "quota")} />
                    </div>
                    <div>
                        <span className="ml20 optionTip" style={{ marginLeft: 70 }}>增值比例:</span>
                        <Input placeholder="输入额度不能为0" style={{ width: '50%', marginLeft: 20 }} value={this.state.rate} onChange={e => this.changeValue(e, "rate")} />
                    </div>

                </Modal>
            </div>
        )
    }
}

export default RechargeLimit;