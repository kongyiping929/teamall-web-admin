import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, message } from 'antd';
import axios, { URL } from '@axios';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 用户信息
class UserMes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            times: [], // 时间
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 1, // 总数
            todayCount: '', // 今日注册用户总数
            accountType: '0', // 0 全部 1 启用 2 封禁
            data: [], // 列表数据
            url: '', // 导出数据
        }

        this.columns = [ // 定义列表数据
            {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center'
            },
            {
                title: '绑定手机',
                dataIndex: 'mobile',
                align: 'center'
            },
            {
                title: '微信昵称',
                dataIndex: 'nickName',
                align: 'center'
            },
            {
                title: '账号启用状态',
                dataIndex: 'userStatus',
                align: 'center',
                render: (t, r, i) => t == 1 ? '启用' : t == 2 ? '禁用' : ''
            },
            {
                title: '注册时间',
                dataIndex: 'createdTime',
                align: 'center'
            },
            {
                title: '所属上级ID',
                dataIndex: 'supUserId',
                align: 'center'
            },
            {
                title: '所属销售ID',
                dataIndex: 'saleUserId',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'k',
                align: 'center',
                render: text => <Button type="link">封禁</Button>
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        let { pageNum, pageSize, times, query, accountType } = this.state;
        axios.post('/admin/user/list', {
            keyword: query,
            pageNum,
            pageSize,
            endTime: !times.length ? '' : times[1].format('YYYY-MM-DD'),
            startTime: !times.length ? '' : times[0].format('YYYY-MM-DD'),
            userStatus: accountType, 
        }).then(({ data }) => { // 获取列表数据
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

            this.setState({
                data: data.responseBody.data.page.list,
                total: data.responseBody.data.page.total,
                todayCount: data.responseBody.data.todayCount,
            })
        })
    }

    // 更改搜索框
    changeQeury = e => this.setState({ query: e.target.value.trim() });

    // 点击搜索
    searchQuery = v => {
        if (!v.trim()) return message.error('请输入用户ID(绑定手机号)');
        this.setState({ query: v }, () => this.init());
    }

    // 更改时间
    changeTime = date => this.setState({ times: date }, () => this.init());

    // 重置
    reset = () => this.setState({ query: '', times: [], pageNum: 1, accountType: '0' }, () => this.init())

    // 导出
    exportXlxs = () => {
        let { query, pageNum, times, pageSize, accountType } = this.state;

        // axios.get('/admin/user/export', {
        //     keyword: query,
        //     pageNum,
        //     pageSize,
        //     startTime: times.length ? times[0].format('YYYY-MM-DD') : '',
        //     endTime: times.length ? times[1].format('YYYY-MM-DD') : '',
        //     userStatus: accountType
        // }).then(({data}) => {
        //     console.log(data);
            
        //     this.setState({ url: data }, () => window.location.href = url)
        // })

        let url = `${URL}${'/admin/user/export'}?keyword=${query}&pageNum=${pageNum}&pageSize=${pageSize}&startTime=${times.length ? times[0].format('YYYY-MM-DD') : ''}&endTime=${times.length ? times[1].format('YYYY-MM-DD') : ''}&userStatus=${accountType}`;
        console.log(url);
        
        window.location.href = url;
    }

    // 更改选择器
    changeSelect = v => this.setState({ accountType: v }, () => this.init());

    // 更改页码
    changePage = v => this.setState({ pageNum: v }, () => this.init())

    render() {
        return (
            <div className="view">

                {/* 顶部搜索框 */}
                <div className="searchLayer">
                    <div className="mb15">
                        <Search style={{ width: 250 }} placeholder="请输入用户ID(绑定手机号)" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                        <span className="ml15 tip mr15 mb15">注册时间:</span>
                        <RangePicker style={{ width: 250, verticalAlign: "top" }} value={this.state.times} onChange={this.changeTime} />
                        <Button type="primary" className="ml15" onClick={this.exportXlxs}>导出</Button>
                    </div>
                    <div className="mb15">
                        <span className="tip mr15 ">启用状态:</span>
                        <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.accountType} onChange={this.changeSelect}>
                            <Option value="0">全部</Option>
                            <Option value="1">启用</Option>
                            <Option value="2">封禁</Option>
                        </Select>
                    </div>
                    <div>
                        <span className="tip mr15">注册用户总数: <i style={{ color: 'red' }}>{this.state.total}</i></span>
                        <span className="tip mr15">今日注册用户总数: <i style={{ color: 'red' }}>{this.state.todayCount}</i></span>
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

export default UserMes