import React, { Component } from 'react';
import { Input, Button, DatePicker, Select, Table, Popover, Modal, Icon, message } from 'antd';
import axios from '@axios';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

// 微广场信息管理
class MessageAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            times: [], // 时间
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            squareId: '0', // 下拉数值，微广场ID
            total: 1, // 总数
            squareData: [], 
            data: [], // 列表数据

        }

        this.columns = [ // 定义列表数据
            {
                title: '记录ID',
                dataIndex: 'id',
                align: 'center'
            },
            {
                title: '广场名称',
                dataIndex: 'squareName',
                align: 'center'
            },
            {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center'
            },
            {
                title: '绑定订单号',
                dataIndex: 'orderNo',
                align: 'center'
            },
            {
                title: '发布图片',
                dataIndex: 'e',
                align: 'center',
                render: text => (
                    <Popover placement="bottom" content={(
                        <div style={{ width: 256 }}>
                            <img style={{ display: 'block', width: '100%' }} src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2723986986,1927550216&fm=26&gp=0.jpg" alt="" />
                        </div>
                    )} trigger="hover">
                        <Button onClick={this.lookIcon} type="link"> 查看</Button>
                    </Popover>
                )
            },
            {
                title: '发布内容',
                dataIndex: 'content',
                align: 'center',
                render: text => (
                    <Popover placement="bottom" content={(
                        <div style={{ width: 300 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.
                        </div>
                    )} trigger="hover">
                        <Button type="link"> 查看</Button>
                    </Popover>
                )
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                align: 'center'
            },
            {
                title: '领取优惠券ID',
                dataIndex: 'couponId',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'j',
                align: 'center',
                render: text => <Button type="link" onClick={() => {
                    confirm({
                        title: '是否确认隐藏?',
                        maskClosable: true,
                        icon: <Icon type="warning" />,
                        onOk() {
                            console.log('OK');
                        },
                        onCancel() {
                            console.log('Cancel');
                        },
                    })
                }}>隐藏</Button>
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

    init = async () => { // 初始化
        let { pageNum, pageSize } = this.state;
        await axios.post('/admin/microSquare/all/list').then(({data}) => { // 微广场下拉框所有数据
            if (data.code !== '200') return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            data.responseBody.data.unshift({
                squareId: '0',
                squareName: '全部'
            })
            this.setState({squareData: data.responseBody.data});
            
        })
        let dataList = {
            pageNum,
            pageSize,
        }

        this.axiosInit(dataList);
    }

    axiosInit = data => { // 微广场数据列表
        axios.post('/admin/microSquare/list', data).then(({ data }) => {
            if (data.code !== '200') return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

            this.setState({ data: data.responseBody.data.list, total: data.responseBody.data.total });
        })
    }

    lookIcon = r => {
        let data = {
            category: 2,
            resourceId: r.squareId,
            type: 201,

        }

        axios.post('/admin/microSquare/list', data)
            .then(({ data }) => {
                if (data.code !== '200') return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                console.log(data);

                // this.setState({
                //     proIcon: data.responseBody.data[0].url,
                //     squareIcon: data.responseBody.data[0].url,
                //     squarePhoto: data.responseBody.data[0].url,
                // })
            })

    }

    // 更改搜索框
    changeQeury = e => this.setState({ query: e.target.value.trim() });

    // 点击搜索
    searchQuery = v => {
        let { pageNum, pageSize } = this.state;
        this.axiosInit({ useId: v, pageNum, pageSize })
    }

    // 更改时间
    changeTime = date => {
        let { pageNum, pageSize } = this.state;
        this.axiosInit({
            startTime: date[0].format('YYYY-MM-DD'),
            endTime: date[1].format('YYYY-MM-DD'),
            pageNum,
            pageSize
        })
    }

    // 重置
    reset = () => this.setState({ query: '', times: [], pageNum: 1, squareId: '0' }, () => {this.init()})

    // 更改选择器
    changeSelect = v => {
        let { pageNum, pageSize } = this.state;
        this.axiosInit({
            squareId: v,
            pageNum,
            pageSize
        })
    }

    // 更改页码
    changePage = v => this.setState({ pageNum: v })

    render() {
        return (
            <div className="view">

                {/* 顶部搜索框 */}
                <div className="searchLayer">
                    <div className="mb15">
                        <Search style={{ width: 250 }} placeholder="请输入用户ID(绑定手机号)" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                        <span className="ml15 tip mr15 ">广场:</span>
                        <Select defaultValue='全部' style={{ width: 120 }} value={this.state.squareId} onChange={this.changeSelect}>
                            {
                                this.state.squareData.map(v => <Option key={v.squareId} value={v.squareId}>{v.squareName}</Option>)
                            }
                        </Select>
                        <span className="ml15 tip mr15 mb15">时间:</span>
                        <RangePicker
                            style={{ width: 250 }}
                            value={this.state.times}
                            onChange={this.changeTime}
                        />
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

export default MessageAdmin