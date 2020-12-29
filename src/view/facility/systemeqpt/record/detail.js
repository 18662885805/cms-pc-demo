import React, {Fragment} from 'react'
import {Timeline, Form, Radio, Checkbox, Tag, Icon, Upload} from 'antd'
import {
  inject,
  observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import { RecordsDetail } from "@apis/facility/records"
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import moment from 'moment'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
let _util = new CommonUtil()

@inject('menuState') @observer
class WorkSheetDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      question: []
    }
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      RecordsDetail(this.props.location.state.id).then((res) => {
        const result_info = res.data.results.result_info
        if (result_info && result_info.length) {
          result_info.map(f => {
            f.source = f.file_path.split(',').map((value, index) => {
              let source_list = []
              return ({
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
          })
        }

        this.setState({
          ...res.data.results,
          question: res.data.results.step_info,
          result: result_info
        })
        this.props.menuState.changeMenuCurrentUrl('/eqp/task')
        this.props.menuState.changeMenuOpenKeys('/eqp')
      })
    }
  }

  render() {
    const {
      code, created, desc, ruleid, question, user_name, rule_name, rule_no, created_time, start_time, next_remind, next_date,
      interval, interval_type_desc, eqp_name, eqp_no, status, status_id, check_type, submit_time, result, mtype_name
    } = this.state
    const {getFieldDecorator, getFieldsValue} = this.props.form;

    const tableData = [
      {
        text: <FormattedMessage id="page.walkthrough.system_eqpt_ident" defaultMessage="系统/设备标识" />,
        value: _util.getOrNull(eqp_no)
      },
      {
        text: <FormattedMessage id="page.walkthrough.system_eqpt_name" defaultMessage="系统/设备名称" />,
        value: _util.getOrNull(eqp_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.rule_name" defaultMessage="规则名称" />,
        value: _util.getOrNull(rule_no)
      },
      {
        text: <FormattedMessage id="page.walkthrough.user_name" defaultMessage="执行人" />,
        value: _util.getOrNull(user_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.cycle" defaultMessage="循环周期" />,
        value: (interval !== '' && interval) ? `${interval} ${interval_type_desc} ` : '-'
      },
      {
        text: <FormattedMessage id="page.walkthrough.plan_date" defaultMessage="计划完成时间" />,
        value: next_date ? moment(next_date).format('YYYY-MM-DD') : "-"
      },
      {
        text: <FormattedMessage id="page.walkthrough.actual_date" defaultMessage="实际完成时间" />,
        value: submit_time ? moment(submit_time).format('YYYY-MM-DD') : "-"
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
        value: check_type ? check_type == '0' ? <FormattedMessage id="app.walkthrough.text.scancode" defaultMessage="扫码" /> : <FormattedMessage id="app.walkthrough.text.notscan" defaultMessage="不扫码" /> : '-'
      },
      {
        text: <FormattedMessage id="page.walkthrough.status" defaultMessage="状态" />,
        value: _util.getStatusTag(status_id)
      },
      {
        text: <FormattedMessage id="page.walkthrough.check_step" defaultMessage="检查步骤" />,
        value: question instanceof Array && question.length ?
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
                      //initialValue: question[index].children.filter(n => n.is_fault == "True")[0].id,
                      initialValue: result[index].result_id
                    })(
                      <RadioGroup
                        //onChange={() => this.handleRadioChange(index)}
                        style={{width: '100%'}}
                        // value={
                        //   '' + question[index].children.map(n => n.is_fault).indexOf(true)
                        // }
                      >
                        {
                          q.children instanceof Array && q.children.length ?
                            q.children.map((c, idx) => {
                              return (
                                <Radio
                                  style={{width: '48%',padding: '0 5px',verticalAlign: 'top'}}
                                  value={c.id} disabled
                                  checked={c.id == result[index].result_id}
                                ><span style={{color: c.is_fault === 'True' ? 'red' : 'green'}}>{c ? c.name : null}</span>
                                  {
                                    c.has_remarks ?
                                      <Fragment>
                                        <span className="" style={{display: 'inline-block',borderBottom: '1px solid #ebedf0', margin: '0 15px'}}>
                                          {result[index].remarks}
                                        </span>

                                        {
                                          result[index] && result[index].source.length > 0
                                            ?
                                            <Upload
                                                fileList={result[index].source}
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

                                      </Fragment>
                                      :
                                      null
                                  }
                                </Radio>
                              )
                            })
                            :
                            ''
                        }
                      </RadioGroup>
                    )}
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

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情" />} data={tableData}/>
          <GoBackButton style={{display: 'block', margin: '0 auto'}} props={this.props} noConfirm/>
        </div>
      </div>
    )
  }
}

export default WorkSheetDetail = Form.create()(WorkSheetDetail)