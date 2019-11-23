import React, { Component, Fragment } from 'react';
import { Input, Button, Select, Table, Modal, Icon, message, Cascader, Radio } from 'antd';
import axios from '@axios';

const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;

// 店铺管理
class StoreControl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageNum: 1, // 滚动分页
            isModel: false, // 店铺模态框
            proModel: false, // 产品详情模态框
            query: '', // 搜索
            childQuery: '', // 子页面搜索
            mapSearch: '', // 店铺位置搜索
            currentPage: 1, // 当前页码
            total: 1, // 总数
            childPage: 1, // 当前页码
            pageSize: 10, // 每页条数
            childTotal: 1, // 总数
            province: '0', // 省份下拉标识
            provinceData: [], // 省数据
            number: '', // 服务电话
            place: '', // 详细地址
            platformName: '', // 店铺名称
            flagModal: '', // 模态框标识
            options: [], // 省市区数据
            radioCheck: 1, // 是否默认
            selectPlace: [], // 选中的省市区id
            selcetGPS: [], // GPS
            selectCheckGPS: '', // 选中的店铺
            data: [], // 列表数据
            childData: [
                {}
            ], // 子数据列表
            id: props.match.params.id, // 店铺id
            storeName: localStorage.getItem("storeName") != null ? localStorage.getItem("storeName") : '', // 店铺名称
            proData: [{}], // 产品详情
            subdivideData: [{}], // 产品详情细分规格数据
            packagingData: [{}], // 产品详情包装规格数据
            linkChildFlag: true, // 子页面切换
        }
        this.options = []

      
        this.childColumns = [ // 子页面定义列表数据
            {
                title: '产品ID',
                dataIndex: 'productId',
                align: 'center'
            },
            {
                title: '产品名称',
                dataIndex: 'productName',
                align: 'center'
            },
            {
                title: '产品分类',
                dataIndex: 'typeName',
                align: 'center'
            },
            {
                title: '上架状态',
                dataIndex: 'productStatusDesc',
                align: 'center',
                render: (t, r, i) => (
                    <>
                        <span className="ant-btn-link">{t}</span>
                    </>
                )
            },
            {
                title: '状态更新时间',
                dataIndex: 'updatedTime',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: '3',
                align: 'center',
                render: (t, r, i) => (
                    <>
                        <Button type="link" size="small" onClick={() => this.changeProjectModal(true, r)}>产品详情</Button>
                        <Button type="link" size="small" onClick={() => this.upOrdown(true, r)}>下架</Button>
                    </>
                )
            }
        ]

        this.packagingColumns = [ // 产品详情包装规格列表数据
            {
                title: '包装规格',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '价格增加',
                dataIndex: 'addPrice',
                align: 'center',
                render: (t, r, i) => (
                    <>
                        <span>{t>0?"+"+t:t}</span>
                    </>
                )
            },
            {
                title: '成本增加',
                dataIndex: 'addCost',
                align: 'center',
                render: (t, r, i) => (
                    <>
                        <span>{t>0?"+"+t:t}</span>
                    </>
                )
            },
            {
                title: '库存',
                dataIndex: 'stockNum',
                align: 'center'
            }
        ]

        this.subdivideColumns = [ // 产品详情细分规格列表数据
            {
                title: '细分规格',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '价格增加',
                dataIndex: 'addPrice',
                align: 'center',
                render: (t, r, i) => (
                    <>
                        <span>{t>0?"+"+t:t}</span>
                    </>
                )
            },
            {
                title: '成本增加',
                dataIndex: 'addCost',
                align: 'center',
                render: (t, r, i) => (
                    <>
                        <span>{t>0?"+"+t:t}</span>
                    </>
                )
            },
            {
                title: '增值百分比增加',
                dataIndex: 'addIncrementRate',
                align: 'center',
                render: (t, r, i) => (
                    <>
                        <span>{t>0?"+"+t:t}</span>
                    </>
                )
            }
        ]
    }

    componentWillMount() {
        this.init();
    }
    

    init = () => {  // 初始化
        this.detailData();
        if(document.querySelectorAll('.ant-breadcrumb-link').length > 0){
            document.querySelectorAll('.ant-breadcrumb-link')[1].innerHTML = "店铺详情"
        }
    }


    // 产品详情页面列表数据
    detailData = () => {
        let { pageSize, childPage, id, childQuery } = this.state;
        axios.post('/admin/shop/product/list', { // 产品列表数据
            pageNum: childPage,
            pageSize,
            shopId: id,
            productName: childQuery,
        }).then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            this.setState({
                childData: data.responseBody.data.list,
                childTotal: data.responseBody.data.total
             })
        })
    }

    // 产品详情
    changeProjectModal = (status, r) => {
        this.setState({ proModel: status },()=>{
            axios.post('/admin/shop/get/productInfo', { // 产品详情
                productId: r.productId,
                shopId: this.state.id
            }).then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                this.setState({
                    proData: data.responseBody.data.list
                }) 
            })
        })
    }

    // 更改搜索框
    changeQeury = (e, type) => {
        if (type === 'father') this.setState({ query: e.target.value.trim() });
        if (type === 'child') this.setState({ childQuery: e.target.value.trim() });
    }

    // 点击搜索店铺位置
    mapSearchReq = () => {
        let { selectPlace, place, pageNum, selcetGPS } = this.state;
        if (!place.trim()) return message.error('请输入详细地址');

        axios.post('/admin/shop/queryAddress', {
            cityId: selectPlace[1],
            detailAddress: place,
            districtId: selectPlace[2],
            provinceId: selectPlace[0],
            pageNum,
            pageSize: 20
        }).then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            debugger
            selcetGPS.push(...data.responseBody.data.data)
            this.setState({ selcetGPS })
        })
    }

    // 点击搜索
    searchQuery = (v, type) => {
        if (!v.trim()) return message.error('请输入店铺名称');
        let { currentPage, pageSize } = this.state;
        if (type === 'father') {
            axios.post('/admin/shop/list', {
                pageNum: currentPage,
                pageSize,
                shopName: !v.trim() ? '' : v
            }).then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                this.setState({
                    data: data.responseBody.data.list,
                    total: data.responseBody.data.total
                })
            })
        }
        if (type === 'child') {
            this.setState({
                productName: !v.trim() ? '' : v
            },()=>{
                this.detailData();
            })
        }
    }

    // 重置
    reset = (type) => {
        if (type === 'child') this.setState({ childQuery: '', childPage: 1 }, () => this.detailData());
    }

    // 下架
    upOrdown = (e, r) => {
        confirm({
            title: '是否确认下架?',
            maskClosable: true,
            icon: <Icon type="warning" />,
            onOk() {
                axios.post('/admin/shop/updProductStatus', { 
                    productId: r.productId,
                    productStatus: 2,
                    shopId: this.state.id
                }).then(({ data }) => {
                    console.log(data);
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                    console.log(data);
                    
                })
            }
        });
    }

    // 子页面更改选择器
    changeSelect = (e, type) => {
        let { currentPage, pageSize } = this.state;
        this.setState({ [type]: e }, () => {
            if (type == 'province') {
                axios.post('/admin/shop/list', {
                    pageNum: currentPage,
                    pageSize,
                    province: e
                }).then(({ data }) => {
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                    this.setState({
                        data: data.responseBody.data.list,
                        total: data.responseBody.data.total
                    })
                })
            }
        });
    }

    // 更改子页面页码
    childChangePage = v => this.setState({ childPage: v }, () => this.detailData())

    // 返回上一页
    goBack = () => {
        window.history.go(-1);  
    }

    // 确认
    handleOk = e => {
        let { platformName, number, options, selcetGPS, selectCheckGPS, selectPlace, radioCheck, place } = this.state;
        if (!platformName.trim()) return message.error('请输入店铺名称');
        if (!number.trim()) return message.error('请输入服务电话');
        if (!options.length) return message.error('请输入店铺位置');
        if (!selcetGPS.length) return message.error('请输入店铺GPS');
        for (let i = 0; i < selcetGPS.length; i++) {
            if (selectCheckGPS === selcetGPS[i].id) {
                console.log(selcetGPS[i].location);

                axios.post('/admin/shop/saveOrEdit', {
                    cityId: selectPlace[1],
                    defaultFlag: radioCheck,
                    detailAddress: place,
                    districtId: selectPlace[2],
                    lat: selcetGPS[i].location.lat,
                    lng: selcetGPS[i].location.lng,
                    provinceId: selectPlace[0],
                    servicePhone: number,
                    shopName: platformName
                }).then(({ data }) => {
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                    message.success('添加成功');

                    this.setState({
                        isModel: false,
                        platformName: '',
                        number: '',
                        place: '',
                        selcetGPS: [],
                        radioCheck: 1,
                        selectCheckGPS: '',
                        // selectPlace: [],
                        pageNum: 1
                    }, () => this.init());
                })
            }
        }
    }

    // 取消
    handleCancel = e => this.setState({
        isModel: false,
        mapSearch: '',
        platformName: '',
        number: '',
        place: '',
        selcetGPS: [],
        radioCheck: 1,
        selectCheckGPS: '',
        // selectPlace: [],
        pageNum: 1
    });

    // 单选框，是否默认
    onChangeRadio = e => this.setState({ radioCheck: e.target.value })

    // 产品详情模态框确认按钮
    handleProOk = e => {
        this.setState({
            proModel: false
        })
    }

    handleProCancel = status => this.setState({ proModel: status })

    render() {
        let { linkChildFlag, provinceData, province, options, selcetGPS, selectCheckGPS, proData, storeName, selectPlace } = this.state;
        return (
            <div className="view">
                {
                    <Fragment>
                        {/* 返回上一级 */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <Button type="primary" className="ml15" onClick={() => this.goBack(true)}> 返回上一级 </Button>
                            <div style={{ marginLeft: '20px', fontSize: '16px' }}>店铺名称: {storeName} </div>
                        </div>
                        {/* 顶部搜索框 */}
                        <div className="searchLayer">
                            <div className="mb15">
                                <Search style={{ width: 250 }} placeholder="请输入产品名称" value={this.state.childQuery} onChange={e => this.changeQeury(e, 'child')} onSearch={e => this.searchQuery(e, 'child')} enterButton />
                                <Button type="primary" className="ml15" onClick={() => this.reset('child')}>重置</Button>
                            </div>
                        </div>

                        {/* 列表 */}
                        <div style={{ textAlign: 'center' }}>
                            <Table
                                bordered
                                dataSource={this.state.childData}
                                columns={this.childColumns}
                                pagination={{
                                    total: this.state.childTotal,
                                    pageSize: this.state.pageSize,
                                    onChange: this.childChangePage,
                                    current: this.state.childPage,
                                    hideOnSinglePage: true,
                                    /* showQuickJumper: true, */
                                    showTotal: () => `共 ${this.state.childTotal} 条数据`
                                }}
                                rowKey={(record, index) => index}
                            />
                        </div>
                    </Fragment>
                }

                <Modal
                    title='产品详情'
                    visible={this.state.proModel}
                    onOk={this.handleProOk}
                    onCancel={() => this.handleProCancel(false)}
                    width={650}
                >
                    {
                        proData.map((v, i) =>
                            <div key={i}>
                                <p style={{margin: '10px 0'}}>
                                    <span style={{ fontWeight: 'bold' }}>规格名称:</span> <span>水电费水电费</span> &nbsp;&nbsp;
                                    <span style={{ fontWeight: 'bold' }}>价格:</span> <span>水电费水电费</span> &nbsp;&nbsp;
                                    <span style={{ fontWeight: 'bold' }}>成本:</span> <span>水电费水电费</span> &nbsp;&nbsp;
                                    <span style={{ fontWeight: 'bold' }}>增值百分比:</span> <span>水电费水电费</span> &nbsp;&nbsp;
                                </p>
                                <Table
                                    bordered
                                    dataSource={v.lineList}
                                    columns={this.subdivideColumns}
                                    rowKey={(record, index) => index}
                                    pagination={false}
                                />
                                <Table
                                    bordered
                                    dataSource={v.packageList}
                                    columns={this.packagingColumns}
                                    style={{ marginTop: 10}}
                                    pagination={false}
                                    rowKey={(record, index) => index}
                                />
                            </div>
                        )
                    }

                </Modal>
            </div>
        )
    }
}

export default StoreControl