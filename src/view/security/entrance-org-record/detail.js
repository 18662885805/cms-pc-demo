import React from 'react'
import {
    inject,
    observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import { orgEntryDetail} from '@apis/security/entryrecord'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import CardDetail from '@component/CardDetail'
import moment from 'moment'
import intl from "react-intl-universal";

let _util = new CommonUtil()

@inject('menuState') @observer
class RecordDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           start_time:'',
           end_time:''
        }
    }

    componentDidMount() {
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            orgEntryDetail(project_id,{id: this.props.location.state.id}).then((res) => {
                const results = res.data;
                this.setState({
                    ...results,
                })
            })
        }
    }

    renderStatus = (value) => {
        if(value){
            if(_util.getStorage('langs') === 'en'){
                return 'Active';
            }else{
                return '激活';
            }     
        }else{
            if(_util.getStorage('langs') === 'en'){
                return 'Disabled';
            }else{
                return '禁用';
            }
        }
    }

    getDurationTime = (record) => {
      if(!record.end_time){//未出场
        let m1 = moment(record.start_time).valueOf();
        let m2 = moment(Date.now()).valueOf();
        let time = moment.duration(m2 - m1, "ms");
        if (time.get("days") < 1 && time.get("hours") < 1 && time.get("minutes") < 1) {
          return (
            <div style={{ color: "#FF0016" }}>{time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && time.get("hours") < 1) {
          return (
            <div style={{ color: "#FF0016" }}>{time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && time.get("hours") < 8) {
          return (
            <div style={{ color: "#FF0016" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && (time.get("hours") >= 8 && time.get("hours") < 12)) {
          return (
            <div style={{ color: "#FF0016" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && (time.get("hours") >= 12 && time.get("hours") < 24)) {
          return (
            <div style={{ color: "#FF0016" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") > 0) {
          return (
            <div style={{ color: "#FF0016" }}>
              {
                (time.get("months") > 0 ? time.get("months") + intl.get("page.event.accessrecord.month") : null) +
                time.get("days") + intl.get("page.event.accessrecord.day") + time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")
              }
            </div>
          );
        }
      }else{//已出场
        let m1 = moment(record.start_time).valueOf();
          let m2 = moment(record.end_time	).valueOf();
          let time = moment.duration(m2 - m1, "ms");
          if (time.get("days") < 1 && time.get("hours") < 1 && time.get("minutes") < 1) {
            return (
              <div style={{ color: "#108ee9" }}>{time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
            );
          }
          if (time.get("days") < 1 && time.get("hours") < 1) {
            return (
              <div style={{ color: "#108ee9" }}>{time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
            );
          }
          if (time.get("days") < 1 && time.get("hours") < 8) {
            return (
              <div style={{ color: "#108ee9" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
            );
          }
          if (time.get("days") < 1 && (time.get("hours") >= 8 && time.get("hours") < 12)) {
            return (
              <div style={{ color: "#108ee9" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
            );
          }
          if (time.get("days") < 1 && (time.get("hours") >= 12 && time.get("hours") < 24)) {
            return (
              <div style={{ color: "#108ee9" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
            );
          }
          if (time.get("days") > 0) {
            return (
              <div style={{ color: "#108ee9" }}>
                {
                  (time.get("months") > 0 ? time.get("months") + intl.get("page.event.accessrecord.month") : null) +
                  time.get("days") + intl.get("page.event.accessrecord.day") + time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")
                }
              </div>
            );
          }
      }
        
      }

    
    render() {
        const {
            staff_name,project_name,organization_name,staff_phone,staff_id_card,staff_work_type_name,
            staff_type,start_time,end_time,extra_desc,remark,turnstile_name
        } = this.state;




        const tableData = [
            {
                text: '员工姓名',
                value: _util.getOrNull(staff_name)
            },
            {
              text: '手机号',
              value: _util.getOrNull(staff_phone)
          },
          {
              text: '证件号',
              value: _util.getOrNull(staff_id_card)
          },
            {
                text: '项目',
                value: _util.getOrNull(project_name)
            },
            {
                text: '组织',
                value: _util.getOrNull(organization_name)
            },
           
            {
                text: '职务',
                value: _util.getOrNull(staff_work_type_name)
            },
            {
                text: '人员类型',
                value: _util.getPersonType(staff_type ? parseInt(staff_type)  :null)
            },
            
            {
                text: '补充描述',
                value: _util.getOrNull(extra_desc)
            },
            {
                text: '备注',
                value: _util.getOrNull(remark)
            },
            {
                text: '闸机',
                value: _util.getOrNull(turnstile_name)
            },
            {
                text: '入场时间',
                value: _util.getOrNullList(start_time ?  moment(start_time).format("YYYY-MM-DD HH:mm:ss") : '')
            },
            {
                text: '出场时间',
                value:_util.getOrNullList(end_time ?  moment(end_time).format("YYYY-MM-DD HH:mm:ss") : '')
            },
            {
                text: '逗留时间',
                value:this.getDurationTime({start_time:start_time,end_time:end_time})
            },
           
            
        ]


        const bread = [
          {
              name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
              url: '/'
          },
          {
              name: '安防管理'
          },
          {
              name: '组织进出记录',
              url: '/safety/org/entryrecord'
          },
          {
            name: <FormattedMessage id="page.component.breadcrumb.detail" defaultMessage="详情" />
        }
        ]

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper content-no-table-wrapper">
                    <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情" />} data={tableData}  />
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
