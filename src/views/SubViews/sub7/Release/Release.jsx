import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, message } from 'antd';
import axios,{URL} from '@axios';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 每日释放记录
class Release extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            times: [], // 时间
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 1, // 总数
            data: [], // 列表数据
        }

        this.columns = [ // 定义列表数据
            {
                title: '释放用户 ID',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '增值余额',
                dataIndex: 'age',
                align: 'center'
            },
            {
                title: '每日释放百分比',
                dataIndex: 'address',
                align: 'center'
            },
            {
                title: '释放额度',
                dataIndex: '1',
                align: 'center'
            },
            {
                title: '释放前增值余额',
                dataIndex: '2',
                align: 'center'
            },
            {
                title: '释放时间',
                dataIndex: '3',
                align: 'center'
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        let { pageNum, pageSize, query, times } = this.state;
        axios.post('/admin/everydayRelease/list', {
            keyword: query,
            pageNum,
            pageSize,
            endTime: !times.length ? '' : times[1].format('YYYY-MM-DD'),
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
    searchQuery = v => console.log(v, this.state.query);

    // 更改时间
    changeTime = date => this.setState({ times: date });

    // 重置
    reset = () => this.setState({ query: '', times: [], page: 1, accountType: '0' })

    // 导出
    exportXlxs = () => {
        let { query, pageNum, times, pageSize } = this.state;
        axios.post('/admin/everydayRelease/export', {
            keyword: query,
            pageNum,
            pageSize,
            startTime: times.length ? times[0].format('YYYY-MM-DD') : '',
            endTime: times.length ? times[1].format('YYYY-MM-DD') : ''
         }).then(({data}) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            window.open(`${URL}${'admin/everydayRelease/export'}?keyword=${query}&pageNum=${pageNum}&pageSize=${pageSize}&startTime=${times.length ? times[0].format('YYYY-MM-DD') : ''}&endTime=${times.length ? times[1].format('YYYY-MM-DD') : ''}`,'_blank');
         });
    }

    // 更改页码
    changePage = v => this.setState({ pageNum: v })

    render() {
        return (
            <div className="view">

                {/* 顶部搜索框 */}
                <div className="searchLayer">
                    <div className="mb15">
                        <Search style={{ width: 250 }} placeholder="请输入用户ID(手机)" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                        <span className="ml15 tip mr15 mb15">释放时间:</span>
                        <RangePicker style={{ width: 250, "verticalAlign": "top" }} value={this.state.times} onChange={this.changeTime} />
                        <Button type="primary" className="ml15" onClick={this.exportXlxs}>导出</Button>
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

export default Release