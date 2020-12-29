import React , { Fragment } from "react";
import {Layout,Form,Row, Col,Card,Table, Descriptions,Carousel ,Icon,Input} from "antd";
import {
  inject, observer
} from "mobx-react";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import CommonUtil from "@utils/common";
import projectList from '@utils/project';
import {weatherInfo} from '@apis/system/weather';
import {PropagandaList,SearchStaffTypeByOrg,SearchStaffEntryByOrg} from '@apis/home';
import {SwitchProject} from "@apis/system/project";
import {DailyCreateProjectBarometer,SearchProjectBarometer,HourlyCreateProjectBarometerRecord} from '@apis/today/weather'
import styles from './index.css';
import {GetTemporaryKey} from "@apis/account/index"
import addressJson from '@utils/address.json'
import { Scrollbars } from 'react-custom-scrollbars'
import moment from 'moment';


let _util = new CommonUtil();

const {Content} = Layout;
const { Search } = Input;


@injectIntl
class WeatherCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    renderTime = (string,index) => {
        if(string){
            var time_list = string.split(' ');
            return time_list[index]
        }else{
            return "--:--"
        }
    }

   
    render(){
        const {air,daily,hourly,now,city_name,hour} = this.props;
        const address = _util.getStorage("address");
     
        const weatherStyle1 = {
            width:'100%',
            height:'460px',
            borderRadius:'10px',
            backgroundImage:'linear-gradient(#f0f8ff, #fff,#f0f8ff)',
            border:'rgb(18, 81, 125) 2px solid',
            color:'rgb(18, 81, 125)',
        };
        const weatherStyle2 = {
            width:'100%',
            height:'100%',
            border:'rgb(18, 81, 125) 2px solid',
            color:'rgb(18, 81, 125)',
            overflow:'hidden'
        };

        var myDate = new Date();
        var dataString = moment(myDate).format('YYYY-MM-DD')
        return(
            <div style={weatherStyle2}>
                <Row style={{height:'50px'}}>
                    <Col span={12} style={{height:'50px',lineHeight:'50px',paddingLeft:'20px'}}>
                        {city_name}
                    </Col>
                    <Col span={12} style={{height:'50px',lineHeight:'50px',textAlign:'right',paddingRight:'20px'}}>
                        {hour ? `${dataString} ${hour}:00` : '--:--'}更新
                    </Col>
                </Row>
                <Row style={{height:'100px'}}>
                    <Col span={8} style={{height:'100px',paddingTop:'20px',paddingLeft:'20px'}}>
                        <span style={{fontSize:"24px"}}>{now&&now.tmp ? now.tmp :'-'}</span>
                        <span style={{fontSize:"20px"}}>℃</span>
                    </Col>
                    <Col span={8}>
                        <img src={require(`./weather-blue/${now&&now.cond_code ? now.cond_code :'999'}.png`)} style={{height:'100%'}}/>
                    </Col>
                    <Col span={8} style={{height:'100px',paddingTop:'20px',fontSize:"24px",textAlign:'right',paddingRight:'20px'}}>
                        {now&&now.cond_txt ? now.cond_txt :'-'}
                    </Col>
                </Row>
                <Row className={styles.weatherInfo3}>
                    <Col span={12}>{now&&now.wind_dir ? now.wind_dir :'-'}&nbsp;&nbsp;{now&&now.wind_sc ? now.wind_sc :'-'}级</Col>
                    <Col span={12} style={{textAlign:'right'}}>相对湿度:&nbsp;{now&&now.hum ? now.hum :'-'}%</Col>
                </Row> 
                <Row className={styles.weatherInfo4}>
                    <Col span={18}>
                        <span>{'空气质量指数(AQI):'}&nbsp;{air&&air.aqi ? air.aqi :'-'}</span>&nbsp;&nbsp;
                        <span>{air&&air.qlty ? air.qlty :'-'}</span><br/>
                    </Col>
                    <Col span={6}>PM2.5:&nbsp;{air&&air.pm25 ? air.pm25 :'-'}</Col>
                </Row>
                {/* <Row className={styles.weatherInfo4}>
                    <Col span={8}>PM10:&nbsp;{air&&air.pm10 ? air.pm10 :'-'}</Col>
                    <Col span={8}>PM25:&nbsp;{air&&air.pm25 ? air.pm25 :'-'}</Col>
                    <Col span={8}>{'NO2(二氧化氮)'}:&nbsp;{air&&air.no2 ? air.no2 :'-'}</Col>
                </Row>
                <Row className={styles.weatherInfo4}>
                    <Col span={8}>{'SO2(二氧化硫)'}:&nbsp;{air&&air.so2 ? air.so2 :'-'}</Col>
                    <Col span={8}>{'CO(一氧化碳)'}:&nbsp;{air&&air.co ? air.co :'-'}</Col>
                    <Col span={8}>{'O3(臭氧)'}:&nbsp;{air&&air.o3 ? air.o3 :'-'}</Col>
                </Row> */}
                <Row className={styles.everyHourCotainer}>
                    <Col span={4} className={styles.everyDay}>
                        <span>{this.renderTime(hourly&&hourly.length ? hourly[0]['time'] : null,1)}</span>
                        <img src={require(`./weather-blue/${hourly&&hourly.length ? hourly[0]['cond_code'] : '999'}.png`)} className={styles.everyDayImg}></img>
                        <span>{hourly&&hourly.length ? hourly[0]['cond_txt'] : '-'}</span>
                        <span>{hourly&&hourly.length ? hourly[0]['tmp'] : '-'}℃</span>
                    </Col>
                    <Col span={4} className={styles.everyDay}>
                        <span>{this.renderTime(hourly&&hourly.length ? hourly[1]['time'] : null,1)}</span>
                        <img src={require(`./weather-blue/${hourly&&hourly.length ? hourly[1]['cond_code'] : '999'}.png`)} className={styles.everyDayImg}></img>
                        <span>{hourly&&hourly.length ? hourly[1]['cond_txt'] : '-'}</span>
                        <span>{hourly&&hourly.length ? hourly[1]['tmp'] : '-'}℃</span>
                    </Col>
                    <Col span={4} className={styles.everyDay}>
                        <span>{this.renderTime(hourly&&hourly.length ? hourly[2]['time'] : null,1)}</span>
                        <img src={require(`./weather-blue/${hourly&&hourly.length ? hourly[2]['cond_code'] : '999'}.png`)} className={styles.everyDayImg}></img>
                        <span>{hourly&&hourly.length ? hourly[2]['cond_txt'] : '-'}</span>
                        <span>{hourly&&hourly.length ? hourly[2]['tmp'] : '-'}℃</span>
                    </Col>
                    <Col span={4} className={styles.everyDay}>
                        <span>{this.renderTime(hourly&&hourly.length ? hourly[3]['time'] : null,1)}</span>
                        <img src={require(`./weather-blue/${hourly&&hourly.length ? hourly[3]['cond_code'] : '999'}.png`)} className={styles.everyDayImg}></img>
                        <span>{hourly&&hourly.length ? hourly[3]['cond_txt'] : '-'}</span>
                        <span>{hourly&&hourly.length ? hourly[3]['tmp'] : '-'}℃</span>
                    </Col>
                    <Col span={4} className={styles.everyDay}>
                        <span>{this.renderTime(hourly&&hourly.length ? hourly[4]['time'] : null,1)}</span>
                        <img src={require(`./weather-blue/${hourly&&hourly.length ? hourly[4]['cond_code'] : '999'}.png`)} className={styles.everyDayImg}></img>
                        <span>{hourly&&hourly.length ? hourly[4]['cond_txt'] : '-'}</span>
                        <span>{hourly&&hourly.length ? hourly[4]['tmp'] : '-'}℃</span>
                    </Col>
                    <Col span={4} className={styles.everyDay}>
                        <span>{this.renderTime(hourly&&hourly.length ? hourly[5]['time'] : null,1)}</span>
                        <img src={require(`./weather-blue/${hourly&&hourly.length ? hourly[5]['cond_code'] : '999'}.png`)} className={styles.everyDayImg}></img>
                        <span>{hourly&&hourly.length ? hourly[5]['cond_txt'] : '-'}</span>
                        <span>{hourly&&hourly.length ? hourly[5]['tmp'] : '-'}℃</span>
                    </Col>
                </Row>
                <Row className={styles.everyDayCotainer}>
                    <Scrollbars
                    style={{
                        height: 'calc(100vh - 500px)',
                    }}>
                    <Fragment>  
                        {
                            daily&&daily.length?
                            daily.map((d,index) => {
                                if(index>0 || index <7){
                                    return(
                                        <Col span={24} className={styles.nextDay3}>
                                            <span className={styles.nextDayItem1}>{d['date'] ? d['date'] : '-'}</span>
                                            <div className={styles.nextDayItem2}>
                                                <img src={require(`./weather-blue/${d['cond_code_d'] ? d['cond_code_d'] : '999'}.png`)} className={styles.nextDayImg}></img>
                                            </div>
                                            <span className={styles.nextDayItem3}>{d['tmp_min'] ? d['tmp_min'] : '-'}-{d['tmp_max'] ? d['tmp_max'] : '-'}℃&nbsp;&nbsp;{d['cond_txt_d'] ? d['cond_txt_d'] : '-'}</span>
                                        </Col>
                                    )
                                }
                            })
                            :''
                        }
                        
                        {/* <Col span={24} className={styles.nextDay2}>
                            <span>{daily&&daily.length ? daily[1]['date'] : '-'}</span>
                            <img src={require(`./weather-blue/${daily&&daily.length ? daily[1]['cond_code_d'] : '999'}.png`)} className={styles.nextDayImg}></img>
                            <span>{daily&&daily.length ? daily[1]['tmp_min'] : '-'}-{daily&&daily.length ? daily[1]['tmp_max'] : '-'}℃&nbsp;&nbsp;{daily&&daily.length ? daily[1]['cond_txt_d'] : '-'}</span>
                        </Col>
                        <Col span={24} className={styles.nextDay2}>
                            <span>{daily&&daily.length ? daily[2]['date'] : '-'}</span>
                            <img src={require(`./weather-blue/${daily&&daily.length ? daily[2]['cond_code_d'] : '999'}.png`)} className={styles.nextDayImg}></img>
                            <span>{daily&&daily.length ? daily[2]['tmp_min'] : '-'}-{daily&&daily.length ? daily[2]['tmp_max'] : '-'}℃&nbsp;&nbsp;{daily&&daily.length ? daily[2]['cond_txt_d'] : '-'}</span>
                        </Col>
                        <Col span={24} className={styles.nextDay2}>
                            <span>{daily&&daily.length ? daily[3]['date'] : '-'}</span>
                            <img src={require(`./weather-blue/${daily&&daily.length ? daily[3]['cond_code_d'] : '999'}.png`)} className={styles.nextDayImg}></img>
                            <span>{daily&&daily.length ? daily[3]['tmp_min'] : '-'}-{daily&&daily.length ? daily[3]['tmp_max'] : '-'}℃&nbsp;&nbsp;{daily&&daily.length ? daily[3]['cond_txt_d'] : '-'}</span>
                        </Col>
                        <Col span={24} className={styles.nextDay2}>
                            <span>{daily&&daily.length ? daily[4]['date'] : '-'}</span>
                            <img src={require(`./weather-blue/${daily&&daily.length ? daily[4]['cond_code_d'] : '999'}.png`)} className={styles.nextDayImg}></img>
                            <span>{daily&&daily.length ? daily[4]['tmp_min'] : '-'}-{daily&&daily.length ? daily[4]['tmp_max'] : '-'}℃&nbsp;&nbsp;{daily&&daily.length ? daily[4]['cond_txt_d'] : '-'}</span>
                        </Col>
                        <Col span={24} className={styles.nextDay2}>
                            <span>{daily&&daily.length ? daily[5]['date'] : '-'}</span>
                            <img src={require(`./weather-blue/${daily&&daily.length ? daily[5]['cond_code_d'] : '999'}.png`)} className={styles.nextDayImg}></img>
                            <span>{daily&&daily.length ? daily[5]['tmp_min'] : '-'}-{daily&&daily.length ? daily[5]['tmp_max'] : '-'}℃&nbsp;&nbsp;{daily&&daily.length ? daily[5]['cond_txt_d'] : '-'}</span>
                        </Col>
                        <Col span={24} className={styles.nextDay2}>
                            <span>{daily&&daily.length ? daily[6]['date'] : '-'}</span>
                            <img src={require(`./weather-blue/${daily&&daily.length ? daily[6]['cond_code_d'] : '999'}.png`)} className={styles.nextDayImg}></img>
                            <span>{daily&&daily.length ? daily[6]['tmp_min'] : '-'}-{daily&&daily.length ? daily[6]['tmp_max'] : '-'}℃&nbsp;&nbsp;{daily&&daily.length ? daily[6]['cond_txt_d'] : '-'}</span>
                        </Col> */}
                    </Fragment>
                    </Scrollbars>                   
                </Row>                         
            </div>
        )
    }
}

@inject("menuState","appState") @observer @injectIntl
class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        currentProject:_util.getStorage("project") ? _util.getStorage("project") : null,
        personData:[],
        project_id:_util.getStorage("project_id"),
        city:'--',
        image_url_list:[],
        air:null,
        daily:null,
        hourly:null,
        now:null,
        cosUrl:'',
        orgList:[],
        hour:''
    };
  }

    componentDidMount() {
        const project_id = _util.getStorage("project_id");
        this.setState({project_id})
        PropagandaList({project_id:project_id}).then(res => {
            if(res&&res.data&&res.data.results){
                const img_list = res.data.results;
                this.getImageURL(img_list)
            }
        });
        SearchProjectBarometer({project_id:project_id}).then(res => {
            if(res&&res.data){
                const {hour,results} = res.data;
                const {air,daily,hourly,now} = results;
                this.setState({
                    hour:hour ? hour :null,
                    air:air ? air : null,
                    daily:daily ? daily : null,
                    hourly:hourly ? hourly : null,
                    now:now ? now : null
                });
            }
        });

        SearchStaffEntryByOrg({project_id:project_id}).then(res => {
            if(res.data){
                console.log('0316',res.data);
                this.setState({orgList:res.data})
            }
        });
        SwitchProject({project_id:project_id}).then(res => {
            if(res.data && res.data.city){
                var city = res.data.city;
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
        })
    }

    componentWillReceiveProps(nextProps){
        //切换项目
        const {project_id} = this.state;
        if(project_id != nextProps.appState.project_id){
            if(nextProps.appState.project_id){
                this.refreshHomeData(nextProps.appState.project_id)
            }
            
        }
    }


    refreshHomeData = (project_id) => {
        this.setState({
            project_id:project_id,
            city:'--',
            image_url_list:[],
            air:null,
            daily:null,
            hourly:null,
            now:null,
            cosUrl:'',
            orgList:[]
        })
        PropagandaList({project_id:project_id}).then(res => {
            if(res&&res.data&&res.data.results){
                const img_list = res.data.results;
                this.getImageURL(img_list)
            }
        });
        SearchProjectBarometer({project_id:project_id}).then(res => {
            if(res&&res.data){
                const {hour,results} = res.data;
                const {air,daily,hourly,now} = results;
                this.setState({hour,air,daily,hourly,now});
            }
        });

        SearchStaffEntryByOrg({project_id:project_id}).then(res => {
            if(res.data){
                console.log('0316',res.data);
                this.setState({orgList:res.data})
            }
        });
        SwitchProject({project_id:project_id}).then(res => {
            if(res.data && res.data.city){
                var city = res.data.city;
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
        })
    }


    getImageURL = (img_list) => {
        var that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        if(img_list&&img_list.length){
            img_list.map((item,index) => { 
                const source = _util.switchToJson(item.source)[0];
                const key = source.url;
                var url = cos.getObjectUrl({
                    Bucket: 'ecms-1256637595',
                    Region: 'ap-shanghai',
                    Key:key,
                    Sign: true,
                }, function (err, data) {
                    if(data && data.Url){    
                        const img_obj =  {url:data.Url,name:item.desc,id:item.id,key:item.id};             
                        const new_list = [...that.state.image_url_list,img_obj];
                        that.setState({image_url_list:new_list});
                    }
                });
            })
        }else{
            this.setState({image_url_list:[]})
        }
    }
  

    getWeather = (city) => {
        const {project_id} = this.state;
        weatherInfo({project_id:project_id,location:city}).then((res) => {
            if(res.data){
                const {weather,air} =(res.data);
                if(JSON.stringify(weather) !== "{}"){
                    _util.setStorage('weather',weather)
                }
                if(JSON.stringify(air) !== "{}"){
                    _util.setStorage('air',air)
                }
            }
        })
    }

    renderData = (id) => {
        const project = projectList.find(item => {
            return item.id == id
        });
        this.setState({currentProject:project})
    }

    renderWeather = (id) => {
        return {width:'100%',height:'100%',borderRadius:'10px',background:'#00bfff'}
    }

    handleCity = (e) => {
        this.setState({city:e.target.value});
    }

    searchWeather = (value) => {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.getWeather(value)
    }

    next=()=>{
        this.slider.slick.slickNext();
      }
      prev=()=>{
        this.slider.slick.slickPrev();
      }
    



    render() {
        const {image_url_list,air,daily,hourly,now,orgList,city_name,hour} = this.state;
        const orgListCount  = orgList.length ? orgList.length :0
        const columns = [
            {
                title: '组织名',
                dataIndex: 'org_name',
                key: 'org_name',
                align:'center',
                render:(text, record, index) => {
                    return <span style={{fontWeight:'bold'}}>{text}</span>
                }
            },
            {
              title: '管理人员',
              dataIndex: 'manager',
              key: 'manager',
              align:'center',
              width:'80px'
            },
           
            {
              title: '安全人员',
              key: 'safety',
              dataIndex: 'safety',
              align:'center',
              width:'80px'
            },
            {
                title: '特种职务',
                key: 'special',
                dataIndex: 'special',
                align:'center',
                width:'80px'
            },
            {
                title: '普工',
                key: 'simple',
                dataIndex: 'simple',
                align:'center',
                width:'80px'
            },
           
          ];
        return (
            <div style={{
                maxHeight: "calc( 100vh - 104px )",
                overflowY: "scroll",
                overflowX: "hidden"
            }}>        
                <Content style={{paddingTop: "16px"}}>
                    <div className="content-wrapper" style={{padding:'0'}}>
                        <div className={styles.TopInfoContainer}>
                            <div className={styles.WeatherContainer}>
                                <WeatherCard 
                                    air={air}
                                    now={now}
                                    daily={daily}
                                    hourly={hourly}
                                    city_name={city_name}
                                    hour={hour}
                                />
                            </div>
                            <div className={styles.ImgAndTableContainer} >
                                <Carousel
                                className={styles.CarouselContainer}
                                ref={el => (this.slider = el)}
                                >
                                    {
                                        image_url_list&&image_url_list.length ?
                                        image_url_list.map(item => {
                                            return (
                                                <div className={styles.ImageContainer}>
                                                    <img src={item.url} className={styles.homeImage}></img> 
                                                    <div className={styles.descContainer}>
                                                        <span>{item.name}</span>
                                                    </div>                                    
                                                </div>
                                            )
                                        })
                                        :
                                        <div className={styles.ImageContainer}>                                         
                                            <div className={styles.descContainer}>
                                                <span>暂无图片</span>
                                            </div>                                    
                                        </div>
                                    }    
                                </Carousel>
                                {/* <Icon type="left" onClick={() => this.prev()} style={{color:'#fff',fontSize:'36px',position:'absolute',left:'5px',top:'50px',zIndex:99}}/>
                                <Icon type="right" onClick={() => this.next()} style={{color:'#fff',fontSize:'36px',position:'absolute',right:'5px',top:'50px',zIndex:99}} /> */}
                               
                                {/* <Table 
                                    display={{width:'200px'}}
                                    columns={columns} 
                                    dataSource={HomeData} 
                                    bordered={true}
                                    pagination={false}
                                    style={{background:'#f0f8ff',border:'2px solid rgb(18, 81, 125)'}}
                                /> */}
                                <div style={{width:"100%",height:'100%',marginTop:'10px',overflow:'hidden',border:'2px solid rgb(18, 81, 125)'}}>
                                    <Table 
                                        display={{width:'100%'}}
                                        columns={columns} 
                                        dataSource={orgList} 
                                        bordered={true}
                                        pagination={false}   
                                        scroll={{y:108}}                                  
                                    />
                                </div>
                            </div>        
                            
                        </div>                     
                    </div>
                </Content>
            </div>
        );
    }
}

const UserHomePage = Form.create()(UserHome);

export default UserHomePage;
