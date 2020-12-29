import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
} from 'antd'
import moment from 'moment'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {orgEntry} from '@apis/security/entryrecord'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import {inject, observer} from 'mobx-react/index'
import intl from "react-intl-universal";
const _util = new CommonUtil()


@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
          column: [
              {
                  //title: '序号',
                  title: formatMessage({ id:"app.table.column.No", defaultMessage:"序号"}),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  //title: '员工姓名',
                  title: formatMessage({ id:"page.construction.staff.name", defaultMessage:"员工姓名"}),
                  dataIndex: 'staff_name',
                  sorter: _util.sortString,
                  render: (text, record) => {
                    const id = record.id
                    let path = {
                      pathname: '/safety/org/entryrecord/detail',
                      state: {
                        id: id
                      }
                    }
                    return (
                      <Link to={path} onClick={this.setScrollTop}>
                        {record.staff_name?record.staff_name:null}
                      </Link>
                    );
                  }
              },
            //   {
            //     title: formatMessage({ id:"page.construction.staff.contractor", defaultMessage:"所属组织"}),
            //     dataIndex: 'organization_name',
            //     sorter: _util.sortString,
            //     render: record => _util.getOrNullList(record)
            //   },
             
            {
                
                title: '人员类型',
                dataIndex: 'staff_type_name',
                sorter: _util.sortString,
                render: (text, record, index) => {
                    return _util.getPersonType(parseInt(record&&record.staff_type))
                }
            },
            {
                
              title: '职务',
              dataIndex: 'staff_work_type_name',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
            },
            {
              title: '手机号',
              dataIndex: 'staff_phone',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
          },
          {
              title: '证件号',
              dataIndex: 'staff_id_card',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
          },
            {
              title: '补充描述',
              dataIndex: 'extra_desc',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
          },
            {
              title: '备注',
              dataIndex: 'remark',
              sorter: _util.sortString,
              render: record => _util.getOrNullList(record)
          },
            {
                  
              title: '入场时间',
              dataIndex: 'start_time_GMT',
              sorter: _util.sortDate,
              filterType: 'range-date',
              render: record => _util.getOrNullList(record)
          },
          {
                  
            title: '出场时间',
            dataIndex: 'end_time_GMT',
            sorter: _util.sortDate,
            filterType: 'range-date',
            render: record => _util.getOrNullList(record)
          },
          {
            title: '逗留时间',    //逗留时间
            dataIndex: 'operate1',
            sorter: _util.sortString,
            render: (text, record) => {
              return this.getDurationTime(record)
            },
          },
          {
            title: '闸机',
            dataIndex: 'turnstile_name',
            sorter: _util.sortString,
            render: record => _util.getOrNullList(record)
          },
          
              
          ],
          check: _util.check(),
          selectedRowKeys: [],
          selectedRows: [],
      }
  }

  componentDidMount(){
  }




  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  };

  getDurationTime = (record) => {
    console.log('0318',record.start_time,record.end_time)
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
    const { column, check, refresh } = this.state;
    const { formatMessage } = this.props.intl;
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
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={orgEntry}
            columns={column}
            excelName={'进出记录'}
            onSelectChange={this.onSelectChange}
            dataMap={data => {
              data.forEach((d,index) => {
                d.start_time_GMT = d.start_time ? moment(d.start_time).format('YYYY-MM-DD HH:mm') : '-'
                d.end_time_GMT = d.end_time ? moment(d.end_time).format('YYYY-MM-DD HH:mm') : '-'
                d.staff_type_name = d.staff_type? _util.getPersonTypeDesc(parseInt(d.staff_type))  :''
              });
            }}
          >
          </TablePage>
        </div>
      </div>
    )
  }
}