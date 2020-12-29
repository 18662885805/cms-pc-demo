import React from 'react'
import {Timeline, Button, message, Spin, Modal, Form, Radio, Checkbox} from 'antd'
import {inject, observer} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {AllWorkSheetDetail} from "@apis/facility/allworksheet"
import {WorkSheetDetail, WorkOrderInfo} from '@apis/facility/worksheet'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import moment from 'moment'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'

const FormItem = Form.Item
const confirm = Modal.confirm
const RadioGroup = Radio.Group;
let _util = new CommonUtil()

@inject('menuState') @observer
class MyWorkSheetDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: null,
      source: null,
      spinLoading: true,
      info: ''
    }
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      WorkOrderInfo({checklist_id: this.props.location.state.id}).then((res) => {
        this.setState({
          info: res.data.results,
          spinLoading: false,
        })
      })

      AllWorkSheetDetail(this.props.location.state.id).then((res) => {

        this.setState({
          ...res.data.results
        })
        this.props.menuState.changeMenuCurrentUrl('/eqp/package')
        this.props.menuState.changeMenuOpenKeys('/eqp')
      })
    }
  }

  // handleSubmit = (e) => {
  //   e.preventDefault()
  //
  //   let _this = this
  //   confirm({
  //     title: '是否创建工单?',
  //     //content: '',
  //     okText: '是',
  //     cancelText: '否',
  //     onOk() {
  //
  //       _this.props.history.push({
  //         pathname: '/workorder/order/add',
  //         state: {
  //           info: _this.state.info
  //         }
  //       })
  //
  //     },
  //     onCancel() {
  //     },
  //   })
  //
  //   this.setState({
  //     confirmLoading: false
  //   })
  //
  // }


  render() {
    const {
      sys_eqp_name, sys_eqp_no, rule_name, package_name, location_name, check_type, last_date, next_remind, next_date, is_cycle, is_cycle_desc,
      user_name, interval, interval_type_desc, created, desc, step_info, workorder, status, spinLoading, mtype_name, check_type_name
    } = this.state

    const tableData = [
      {
        text: <FormattedMessage id="page.walkthrough.system_eqpt_ident" defaultMessage="系统/设备标识" />,
        value: _util.getOrNull(sys_eqp_no)
      },
      {
        text: <FormattedMessage id="page.walkthrough.system_eqpt_name" defaultMessage="系统/设备名称" />,
        value: _util.getOrNull(sys_eqp_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.package_name" defaultMessage="任务包名称" />,
        value: _util.getOrNull(package_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.rule_name" defaultMessage="规则名称" />,
        value: _util.getOrNull(rule_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.location" defaultMessage="位置" />,
        value: _util.getOrNull(location_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.is_cycle" defaultMessage="是否循环" />,
        value: _util.getOrNull(is_cycle_desc)
      },
      {
        text: <FormattedMessage id="page.walkthrough.cycle" defaultMessage="循环周期" />,
        value: interval && interval_type_desc ? `${interval} ${interval_type_desc} ` : '-'
      },
      {
        text: <FormattedMessage id="page.walkthrough.user_name" defaultMessage="执行人" />,
        value: _util.getOrNull(user_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.last_date" defaultMessage="上次维护日期" />,
        value: last_date ? moment(last_date).format('YYYY-MM-DD') : "-"
      },
      {
        text: <FormattedMessage id="page.walkthrough.next_remind" defaultMessage="下次提醒日期" />,
        value: next_remind ? moment(next_remind).format('YYYY-MM-DD') : "-"
      },
      {
        text: <FormattedMessage id="page.walkthrough.next_date" defaultMessage="下次维护日期" />,
        value: next_date ? moment(next_date).format('YYYY-MM-DD') : "-"
      },
      {
        text: <FormattedMessage id="page.walkthrough.status" defaultMessage="状态" />,
        value: _util.getOrNull(status)
      },
      {
        text: <FormattedMessage id="page.walkthrough.desc" defaultMessage="描述" />,
        value: _util.getOrNull(desc)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintenance_type" defaultMessage="维护类型" />,
        value: _util.getOrNull(mtype_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.check_type" defaultMessage="检查方式" />,
        value: _util.getOrNull(check_type_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.step_info" defaultMessage="步骤" />,
        value: step_info instanceof Array && step_info.length ?
          step_info.map((q, index) => {
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

                    <RadioGroup
                      //onChange={() => this.handleRadioChange(index)}
                      style={{width: '100%'}}>
                      {
                        q.children instanceof Array && q.children.length ?
                          q.children.map((c, idx) => {
                            return (

                              <Checkbox
                                value={c.id} disabled
                                // checked={c.is_fault == 'True'}
                              ><span style={{color: c.is_fault === 'True' ? 'red' : 'green'}}>{c ? c.name : null}</span></Checkbox>

                            )
                          })
                          :
                          ''
                      }
                    </RadioGroup>
                  </FormItem>
                  <i style={{fontWeight: 'normal'}}>（<FormattedMessage id="page.walkthrough.step_desc" defaultMessage="绿色：正常结果，红色：异常结果" />）</i>
                </div>
              </div>

            )

          })
          :
          '-'
      },
    ]

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10},
      },
    };

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情" />} data={tableData}/>
          </Spin>
          <FormItem {...submitFormLayout} style={{marginTop: 32}}>
            <GoBackButton props={this.props} style={{marginLeft: '8px'}} noConfirm/>
          </FormItem>
        </div>
      </div>
    )
  }
}

export default MyWorkSheetDetail = Form.create()(MyWorkSheetDetail)