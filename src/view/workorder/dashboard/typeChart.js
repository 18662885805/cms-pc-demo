import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import MyBreadcrumb from '@component/bread-crumb'
// import {Form, Button, Modal, Spin, message, Row, Col, Icon, Select, Tabs, Calendar, Card,} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
//下面是按需加载
import echarts from 'echarts/lib/echarts'
//导入折线图
//import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import {observer, inject} from 'mobx-react'
import moment from 'moment'
import CommonUtil from '@utils/common'
import inputDecorate from '@component/input-decorate'
let _util = new CommonUtil();

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
    const {formatMessage} = this.props.intl;

    console.log(data);
    let factory_arr=[];
    let series_arr=[];
    let xAxis_arr=[];
    if(data&&data.length>0){
        data.map(function (val,i) {
            if(factory_arr.indexOf(val.factory)===-1){
                factory_arr.push(val.factory)
            }
        });
    }

    if(factory_arr&&factory_arr.length>0){
        data.map(function (val,i) {
            series_arr.push({
                name: val.name,
                type: 'bar',
                xAxisIndex:factory_arr.indexOf(val.factory),
                barGap: 0,
                label: labelOption,
                data: [[val.factory, val.value]]
            })
        });

          factory_arr.map(function (val,i) {
                xAxis_arr.push({
                    type: 'category',
                    axisTick: {show: false},
                    data:factory_arr,
                    show:i===0,
                })
            });
    }

    var posList = [
        'left', 'right', 'top', 'bottom',
        'inside',
        'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
        'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
    ];

    let app={};

    app.configParameters = {
    rotate: {
        min: -90,
        max: 90
    },
    align: {
        options: {
            left: 'left',
            center: 'center',
            right: 'right'
        }
    },
    verticalAlign: {
        options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
        }
    },
    position: {
        options: echarts.util.reduce(posList, function (map, pos) {
            map[pos] = pos;
            return map;
        }, {})
    },
    distance: {
        min: 0,
        max: 100
    }
};

    app.config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,
    onChange: function () {
        var labelOption = {
            normal: {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
            }
        };
        myChart.setOption({
            series: [{
                label: labelOption
            }, {
                label: labelOption
            }, {
                label: labelOption
            }, {
                label: labelOption
            }]
        });
    }
};

    var labelOption = {
    normal: {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter:function(params,ticket,callback){
          return params.data[1]+' '+params.seriesName
        },
        //formatter: `{c} {name|{a}}`,
        fontSize: 16,
        rich: {
            name: {
                textBorderColor: '#fff'
            }
        }
    }
};

    // let option = {
    // color: ['#2db7f5','#B482B7', '#F0AF13', '#96BA02', '#F1544B','#42A3CE','#F28329',"#00AD78"],
    //     //color:['#1890FF','#2FC25B','#FACC14','#223273','#8543E0','#13C2C2','#13C2C2'],
    // tooltip: {
    //            // show:false,
    //     trigger: 'axis',
    //     axisPointer: {
    //         type: 'shadow'
    //     },
    //     formatter:function (params) {
    //         let list=[];
    //         params.map(function (val,i) {
    //             if(val.axisIndex===params[0].axisIndex){
    //                 list.push(
    //                    `<i style="display:inline-block;width: 10px;height: 10px;background:${val.color};margin-right: 5px;border-radius: 50%;}"></i>` +
    //                    '<span style="min-width:70px; display:inline-block;">'+
    //                      val.seriesName +' '+
    //                      val.data[1]+
    //                    '</span>'
    //                  )
    //             }
    //         });
    //         let listItem = list.join('<br>');
    //         return `<div><span>${params[0].name}</span><br>` + listItem + '</div>'
    //     }
    // },
    // // legend: {
    // //     data: ['Forest', 'Steppe', 'Desert', 'Wetland'],
    // //     show:false,
    // // },
    //     grid:{
    //         top:10,
    //         bottom:30
    //     },
    // // toolbox: {
    // //     show: true,
    // //     orient: 'vertical',
    // //     left: 'right',
    // //     top: 'center',
    // //     feature: {
    // //         mark: {show: true},
    // //         dataView: {show: true, readOnly: false},
    // //         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
    // //         restore: {show: true},
    // //         saveAsImage: {show: true}
    // //     }
    // // },
    // calculable: true,
    // xAxis:xAxis_arr.length>0?xAxis_arr:[{
    //         type: 'category',
    //         axisTick: {show: false},
    //         data:factory_arr
    //     }],
    //
    // // xAxis: [
    // //     {
    // //         type: 'category',
    // //         axisTick: {show: false},
    // //         data:factory_arr
    // //         // data:['101','201','304','3015']
    // //     },
    // //     {
    // //         type: 'category',
    // //         axisTick: {show: false},
    // //         show:false,
    // //         data:factory_arr
    // //     },
    // //     {
    // //         type: 'category',
    // //         axisTick: {show: false},
    // //         show:false,
    // //         data:factory_arr
    // //     },
    // //     {
    // //         type: 'category',
    // //         axisTick: {show: false},
    // //         show:false,
    // //         data:factory_arr
    // //     }
    // // ],
    //
    // yAxis: [
    //     {
    //         type: 'value'
    //     }
    // ],
    //     series:series_arr,
    // // series: [
    // //     {
    // //         name: 'Forest1',
    // //         type: 'bar',
    // //         xAxisIndex: 0,
    // //         barGap: 0,
    // //         label: labelOption,
    // //         data:[[0,130]],
    // //         // data: [320, 332, 301, 334, 390]
    // //     },
    // //     {
    // //         name: 'Forest2',
    // //         type: 'bar',
    // //         xAxisIndex: 0,
    // //         barGap: 0,
    // //         label: labelOption,
    // //         data:[[0,400]]
    // //         // data: [320, 332, 301, 334, 390]
    // //     },
    // //     {
    // //         name: 'Forest3',
    // //         type: 'bar',
    // //         xAxisIndex: 0,
    // //         barGap: 0,
    // //         label: labelOption,
    // //         data:[[0,200]]
    // //         // data: [320, 332, 301, 334, 390]
    // //     },
    // //     {
    // //         name: 'Middle1',
    // //         type: 'bar',
    // //         xAxisIndex: 1,
    // //         barGap:0,
    // //         label: labelOption,
    // //         data:[[1,120]]
    // //         // data: [320, 332, 301, 334, 390]
    // //     },
    // //     {
    // //         name: 'Middle',
    // //         type: 'bar',
    // //         xAxisIndex: 1,
    // //         barGap: 0,
    // //         label: labelOption,
    // //         data:[[1,320]]
    // //         // data: [320, 332, 301, 334, 390]
    // //     },
    // //     {
    // //         name: 'Info1',
    // //         type: 'bar',
    // //         xAxisIndex: 2,
    // //         barGap: 0,
    // //         label: labelOption,
    // //         data:[[2,320]]
    // //         // data: [320, 332, 301, 334, 390]
    // //     },
    // //     // {
    // //     //     name: 'Quick1',
    // //     //     type: 'bar',
    // //     //     xAxisIndex: 2,
    // //     //     barGap: 0,
    // //     //     label: labelOption,
    // //     //     data:[[2,320]]
    // //     //     // data: [320, 332, 301, 334, 390]
    // //     // },
    // //     {
    // //         name: 'Quick2',
    // //         type: 'bar',
    // //         xAxisIndex: 3,
    // //         barGap: 0,
    // //         label: labelOption,
    // //         data:[[3,420]]
    // //         // data: [320, 332, 301, 334, 390]
    // //     },
    // //     {
    // //         name: 'Quick3',
    // //         type: 'bar',
    // //         xAxisIndex: 3,
    // //         barGap: 0,
    // //         label: labelOption,
    // //         data:[[3,120]]
    // //         // data: [320, 332, 301, 334, 390]
    // //     },
    // //     // {
    // //     //     name: 'Steppe',
    // //     //     type: 'bar',
    // //     //     label: labelOption,
    // //     //     data: [220, 182, 191, 234, 290]
    // //     // },
    // //     // {
    // //     //     name: 'Desert',
    // //     //     type: 'bar',
    // //     //     label: labelOption,
    // //     //     data: [150, 232, 201, 154, 190]
    // //     // },
    // //     // {
    // //     //     name: 'Wetland',
    // //     //     type: 'bar',
    // //     //     label: labelOption,
    // //     //     data: [98, 77, 101, 99, 40]
    // //     // },
    // // ]
    // };

    let option = {
        tooltip: {
            trigger: 'axis',
            // axisPointer: {
            //     type: 'cross',
            //     crossStyle: {
            //         color: '#999'
            //     }
            // }
        },
        // toolbox: {
        //     feature: {
        //         dataView: {show: true, readOnly: false},
        //         magicType: {show: true, type: ['line', 'bar']},
        //         restore: {show: true},
        //         saveAsImage: {show: true}
        //     }
        // },
        legend: {data: ['总数','完成率']},

        color:['#45b97c','#f58220'],

        // grid:{
        //     top:40,
        //     bottom:20
        // },

        xAxis: [
            {
                type: 'category',
                data:data&&data.map(a=>a.name),
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '总数',
                // min: 0,
                // max: 250,
                // interval: 2,
                // axisLabel: {formatter: '{value} ml'}
            },
            {
                type: 'value',
                name: '完成率',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {formatter: '{value} %'}
            }
        ],
        series: [
            {
                name: '总数',
                type: 'bar',
                data:data&&data.map(a=>a.value)
            },
            // {
            //     name: '降水量',
            //     type: 'bar',
            //     data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            // },
            {
                name: '完成率',
                type: 'line',
                yAxisIndex: 1,
                data:data&&data.map(a=>(a.finish_rate*100).toFixed(2))
            }
        ]
    };

    return option
  };

  render() {
    const { data } = this.props;

    return (
      <div>
          <ReactEcharts option={this.getOption(data)} theme="Imooc" style={{height: '300px'}}/>
      </div>
    )
  }
}
