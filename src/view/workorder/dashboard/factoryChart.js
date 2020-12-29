import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import MyBreadcrumb from '@component/bread-crumb'
// import {Form, Button, Modal, Spin, message, Row, Col, Icon, Select, Tabs, Calendar, Card,} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
//下面是按需加载
import echarts from 'echarts/lib/echarts'
//导入折线图
// import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
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

  getStatusName=(val)=>{
        let name='';
        console.log(val);
        switch (parseInt(val)) {
            case 1:name='派发中';
            break;
            case 2:name='执行中';
            break;
            case 10:name='暂停中';
            break;
            case 3:name='已完成';
            break;
            case 5:name='已关闭';
            break;
            case 9:name='已取消';
            break;
            // case 12:name='已退回';
            // break;
        }
        return name;
  };

  getOption = (data) => {
    console.log(data);

    let info=[];
    for(var key in data){
        if(data[key]){
            info.push({name:this.getStatusName(key),value:data[key]})
        }
    }
    console.log(info);

    const {formatMessage} = this.props.intl
    let option = {
    // title : {
    //   text: '某站点用户访问来源',
    //   subtext: '纯属虚构',
    //   x:'center'
    // },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        left: 'left',
        data: info?info.map(a=>a.name):[]
        //data: data?data.map(a=>a.name):[]
    },
    // grid:{
    //   top:'top',
    //   bottom:10
    // },
    color:['#2db7f5','#108ee9',"#f50",'#87d068','#CCCCCC','#F0AF13'],
    //     color:['#2db7f5','#F0AF13','#87d068',"#f50"],
        series : [
            {
                name:'状态',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:info,
                //data:data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
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
          <ReactEcharts option={this.getOption(data)} theme="Imooc" style={{height:'200px'}}/>
        {/*</Card>*/}
      </div>
    )
  }
}
