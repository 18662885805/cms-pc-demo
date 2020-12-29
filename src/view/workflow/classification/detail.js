import React from 'react'
import {Tag, Spin} from 'antd'
import {
  inject,
  observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import moment from 'moment'
import {classificationDetail} from '@apis/workflow/classification'
import GoBackButton from '@component/go-back'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'

let _util = new CommonUtil()

@inject('menuState') @observer
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {spinLoading: true}
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      classificationDetail(this.props.location.state.id, {project_id: _util.getStorage('project_id')}).then((res) => {
        this.setState({
          ...res.data,
          spinLoading: false
        })
        this.props.menuState.changeMenuCurrentUrl('/workflow/classification')
        this.props.menuState.changeMenuOpenKeys('/workflow')
      })
    }
  }

  render() {
    const {name, org_type, created, created_time, updated, updated_time, spinLoading,abbreviation} = this.state

    const tableData = [
       {
        text:'简码',
        value: _util.getOrNull(abbreviation)
      },
      {
        text:'分类名称',
        value: _util.getOrNull(name)
      },
      {
        text: <FormattedMessage id="app.page.system.created" defaultMessage="创建人" />,
        value: _util.getOrNull(created)
      },
      {
        text: <FormattedMessage id="app.page.system.created_time" defaultMessage="创建时间" />,
        value: _util.getOrNull(created_time)
      },
      {
        text: <FormattedMessage id="app.page.system.updated" defaultMessage="上次修改人" />,
        value: _util.getOrNull(updated)
      },
      {
        text: <FormattedMessage id="app.page.system.updated_time" defaultMessage="修改时间" />,
        value: _util.getOrNull(updated_time)
      }
    ]

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
          name: <FormattedMessage id="page.component.workFlow.worktype" defaultMessage="分类配置"/>,
          url: '/workflow/classification'
      },
      {
          name: <FormattedMessage id="app.page.bread.detail" defaultMessage="详情"/>
      }
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread} />
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
