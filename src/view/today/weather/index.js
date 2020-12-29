import React from "react";
import { Link } from "react-router-dom";
import { Divider, Popconfirm, message, Tag,Button, Modal,Form,Input,Upload,Icon } from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages, intlShape} from "react-intl";
import {inject, observer} from "mobx-react/index";
import moment from 'moment';
import {Barometer,BarometerRecord,WeatherReport} from '@apis/today/weather'


const _util = new CommonUtil();
const FormItem = Form.Item;

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  
});


@inject("appState") @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
        super(props);
        const {formatMessage} = this.props.intl;
        this.state = {
          column:[
            {
                title: formatMessage(messages.No),  //序号
                width: 40,
                maxWidth: 40,
                dataIndex: 'efm-index',
                render: (text, record, index) => {
                  return (index + 1)
                }
            }, 
            {
              title: '日期',      
              dataIndex: 'date',
              sorter: _util.sortDate,
              filterType: 'range-date',
              render: (text, record, index) => {
                const date = record.date
                let path = {
                  pathname: '/today/barometer/detail',
                  state: {
                    date:date,
                    location: _util.getStorage('city') ? _util.getStorage('city') :'320500',
                  }
                }
                return (
                  <Link to={path} onClick={this.setScrollTop}>
                    {text}
                  </Link>
                );
              }
            },
            {
              title: '天气',      
              dataIndex: 'weather',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record)
            },
            {
              title: '最低温度',      
              dataIndex: 'min_temp',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record + ' ℃')
            },
            {
              title: '最高温度',      
              dataIndex: 'max_temp',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record + ' ℃')
            },
            {
              title: '降水量',      
              dataIndex: 'water',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record)
            },
            {
              title: '相对湿度',      
              dataIndex: 'wet',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record + ' %')
            },
            {
              title: '风向',      
              dataIndex: 'wind_dir',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record)
            },
            {
              title: '风力',      
              dataIndex: 'wind_power',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record + ' 级')
            },
            {
              title: '风速',      
              dataIndex: 'wind_speed',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record + ' km/h')
            },
            // {
            //   title: '空气质量',      
            //   dataIndex: 'qlty',
            //   sorter: _util.sortString,
            //   filterType: 'select',
            //   render: record => _util.getOrNullList(record)
            // },
            {
              title: 'AQI',      
              dataIndex: 'aqi',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record)
            },
            {
              title: 'PM2.5',      
              dataIndex: 'pm25',
              sorter: _util.sortString,
              filterType: 'select',
              render: record => _util.getOrNullList(record)
            },
          ]
        };
    }

    componentDidMount(){
      // Barometer({project_id:_util.getStorage('project_id')})
      // BarometerRecord({project_id:_util.getStorage('project_id')})
    }

    setScrollTop = () => {
      const scrollTopPosition = this.props.appState.tableScrollTop;
      if(scrollTopPosition){
        _util.setSession('scrollTop', scrollTopPosition);
      };
    }


  render() {
    const {refresh,column} = this.state;

    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
        <TablePage
            refresh={refresh}
            getFn={WeatherReport}
            columns={column}
            excelName={'天气记录'}
            disableFnWithConfirm={true}
        />
        </div>
      </div>
    );
  }
}