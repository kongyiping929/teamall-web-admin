import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, Modal, Icon, message } from 'antd';
import axios, {URL} from '@axios';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

// 提现申请
class Extract extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            times: [], // 时间
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 1, // 总数
            status: '', // 0 全部 1 申请中 2 成功 3 失败
            userType: '', // 0 全部 1 非管理 2 管理
            data: [], // 列表数据
        }

        this.columns = [ // 定义列表数据
            {
                title: '交易号',
                dataIndex: 'applyNo',
                align: 'center'
            },
            {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center'
            },
            {
                title: '管理员标识',
                dataIndex: 'userType',
                align: 'center',
                render: (t, r, i) => t == 1 ? '非管理员' : t == 2 ? '管理员' : ''
            },
            {
                title: '提现额度',
                dataIndex: 'withdrawQuota',
                align: 'center'
            },
            {
                title: '提现前余额',
                dataIndex: 'prewithdrawBalance',
                align: 'center'
            },
            {
                title: '手续费比例',
                dataIndex: 'serviceFeeRate',
                align: 'center'
            },
            {
                title: '手续费',
                dataIndex: 'serviceFee',
                align: 'center'
            },
            {
                title: '提现状态',
                dataIndex: 'status',
                align: 'center',
                render: (t, r, i) => t == 1 ? '申请中' : t == 2 ? '成功' : t == 3 ? '失败' : ''
            },
            {
                title: '交易建立时间',
                dataIndex: 'createdTime',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'q',
                align: 'center',
                render: text => <Button type="link" onClick={() => this.handleApply(text)}>确认处理</Button>
            }
        ]
    }
    componentDidMount() {
        this.init();
    }

    init = () => {
        let { pageNum, pageSize, times, query, status, userType } = this.state;
        axios.post('/admin/withdrawApply/list', {
            endTime: !times.length ? '' : times[1].format('YYYY-MM-DD'),
            keyword: query,
            pageNum,
            pageSize,
            startTime: !times.length ? '' : times[0].format('YYYY-MM-DD'),
            status: status, // 0 全部 1 申请中 2 成功 3 失败
            userType: userType, // 0 全部 1 非管理 2 管理
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
        if (!v.trim()) return message.error('请输入用户ID(绑定手机号)');
        this.setState({ query: v }, () => this.init());
    }

    // 更改时间
    changeTime = date => this.setState({ times: date }, ()=>this.init());

    // 重置
    reset = () => this.setState({ query: '', times: [], pageNum: 1, status: '' }, ()=>this.init())

    // 导出
    exportXlxs = () => {
        let { pageNum, pageSize, times, query, status, userType } = this.state;
        axios.post('/admin/withdrawApply/export', {
            keyword: query,
            pageNum,
            pageSize,
            status,
            userType,
            startTime: times.length ? times[0].format('YYYY-MM-DD') : '',
            endTime: times.length ? times[1].format('YYYY-MM-DD') : '',
         }).then(({data}) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            window.open(`${URL}${'admin/withdrawApply/export'}?keyword=${query}&pageNum=${pageNum}&pageSize=${pageSize}&startTime=${times.length ? times[0].format('YYYY-MM-DD') : ''}&endTime=${times.length ? times[1].format('YYYY-MM-DD') : ''}&status=${status}&userType=${userType}`,'_blank');
         });
    }

    // 更改选择器
    changeSelect = (v, field) => this.setState({ [field]: v },()=>this.init());

    // 更改页码
    changePage = v => this.setState({ pageNum: v },()=>this.init())

    // 确认处理
    handleApply = () => {
        confirm({
            title: '请确认是否操作?',
            content: (
                <div>
                    <TextArea placeholder="提款失败时必填" rows={3} />
                </div>
            ),
            maskClosable: true,
            okText: '提款成功',
            cancelText: '提款失败',
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
                        <Search style={{ width: 250 }} placeholder="请输入用户ID(绑定手机号)" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                        <span className="ml15 tip mr15 mb15">注册时间:</span>
                        <RangePicker style={{ width: 250, verticalAlign: "top" }} value={this.state.times} onChange={this.changeTime} />
                        <Button type="primary" className="ml15" onClick={this.exportXlxs}>导出</Button>
                    </div>
                    <div className="mb15">
                        <span className="tip mr15 ">状态:</span>
                        <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.status} onChange={v => this.changeSelect(v, 'status')}>
                            <Option value="">全部</Option>
                            <Option value="1">申请中</Option>
                            <Option value="2">成功</Option>
                            <Option value="3">失败</Option>
                        </Select>
                        <span className="ml15 tip mr15 ">管理员标识:</span>
                        <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.userType} onChange={v => this.changeSelect(v, 'userType')}>
                            <Option value="">全部</Option>
                            <Option value="1">非管理</Option>
                            <Option value="2">管理</Option>
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

export default Extract