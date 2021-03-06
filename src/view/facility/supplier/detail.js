import React from 'react'
import {Tag} from 'antd'
import {inject, observer} from 'mobx-react'
import MyBreadcrumb from '@component/bread-crumb'
import moment from 'moment'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import {SupplierDetail} from '@apis/facility/supplier'
import GoBackButton from '@component/go-back'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'

let _util = new CommonUtil()

@inject('menuState') @observer
export default class AllTaskDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      SupplierDetail(this.props.location.state.id).then((res) => {
        let data = res.data.results
        let phone = ''
        if(data.phone_a && data.phone_b){
          phone = [data.phone_a, data.phone_b].join(',')
        }else {
          phone = data.phone_a
        }

        this.setState({
          phone,
          ...res.data.results
        })
        this.props.menuState.changeMenuCurrentUrl('/eqp/supplier')
        this.props.menuState.changeMenuOpenKeys('/eqp')
      })
    }
  }

  render() {
    const {name, company, email, phone, remarks, created, created_time, created_name, updated_name, updated_time} = this.state

    const tableData = [
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.company" defaultMessage="供应商名称" />,
        value: _util.getOrNull(name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.email" defaultMessage="邮箱" />,
        value: _util.getOrNull(email)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.phone" defaultMessage="联系电话" />,
        value: _util.getOrNull(phone)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.desc" defaultMessage="备注" />,
        value: _util.getOrNull(remarks)
      },
      {
        text: <FormattedMessage id="page.walkthrough.created_name" defaultMessage="创建人" />,
        value: _util.getOrNull(created_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.created_time" defaultMessage="创建时间" />,
        value: created_time ? moment(created_time).format('YYYY-MM-DD HH:mm') : "-"
      },
      {
        text: <FormattedMessage id="page.walkthrough.updated_name" defaultMessage="上次修改人" />,
        value: _util.getOrNull(updated_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.updated_time" defaultMessage="修改时间" />,
        value: updated_time ? moment(updated_time).format('YYYY-MM-DD HH:mm') : "-"
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
