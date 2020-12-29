import React from "react";
import { Form, Button, Modal, Spin, message, Tree, Select } from "antd";
import { inject, observer } from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import { MeetingTypePost, MeetingTypePut, MeetingTypeDetail } from "@apis/meeting/type";
import { SearchProjectUser } from "@apis/system/user";
import GoBackButton from "@component/go-back";
import groupBy from "lodash/groupBy";
import { debounce } from "lodash";
import { interviewee } from "@apis/event/interviewee";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import translation from '../translation'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const { Option } = Select;

let _util = new CommonUtil();

@inject("menuState") @injectIntl
class TypeAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      searchOptions: [],
      org: _util.getStorage('userdata').org
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }

  componentDidMount() {

    const { id } = this.props.match.params;

    let params = {
      project_id: _util.getStorage('project_id')
    }
    if (id) {
      MeetingTypeDetail(id, params).then((res) => {
        const { owner } = res.data
        this.setState({
          // checkedKeys: permission.map(c => c + ''),
          searchOptions: owner ? owner : [],
          ...res.data
        });
        this.props.menuState.changeMenuCurrentUrl("/meeting/type");
        this.props.menuState.changeMenuOpenKeys("/meeting");
      });
    }

    let data = []
    let permission = _util.getStorage('orgpermission') ? _util.getStorage('orgpermission') : _util.getStorage('permission')
    let arr0 = Object.keys(permission)
    let arr1 = Object.values(permission)
    if (permission instanceof Object) {
      arr0.map((d, index) => {
        data.push({ id: '', name: arr0[index], children: arr1[index] })
      })
    } else {
      permission.forEach(a => {
        data.push(getValue(a));
      });
    }
    let targetArr = []
    const getValue = (obj) => {
      const tempObj = {};
      tempObj.title = obj.name;
      tempObj.key = obj.id;
      if (obj.children) {
        tempObj.children = [];
        obj.children.map(o => {
          tempObj.children.push(getValue(o))
        });
      }
      return tempObj;
    };
    data.forEach(a => {
      targetArr.push(getValue(a));
    });

    console.log(targetArr)

    this.setState({
      treeData: targetArr
    });

    // rolePermission({project_id: _util.getStorage('project_id')}).then((res) => {
    //   let data = []
    //   let arr0 = Object.keys(res.data)
    //   let arr1 = Object.values(res.data)
    //   if(res.data instanceof Object){
    //     arr0.map((d,index) => {
    //       data.push({id: '', name: arr0[index], children: arr1[index]})
    //     })
    //   }else{
    //     res.data.forEach(a => {
    //       data.push(getValue(a));
    //     });
    //   }

    //   let targetArr = []
    //   const getValue = (obj) => {
    //     const tempObj = {};
    //     tempObj.title = obj.name;
    //     tempObj.key = obj.id;
    //     if (obj.children) {
    //       tempObj.children = [];
    //       obj.children.map(o => {
    //         tempObj.children.push(getValue(o))
    //       });
    //     }
    //     return tempObj;
    //   };
    //   data.forEach(a => {
    //     targetArr.push(getValue(a));
    //   });

    //   console.log(targetArr)

    //   this.setState({
    //     treeData: targetArr
    //   });
    // });
    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/meeting/type");
    this.props.menuState.changeMenuOpenKeys("/meeting");
  }

  handleSubmit(e) {
    const { search_id } = this.state;
    const { formatMessage } = this.props.intl;
    e.preventDefault();
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let _this = this;
        const { formatMessage } = this.props.intl;

        let params = {
          project_id: _util.getStorage('project_id'),
          name: values.name,
          abbr: values.abbr,
          owner: values.owner.join(',')
        }
        // return
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            // values.permission = _this.state.checkedKeys.filter(k => k && k.indexOf("-") < 0).join(",");
            // values.permission = _this.state.checkedKeys.filter(k => k.indexOf("$") < 0).join(",");
            // values.search_id = search_id;
            const { id } = _this.props.match.params;
            if (id) {
              MeetingTypePut(id, params).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
              return;
            }

            MeetingTypePost(params).then((res) => {
              message.success(formatMessage(translation.saved));
              _this.props.history.goBack();
            });
          },
          onCancel() {
          }
        });
      }
      this.setState({
        confirmLoading: false
      });
    });
  }

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  }

  renderTreeNodes = (data) => {
    if (data && data instanceof Array) {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} />;
      });
    }
  }

  handleApprovalPerson = value => {
    if (value) {
      this.setState({
        search_id: value
      });
    }
  }
  fetchUser = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    this.setState({
      fetching: true,
      searchOptions: []
    });
    SearchProjectUser({
      q: value,
      project_id: _util.getStorage('project_id')
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const searchOptions = res.data.map(user => ({
        name: user.name,
        value: user.name,
        text: user.name,
        id: user.id,
        org:user.org,
        tel: user.tel,
        phone: user.phone
      }));
      this.setState({
        searchOptions,
        fetching: false
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { confirmLoading, spinLoading, treeData, name, name_en, desc, desc_en, principal, permission, userdata, searchOptions, abbr, owner } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    // const treeData = formData.treeData;

    const _this = this;
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };

    // let trees = [];
    // const treeDataGroup = groupBy(treeData, t => t.menu_id);
    // Object.keys(treeDataGroup).forEach((k, index) => {
    //   trees.push({
    //     key: `$${index}`,
    //     title: treeDataGroup[k][0].menu_name,
    //     children: treeDataGroup[k]
    //   });
    // });

    const formData = [
      // {
      //   field: "org",
      //   type: "select",
      //   icon: "",
      //   value: null,
      //   text: "组织",
      //   placeholder: "组织",
      //   options: [],
      //   rules: [{required: true, message: "请选择组织"}]
      // },
      {
        field: "name",
        type: "char",
        icon: "",
        value: name ? name : null,
        text: "类型名称",
        placeholder: "类型名称",
        rules: [{ required: true, message: "请输入类型名称" }]
      },
      {
        field: "abbr",
        type: "char",
        icon: "",
        value: abbr ? abbr : null,
        text: "缩写",
        placeholder: "缩写",
        // rules: [{required: true, message: "请输入"}]
      },
      {
        field: "owner",
        type: "search",
        mode: "multiple",
        icon: "",
        value: owner ? owner.map(d => { return d.id + '' }) : null,
        // value: '',
        text: "所有人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: searchOptions,
        fetchUser: (value) => this.fetchUser(value),
        rules: [{ required: true, message: "请选择所有人" }]
      },
      // {
      //   field: "desc",
      //   type: "textarea",
      //   icon: "",
      //   value: desc ? desc : null,
      //   text: "描述",
      //   placeholder: "描述",
      //   rules: []
      // },
      // {
      //   field: "tree",
      //   type: "tree",
      //   icon: "",
      //   value: null,
      //   text: "权限",
      //   placeholder: "",
      //   trees: treeData,
      //   expandedKeys: this.state.expandedKeys,
      //   autoExpandParent: this.state.autoExpandParent,
      //   onCheck: this.onCheck,
      //   onExpand: this.onExpand,
      //   checkedKeys: this.state.checkedKeys,
      //   selectedKeys: this.state.selectedKeys,
      //   renderTreeNodes: value => this.renderTreeNodes(value),
      //   rules: []
      // },
      // {
      //   field: "principal",
      //   type: "search",
      //   icon: "",
      //   value: principal ? principal.id+'' : null,
      //   text: "角色审批人",
      //   placeholder: "根据姓名、手机、邮箱搜索项目用户",
      //   options: this.state.searchOptions,
      //   rules: [{required: true, message: "请选择角色审批人！"}]
      // },
    ]

    const { id } = this.props.match.params
    const bread = [
      {
        name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页" />,
        url: '/'
      },
      {
        name: <FormattedMessage id="app.page.bread.meeting" defaultMessage="会议管理" />
      },
      {
        name: <FormattedMessage id="app.page.bread.meetingtype" defaultMessage="会议类型" />,
        url: '/meeting/type'
      },
      {
        name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改" /> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              {/* <FormItem {...formItemLayout}
              label={'组织'}
            >
                <span>{this.state.userdata}</span>

            </FormItem> */}

              {
                formData ? formData.map((item, index) => {
                  return (
                    item.type === "tree" ?
                      <FormItem
                        required
                        key={index}
                        label={item.text}
                        extra={item.extra}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {
                          item.value
                            ?
                            getFieldDecorator(item.field, {
                              initialValue: item.value,
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                            :
                            getFieldDecorator(item.field, {
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                        }
                      </FormItem>
                      :
                      <FormItem
                        key={index}
                        label={item.text}
                        extra={item.extra}
                        hasFeedback
                        {...formItemLayout}
                      >
                        {
                          item.value
                            ?
                            getFieldDecorator(item.field, {
                              initialValue: item.value,
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                            :
                            getFieldDecorator(item.field, {
                              rules: item.rules
                            })(
                              _util.switchItem(item, _this)
                            )
                        }
                      </FormItem>
                  );
                }) : null
              }

              {/* <FormData data={formData} form={this.props.form} layout={formItemLayout} /> */}
              {/*{*/}
              {/*formData ? formData.map((item, index) => {*/}
              {/*return (*/}
              {/*<FormItem*/}
              {/*key={index}*/}
              {/*label={item.text}*/}
              {/*hasFeedback*/}
              {/*{...formItemLayout}*/}
              {/*>*/}
              {/*{*/}
              {/*item.value*/}
              {/*?*/}
              {/*getFieldDecorator(item.field, {*/}
              {/*initialValue: item.value,*/}
              {/*rules: item.rules*/}
              {/*})(*/}
              {/*_util.switchItem(item, _this)*/}
              {/*)*/}
              {/*:*/}
              {/*getFieldDecorator(item.field, {*/}
              {/*rules: item.rules*/}
              {/*})(*/}
              {/*_util.switchItem(item, _this)*/}
              {/*)*/}
              {/*}*/}
              {/*</FormItem>*/}
              {/*);*/}
              {/*}) : null*/}
              {/*}*/}


              {/*<FormItem {...formItemLayout}*/}
              {/*label={<FormattedMessage id="page.system.reason.permission" defaultMessage="权限"/>}>*/}
              {/*<Tree*/}
              {/*checkable*/}
              {/*expandedKeys={this.state.expandedKeys}*/}
              {/*autoExpandParent={this.state.autoExpandParent}*/}
              {/*onCheck={this.onCheck}*/}
              {/*checkedKeys={this.state.checkedKeys}*/}
              {/*onExpand={this.onExpand}*/}
              {/*onSelect={this.onSelect}*/}
              {/*selectedKeys={this.state.selectedKeys}*/}
              {/*>*/}
              {/*{this.renderTreeNodes(trees)}*/}
              {/*</Tree>*/}
              {/*</FormItem>*/}
              {/*<FormItem*/}
              {/*label={<FormattedMessage id="page.system.reason.roleAudit" defaultMessage="角色审批人"/>}*/}
              {/*hasFeedback*/}
              {/*{...formItemLayout}*/}
              {/*required*/}
              {/*>*/}
              {/*<Select*/}
              {/*// showArrow*/}
              {/*showSearch*/}
              {/*// allowClear*/}
              {/*optionFilterProp="children"*/}
              {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
              {/*notFoundContent={this.state.fetching ? <Spin size="small"/> :*/}
              {/*<FormattedMessage id="global.nodata" defaultMessage="暂无数据"/>}*/}
              {/*placeholder={<FormattedMessage id="page.system.reason.searchPlz" defaultMessage="请搜索"/>}*/}
              {/*onSearch={this.fetchUser}*/}
              {/*onChange={this.handleApprovalPerson}*/}
              {/*value={this.state.search_id}*/}
              {/*>*/}
              {/*{*/}
              {/*this.state.searchOptions.map(s => {*/}
              {/*return <Option key={s.id} title={_util.searchConcat(s)}>{_util.searchConcat(s)}</Option>;*/}
              {/*})*/}
              {/*}*/}
              {/*</Select>*/}
              {/*</FormItem>*/}

              <FormItem {...submitFormLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button type="primary" loading={confirmLoading}
                    style={{ marginRight: "10px" }}
                    onClick={this.handleSubmit}
                  >
                    <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                  <GoBackButton props={this.props} />
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const TypeAdd = Form.create()(TypeAddForm);

export default TypeAdd;
