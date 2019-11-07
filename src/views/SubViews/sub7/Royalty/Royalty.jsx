import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, message } from 'antd';
import axios from '@axios';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 提成记录
class Royalty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            times: [], // 时间
            page: 1, // 当前页码
            rows: 10, // 每页条数
            total: 1, // 总数
            royaltyType: '0', // 0全部-1充值2-产品购买3-预约分红 
            data: [], // 列表数据
        }

        this.columns = [ // 定义列表数据
            {
                title: '提成用户ID',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '提成渠道',
                dataIndex: 'age',
                align: 'center'
            },
            {
                title: '订单ID',
                dataIndex: 'address',
                align: 'center'
            },
            {
                title: '订单提成百分比',
                dataIndex: '1',
                align: 'center'
            },
            {
                title: '订单去成本合计',
                dataIndex: '2',
                align: 'center'
            },
            {
                title: '提成合计',
                dataIndex: '3',
                align: 'center'
            },
            {
                title: '提成时间',
                dataIndex: '4',
                align: 'center'
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        let { pageNum, pageSize, query, times, royaltyType } = this.state;
        axios.post('/admin/everydayRelease/list', {
            keyword: query,
            pageNum,
            pageSize,
            endTime: !times.length ? '' : times[1].format('YYYY-MM-DD'),
            startTime: !times.length ? '' : times[0].format('YYYY-MM-DD'),
            commissionChannel: royaltyType
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
        if (!v.trim()) return message.error('请输入用户ID');
        this.setState({ query: v }, () => this.init());
    }

    // 更改时间
    changeTime = date => this.setState({ times: date }, () => this.init());

    // 重置
    reset = () => this.setState({ query: '', times: [], pageNum: 1, royaltyType: '0' }, () => this.init())

    // 导出
    exportXlxs = () => {
        console.log('导出')
    }

    // 更改选择器
    changeSelect = v => this.setState({ royaltyType: v }, () => this.init());

    // 更改页码
    changePage = v => this.setState({ pageNum: v }, () => this.init())

    render() {
        return (
            <div className="view">

                {/* 顶部搜索框 */}
                <div className="searchLayer">
                    <div className="mb15">
                        <Search style={{ width: 250 }} placeholder="请输入用户ID" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                        <span className="ml15 tip mr15 mb15">释放时间:</span>
                        <RangePicker style={{ width: 250 }} value={this.state.times} onChange={this.changeTime} />
                        <Button type="primary" className="ml15" onClick={this.exportXlxs}>导出</Button>
                    </div>
                    <div className="mb15">
                        <span className="tip mr15 ">提成渠道:</span>
                        <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.royaltyType} onChange={this.changeSelect}>
                            <Option value="0">全部</Option>
                            <Option value="1">充值</Option>
                            <Option value="2">产品购买</Option>
                            <Option value="3">预约分红</Option>
                        </Select>
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
                            pageSize: this.state.rows,
                            onChange: this.state.changePage,
                            current: this.state.page,
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

export default Royalty