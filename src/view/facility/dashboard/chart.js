import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import MyBreadcrumb from '@component/bread-crumb'
// import {Form, Button, Modal, Spin, message, Row, Col, Icon, Select, Tabs, Calendar, Card,} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
//下面是按需加载
import echarts from 'echarts/lib/echarts'
//导入折线图
import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import {observer, inject} from 'mobx-react'
import CommonUtil from '@utils/common'
import inputDecorate from '@component/input-decorate'
let _util = new CommonUtil()

const messages = defineMessages({
  normal: {
    id: 'page.walkthrough.dashboard.normal',
    defaultMessage: '正常',
  },
  exception: {
    id: 'page.walkthrough.dashboard.exception',
    defaultMessage: '异常',
  },
  solved: {
    id: 'page.walkthrough.dashboard.solved',
    defaultMessage: '异常已处理',
  },
  amount: {
    id: 'page.walkthrough.dashboard.amount',
    defaultMessage: '单量',
  },
})

@injectIntl
export default class extends React.Component {
  componentDidMount() {
    //主题的设置要在willmounted中设置
    //echarts.registerTheme('Imooc', echartTheme);
  }

  getOption = (data) => {
    const {formatMessage} = this.props.intl
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      // toolbox: {
      //   feature: {
      //     dataView: {show: true, readOnly: false},
      //     magicType: {show: true, type: ['line', 'bar']},
      //     restore: {show: true},
      //     saveAsImage: {show: true}
      //   }
      // },
      legend: {
        top: '20',
        data: [formatMessage(messages.normal), formatMessage(messages.exception), formatMessage(messages.solved)]
      },
      grid: {
        // left: '0%',
        // right: '10%',
        // bottom: '5%',
        // top: '10%',
        containLabel: false
      },
      xAxis: [
        {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: formatMessage(messages.amount),    //单量
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value}'
          }
        },
        // {
        //   type: 'value',
        //   name: '完成率',
        //   min: 0,
        //   max: 100,
        //   interval: 10,
        //   axisLabel: {
        //     formatter: '{value} %'
        //   }
        // }
      ],
      series: [
        {
          name: formatMessage(messages.normal),   //正常
          type: 'bar',
          // data: [200, 189, 212, 232, 216, 203, 206, 229, 226, 200, 218, 209]
          data: data[0]
        },
        {
          name: formatMessage(messages.exception),    //异常
          type: 'bar',
          //data: [180, 169, 201, 212, 200, 169, 200, 201, 218, 175, 201, 172]
          data: data[1]
        },
        {
          name: formatMessage(messages.solved),    //异常已处理
          type: 'bar',
          //data: [180, 169, 201, 212, 200, 169, 200, 201, 218, 175, 201, 172]
          data: data[2]
        },
        // {
        //   name: '完成率',
        //   type: 'line',
        //   yAxisIndex: 1,
        //   data: [20, 22, 33, 45, 63, 52, 20, 23, 23, 16, 12, 62]
        // }
      ]
    };
    return option
  }

  render() {
    const { data } = this.props;
    // const data = [[200, 189, 212, 232, 216, 203, 206, 229, 226, 200, 218, 209], [180, 169, 201, 212, 200, 169, 200, 201, 218, 175, 201, 172], [150, 160, 181, 192, 180, 129, 190, 191, 100, 160, 181, 162]]
    return (
      <div>
        {/*<Card title="任务单" size="small" bordered={false}>*/}
          <ReactEcharts option={this.getOption(data)} theme="Imooc" style={{height: '300px'}}/>
        {/*</Card>*/}

      </div>
    )
  }
}
