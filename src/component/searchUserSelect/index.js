import React, { Component } from "react";
import {
  Card, Select, Spin
} from "antd";
import { SearchProjectUser } from "@apis/system/user";
import debounce from 'lodash/debounce';
import CommonUtil from "@utils/common";

let _util = new CommonUtil();

class SearchUserSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching:false,
      data:[],
      user:[],
      user_info:[],
    };
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  componentDidMount() {
    setTimeout(function () {
      let{user,user_info}=this.state;
      if(this.props.cc&&this.props.cc.length>0){
        user=this.props.cc.map(a=>a.id);
        user_info=this.props.cc.map(user => ({
          label: `${user.name}`,
          key: user.id,
        }));
        this.setState({user, user_info,});
      }
    }.bind(this),1000)
  }

  fetchUser = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') })
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        const data = body.data;
        // const data = body.data.map(user => ({
        //   text: `${user.org}  ${user.name}`,
        //   value: user.id,
        // }));
        this.setState({ data, fetching: false });
      });
  };

  handleChange = value => {
    console.log(value);
    let{user,user_info}=this.state;
    user=value.map(a=>a.key);
    user_info=value;
    this.setState({
      user,
      user_info,
      data: [],
      fetching: false,
    });
    this.props.getUser(user)
  };

  render () {
    const{dis_info}=this.props;
    const {fetching,data,user,user_info} = this.state;
    // console.log(user_info);
    return (
        <Select
          mode="multiple"
          labelInValue
          value={user_info}
          placeholder="输入名字搜索"
          notFoundContent={fetching ? <Spin size="small" /> : null}
          filterOption={false}
          onSearch={this.fetchUser}
          onChange={this.handleChange}
          style={{ width: '100%' }}
          disabled={dis_info}
        >
          {data&&data.map(d => (
            <Option key={d.id} value={d.id}>{d.org+" "+d.name}</Option>
          ))}
        </Select>
    )
  }
}

export default SearchUserSelect;