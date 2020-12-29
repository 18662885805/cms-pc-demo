import React from 'react'
import {Tag} from 'antd'
import {
  inject,
  observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import moment from 'moment'
import {PackageDetail} from '@apis/facility/packages'
import GoBackButton from '@component/go-back'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'

let _util = new CommonUtil()

const messages = defineMessages({
  urgent: {
    id: 'page.walkthrough.text.urgent',
    defaultMessage: '紧急',
  },
  high_level: {
    id: 'page.walkthrough.text.high_level',
    defaultMessage: '高',
  },
  middle: {
    id: 'page.walkthrough.text.middle',
    defaultMessage: '中',
  },
  low: {
    id: 'page.walkthrough.text.low',
    defaultMessage: '低',
  },
});

@inject('menuState') @observer @injectIntl
export default class AllTaskDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      console.log(this.props.location.state.id)
      PackageDetail(this.props.location.state.id).then((res) => {
        this.setState({
          ...res.data.results
        })
        this.props.menuState.changeMenuCurrentUrl('/eqp/package')
        this.props.menuState.changeMenuOpenKeys('/eqp')
      })
    }
  }

  descFun = (d) => {
    const {formatMessage} = this.props.intl
    let priority  = ''
    switch (d) {
      case '0': //紧急
        priority = formatMessage(messages.urgent)
        break
      case '1': //高
        priority = formatMessage(messages.high_level)
        break
      case '2': //中
        priority = formatMessage(messages.middle)
        break
      case '3': //低
        priority = formatMessage(messages.low)
        break
      default:
        priority = '-'
    }

    return priority
  }

  render() {
    const {
      name, number, type, source, created_time, created_name, rule, is_cycle, cycle, check_type, created, update,
      updated_name, updated_time, start_time, status, status_id, package_name, user_name,
      priority, user_dept, desc
    } = this.state

    const tableData = [
      {
        text: <FormattedMessage id="page.walkthrough.package_name" defaultMessage="任务包名称" />,
        value: _util.getOrNull(name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.status" defaultMessage="状态" />,
        value: _util.getTaskStatus(status_id)
      },
      {
        text: <FormattedMessage id="page.walkthrough.user_name" defaultMessage="执行人" />,
        value: _util.getOrNull(user_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.user_dept" defaultMessage="执行部门" />,
        value: _util.getOrNull(user_dept)
      },
      {
        text: <FormattedMessage id="page.walkthrough.priority" defaultMessage="优先级" />,
        value: this.descFun(priority)
      },
      {
        text: <FormattedMessage id="page.walkthrough.desc" defaultMessage="描述" />,
        value: _util.getOrNull(desc)
      },
      {
        text: <FormattedMessage id="page.walkthrough.created_name" defaultMessage="创建人" />,
        value: _util.getOrNull(created_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.created_time" defaultMessage="创建时间" />,
        value: created_time ? moment(created_time).format('YYYY-MM-DD HH:mm:ss') : _util.getOrNull(created_time)
      },
      {
        text: <FormattedMessage id="page.walkthrough.updated_name" defaultMessage="修改人" />,
        value: _util.getOrNull(updated_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.updated_time" defaultMessage="修改时间" />,
        value: updated_time ? moment(updated_time).format('YYYY-MM-DD HH:mm:ss') : _util.getOrNull(updated_time)
      },

    ]

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情" />} data={tableData}/>
          <GoBackButton
            style={{display: 'block', margin: '0 auto'}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    )
  }
}
