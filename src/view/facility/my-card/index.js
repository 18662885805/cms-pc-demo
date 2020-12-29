import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {
  Button, Input, Popconfirm, Divider, Select, Modal, message, Spin, Row, Col, Tag, Checkbox, Tooltip
} from 'antd'
import UserWrapper from '@component/user-wrapper'
import debounce from 'lodash/debounce'
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
// import {MyVip, VipVisitorDelete, VipVisitorSubmit, VipAuditWithDraw} from '@apis/event/my-vip'
// import {user} from '@apis/system/user'
import {MyMaintCard, MyMaintCardDelete} from '@apis/facility/mymaintcard'
import {interviewee} from "@apis/event/interviewee/"
// import {settingsForm} from '@apis/system/settings/index'
import {observer, inject} from 'mobx-react'
import TablePage from '@component/TablePage'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import translation from '../translation'
const Search = Input.Search
const confirm = Modal.confirm
const {Option} = Select
const {TextArea} = Input

const _util = new CommonUtil()

const messages = defineMessages({
  number: {
    id: 'page.walkthrough.maintcard.number',
    defaultMessage: '合同编号',
  },
  object: {
    id: 'page.walkthrough.maintcard.object',
    defaultMessage: '维修对象',
  },
  eqpNo: {
    id: 'page.walkthrough.maintcard.eqpNo',
    defaultMessage: '设备编号',
  },
  name: {
    id: 'page.walkthrough.maintcard.name',
    defaultMessage: '设备名称',
  },
  type: {
    id: 'page.walkthrough.maintcard.type',
    defaultMessage: '维修类型',
  },
  is_supplier: {
    id: 'page.walkthrough.maintcard.is_supplier',
    defaultMessage: '是否供应商',
  },
  company: {
    id: 'page.walkthrough.maintcard.company',
    defaultMessage: '供应商名称',
  },
  // code: {
  //   id: 'page.walkthrough.maintcard.code',
  //   defaultMessage: '供应商编号',
  // },
  supervisor: {
    id: 'page.walkthrough.maintcard.supervisor',
    defaultMessage: '监督人员',
  },
  // content: {
  //   id: 'page.walkthrough.maintcard.content',
  //   defaultMessage: '维修内容',
  // },
  hours: {
    id: 'page.walkthrough.maintcard.hours',
    defaultMessage: '工时/h',
  },
  cost: {
    id: 'page.walkthrough.maintcard.cost',
    defaultMessage: '费用',
  },
  // created_time: {
  //   id: 'page.walkthrough.maintcard.created_time',
  //   defaultMessage: '维护日期',
  // },
  start_time: {
    id: 'page.walkthrough.maintcard.start_time',
    defaultMessage: '开始时间',
  },
  end_time: {
    id: 'page.walkthrough.maintcard.end_time',
    defaultMessage: '结束时间',
  },
  update_name: {
    id: 'page.walkthrough.maintcard.update_name',
    defaultMessage: '上次修改人',
  },
  update_time: {
    id: 'page.walkthrough.maintcard.update_time',
    defaultMessage: '上次修改时间',
  },
  status: {
    id: 'page.walkthrough.maintcard.status',
    defaultMessage: '状态',
  },
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  select_enable_data: {
    id: 'app.component.tablepage.select_enable_data',
    defaultMessage: '请选择要启用的数据!',
  },
  enabled: {
    id: 'app.component.tablepage.enabled',
    defaultMessage: '已启用',
  },
  selected_data: {
    id: 'app.component.tablepage.selected_data',
    defaultMessage: '请选择要提交的数据!',
  },
  select_disable_data: {
    id: 'app.component.tablepage.select_disable_data',
    defaultMessage: '请选择要禁用的数据!',
  },
  disabled: {
    id: 'app.component.tablepage.disabled',
    defaultMessage: '已禁用',
  },
  export_data: {
    id: 'app.component.tablepage.export_data',
    defaultMessage: '请选择要导出的数据!',
  },
  full_table_search: {
    id: 'app.component.tablepage.full_table_search',
    defaultMessage: '全表搜索',
  },
  okText: {
    id: 'app.component.tablepage.okText',
    defaultMessage: '提交',
  },
  cancelText: {
    id: 'app.component.tablepage.cancelText',
    defaultMessage: '取消',
  },
  mycard: {
    id: 'page.walkthrough.maintcard.mycard',
    defaultMessage: '我的维修卡',
  }
});

@inject('menuState', 'appState')
@observer
@injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    const {formatMessage} = this.props.intl
    this.state = {
      column: [
        {
          title: formatMessage(translation.No),  //序号
          width: 40,
          maxWidth: 40,
          dataIndex: 'efm-index',
          render: (text, record, index) => {
            return (index + 1)
          }
        },
        {
          title: formatMessage(messages.number),    //合同编号
          dataIndex: 'contract_no',
          sorter: _util.sortString,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/eqp/mymaintcard/detail',
              state: {
                id: id
              }
            }
            return (
              <div>

                <Link to={path} style={{textDecoration: 'underline', color: '#12517D'}} onClick={this.setScrollTop}>
                  {record.contract_no}
                </Link>

              </div>
            );
          }
        },
        {
          title: formatMessage(messages.object),   //维修对象
          dataIndex: 'main_obj',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.type),     //维修类型
          dataIndex: 'type',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.is_supplier),     //是否供应商
          dataIndex: 'is_supplier',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.company),     //供应商名称
          dataIndex: 'supplier_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        // {
        //   title: formatMessage(messages.code),     //供应商编号
        //   dataIndex: 'code',
        //   sorter: _util.sortString,
        //   render: record => _util.getOrNullList(record)
        // },
        // {
        //   title: formatMessage(messages.supervisor),     //监督人员
        //   dataIndex: 'supervisor',
        //   sorter: _util.sortString,
        //   render: record => _util.getOrNullList(record)
        // },
        // {
        //   title: formatMessage(messages.content),     //维修内容
        //   dataIndex: 'content',
        //   sorter: _util.sortString,
        //   render: record => _util.getOrNullList(record)
        // },
        {
          title: formatMessage(messages.hours),     //工时
          dataIndex: 'total_time',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.cost),     //费用
          dataIndex: 'cost',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.start_time),
          dataIndex: 'start_date',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              <Tooltip
                title={record.start_date ? moment(record.start_date).format('YYYY-MM-DD') : '-'}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                {record.start_date ? moment(record.start_date).format('YYYY-MM-DD') : '-'}
              </Tooltip>
            )
          }
        },
        {
          title: formatMessage(messages.start_time),
          dataIndex: 'end_date',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: (text, record, index) => {
            return (
              <Tooltip
                title={record.end_date ? moment(record.end_date).format('YYYY-MM-DD') : '-'}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                {record.end_date ? moment(record.end_date).format('YYYY-MM-DD') : '-'}
              </Tooltip>
            )
          }
        },
        {
          title: formatMessage(messages.update_name),     //上次修改人
          dataIndex: 'updated_name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.update_time),     //上次修改时间
          dataIndex: 'updated_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        // {
        //   title: formatMessage(messages.end_time),    //结束时间
        //   dataIndex: 'end_time',
        //   filterType: 'range-date',
        //   sorter: _util.sortDate,
        //   render: (text, record, index) => {
        //     return (
        //       <Tooltip
        //         title={record.end_time && record.end_hour ? moment(record.end_time + ' ' + record.end_hour).format('YYYY-MM-DD HH:mm') : '-'}
        //         placement="topLeft"
        //         mouseEnterDelay={0.4}>
        //         {record.end_time && record.end_hour ? moment(record.end_time + ' ' + record.end_hour).format('YYYY-MM-DD HH:mm') : '-'}
        //       </Tooltip>
        //     )
        //   }
        // },
        // {
        //   title: formatMessage(messages.status),    //状态
        //   dataIndex: 'status_desc',
        //   sorter: _util.sortString,
        //   render: (val, record) => <Tag color={_util.getColor(record.status)}>{val}</Tag>
        // },
        {
          title: formatMessage(messages.operate),   //操作
          width: 120,
          dataIndex: 'operate',
          render: (text, record) => {
            let id = record.id
            let path = {
              pathname: '/eqp/mymaintcard/edit',
              state: {
                id: record.id
              }
            }
            return (
              <Fragment>
                <div style={{display: 'inline-block'}}>
                  < Link to={path} onClick={this.setScrollTop}>
                    <FormattedMessage id="app.page.text.modify" defaultMessage="修改"/>
                  </Link>
                </div>
                <Divider type="vertical"/>
                <Popconfirm
                  title={<FormattedMessage id="app.pop.title.delete" defaultMessage="确认删除？"/>}
                  okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                  cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                  onConfirm={() => {
                    this.onDeleteOne(id)
                  }}>
                  <a style={{color: '#f5222d'}}> <FormattedMessage id="app.page.text.delete" defaultMessage="删除"/>
                  </a>
                </Popconfirm>
              </Fragment>
            );
          }
        },
      ],
      selectedRowKeys: [],
      selectedRows: [],
      search: null,
      search_data: [],
      search_id: null,
      search_info: '',
      visible: false,
      attentionVisible: false,
      isDisabled: true,
      remarkModal: false,
      check: _util.check(),
      locale: _util.getStorage('langs') || _util.getCookie('django_language') || 'zh-Hans'
    }
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
  }

  componentDidMount() {


  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if (scrollTopPosition) {
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  onDeleteOne = (id) => {
    this.setState({refresh: false})
    MyMaintCardDelete(id).then((res) => {
      this.setState({refresh: true})
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, selectedRows})
  };

  fetchUser = (value) => {
    this.lastFetchId += 1
    const fetchId = this.lastFetchId
    this.setState({search_data: [], fetching: true, search_info: '', search_id: null})
    interviewee({q: value}).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return
      }
      console.log(res.data)
      const search_data = res.data.results.map(user => ({
        name: user.name,
        org:user.org,
        tel: user.tel,
        id_num: user.id_num,
        value: user.text,
        text: user.text,
        id: user.id
      }))
      this.setState({search_data, fetching: false})
    })
  }

  handleChange = (value, obj) => {
    this.setState({
      search_id: value,
      // search_data: [],
      fetching: false,
    })
  }

  render() {
    const {
      column, check, refresh, visible, search_info, attentionVisible, submitVisible, search_data, seconds, isDisabled, search_id
    } = this.state;
    const {formatMessage} = this.props.intl;

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">

          <TablePage
            refresh={refresh}
            getFn={MyMaintCard}
            columns={column}
            addPath={check(this, 'add') && '/eqp/mymaintcard/add'}
            excelName={check(this, 'excel') && formatMessage(messages.mycard)}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach(d => {
                if(d.is_supplier){
                  d.is_supplier = '是'
                }else {
                  d.is_supplier = '否'
                }
                if (d.updated_time) {
                  d.updated_time = moment(d.updated_time).format('YYYY-MM-DD HH:mm')
                }
                // d.number = 'H0052413038'
                // d.company = 'MJK'
                // d.type = '保养'
                // d.hours = Math.floor(Math.random()*10)
                // d.cost = Math.floor(Math.random()*1000)
                // d.content = "维修S201_Z_MK_0001系统、空压系统、制冷系统"
                // if (d.status) {
                //   d.status_desc = _util.genStatusDesc(d.status)
                // }
                // d.update_name = 'bpu'
                // d.update_time = '2019-12-10 17:38'
              })
            }}
          >

          </TablePage>

        </div>

      </div>
    )
  }
}
