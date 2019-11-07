import React, { Component, Fragment } from 'react';
import { Button, Table, Modal, Icon, Input, Select, message } from 'antd';
import axios from '@axios';

const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;

// 操作员管理
class Operator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 1, // 总数
            data: [], // 列表数据
            addInput: '', // 添加搜索输入框
            addSelect: '0', // 添加筛选器
            addSelectData: [], // 店铺下拉框数据
            addVisible: false, // 添加模态框
            userVisible: false, // 从属用户信息模态框
            query: '', // 搜索
            userData: [], // 用户数据
            userPage: 1, // 当前页码
            userRows: 10, // 每页条数
            userTotal: 1, // 总数
            operatorUserId: '', // 操作员用户id
            Num: '', // 从属随机用户数量
            userId: '', // 增加从属用户 
        }

        this.input = React.createRef()

        this.columns = [ // 定义列表数据
            {
                title: '用户ID',
                dataIndex: 'userId',
                align: 'center'
            },
            {
                title: '预约完成单量',
                dataIndex: 'appointmentNum',
                align: 'center'
            },
            {
                title: '产品销售单量',
                dataIndex: 'saleNum',
                align: 'center'
            },
            {
                title: '从属用户数量',
                dataIndex: 'userNum',
                align: 'center'
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'h',
                align: 'center',
                render: (text, record, index) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="link" onClick={() => this.changeUserModal(true, record)}>从属信息</Button>
                        <Button type="link" onClick={() => this.removeRelation(record)}>移除</Button>
                    </div>
                )
            }
        ]

        this.userColumns = [ // 定义用户列表数据
            {
                title: '用户ID',
                dataIndex: 'a',
                align: 'center'
            },
            {
                title: '30天产品订单数量合计',
                dataIndex: 's',
                align: 'center'
            },
            {
                title: '累计消费总额',
                dataIndex: 'd',
                align: 'center'
            },
            {
                title: '累计充值总额',
                dataIndex: 'f',
                align: 'center'
            }
        ]
    }

    componentDidMount() {
        this.init();
    }

     init = async () => { // 初始化
        let { pageSize, pageNum } = this.state;
        await axios.post('/admin/shopOperator/list', {
            pageSize,
            pageNum
        })
            .then(({data}) => {
                if (data.code !== '200') return message.error(data.message);

                this.setState({ data: data.responseBody.data.list, total: data.responseBody.total })
                
            })
        
        await axios.post('/admin/shop/all/list')
            .then(({ data }) => {
                if (data.code !== '200') return message.error(data.message);

                data.responseBody.data.unshift({
                    id: '0',
                    shopName: '全部'
                })

                this.setState({ addSelectData: data.responseBody.data })
            })
    }

    // 更改搜索框
    changeQeury = e => this.setState({ query: e.target.value.trim() });

    // 点击搜索
    searchQuery = v => console.log(v);

    // 重置
    reset = () => this.setState({ query: '' });

    // 更改页码
    changePage = v => this.setState({ page: v })

    // 更改字段text
    changeInput = (e, field) => this.setState({ [field]: e.target.value, query: e.target.value });

    // 更改选择器
    changeSelect = (value, field) => this.setState({ [field]: value, addSelect: value });

    // 移除关系
    removeRelation = id => {
        confirm({
            title: '是否确认移除?',
            maskClosable: true,
            icon: <Icon type="warning" />,
            onOk: () => {
                console.log(id);
                
                axios.post('/admin/shopOperator/remove', {
                    shopId: id.shopId,
                    userId: id.userId
                })
                    .then(({data}) => {
                        if (data.code !== '200') return message.error(data.message);

                        if (data.responseBody.code !== '1') return message.error(data.message);

                        message.success(data.responseBody.message)

                        this.init();
                        
                    })
                
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    // 更改添加模态框状态
    changeAddModal = (status, v) => {
        let { addSelect, query } = this.state; 
        if( v === 'send') {
            axios.post('/admin/shopOperator/add', {
                shopId: addSelect,
                userId: query
            })
                .then(({ data }) => {
                    if (data.code !== '200') return message.error(data.message);
                    
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message)

                    message.success('添加成功');

                    this.setState({ addSelect: '0', query: '' })

                    this.init();
                })
        }
        this.setState({ addVisible: status, });
    }

    // 更改从属信息模态框状态
    changeUserModal = (status, id) => {
        
        if (!status) return this.setState({ userVisible: status });

        this.setState({ userVisible: status, operatorUserId: Number(id.userId) })
    }

    // 更改用户分页
    userChangePage = v => this.setState({ userPage: v });

    // 搜索框
    searchUserId = v => this.setState({ query: v });

    // 随机从属input
    getUserData = (e, type) => {  
        if (type === 'random') this.setState({ Num: Number(e.target.value) });
        if (type === 'add') this.setState({ userId: Number(e.target.value) });
    }

    // 随机从属添加
    addRandom = type => {
        let { operatorUserId, Num, userId } = this.state;
        
        if(type == 'random') {
            axios.post('/admin/shopOperator/randSubUser', {
                operatorUserId,
                Num
            })
                .then(({ data }) => {
                    if (data.code !== '200') return message.error(data.message);

                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                    message.success('添加成功')

                })
        }

        if (type == 'add') {
            axios.post('/admin/shopOperator/addSubUser', {
                operatorUserId,
                userId
            })
                .then(({ data }) => {
                    if (data.code !== '200') return message.error(data.message);

                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                    message.success('添加成功')

                })
        }
        
    }
    render() {
        let { addSelectData, addSelect } =  this.state;
        return (
            <div className="view">

                {/* 顶部搜索框 */}
                <div className="searchLayer">
                    <div className="mb15">
                        <Button type="primary" onClick={() => this.changeAddModal(true)}>操作员添加</Button>
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

                {/* 添加模态框 */}
                <Modal
                    title="操作员添加"
                    visible={this.state.addVisible}
                    onCancel={() => this.changeAddModal(false)}
                    footer={null}
                    width={350}
                >
                    <div className="mt15 mb15">
                        <Search value={this.state.addInput} placeholder="输入用户ID/手机号" onChange={e => this.changeInput(e, 'addInput')} onSearch={value => this.searchUserId(value)} enterButton />
                    </div>
                    <div className="mb15">
                        <span className="mr15">店铺所属</span>
                        <Select value={addSelect} style={{ width: 200 }} onChange={v => this.changeSelect(v, 'addSelect')}>
                            {
                                addSelectData.map(v => <Option key={v.id} value={v.id}>{v.shopName}</Option>)
                            }
                        </Select>
                    </div>
                    <div className="tc mt15">
                        <Button type="primary" onClick={v => this.changeAddModal(false, 'send')}>确认添加</Button>
                    </div>
                </Modal>

                {/* 从属信息   */}
                <Modal
                    title="从属用户信息"
                    visible={this.state.userVisible}
                    onCancel={() => this.changeUserModal(false)}
                    footer={null}
                >
                    <div className="mb15">
                        <span>随机从属用户</span>
                        <Input style={{ width: 150, marginLeft: 15, marginRight: 15 }} onChange={e => this.getUserData(e, 'random')} placeholder="随机从属用户" />
                        <Button type="primary" onClick={() => this.addRandom('random')}>添加</Button>
                    </div>
                    <div className="mb15">
                        <span>增加从属用户</span>
                        <Input style={{ width: 150, marginLeft: 15, marginRight: 15 }} onChange={e => this.getUserData(e, 'add')} placeholder="先写用户ID" />
                        <Button type="primary" onClick={() => this.addRandom('add')}>添加</Button>
                    </div>
                    <div className="mb15">
                        <Search style={{ width: 250 }} placeholder="请输入用户ID" value={this.state.query} onChange={this.changeQeury} onSearch={this.searchQuery} enterButton />
                        <Button type="primary" className="ml15" onClick={this.reset}>重置</Button>
                    </div>
                    {/* 列表 */}
                    <div style={{ textAlign: 'center' }}>
                        <Table
                            bordered
                            dataSource={this.state.userData}
                            columns={this.userColumns}
                            pagination={{
                                total: this.state.userTotal,
                                pageSize: this.state.userRows,
                                onChange: this.state.userChangePage,
                                current: this.state.userPage,
                                hideOnSinglePage: true,
                                showQuickJumper: true,
                                showTotal: () => `共 ${this.state.userTotal} 条数据`
                            }}
                            size="small"
                            rowKey={(record, index) => index}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Operator