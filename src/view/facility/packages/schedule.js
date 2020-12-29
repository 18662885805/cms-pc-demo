import React, {Fragment} from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import MyBreadcrumb from '@component/bread-crumb'
import {
  Form, Button, Modal, Spin, message, Row, Col, Input as AntInput, Icon, Select, Tabs, Card, DatePicker, Tooltip
} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import moment from 'moment'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {observer, inject} from 'mobx-react'
import CommonUtil from '@utils/common'
import {Packages, PackageTask} from '@apis/facility/packages'
import inputDecorate from '@component/input-decorate'
import styles from './index.css';
import MyIcon from '@component/MyIcon'
const FormItem = Form.Item
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Input = inputDecorate(AntInput)
const {RangePicker} = DatePicker;
let _util = new CommonUtil()

@inject('appState') @inject('menuState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      loading: false,
      spinLoading: true,
      visible: false,
      mode: ['month', 'month'],
      value: [],
      start: '',
      end: '',
      tabledata: [
        {
          "year": '2019',
          "num": 21,
          "children": [
            {
              month: 'Aug',
              children: ['33', '34', '35']
            }, {
              month: 'Sep',
              children: ['36', '37', '38', '39', '40']
            }, {
              month: 'Oct',
              children: ['41', '42', '43', '44']
            }, {
              month: 'Nov',
              children: ['45', '46', '47', '48']
            }, {
              month: 'Dec',
              children: ['49', '50', '51', '52', '1']
            }
          ]
        },
        {
          "year": '2020',
          "num": 29,
          "children": [
            {
              month: 'Jan',
              children: ['2', '3', '4', '5']
            }, {
              month: 'Feb',
              children: ['6', '7', '8', '9']
            }
          ]
        }
      ]
    }
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace('/404')
    } else {
      this.setState({loading: true})
      Packages().then((res) => {
        this.setState({package: res.data.results})
        //_util.getInfo(res, this)
      })

      console.log(moment().startOf('year').format("YYYY-MM-DD"), moment().endOf('year').format("YYYY-MM-DD"))
      let today = moment(new Date()).format('YYYY-MM-DD')
      //let start = moment().startOf('month').format("YYYY-MM-DD")
      let start = moment(new Date()).format('YYYY-MM-DD')
      // let end = moment().endOf('year').format("YYYY-MM-DD")
      let end = moment(new Date()).add(1,'years').format('YYYY-MM-DD')
      console.log(start,end)
      PackageTask({package_id: this.props.location.state.id, start_time: start, end_time: end}).then((res) => {
        //_util.getInfo(res, this)
        this.setState({...res.data.results, loading: false})
        this.props.menuState.changeMenuCurrentUrl('/eqp/package')
        this.props.menuState.changeMenuOpenKeys('/eqp')
      })

      this.setState({
        start: moment(new Date()).format('YYYY-MM-DD'),
        end: moment(new Date()).add(1,'years').format('YYYY-MM-DD'),
        spinLoading: false
      })
    }

  }

  openModal = () => {
    this.setState({
      visible: true
    })
  }

  closeFormModal = () => {
    this.setState({
      visible: false
    })
  }

  // handlePanelChange = (value, mode) => {
  //   this.setState({
  //     value,
  //     mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
  //   });
  // };

  handleChange = value => {
    console.log(value)
    this.setState({value});
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  handlePanelChange = value => {
    console.log(moment(value[0]).format('YYYY-MM'), moment(value[1]).format('YYYY-MM'))

    if (Array.isArray(value) && value.length > 0) {
      const firstMonth = moment(value[0])
      const secondMonth = moment(value[1])

      if (secondMonth.subtract(11, 'months').isAfter(firstMonth)) {
        message.error('最多选择12个月！')
        return
      }

    } else {
      this.getInfo({
        page_size: this.state.pagination.pageSize
      })
    }
    this.setState({
      monthValue: value
    })
  }

  handleMonthChange = value => {
    console.log('change')
    // const {card_type} = this.state
    if (Array.isArray(value) && value.length === 0) {
      // this.getInfo({
      //   card_type,
      //   page_size: this.state.pagination.pageSize
      // })
      this.setState({
        monthValue: [null, null]
      })
    }
  }

  filterData = () => {
    const {monthValue} = this.state
    const {formatMessage} = this.props.intl;
    if (Array.isArray(monthValue) && monthValue.length > 0) {
      const values = {}
      values.start_time = moment(monthValue[0]).format('YYYY-MM')
      values.end_time = moment(monthValue[1]).format('YYYY-MM')
      // values.card_type = ''
      // values.page_size = this.state.pagination.pageSize

      // if (card_type) {
      //   values.card_type = card_type
      // }
      // this.getInfo(values)
    } else {
      message.error('请选择日期!')
    }

  }

  onDateChange = (value, dateString) => {

    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);

    let start_time = dateString[0]
    let end_time = dateString[1]
    this.setState({loading: true})
    // const values = {}
    // values.start_time = start_time
    // values.end_time = end_time

    PackageTask({package_id: this.props.location.state.id, start_time: start_time, end_time: end_time}).then((res) => {
      //_util.getInfo(res, this)
      this.setState({...res.data.results, loading: false})
    })

    this.setState({
      start_time: dateString[0],
      end_time: dateString[1],
    })
  }

  render() {
    const {
      confirmLoading, formData, spinLoading, tabledata, rowdata, task_info, title_info,
    } = this.state

    const rows = task_info ? task_info.map(d => {
      return (
        <tr key={d.task_id}>
          <td><Tooltip title={d.eqp_no}>{d.eqp_no}</Tooltip></td>
          <td><Tooltip title={d.eqp_name}>{d.eqp_name}</Tooltip></td>
          <td><Tooltip title={d.rule_name}>{d.rule_name}</Tooltip></td>
          {
            Array.isArray(d.week_info) && d.week_info.map((c, index) => {
              return (
                <td key={index}>{c.hastask > 0 ?
                  <a onClick={this.openModal}>{d.mtype_abbr ? d.mtype_abbr : ''}</a> : ''
                }</td>
              )
            })
          }

        </tr>
      )
    }) : ''
    const dateFormat = 'YYYY/MM/DD';
    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-table-wrapper schedule">

        <div className="btngroup">
            <RangePicker
              allowClear={false}
              defaultValue={[moment(moment(new Date()), 'YYYY-MM-DD'), moment(moment(new Date()).add(1,'years'), 'YYYY-MM-DD')]}
              style={{
                marginRight: 10
              }}
              placeholder={['开始日期','结束日期']}
              // ranges={{Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')]}}
              onChange={this.onDateChange}
              // onOk={this.onOk}
            />
        </div>

          {/*<RangePicker*/}
            {/*allowClear*/}
            {/*placeholder={['Start month', 'End month']}*/}
            {/*format="YYYY-MM"*/}
            {/*mode={['month', 'month']}*/}
            {/*// style={{width: 200, marginRight: '8px'}}*/}
            {/*value={this.state.monthValue}*/}
            {/*onPanelChange={value => this.handlePanelChange(value)}*/}
            {/*onChange={value => this.handleMonthChange(value)}*/}
          {/*/>*/}
        <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button"
                    table="table-to-xls"
                    filename="schedule"
                    sheet="schedule"
                    buttonText="导出Excel"/>
          <table id="table-to-xls" width="100%" border="0" className={styles.table} cellPadding={0} cellSpacing={0}>
            <thead>
            <tr>
              <td rowSpan="3">系统/设备编号</td>
              <td rowSpan="3">名称</td>
              <td rowSpan="3">规则</td>
              {
                Array.isArray(title_info) && title_info.map(d =>
                  <td colSpan={d.num} align="center" bgcolor="#7CB5EC">{d.year}</td>)
              }
            </tr>
            <tr>
              {
                Array.isArray(title_info) && title_info.map(d =>
                  d.children.map((c, index) => <td colSpan={c.children.length} key={index}>{c.month}</td>)
                )
              }
            </tr>
            <tr>
              {
                Array.isArray(title_info) && title_info.map(d =>
                  d.children.map(c =>
                    c.children.map((q, index) =>
                      <td key={index}>{q}</td>
                    )
                  )
                )
              }
            </tr>
            </thead>

            <tbody>

            {
              rows
            }

            </tbody>

          </table>

          <div style={{
            position: 'fixed',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            display: this.state.loading ? 'block' : 'none',
            zIndex: '1001',
            background: 'rgba(0,0,0,0.1)'
          }}><Spin spinning={this.state.loading}
                   style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}/>
          </div>
        </div>
      </div>

    )
  }
}

