import React, { Component, Fragment } from 'react';
import { Input, Button, DatePicker, Select, Table, Modal, message, Pagination, Upload, Icon, Checkbox } from 'antd';
import axios from '@axios'
import { isNumber } from 'util';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// 产品信息管理
class ProductMsgCtrl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '', // 搜索
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页条数
            total: 1, // 产品总数
            sizeTotal: 1, // 规格总数
            royaltyType: '0', // 0 全部 1 启用 可预约 2 关闭 不可预约
            data: [], // 产品列表数据
            sizeData: [], // 规格列表数据
            selectData: [], // 下拉框数据
            defineSelect: '', // 编辑默认拉下数据
            productModal: false, // 产品分类模态框 true 显示 false 隐藏
            productTypeId: '', // 产品类型ID
            title: '', // 副标题
            productName: '', // 产品名称
            productPlane: '', // 产地
            productCompany: '', // 生产公司
            productExplain: '', // 产品说明
            sizeName: '', // 规格名称
            marketPrice: '', // 市场单价
            besicsPrice: '', // 基础单价
            costPrice: '', // 成本单价
            addPercent: '', // 增值百分比
            appointmentPrice: '', // 预约价格
            appointmentInput: false, // 预约输入框
            isAddProduct: 1, // 是否为添加产品 1 添加 2 编辑
            previewVisiblePr: false, // 预览modal
            previewImagePr: '', // 预览图片
            paramsNum: [], // 添加参数数据 细分类数据
            packageType: [], // 包装类型数据
            childFlag: true, // 子页面切换
            proName: '', // 规格界面产品名称
            proId: '', // 产品ID/规格添加需要
            proSizeId: '', // 产品规格ID
            particularsModal: false, // 规格添加编辑模态框 true 显示 false 隐藏
            updateUrlData: [], // 修改时照片url集合
            urlData: [], // 照片url集合
            fileList: [], // 上传文件列表
        }

        this.columns = [ // 定义列表数据
            {
                title: '产品ID',
                dataIndex: 'id',
                align: 'center'
            },
            {
                title: '产品类型',
                dataIndex: 'typeName',
                align: 'center'
            },
            {
                title: '产品操作状态',
                dataIndex: 'enableDesc',
                align: 'center'
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                align: 'center'
            },
            {
                title: '更新时间',
                dataIndex: 'updatedTime',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: '3',
                align: 'center',
                render: (t, r, i) => (
                    <>
                        <Button type="link" size="small" onClick={() => this.changeProductModal(true, 2, r)}>产品编辑</Button>
                        <Button type="link" size="small" onClick={() => this.changeStatusModal(true, r)}>{r.enable == 1 ? '禁用' : '启用'}</Button>
                        <Button type="link" size="small" onClick={() => this.particularsModal(r)}>规格详情</Button>
                    </>
                )
            }
        ]

        this.childColumns = [ // 定义子页面列表数据
            {
                title: '规格名称',
                dataIndex: 'specName',
                align: 'center'
            },
            {
                title: '规格市场价格',
                dataIndex: 'marketPrice',
                align: 'center'
            },
            {
                title: '规格基础价格',
                dataIndex: 'basePrice',
                align: 'center'
            },
            {
                title: '规格基础成本',
                dataIndex: 'costPrice',
                align: 'center'
            },
            {
                title: '基础增值百分比',
                dataIndex: 'incrementRate',
                align: 'center'
            },
            {
                title: '预约状态',
                dataIndex: 'appointmentStatusDesc',
                align: 'center'
            },
            {
                title: '创建时间',
                dataIndex: 'createdTime',
                align: 'center'
            },
            {
                title: '更新时间',
                dataIndex: 'updatedTime',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'other',
                align: 'center',
                render: (t, r, i) => <Button type="link" size="small" onClick={() => this.addParticulars(true, 2, r)}>规格编辑</Button>
            }
        ]
    }

    componentDidMount() {
        this.init()
    }

    init = () => {
        let { pageNum, pageSize } = this.state;
            axios.post('/admin/product/list', { // 获取所有数据
            enable: '',
            pageNum,
            pageSize
        }).then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

            this.setState({ data: data.responseBody.data.list, total: data.responseBody.data.total })
        })

        axios.post('/admin/productType/all/list').then(({ data }) => { // 获取所有产品类型
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            this.setState({ selectData: data.responseBody.data })
        })
    }

    // 子页面切换
    particularsModal = r => {
        axios.post('/admin/product/get/info', { // 获取产品名称
            id: r.id
        }).then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            let getData = data.responseBody.data
            this.setState({ proName: getData.productName, proId: getData.id, query: '' }, () => this.sizeList())
        })

        this.setState({ childFlag: false })
    }

    // 规格页面获取列表
    sizeList = () => {
        let { pageNum, pageSize, proId } = this.state;
        axios.post('/admin/productSpec/list', { // 获取列表
            appointmentStatus: '',
            pageNum,
            pageSize,
            productId: proId,
        }).then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

            this.setState({ sizeData: data.responseBody.data.list, sizeTotal: data.responseBody.data.total })
        })
    }

    // 返回上一页
    goBack = childFlag => this.setState({ childFlag, query: '' }, () => {
        if (this.state.royaltyType == '0') this.init()
        else this.axiosSelect()
    })

    // 规格编辑/添加
    addParticulars = (status, type, id) => {
        
        if (!status) return this.setState({
            particularsModal: status,
            isAddProduct: type,
            paramsNum: [],
            packageType: [],
            title: '', // 副标题
            productName: '', // 产品名称
            productPlane: '', // 产地
            productCompany: '', // 生产公司
            productExplain: '', // 产品说明
            fileList: [],
            sizeName: '', // 规格名称
            marketPrice: '', // 市场单价
            besicsPrice: '', // 基础单价
            costPrice: '', // 成本单价
            addPercent: '', // 增值百分比
            appointmentPrice: '', // 预约价格
            appointmentInput: false,
            updateUrlData: [],
            urlData: []
        })

        this.setState({
            particularsModal: status,
            isAddProduct: type,
            proSizeId: type == 2 ? id.productSpecId : ''
        }, () => {
            if (type == 2) {
                axios.post('/admin/productSpec/get/info', { // 获取列表
                    id: id.productSpecId
                }).then(({ data }) => {
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                    let update = data.responseBody.data;
                    this.setState({
                        appointmentInput: update.appointmentStatus == 1 ? true : false,
                        appointmentPrice: update.appointmentPrice,
                        sizeName: update.specName, // 规格名称
                        marketPrice: update.marketPrice, // 市场单价
                        besicsPrice: update.basePrice, // 基础单价
                        costPrice: update.costPrice, // 成本单价
                        addPercent: update.incrementRate, // 增值百分比
                        paramsNum: update.lineList.map(v => (
                            {
                                name: v.name,
                                addCost: v.addCost,
                                addIncrementRate: v.addIncrementRate,
                                addPrice: v.addPrice,
                                id: v.id
                            }
                        )), // 添加参数数据 细分类数据
                        packageType: update.packageList.map(v => (
                            {
                                name: v.name,
                                addCost: v.addCost,
                                addPrice: v.addPrice,
                                id: v.id
                            }
                        )), // 包装类型数据
                    })
                })
            }
        });
    }

    // 更改搜索框
    changeQeury = e => this.setState({ query: e.target.value.trim() });

    // 产品添加/编辑
    changeProductModal = (status, type, id) => {
        if (!status) return this.setState({
            productModal: status,
            isAddProduct: type,
            paramsNum: [],
            title: '',
            productName: '',
            productPlane: '',
            productCompany: '',
            productExplain: '',
            fileList: [],
            defineSelect: '',
            updateUrlData: [],
            urlData: [],
        })

        this.setState({
            productModal: status,
            isAddProduct: type,
            proId: type === 2 ? id.id : ''
        }, () => {
                if (type == 2) {
                axios.post('/admin/product/get/info', { // 编辑返回数据
                    id: id.id
                }).then(({ data }) => {
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                    let updata = data.responseBody.data

                    this.setState({
                        title: updata.subtitle,
                        productName: updata.productName,
                        productPlane: updata.productionPlace,
                        productCompany: updata.productionCompany,
                        productExplain: updata.description,
                        paramsNum: updata.otherParamList,
                        defineSelect: updata.productTypeId
                    })
                })
            }
        });
    }

    // 启用禁用
    changeStatusModal = (e, type) => {
        axios.post('/admin/product/updEnable', {
            enable: type.enable == 1 ? 2 : 1,
            id: type.id
        }).then(({ data }) => {
            if (data.code !== "200") return message.error(data.message);
            if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
            message.success('修改成功');
            if (this.state.royaltyType == '0') this.init()
            else this.axiosSelect()
        })
    }

    // 点击搜索
    searchQuery = (v, type) => {
        let { pageNum, pageSize, proId } = this.state;
        if (type == 'father') {
            axios.post('/admin/product/list', {
                enable: '',
                pageNum,
                pageSize,
                id: v
            }).then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                this.setState({ data: data.responseBody.data.list, total: data.responseBody.data.total })
            })
        }
        if (type == 'son') {
            axios.post('/admin/productSpec/list', {
                appointmentStatus: '',
                pageNum,
                pageSize,
                productId: proId,
                specName: v
            }).then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                this.setState({ sizeData: data.responseBody.data.list, sizeTotal: data.responseBody.data.total })
            })
        }
    }

    // 重置
    reset = (type) => this.setState({ query: '', pageNum: 1, royaltyType: '0' }, () => {
        if (type == 'father') this.init();
        if (type == 'son') this.sizeList();
    })

    // 更改选择器
    changeSelect = v => this.setState({ royaltyType: v, pageNum: 1 }, () => this.axiosSelect());

    axiosSelect = e => { // 更改选择器交互
        let { pageNum, pageSize, royaltyType } = this.state;

        let dataList = {
            enable: royaltyType === '0' ? '' : Number(royaltyType),
            pageNum,
            pageSize
        }

        let sizeList = {
            appointmentStatus: royaltyType === '0' ? '' : Number(royaltyType),
            pageNum,
            pageSize,
            productId: this.state.proId
        }

        if(this.state.childFlag) { // 产品
            axios.post('/admin/product/list', dataList)
                .then(({ data }) => {
                    if (data.code !== '200') return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                    this.setState({
                        data: data.responseBody.data.list,
                        total: data.responseBody.data.total,
                    })
                })
        }else { // 规格
            axios.post('/admin/productSpec/list', sizeList)
                .then(({ data }) => {
                    if (data.code !== '200') return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);

                    this.setState({
                        sizeData: data.responseBody.data.list,
                        sizeTotal: data.responseBody.data.total,
                    })
                })
        }

        
    }

    // 更改产品类型ID
    changeSelectType = v => this.setState({ productTypeId: v, defineSelect: v })

    // 更改页码
    changePage = v => this.setState({ pageNum: v }, () => this.init())

    // 更改产品分类输入框值
    changeProductInput = (e, field) => this.setState({ [field]: e.target.value });

    changeParamsInput = (e, i, field, type) => { // 更改参数数据
        let { paramsNum, packageType } = this.state;
        if (type === 'paramsNum') {
            if ((field == 'name' || field == 'content') && this.state.childFlag) {
                paramsNum[i][field] = e.target.value
            } else if (field == 'name') {
                console.log(field);
                
                paramsNum[i][field] = e.target.value
            }else if (!isNaN(e.target.value)) {
                paramsNum[i][field] = +e.target.value
            } else return message.error('请输入数字');
        }
        if (type === 'packageType') {
            if (field == 'name') {
                console.log(field);
                packageType[i][field] = e.target.value
            } else if (!isNaN(e.target.value)) {
                packageType[i][field] = +e.target.value
            } else return message.error('请输入数字');
        }
        this.setState({ paramsNum, packageType });
    }

    // 模态框确认
    handleProductModal = () => {
        let { urlData, updateUrlData, isAddProduct, title, productName, productPlane, productCompany, productExplain, paramsNum, productTypeId, royaltyType, childFlag, sizeName, marketPrice, besicsPrice, costPrice, addPercent, packageType, proId, appointmentPrice, appointmentInput, sizeData, defineSelect, proSizeId } = this.state;

        if (childFlag && isAddProduct == 1) { // 产品添加
            if (!title.trim()) return message.error('副标题不能为空');
            if (!productName.trim()) return message.error('产品名称不能为空');
            if (!productPlane.trim()) return message.error('产地不能为空');
            if (!productCompany.trim()) return message.error('生产公司不能为空');
            if (!productExplain.trim()) return message.error('产品说明不能为空');
            if (!urlData.length) return message.error('图片不能为空');

            var addList = { // 新增
                attachmentInfoList: urlData,
                productName,
                otherParamList: paramsNum,
                description: productExplain,
                productionCompany: productCompany,
                productionPlace: productPlane,
                subtitle: title,
                productTypeId
            }
        }

        if (childFlag && isAddProduct == 2) { // 产品编辑
            var updateList = { // 编辑
                attachmentInfoList: updateUrlData,
                productName,
                otherParamList: paramsNum,
                description: productExplain,
                productionCompany: productCompany,
                productionPlace: productPlane,
                subtitle: title,
                productTypeId: defineSelect,
                id: proId
            }
        }

        if (childFlag) { // 产品添加/修改
            axios.post('/admin/product/saveOrEdit', isAddProduct === 1 ? addList : updateList)
                .then(({ data }) => {
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                    message.success(isAddProduct === 1 ? '添加成功' : '修改成功');
                    if (royaltyType == '0') this.init()
                    else this.axiosSelect()
                })
        }

        if (!childFlag && isAddProduct == 1) { // 规格添加
            if (!sizeName.trim()) return message.error('规格名称不能为空');
            if (!marketPrice.trim()) return message.error('市场单价不能为空');
            if (!besicsPrice.trim()) return message.error('基础单价不能为空');
            if (!costPrice.trim()) return message.error('成本单价不能为空');
            if (!addPercent.trim()) return message.error('增值百分比不能为空');
            if (!packageType.length) return message.error('包装类型不能为空');
            if (!urlData.length) return message.error('图片不能为空');
            if (sizeData.length > 9) return message.error('每个产品最多9个规格')
            var addList = { // 新增
                attachmentInfoList: urlData,
                specName: sizeName,
                marketPrice: Number(marketPrice),
                basePrice: Number(besicsPrice),
                costPrice: Number(costPrice),
                incrementRate: Number(addPercent),
                lineList: paramsNum,
                packageList: packageType,
                productId: proId,
                appointmentPrice: Number(appointmentPrice),
                appointmentStatus: appointmentInput ? 1 : 2
            }
        }

        if (!childFlag && isAddProduct == 2) { // 规格编辑
            var updateList = { // 编辑
                attachmentInfoList: updateUrlData,
                specName: sizeName,
                marketPrice: Number(marketPrice),
                basePrice: Number(besicsPrice),
                costPrice: Number(costPrice),
                incrementRate: Number(addPercent),
                lineList: paramsNum,
                packageList: packageType,
                productId: proId,
                appointmentPrice: Number(appointmentPrice),
                appointmentStatus: appointmentInput ? 1 : 2,
                id: proSizeId
            }
        }

        if (!childFlag) { // 规格添加/修改
            axios.post('/admin/productSpec/saveOrEdit', isAddProduct === 1 ? addList : updateList)
                .then(({ data }) => {
                    if (data.code !== "200") return message.error(data.message);
                    if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                    message.success(isAddProduct === 1 ? '添加成功' : '修改成功');
                    console.log(royaltyType);
                    
                    if (royaltyType == '0') this.sizeList()
                    else this.axiosSelect()
                })
        }

        this.setState({
            productModal: false,
            particularsModal: false,
            paramsNum: [],
            packageType: [],
            title: '',  
            productName: '',
            productPlane: '',
            productCompany: '',
            productExplain: '',
            fileList: [],
            urlData: [],
            updateUrlData: [],
            defineSelect: '',
            sizeName: '', // 规格名称
            marketPrice: '', // 市场单价
            besicsPrice: '', // 基础单价
            costPrice: '', // 成本单价
            addPercent: '', // 增值百分比
            appointmentInput: false
        })
    }

    // 添加参数
    addParams = type => {
        let { paramsNum, childFlag, packageType } = this.state;
        if (paramsNum.length >= 9) return;

        if (childFlag) { // 产品
            paramsNum.push({
                name: '',
                content: ''
            })
        } else { // 规格
            if (type == 'xifen') paramsNum.push({ // 细分
                name: '',
                addCost: '',
                addIncrementRate: '',
                addPrice: ''
            })

            if (type == 'package') packageType.push({ // 包装
                name: '',
                addCost: '',
                addPrice: ''
            })
        }

        this.setState({ paramsNum, packageType })
    }
    // 删除参数
    delParams = (i, type) => {
        let { paramsNum, packageType, childFlag } = this.state;
        if (childFlag) paramsNum.splice(i, 1)
        if (type == 'xifen') paramsNum.splice(i, 1)
        if (type == 'package') packageType.splice(i, 1)
        this.setState({ paramsNum, packageType })
    }

    onAppointmentChange = e => { // 预约选择框
        this.setState({ appointmentInput: e.target.checked })
        if (!e.target.checked) this.setState({ appointmentPrice: '' })
    }

    // 图片蒙版
    handleCancel = () => this.setState({ previewVisiblePr: false });

    handlePreview = async file => { // 照片预览
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImagePr: file.url || file.preview,
            previewVisiblePr: true,
        });
    };

    handleChange = ({ file, fileList }) => { // 图片上传
        let { urlData, isAddProduct, updateUrlData } = this.state;
        if (file.type !== "image/png") return Modal.error({ title: '只能上传PNG格式的图片~' })
        // if (file.size / 1024 > 1) return Modal.error({ title: '超过1M限制，不允许上传~' })

        if (file.status === 'done') {
            this.setState({ fileList }, () => {
                if (fileList.length) {
                    axios.post('/common/file/upload', {
                        fileBase64Content: file.thumbUrl.split(',')[1],
                        fileName: file.name,
                    }).then(({ data }) => {
                        if (data.code !== "200") return message.error(data.message);
                        if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                        isAddProduct === 1 ? urlData.push({
                            url: data.responseBody.data,
                            name: file.name
                        }) : updateUrlData.push({
                            url: data.responseBody.data,
                            name: file.name
                        })
                        message.success('图片上传成功')
                        this.setState({ urlData, updateUrlData })
                    })
                }
            });
        }

        this.setState({ fileList })
    }

    getBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    render() {
        let { fileList, previewVisiblePr, previewImagePr, paramsNum, childFlag, appointmentInput, packageType, selectData, isAddProduct, defineSelect, proName } = this.state;

        return (
            <div className="view">
                {
                    childFlag ?
                        <Fragment>
                            {/* 顶部搜索框 */}
                            <div className="searchLayer">
                                <div className="mb15">
                                    <Search style={{ width: 250 }} placeholder="请输入用户ID(绑定手机号)" value={this.state.query} onChange={this.changeQeury} onSearch={e => this.searchQuery(e, 'father')} enterButton />
                                    <Button type="primary" className="ml15" onClick={() => this.reset('father')}>重置</Button>
                                    <Button type="primary" className="ml15" onClick={() => this.changeProductModal(true, 1)}>产品添加</Button>
                                </div>
                                <div className="mb15">
                                    <span className="tip mr15 ">状态:</span>
                                    <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.royaltyType} onChange={this.changeSelect}>
                                        <Option value="0">全部</Option>
                                        <Option value="1">启用</Option>
                                        <Option value="2">关闭</Option>
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
                                        current: this.state.pageNum,
                                        hideOnSinglePage: true,
                                        showQuickJumper: true,
                                        showTotal: () => `共 ${this.state.total} 条数据`
                                    }}
                                    rowKey={(record, index) => index}
                                />
                            </div>

                            {/* 产品信息添加/编辑 */}
                            <Modal
                                title={isAddProduct === 1 ? "产品信息添加" : "产品信息编辑"}
                                visible={this.state.productModal}
                                onOk={this.handleProductModal}
                                onCancel={() => this.changeProductModal(false)}
                            >
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80 }}>产品类型</span>
                                    <Select value={!defineSelect ? '请选择' : defineSelect} style={{ width: 120 }} onChange={this.changeSelectType}>
                                        {
                                            selectData.map(v => <Option key={v.id} value={v.id}>{v.typeName}</Option>)
                                        }
                                    </Select>
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80 }}>产品名称</span>
                                    <Input style={{ width: 280 }} type="text" value={this.state.productName} onChange={e => this.changeProductInput(e, 'productName')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80, verticalAlign: 'top' }}>副标题</span>
                                    <Input rows={3} style={{ width: 360 }} value={this.state.title} onChange={e => this.changeProductInput(e, 'title')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80, verticalAlign: 'top' }}>产品说明</span>
                                    <TextArea rows={3} style={{ width: 360 }} value={this.state.productExplain} onChange={e => this.changeProductInput(e, 'productExplain')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80 }}>产地</span>
                                    <Input style={{ width: 280 }} type="text" value={this.state.productPlane} onChange={e => this.changeProductInput(e, 'productPlane')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80 }}>生产公司</span>
                                    <Input style={{ width: 280 }} type="text" value={this.state.productCompany} onChange={e => this.changeProductInput(e, 'productCompany')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 210 }}>其他参数: {paramsNum.length}/9(可以一个不填)</span>
                                    <span onClick={this.addParams} style={{ color: 'skyblue', cursor: 'pointer' }}>添加参数</span>
                                </div>
                                {
                                    paramsNum.map((v, i) =>
                                        <Fragment key={i}>
                                            <div >
                                                <span>参数名称 </span>
                                                <Input value={v.name} onChange={e => this.changeParamsInput(e, i, 'name', 'paramsNum')} style={{ width: 100, margin: '0 10px 0 5px' }} type="text" />
                                                <span >参数内容 </span>
                                                <Input value={v.content} onChange={e => this.changeParamsInput(e, i, 'content', 'paramsNum')} style={{ width: 100, margin: '0 10px 0 5px' }} type="text" />
                                                <Icon style={{ cursor: 'pointer' }} onClick={() => this.delParams(i)} type="minus-circle" />
                                            </div>
                                            <hr />
                                        </Fragment>
                                    )
                                }
                                <div style={fileList.length == 3 ? { marginBottom: 100 } : null} >
                                    <p className="fw600 mb15">添加图片 (格式png，大小不超过1M，尺寸xxxx*xxxx) </p>
                                    <Upload
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                        {fileList.length >= 6 ? null : (
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">Upload</div>
                                            </div>
                                        )}
                                    </Upload>
                                    <Modal visible={previewVisiblePr} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={previewImagePr} />
                                    </Modal>
                                </div>
                            </Modal>
                        </Fragment> :
                        <Fragment>
                            {/* 返回上一级 */}
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Button type="primary" className="ml15" onClick={() => this.goBack(true)}> 返回上一级 </Button>
                                <div style={{ marginLeft: '20px', fontSize: '16px' }}>产品名称: {proName} </div>
                            </div>
                            {/* 顶部搜索框 */}
                            <div className="searchLayer">
                                <div className="mb15">
                                    <Search style={{ width: 250 }} placeholder="请输入规格名称" value={this.state.query} onChange={this.changeQeury} onSearch={e => this.searchQuery(e, 'son')} enterButton />
                                    <Button type="primary" className="ml15" onClick={() => this.reset('son')}>重置</Button>
                                    <Button type="primary" className="ml15" onClick={() => this.addParticulars(true, 1)}>规格添加</Button>
                                </div>
                                <div className="mb15">
                                    <span className="tip mr15 ">预约状态:</span>
                                    <Select defaultValue="lucy" style={{ width: 120 }} value={this.state.royaltyType} onChange={this.changeSelect}>
                                        <Option value="0">全部</Option>
                                        <Option value="1">可预约</Option>
                                        <Option value="2">不可预约</Option>
                                    </Select>
                                </div>
                            </div>

                            {/* 列表 */}
                            <div style={{ textAlign: 'center' }}>
                                <Table
                                    bordered
                                    dataSource={this.state.sizeData}
                                    columns={this.childColumns}
                                    pagination={{
                                        total: this.state.sizeDotal,
                                        pageSize: this.state.pageSize,
                                        onChange: this.changePage,
                                        current: this.state.pageNum,
                                        hideOnSinglePage: true,
                                        showQuickJumper: true,
                                        showTotal: () => `共 ${this.state.total} 条数据`
                                    }}
                                    rowKey={(record, index) => index}
                                />
                            </div>

                            {/* 规格添加/编辑 */}
                            <Modal
                                title={isAddProduct === 1 ? "规格添加" : "规格编辑"}
                                visible={this.state.particularsModal}
                                onOk={this.handleProductModal}
                                onCancel={() => this.addParticulars(false)}
                            >

                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80 }}>规格名称</span>
                                    <Input style={{ width: 280 }} type="text" value={this.state.sizeName} onChange={e => this.changeProductInput(e, 'sizeName')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80, verticalAlign: 'top' }}>市场单价</span>
                                    <Input rows={3} type="number" style={{ width: 280 }} value={this.state.marketPrice} onChange={e => this.changeProductInput(e, 'marketPrice')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80 }}>基础单价</span>
                                    <Input style={{ width: 280 }} type="number" value={this.state.besicsPrice} onChange={e => this.changeProductInput(e, 'besicsPrice')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80 }}>成本单价</span>
                                    <Input style={{ width: 280 }} type="number" value={this.state.costPrice} onChange={e => this.changeProductInput(e, 'costPrice')} />
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 80 }}>增值百分比</span>
                                    <Input style={{ width: 280 }} type="number" value={this.state.addPercent} onChange={e => this.changeProductInput(e, 'addPercent')} />
                                </div>
                                <div className='mb15'>
                                    <Checkbox style={{ display: 'inline-block', width: 80 }} checked={appointmentInput} onChange={this.onAppointmentChange}>预约</Checkbox>
                                    {
                                        appointmentInput ?
                                            <Input style={{ width: 280 }} type="number" value={this.state.appointmentPrice} onChange={e => this.changeProductInput(e, 'appointmentPrice')} /> : null
                                    }
                                </div>
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 210 }}>添加细分类: {paramsNum.length}/9(可以一个不填)</span>
                                    <span onClick={() => this.addParams('xifen')} style={{ color: 'skyblue', cursor: 'pointer' }}>添加细分类</span>
                                </div>
                                {
                                    paramsNum.map((v, i) =>
                                        <Fragment key={i}>
                                            <div >
                                                <div>
                                                    <span>细分规格名称 </span>
                                                    <Input style={{ width: 100, margin: '0 10px 0 5px' }} value={v.name} onChange={e => this.changeParamsInput(e, i, 'name', 'paramsNum')} type="text" />
                                                    <span >增加单价 </span>
                                                    <Input style={{ width: 100, margin: '0 10px 0 5px' }} value={v.addPrice} onChange={e => this.changeParamsInput(e, i, 'addPrice', 'paramsNum')} type="number" />
                                                </div>
                                                <div>
                                                    <span>增加成本 </span>
                                                    <Input style={{ width: 100, margin: '0 10px 0 5px' }} value={v.addCost} onChange={e => this.changeParamsInput(e, i, 'addCost', 'paramsNum')} type="number" />
                                                    <span >增加增值比例 </span>
                                                    <Input style={{ width: 100, margin: '0 10px 0 5px' }} value={v.addIncrementRate} onChange={e => this.changeParamsInput(e, i, 'addIncrementRate', 'paramsNum')} type="number" />
                                                    <Icon style={{ cursor: 'pointer' }} onClick={() => this.delParams(i, 'xifen')} type="minus-circle" />
                                                </div>
                                            </div>
                                            <hr />
                                        </Fragment>
                                    )
                                }
                                <div className="mb15">
                                    <span className="fw600" style={{ display: 'inline-block', width: 210 }}>添加包装类型: {packageType.length}/9(必须填一个)</span>
                                    <span onClick={() => this.addParams('package')} style={{ color: 'skyblue', cursor: 'pointer' }}>添加包装类型</span>
                                </div>
                                {
                                    packageType.map((v, i) =>
                                        <Fragment key={i}>
                                            <div >
                                                <div>
                                                    <span>包装规格名称 </span>
                                                    <Input style={{ width: 100, margin: '0 10px 0 5px' }} value={v.name} onChange={e => this.changeParamsInput(e, i, 'name', 'packageType')} type="text" />
                                                    <span >增加单价 </span>
                                                    <Input style={{ width: 100, margin: '0 10px 0 5px' }} value={v.addPrice} onChange={e => this.changeParamsInput(e, i, 'addPrice', 'packageType')} type="number" />
                                                </div>
                                                <div>
                                                    <span>增加成本 </span>
                                                    <Input style={{ width: 100, margin: '0 10px 0 5px' }} value={v.addCost} onChange={e => this.changeParamsInput(e, i, 'addCost', 'packageType')} type="number" />
                                                    <Icon style={{ cursor: 'pointer' }} onClick={() => this.delParams(i, 'package')} type="minus-circle" />
                                                </div>
                                            </div>
                                            <hr />
                                        </Fragment>
                                    )
                                }
                                <div style={fileList.length == 3 ? { marginBottom: 100 } : null} >
                                    <p className="fw600 mb15">添加图片 (格式png，大小不超过1M，尺寸xxxx*xxxx) </p>
                                    <Upload
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                        {fileList.length >= 6 ? null : (
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">Upload</div>
                                            </div>
                                        )}
                                    </Upload>
                                    <Modal visible={previewVisiblePr} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={previewImagePr} />
                                    </Modal>
                                </div>
                            </Modal>
                        </Fragment>
                }


            </div>
        )
    }
}

export default ProductMsgCtrl