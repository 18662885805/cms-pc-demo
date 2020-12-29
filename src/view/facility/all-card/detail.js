import React from 'react'
import {Timeline, Tag, Upload} from 'antd'
import {
  inject,
  observer
} from 'mobx-react'
import MyBreadcrumb from '@component/bread-crumb'
import {MaintCardDetail} from "@apis/facility/maintcard"
import GoBackButton from '@component/go-back'
import PicList from '@component/PicList'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import moment from 'moment'

let _util = new CommonUtil()

@inject('menuState') @observer @injectIntl
class AllMaintCardDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      phone: '',
      company: '',
      interviewee_name: '',
      interviewee_tel: '',
      interviewee_department: '',
      created_time: '',
    }
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      MaintCardDetail(this.props.location.state.id).then((res) => {

        const data = res.data.results
        let source_list = []
        if (data.member_list) {
          data.member_list.split(',').map((value, index) => {
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

        let is_supplier_desc = ''
        if (data.is_supplier) {
          is_supplier_desc = '是'
        } else {
          is_supplier_desc = '否'
        }
        let update_time = ''
        if (data.updated_time) {
          update_time = moment(data.updated_time).format('YYYY-MM-DD HH:mm')
        }

        this.setState({
          update_time,
          is_supplier_desc,
          fileList: source_list,
          ...res.data.results
        })
        this.props.menuState.changeMenuCurrentUrl('/eqp/maintcard')
        this.props.menuState.changeMenuOpenKeys('/eqp')
      })
    }
  }

  render() {
    const {
      contract_no, main_obj, total_time, cost, supplier_name, supplier_no, supplier_email, supplier_phone_a, type, is_supplier, is_supplier_desc,
      supervisor, supplier, company, code, email, phone, desc, agent_person_name, main_person, start_time, end_time, fileList, hours, start_date,
      end_date, created_name, updated_name, created_time, update_time, file_path, maintain_detail
    } = this.state

    const tableData = [
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.number" defaultMessage="合同编号"/>,
        value: _util.getOrNull(contract_no)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.object" defaultMessage="维修对象"/>,
        value: _util.getOrNull(main_obj)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.type" defaultMessage="维修类型"/>,
        value: _util.getOrNull(type)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.hours" defaultMessage="工时"/>,
        value: _util.getOrNull(total_time)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.cost" defaultMessage="费用"/>,
        value: _util.getOrNull(cost)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.is_supplier" defaultMessage="是否供应商"/>,
        value: _util.getOrNull(is_supplier_desc)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.company" defaultMessage="供应商名称"/>,
        value: _util.getOrNull(supplier_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.code" defaultMessage="供应商编号"/>,
        value: _util.getOrNull(supplier_no)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.email" defaultMessage="邮箱"/>,
        value: _util.getOrNull(supplier_email)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.phone" defaultMessage="联系人电话"/>,
        value: _util.getOrNull(supplier_phone_a)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.supervisor" defaultMessage="监督人员"/>,
        value: _util.getOrNull(agent_person_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.workers" defaultMessage="维修人"/>,
        value: _util.getOrNull(main_person)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.content" defaultMessage="维修内容"/>,
        value: _util.getOrNull(maintain_detail)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.start_time" defaultMessage="开始时间"/>,
        value: _util.getOrNull(start_date)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.end_time" defaultMessage="结束时间"/>,
        value: _util.getOrNull(end_date)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.created" defaultMessage="创建人"/>,
        value: _util.getOrNull(created_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.created_time" defaultMessage="创建时间"/>,
        value: created_time ? moment(created_time).format('YYYY-MM-DD HH:mm') : '-'
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.update_name" defaultMessage="上次修改人"/>,
        value: _util.getOrNull(updated_name)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.update_time" defaultMessage="上次修改时间"/>,
        value: _util.getOrNull(update_time)
      },
      {
        text: <FormattedMessage id="page.walkthrough.maintcard.file" defaultMessage="附件"/>,
        value: file_path && file_path.split(',').length > 0
          ?
          <PicList fileList={file_path.split(',').map(pic => {
            return {
              uid: pic,
              url: _util.getImageUrl(pic)
            }
          })}/>
          :
          <FormattedMessage id="app.page.content.none" defaultMessage="-"/>
      }
    ]

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情"/>} data={tableData}/>
          <GoBackButton
            style={{display: 'block', margin: '0 auto'}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    )
  }
}

export default AllMaintCardDetail
