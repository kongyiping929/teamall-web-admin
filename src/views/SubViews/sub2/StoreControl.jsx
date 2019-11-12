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
            query: localStorage.getItem("query") != null ? localStorage.getItem("query") : '', // 搜索
            childQuery: '', // 子页面搜索
            mapSearch: '', // 店铺位置搜索
            currentPage: localStorage.getItem("currentPage") != null ? Number(localStorage.getItem("currentPage")) : 1, // 当前页码
            total: 1, // 总数
            childPage: 1, // 当前页码
            pageSize: 10, // 每页条数
            childTotal: 1, // 总数
            province: localStorage.getItem("province") != null ? localStorage.getItem("province") : '0', // 省份下拉标识
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
            id: '', // 店铺id
            storeName: '', // 店铺名称
            proData: [{}], // 产品详情
            subdivideData: [{}], // 产品详情细分规格数据
            packagingData: [{}], // 产品详情包装规格数据
            linkChildFlag: true, // 子页面切换
            scrollTop: localStorage.getItem("scrollTop") != null ? localStorage.getItem("scrollTop") : 0
        }
        this.options = []

        this.columns = [ // 定义列表数据
            {
                title: '店铺ID',
                dataIndex: 'id',
                align: 'center'
            },
            {
                title: '店铺名称',
                dataIndex: 'shopName',
                align: 'center'
            },
            {
                title: '所属省份',
                dataIndex: 'provinceName',
                align: 'center'
            },
            {
                title: '详细地址',
                dataIndex: 'detailAddress',
                align: 'center'
            },
            {
                title: '建立时间',
                dataIndex: 'createdTime',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 't',
                align: 'center',
                render: (t, r, i) => (
                    <div>
                        <Button type="link" size="small" onClick={() => this.changeProductModal(false, r)}>店铺详情</Button>
                        <Button type="link" size="small" onClick={() => this.changeUpdate(true, r)}>店铺编辑</Button>
                        <Button type="link" size="small" onClick={() => this.changeDelete(true, r)}>店铺解除</Button>
                    </div>
                )
            }
        ]

    }

    componentWillMount() {
        this.init();
        localStorage.removeItem("currentPage");
        localStorage.removeItem("query");
        localStorage.removeItem("province");
        localStorage.removeItem("scrollTop");
        localStorage.removeItem("storeName");
    }
    

    init = () => {  // 初始化
        axios.post('/common/address/list', { // 所有省份
            id: '0'
        })
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                data.responseBody.data.unshift({
                    addrName: '全部',
                    id: '0'
                })
                this.setState({ provinceData: data.responseBody.data });
            })

        axios.post('/common/address/province/city/district') // 省市区
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                this.setState({ options: data.responseBody.data });
            })

        this.pageData()
    }

    pageData = () => { // 店铺页面数据
        let { currentPage, pageSize, query } = this.state;
        axios.post('/admin/shop/list', { // 页面数据
            pageNum : currentPage,
            pageSize ,
            shopName: query
        })
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                this.setState({
                    data: data.responseBody.data.list,
                    total: data.responseBody.data.total
                }, ()=>{ this.state.scrollTop > 0 && document.querySelector(`.index_view`).scrollTo(0, this.state.scrollTop) })
            })
    }

    // 切换子页面
    changeProductModal = (linkChildFlag, r) => {
        let {province , query, currentPage} = this.state;
        let scrollTop = document.querySelector(`.index_view`).scrollTop;
        localStorage.setItem("province", province);
        localStorage.setItem("query", query);
        localStorage.setItem("currentPage", currentPage);
        localStorage.setItem("scrollTop", scrollTop);
        localStorage.setItem("storeName", r.shopName);
        this.props.history.push({ pathname: `/sub2/200/${r.id}` });
    }
    

    // 店铺编辑
    changeUpdate = (e, r, type) => this.setState({ isModel: true, flagModal: type },()=>{
        axios.post('/admin/shop/get/info', {
            id: r.id
        }).then(({ data }) => {
            console.log(data);
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            let update = data.responseBody.data
            this.setState({
                platformName: update.shopName,
                number: update.servicePhone,
                place: update.detailAddress,
                radioCheck: update.defaultFlag,
                selectPlace: [`${update.provinceId}`, `${update.cityId}`, `${update.districtId}`]
            },() => console.log(this.state.selectPlace)
            )
        })
    })

    // 店铺解除
    changeDelete = (e, r) => {
        var that = this;
        confirm({
            title: '是否确认解除合作?',
            maskClosable: true,
            icon: <Icon type="warning" />,
            onOk() {
                axios.post('/admin/shop/updEnable', { 
                    id: r.id,
                    enable: 2
                }).then(({ data }) => {
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                    that.reset();
                })
            }
        });
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
    }

    // 平台、电话、详细地址input
    changeValue = (e, type) => {
        this.setState({ [type]: e.target.value.trim() })
        if (this.state.place !== e.target.value) return this.setState({ selcetGPS: [] })
    }

    // 重置
    reset = () => {
        this.setState({ query: '', currentPage: 1, province: '0' }, () => this.pageData());
    }

    // 添加店铺
    addStore = type => this.setState({ isModel: true, flagModal: type, selectPlace: [] })

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

    // 更改页码
    changePage = v => this.setState({ currentPage: v }, () => this.pageData())

    goBack = (linkChildFlag) => this.setState({ linkChildFlag });

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

    // 省市区下拉框
    onHandleChange = e => this.setState({ selectPlace: e })

    // 单选框，是否默认
    onChangeRadio = e => this.setState({ radioCheck: e.target.value })

    // 滚动获取信息
    scrollSelect = e => {
        let { pageNum } = this.state;
        if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
            pageNum += 1;
            this.setState({ pageNum }, () => this.mapSearchReq())
        }
    }

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
                <Fragment>
                    {/* 顶部搜索框 */}
                    <div className="searchLayer">
                        <div className="mb15">
                            <Search style={{ width: 250 }} placeholder="请输入店铺名称" value={this.state.query} onChange={e => this.changeQeury(e, 'father')} onSearch={e => this.searchQuery(e, 'father')} enterButton />
                            <Button type="primary" className="ml15" onClick={() => this.reset()}>重置</Button>
                            <Button type="primary" className="ml15" onClick={() => this.addStore('addStore')}>添加店铺</Button>
                        </div>
                        <div className="mb15">
                            <span className="tip mr15 ">省份:</span>
                            <Select style={{ width: 120 }} value={province} onChange={e => this.changeSelect(e, 'province')}>
                                {
                                    provinceData.map((v, i) => <Option key={v.id} value={v.id}>{v.addrName}</Option>)
                                }

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
                                pageSize: this.state.pageSize,
                                onChange: this.changePage,
                                current: this.state.currentPage,
                                hideOnSinglePage: true,
                                /* showQuickJumper: true, */
                                showTotal: () => `共 ${this.state.total} 条数据`
                            }}
                            rowKey={(record, index) => index}
                        />
                    </div>
                </Fragment>
                <Modal
                    title={this.state.flagModal === 'update' ? '店铺编辑' : '店铺添加'}
                    visible={this.state.isModel}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div className="mb15">
                        <span className="ml20 optionTip" style={{ marginLeft: 70 }}>店铺名称:</span>
                        <Input placeholder="请输入店铺名称" style={{ width: '50%', marginLeft: 20 }} value={this.state.platformName} onChange={e => this.changeValue(e, 'platformName')} />
                    </div>
                    <div className="mb15">
                        <span className="ml20 optionTip" style={{ marginLeft: 70 }}>服务电话:</span>
                        <Input placeholder="请输入服务电话" style={{ width: '50%', marginLeft: 20 }} value={this.state.number} onChange={e => this.changeValue(e, 'number')} type='number' />
                    </div>
                    <div className="mb15">
                        <span className="ml20 optionTip" style={{ marginLeft: 70 }}>店铺位置:</span>
                        <Cascader style={{ width: '50%', marginLeft: 20 }} value={selectPlace} options={options} onChange={this.onHandleChange} placeholder="请选择省市区" />
                        <span onClick={this.mapSearchReq} style={{ cursor: 'pointer', color: 'skyblue', marginLeft: 10 }}>搜索</span>
                        <Input placeholder="请输入详细地址" style={{ width: '50%', margin: '15px 0 0 157px' }} value={this.state.place} onChange={e => this.changeValue(e, 'place')} />
                    </div>
                    <div className="mb15">
                        <span className="ml20 optionTip" style={{ marginLeft: 70 }}>店铺GPS:</span>
                        <Select onPopupScroll={e => this.scrollSelect(e)} style={{ width: '50%', marginLeft: 20 }} value={selectCheckGPS ? selectCheckGPS : '点击搜索获取精准信息'} onChange={e => this.changeSelect(e, 'selectCheckGPS')}>
                            {
                                selcetGPS.map((v, i) => <Option key={v.id} value={v.id}>{v.title}</Option>)
                            }
                        </Select>
                    </div>
                    <div className="mb15">
                        <span className="ml20 optionTip" style={{ marginLeft: 70 }}>是否默认:</span>
                        <Radio.Group style={{ width: '50%', marginLeft: 20 }} onChange={this.onChangeRadio} value={this.state.radioCheck}>
                            <Radio value={1}>默认</Radio>
                            <Radio value={2}>非默认</Radio>
                        </Radio.Group>
                    </div>
                </Modal>

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