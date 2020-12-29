import React, { Component } from "react";
import {
  Card
} from "antd";

class rankChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  compare =(prop)=>{
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }
    }
}

  render () {
    const { data } = this.props;
    let data_new;

    if(data&&data.length){
      data_new=data.sort(this.compare("value"));
      console.log(data_new);

    }

    return (
       data_new?data_new.map((item,index)=>{
           if(index<10){
               return (<div key={index} style={{minHeight:"32px"}}>
                <span style={{display:'inline-block',width:"40px"}}>
                  {index===0?<img alt='no.1' src={require('./no1.png')} style={{width:'32px'}}/>:
                      index===1?<img alt='no.2' src={require('./no2.png')} style={{width:'32px'}}/>:
                          index===2?<img alt='no.3' src={require('./no3.png')} style={{width:'32px'}}/>:
                      null}
                </span>
                <span>{item.name} </span>
                <span>{item.value}</span>
              </div>)
           }else{
               return ''
           }
      }):''
    )
  }
}

export default rankChart;