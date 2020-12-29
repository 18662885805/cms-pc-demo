import React from 'react'
import {
    inject,
    observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {BarometerRecordDetail} from '@apis/today/weather'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import CardDetail from '@component/CardDetail'
import moment from 'moment'
import intl from "react-intl-universal";
import { Collapse,List, Spin } from 'antd';
import addressJson from '@utils/address.json'

const { Panel } = Collapse;
let _util = new CommonUtil()

@inject('menuState') @observer
class RecordDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           start_time:'',
           end_time:'',
           weatherList:[],
           view_loading:false,
           date:'',
           location:'',
           city_name:'--',
        }
    }

    componentDidMount() {
        console.log('0410',this.props.location.state)
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.date === undefined || this.props.location.state.location === undefined) {
            this.props.history.replace('/404')
        } else {
            const {date,location} = this.props.location.state;
            this.setState({view_loading:true,date,location})
            BarometerRecordDetail({project_id:project_id,date:date}).then((res) => {
                this.setState({view_loading:false})
                if(res&&res.data){
                    console.log('0508',res.data)
                    this.setState({weatherList:res.data})
                }
            });

            //获取城市
            const city = _util.getStorage('city');
            if(city){
                var city_obj_list = [];
                addressJson.forEach(a=>{
                    if(a.code == city){
                        city_obj_list.push(a)
                    }else{
                        a.children.forEach(aa => {
                            //console.log('0316',aa.code,'---',city)
                            if(aa.code == city){
                                city_obj_list.push(aa)
                            }else{
                                aa.children.forEach(aaa => {
                                    if(aaa.code==city){
                                        city_obj_list.push(aaa)
                                    }
                                })
                            }
                        })
                    }
                })
                if(city_obj_list.length){
                    this.setState({city_name:city_obj_list[0].label})
                }
            }
        }
    }

    renderNowInfo = (records) => {
        if(!records){
            return ''
        }
        return(
            [
                {
                    text: '实况天气状况',
                    value: _util.getOrNull(records&&records.cond_txt)
                },
                {
                    text: '温度(摄氏度)',
                    value: _util.getOrNull(records&&records.tmp)
                },
                {
                    text: '体感温度(摄氏度)',
                    value: _util.getOrNull(records&&records.fl)
                },
                {
                    text: '降水量',
                    value: _util.getOrNull(records&&records.pcpn)
                },
                {
                    text: '相对湿度',
                    value: _util.getOrNull(records&&records.hum)
                },
                {
                    text: '大气压强',
                    value: _util.getOrNull(records&&records.pres)
                },
                {
                    text: '能见度(公里)',
                    value: _util.getOrNull(records&&records.vis)
                },
                {
                    text: '云量',
                    value: _util.getOrNull(records&&records.cloud)
                },
                {
                    text: '风向360角度',
                    value: _util.getOrNull(records&&records.wind_deg)
                },
                {
                    text: '	风向',
                    value: _util.getOrNull(records&&records.wind_dir)
                },
                {
                    text: '风力',
                    value: _util.getOrNull(records&&records.wind_sc)
                },
                {
                    text: '风速(公里/小时)',
                    value: _util.getOrNull(records&&records.wind_spd)
                },
               
            ]
        )
    }

    renderAirInfo = (records) => {
        if(!records){
            return ''
        }
        return(
            [
                {
                    text: '空气质量指数(AQI)',
                    value: _util.getOrNull(records&&records.aqi)
                },
                {
                    text: '空气质量',
                    value: _util.getOrNull(records&&records.qlty)
                },
                {
                    text: '主要污染物',
                    value: _util.getOrNull(records&&records.main)
                },
                {
                    text: 'pm10',
                    value: _util.getOrNull(records&&records.pm10)
                },
                {
                    text: 'pm25',
                    value: _util.getOrNull(records&&records.pm25)
                },
                {
                    text: '二氧化氮',
                    value: _util.getOrNull(records&&records.no2)
                },
                {
                    text: '二氧化硫',
                    value: _util.getOrNull(records&&records.so2)
                },
                {
                    text: '一氧化碳',
                    value: _util.getOrNull(records&&records.co)
                },
                {
                    text: '臭氧',
                    value: _util.getOrNull(records&&records.o3)
                },
            ]
        )
    }
 
    render() {
        const {
            weatherList,view_loading,date,city_name
        } = this.state;
       

        const customPanelStyle = {
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 10,
            border: 0,
            overflow: 'hidden',
        };

        const infoStyle = {
            width:'70%',
            margin: '5px auto',
            height:'45px', 
            background: '#f7f7f7',
            borderRadius: 4,
            display:'flex',
            justifyContent:'space-around',
            alignItems:'center',
            color:'black'
        }




        return (
            <div>
                <MyBreadcrumb />
                <div className="content-wrapper content-no-table-wrapper">
                    <Spin spinning={view_loading}>
                    <div style={infoStyle}>
                        <span>城市:{city_name}</span>
                        <span>日期:{date}</span>
                    </div>
                    <Collapse defaultActiveKey={[0]} style={{width:'70%',margin: '5px auto'}} bordered={false}> 
                        {
                            weatherList&&weatherList.length ? 
                            weatherList.map((w,wIndex) => {
                                return <Panel header={`${w.hour ? w.hour : 0} 时天气详情`} key={wIndex} style={customPanelStyle}>
                                    <CardDetail data={this.renderNowInfo(w.info&&w.info.now ? w.info.now :'')} />
                                    <CardDetail data={this.renderAirInfo(w.info&&w.info.air ? w.info.air :'')} />
                                </Panel>  
                            }):''
                        }
                    </Collapse>
                    </Spin>
                    <GoBackButton 
                        style={{display: 'block', margin: '0 auto'}} 
                        props={this.props}
                        noConfirm />
                </div>
            </div>
        )
    }
}

export default RecordDetail
