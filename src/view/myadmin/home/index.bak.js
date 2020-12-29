import React, {Fragment} from "react";
import {Layout, Card, Row, Col, Icon, Form, DatePicker, Cascader, Tooltip, Tabs, Select, message, Button, Spin} from "antd";
import numeral from "numeral";
import {
  inject, observer
} from "mobx-react";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import {ChartCard, MiniArea, MiniBar, MiniProgress, Field, Bar, StackBar} from "@component/Charts";

import moment from "moment";
import CommonUtil from "@utils/common";
import {visitInfo} from "@apis/system/location/";
import {getFitChart, getFitAll} from "@apis/event/fit/";
import {getConstructionChart} from "@apis/construction";
import {getCarryoutChart} from "@apis/carry-out";
import {getOrderChart} from "@apis/workorder";
import styles from "./Analysis.css";
import refreshStyles from "./index.module.css";

let _util = new CommonUtil();

const {TabPane} = Tabs;
const {RangePicker} = DatePicker;
const {Content} = Layout;
const { Option } = Select;

const messages = defineMessages({
  okText: {
    id: "app.button.ok",
    defaultMessage: "确认"
  },
  cancelText: {
    id: "app.button.cancel",
    defaultMessage: "取消"
  },
  maxday: {
    id: "app.message.home.maxday",
    defaultMessage: "最多选择30天！"
  },
  maxmonth: {
    id: "app.message.home.maxmonth",
    defaultMessage: "最多选择12个月！"
  },
  maxyear: {
    id: "app.message.home.maxyear",
    defaultMessage: "最多选择10年！"
  },
  reqmonth: {
    id: "app.home.check.reqmonth",
    defaultMessage: "请选择月份"
  },
  reqyear: {
    id: "app.home.check.reqyear",
    defaultMessage: "请选择年"
  },
  location: {
    id: "app.placeholder.home.location",
    defaultMessage: "厂区地点"
  },
  start_month: {
    id: "app.placeholder.home.start_month",
    defaultMessage: "开始月份"
  },
  end_month: {
    id: "app.placeholder.home.end_month",
    defaultMessage: "结束月份"
  },
  start_year: {
    id: "app.placeholder.home.start_year",
    defaultMessage: "开始年份"
  },
  end_year: {
    id: "app.placeholder.home.end_year",
    defaultMessage: "结束年份"
  },
  wait_approve: {
    id: "app.home.status.wait_approve",
    defaultMessage: "待审批"
  },
  approved: {
    id: "app.home.status.approved",
    defaultMessage: "审批通过"
  },
  closed: {
    id: "app.home.status.closed",
    defaultMessage: "已关闭"
  },
  exception_closed: {
    id: "app.home.status.exception_closed",
    defaultMessage: "异常关闭"
  },
  temp_card: {
    id: "app.home.text.temp_card",
    defaultMessage: "短期出入证"
  },
  construction_workers: {
    id: "app.home.text.construction_workers",
    defaultMessage: "施工人员"
  },
  fit: {
    id: "app.home.text.fit",
    defaultMessage: "普通访客"
  },
  cargo: {
    id: "app.home.text.cargo",
    defaultMessage: "装卸货"
  },
  book_visitor: {
    id: "app.home.text.book_visitor",
    defaultMessage: "预约访客"
  },
  outside_staff: {
    id: "app.home.text.outside_staff",
    defaultMessage: "外部员工"
  },
  vip_visitor: {
    id: "app.home.text.vip_visitor",
    defaultMessage: "团体访客"
  }
});

@inject("menuState") @observer @injectIntl
class Home extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    let userInfo = _util.getStorage("userInfo");
    this.state = {
      avatar: userInfo.avatar ? _util.getImageUrl(userInfo.avatar) : "",
      real_name: userInfo.real_name,
      department: userInfo.department,
      logData: [],
      location_list: [],
      loading: false,
      currentShowType: "day",
      dayValue: null,
      monthValue: null,
      yearValue: null,
      chartData: [],
      constructionChartData: [],
      miniChart: [],
      miniConstructionChart: [],
      miniOrderChart: [],
      miniCarryoutChart: [],
      getCharting: false,
      getChartingFistt: false,
      getConstructionCharting: false,
      getConstructionChartingFirst: false,
      getOrderCharting: false,
      getCarryoutCharting: false,
      statusArr: [
        // {
        //     status: 1,
        //     name: '创建'
        // },
        // {
        //     status: 2,
        //     name: '待分配'
        // },
        {
          status: 3,
          name: formatMessage(messages.wait_approve) //待审批
        },
        {
          status: 4,
          name: formatMessage(messages.approved) //审批通过
        },
        // {
        //     status: 5,
        //     name: '审批未通过'
        // },
        // {
        //     status: 6,
        //     name: '撤回'
        // },
        // {
        //     status: 7,
        //     name: '退回'
        // },
        // {
        //     status: 8,
        //     name: '被撤回'
        // },
        // {
        //     status: 9,
        //     name: '被退回'
        // },
        {
          status: 10,
          name: formatMessage(messages.closed) //已关闭
        },
        {
          status: 11,
          name: formatMessage(messages.exception_closed) //异常关闭
        }
      ],
      statusFields: [
        "confined_list",
        "hanging_list",
        "high_work_permit_list",
        "hot_work_permit_list",
        "project_list",
        "work_permit_list"
      ],
      orderFields: [
        "order_list"
      ],
      carryoutFields: [
        "record_list"
      ],
      currentTab: "fit",
      fitAllCount: 0,
      fitEnterCount: 0,
      constructionAllCount: 0,
      orderAllCount: 0,
      carryoutAllCount: 0,
      startDate: moment().subtract(14, "d").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD")
    };
  }

    setOrderChart = (values, first) => {
      this.setState({
        getOrderCharting: true
      });
      getOrderChart(values).then(res => {
        const { rows, all_count } = res.data && res.data.results;
        const { orderFields } = this.state;

        if (Array.isArray(rows) && rows.length > 0) {

          const miniOrderChart = [];

          rows.forEach(row => {
            if (first) {
              let total = 0;

              orderFields.forEach(field => {
                total += row[field].length;
              });

              miniOrderChart.push({
                x: row["date"],
                y: total
              });
              this.setState({
                miniOrderChart
              });
            }
          });
        }

        this.setState({
          orderAllCount: all_count,
          getOrderCharting: false
        });
      });
    }

    setCarryout = (values, first) => {
      this.setState({
        getCarryoutCharting: true
      });
      getCarryoutChart(values).then(res => {
        const { rows, all_count } = res.data && res.data.results;
        const { carryoutFields } = this.state;

        if (Array.isArray(rows) && rows.length > 0) {

          const miniCarryoutChart = [];

          rows.forEach(row => {
            if (first) {
              let total = 0;

              carryoutFields.forEach(field => {
                total += row[field].length;
              });

              miniCarryoutChart.push({
                x: row["date"],
                y: total
              });
              this.setState({
                miniCarryoutChart
              });
            }
          });
        }

        this.setState({
          carryoutAllCount: all_count,
          getCarryoutCharting: false
        });
      });
    }

    setConstructionChart = (values, first) => {
      const { startDate, endDate } = this.state;

      if (startDate.length !== endDate.length) return;

      let dateArr = [];

      let startDateM = moment(startDate);
      let endDateM = moment(endDate);

      if (startDate.length === 10) {
        for (let i = 0, len = endDateM.diff(startDateM, "days"); i <= len; i++) {
          dateArr.unshift(moment(endDate).subtract(i, "days").format("YYYY-MM-DD"));
        }
      }


      this.setState({
        getConstructionCharting: true
      });
      if (first) {
        this.setState({
          getConstructionChartingFirst: true
        });
      }

      getConstructionChart(values).then(res => {
        const { results } = res.data;
        let rows = [];
        let dateAct;
        const { statusArr, statusFields } = this.state;

        if (!results.rows) {
          dateAct = "date";
          for (let i = 0, len = dateArr.length; i < len; i++) {
            let d = dateArr[i];
            let obj = results[d];

            if (!obj) {
              obj = {};
            }

            const {
              confined_list,
              hanging_list,
              high_work_permit_list,
              hot_work_permit_list,
              project_list,
              work_permit_list
            } = obj;

            rows.push({
              date: d.length > 7 ? d.substr(5) : d,
              confined_list: confined_list || 0,
              hanging_list: hanging_list || 0,
              high_work_permit_list: high_work_permit_list || 0,
              hot_work_permit_list: hot_work_permit_list || 0,
              project_list: project_list || 0,
              work_permit_list: work_permit_list || 0
            });
          }
        } else {
          rows = results.rows;
        }


        const { all_count } = res.data && res.data.results;


        if (Array.isArray(rows) && rows.length > 0) {

          const tempArr = [];
          const miniConstructionChart = [];

          rows.forEach(row => {
            if (first) {
              let total = 0;

              statusFields.forEach(field => {
                total += row[field].length;
              });

              miniConstructionChart.push({
                x: row["date"],
                y: total
              });
              this.setState({
                miniConstructionChart,
                getConstructionChartingFirst: false
              });
            }

            const tempObj = {};

            statusArr.forEach(val => {

              tempObj["num" + val.status] = 0;

              statusFields.forEach(field => {
                tempObj["num" + val.status] += (Array.isArray(row[field]) && row[field].filter(c => c.status === val.status).length);
              });

              tempArr.push({
                name: val.name,
                x: row["date"],
                y: tempObj["num" + val.status]
              });

            });

          });

          this.setState({
            constructionChartData: tempArr,
            getConstructionCharting: false
          });
        }

        this.setState({
          constructionAllCount: all_count,
          getConstructionCharting: false,
          getConstructionChartingFirst: false
        });
      });
    }

    setFitChart = (values, first) => {
      const {formatMessage} = this.props.intl;
      const { startDate, endDate } = this.state;

      if (startDate.length !== endDate.length) return;

      let dateArr = [];

      let startDateM = moment(startDate);
      let endDateM = moment(endDate);

      if (startDate.length === 10) {
        for (let i = 0, len = endDateM.diff(startDateM, "days"); i <= len; i++) {
          dateArr.unshift(moment(endDate).subtract(i, "days").format("YYYY-MM-DD"));
        }
      }

      this.setState({
        getCharting: true
      });
      if (first) {
        this.setState({
          getChartingFistt: true
        });
      }
      getFitChart(values).then(res => {
        const { results } = res.data;
        let rows = [];
        let dateAct;

        if (!results.rows) {
          dateAct = "date";
          for (let i = 0, len = dateArr.length; i < len; i++) {
            let d = dateArr[i];
            let obj = results[d];

            if (!obj) {
              obj = {};
            }

            const {
              app_count,
              cargo_count,
              fit_count,
              project_count,
              temp_count,
              out_count
              // vip_count
            } = obj;

            rows.push({
              date: d.length > 7 ? d.substr(5) : d,
              app_count: app_count || 0,
              cargo_count: cargo_count || 0,
              fit_count: fit_count || 0,
              project_count: project_count || 0,
              temp_count: temp_count || 0,
              out_count: out_count || 0
              // vip_count: vip_count || 0
            });
          }
        } else {
          rows = results.rows;
        }


        if (Array.isArray(rows) && rows.length > 0) {
          const arr1 = [];
          const arr2 = [];
          const arr3 = [];
          const arr4 = [];
          const arr5 = [];
          const arr6 = [];
          // const arr7 = []
          const miniChart = [];

          rows.forEach(row => {
            if (first) {

              miniChart.push({
                x: row["date"],
                y: row["temp_count"] + row["project_count"] + row["fit_count"] + row["cargo_count"] + row["app_count"] + row["out_count"]
              });
              this.setState({
                miniChart,
                getChartingFistt: false
              });
            }
            if (dateAct) {
              arr1.push({
                name: formatMessage(messages.temp_card), //短期出入证
                y: row["temp_count"],
                x: row["date"]
              });
              arr2.push({
                name: formatMessage(messages.construction_workers), //施工人员
                y: row["project_count"],
                x: row["date"]
              });
              arr3.push({
                name: formatMessage(messages.fit), //普通访客
                y: row["fit_count"],
                x: row["date"]
              });
              arr4.push({
                name: formatMessage(messages.cargo), //装卸货
                y: row["cargo_count"],
                x: row["date"]
              });
              arr5.push({
                name: formatMessage(messages.book_visitor), //预约访客
                y: row["app_count"],
                x: row["date"]
              });
              arr6.push({
                name: formatMessage(messages.outside_staff), //外部员工
                y: row["out_count"],
                x: row["date"]
              });
              // arr7.push({
              //     name: formatMessage(messages.vip_visitor),   //vip访客
              //     y: row['vip_count'],
              //     x: row['date']
              // })
            } else {
              arr1.push({
                name: formatMessage(messages.temp_card), //短期出入证
                y: row["temporary_card"],
                x: row["date"]
              });
              arr2.push({
                name: formatMessage(messages.construction_workers), //施工人员
                y: row["project"],
                x: row["date"]
              });
              arr3.push({
                name: formatMessage(messages.fit), //普通访客
                y: row["fit"],
                x: row["date"]
              });
              arr4.push({
                name: formatMessage(messages.cargo), //装卸货
                y: row["cargo"],
                x: row["date"]
              });
              arr5.push({
                name: formatMessage(messages.book_visitor), //预约访客
                y: row["appointment"],
                x: row["date"]
              });
              arr6.push({
                name: formatMessage(messages.outside_staff), //外部员工
                y: row["out"],
                x: row["date"]
              });
              // arr7.push({
              //     name: formatMessage(messages.vip_visitor),   //vip访客
              //     y: row['vip_count'],
              //     x: row['date']
              // })
            }

          });

          this.setState({
            chartData: [...arr1, ...arr2, ...arr3, ...arr4, ...arr5, ...arr6],
            getCharting: false
          });
        }

        // this.setState({
        //     fitAllCount: all_count,
        //     fitEnterCount: enter_count
        // })
      });
    }

    componentDidMount() {

      if(_util.getStorage("userInfo")){//登录成功再进行
        this.setFitChart({type: 1}, true);

        this.setConstructionChart({type: 1}, true);

        this.setOrderChart({type: 1}, true);

        this.setCarryout({type: 1}, true);

        getFitAll().then(res => {
          const { all_count, enter_count } = res.data && res.data.results;

          this.setState({
            fitAllCount: all_count,
            fitEnterCount: enter_count
          });
        });

        //厂区通道
        visitInfo().then((res) => {
          if (res && res.data) {
            const { factory_and_location } = res.data && res.data.results;
            if (Array.isArray(factory_and_location) && factory_and_location.length > 0) {
              this.setState({
                location_list: factory_and_location
              });
            }
          }
        });
      }

    }

    onLocationChange = (value) => {

      this.setState({
        factory_id: value
      });
    }

    handleSelect = value => {
      this.setState({
        currentShowType: value,
        dayValue: null,
        monthValue: null,
        yearValue: null
      });
    }

    handleDayChange = value => {
      const { formatMessage } = this.props.intl;
      if (Array.isArray(value) && value.length > 0) {
        const firstDay = moment(value[0]);
        const secondDay = moment(value[1]);

        if (secondDay.subtract(29, "days").isAfter(firstDay)) {
          message.error(formatMessage(messages.maxday)); //最多选择30天！
          return;
        }

        this.setState({
          startDate: value[0].format("YYYY-MM-DD"),
          endDate: value[1].format("YYYY-MM-DD")
        });
      } else {
        this.setState({
          startDate: moment().subtract(14, "d").format("YYYY-MM-DD"),
          endDate: moment().format("YYYY-MM-DD")
        });
      }

      this.setState({
        dayValue: value
      });
    }

    handleMonthChange = value => {
      const { formatMessage } = this.props.intl;
      if (Array.isArray(value) && value.length > 0) {
        const firstMonth = moment(value[0]);
        const secondMonth = moment(value[1]);

        if (secondMonth.subtract(11, "months").isAfter(firstMonth)) {
          message.error(formatMessage(messages.maxmonth)); //最多选择12个月！
          return;
        }

        this.setState({
          startDate: value[0].format("YYYY-MM"),
          endDate: value[1].format("YYYY-MM")
        });
      }
      this.setState({
        monthValue: value
      });
    }

    handleYearChange = value => {
      const { formatMessage } = this.props.intl;
      if (Array.isArray(value) && value.length > 0) {
        const firstYear = moment(value[0]);
        const secondYear = moment(value[1]);

        if (secondYear.subtract(10, "years").isAfter(firstYear)) {
          message.error(formatMessage(messages.maxyear)); //最多选择10年！
          return;
        }

        this.setState({
          startDate: value[0].format("YYYY"),
          endDate: value[1].format("YYYY")
        });
      }

      this.setState({
        yearValue: value
      });
    }

    toSearch() {
      const {
        currentShowType,
        dayValue,
        monthValue,
        yearValue,
        factory_id,
        currentTab
      } = this.state;
      const { formatMessage } = this.props.intl;
      if (false) {
        if (currentTab === "fit") {
          this.setFitChart({type: 1});
        }

        if (currentTab === "construction") {
          this.setConstructionChart({type: 1});
        }
        return;
      } else {
        // if (currentShowType === 'day' && (!dayValue || (Array.isArray(dayValue) && dayValue.length === 0))) {
        //     message.error('请选择日期')
        //     return
        // }
        console.log(monthValue);
        if (currentShowType === "month" && (!monthValue || (Array.isArray(monthValue) && monthValue.length === 0))) {
          message.error(formatMessage(messages.reqmonth)); //请选择月份
          return;
        }
        if (currentShowType === "year" && (!yearValue || (Array.isArray(yearValue) && yearValue.length === 0))) {
          message.error(formatMessage(messages.reqyear)); //请选择年
          return;
        }

        const values = {};
        let type, start, end;

        if (currentShowType === "day") {

          if (Array.isArray(dayValue) && dayValue.length > 0) {
            start = dayValue[0].format("YYYY-MM-DD");
            end = dayValue[1].format("YYYY-MM-DD");
          } else {
            start = this.state.startDate,
            end = this.state.endDate;
          }
          type = 1;

        }

        if (currentShowType === "month") {
          type = 2;
          start = monthValue[0].format("YYYY-MM");
          end = monthValue[1].format("YYYY-MM");
        }

        if (currentShowType === "year") {
          type = 3;
          start = yearValue[0].format("YYYY");
          end = yearValue[1].format("YYYY");
        }


        values.type = type;
        values.factory_id = factory_id;
        values.start = start;
        values.end = end;


        if (currentTab === "fit") {
          this.setFitChart(values);
        }

        if (currentTab === "construction") {
          this.setConstructionChart(values);
        }
      }


    }

    handleTabChange = key => {
      this.setState({
        currentTab: key
      });
    }

    handleClickDate = () => {
      message.error("请先选择厂区!");
    }

    render() {
      let {location_list} = this.state;
      const {loading} = this.props;
      const { formatMessage } = this.props.intl;
      const salesExtra = (
        <div className={styles.salesExtraWrap} id='home-cascader'>
          {/* <span style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'inline-block',
                }}>
                <Cascader options={location_list}
                    onChange={this.onLocationChange}
                    placeholder="厂区地点"
                    style={{
                        marginRight: '5px',
                        marginTop: '10px',
                        width: '100px'
                    }}  />
                </span> */}

          <span style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-block",
            marginTop: "7px"
          }}>
            {/* {
                    this.state.factory_id
                    ?
                    null
                    :
                    <span style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 1
                    }} onClick={() => this.handleClickDate()}></span>
                } */}
            <Select
              allowClear
              showSearch
              onChange={value => this.onLocationChange(value)}
              placeholder={formatMessage(messages.location)} //厂区地点
              value={this.state.factory_id}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              style={{
                width: 100,
                marginRight: 5
              }}
            >
              {
                this.state.location_list.map((card, cardIndex) => {

                  return (
                    <Option
                      key={cardIndex}
                      value={card.id}>
                      {card.number}
                    </Option>
                  );
                })
              }
            </Select>

            <Select
              defaultValue='day'
              style={{
                marginRight: "5px"
              }}
              onSelect={value => this.handleSelect(value)}>
              <Option value='day'><FormattedMessage id="page.home.day" defaultMessage="按日显示" /></Option>
              <Option value='month'><FormattedMessage id="page.home.month" defaultMessage="按月显示" /></Option>
              <Option value='year'><FormattedMessage id="page.home.year" defaultMessage="按年显示" /></Option>
            </Select>
            {
              this.state.currentShowType === "day"
                ?
                <RangePicker
                  style={{width: 200}}
                  // onPanelChange={value => this.handleDayChange(value)}
                  onChange={value => this.handleDayChange(value)}
                  value={this.state.dayValue}
                />
                :
                null
            }
            {
              this.state.currentShowType === "month"
                ?
                <RangePicker
                  placeholder={[formatMessage(messages.start_month), formatMessage(messages.end_month)]} //['开始月份', '结束月份']
                  format="YYYY-MM"
                  mode={["month", "month"]}
                  style={{width: 200}}
                  value={this.state.monthValue}
                  onPanelChange={value => this.handleMonthChange(value)}
                  // onChange={value => this.handleMonthChange(value)}
                />
                :
                null
            }
            {
              this.state.currentShowType === "year"
                ?
                <RangePicker
                  placeholder={[formatMessage(messages.start_year), formatMessage(messages.end_year)]} //['开始年份', '结束年份']
                  format="YYYY"
                  mode={["year", "year"]}
                  style={{width: 200}}
                  value={this.state.yearValue}
                  onPanelChange={value => this.handleYearChange(value)}
                />
                :
                null
            }
          </span>
          <span style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-block"
          }}>
            <Button
              style={{marginLeft: "5px"}}
              type='primary'
              onClick={() => this.toSearch()}><FormattedMessage id="app.button.home.filter" defaultMessage="筛选" /></Button>
          </span>
          {
            this.state.chartData.length > 0 && this.state.constructionChartData.length > 0
              ?
              <span style={{
                position: "relative",
                overflow: "hidden",
                display: "inline-block",
                marginLeft: "10px",
                fontSize: "12px",
                cursor: "pointer"
              }} className={refreshStyles.refresh}
              onClick={() => this.toSearch()}>
                <Icon type="reload" style={{fontSize: "12px"}} /><FormattedMessage id="app.button.home.refresh" defaultMessage="刷新" />
              </span>
              :
              null
          }


        </div>
      );

      const topColResponsiveProps = {
        xs: 24,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 6
      };

      const { miniChart, miniConstructionChart, miniCarryoutChart, miniOrderChart } = this.state;

      return (
        <div style={{
          maxHeight: "calc( 100vh - 104px )",
          overflowY: "scroll",
          overflowX: "hidden"
        }}>
          <Content style={{padding: "16px 16px 0"}}>

            <Row gutter={16}>
              <Col {...topColResponsiveProps} style={{position: "relative", marginBottom: "16px"}}>
                <ChartCard
                  bordered={false}
                  title={<FormattedMessage id="page.home.visitor" defaultMessage="访客" />}
                  action={
                    <Tooltip
                      title={<FormattedMessage id="page.home.total_visitor" defaultMessage="访客总数" />}
                    >
                      <Icon type="info-circle-o"/>
                    </Tooltip>
                  }
                  total={numeral(this.state.fitAllCount).format("0,0")}
                  footer={<Field label={<FormattedMessage id="page.home.not_leaving" defaultMessage="尚未离厂  " />} value={numeral(this.state.fitEnterCount).format("0,0")}/>}
                  contentHeight={46}
                >
                  <MiniBar data={miniChart}/>
                </ChartCard>
                {
                  this.state.getChartingFistt
                    ?
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background: "rgba(255, 255, 255, .7)"
                    }}>
                      <Spin style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }} tip={<FormattedMessage id="page.home.loading" defaultMessage="数据加载中..." />} />
                    </div>

                    :
                    null
                }
              </Col>
              <Col {...topColResponsiveProps} style={{position: "relative", marginBottom: "16px"}}>
                <ChartCard
                  bordered={false}
                  title={<FormattedMessage id="page.home.construction" defaultMessage="施工" />}
                  action={
                    <Tooltip
                      title={<FormattedMessage id="page.home.total_construction" defaultMessage="施工总数" />}
                    >
                      <Icon type="info-circle-o"/>
                    </Tooltip>
                  }
                  total={numeral(this.state.constructionAllCount).format("0,0")}
                  footer={<Field label={<FormattedMessage id="page.home.construction_today" defaultMessage="今日施工  " />} value={numeral(miniConstructionChart.length > 0 ? miniConstructionChart[miniConstructionChart.length - 1].y : 0).format("0,0")}/>}
                  contentHeight={46}
                >
                  <MiniArea color="#975FE4" data={miniConstructionChart}/>
                </ChartCard>
                {
                  this.state.getConstructionChartingFirst
                    ?
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background: "rgba(255, 255, 255, .7)"
                    }}>
                      <Spin style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }} tip={<FormattedMessage id="page.home.loading" defaultMessage="数据加载中..." />} />
                    </div>
                    :
                    null
                }
              </Col>
              <Col {...topColResponsiveProps} style={{position: "relative", marginBottom: "16px"}}>
                <ChartCard
                  bordered={false}
                  title={<FormattedMessage id="page.home.workorder" defaultMessage="工单" />}
                  action={
                    <Tooltip title={<FormattedMessage id="page.home.work_count" defaultMessage="工单总数" />} >
                      <Icon type="info-circle-o"/>
                    </Tooltip>
                  }
                  total={numeral(this.state.orderAllCount).format("0,0")}
                  footer={<Field label={<FormattedMessage id="page.home.worktoday" defaultMessage="今日工单  " />} value={numeral(miniOrderChart.length > 0 ? miniOrderChart[miniOrderChart.length - 1].y : 0).format("0,0")}/>}
                  contentHeight={46}
                >
                  <MiniArea color="#975FE4" data={miniOrderChart}/>
                </ChartCard>
                {
                  this.state.getOrderCharting
                    ?
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background: "rgba(255, 255, 255, .7)"
                    }}>
                      <Spin style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }} tip={<FormattedMessage id="page.home.loading" defaultMessage="数据加载中..." />} />
                    </div>
                    :
                    null
                }
              </Col>
              <Col {...topColResponsiveProps} style={{position: "relative", marginBottom: "16px"}}>
                <ChartCard
                  bordered={false}
                  title={<FormattedMessage id="page.home.carryout" defaultMessage="物品携出" />}
                  action={
                    <Tooltip title={<FormattedMessage id="page.home.carryout_count" defaultMessage="物品携出总数" />} >
                      <Icon type="info-circle-o"/>
                    </Tooltip>
                  }
                  total={numeral(this.state.carryoutAllCount).format("0,0")}
                  footer={<Field label={<FormattedMessage id="page.home.carryout_today" defaultMessage="今日物品携出  " />} value={numeral(miniCarryoutChart.length > 0 ? miniCarryoutChart[miniCarryoutChart.length - 1].y : 0).format("0,0")}/>}
                  contentHeight={46}
                >
                  <MiniArea color="#975FE4" data={miniCarryoutChart}/>
                </ChartCard>
                {
                  this.state.getCarryoutCharting
                    ?
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background: "rgba(255, 255, 255, .7)"
                    }}>
                      <Spin style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }} tip={<FormattedMessage id="page.home.loading" defaultMessage="数据加载中..." />} />
                    </div>
                    :
                    null
                }
              </Col>
            </Row>

            <Card loading={loading} bordered={false} bodyStyle={{padding: 0}}>
              <div className={styles.salesCard}>
                <Tabs
                  tabBarExtraContent={salesExtra}
                  size="large"
                  tabBarStyle={{marginBottom: 24}}
                  onChange={key => this.handleTabChange(key)}>
                  <TabPane tab={<FormattedMessage id="page.home.fit" defaultMessage="访客" />} key="fit">
                    <Row>
                      <Col style={{paddingBottom: "5px", position: "relative"}}>
                        <StackBar height={295} title="" data={this.state.chartData} />
                        {
                          this.state.getCharting
                            ?
                            <div style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              bottom: 0,
                              left: 0,
                              background: "rgba(255, 255, 255, .7)"
                            }}>
                              <Spin style={{
                                position: "absolute",
                                top: "40%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                              }} tip={<FormattedMessage id="page.home.loading" defaultMessage="数据加载中..." />} />
                            </div>
                            :
                            null
                        }
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab={<FormattedMessage id="page.home.construction" defaultMessage="施工" />} key="construction">
                    <Row>
                      <Col style={{paddingBottom: "5px"}}>
                        <StackBar height={295} title="" data={this.state.constructionChartData} />
                        {
                          this.state.getConstructionCharting
                            ?
                            <div style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              bottom: 0,
                              left: 0,
                              background: "rgba(255, 255, 255, .7)"
                            }}>
                              <Spin style={{
                                position: "absolute",
                                top: "40%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                              }} tip={<FormattedMessage id="page.home.loading" defaultMessage="数据加载中..." />} />
                            </div>
                            :
                            null
                        }
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </Content>
        </div>
      );
    }
}

const HomePage = Form.create()(Home);

export default HomePage;
