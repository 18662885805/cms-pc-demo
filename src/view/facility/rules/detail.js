import React from 'react'
import {Tag, Form, Spin, Radio, Checkbox, Upload } from 'antd'
import {
  inject,
  observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import moment from 'moment'
import {RulesDetail} from '@apis/facility/rules'
import GoBackButton from '@component/go-back'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'

const FormItem = Form.Item
const RadioGroup = Radio.Group;
let _util = new CommonUtil()

@inject('menuState') @observer
class RulesDetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      spinLoading: true,
      interval: '',
      interval_type: ''
    }
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      RulesDetail(this.props.location.state.id).then((res) => {
        const data = res.data.results
        let source_list = []
        if (data.guide_menu) {
          data.guide_menu.split(',').map((value, index) => {
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
          fileList: source_list,
          ...res.data.results,
          spinLoading: false,
        })
        this.props.menuState.changeMenuCurrentUrl('/eqp/rule')
        this.props.menuState.changeMenuOpenKeys('/eqp')
      })
    }
  }

  getStatusTag(status){
      switch (status) {
        case '启用':
          return (<Tag color="#87d068"><FormattedMessage id="page.walkthrough.enable" defaultMessage="启用" /></Tag>);
        case '禁用':
          return (<Tag color="#CCCCCC"><FormattedMessage id="page.walkthrough.disable" defaultMessage="禁用" /></Tag>);
        default:
          return ('-');
      }
  }

  render() {
    const {
      fileList, name, desc, created_time, created_name, rule, mtype_name, cycle, is_cycle, is_cycle_desc, remind,
      check_type, created, update, updated_name, updated_time, interval, interval_type, interval_type_desc, step_data, rule_status, spinLoading, cycle_base
    } = this.state
    const {getFieldDecorator, getFieldsValue} = this.props.form;

    let cycleData = []

    if (is_cycle) {
      cycleData = [
        {
          text: <FormattedMessage id="page.walkthrough.cycle" defaultMessage="循环周期" />,
          value: interval ? `${interval} ${interval_type_desc} ` : '-'
        },
        {
          text: <FormattedMessage id="page.walkthrough.base" defaultMessage="循环基于" />,
          value: cycle_base === 'interval' ? '固定时间' : '完成时间'
        },
      ]
    }

    const tableData = [
      {
        text: <FormattedMessage id="page.walkthrough.rule_name" defaultMessage="规则名称" />,
        value: _util.getOrNull(name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintenancetype" defaultMessage="维护类型" />,
        value: _util.getOrNull(mtype_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.is_cycle" defaultMessage="是否循环" />,
        value: _util.getOrNull(is_cycle_desc)
      },
      ...cycleData,
      {
        text: <FormattedMessage id="page.walkthrough.remind" defaultMessage="提前提醒天数" />,
        value: _util.getOrNull(remind)
      },
      {
        text: <FormattedMessage id="page.walkthrough.status" defaultMessage="状态" />,
        value: this.getStatusTag(rule_status)
      },
      {
        text: <FormattedMessage id="page.walkthrough.check_type" defaultMessage="检查方式" />,
        value: _util.getOrNull(check_type)
      },
      {
        text: <FormattedMessage id="page.eqpt.created_name" defaultMessage="创建人" />,
        value: _util.getOrNull(created_name)
      },
      {
        text: <FormattedMessage id="page.eqpt.created_time" defaultMessage="创建时间" />,
        //value: _util.getOrNull(created_time)
        value: created_time ? moment(created_time).format('YYYY-MM-DD HH:mm') : "-"
      },
      {
        text: <FormattedMessage id="page.eqpt.updated_name" defaultMessage="上次修改人" />,
        value: _util.getOrNull(updated_name)
      },
      {
        text: <FormattedMessage id="page.eqpt.updated_time" defaultMessage="修改时间" />,
        //value: _util.getOrNull(updated_time)
        value: updated_time ? moment(updated_time).format('YYYY-MM-DD HH:mm') : "-"
      },
      {
        text: <FormattedMessage id="page.eqpt.desc" defaultMessage="描述" />,
        value: _util.getOrNull(desc)
      },
      {
        text: <FormattedMessage id="page.eqpt.steps" defaultMessage="步骤" />,
        value: step_data instanceof Array && step_data.length ?
          step_data.map((q, index) => {
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
                    {
                      q.content instanceof Array && q.content.length ?
                        q.content.map((c, idx) => {
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
                  </FormItem>
                  <i style={{fontWeight: 'normal'}}>（<FormattedMessage id="page.walkthrough.step_desc" defaultMessage="绿色：正常结果，红色：异常结果" />）</i>
                </div>
              </div>

            )

          })
          :
          '-'
      },
      {
        text: <FormattedMessage id="page.walkthrough.document" defaultMessage="操作说明"/>,
        value: fileList && fileList.length > 0
          ?
          <Upload
              fileList={fileList}
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
      },
    ]

    // <FormItem style={{marginBottom: 0}}>
    //   {getFieldDecorator(`checked-${index}`, {
    //     initialValue: step_data[index].content.filter(n => n.is_fault == "True")[0].id,
    //     rules: [
    //       {
    //         message: '请选择一个正确答案',
    //         required: true
    //       }
    //     ],
    //   })(
    //     <RadioGroup
    //       //onChange={() => this.handleRadioChange(index)}
    //       style={{width: '100%'}}
    //       //value={question[index].children.filter(n => n.is_fault == "True")[0].id}
    //       // value={
    //       //   '' + question[index].children.map(n => n.is_fault).indexOf(true)
    //       // }
    //     >
    //       {
    //         q.content instanceof Array && q.content.length ?
    //           q.content.map((c, idx) => {
    //             return (
    //
    //               <Radio
    //                 value={c.id} disabled
    //               ><span>{c ? c.name : null}</span></Radio>
    //
    //             )
    //           })
    //           :
    //           ''
    //       }
    //     </RadioGroup>
    //   )}
    // </FormItem>

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情" />} data={tableData}/>
          </Spin>
          <GoBackButton
            style={{display: 'block', margin: '0 auto'}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    )
  }
}

export default RulesDetailPage = Form.create()(RulesDetailPage)
