import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import MyBreadcrumb from '@component/bread-crumb'
import {
  Layout, Form, Button, Modal, Spin, message, Row, Col, Input as AntInput, Icon, Select, Checkbox,
  Upload, Tabs, Radio, Calendar, Badge, Card, DatePicker,Rate
} from 'antd'
import numeral from 'numeral';
import NumberInfo from '@component/NumberInfo';
import moment from 'moment'
import TypeEcharts from './typeChart.js'
import BarEcharts from './chart.js'
import FactoryEcharts from './factoryChart.js'
import RankEcharts from './rankChart.js'
import {observer, inject} from 'mobx-react'
import CommonUtil from '@utils/common'
import {FacilityDataInfo, FacilityTaskChart, FacilityRatioLineChart} from '@apis/facility/dashboard'
import {visitInfo} from '@apis/system/location/'
import {postOrderChart,postOrderChartNew} from '@apis/workorder/'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
// import messages from '@utils/formatMsg'
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
      dailynums_30days:undefined,
      dailynums_30days_title:undefined,
      thisyear_cate_factory:undefined,
      thisyear_factorynums:undefined,
      thisyear_scores:undefined,
      factoryId:undefined,
      start_day:undefined,
      end_day:undefined,
      factory_id:undefined,
      start_time:undefined,
      end_time:undefined,
    }
  }

  componentDidMount() {
    //厂区通道
    // visitInfo().then((res) => {
    //   if (res && res.data) {
    //     const {factory_and_location} = res.data && res.data.results
    //     if (Array.isArray(factory_and_location) && factory_and_location.length > 0) {
    //         this.setState({
    //             location_list: factory_and_location,
    //             factory_id:factory_and_location[0].id,
    //             start_day:moment().day(-29).format('YYYY-MM-DD'),
    //             end_day:moment().format('YYYY-MM-DD'),
    //         });
    //         return factory_and_location
    //     }
    //   }
    // }).then((res2)=>{
    //     if(res2){
    //          this.handleSearch()
    //     }
    // });

    let values = {
      factory_id: null,
      year: moment().get('year')
    };

    // this.getInfo(values);

    this.setState({
      spinLoading: false
    })

    // postOrderChartNew().then((res) => {
    //   if(res){
    //     this.setState({...res.data.results})
    //   }
    // });
  }

  getInfo = (params) =>{
    this.setState({loading: true});

    postOrderChartNew(params).then((res) => {
          console.log(res);
          if(res){
            this.setState({...res.data.results})
          }
    });
  };

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

  onChange = (value) => {
          if(value.length===0){
              let _this=this;
              let p=new Promise(function (resolve, reject) {
                  _this.setState({start_day:'',end_day:''});
                  resolve('ok')
              });
              p.then((date)=>{
                console.log(1)
                  _this.handleSelectDate()
              });

          }else{
              this.setState({
                  start_day: moment(value[0]).format('YYYY-MM-DD'),
                  end_day: moment(value[1]).format('YYYY-MM-DD'),
                })
          }
  };

  handleSelectDate = () => {
        const values = {};
        values.factoryid = this.state.factory_id;
        values.startdate=this.state.start_day;
        values.enddate=this.state.end_day;

        // this.getInfo(values);
  };

   handleSelectCostcenter = value => {
        const values = {}
        values.startdate=this.state.start_day;
        values.enddate=this.state.end_day;

        if (value) {
            values.factoryid = value
        }

        // this.getInfo(values);

        this.setState({
            factory_id: value
        })
    };

   handleSearch = () => {
        const values = {};
        values.startdate=this.state.start_day;
        values.enddate=this.state.end_day;
        values.factoryid = this.state.factory_id;
        this.getInfo(values);
        this.setState({start_time:values.startdate,end_time:values.enddate})
   };

   handleChangeTab=(value)=>{
     console.log(value)
   };

  render() {
    const {
      registerVisible, confirmLoading, loginConfirmLoading, spinLoading, site, account,
      password, isopen, time, info,location_list,dailyfinish_rate,dailynums,rating_done,rating_exe,scores,status,
      thisyear_scores,factoryOptions,
    } = this.state;

    const {formatMessage} = this.props.intl
    const options = this.state.options ? this.state.options.map(d =>
      <Option key={d.id}>{d.name}</Option>) : [];

    return (
      <div style={{
        maxHeight: 'calc( 100vh - 104px )',
        overflowY: 'scroll',
        overflowX: 'hidden'
      }}>
        <Content style={{padding: '16px 16px 0'}}>
          <Row style={{marginBottom:'16px',textAlign:'right'}}>
            <RangePicker
                  style={{marginRight: 8,width:'350px'}}
                  onChange={(value)=>this.onChange(value)}
                  // onOk={() => this.handleSelectDate()}
                  // showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD"
                  value={this.state.start_day?[moment(this.state.start_day,'YYYY-MM-DD'),moment(this.state.end_day,'YYYY-MM-DD')]:[]}
                  //defaultValue={[moment(moment().subtract(7,'days'),'YYYY-MM-DD'),moment(moment(),'YYYY-MM-DD')]}
                  placeholder={['开始日期','结束日期']}
                />

                <Select
                  allowClear
                  showSearch
                  onChange={value => this.handleSelectCostcenter(value)}
                  placeholder={'厂区'}
                  value={this.state.factory_id}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  style={{width: 100, marginRight: 8}}
              >
                  {location_list.map((card, cardIndex) => {
                          return (<Option key={cardIndex} value={card.id}>{card.number}</Option>)
                      })
                  }
                </Select>

                <Button type="primary" onClick={()=>this.handleSearch()}>查询</Button>
          </Row>

          <Row style={{position: 'relative', marginBottom: '16px'}} gutter={16}>
              <Col className="gutter-row" span={6}>
                <Card title={"任务评价统计表"}>
                 <Row style={{position: 'relative'}}>
                   <Col span={18} style={{textAlign:'center'}}><Rate defaultValue={5} /></Col>
                   <Col span={6} style={{lineHeight:'35px'}}>{scores&&scores[5]}</Col>
                 </Row>
                  <Row style={{position: 'relative'}}>
                   <Col span={18} style={{textAlign:'center'}}><Rate defaultValue={4} /></Col>
                   <Col span={6} style={{lineHeight:'35px'}}>{scores&&scores[4]}</Col>
                 </Row>
                  <Row style={{position: 'relative'}}>
                   <Col span={18} style={{textAlign:'center'}}><Rate defaultValue={3} /></Col>
                   <Col span={6} style={{lineHeight:'35px'}}>{scores&&scores[3]}</Col>
                 </Row>
                  <Row style={{position: 'relative'}}>
                   <Col span={18} style={{textAlign:'center'}}><Rate defaultValue={2} /></Col>
                   <Col span={6} style={{lineHeight:'35px'}}>{scores&&scores[2]}</Col>
                 </Row>
                  <Row style={{position: 'relative'}}>
                   <Col span={18} style={{textAlign:'center'}}><Rate defaultValue={1} /></Col>
                   <Col span={6} style={{lineHeight:'35px'}}>{scores&&scores[1]}</Col>
                 </Row>
                </Card>

                  <Card title={'任务状态统计表'}>
                     <FactoryEcharts data={this.state.status}/>
                  </Card>
              </Col>

              <Col className="gutter-row" span={12}>
                  <Card title={'任务总数及完成情况日统计表'}>
                     <BarEcharts data={this.state.dailynums} num={this.state.dailyfinish_rate} time={[this.state.start_time,this.state.end_time]}/>
                  </Card>
              </Col>

              <Col className="gutter-row" span={6}>
                  <Card title={'接单数及完成数top10排行榜'}>
                     <Tabs defaultActiveKey="1" onChange={this.handleChangeTab} style={{marginTop:'-12px'}}>
                      <TabPane tab="接单数" key="1">
                        <RankEcharts data={this.state.rating_exe}/>
                      </TabPane>
                      <TabPane tab="完成数" key="2">
                        <RankEcharts data={this.state.rating_done}/>
                      </TabPane>
                    </Tabs>
                  </Card>
              </Col>
          </Row>

          <Row style={{position: 'relative', marginBottom: '16px'}}>
            <Card title={<FormattedMessage id="page.order.chart.name5" defaultMessage='任务类型统计表'/>}>
              {/*<TypeEcharts data={this.state.catefinish}/>*/}
              <TypeEcharts data={this.state.cata_total}/>
            </Card>
          </Row>
        </Content>

      </div>

    )
  }
}

