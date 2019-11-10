import React, { Component } from 'react';
import { Table, Modal, Input, message, Popover, Button } from 'antd';
import axios from '@axios';

// 轮播管理-轮播管理
class BannerAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1, // 第几页
            pageSize: 10, // 每页显示的数据量 
            isModel: false, // 模态框
            data: [], // 数据
            id: '', // 参数对象
            img: '',
            linkUrl: '',
            weight: '',
            imgModel: false
        };

        this.file = React.createRef()

        this.columns = [
            {
                title: '轮播权重',
                align: 'center',
                dataIndex: 'weight',
                key: 'weight'
            },
            {
                title: '轮播图片',
                align: 'center',
                dataIndex: 'id',
                key: 'id',
                render: (text, rowData) => (<span style={{ cursor: 'pointer' }} className="color" onClick={e => this.showModalImg(rowData)} >查看</span>)
            },
            {
                title: '链接',
                align: 'center',
                dataIndex: 'linkUrl',
                key: 'linkUrl',
                width: 600,
                render: (text, record) => (
                    <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                        {text}
                    </div>
                )
            },
            {
                title: '操作',
                align: 'center',
                dataIndex: '2',
                key: '2',
                render: (text, rowData, index) => (
                    <div style={{ cursor: 'pointer' }} className="color" onClick={e => this.showModal(rowData)}>编辑</div>
                )
            }
        ];
    }

    componentWillMount() {
        this.init();
    }

    init = () => {
        let { pageNum, pageSize } = this.state;
        axios.post('/admin/banner/list', {
            pageNum,
            pageSize
        })
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.msg);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                this.setState({ data: data.responseBody.data.list, total: data.total });
            })
    }

    getImg = id => {
        // axios.post('/banner/detail', { id })
        //     .then(({ data }) => {
        //         if (data.status !== "200") return this.setState({ img: '' });
        //         this.setState({ img: data.result });
        //     })
    }

    // 更改输入框
    onChange = (e, field) => this.setState({ [field]: e.target.value });

    showModal = rowData => { // 显示模态框
        axios.post('/common/attachment/list', { resourceId: rowData.id, category: 6 })
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') {
                    message.error(data.responseBody.message);
                    this.setState({ imgModel: true, img: '' });
                    return;
                }
                
                this.setState({
                    isModel: true, id: rowData.id, linkUrl: rowData.linkUrl, weight: rowData.weight });
            })
        
        
    }

    // 显示图片模态框
    showModalImg = rowData => {
        axios.post('/common/attachment/list', { resourceId: rowData.id, category: 6 })
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1'){
                    message.error(data.responseBody.message); 
                    this.setState({ imgModel: true, img: '' }); 
                    return;
                }
                if(!data.responseBody.data.length) return;
                this.setState({ imgModel: true, img: data.responseBody.data[0].url });
            })
    }

    // 图片
    imgToBase = file => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            let AllowImgFileSize = 2100000;
            let imgUrlBase64, string;
            if (file) {
                imgUrlBase64 = reader.readAsDataURL(file);
                reader.onload = (e) => {
                    if (AllowImgFileSize !== 0 && AllowImgFileSize < reader.result.length) {
                        reject(false)
                    } else {
                        string = reader.result.substring(reader.result.indexOf(",") + 1);
                        resolve(string)
                    }
                }
            }
        })
    }

    handleOk = async () => { // 模态框确认
        let { id,linkUrl, weight, img} = this.state;
        if (this.state.linkUrl.trim().length < 1) return message.error('链接不能为空');
        let picFiles;
        if (!this.file.current.files[0]) return message.error('请添加图片');
        if (this.file.current.files[0]) picFiles = await this.imgToBase(this.file.current.files[0]);
        let data = {
            id,
            linkUrl,
            weight,
            attachmentInfo: {
                name: this.file.current.files[0].name,
                url: img
            }
        }
        if (picFiles) {
            data.picFiles = picFiles
            data.picFileName = this.file.current.files[0].name
        }
        axios.post('/admin/banner/update', data)
            .then(({ data }) => {
                if (data.code !== "200") return message.error(data.message);
                if (data.responseBody.code !== '1') return message.error(data.responseBody.message);
                message.success('修改成功')
                this.file.current.value = ''
                this.setState({ isModel: false, id: '', img: '' }, () => this.init());
            })
    }

    // 添加图片
    addImgArrItem = () => this.file.current.click()

    // 监听用户是否添加图片
    changeImgItem = async () => {
        let { img } = this.state
        let file = this.file.current.files[0];
        if (file.size / 1048576 > 1) return Modal.error({ title: '超过1M限制，不允许上传~' })
        img = window.URL.createObjectURL(this.file.current.files[0])
        this.setState({ img })
    }

    handleCancel = () => { // 模态框取消
        this.file.current.value = ''
        this.setState({
            isModel: false,
            id: '',
            img: ''
        });
    }

    handleCancelImg = () => { // 模态框确定/取消
        this.setState({
            imgModel: false,
            img: ''
        });
    }

    render() {
        return (
            <div>

                <Table
                    rowKey={(r, i) => i}
                    columns={this.columns}
                    dataSource={this.state.data}
                    bordered
                    size="middle"
                    style={{ textAlign: 'center' }}
                    pagination={false}
                />

                <Modal
                    title="编辑"
                    visible={this.state.isModel}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >

                    <div>
                        <Button type="primary" onClick={this.addImgArrItem}>添加图片</Button>
                        <span style={{ color: 'red' }} className="ml15">注意: 图片不能大于1m，格式为png，尺寸为750*240</span>
                    </div>

                    <div style={{ width: 375, height: 120, margin: '10px auto', lineHeight: "120px", textAlign: 'center' }}>
                        {
                            this.state.img ? (
                                <img style={{ display: 'block', width: '100%', height: '100%' }} src={this.state.img} alt="" />
                            ) : (
                                    <span>无图片,请添加</span>
                                )
                        }

                    </div>

                    <input accept="image/png" className="dn" type="file" ref={this.file} onChange={e => this.changeImgItem()} />

                    <Input
                        placeholder="请输入链接"
                        value={this.state.linkUrl}
                        onChange={e => this.onChange(e, 'linkUrl')}
                    />

                </Modal>

                <Modal
                    title="查看图片"
                    visible={this.state.imgModel}
                    onOk={this.handleCancelImg}
                    onCancel={this.handleCancelImg}
                >

                    <div style={{ width: 375, height: 120, margin: '10px auto', lineHeight: "120px", textAlign: 'center' }}>
                        {
                            this.state.img ? (
                                <img style={{ display: 'block', width: '100%', height: '100%' }} src={this.state.img} alt="" />
                            ) : (
                                    <span>无图片,请添加</span>
                                )
                        }

                    </div>

                </Modal>

            </div>
        )
    }
}

export default BannerAdmin;