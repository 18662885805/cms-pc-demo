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
import moment from 'moment'
import CommonUtil from '@utils/common'
import inputDecorate from '@component/input-decorate'
let _util = new CommonUtil()

const messages = defineMessages({
  complete: {
    id: 'page.walkthrough.dashboard.complete',
    defaultMessage: '完成率',
  },
  exrate: {
    id: 'page.walkthrough.dashboard.exrate',
    defaultMessage: '异常率',
  },
  percentage: {
    id: 'page.walkthrough.dashboard.percentage',
    defaultMessage: '百分比',
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
      backgroundColor: '',//背景颜色透明
      //color: ['#2f4554', '#d6a6b1', '#0e88fe'],
      "tooltip": {
        "show": true,
        "trigger": "axis",  //鼠标经过提示
        "enterable": true,
        //formatter: '{a0}: {c0} %<br />{a1}: {c1} %'
      },
      "title": {
        "show": false,
        x: 'center',
        y: 0,
        "text": formatMessage(messages.complete),   //完成率
        "subtext": "",
        textStyle: {
          //文字颜色
          //color: '#000',
          fontFamily: 'sans-serif',
          //字体大小
          fontSize: 18
        }
      },
      "legend": {
        "show": true,
        "textStyle": {
          "align": "center"
        },
        "orient": "horizontal",
        "itemGap": 10,
        "data": [formatMessage(messages.complete), formatMessage(messages.exrate)],   //完成率/异常率
        "top": "top",
        "left": "center"
      },
      grid: {
        // left: '0%',
        // right: '10%',
        // bottom: '5%',
        // top: '10%',
        containLabel: false
      },
      // "dataZoom": [{
      //   "show": true
      // }],
      xAxis: [
        {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      "yAxis": [{
        "type": "value",
        axisLabel: {
          formatter: '{value} %'
        },
        "show": true,
        "axisLine": {
          "show": true
        },
        //"splitNumber": 5,
        "splitLine": {
          "show": true,
          "lineStyle": {
            //"color": ["#"],
            "width": 1,
            "type": "dotted"
          }
        },
        "max": 100,
        "name": formatMessage(messages.percentage),    //百分比
        nameTextStyle: {
          //fontSize: 16,
          fontStyle: 'normal',
        },
        "scale": true
      }],
      "series": [{
        "name": formatMessage(messages.complete),   //完成率
        "type": "line",
        //"yAxisIndex": 0,
        //"smooth": true,
        "showSymbol": false,
        //"symbol": "emptyCircle",
        "showAllSymbol": false,
        //"symbolSize": 4,
        "itemStyle": {
          "normal": {
            "barBorderRadius": [7, 7, 0, 0],
            lineStyle: {
              color: '#d6a6b1'  //#2f4554  //#61a0a8
            }

          },
          "emphasis": {
            "barBorderRadius": [7, 7, 0, 0]
          }
        },
        areaStyle: {
          normal: {
             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                     offset: 0, color: '#d6a6b1' // 0% 处的颜色
                 }, {
                     offset: 0.4, color: '#e4f2ff' // 100% 处的颜色
                 }, {
                     offset: 1, color: '#fff' // 100% 处的颜色
                 }]
             )
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: '{c} %'
          }
        },
        "data": Array.isArray(data) ? data[0] : []
      },
        {
          "name": formatMessage(messages.exrate),   //异常率
          "type": "line",
          //"yAxisIndex": 0,
          //"smooth": true,
          "showSymbol": false,
          //"symbol": "emptyCircle",
          "showAllSymbol": false,
          //"symbolSize": 4,
          "itemStyle": {
            "normal": {
              "barBorderRadius": [7, 7, 0, 0],
              lineStyle: {
                color: '#2f4554'  //#2f4554  //#61a0a8
              }
            },
            "emphasis": {
              "barBorderRadius": [7, 7, 0, 0]
            }
          },
          areaStyle: {
            normal: {
                   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                           offset: 0, color: '#2f4554' // 0% 处的颜色
                       }, {
                           offset: 0.4, color: '#e4f2ff' // 100% 处的颜色
                       }, {
                           offset: 1, color: '#fff' // 100% 处的颜色
                       }]
                   )
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c} %'
            }
        },
          "data": Array.isArray(data) ? data[1] : []
        }
      ],

    };

    return option
  }

  render() {
    const { data } = this.props;

    //const data = [[20, 18, 21, 23, 21, 20, 20, 22, 22, 20, 28, 20], [18, 16, 20, 21, 20, 19, 20, 21, 21, 17, 20, 17]]
    return (
      <div>
        {/*<Card title="完成率" size="small" bordered={false}>*/}
          <ReactEcharts option={this.getOption(data)} theme="Imooc" style={{height: '300px'}}/>
        {/*</Card>*/}

      </div>
    )
  }
}
