import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, Popover, Modal, message } from 'antd';
import axios from '@axios';
import { Number } from 'core-js';

const { Option } = Select;
const { confirm } = Modal;

const orderTypeArr = ['全部', '待支付', '待确认', '已确认', '已完成', '退款申请', '退款失败', '退款成功'];

// 优惠券
class DiscountCoupon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 1, // 总数
            storeType: '', // 作用类型 0 全部 1 产品类型 2 预约类型
            productTypeId: '', // 产品类型 0 全部 1 产品类型XX 2 产品类型XXX
            enable: '', // 启用状态 0 全部 1 启用 2 禁用
            data: [], // 列表数据
            productTypeList: [], // 产品类型数据
            modal: false, // 优惠券添加模态框 true 显示 false 隐藏
            effectType: '1', // 作用类型 0 产品购买 1 预约支付
            productType: '0', // 产品类型 0 全部 1 产品类型名称XX 2 产品类型名称XXX
            useLimit: '', // 使用额度
            discount: '', // 折扣
            derate: '', // 减额
            timeLimit: '', // 时限
            productTypeIdList: []
        }

        this.columns = [ // 定义列表数据
            {
                title: '优惠券ID',
                dataIndex: 'id',
                align: 'center',
                key: 1,
            },
            {
                title: '作用类型',
                dataIndex: 'scopeType',
                align: 'center',
                key: 2,
                render: (t, r, i) => (
                    <>
                        <span>{t == 1 ? "产品购买": "预约支付"}</span>
                    </>
                )
            },
            {
                title: '产品类型',
                dataIndex: 'productTypeId',
                align: 'center',
                key: 3,
                render: (t, r, i) => (
                    <>
                        <span>{t == 0 ? "全部": r.typeName}</span>
                    </>
                )
            },
            {
                title: '使用额度',
                dataIndex: 'useQuota',
                align: 'center',
                key: 4
            },
            {
                title: '折扣',
                dataIndex: 'discount',
                align: 'center',
                key: 5
            },
            {
                title: '减额',
                dataIndex: 'subtractQuota',
                align: 'center',
                key: 6
            },
            {
                title: '时限',
                dataIndex: 'validDay',
                align: 'center',
                key: 7
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                align: 'center',
                key: 8
            },
            {
                title: '启用状态',
                dataIndex: 'enable',
                align: 'center',
                key: 9,
                render: (t, r, i) => (
                    <>
                    {
                        t === 1 ? <span className="ant-btn-link">启用</span> : <span>禁用</span>
                    }
                    </>
                )
            },
            {
                title: '更新时间',
                dataIndex: 'updatedTime',
                align: 'center',
                key: 10
            },
            {
                title: '操作',
                align: 'center',
                key: 20,
                render: (t, r, i) => (
                    <>
                    {
                        r.enable === 1 ? <Button type="link" onClick={() => this.changeStatus(r)}>启用</Button> : <Button type="link" onClick={() => this.changeStatus(r)}>禁用</Button>
                    }
                    </>
                )
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        axios.post('/admin/productType/all/list') // 所有产品类型
            .then(({ data }) => {
                if (data.code !== '200') return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                this.setState({ 
                    productTypeIdList: [{
                        id: '',
                        typeName: '全部'
                    }].concat(data.responseBody.data),
                    productTypeList:  [{
                        id: '0',
                        typeName: '全部'
                    }].concat(data.responseBody.data),
                })
            })
            
            this.allDataAxios()
    }

    allDataAxios = () => { // 获取所有数据接口
        let { pageNum, pageSize, storeType, enable, productTypeId } = this.state;
        axios.post('/admin/coupon/list', {
            enable: enable,
            pageNum,
            pageSize,
            productTypeId: productTypeId,
            scopeType: storeType
        })
            .then(({ data }) => {
                if (data.code !== '200') return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                this.setState({ data: data.responseBody.data.list, total: data.responseBody.data.total })
            })
    }

    // 更改选择器
    changeSelect = (v, field) => this.setState({ [field]: v }, ()=>this.allDataAxios())

    // 更改页码
    changePage = v => this.setState({ pageNum: v });

    /**
     * 更改启用状态
     * @param {*} enable 1 为启用 2 禁用
     */
    changeStatus = r => {
        var that = this;
        confirm({
            title: `是否确认${r.enable == 1 ? "启用" : "禁用"}?`,
            maskClosable: true,
            onOk() {
                axios.post('/admin/coupon/updEnable', { 
                    id: r.id,
                    enable: r.enable == 1 ? 2: 1,
                }).then(({ data }) => {
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                    that.setState({ pageNum: 1, storeType: '', enable: '', productTypeId: '' }, () => that.init() );
                })
            }
        });
    }

    /**
     * 更改优惠券添加模态框
     * @param {*} status true 显示 false 隐藏
     * @memberof DiscountCoupon
     */
    changeModal = status => {
        if (!status) return this.setState({ modal: status, effectType: '1', productType: '0', useLimit: '', discount: '', derate: '', timeLimit: ''});
        this.setState({ modal: status });
    }

    // 更改选择器
    changeModalSelect = (v, field) => this.setState({ [field]: v })

    /**
     * 更改输入框值
     * @param {*} e 事件源
     * @param {*} field 字段名
     * @memberof DiscountCoupon
     */
    changeInput = (e, field) => this.setState({ [field]: e.target.value });

    // 确认添加
    handle = () => {
        let { useLimit, discount, derate, timeLimit, productType, effectType } = this.state;
        if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(useLimit)) return message.error('使用额度不能小于0');
        if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(discount)) return message.error('折扣不能小于0');
        if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(derate)) return message.error('满减不能小于0');
        if (!/^\+?[1-9][0-9]*$/.test(timeLimit)) return message.error('时限为非负整数');
        if (!Number(useLimit) && !Number(discount) && !Number(derate)) return message.error('使用额度、折扣或满减至少有一项不能为0');
        if (useLimit < 0 && discount < 0 && derate < 0) return message.error('使用额度、折扣或满减至少有一项不能小于0');
        if (!(/^-?\d+(\.\d{1,2})?$/.test(Number(discount)))) return message.error('折扣请按规则输入');

        axios.post('/admin/coupon/saveOrEdit', {
            discount: Number(discount),
            productTypeId: productType,
            scopeType: Number(effectType),
            subtractQuota: Number(derate),
            useQuota: Number(useLimit) ,
            validDay: Number(timeLimit)
        }).then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            message.success('添加成功')
            this.setState({ modal: false, effectType: '1', productType: '0', useLimit: '', discount: '', derate: '', timeLimit: '', productTypeId: '' },()=> this.init())
        })

        
    }

    render() {
        return (
            <div className="view">

                {/* 顶部搜索框 */}
                <div className="searchLayer">
                    <div className="mb15">
                        <span className="tip mr15">作用类型:</span>
                        <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.storeType} onChange={v => this.changeSelect(v, 'storeType')}>
                            <Option value="">全部</Option>
                            <Option value="1">产品购买</Option>
                            <Option value="2">预约支付</Option>
                        </Select>
                        <span className="ml15 tip mr15">产品类型:</span>
                        <Select defaultValue='全部' style={{ width: 160 }} onChange={v => this.changeSelect(v, 'productTypeId')}>
                            {
                                this.state.productTypeIdList.map(v => <Option key={v.id} value={v.id}>{v.typeName}</Option>)
                            }
                        </Select>
                        <span className="ml15 tip mr15">启用状态:</span>
                        <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.enable} onChange={v => this.changeSelect(v, 'enable')}>
                            <Option value="">全部</Option>
                            <Option value="1">启用</Option>
                            <Option value="2">禁用</Option>
                        </Select>
                        <Button type="primary" style={{ marginLeft: 40 }} onClick={() => this.changeModal(true)}>优惠券添加</Button>
                    </div>
                </div>

                {/* 列表 */}
                <div style={{ textAlign: 'center' }}>
                    <Table
                        bordered
                        dataSource={this.state.data}
                        columns={this.columns}
                        pagination={{
                            total: this.state.total,
                            pageSize: this.state.pageSize,
                            onChange: this.changePage,
                            current: this.state.pageNum,
                            hideOnSinglePage: true,
                            /* showQuickJumper: true, */
                            showTotal: () => `共 ${this.state.total} 条数据`
                        }}
                        rowKey={(record, index) => index}
                    />
                </div>

                {/* 优惠券添加 */}
                <Modal
                    title="优惠券添加"
                    visible={this.state.modal}
                    footer={null}
                    onCancel={() => this.changeModal(false)}
                    width={400}
                >
                    <div style={{ width: 400, marginBottom: 10 }}>
                        <span style={{ width: 60, marginRight: 20, display: 'inline-block' }}>作用类型</span>
                        <Select value={this.state.effectType} style={{ width: 120 }} onChange={v => this.changeModalSelect(v, 'effectType')}>
                            <Option value="1">产品购买</Option>
                            <Option value="2">预约支付</Option>
                        </Select>
                    </div>
                    <div style={{ width: 400, marginBottom: 10 }}>
                        <span style={{ width: 60, marginRight: 20, display: 'inline-block' }}>产品类型</span>
                        <Select value={this.state.productType} style={{ width: 160 }} onChange={v => this.changeModalSelect(v, 'productType')}>
                            {
                                this.state.productTypeList.map(v=> <Option key={v.id} value={v.id}>{v.typeName}</Option>)
                            }
                        </Select>
                    </div>
                    <div style={{ width: 400, marginBottom: 10 }}>
                        <span style={{ width: 60, marginRight: 20, display: 'inline-block' }}>使用额度</span>
                        <Input style={{ width: 250 }} placeholder="可填写0,满减额度" type="number" value={this.state.useLimit} onChange={e => this.changeInput(e, 'useLimit')} />
                    </div>
                    <div style={{ width: 400, marginBottom: 10 }}>
                        <span style={{ width: 60, marginRight: 20, display: 'inline-block' }}>折扣</span>
                        <Input style={{ width: 250 }} placeholder="可填写0,填写 0- 1 的小数,精度0.01" type="number" value={this.state.discount} onChange={e => this.changeInput(e, 'discount')} />
                    </div>
                    <div style={{ width: 400, marginBottom: 10 }}>
                        <span style={{ width: 60, marginRight: 20, display: 'inline-block' }}>减额</span>
                        <Input style={{ width: 250 }} placeholder="可填写0,扣取额度" type="number" value={this.state.derate} onChange={e => this.changeInput(e, 'derate')} />
                    </div>
                    <div style={{ width: 400, marginBottom: 20 }}>
                        <span style={{ width: 60, marginRight: 20, display: 'inline-block' }}>时限</span>
                        <Input style={{ width: 250 }} placeholder="填写整数" type="number" value={this.state.timeLimit} onChange={e => this.changeInput(e, 'timeLimit')} />
                    </div>
                    <div className="tc">
                        <Button type="primary" onClick={this.handle}>确认添加</Button>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default DiscountCoupon;