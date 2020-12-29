import React, {Component} from "react";
import ReactEcharts from "echarts-for-react";

class LineMarkerEcharts extends Component {
    propTypes= {
    };

    getOtion() {
      const option = {
        // title: {
        //     text: '未来一周气温变化',
        // },

        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ["line", "bar"]},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data:["当前库存","最低库存","建议库存"]
        },
        xAxis: [
          {
            type: "category",
            data: ["8-1","8-2","8-3","8-4","8-5","8-6","8-7","8-8","8-9","8-10","8-11","8-12"],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            min: 0,
            max: 80,
            interval: 20
          }
        ],
        series: [
          {
            name:"当前库存",
            type:"bar",
            data:[10, 22, 27,21,25, 46.7, 35.6, 62.2, 32.6, 30.0, 32.4, 33]
          },
          {
            name:"最低库存",
            type:"line",
            data:[12, 12,12,12,12,12,12,12,12,12, 12,12]
          },
          {
            name:"建议库存",
            type:"line",
            data:[22.0, 22.2, 23.3, 24.5, 26.3, 40.2, 30.3, 43.4, 33.0, 26.5, 32.0, 26.2]
          }
        ]
      };
      return option;
    }

    render() {
      let code = "<ReactEcharts " +
            "    option={this.getOtion()} " +
            "    style={{height: '500px', width: '800px'}}  " +
            "    className='react_for_echarts' />";
      return (
        <ReactEcharts
          option={this.getOtion()}
          style={{height: "350px", width: "1000px"}}
          className='react_for_echarts' />
      );
    }
}

export default LineMarkerEcharts;
