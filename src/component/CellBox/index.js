import React from "react";
import {
  Icon, Input, Select, DatePicker, InputNumber, Cascader, TimePicker, message, Spin, Checkbox, Row, Col, Switch, Tag
} from "antd";
import ViewPwd from "@component/ViewPwd";
import moment from "moment";

const {TextArea} = Input;
const {Option} = Select;

class CellBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  fetchUser = (value) => {
    console.log("child"+value);
    this.props.onSearch(value);
  }

  searchConcat(d) {
    const { name, tel, department, id_num, phone } = d;
    let temp = "";

    if (name) {
      temp += name;
    }
    if (department) {
      temp += ("-" + department);
    }
    if (tel) {
      temp += ("-" + tel);
    }
    if (id_num) {
      temp += ("-" + id_num);
    }
    if (phone) {
      temp += ("-" + phone);
    }
    return temp;
  }

  render() {
    const _this = this;
    const {
      field,
      type,
      icon,
      value,
      text,
      placeholder,
      disabled,
      mode,
      options,
      fetching,
      rules
    } = _this.props;
    let prefix = "";
    if (icon) {
      prefix = <Icon type={icon} style={{color: "rgba(0,0,0,.25)"}}/>;
    }
    return (
      <div>
        {
          type == "init"
          &&
          <InputNumber placeholder={placeholder} prefix={prefix}/>
        }
        {
          type == "textarea"
          &&
          <TextArea placeholder={placeholder}/>
        }
        {
          type == "char"
          &&
          <Input
            hidenum={!!((field === "id_num" || field === "phone"))}
            disabled={disabled}
            prefix={prefix}
            placeholder={placeholder}
            autoComplete={"off"}
            onChange={
              _this && _this.props && ((_this.props.location && _this.props.location.pathname.search("appointment/fit") > -1 || (_this.props.location && _this.props.location.pathname.search("appointment/cargo") > -1)) && (typeof _this.changeForm === "function"))
                ? e => _this.changeForm(e) : null}/>
        }
        {
          type == "password"
          &&
          <ViewPwd inputName={field} placeholder={placeholder} disabled={disabled}
            pwd={_this.state.password ? _this.state.password : value} onChange={(e) => _this.onChange(e)}/>
        }
        {
          type == "email"
          &&
          <Input type='email' prefix={prefix} placeholder={placeholder}/>
        }
        {
          type == "datetime"
          &&
          <DatePicker
            placeholder="" showTime
            disabledDate={(current) => moment(current).isBefore(moment().format("YYYY-MM-DD"))}
            format="YYYY-MM-DD HH:mm:ss" style={{width: "100%"}}/>
        }
        {
          type == "time"
          &&
          <TimePicker
            placeholder=""
            format="HH:mm"
            style={{width: "100%"}}
          />
        }
        {
          type == "date"
          &&
          <DatePicker
            onChange={
              delayChange ?
                _this.onDateChange :
                (dateIndex === dateIndex ? _this.onDateChangeEnd : _this.onDateChangeStart)}
            onOpenChange={dateIndex === dateIndex ? _this.onDateOpenChange : () => {
            }}
            placeholder={placeholder}
            disabledDate={typeof _this.disabledEndDate === "function" ? _this.disabledEndDate : (current) => moment(current).isBefore(moment().format("YYYY-MM-DD"))}
            format="YYYY-MM-DD" style={{width: "100%"}}
          />
        }
        {
          type == "select"
          &&
          <Select disabled={disabled ? true :
            (!_this.state.hideDepartment ? false : true && (field === "department_id"))
          }
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          allowClear
          placeholder={placeholder}
          notFoundContent="暂无数据"
          mode={mode ? mode : ""}
          onSelect={(option) => {
            if (_this.props.location && _this.props.location.pathname.indexOf("/system/user") > -1 && field === "cost_center_id") {
              if (typeof _this.handleCostCenter === "function") {
                _this.handleCostCenter(option);
              }
              return;

            }

            if (_this.props.location && _this.props.location.pathname === "/info" && field === "cost_center_id") {
              if (typeof _this.handleCostCenter === "function") {
                _this.handleCostCenter(option);
              }
              return;

            }

            if (field !== "cate_id") return;
            let person;
            _this.state.formData.content.forEach((con, index) => {
              if (con.field === "cate_id") {
                con.options.forEach((opt, index) => {
                  if (opt.id === option) {
                    person = opt.person;
                  }
                });
              }
              if (con.field === "touser_name") {
                con.autoPlace = person;
              }
            });
          }}
          >
            {
              options.map((option, index) => {

                return (<Option key={option.id} value={option.id} disabled={option.disabled}>{option.name}</Option>);
              })
            }
          </Select>
        }
        {
          type == "search"
          &&
          <Select
            allowClear
            showSearch
            placeholder={placeholder}
            notFoundContent={fetching ? <Spin size="small"/> : "暂无数据"}
            filterOption={false}
            onSearch={_this.fetchUser}

            // onSelect={_this.handleChange}
            style={{width: "100%"}}
            disabled={!!(_this.props.location && _this.props.location.pathname.search("blanklist/edit") > -1)}

          >
            {options && options.map((d, index) => {
              return <Option
                title={this.searchConcat(d)}
                key={d.id}
                // value={d.id}
                // value={d.value}
              >
                {this.searchConcat(d)}
                {/* {d.value} */}
                {/* {
                 `姓名: ${d.text}${d.tel ? ';座机: ' + d.tel : ''}${d.department ? ';部门: ' + d.department : ''}${d.id_num ? ';证件号码; ' + d.id_num : ''}`
                 } */}
              </Option>;
            })}


          </Select>
        }
        {
          type == "cascader"
          &&
          <Cascader
            options={options}
            fieldNames={
              options.length > 0 && options[0].hasOwnProperty("id") && options[0].hasOwnProperty("name")
                ?
                {
                  label: "name",
                  value: "id"
                }
                :
                {
                  label: "label",
                  value: "value",
                  children: "children"
                }
            }
            // onChange={(value, selectedOptions) => {console.log(value)}}
            placeholder={placeholder}
            onChange={_this.onLocationChange}
          />
        }
        {
          type == "checkbox"
          &&
          <Checkbox.Group style={{width: "100%"}}>
            <Row>
              {
                options.map((d, index) => {
                  return (
                    <Col span={8} key={index}>
                      <Checkbox value={d.id} key={index} disabled={d.disabled}>{d.name} {d.desc}</Checkbox>
                    </Col>
                  );
                })
              }
            </Row>
          </Checkbox.Group>
        }
        {
          type == "switch"
          &&
          <Switch defaultChecked={value}/>
        }

      </div>
    );
  }
}

export default CellBox;
