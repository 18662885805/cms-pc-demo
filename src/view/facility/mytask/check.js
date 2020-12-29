import React, {Fragment} from 'react'
import {Card, Col, Row, Input, message, Button, Form, Select, Spin, Radio, Upload, Modal, Icon, notification} from 'antd'
import {inject, observer} from "mobx-react/index"
import debounce from 'lodash/debounce'
import {cloneDeep} from 'lodash'
import MyBreadcrumb from '@component/bread-crumb'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import {CheckPost, WorkSheetDetail, WorkOrderInfo} from '@apis/facility/worksheet'
import {WorkOrderPost} from '@apis/facility/records'
import appState from '../../../store/app-state'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import styles from './index.css';
const FormItem = Form.Item
const confirm = Modal.confirm
const RadioGroup = Radio.Group;
const {Option} = Select
const {TextArea} = Input
let _util = new CommonUtil()

const messages = defineMessages({
  confirm_title: {
    id: 'app.confirm.title.submit',
    defaultMessage: '确认提交?',
  },
  confirm_content: {
    id: 'app.common.button.content',
    defaultMessage: '单击确认按钮后，将会提交数据',
  },
  okText: {
    id: 'app.button.ok',
    defaultMessage: '确认',
  },
  cancelText: {
    id: 'app.button.cancel',
    defaultMessage: '取消',
  },
  saved: {
    id: 'app.message.walkthrough.saved',
    defaultMessage: '保存成功',
  },
  is_create: {
    id: 'page.walkthrough.is_create',
    defaultMessage: '是否创建工单?',
  },
  create_desc: {
    id: 'page.walkthrough.create_desc',
    defaultMessage: '单击确认按钮后，将会跳转工单创建',
  },
  yes: {
    id: 'page.walkthrough.content.yes',
    defaultMessage: '是',
  },
  no: {
    id: 'page.walkthrough.content.no',
    defaultMessage: '否',
  },
  check_item: {
    id: 'page.walkthrough.check_item',
    defaultMessage: '请勾选检查步骤',
  },
  uploaded: {
    id: 'app.message.walkthrough.uploaded',
    defaultMessage: '上传成功',
  },
  tips: {
    id: 'app.message.walkthrough.tips',
    defaultMessage: '提示',
  },
  notice1: {
    id: 'app.message.walkthrough.notice1',
    defaultMessage: '计划中的任务单，请确认是否提前执行；',
  },
  notice2: {
    id: 'app.message.walkthrough.notice2',
    defaultMessage: '任务单已过期，请确认是否补做该任务单；',
  }
});

@inject('appState') @inject('menuState') @observer @injectIntl
class TaskChecking extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      docList: [],
      checkresult: [],
      is_show: true,
      spinLoading: true,
      data: [],
      question: [],
      remarkVisible: false,
      uploadVisible: false,
      index: '',
      uuid: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleUploadChange = this.handleUploadChange.bind(this);

  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      WorkSheetDetail(this.props.location.state.id).then((res) => {
        const {results} = res.data

        let source_list = []
        if (results.file_path) {
          results.file_path.split(',').map((value, index) => {
            return source_list.push({
              uid: -(index + 1),
              name: value,
              status: 'done',
              url: _util.getImageUrl(value),
              thumbUrl: _util.getImageUrl(value),
              response: {
                content: {
                  results: {
                    url: value
                  }
                }
              }
            })
          })
        }

        let temp = []
          temp = results.step_info.map((c,index) => {
            return c.children.map((f,cindex) =>{
              return false
            })
          })
        // this.checked = temp
        const { formatMessage } = this.props.intl
        if(results.status_id == 0) {
          notification.open({
            message: formatMessage(messages.tips),   //Notification
            description: formatMessage(messages.notice1),  //计划中的任务单，请确认是否提前执行；
            duration: 0,
          });
        }
        if(results.status_id == 2) {
          notification.open({
            message: formatMessage(messages.tips),   //Notification
            description: formatMessage(messages.notice2),  //任务单已过期，请确认是否补做该任务单；
            duration: 0,
          });
        }

        this.setState({
          docList: source_list,
          data: res.data.results,
          code: results.sys_eqp_no,
          name: results.sys_eqp_name,
          rule: results.rule_name,
          // type: results.check_type == 0 ? "扫码" : results.check_type == 1 ? "手动" : "NFC",
          type: results.check_type_name,
          question: results.step_info,
          checked: temp,
          spinLoading: false
          // question: [{"id": 1,"name":"检查皮带松紧","children":[{"name":"1-1","id":1},{"name":"1-2","id":2},{"name":"1-3","id":3}]}]
        })
      })

    }
  }

  handleSubmit(e) {

    // let is_true = false;   //false - 无异常， true - 有异常
    // is_true = this.step_info.some((q,index) => {
    //   return q.children.some(d => {
    //     return (d.id == this.answer[index].result_id) && d.is_fault === 'True'
    //   })
    // })

    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this
        const {package_id, targetKeys, question} = _this.state
        _this.setState({
          confirmLoading: true
        })

        console.log(values)
        let answer = []
        Object.keys(values).forEach((item, index) => {
          const strArr = item.split('-')
          let idx = strArr[1]
          if (item.indexOf('checked') != -1) {
            if (values[item]) {
              let remarks = question[idx].children.filter(c => c.id == values[item])[0].remarks
              let file_path = question[idx].children.filter(c => c.id == values[item])[0].file_path
              answer.push({step_id: question[idx].id, result_id: values[item], remarks: remarks, file_path: file_path})
            }
          }
        })
        console.log(answer)

        // let valid = true
        // valid = question.every((d,index) => {
        //   let item =  d.children.filter(q => q.id == answer[index].result_id)[0]
        //   if(item && item.has_remarks){
        //     if(item.remarks && item.file_path){
        //       return true
        //     }else {
        //       return false
        //     }
        //   }else {
        //     return true
        //   }
        // })
        // console.log(valid)
        // if(!valid){
        //   message.error("请完善选项的备注和附件");
        //   return
        // }


        //检查结果 false - 无异常， true - 有异常
        let is_true = false;
        is_true = question.some((q,index) => {
          return q.children.some(d => {
            return (d.id == answer[index].result_id) && d.is_fault === 'True'
          })
        })
        console.log(is_true)

        const data = {
          task_id: _this.props.location.state.id,
          result_list: JSON.stringify(answer),
        }
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            CheckPost(data).then((res) => {
              message.success(formatMessage(messages.saved))   //保存成功
              _this.setState({
                is_show: false,
                checklist_id: res.data.results
              })

              appState.setEQPTCheckId(res.data.results)
              if(is_true){
                _this.showConfirm()
              }else {
                _this.props.history.goBack()
              }

            })
          },
          onCancel() {
          },
        })
      }
      this.setState({
        confirmLoading: false
      })
    })
  }

  showConfirm = () => {
    let _this = this
    const { formatMessage } = this.props.intl
    confirm({
      title: formatMessage(messages.is_create),   //是否创建工单?
      content: formatMessage(messages.create_desc),    //单击确认按钮后，将会跳转工单创建
      okText: formatMessage(messages.yes),   //是
      cancelText: formatMessage(messages.no),   //否
      onOk() {
        WorkOrderInfo({checklist_id: _this.state.checklist_id}).then((res) => {
          _this.props.history.push({
            pathname: '/workorder/order/add',
            state: {
              label: 'facility',
              info: res.data.results,
              // url: _this.props.location.pathname
              path: '/eqp/mytask'
            }
          })
        })
      },
      onCancel() {
        _this.props.history.goBack()
      },
    });
  }

  handleSubmit1(e) {
    e.preventDefault()
    const { formatMessage } = this.props.intl
    this.props.form.validateFieldsAndScroll((err, values) => {

      const {project} = this.state
      let _this = this
      let content = {}
      content.project = project

      if (!err) {
        const _this = this
        _this.setState({
          confirmLoading: true
        })
        /*
         *  """

         """
         * */
        const data = {
          approval_type: this.props.location.state.approval_type,
          check_list_type: this.props.location.state.type,
          record_id: this.props.location.state.id,
          content: JSON.stringify(content)
        }

        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            if (Math.floor(Math.random() * 10) > 5) {  //检查有异常结果则跳转工单创建，参数任务单名称+异常步骤
              confirm({
                title: formatMessage(messages.is_create),   //是否创建工单?
                //content: '',
                okText: formatMessage(messages.yes),    //是
                cancelText: formatMessage(messages.no),    //否
                onOk() {

                  _this.props.history.push({
                    pathname: '/workorder/order/add',
                    state: {
                      label: 'facility',
                      info: _this.state.info
                    }
                  })

                  CheckPost(data).then((res) => {
                    message.success(formatMessage(messages.saved));   //保存成功
                    // _this.setState({
                    //     // showConstruction: true,
                    //     project_id: res.data.id
                    // })
                    _this.props.history.goBack()
                    //console.log(res.data.id)
                  })
                },
                onCancel() {
                },
              })
            } else {
              CheckPost(data).then((res) => {
                message.success(formatMessage(messages.saved));   //保存成功
                // _this.setState({
                //     // showConstruction: true,
                //     project_id: res.data.id
                // })
                _this.props.history.goBack()
                //console.log(res.data.id)
              })
            }
          },
          onCancel() {
          },
        })
      }
      this.setState({
        confirmLoading: false
      })
    })
  }

  // handleUploadChange(info) {
  //   let {fileList} = info
  //   const status = info.file.status
  //   if (status !== 'uploading') {
  //     // console.log(info.file, info.fileList)
  //   }
  //   if (status === 'done') {
  //     message.success(`${info.file.name} 上传成功.`)
  //   } else if (status === 'error') {
  //     message.error(`${info.file.name} ${info.file.response}.`)
  //   }
  //   this.setState({fileList})
  // }

  handleRemarksChange = (index, id, e) => {
    const {fileList, question} = this.state

    question[index].children.filter(c => c.id == id)[0].remarks = e.target.value
    this.setState({
      question
    })
  }

  handleChange = (value, obj) => {
    this.setState({
      search_info: value,
      search_id: obj ? obj.props.title : null,
      search_data: [],
      fetching: false,
    })
  }

  // handleRadioChange = index => {
  //
  // }

  handleUploadChange(info) {
    let {fileList} = info

    const status = info.file.status
    const {formatMessage} = this.props.intl
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} ${formatMessage(messages.uploaded)}.`)   //上传成功
    } else if (status === 'error') {
      message.error(`${info.file.name} ${info.file.response.msg}.`)
    }
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = _util.getImageUrl(file.response.content.results.url);
      }
      return file;
    });
    this.setState({fileList})
  }

  handleRemark = () =>{
    this.setState({
      remarkVisible: true
    })
  }

  handleRemarkVisible = () =>{
    this.setState({
      remarkVisible: false
    })
  }

  handleUploadFile = (index, id, e) =>{
    e.preventDefault();
    const {question} = this.state
    let source_list = []
    let path = question[index].children.filter(c => c.id == id)[0].file_path
    if (path) {
      path.split(',').map((value, index) => {
        return source_list.push({
          uid: -(index + 1),
          name: value,
          status: 'done',
          url: _util.getImageUrl(value),
          thumbUrl: _util.getImageUrl(value),
          response: {
            content: {
              results: {
                url: value
              }
            }
          }
        })
      })
    }

    this.setState({
      index,
      uuid: id,
      fileList: source_list,
      uploadVisible: true
    })
  }
  handleUploadVisible = () =>{
    this.setState({
      fileList: [],
      uploadVisible: false
    })
  }

  onUploadFileOk = () => {
    const {uuid, index, fileList, question} = this.state
    console.log(question)
    let source = []
    if (fileList instanceof Array) {
      fileList.forEach((value) => {
        source.push(value.response.content.results.url)
      })
    }

    question[index].children.filter(c => c.id == uuid)[0].file_path = source.length ? source.join(',') : ''
    // console.log(question[index].children.filter(c => c.id == uuid)[0].file_path)

    question[index].children.filter(c => c.id == uuid)[0].source = fileList

    this.setState({
      question,
      uploadVisible: false,
      fileList: []
    })
  }

  handleClickRadio = (index, index2, e) => {
    const {checked} = this.state
    let arr = checked[index].map(d => {
      return false
    })
    checked[index] = arr
    checked[index][index2] = true
    console.log(checked)
    this.setState({
      checked
    })
  }

  render() {
    const {question, data, code, name, rule, type, spinLoading, fileList, docList, remarkVisible, uploadVisible } = this.state
    const {getFieldDecorator, getFieldsValue} = this.props.form;
    const { formatMessage } = this.props.intl
    const formItemLayout = {
      'labelCol': {
        'xs': {'span': 24},
        'sm': {'span': 14}
      },
      'wrapperCol': {
        'xs': {'span': 24},
        'sm': {'span': 8}
      }
    }

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 12},
      },
    };

    const props2 = {
      multiple: true,
      action: _util.getServerUrl('/upload/card/'),
      headers: {
        Authorization: 'JWT ' + _util.getStorage('token')
      },
      data: {
        site_id: _util.getStorage('site')
      },
      // listType: 'picture',
      className: 'upload-list-inline',
    }

    const uploadButton = (
      <Button size="small">
        <Icon type="upload"/> upload
      </Button>
    );

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <div className={styles.checklist}>
            <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit} className="specific">

              <table style={{width: '1000px', margin: '0 auto'}} border="0" cellPadding="0"
                     cellSpacing="0" className="check">
                <thead>
                <tr>
                  <th colSpan="4" align="center"><FormattedMessage id="page.walkthrough.checklist" defaultMessage="检查表" /></th>
                </tr>
                </thead>
                <tbody>

                <tr>
                  <td colSpan="4">&nbsp;</td>
                </tr>

                <tr>
                  <td width="25%"><FormattedMessage id="page.walkthrough.eqpt_code" defaultMessage="设备编号" />：</td>
                  <td width="25%">{code}</td>
                  <td width="25%"><FormattedMessage id="page.walkthrough.eqpt_name" defaultMessage="设备名称" />：</td>
                  <td width="25%">{name}</td>
                </tr>
                <tr>
                  <td><FormattedMessage id="page.walkthrough.rule_code" defaultMessage="规则编号" />：</td>
                  <td>{rule}</td>
                  <td><FormattedMessage id="page.walkthrough.maintenance_type" defaultMessage="维护类型" />：</td>
                  <td>{type}</td>
                </tr>
                <tr>
                  <td colSpan="4" style={{fontWeight: '700'}}><FormattedMessage id="page.walkthrough.check_step" defaultMessage="检查步骤" /><i style={{fontWeight: 'normal'}}>（<FormattedMessage id="page.walkthrough.step_desc" defaultMessage="绿色：正常结果，红色：异常结果" />）</i></td>
                </tr>
                <tr>
                  <td colSpan="4">
                    {
                      question.map((q, index) => {
                        return (
                          <div key={index} style={{
                            padding: '15px 20px 5px',
                            overflow: 'hidden',
                            borderBottom: '1px solid #f1f1f1'
                          }}>
                            <div>
                              <div style={{marginBottom: '10px'}}
                                   id={`${index + 1}${q.name}`}>{q ? `${index + 1} 、${q.name}` : null}</div>
                              <FormItem style={{marginBottom: 0}}>
                                {getFieldDecorator(`checked-${index}`, {
                                  rules: [
                                    {
                                      message: formatMessage(messages.check_item),   //请勾选检查步骤
                                      required: true
                                    }
                                  ],
                                })(
                                  <RadioGroup
                                    // onChange={() => this.handleRadioChange(index)}
                                    style={{width: '100%',verticalAlign: 'top'}}>
                                    {
                                      q.children instanceof Array && q.children.length ?
                                        q.children.map((c, idx) => {
                                          return (
                                          <Fragment key={idx}>
                                            <Radio value={c.id} onClick={this.handleClickRadio.bind(this, index, idx)} style={{width: '48%',padding: '0 5px',verticalAlign: 'top'}}><span style={{color: c.is_fault === 'True' ? 'red' : 'green',verticalAlign: 'top'}}>{c ? c.name : null}</span>

                                            {
                                              c.has_remarks && this.state.checked[index][idx] ?
                                                <div style={{paddingLeft: '33px'}}>
                                                  <span className="ipt-wrap" style={{display: 'block',borderBottom: '1px solid #ebedf0', lineHeight: '1.4', verticalAlign: 'top'}}>
                                                    <input type="text" value={question[index].children[idx].remarks} style={{width: '100px', border: 'none', verticalAlign: 'top'}} placeholder="备注" onChange={this.handleRemarksChange.bind(this, index, c.id)}/>
                                                  </span>
                                                  {/*<span className="btn btn-xs" onClick={this.handleRemark} style={{marginRight: '10px'}}><Icon type="edit" /> Remark</span>*/}
                                                  <span style={{marginTop: '10px'}} className="btn btn-xs" onClick={this.handleUploadFile.bind(this, index, c.id)}><Icon type="upload" /> Upload</span>

                                                  {
                                                    c.source && c.source.length > 0
                                                      ?
                                                      <Upload
                                                          fileList={c.source}
                                                          beforeUpload={(file, files) => _util.beforeUploadFile(file, files, 3)}
                                                          onChange={this.handleUploadChange}
                                                          accept=".jpg, .jpeg, .png, .xlsx, .xls"
                                                          showUploadList={{
                                                              showPreviewIcon: false,
                                                              showRemoveIcon: false,
                                                              showDownloadIcon: false
                                                          }}
                                                      >
                                                      </Upload>
                                                      :
                                                      null
                                                  }
                                                </div>
                                                :
                                                null
                                            }
                                            </Radio>
                                          </Fragment>
                                          )
                                        })
                                        :
                                        ''
                                    }
                                  </RadioGroup>
                                )}
                              </FormItem>
                            </div>
                          </div>

                        )

                      })
                    }
                  </td>
                </tr>
                <tr>
                  <td colSpan="4">
                    <FormattedMessage id="page.walkthrough.document" defaultMessage="操作手册" />
                    {
                      docList && docList.length > 0
                        ?
                        <Upload
                            fileList={docList}
                            beforeUpload={(file, files) => _util.beforeUploadFile(file, files, 3)}
                            onChange={this.handleUploadChange}
                            accept=".jpg, .jpeg, .png, .xlsx, .xls"
                            showUploadList={{
                                showRemoveIcon: false
                            }}
                        >
                        </Upload>
                        :
                        <FormattedMessage id="app.page.content.none" defaultMessage="-"/>
                    }
                  </td>
                </tr>
                </tbody>
              </table>

              <Modal
                title={<FormattedMessage id="app.walkthrough.modal.remark" defaultMessage="备注"/>}
                visible={remarkVisible}
                onOk={this.doSubmit}
                onCancel={() => this.handleRemarkVisible()}
                okText={formatMessage(messages.okText)}  //提交
                cancelText={formatMessage(messages.cancelText)}  //取消
              >
                <div>
                  <span className="ipt-wrap" style={{display: 'inline-block',borderBottom: '1px solid #ebedf0', lineHeight: '1.4'}}>
                    <input type="text" style={{width: '100px', border: 'none'}} placeholder="备注"/>
                  </span>
                </div>
              </Modal>

              <Modal
                title={<FormattedMessage id="app.walkthrough.modal.file" defaultMessage="附件"/>}
                visible={uploadVisible}
                onOk={this.onUploadFileOk}
                onCancel={() => this.handleUploadVisible()}
                okText={formatMessage(messages.okText)}  //提交
                cancelText={formatMessage(messages.cancelText)}  //取消
              >
                <div style={{display: 'inline-block',width: '200px'}}>
                  <Upload
                    {...props2}
                    fileList={fileList}
                    beforeUpload={(file, files) => _util.beforeUploadFile(file, files, 3)}
                    // onPreview={this.handlePreview}
                    onChange={this.handleUploadChange}
                    // accept='image/*,.pdf,.xlsx,.xls,.docx,.doc,.zip'
                    accept='image/*'
                  >
                    {fileList.length < 5 ? uploadButton : null}
                  </Upload>
                </div>
              </Modal>

              <FormItem {...submitFormLayout} style={{marginTop: 32}}>
                {
                  this.state.is_show ?
                    <Button type="primary" htmlType="submit">
                      <FormattedMessage id="app.button.submit" defaultMessage="提交" />
                    </Button>
                    :
                    null
                }
                <GoBackButton props={this.props} style={{marginLeft: '8px'}}/>
              </FormItem>

            </Form>
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}

export default TaskChecking = Form.create()(TaskChecking)
