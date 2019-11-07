import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, Popover, Modal, message } from 'antd';
import axios from '@axios';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

const orderTypeArr = ['全部', '待支付', '待确认', '已确认', '已完成', '退款申请', '退款失败', '退款成功'];

// 预定订单管理
class ReserveOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            times: [], // 时间
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 0, // 总数
            storeType: '0', // 店铺类型 0 全部 
            orderType: '0', // 订单类型 orderTypeArr
            ditchType: '0', // 类型 0 全部 1 定向 2 邀请
            claimType: '1', // 订单时间类型 1 订单创建时间 2 订单预约时间
            allStore: [], // 产品类型
            data: [], // 列表数据
        }

        this.columns = [ // 定义列表数据
            {
                title: '订单ID',
                dataIndex: 'orderNo',
                align: 'center',
                key: 1,
            },
            {
                title: '发起渠道',
                dataIndex: 'initiationChannel',
                align: 'center',
                key: 2,
                render: text => text === 1 ? '定向' : text === 2 ? '用户' : ''
            },
            {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center',
                key: 3
            },
            {
                title: '购买产品',
                dataIndex: 'f',
                align: 'center',
                render: text => (
                    <Popover content={(
                        <div className="tc">
                            <p>产品名称 xxxxxxxxx</p>
                            <p>产品类型 xxxxxxx</p>
                            <p>产品规格 xxxxxxxxxxxx</p>
                            <p>细分规格 xxxxxxxxxx</p>
                        </div>
                    )} trigger="hover" placement="bottom">
                        <Button type="link">查看</Button>
                    </Popover>
                ),
                key: 4
            },
            {
                title: '订单备注',
                dataIndex: 'remark',
                align: 'center',
                render: text => text ? (
                    <Popover content={(
                        <div style={{ width: 300 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.
                        </div>
                    )} trigger="hover" placement="bottom">
                        <Button type="link">查看</Button>
                    </Popover>
                ) : null,
                key: 5
            },
            {
                title: '承接店铺',
                dataIndex: 'shopName',
                align: 'center',
                key: 6
            },
            {
                title: '预约单价',
                dataIndex: 'appointmentPrice',
                align: 'center',
                key: 7
            },
            {
                title: '预约人数',
                dataIndex: 'peopleNum',
                align: 'center',
                key: 8
            },
            {
                title: '合计价格',
                dataIndex: 'orderAmount',
                align: 'center',
                key: 9
            },
            {
                title: '优惠',
                dataIndex: 'subtractQuota',
                align: 'center',
                key: 10
            },
            {
                title: '实际支付价格',
                dataIndex: 'payAmount',
                align: 'center',
                key: 11
            },
            {
                title: '支付渠道',
                dataIndex: 'payChannel',
                align: 'center',
                key: 13,
                render: text => text === 1 ? '预存支付' : text === 2 ? '微信支付' : ''
            },
            {
                title: '预约时段',
                dataIndex: 'appointmentTime',
                align: 'center',
                key: 14
            },
            {
                title: '实际时段',
                dataIndex: 't',
                align: 'center',
                key: 21
            },
            {
                title: '预约销售ID',
                dataIndex: 'serviceUserId',
                align: 'center',
                key: 15
            },
            {
                title: '从属销售ID',
                dataIndex: 'saleUserId',
                align: 'center',
                key: 16
            },
            {
                title: '订单状态',
                dataIndex: 'orderStatus',
                align: 'center',
                render: text => orderTypeArr[Number(text)],
                key: 17
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                align: 'center',
                key: 18,
            },
            {
                title: '更新时间',
                dataIndex: 'updatedTime',
                align: 'center',
                key: 19,
            },
            {
                title: '操作',
                dataIndex: 'p',
                align: 'center',
                key: 20,
                render: text => {
                    let affirm = <Button type="link" onClick={() => this.handleAffirm(text)}>订单确认</Button>;
                    let refund = <Button type="link" onClick={() => this.handleRefund(text)}>退款</Button>;
                    let btnArr = [
                        '',
                        '',
                        (
                            <div>{affirm}{refund}</div>
                        ),
                        refund, '', '', '', ''
                    ]
                    return btnArr[Number(text)]
                }
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        axios.post('/admin/shop/all/list').then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            data.responseBody.data.unshift({
                id: '0',
                shopName: '全部'
            })

            this.setState({
                allStore: data.responseBody.data,
            })
        })

        this.allDataAxios()
    }

    // 获取列表数据接口
    allDataAxios = () => {
        let { pageNum, pageSize, storeType, orderType, ditchType, claimType, times, query } = this.state;

        let allData = { // 所有数据
            pageNum,
            pageSize,
            shopId: storeType, // 店铺类型 0 全部 
            orderStatus: orderType, // 订单类型 orderTypeArr
            initiationChannel: ditchType, // 发起渠道类型 1-定向 2-用户3-邀请 ,
            timeType: claimType, // 订单时间类型 1 订单创建时间 2 订单预约时间
            startTime: !times.length ? '' : times[0].format('YYYY-MM-DD'),
            endTime: !times.length ? '' : times[1].format('YYYY-MM-DD'),
            keyword: query.trim()
        }

        axios.post('/admin/productOrder/list', allData).then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            this.setState({
                data: data.responseBody.data.list,
                total: data.responseBody.data.total
            })
        })
    }

    // 更改搜索框
    changeQeury = e => this.setState({ query: e.target.value.trim() });

    // 点击搜索
    searchQuery = v => {
        if (!v.trim()) return message.error('请输入要搜索的订单ID或者用户ID');
        this.setState({ query: v }, () => this.allDataAxios());
    }

    // 更改时间
    changeTime = date => this.setState({ times: date },()=>this.allDataAxios());

    // 重置
    reset = () => this.setState({ query: '', times: [], pageNum: 1, storeType: '0', orderType: '0', ditchType: '0', claimType: '1' },()=> this.allDataAxios());

    // 导出
    exportXlxs = () => {
        console.log('导出')
    }

    // 更改选择器
    changeSelect = (v, field) => this.setState({ [field]: v },()=>this.allDataAxios());

    // 更改页码
    changePage = v => this.setState({ pageNum: v },()=>this.allDataAxios());

    // 订单确认
    handleAffirm = id => {
        confirm({
            title: '是否确认该预约订单?',
            cancelText: '拒绝',
            okText: '确认',
            maskClosable: true,
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    // 退款
    handleRefund = id => {
        confirm({
            title: '是否确认退款?',
            cancelText: '拒绝退款',
            okText: '确认退款',
            maskClosable: true,
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        return (
            <div className="view">

                {/* 顶部搜索框 */}
                <div className="searchLayer">
                    <div className="mb15">
                        <Search style={{ width: 250 }} placeholder="请输入用户ID(绑定手机号)" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                        <Select defaultValue="lucy" style={{ width: 140, marginLeft: 15, marginRight: 15 }} value={this.state.claimType} onChange={v => this.changeSelect(v, 'claimType')}>
                            <Option value="1">订单创建时间</Option>
                            <Option value="2">订单预约时间</Option>
                        </Select>
                        <RangePicker style={{ width: 250 }} value={this.state.times} onChange={this.changeTime} />
                        <Button type="primary" className="ml15" onClick={this.exportXlxs}>导出</Button>
                    </div>
                    <div className="mb15">
                        <span className="tip mr15">店铺:</span>
                        <Select style={{ width: 120 }} value={this.state.storeType} onChange={v => this.changeSelect(v, 'storeType')}>
                            {
                                this.state.allStore.map(v => <Option key={v.id} value={v.id}>{v.shopName}</Option>)
                            }
                        </Select>
                        <span className="ml15 tip mr15">订单状态:</span>
                        <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.orderType} onChange={v => this.changeSelect(v, 'orderType')}>
                            {
                                orderTypeArr.map((item, index) => (<Option value={`${index}`} key={index}>{item}</Option>))
                            }
                        </Select>
                        <span className="ml15 tip mr15">类型:</span>
                        <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.ditchType} onChange={v => this.changeSelect(v, 'ditchType')}>
                            <Option value="0">全部</Option>
                            <Option value="1">定向</Option>
                            <Option value="2">用户邀请</Option>
                        </Select>
                    </div>
                    <div>
                        <span className="tip mr15">订单总数: <i style={{ color: 'red' }}>{this.state.total}</i></span>
                    </div>
                </div>

                {/* 列表 */}
                <div style={{ textAlign: 'center' }}>
                    <Table
                        bordered
                        dataSource={this.state.data}
                        columns={this.columns}
                        size="small"
                        pagination={{
                            total: this.state.total,
                            pageSize: this.state.pageSize,
                            onChange: this.state.changePage,
                            current: this.state.pageNum,
                            hideOnSinglePage: true,
                            showQuickJumper: true,
                            showTotal: () => `共 ${this.state.total} 条数据`
                        }}
                        rowKey={(record, index) => index}
                    />
                </div>

            </div>
        )
    }
}

export default ReserveOrder;