import React, {Fragment} from 'react'
import {Form, Button, Modal, Input, Upload, Icon, Spin, Select, Rate, message, Timeline} from 'antd'
import {inject, observer} from "mobx-react/index"
import MyBreadcrumb from '@component/bread-crumb'
import {myOrderDetail, myOrderHandlePost} from "@apis/workorder/my-order"
import {interviewee} from '@apis/event/interviewee/'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import stylesCard from './detail.module.css';
import debounce from 'lodash/debounce'
import moment from 'moment'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import intl from 'react-intl-universal';

const {TextArea} = Input
const Option = Select.Option

const FormItem = Form.Item
const confirm = Modal.confirm

// const rates = ['极差', '失望', '一般','满意', '惊喜'];
const rates = [<FormattedMessage id="page.order.evaluate.code1" defaultMessage="极差"/>,<FormattedMessage id="page.order.evaluate.code2" defaultMessage="失望"/>,<FormattedMessage id="page.order.evaluate.code3" defaultMessage="一般"/>,<FormattedMessage id="page.order.evaluate.code4" defaultMessage="满意"/>,<FormattedMessage id="page.order.evaluate.code5" defaultMessage="惊喜"/>];

let _util = new CommonUtil();

@inject('menuState') @observer
class MyOrderDetailForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            avatar: '',
            username: '',
            name: '',
            tel: '',
            email: '',
            phone: '',
            department_name: '',
            role: '',
            status: '',
            is_active: '',
            last_login: '',
            action: '',
            visible: false,
            fileList: [],
            previewVisible: false,
            previewImage: '',
            l_rate: 1,
            l_action: 0,
            fetching: false,
            data: [],
            user: '',
            search_id: '',
            picVisible: false,
            picSrc: '',
        }
        this.operateOrder = this.operateOrder.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleUploadPreview = this.handleUploadPreview.bind(this)
        this.handleUploadChange = this.handleUploadChange.bind(this)
        this.handleUploadCancel = this.handleUploadCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.fetchUser = debounce(this.fetchUser, 800)
        this.lastFetchId = 0
        this.handleStarChange = this.handleStarChange.bind(this)
    }

    componentDidMount() {
        const currentUser = _util.getStorage('userInfo').id
        this.setState({
            currentUser
        })
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            myOrderDetail(this.props.location.state.id).then((res) => {
                let data = res.data.results
                this.setState({
                    ...data
                })
                this.props.menuState.changeMenuCurrentUrl('/eqp/mychecklist')
                this.props.menuState.changeMenuOpenKeys('/eqp')
            })
        }
    }

    handleStarChange(value) {
        this.setState({
            l_rate: value
        })
    }

    handleChange = (value, obj) => {
        this.setState({
            search_id: obj ? obj.props.title : null,
            data: [],
            fetching: false,
            user: value
        })
    }

    fetchUser = (value) => {
        this.lastFetchId += 1
        const fetchId = this.lastFetchId
        this.setState({data: [], fetching: true})
        interviewee({q: value}).then((res) => {
            if (fetchId !== this.lastFetchId) {
                return
            }
            const data = res.data.results.map(user => ({
                value: user.name,
                text: user.name,
                id: user.id,
                org:user.org,
                tel: user.tel
            }))
            this.setState({data, fetching: false})
        })
    }
    
    handleUploadPreview(file) {
        _util.handleUploadPreview(file, this)
    }

    handleUploadCancel() {
        _util.handleUploadCancel(this)
    }

    handleUploadChange = ({ fileList, file }) => {
        if (file) {
            const { status } = file
            if (status === 'uploading') {
                this.props.menuState.changeFetching(true)
            } else {
                this.props.menuState.changeFetching(false)
            }
        }
        this.setState({ fileList })
    }

    operateOrder(act, l_action) {
        this.setState({
            action: act,
            visible: true,
            l_action
        })
    }

    handleSubmit(e) {
        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this;
                const { formatMessage } = _this.props.intl;
                confirm({
                    title:formatMessage(messages.alarm1),
                    content:formatMessage(messages.alarm2),
                    okText:formatMessage(messages.alarm3),
                    cancelText:formatMessage(messages.alarm4),
                    onOk() {
                        const {l_rate, l_action, id, search_id} = _this.state
                        if (l_action === 1) {
                            if (!search_id) {
                                message.error(formatMessage(messages.order1))
                                return
                            }
                        }
                        let pics = []
                        _this.state.fileList.forEach((file, index) => {
                            pics.push(file.response.content.results.url)
                        })
                        values.rate = l_rate
                        values.touser_id = search_id
                        values.pic_source = pics.join()
                        values.action = l_action
                        values.id = id


                        myOrderHandlePost(values).then((res) => {
                            message.success(formatMessage(messages.alarm7))
                            _this.props.history.goBack()
                        })
                    },
                })
            }
            this.setState({
                confirmLoading: false
            })
        })
    }

    handleOk() {}

    handleCancel() {
        this.setState({
            visible: false
        })
    }

    openPicView = (pic) => {
        this.setState({
            picVisible: true,
            picSrc: pic.url
        })
    }

    closePicView = () => {
        this.setState({
            picVisible: false,
            picSrc: ''
        })
    }

    render() {
        const {
            serial, 
            fromuser_name, 
            fromuser_tel,
            fromuser_dep,
            fromuser_phone,
            cate_name, 
            priority_text, 
            location_name, 
            duedate, 
            created_time, 
            content, 
            rate_text,
            pic_source,
            status,
            flows,
            userlists,
            createuser_id,
            currentUser,
            fileList,
            previewVisible,
            previewImage,
            fetching,
            data,
            user,
            factory_name,
            last_person,
            current_person,
            total_time,
        } = this.state

        const {getFieldDecorator} = this.props.form
        let iscurrent = false
        let userLen = 0

        if (userlists) {       
            userLen = userlists.split(',').length
            iscurrent = (currentUser === userlists.split(',')[userLen - 1]) ? true : false
            console.log(iscurrent)
        }

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 15},
                md: {span: 15},
            },
        };
        const flowsObj = (flows && JSON.parse(flows)) || []

        const uploadButton = (
            <div>
                <Icon type='plus'/>
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        const props = {
            // name: 'file',
            action: _util.getServerUrl('/upload/workorder/'),
            headers: {
                Authorization: 'JWT ' + _util.getStorage('token')
            },
            data: {
                site_id: _util.getStorage('site')
            },
            multiple: true,
            listType: 'picture',
            accept: 'image/*',
            defaultFileList: [...fileList],
            className: 'upload-list-inline',
        };


        const tableData = [
            {
                text: <FormattedMessage id="page.work.my.title2" defaultMessage="工单编号"/>,
                value:  _util.getOrNull(serial)
            },
            {
                text: <FormattedMessage id="page.work.my.title3" defaultMessage="报修人"/>,
                value:  _util.getOrNull(fromuser_name)
            },
            {
                text: <FormattedMessage id="page.work.my.fromDep" defaultMessage="报修人部门"/>,
                value:  _util.getOrNull(fromuser_dep)
            },
            {
                text: <FormattedMessage id="page.work.my.title4" defaultMessage="报修人座机"/>,
                value:  _util.getOrNull(fromuser_tel)
            },
            {
                text: <FormattedMessage id="page.work.my.fromPhone" defaultMessage="报修人手机"/>,
                value: _util.getOrNull(fromuser_phone, true)
            },
            {
                text: <FormattedMessage id="page.work.my.title5" defaultMessage="工单类型"/>,
                value:  _util.getOrNull(cate_name)
            },
            {
                text: <FormattedMessage id="page.work.my.title6" defaultMessage="工单优先级"/>,
                value:  _util.getOrNull(priority_text)
            },
            {
                text: <FormattedMessage id="page.work.my.title18" defaultMessage="厂区地点"/>,
                value:  _util.getOrNull((factory_name ? factory_name : '') + (location_name ? location_name : ''))
            },
            {
                text: <FormattedMessage id="page.work.my.title7" defaultMessage="上一处理人"/>,
                value:  _util.getOrNull(last_person)
            },
            {
                text: <FormattedMessage id="page.work.my.title8" defaultMessage="当前处理人"/>,
                value:  _util.getOrNull(current_person)
            },
            {
                text: <FormattedMessage id="page.work.my.title9" defaultMessage="报修时间"/>,
                value:  _util.getOrNull(created_time)
            },
            {
                text: <FormattedMessage id="page.work.my.title14" defaultMessage="总计用时"/>,
                value:  _util.getOrNull(total_time)
            },
            {
                text: <FormattedMessage id="page.work.my.dueDate" defaultMessage="期望完成时间"/>,
                value:  _util.getOrNull(duedate)
            },
            {
                text:<FormattedMessage id="page.work.my.createdTime" defaultMessage="工单创建时间"/>,
                value:  _util.getOrNull(created_time)
            },
            {
                text: <FormattedMessage id="page.work.my.content" defaultMessage="工单内容"/>,
                value:  _util.getOrNull(content)
            },
            {
                text: <FormattedMessage id="app.page.text.picture" defaultMessage="图片"/>,
                value:  pic_source && pic_source.split(',').length > 0
                ?
                <PicList fileList={pic_source.split(',').map(pic => {
                    return {
                        uid: pic,
                        url: _util.getImageUrl(pic)
                    }
                })} />
                : '-'
            },
            {
                text: <FormattedMessage id="page.order.myOrder.flowObj" defaultMessage="流转记录"/>,
                value:  Array.isArray(flowsObj) && flowsObj.length > 0
                        ? 
                        <Timeline style={{margin: '5px auto -25px'}}>
                            {
                                flowsObj.map((flow, flowIndex) => {
                                    return (
                                        <Timeline.Item
                                            key={flowIndex}>
                                            <div
                                                className={''}>
                                                {
                                                    flow.message
                                                    ?
                                                    <div className={stylesCard.line} style={{marginBottom: '5px'}}>
                                                    {flow.message} {(flow.fields.action === 4 && rate_text) ? rate_text : null}
                                                </div>
                                                :null
                                                }
                                                
                                                <div className={stylesCard.line}>
                                                {
                                                flow.fields.pic_source ? 
                                                <PicList fileList={flow.fields.pic_source.split(',').map(pic => {
                                                    return {
                                                        uid: pic,
                                                        url: _util.getImageUrl(pic)
                                                    }
                                                })} />
                                         : null
                                        
                                        }
                                                    
                                                </div>
                                                <div className={stylesCard.line} style={{marginBottom: '5px'}}>
                                                    <FormattedMessage id="app.component.tablepage.remark" defaultMessage="备注"/>:&emsp;{_util.getOrNull(flow.fields.comment)}
                                                </div>
                                                <div className={stylesCard.line}>
                                                    {moment(flow.fields.created_time).format('YYYY-MM-DD HH:mm:ss')}
                                                </div>
                                            </div>
                                        </Timeline.Item>
                                    )
                                })
                            }
                        </Timeline>
                        : '-'
            },
            {
                text: <FormattedMessage id="page.accessory.goods_audit.operate" defaultMessage="操作"/>,
                value: <Fragment>
                    <div style={{marginBottom: '10px'}}>
                    <Button
                                type="primary"
                                disabled={
                                    (iscurrent && [1, 7, 8].indexOf(status) > -1) ? false : true
                                    // && 
                                    // createuser_id !== currentUser ? false : true
                                }
                                onClick={() => this.operateOrder('派发', 1)}
                                style={{marginRight: '10px'}}><FormattedMessage id="page.order.myOrder.send" defaultMessage="派发"/></Button>
                            <Button
                                type="primary"
                                disabled={(userLen > 1 && iscurrent && [1].indexOf(status) > -1) ? false : true}
                                onClick={() => this.operateOrder('退回', 8)}
                                style={{marginRight: '10px'}}><FormattedMessage id="app.component.tablepage.returnback" defaultMessage="退回"/></Button>
                            <Button
                                type="primary"
                                disabled={
                                    (userLen > 1 ? (
                                        ((userlists
                                            && userlists.split(',')[userLen - 2] === currentUser)
                                            && ([1].indexOf(status) > -1)) ? false : true
                                    ) : true)
                                }
                                onClick={() => this.operateOrder('召回', 7)}
                                style={{marginRight: '10px'}}><FormattedMessage id="page.order.myOrder.callBack" defaultMessage="召回"/></Button>
                            <Button
                                type="primary"
                                disabled={
                                    (iscurrent && [1, 7, 8].indexOf(status) > -1) ? false : true
                                    // && 
                                    // createuser_id !== currentUser ? false : true
                                }
                                onClick={() => this.operateOrder('执行', 2)}><FormattedMessage id="page.component.breadcrumb.execution" defaultMessage="执行"/></Button>
                    </div>
                    <div>
                    <Button
                                type="primary"
                                disabled={(iscurrent && [2].indexOf(status) > -1) ? false : true}
                                onClick={() => this.operateOrder('完成', 3)}
                                style={{marginRight: '10px'}}><FormattedMessage id="app.button.text.complete" defaultMessage="完成"/></Button>
                            <Button
                                type="primary"
                                disabled={(iscurrent && [3].indexOf(status) > -1) ? false : true}
                                onClick={() => this.operateOrder('评价', 4)}
                                style={{marginRight: '10px'}}><FormattedMessage id="page.work.my.title15" defaultMessage="评价"/></Button>
                             <Button
                                type="primary"
                                disabled
                                onClick={() => this.operateOrder('关闭', 5)}
                                style={{marginRight: '10px'}}><FormattedMessage id="page.component.breadcrumb.close" defaultMessage="关闭"/></Button>
                            <Button
                                type="primary"
                                disabled={(
                                    (createuser_id === currentUser) && [1, 7, 8].indexOf(status) > -1
                                ) ? false : true}
                                onClick={() => this.operateOrder('撤销', 9)}
                                ><FormattedMessage id="page.order.myOrder.sendBack" defaultMessage="撤销"/></Button>
                    </div>
                </Fragment>
            }
        ];

        const { formatMessage } = this.props.intl;

        return (
            <div>
                <MyBreadcrumb/>
                <div className="content-wrapper content-no-table-wrapper">

                <CardDetail title={<FormattedMessage id="page.order.myOrder.orderDetail" defaultMessage="工单详情"/>} data={tableData}  />
                    <GoBackButton 
                        style={{display: 'block', margin: '0 auto'}} 
                        props={this.props}
                        noConfirm />

                            <Modal
                                // title={this.state.action}
                                title={<FormattedMessage id="page.system.accessType.operate" defaultMessage="操作"/>}
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                okText={formatMessage({ id:"app.component.tablepage.okText", defaultMessage:"提交"})}
                                footer={null}
                            >
                            <Form onSubmit={this.handleSubmit}>
                                {
                                    this.state.l_action === 4 ? <FormItem
                                    label={<FormattedMessage id="page.work.my.title15" defaultMessage="评价"/>}
                                    {...formItemLayout}>
                                    <Rate onChange={this.handleStarChange} value={this.state.l_rate} />
                                    {rates[this.state.l_rate - 1]}
                                </FormItem> : null
                                }
                                {
                                    this.state.l_action === 1 ? <FormItem {...formItemLayout} label={<FormattedMessage id="page.order.myOrder.sendTo" defaultMessage="派发给"/>} required>
                                    <div>
                                        <Select
                                            allowClear
                                            showSearch
                                            placeholder={formatMessage(messages.order2)}
                                            notFoundContent={fetching ? <Spin size="small"/> : <FormattedMessage id="global.nodata" defaultMessage="暂无数据" />}
                                            filterOption={false}
                                            onSearch={this.fetchUser}
                                            onSelect={this.handleChange}
                                            style={{width: '100%'}}
                                            value={user}
                                        >
                                            {data.map((d, index) => <Option title={d.id} value={d.value}
                                                                            key={index}>{d.text}{ d.department ? `--${d.department}` : ''}{d.tel ? `--${d.tel}` : ''}</Option>)}
                                        </Select>
                                    </div>
                                </FormItem> : null
                                }
                                
                                
                                <FormItem
                                    label={<FormattedMessage id="page.carryout.goods_record.remarks" defaultMessage="备注" />}
                                    hasFeedback
                                    {...formItemLayout}>
                                    {
                                        getFieldDecorator('comment', {
                                            rules: [{
                                                required: true,
                                                message: formatMessage(messages.order3)
                                            }]
                                        })( <TextArea /> )
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout} label={<FormattedMessage id="page.order.myOrder.picUpload" defaultMessage="图片上传"/>}>
                                    <Upload
                                        {...props}
                                        listType="picture-card"
                                        fileList={fileList}
                                        beforeUpload={_util.beforeUploadImg}
                                        onPreview={this.handleUploadPreview}
                                        onChange={this.handleUploadChange}
                                    >
                                        {uploadButton}
                                    </Upload>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleUploadCancel}>
                                        <img alt='' style={{width: '100%'}} src={previewImage}/>
                                    </Modal>
                                </FormItem>
                                
                                <FormItem  style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                        <Button type="primary" htmlType="submit" 
                                                style={{marginRight: '10px'}}>
                                            <FormattedMessage id="page.construction.location.yesSubmit" defaultMessage="提交"/>
                                        </Button>
                                        <Button onClick={this.handleCancel}>
                                            <FormattedMessage id="app.button.cancel" defaultMessage="取消"/>
                                        </Button>
                                </FormItem>
                            </Form>
                            </Modal>
                </div>
            </div>
        )
    }
}

const MyOrderDetail = Form.create()(MyOrderDetailForm)

export default injectIntl(MyOrderDetail)
