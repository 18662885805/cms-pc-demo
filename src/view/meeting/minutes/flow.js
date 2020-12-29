import React, { Component,Fragment } from 'react';
import { Form, Input, Select, Button, Icon, Row, Col, Divider, DatePicker, Upload } from 'antd'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import CommonUtil from '@utils/common'
import styles from './index.module.css'
import translation from '../translation'
import moment from 'moment'
const { TextArea } = Input;
const FormItem = Form.Item;
let _util = new CommonUtil();

const style = {
  // border: '1px dashed gray',
  padding: '0.5rem 0 2rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  boxShadow: '0 2px 4px 0 rgba(0,0,0,.1)',
  margin: '12px 0'
}
const Types = { // 设定类型，只有DragSource和DropTarget的类型相同时，才能完成拖拽和放置
  CARD: 'CARD'
};

//DragSource相关设定
const CardSource = {  //设定DragSource的拖拽事件方法
  beginDrag(props, monitor, component) { //拖拽开始时触发的事件，必须，返回props相关对象
    return {
      index: props.index
    }
  },
  endDrag(props, monitor, component) {
    //拖拽结束时的事件，可选
  },
  canDrag(props, monitor) {
    return props.canDrag;
    //是否可以拖拽的事件。可选
  },
  isDragging(props, monitor) {
    // 拖拽时触发的事件，可选
  }
};

function collect(connect, monitor) { //通过这个函数可以通过this.props获取这个函数所返回的所有属性
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

//DropTarget相关设定
const CardTarget = {
  drop(props, monitor, component) { //组件放下时触发的事件
    //...
  },
  canDrop(props, monitor) { //组件可以被放置时触发的事件，可选
    //...
  },
  // hover(props,monitor,component){ //组件在target上方时触发的事件，可选
  //     //...
  // },

  hover(props, monitor, component) {
    if (!component) return null; //异常处理判断
    const dragIndex = monitor.getItem().index;//拖拽目标的Index
    const hoverIndex = props.index; //放置目标Index
    if (dragIndex === hoverIndex) return null;// 如果拖拽目标和放置目标相同的话，停止执行

    //如果不做以下处理，则卡片移动到另一个卡片上就会进行交换，下方处理使得卡片能够在跨过中心线后进行交换.
    const hoverBoundingRect = (findDOMNode(component)).getBoundingClientRect();//获取卡片的边框矩形
    // Get vertical middle
    const hoverMiddleY =
      (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    // Determine mouse position
    const clientOffset = monitor.getClientOffset()
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }
    // const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;//获取X轴中点
    // const clientOffset = monitor.getClientOffset();//获取拖拽目标偏移量
    // const hoverClientX = (clientOffset).x - hoverBoundingRect.left;
    // if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) { // 从前往后放置
    //     return null
    // }
    // if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) { // 从后往前放置
    //     return null
    // }
    console.log(props)
    props.onDND(dragIndex, hoverIndex); //调用App.js中方法完成交换
    monitor.getItem().index = hoverIndex; //重新赋值index，否则会出现无限交换情况
  }
};

function collect1(connect, monitor) {//同DragSource的collect函数
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(), //source是否在Target上方
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),//能否被放置
    itemType: monitor.getItemType(),//获取拖拽组件type
  }
}

@injectIntl
class FlowItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      searchOptions: [],
      personlist: [],
      fileList: [],
      meeting: [{
        theme: '',
        topic: [{ index: 0, name: '', content: [{ index: 0, name: '' }] }]
      }],
      fill_date: new Date()
    };
  }

  edit = () => {
    this.props.handleEdit();
  }
  remove = () => {
    this.props.onDelete();
  }

  handleFormChange = (value, field) => {
    console.log(value, field);
    this.setState({
      [field]: value
    });
  }

  handleInputChange = (e, cIndex, sIndex) => {
    // const {meeting} = this.state
    // console.log(e.target.value)
    // meeting[cIndex].topic[sIndex].name = e.target.value
    // this.setState({meeting})
  }

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    const { confirmLoading, spinLoading, treeData, name, name_en, desc, desc_en, principal, permission, userdata, searchOptions, fileList } = this.state;
    const obj = this.props.content
    const cIndex = this.props.cIndex
    const sIndex = this.props.sIndex
    let opacity = isDragging ? 0.1 : 1; //当被拖拽时呈现透明效果
    const { formatMessage } = this.props.intl
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };
    const subItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
    };

    const subformItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      }
    };

    const textformItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    
    const typelist = [
      { id: 1, name: '无' },
      { id: 2, name: '信息' },
      { id: 3, name: '决定' },
      { id: 4, name: '任务' }
    ]

    const tasklist = [
      { id: 1, name: '普通任务' },
      { id: 2, name: '重要任务' }
    ]

    const props = {
      multiple: true,
      accept: 'image/*,.pdf,.xlsx,.xls,.docx,.doc,.zip',
      action: _util.getServerUrl('/upload/card/'),
      headers: {
        Authorization: 'JWT ' + _util.getStorage('token')
      },
      data: {
        site_id: _util.getStorage('site')
      },
      className: 'upload-list-inline',
    }

    return connectDragSource( //使用DragSource 和 DropTarget
      connectDropTarget(<div>
        {/* <div className="itembox" style={{ ...style, opacity }}> */}
        <div className="itembox">

        {/* <FormItem
            label={<input type="text" placeholder='点击编辑' style={{border: 'none', outline: 'none', margin: '0'}} onChange={(e) => this.props.labelChange(e.target.value, this.props.index)} />}
            hasFeedback={obj.type !== "upload"}
            {...formItemLayout}
          >
            {
              obj.value
                ?
                _util.switchItem(obj, this)

                :
                _util.switchItem(obj, this)
            }
          </FormItem> */}

          <Fragment>
            <div
              className={styles.topic}
              style={{
                // margin: '0 auto 10px',
                // padding: '10px',
                overflow: 'hidden',
                // borderBottom: subject.length > 1 ? '1px dashed #e8e8e8' : 'none',
                // boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                width: '100%',
                position: 'relative',
                padding: '15px 10px',
                border: '1px dashed #fff',
                marginBottom: '10px',
                fontWeight: '700'

              }}
              // key={sIndex}
            >
              <Row gutter={16}>
                <Col className="gutter-row" span={18}>
                  <FormItem
                    required
                    label={`${cIndex + 1}.${sIndex + 1}标题`}
                    {...subformItemLayout}
                  >
                    <Input placeholder="请输入标题" onChange={value => this.handleInputChange(value, cIndex, sIndex)} />
                  </FormItem>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div className={styles.operate} style={{ position: 'absolute', top: '0', right: '0', width: '300px', padding: '5px 0' }}>
                    {/* <Icon type="plus" onClick={()=>this.addTitle(cIndex)}/>  */}
                    <Button className="sbtn" type="dashed" onClick={() => this.props.addTitle(cIndex)}>
                      <Icon type="plus" /> 添加
                    </Button>

                    <Button className="sbtn" type="dashed" onClick={() => this.props.deleteTitle(cIndex, sIndex)} style={{ marginLeft: '10px' }}>
                      <Icon type="minus" /> 删除
                    </Button>

                    <Button className="sbtn" type="dashed" onClick={() => this.props.moveUpTopic(cIndex, sIndex)} style={{ marginLeft: '10px' }}>
                      <Icon type="arrow-up" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="上移" />
                    </Button>
                    <Button className="sbtn" type="dashed" onClick={() => this.props.moveDownTopic(cIndex, sIndex)} style={{ marginLeft: '10px' }}>
                      <Icon type="arrow-down" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="下移" />
                    </Button>
                  </div>
                </Col>
              </Row>

            </div>

            {
              obj.content.map((q, qIndex) => {
                return (
                  <div
                    className={styles.content}
                    style={{
                      margin: '0 auto 10px',
                      // padding: '10px',
                      overflow: 'hidden',
                      // borderBottom: subject.length > 1 ? '1px dashed #e8e8e8' : 'none',
                      // boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                      width: '100%',
                      position: 'relative',
                      border: '1px dashed #999',
                      padding: '10px 20px'
                    }}
                    key={qIndex}
                  >
                    <Row gutter={16}>
                      <Col className="gutter-row" span={8}>
                        <FormItem
                          required
                          {...formItemLayout}
                          label={<FormattedMessage id="page.metting.minutes.type" defaultMessage="类型" />}
                        >
                          <Select
                            allowClear
                            showSearch
                            //onChange={value => this.onChange(value)}
                            onChange={value => this.handleFormChange(value, 'type')}
                            placeholder={formatMessage(translation.select)}
                            //value={this.state.demonstration}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                            {
                              typelist instanceof Array && typelist.length ? typelist.map((d, index) => {
                                return (<Option key={index} value={d.id}>{d.name}</Option>)
                              }) : null
                            }
                          </Select>
                        </FormItem>
                      </Col>
                      <Col className="gutter-row" span={8}>
                        <FormItem
                          {...formItemLayout}
                          label={<FormattedMessage id="page.meeting.minutes.todo" defaultMessage="执行人" />}
                        >
                          <Select
                            allowClear
                            showSearch
                            mode='multiple'
                            placeholder="请选择执行人"
                            // value={}
                            // value={participant_ids ? participant_ids.split(',') : []}
                            // onChange={this.handlePackageChange}
                            onChange={value => this.handleFormChange(value, 'parkings')}
                            style={{ width: '100%' }}
                          >
                            {/* {
                              Array.isArray(this.state.personlist) && this.state.personlist.map((d, index) =>
                                <Option key={d.id} value={d.id}>{d.name}</Option>)
                            } */}
                          </Select>
                        </FormItem>
                      </Col>
                      <Col className="gutter-row" span={8}>
                        <FormItem
                          {...formItemLayout}
                          label={<FormattedMessage id="page.meeting.minutes.enddate" defaultMessage="完成日期" />}
                        >
                          <DatePicker
                            allowClear={false}
                            placeholder="请选择完成日期"
                            onChange={date => this.handleFormChange(date ? date.format('YYYY-MM-DD') : null, 'start_date')}
                            value={this.state.start_date ? moment(this.state.start_date) : null}
                            disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                            style={{ width: '100%' }}
                          />
                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col className="gutter-row" span={8}>
                        <FormItem
                          required
                          {...formItemLayout}
                          label={<FormattedMessage id="page.meeting.minutes.enddate" defaultMessage="填写日期" />}
                        >
                          <DatePicker
                            allowClear={false}
                            placeholder="请选择填写日期"
                            onChange={date => this.handleFormChange(date ? date.format('YYYY-MM-DD') : null, 'fill_date')}
                            value={this.state.fill_date ? moment(this.state.fill_date) : null}
                            disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                            style={{ width: '100%' }}
                          />
                        </FormItem>
                      </Col>
                      {
                        this.state.type == 4 ?
                          <Fragment>

                            <Col className="gutter-row" span={8}>
                              <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="page.metting.minutes.type" defaultMessage="任务类型" />}
                              >

                                  <Select
                                    allowClear
                                    showSearch
                                    //onChange={value => this.onChange(value)}
                                    placeholder={formatMessage(translation.select)}
                                    //value={this.state.demonstration}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                  >
                                    {
                                      tasklist instanceof Array && tasklist.length ? tasklist.map((d, index) => {
                                        return (<Option key={index} value={d.id}>{d.name}</Option>)
                                      }) : null
                                    }
                                  </Select>

                              </FormItem>
                            </Col>
                            <Col className="gutter-row" span={8}>
                              <FormItem
                                label={<FormattedMessage id="app.page.metting.theme" defaultMessage="任务编号" />}
                                {...formItemLayout}
                              >

                                  <Input placeholder="请输入任务编号" />

                              </FormItem>
                            </Col>


                          </Fragment>
                          :
                          null
                      }
                    </Row>

                    <Row gutter={16}>
                      <Col className="gutter-row" span={24}>
                        {/* <FormItem {...formItemLayout} label={`${cIndex + 1}.${qIndex + 1}内容`}> */}
                        <FormItem {...textformItemLayout} label={'内容'}>

                            <TextArea
                              placeholder="请输入会议纪要内容"
                              // className="custom"
                              // autosize={{minRows: 2, maxRows: 6}}
                              style={{ minHeight: 32 }}
                              rows={4}
                            // style={{ height: 50 }}
                            // onKeyPress={this.handleKeyPress}
                            />

                        </FormItem>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col className="gutter-row" span={24}>
                        <FormItem
                          {...textformItemLayout}
                          label={"附件"}
                          extra={"附件大小限制15M，格式限制jpg、jpeg、png、gif、bmp、pdf、xlsx、xls、docx、doc、zip"}>
                          <div style={{ width: '50%' }}>
                            <Upload
                              {...props}
                              beforeUpload={_util.beforeUploadFile}
                              onChange={this.handleUploadFile}
                              fileList={fileList}
                              className='upload-list-inline'
                            >
                              <Button>
                                <Icon type="upload" /> Upload
                                                </Button>
                            </Upload>
                          </div>
                        </FormItem>
                      </Col>
                    </Row>

                    <div className={styles.operate} style={{ position: 'absolute', bottom: '10px', right: '0', width: '300px', padding: '5px 0' }}>
                      <Button className="sbtn" type="dashed" onClick={() => this.addContent(cIndex, qIndex)}>
                        <Icon type="plus" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="添加" />
                      </Button>
                      {
                        obj.content.length > 1 ?
                          <Button className="sbtn" type="dashed" onClick={() => this.deleteContent(cIndex, qIndex)} style={{ marginLeft: '10px' }}>
                            <Icon type="minus" /> 删除
                                            </Button>
                          :
                          null
                      }
                    </div>

                  </div>
                )
              })
            }
          </Fragment>






        </div>
      </div>)
    )
  }
}

// 使组件连接DragSource和DropTarget
let flow = require('lodash.flow');
export default flow(
  DragSource(Types.CARD, CardSource, collect),
  DropTarget(Types.CARD, CardTarget, collect1)
)(FlowItem)