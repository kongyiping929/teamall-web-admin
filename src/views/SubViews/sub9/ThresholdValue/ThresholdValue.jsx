import React, { Component } from 'react';
import { Table, Modal, Input, message } from 'antd';
import axios from '@axios';

// 平台阈值管理
class ThresholdValue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModel: false, // 模态框
            data: [], // 数据
            info: {}, // 参数对象
            vipList: [ // vip参数
                {
                    vipLimit: '',
                    vipExtract: '',
                    vipRelease: ''
                },
                {
                    vipLimit: '',
                    vipExtract: '',
                    vipRelease: ''
                },
                {
                    vipLimit: '',
                    vipExtract: '',
                    vipRelease: ''
                },
                {
                    vipLimit: '',
                    vipExtract: '',
                    vipRelease: ''
                }
            ], // vip升级标准数据
            vipData: [ // vip字段名
                {
                    name: 'VIP2',
                    extract: '提成',
                    release: '释放'
                },
                {
                    name: 'VIP3',
                    extract: '提成',
                    release: '释放'
                },
                {
                    name: 'VIP4',
                    extract: '提成',
                    release: '释放'
                },
                {
                    name: 'VIP5',
                    extract: '提成',
                    release: '释放'
                },
            ]
        };

        this.columns = [
            {
                title: '参数名称',
                align: 'center',
                dataIndex: 'dictName',
                key: 'dictName'
            },
            {
                title: '当前设置值',
                align: 'center',
                dataIndex: 'dictValue',
                key: 'dictValue',
                render: (t, r) => r.dictName !== "每日释放开关" ? t : r.dictValue == 1 ? '启用' : r.dictValue == 0 ? '禁用' : ''
            },
            {
                title: '备注',
                align: 'center',
                dataIndex: 'dictRemark',
                key: 'dictRemark',
            },
            {
                title: '详情',
                align: 'center',
                dataIndex: 'dictDesc',
                key: 'dictDesc',
            },
            {
                title: '操作',
                align: 'center',
                dataIndex: '2',
                key: '2',
                render: (t, r, i) => (
                    <span className='color' onClick={r.dictName == "每日释放开关" ? () => this.tableClick(r) : e => this.showModal(JSON.parse(JSON.stringify(r)))}>{r.dictName == "每日释放开关" && r.dictValue == 0 ? '开启' : r.dictName == "每日释放开关" && r.dictValue == 1 ? '关闭' : '编辑'}</span>
                )
            }
        ];
    }

    componentWillMount() {
        this.init();
    }

    init = () => {
        axios.post('/admin/dict/threshold/list')
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                this.setState({ data: data.responseBody.data });
            })
    }

    onChange = e => { // 更改输入框
        let { info } = this.state;
        info.paramValue = Number(e.target.value)
        this.setState({ info });
    }

    limitChange = (e, i, type) => {
        let { vipList } = this.state;
        vipList[i][type] = Number(e.target.value)
        this.setState({ vipList })
    }

    showModal = info => { // 显示模态框
        if (info.dictName !== '每日释放开关') this.setState({
            isModel: true,
            info,
        });
    }
    
    // 每日释放
    tableClick = r => {
        let { info } = this.state;
        info.dictValue = r.dictValue == 0 ? 1 : r.dictValue == 1 ? 0 : '';
        this.setState({ info },()=> {
            axios.post('/admin/dict/updGenera', { 
                dictTypeCode: r.dictTypeCode,
                dictValue: info.dictValue
             })
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                message.success('编辑成功');
                this.setState({info: {}}, () => this.init());
            })
        })
    }

    handleOk = () => { // 模态框确认
        let { info, vipList } = this.state;
        if (info.dictName !== 'vip升级标准') {
            if ((info.dictRemark === '进度 0-0.001,可填写 0' && info.paramValue >= 0 && /^-?\d+(\.\d{1,3})?$/.test(info.paramValue)) || (info.dictRemark === '请填写0-1的小数，精度：0.0001' && info.paramValue < 1 && info.paramValue > 0 && /^-?\d+(\.\d{1,4})?$/.test(info.paramValue))) {
                axios.post('/admin/dict/updGenera', { ...info })
                    .then(({ data }) => {
                        if (data.code !== "200") return message.error(data.message);
                        if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                        message.success('编辑成功');
                        this.setState({
                            isModel: false,
                            info: {}
                        }, () => this.init());
                    })
            } else {
                message.error('请按照规则输入,1');
            }
        }

        for(let i =0; i< vipList.length; i++) {
            if (info.dictName === 'vip升级标准' && /^-?\d+(\.\d{1,4})?$/.test(vipList[i].vipExtract) && /^-?\d+(\.\d{1,4})?$/.test(vipList[i].vipRelease) && vipList[i].vipExtract >= 0 && vipList[i].vipRelease >= 0) {
                axios.post('/admin/dict/updVip', {
                    dictTypeCode: info.dictTypeCode,
                    list: vipList
                 })
                    .then(({ data }) => {
                        if (data.code !== "200") return message.error(data.message);
                        if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                        message.success('编辑成功');
                        this.setState({
                            isModel: false,
                            info: {}
                        }, () => this.init());
                    })

            } else {
                message.error('请按照规则输入,2');
                break;
            }
        }
    }

    handleCancel = () => { // 模态框取消
        this.setState({
            isModel: false,
            info: {}
        });
    }

    render() {
        let { info, vipList, vipData } = this.state;
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
                    title={info.dictName == "vip升级标准" ? 'vip升级标准' : '额度编辑'}
                    visible={this.state.isModel}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={info.dictName == "vip升级标准" ? '650px' : '250px'}
                >
                    {
                        info.dictName == "vip升级标准" ?
                            <>
                                <p>提成百分比,释放百分比可填 0-0.0001 精度的小数,可填 0</p>
                                {
                                    vipData.map((v, i) =>
                                        <div key={i} style={{ margin: '5px 0' }}>
                                            <span>{v.name} </span>
                                            <Input placeholder='输入升级时所需额度' onChange={e => this.limitChange(e, i, 'vipLimit')} value={vipList[i].vipLimit} style={{ width: 150, margin: '0 10px 0 5px' }} type="number" />
                                            <span >{v.extract} </span>
                                            <Input placeholder='输入提成百分比' onChange={e => this.limitChange(e, i, 'vipExtract')} value={vipList[i].vipExtract} style={{ width: 150, margin: '0 10px 0 5px' }} type="number" />
                                            <span>{v.release} </span>
                                            <Input placeholder='输入释放百分比' onChange={e => this.limitChange(e, i, 'vipRelease')} value={vipList[i].vipRelease} style={{ width: 150, margin: '0 10px 0 5px' }} type="number" />
                                        </div>
                                    )
                                }
                            </> : <Input value={this.state.info.paramValue} onChange={this.onChange} type="number" />
                    }

                </Modal>

            </div>
        )
    }
}

export default ThresholdValue;