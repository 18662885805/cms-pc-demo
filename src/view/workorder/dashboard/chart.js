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
import rankChart from "./rankChart";
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
class chart extends React.Component {
  // constructor(props) {
  //
  // }

  componentDidMount() {
    //主题的设置要在willmounted中设置
    //echarts.registerTheme('Imooc', echartTheme);
  }

getAllDate = (start, end) => {
      console.log(start);
      console.log(end);
        const format = (time) => {
         let ymd = ''
         let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
         let day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
         ymd += time.getFullYear() + '-' // 获取年份。
         ymd += mouth + '-' // 获取月份。
         ymd += day // 获取日。
         return ymd // 返回日期。
        };

         let dateArr = []
         let startArr = start.split('-')
         let endArr = end.split('-')
         let db = new Date()
         db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2])
         let de = new Date()
         de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2])
         let unixDb = db.getTime()
         let unixDe = de.getTime()
         let stamp
         const oneDay = 24 * 60 * 60 * 1000;
         for (stamp = unixDb; stamp <= unixDe;) {
           dateArr.push(format(new Date(parseInt(stamp))))
           stamp = stamp + oneDay
         }

         console.log(dateArr);
         return dateArr
};

  getOption = (data,num,time) => {

      let data1=data&&data.map(a=>a['1']);
      let data2=data&&data.map(a=>a['2']);
      let data3=data&&data.map(a=>a['3']);
      let data5=data&&data.map(a=>a['5']);
      let data9=data&&data.map(a=>a['9']);
      let data10=data&&data.map(a=>a['10']);
      let data12=data&&data.map(a=>a['12']);
      let total=data&&data.map(a=>a['total']);

      let num_percent=num&&num.map(a=>(a*100).toFixed(2));
      console.log(num_percent);

      let chart_data=[];
      let chart_data1=[];
      let chart_data2=[];
      // if(num&&num.length>0){
      //     num[0].value.map(function (val,i) {
      //         chart_data1.push(num[1].value[i]+num[7].value[i]+num[8].value[i]);
      //         chart_data2.push(num[4].value[i]+num[5].value[i])
      //     });
      //     chart_data[0]=chart_data1;
      //     chart_data[1]=num[2].value;
      //     chart_data[2]=num[3].value;
      //     chart_data[3]=chart_data2;
      //     chart_data[4]=num[9].value;
      //     chart_data[5]=num[10].value;
      // }
      // console.log(chart_data);

    const {formatMessage} = this.props.intl;
    let option = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        //data:['派发中','执行中','已完成','已关闭','已取消','已暂停'],
        data:[
            formatMessage({ id:"page.order.myOrder.finished", defaultMessage:"已完成"}),
            formatMessage({ id:"page.order.myOrder.completed", defaultMessage:"已关闭"}),
            formatMessage({ id:"page.order.myOrder.sending", defaultMessage:"派发中"}),
            formatMessage({ id:"page.order.myOrder.conducting", defaultMessage:"执行中"}),
            formatMessage({ id:"page.order.myOrder.pause", defaultMessage:"暂停中"}),
            formatMessage({ id:"page.order.myOrder.cancelled", defaultMessage:"已取消"}),
            '完成率'
        ],
        // selected:{"全部":false}
        // show:false
    },
    color:['#45b97c','#1d953f',"#7bbfea",'#33a3dc','#228fbd','#F0AF13','#CA9561','#f58220'],
        //color:['#2db7f5','#108ee9',"#f50",'#87d068','#CCCCCC','#F0AF13','#CA9561'],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            data:time&&time[0]?this.getAllDate(time[0],time[1]):null
            //data:data,
            // data : ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']
        }
    ],
    yAxis : [
        {
            type : 'value',
            name:'总数',
            // min: 0,
            // max: 10,        // 计算最大值
            // interval: 2,   //  平均分为5份
        },
        {
            type: 'value',
            name: '完成率',
            min: 0,
            max: 100,        // 计算最大值
            interval: 20,   //  平均分为5份
            axisLabel: {
                formatter: '{value}%'
            }
            // min:0,
            // max:1,
            // interval:'0.1'
        }
    ],
    series : [
         {
            name:formatMessage({ id:"page.order.myOrder.finished", defaultMessage:"已完成"}),
            type:'bar',
            stack:'全部状态',
            data:data3
            //data:chart_data[2]
            //data:[150, 232, 201, 154, 190, 330, 410,230,100,120,110,123]
        },
        {
            name:formatMessage({ id:"page.order.myOrder.completed", defaultMessage:"已关闭"}),
            type:'bar',
            stack:'全部状态',
            data:data5
            //data:chart_data[3]
            //data:[862, 1018, 964, 1026, 1679, 1600, 1570,230,100,120,110,123],
        },
        {
            name:formatMessage({ id:"page.order.myOrder.sending", defaultMessage:"派发中"}),
            type:'bar',
            stack: '全部状态',
            data:data1,
            //data:chart_data[0]
            //data:[120, 132, 101, 134, 90, 230, 210,230,100,120,110,123]
        },
        {
            name:formatMessage({ id:"page.order.myOrder.conducting", defaultMessage:"执行中"}),
            type:'bar',
            stack:'全部状态',
            data:data2
            //data:chart_data[1]
            //data:[220, 182, 191, 234, 290, 330, 310,230,100,120,110,123]
        },
        {
            name:formatMessage({ id:"page.order.myOrder.pause", defaultMessage:"暂停中"}),
            type:'bar',
            stack:'全部状态',
            data:data10
            //data:chart_data[5]
            //data:[620, 732, 701, 734, 1090, 1130, 1120,230,100,120,110,123]
        },
        {
            name:formatMessage({ id:"page.order.myOrder.cancelled", defaultMessage:"已取消"}),
            type:'bar',
            stack:'全部状态',
            data:data9,
            //data:chart_data[4]
            //data:[620, 732, 701, 734, 1090, 1130, 1120,230,100,120,110,123]
        },
        {
            name:'全部',
            type:'bar',
            // stack:'全部状态',
            data:total,
            itemStyle: {opacity:0},
            barGap:'-100%',
        },
        {
            name:'完成率',
            type:'line',
            // stack:'全部状态',
            yAxisIndex: 1,
            data:num_percent,
            //data:num,
            //data:chart_data[4]
            //data:[620, 732, 701, 734, 1090, 1130, 1120,230,100,120,110,123]
        },
    ]
};
    return option
  };

  render() {
    const { data,num,time } = this.props;
    // const data = [[200, 189, 212, 232, 216, 203, 206, 229, 226, 200, 218, 209], [180, 169, 201, 212, 200, 169, 200, 201, 218, 175, 201, 172], [150, 160, 181, 192, 180, 129, 190, 191, 100, 160, 181, 162]]
    return (
      <div>
        {/*<Card title="任务单" size="small" bordered={false}>*/}
          <ReactEcharts option={this.getOption(data,num,time)} theme="Imooc" style={{height: '480px'}}/>
        {/*</Card>*/}
      </div>
    )
  }
}

export default chart;