import React from "react";
import {Form, Button, Modal, Spin, message, Tree, Select} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {rolePost, rolePut, rolePermission, roleDetail} from "@apis/system/role";
import {SearchProjectUser} from "@apis/system/user";
import GoBackButton from "@component/go-back";
import {orgtypeInfo} from "@apis/system/orgtype";
import groupBy from "lodash/groupBy";
import {debounce} from "lodash";
import {interviewee} from "@apis/event/interviewee";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const {Option} = Select;

let _util = new CommonUtil();

@inject("menuState") @observer
class RoleAddForm extends React.Component {
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


  componentWillMount(){
    if(_util.getStorage('myadmin')&&_util.getStorage('myadmin') == true){
      console.log('mjk')
    }else{
      message.warning('仅限曼捷科管理员权限')
      this.props.history.replace('/')
    }
  }

  componentDidMount() {
    this.props.menuState.changeMenuCurrentUrl("/system/role/add");
    this.props.menuState.changeMenuOpenKeys("/system/role/add");

    //获取组织类型
    orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
      this.setState({typeoption: res.data})
    })


    const {id} = this.props.match.params;
    let params = {
      project_id: _util.getStorage('project_id')
    }

    //修改
    if (id) {
      roleDetail(id, params).then((res) => {
        const {permission, principal} = res.data
        this.setState({
          checkedKeys: permission.map(c => c+''),
          searchOptions: principal ? [principal] : [],
          ...res.data
        });
        if(res.data.org_type && res.data.org_type.id){
          const org_type_id = res.data.org_type.id;
          orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
            this.setState({typeoption: res.data});
            const typeoption = res.data;
            const currentPermission = typeoption.find(item => {
              return item.id == org_type_id
            })
            if(currentPermission.permission&&currentPermission.permission.length){
              //this.setState({checkedKeys:currentPermission.permission.map(c => c+'')});
              if(!currentPermission.permission_data){
                return
              }
              let data = []
              let permission = currentPermission.permission_data;
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
                this.setState({
                  treeData: targetArr
                });
        
            }
          })
        } 
       
      });
    }

    // let data = []
    // let permission = _util.getStorage('orgpermission') ? _util.getStorage('orgpermission') : _util.getStorage('permission')
    // let arr0 = Object.keys(permission)
    // let arr1 = Object.values(permission)
    // if (permission instanceof Object) {
    //     arr0.map((d, index) => {
    //         data.push({ id: '', name: arr0[index], children: arr1[index] })
    //     })
    // } else {
    //     permission.forEach(a => {
    //         data.push(getValue(a));
    //     });
    // }
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
    //   this.setState({
    //     treeData: targetArr
    //   });

   
    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/system/role");
    this.props.menuState.changeMenuOpenKeys("/system");
  }

  handleSubmit(e) {
    const {search_id} = this.state;
    const {formatMessage} = this.props.intl;
    e.preventDefault();
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let _this = this;
        const {formatMessage} = this.props.intl;
        const {checkedKeys } = this.state;
        const permission = this.checkPermissionKeys(checkedKeys).join(",");
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            console.log('0309',values)
            values.project_id = _util.getStorage('project_id')
            values.permission = permission;
            const { id } = _this.props.match.params;
            if (id) {
              rolePut(id, values).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
              return;
            }

            rolePost(values).then((res) => {
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

  checkPermissionKeys = (list) => {
    var r = /^\d+$/;
    var checkedKeys_list = [];
    if(list&&list.length){
      list.forEach(k => {
        if(r.test(k)){
          checkedKeys_list.push(parseInt(k))
        }
      })
    }
    return checkedKeys_list;
  }

  onCheck = (checkedKeys) => {
    this.setState({checkedKeys});
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  }

  renderTreeNodes = (data) => {
    const { checkedKeys} = this.state;
    if(checkedKeys&&checkedKeys.length){
      if (data && data instanceof Array) {
        return data.map((item) => {
          if (item.children) {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item} >
                {this.renderTreeNodes(item.children)}             
              </TreeNode>
            );
          }
          
          return <TreeNode {...item} />;
        });
      }
    }else{
      return null
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


  showPermission = (id) => {
    const {typeoption} = this.state;
    const currentPermission = typeoption.find(item => {
      return item.id == id
    })
    if(currentPermission.permission&&currentPermission.permission.length){
      this.setState({checkedKeys:currentPermission.permission});
      if(!currentPermission.permission_data){
        return
      }
      let data = []
      let permission = currentPermission.permission_data;
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
        this.setState({
          treeData: targetArr
        });

    }else{
      this.setState({checkedKeys:[]})
    }
  }

  check1 = (targetArr,checkedKeys) => {
    // checkedKeys.indexOf(children.key) > 0
    //console.log('0408',targetArr,checkedKeys)
    var tree_list = targetArr;
    targetArr.forEach((module,mIndex) => {
      //最大层级
      if(module.children){
        //系统管理，今日现场。。。。
        //console.log('0408',module.title)
        //第二层
        module.children.forEach((child,cIndex) => {
      
          if(checkedKeys.indexOf(child.key) > 0){
            console.log('0408','++++',child.title)
            tree_list[mIndex]['children'][cIndex] = child;
          }else{
            console.log('0408','----',child.title)
            //tree_list.splice(mIndex, 1);
            tree_list[mIndex]['children'] = [];
          }
        })
      }
    })
    
    this.setState({
      treeData: tree_list
    });
  }

  renderTreeNodes_ = (data) => {
    const { checkedKeys} = this.state;
    if(checkedKeys&&checkedKeys.length){
      if (data && data instanceof Array) {
        return data.map((item) => {
          if (item.children) {
            //有子集
              return (
                <TreeNode title={item.title} key={item.key} dataRef={item} disabled={item.fatherDisabled}>
                  {this.renderTreeNodes(item.children)}
                </TreeNode>
              );         
          }
          return <TreeNode {...item} />;
        });
      }
    }else{
      return null
    } 
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, treeData, name, name_en, desc, 
      desc_en, principal, permission, userdata,typeoption,org_type} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      }
    };

    const _this = this;
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10}
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
      {
        field: "org_type",
        type: "select",
        icon: "",
        value: org_type ? org_type.id : null,
        text: "组织类型",
        placeholder: "组织类型",
        options: typeoption,
        rules: [{required: true, message: "请选择组织类型"}],
        onSelect: (value) => this.showPermission(value),
      },
      {
        field: "name",
        type: "char",
        icon: "",
        value: name ? name : null,
        text: "角色名称",
        placeholder: "角色名称",
        rules: [{required: true, message: "请输入角色名称"}]
      },
      // {
      //   field: "name_en",
      //   type: "char",
      //   icon: "",
      //   value: name ? name : null,
      //   text: "Role Name",
      //   placeholder: "Role Name",
      // },
      {
        field: "desc",
        type: "textarea",
        icon: "",
        value: desc ? desc : null,
        text: "描述",
        placeholder: "描述",
        rules: []
      },
      // {
      //   field: "desc_en",
      //   type: "textarea",
      //   icon: "",
      //   value: desc ? desc : null,
      //   text: "Description",
      //   placeholder: "Description",
      //   rules: []
      // },
      {
        field: "tree",
        type: "tree",
        icon: "",
        value: null,
        text: "权限",
        placeholder: "",
        trees: treeData,
        expandedKeys: this.state.expandedKeys,
        autoExpandParent: this.state.autoExpandParent,
        onCheck: this.onCheck,
        onExpand: this.onExpand,
        checkedKeys: this.state.checkedKeys,
        selectedKeys: this.state.selectedKeys,
        renderTreeNodes: value => this.renderTreeNodes(value),
        rules: []
      },
    ]

    const { id } = this.props.match.params
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: '系统管理',
          url: '/system'
      },
      {
          name: '角色权限',
          url: '/system/role'
      },
      {
          name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />,
          url: '/system/role/add'
      }
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
          <Form onSubmit={this.handleSubmit}>
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

              <FormItem {...submitFormLayout}>
                <div style={{width: "100%", marginBottom: "20px"}}>
                  <Button type="primary" loading={confirmLoading}
                          style={{marginRight: "10px"}}
                          onClick={this.handleSubmit}
                  >
                    <FormattedMessage id="app.button.save" defaultMessage="保存"/>
                  </Button>
                  <GoBackButton props={this.props}/>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const RoleAdd = Form.create()(RoleAddForm);

export default injectIntl(RoleAdd);
