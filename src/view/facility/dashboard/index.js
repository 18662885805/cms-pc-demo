import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import MyBreadcrumb from '@component/bread-crumb'
import {
  Layout, Form, Button, Modal, Spin, message, Row, Col, Input as AntInput, Icon, Select, Checkbox,
  Upload, Tabs, Radio, Calendar, Badge, Card, DatePicker
} from 'antd'
import numeral from 'numeral';
import NumberInfo from '@component/NumberInfo';
import moment from 'moment'
import LineEcharts from './linechart.js'
import BarEcharts from './chart.js'
import {observer, inject} from 'mobx-react'
import CommonUtil from '@utils/common'
import {areaInfo} from "@apis/system/area";
import {FacilityDataInfo, FacilityTaskChart, FacilityRatioLineChart} from '@apis/facility/dashboard'
import {visitInfo} from '@apis/system/location/'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import inputDecorate from '@component/input-decorate'
import MyIcon from '@component/MyIcon'
const FormItem = Form.Item
const Option = Select.Option;
const {Content} = Layout
const TabPane = Tabs.TabPane;
const Input = inputDecorate(AntInput)
const {RangePicker} = DatePicker
let _util = new CommonUtil()

const messages = defineMessages({
  location: {
    id: 'page.walkthrough.dashboard.location',
    defaultMessage: '厂区',
  },
  currentyear: {
    id: 'page.walkthrough.dashboard.currentyear',
    defaultMessage: '年份',
  },
  normal: {
    id: 'page.walkthrough.dashboard.normal',
    defaultMessage: '正常',
  },
  exception: {
    id: 'page.walkthrough.dashboard.exception',
    defaultMessage: '异常',
  },
  complete: {
    id: 'page.walkthrough.dashboard.complete',
    defaultMessage: '完成率',
  },
  yeartask: {
    id: 'page.walkthrough.dashboard.yeartask',
    defaultMessage: '年任务单',
  },
})

@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      registerVisible: false,
      confirmLoading: false,
      loginConfirmLoading: false,
      redirect: _util.getParam('redirect') || '',
      formData: {},
      loading: false,
      spinLoading: true,
      options: [],
      account: null,
      agreeVisible: false,
      currentIndex: 1,
      password: null,
      pwdView: true,
      personInfo: false,
      contractorInfo: false,
      location_list: [],
      data: [],
      isopen: false,
      //time: null,
      time: moment(new Date()),
    }
  }

  componentDidMount() {
    //console.log(moment(new Date()))
    //厂区通道
    // visitInfo().then((res) => {
    //   if (res && res.data) {
    //     const {factory_and_location} = res.data && res.data.results
    //     if (Array.isArray(factory_and_location) && factory_and_location.length > 0) {
    //       this.setState({
    //         location_list: factory_and_location
    //       })
    //     }
    //   }
    // })

    areaInfo({project_id: _util.getStorage('project_id'), mode: 'tree'}).then((res) => {
      let targetArr = []
      const getValue = (obj) => {
        const tempObj = {};
        tempObj.title = obj.name;
        tempObj.value = obj.id;
        tempObj.key = obj.id;
        if (obj.children) {
          tempObj.children = [];
          obj.children.map(o => {
            tempObj.children.push(getValue(o))
          });
        }
        return tempObj;
      };
      res.data.forEach(a => {
        targetArr.push(getValue(a));
      });
      console.log(targetArr)
      
      this.setState({
        treeData: targetArr
      });
    });

    FacilityDataInfo({project_id: _util.getStorage('project_id')}).then((res) => {
      this.setState({
        info: res.data
      })
    })

    let values = {
      factory_id: null,
      year: moment().get('year'),
      project_id: _util.getStorage('project_id')
    }

    this.getInfo(values)

    this.setState({
      spinLoading: false
    })
  }

  getInfo = (values) =>{
    this.setState({loading: true})
    FacilityTaskChart(values).then((res) => {
      let temp = res.data.data
      let data = []
      data[0] = Array.isArray(temp) && temp.map(d => {
          return d.yes
        })
      data[1] = Array.isArray(temp) && temp.map(d => {
          return d.fault
        })
      data[2] = Array.isArray(temp) && temp.map(d => {
          return d.fault_success
        })
      //console.log(data)
      this.setState({data, loading: false})
    })

    FacilityRatioLineChart(values).then((res) => {
      let arr = []
      let temp = Object.values(res.data)
      //console.log(typeof res.data.results)
      //console.log(temp)
      arr[0] = temp[0].map(d => {
        if (d === 'NA') {
          d = 0
        }
        return Math.round(d * 10000) / 100
      })
      arr[1] = temp[1].map(c => {
        if (c === 'NA') {
          c = 0
        }
        return Math.round(c * 10000) / 100
      })
      console.log(arr)
      this.setState({linedata: arr})
    })
  }

  getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          {type: 'warning', content: 'task1.'},
          {type: 'success', content: 'task2'},
        ];
        break;
      case 10:
        listData = [
          {type: 'warning', content: 'task3'},
          {type: 'success', content: 'task4'},
          {type: 'error', content: 'task5'},
        ];
        break;
      case 15:
        listData = [
          {type: 'warning', content: 'task6'},
          {type: 'success', content: 'task7'},
          {type: 'error', content: 'task8'},
          {type: 'error', content: 'task9'},
          {type: 'error', content: 'task10'},
          {type: 'error', content: 'task11'},
        ];
        break;
      default:
    }
    return listData || [];
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content}/>
          </li>
        ))}
      </ul>
    );
  }

  getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  }

  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  onDateChange = (value, dateString) => {

    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);

    this.setState({
      start_time: dateString[0],
      end_time: dateString[1]
    })

  }
  onLocationChange = (value) => {
    console.log(value)

    const values = {}
    values.factory_id = value
    values.year = moment(this.state.time).get('year')
    values.project_id = _util.getStorage('project_id')
    // values.package_id = this.state.package_id ? this.state.package_id : null
    // values.page_size = this.state.pagination.pageSize

    this.getInfo(values)

    this.setState({
      factory_id: value,
    })
  }

  handleYearChange = value => {
    console.log(value,moment(value).get('year'))

    const values = {}
    values.factory_id = this.state.factory_id
    values.year = moment(value).get('year')
    // values.package_id = this.state.package_id ? this.state.package_id : null
    // values.page_size = this.state.pagination.pageSize

    this.getInfo(values)

    this.setState({
      time: value,
      isopen: false
    })
  }

  render() {

    const {
      registerVisible, confirmLoading, loginConfirmLoading, spinLoading, site, account,
      password, isopen, time, info
    } = this.state
    const {formatMessage} = this.props.intl
    const options = this.state.options ? this.state.options.map(d =>
      <Option key={d.id}>{d.name}</Option>) : [];

    const extra = (
      <div className="btn-group" style={{margin: '0 auto'}}>
        <Select
          allowClear
          showSearch
          onChange={value => this.onLocationChange(value)}
          placeholder={formatMessage(messages.location)}      //厂区
          value={this.state.factory_id}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          style={{
            width: 150,
            marginRight: 10
          }}
        >
          {
            this.state.location_list.map((d, index) => {

              return (
                <Option
                  key={index}
                  value={d.id}>
                  {d.number + '-' + d.name}
                </Option>
              )
            })
          }
        </Select>

        <DatePicker
          mode="year"
          value={time}
          open={isopen}
          format="YYYY"
          placeholder={formatMessage(messages.currentyear)}    //年份
          allowClear
          onOpenChange={(status) => {
            if (status) {
              this.setState({isopen: true})
            } else {
              this.setState({isopen: false})
            }
          }}
          onPanelChange={value => this.handleYearChange(value)}
          onChange={() => {
            this.setState({time: null})
          }}
          //renderExtraFooter={() => 'extra footer'}
        />

      </div>
    )

    return (

      <div style={{
        maxHeight: 'calc( 100vh - 104px )',
        overflowY: 'scroll',
        overflowX: 'hidden'
      }}>
        <Content style={{padding: '16px 16px 0'}}>

          <Row style={{position: 'relative', marginBottom: '16px'}}>
            <Card title={<FormattedMessage id="page.walkthrough.dashboard.overview" defaultMessage="当年任务总览" />} size="small" bordered={false}>
              <Col md={6} sm={12} xs={24}>
                <NumberInfo
                  subTitle={formatMessage(messages.normal)}   //正常
                  suffix=""
                  total={numeral(info && info.total_yes_no).format('0,0')}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <NumberInfo
                  subTitle={formatMessage(messages.exception)}    //异常
                  total={numeral(info && info.total_fault_no).format('0,0')}/>
              </Col>
              <Col md={6} sm={12} xs={24}>
                <NumberInfo
                  subTitle={formatMessage(messages.complete)}     //完成率
                  total={numeral(info && info.total_complete_rate).format('0%')}/>
              </Col>
              <Col md={6} sm={12} xs={24}>
                <NumberInfo
                  subTitle={formatMessage(messages.yeartask)}    //年任务单
                  suffix=""
                  total={numeral(info && info.total_task).format('0,0')}
                />
              </Col>
            </Card>
          </Row>
          {/*<div className={styles.mapChart}>*/}
          {/*<Tooltip title="等待后期实现">*/}
          {/*<img*/}
          {/*src="https://gw.alipayobjects.com/zos/rmsportal/HBWnDEUXCnGnGrRfrpKa.png"*/}
          {/*alt="map"*/}
          {/*/>*/}
          {/*</Tooltip>*/}
          {/*</div>*/}


          <Card title={<FormattedMessage id="page.walkthrough.dashboard.overview" defaultMessage="当年任务总览" />} size="small" loading={this.state.loading} bordered={false} bodyStyle={{padding: 0}}
                extra={extra}>
            {/*<div className="btn-group">*/}
              {/*<Select*/}
                {/*allowClear*/}
                {/*showSearch*/}
                {/*onChange={value => this.onLocationChange(value)}*/}
                {/*//placeholder={formatMessage(messages.location)}      //厂区*/}
                {/*placeholder="厂区"      //厂区*/}
                {/*value={this.state.factory_id}*/}
                {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                {/*style={{*/}
                  {/*width: 150,*/}
                  {/*marginRight: 10*/}
                {/*}}*/}
              {/*>*/}
                {/*{*/}
                  {/*this.state.location_list.map((d, index) => {*/}

                    {/*return (*/}
                      {/*<Option*/}
                        {/*key={index}*/}
                        {/*value={d.id}>*/}
                        {/*{d.number + '-' + d.name}*/}
                      {/*</Option>*/}
                    {/*)*/}
                  {/*})*/}
                {/*}*/}
              {/*</Select>*/}

              {/*<DatePicker*/}
                {/*mode="year"*/}
                {/*value={time}*/}
                {/*open={isopen}*/}
                {/*format="YYYY"*/}
                {/*placeholder="年份"*/}
                {/*allowClear*/}
                {/*onOpenChange={(status) => {*/}
                  {/*if (status) {*/}
                    {/*this.setState({isopen: true})*/}
                  {/*} else {*/}
                    {/*this.setState({isopen: false})*/}
                  {/*}*/}
                {/*}}*/}
                {/*onPanelChange={value => this.handleYearChange(value)}*/}
                {/*onChange={() => {*/}
                  {/*this.setState({time: null})*/}
                {/*}}*/}
                {/*//renderExtraFooter={() => 'extra footer'}*/}
              {/*/>*/}
            {/*</div>*/}

            <BarEcharts data={this.state.data}/>
            {/*<Row gutter={8}>*/}
            {/*<Col span={12}></Col>*/}
            {/*<Col span={12}></Col>*/}
            {/*</Row>*/}

            <LineEcharts data={this.state.linedata}/>
          </Card>
        </Content>

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

    )
  }
}

