import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, message } from 'antd';
import axios from '@axios';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

class DataMes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 1, // 总数
            data: [], // 列表数据
            releaseTotal: '', 
            withdrawBalanceTotal: '',
            withdrawTotal: '',
            fundsDiversionTotal: '',
            incrementBalanceTotal: '',
            movableBalanceTotal: '', 
        }

        this.columns = [ // 定义列表数据
            {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center'
            },
            {
                title: 'VIP等级',
                dataIndex: 'userLevel',
                align: 'center'
            },
            {
                title: '预充值余额',
                dataIndex: 'prechargeBalance',
                align: 'center'
            },
            {
                title: '增值余额',
                dataIndex: 'incrementBalance',
                align: 'center'
            },
            {
                title: '订单提成百分比',
                dataIndex: 'orderCommissionRatio',
                align: 'center'
            },
            {
                title: '每日释放百分比',
                dataIndex: 'everydayReleaseRatio',
                align: 'center'
            },
            {
                title: '30天产品订单数量合计',
                dataIndex: 'orderThirtydayTotal',
                align: 'center'
            },
            {
                title: '累计消费总额',
                dataIndex: 'consumeTotal',
                align: 'center'
            },
            {
                title: '累计充值总额',
                dataIndex: 'rechargeTotal',
                align: 'center'
            },
            {
                title: '提款余额',
                dataIndex: 'withdrawBalance',
                align: 'center'
            },
            {
                title: '累计提款总额',
                dataIndex: 'withdrawTotal',
                align: 'center'
            },
            {
                title: '累计释放总额',
                dataIndex: 'releaseTotal',
                align: 'center'
            },
            {
                title: '资金量分流',
                dataIndex: 'fundsDiversion',
                align: 'center'
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        let { pageNum, pageSize, query,  } = this.state;
        axios.post('/admin/userAccount/list', {
            keyword: query,
            pageNum,
            pageSize,
        }).then(({ data }) => { // 获取列表数据
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

            this.setState({
                data: data.responseBody.data.page.list,
                total: data.responseBody.data.page.total,
                releaseTotal: data.responseBody.data.releaseTotal, 
                withdrawBalanceTotal: data.responseBody.data.withdrawBalanceTotal,
            withdrawTotal: data.responseBody.data.withdrawTotal,
            fundsDiversionTotal: data.responseBody.data.fundsDiversionTotal,
            incrementBalanceTotal: data.responseBody.data.incrementBalanceTotal,
            movableBalanceTotal: data.responseBody.data.movableBalanceTotal
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

    // 重置
    reset = () => this.setState({ query: '', times: [], pageNum: 1, accountType: '0' }, () => this.init())

    // 导出
    exportXlxs = () => {
        console.log('导出')
    }

    // 更改页码
    changePage = v => this.setState({ pageNum: v }, () => this.init())

    render() {
        let {releaseTotal,withdrawBalanceTotal,withdrawTotal,fundsDiversionTotal,incrementBalanceTotal,movableBalanceTotal, } = this.state;
        return (
            <div className="view">

                {/* 顶部搜索框 */}
                <div className="searchLayer">
                    <div className="mb15">
                        <Search style={{ width: 250 }} placeholder="请输入用户ID(绑定手机号)" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                        <Button type="primary" className="ml15" onClick={this.exportXlxs}>导出</Button>
                    </div>
                    <div>
                        <span className="tip mr15">资金总量: <i style={{ color: 'red' }}>{releaseTotal}</i></span>
                        <span className="tip mr15">预释放总额: <i style={{ color: 'red' }}>{withdrawBalanceTotal}</i></span>
                        <span className="tip mr15">已释放总额: <i style={{ color: 'red' }}>{withdrawTotal}</i></span>
                        <span className="tip mr15">提款总额: <i style={{ color: 'red' }}>{fundsDiversionTotal}</i></span>
                        <span className="tip mr15">可提款余额: <i style={{ color: 'red' }}>{incrementBalanceTotal}</i></span>
                        <span className="tip mr15">可移资金总量: <i style={{ color: 'red' }}>{movableBalanceTotal}</i></span>
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

export default DataMes