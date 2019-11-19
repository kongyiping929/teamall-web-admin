import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, Modal, Icon, message } from 'antd';
import axios,{ URL } from '@axios';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

// 充值记录
class Recharge extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            times: [], // 时间
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 1, // 总数
            data: [
                {
                    a: 1,
                    s: 2,
                    d: 3,
                    f: 4,
                    g: 5,
                    h: 6,
                    j: 7,
                    k: 8,
                    l: 9
                }
            ], // 列表数据
        }

        this.columns = [ // 定义列表数据
            {
                title: '交易号',
                dataIndex: 'orderNo',
                align: 'center'
            },
            {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center'
            },
            {
                title: '充值前余额',
                dataIndex: 'preBalance',
                align: 'center'
            },
            {
                title: '预充值额度',
                dataIndex: 'orderAmount',
                align: 'center'
            },
            {
                title: '增值额比例',
                dataIndex: 'incrementQuotaRate',
                align: 'center'
            },
            {
                title: '增值额度',
                dataIndex: 'incrementQuota',
                align: 'center'
            },
            {
                title: '实际支付',
                dataIndex: 'payAmount',
                align: 'center'
            },
            {
                title: '交易建立时间',
                dataIndex: 'createdTime',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'l',
                align: 'center',
                render: text => <Button type="link" onClick={() => this.refund(text)}>退款</Button>
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        let { pageNum, pageSize, times, query } = this.state;
        axios.post('/admin/rechargeOrder/list', {
            endTime: !times.length ? '' : times[1].format('YYYY-MM-DD'),
            keyword: query,
            pageNum,
            pageSize,
            startTime: !times.length ? '' : times[0].format('YYYY-MM-DD'),
        }).then(({ data }) => { // 获取列表数据
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
        if (!v.trim()) return message.error('请输入用户ID(手机),交易号');
        this.setState({ query: v }, () => this.init());
    }

    // 更改时间
    changeTime = date => this.setState({ times: date }, () => this.init());

    // 重置
    reset = () => this.setState({ query: '', times: [], pageNum: 1, accountType: '0' }, ()=> this.init())

    // 导出
    exportXlxs = () => {
        let { query, pageNum, times, pageSize } = this.state;
        axios.post('/admin/rechargeOrder/export', {
            keyword: query,
            pageNum,
            pageSize,
            startTime: times.length ? times[0].format('YYYY-MM-DD') : '',
            endTime: times.length ? times[1].format('YYYY-MM-DD') : '',
         }).then(({data}) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            window.open(`${URL}${'admin/rechargeOrder/export'}?keyword=${query}&pageNum=${pageNum}&pageSize=${pageSize}&startTime=${times.length ? times[0].format('YYYY-MM-DD') : ''}&endTime=${times.length ? times[1].format('YYYY-MM-DD') : ''}`,'_blank');
         });
    }

    // 更改页码
    changePage = v => this.setState({ pageNum: v }, this.init())

    // 退款
    refund = id => {
        confirm({
            title: '是否确认退款?',
            maskClosable: true,
            icon: <Icon type="warning" />,
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
                        <Search style={{ width: 250 }} placeholder="请输入用户ID(手机),交易号" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                        <span className="ml15 tip mr15 mb15">订单时间:</span>
                        <RangePicker style={{ width: 250, verticalAlign: "top" }} value={this.state.times} onChange={this.changeTime} />
                        <Button type="primary" className="ml15" onClick={this.exportXlxs}>导出</Button>
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
                
            </div>
        )
    }
}

export default Recharge