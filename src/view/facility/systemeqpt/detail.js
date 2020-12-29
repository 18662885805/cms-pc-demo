import React from 'react'
import {Tag} from 'antd'
import {
  inject,
  observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import moment from 'moment'
import {SyseqptDetail} from '@apis/facility/syseqpt'
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
      console.log(this.props.location.state.id)
      SyseqptDetail(this.props.location.state.id).then((res) => {
        this.setState({
          ...res.data.results
        })
        this.props.menuState.changeMenuCurrentUrl('/eqp/syseqp')
        this.props.menuState.changeMenuOpenKeys('/eqp')
      })
    }
  }

  render() {
    const {name, number, type, type_name, trade_key_abbr, related_key_name, source, created, created_time,
      created_name, updated_name, updated_time, key, short, sys_eqp_no, location_name, desc, creator_dept, cost_center,
      fixed_assets_num, manufacture_date, valid_date, manufacture_company, brand, power, diyinfo
    } = this.state

    const tableData = [
      {
        text: <FormattedMessage id="page.walkthrough.type_desc" defaultMessage="类型" />,
        value: _util.getOrNull(type_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.trade_key" defaultMessage="类KEY" />,
        value: _util.getOrNull(trade_key_abbr)
      },
      {
        text: <FormattedMessage id="page.walkthrough.system_eqpt_name" defaultMessage="系统/设备名称" />,
        value: _util.getOrNull(name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.system_eqpt_ident" defaultMessage="系统/设备标识" />,
        value: _util.getOrNull(sys_eqp_no)
      },
      {
        text: <FormattedMessage id="page.walkthrough.location" defaultMessage="位置" />,
        value: _util.getOrNull(location_name)
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
        value: created_time ? moment(created_time).format('YYYY-MM-DD HH:mm') : "-"
      },
      {
        text: <FormattedMessage id="page.walkthrough.dept" defaultMessage="部门" />,
        value: _util.getOrNull(creator_dept)
      },
      {
        text: <FormattedMessage id="page.walkthrough.cost_center" defaultMessage="成本中心" />,
        value: _util.getOrNull(cost_center)
      },
      {
        text: <FormattedMessage id="page.walkthrough.diyinfo" defaultMessage="自定义编号" />,
        value: _util.getOrNull(diyinfo)
      },
      {
        text: <FormattedMessage id="page.walkthrough.asset" defaultMessage="固定资产编号" />,
        value: _util.getOrNull(fixed_assets_num)
      },
      {
        text: <FormattedMessage id="page.walkthrough.production" defaultMessage="生产日期" />,
        value: _util.getOrNull(manufacture_date)
      },
      {
        text: <FormattedMessage id="page.walkthrough.assurance" defaultMessage="质保日期" />,
        value: _util.getOrNull(valid_date)
      },
      {
        text: <FormattedMessage id="page.walkthrough.producer" defaultMessage="生产产商" />,
        value: _util.getOrNull(manufacture_company)
      },
      {
        text: <FormattedMessage id="page.walkthrough.brand" defaultMessage="品牌" />,
        value: _util.getOrNull(brand)
      },
      {
        text: <FormattedMessage id="page.walkthrough.power" defaultMessage="额定功率" />,
        value: _util.getOrNull(power)
      },
      {
        text: <FormattedMessage id="page.walkthrough.updated_name" defaultMessage="修改人" />,
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
