import React, { Fragment } from "react";
import {
  Form, Button, Modal, Spin, message, Upload, Icon, Row, Col, Checkbox, Tree, Select, Tag, Timeline, Input,Card
} from "antd";
import { inject, observer } from "mobx-react/index";
import debounce from "lodash/debounce";
import MyBreadcrumb from "@component/bread-crumb";
import { orgapplyDetail, applyAuditPost } from "@apis/system/orgapply";
import {turnstileInfo} from '@apis/system/organize';
import {orgtypeInfo} from "@apis/system/orgtype";
import CommonUtil from "@utils/common";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import {GetTemporaryKey} from "@apis/account/index"
import {SwitchProject} from "@apis/system/project";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import PicList from "@component/PicList";
import { SearchProjectUser } from "@apis/system/user";
import moment from 'moment'
const _util = new CommonUtil();
const {TextArea} = Input;
const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

@inject("menuState") @observer
class ApplyRoleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      name: "",
      tel: "",
      email: "",
      reason: "",
      remarks: "",
      operation_name: "",
      operation_time: "",
      status: 0,
      created_time: "",
      old_role: "",
      new_role: "",
      approve_list: [],
      info: {},
      worker_approve: [],
      application_approve: [],
      gatelist: [],
      trees: [],
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      source_list: [],
      search_data: [],
      treeData: [],
      turnstile_list:[],
      confirmLoading: false,
      avatar_url:'',
      fileList:[],
      file_loading:false,
      typeoption:[],
      org_type_id:''
    };
    this.lastFetchId = 0;
    this.onChange = this.onChange.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }
 

  componentDidMount() {
    const { id } = this.props.match.params;
    //获取项目权限
    SwitchProject({project_id: _util.getStorage('project_id') }).then(res => {
      if(res.data&&res.data.permission){
        console.log('123',res.data)
        let data = []
        let permission =res.data.permission;
        console.log('123',permission)
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
          if (obj.children&&obj.children.length) {
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

    //组织类型信息
    orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
      this.setState({typeoption: res.data})
    })

    turnstileInfo({project_id: _util.getStorage('project_id') }).then(res => {
      if(res.data&&res.data.length){
        this.setState({turnstile_list:res.data})
      }
    })

    orgapplyDetail(id, { project_id: _util.getStorage('project_id') }).then((res) => {
      this.setState({ 
        ...res.data,
      });
      //设置组织类型--权限
      if(res.data.org_type){
        var org_type = res.data.org_type;
        if(org_type.id){
          this.setState({org_type_id:org_type.id})
        }
      }
      //设置附件
      if(res.data&&res.data.source){      
        //初始化附件(腾讯云cos)
        var that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        const source_list = _util.switchToJson(res.data.source);
        if(source_list&&source_list.length){
            this.setState({file_loading:true})
            source_list.map((obj, index) => {
                const key = obj.url;
                var url = cos.getObjectUrl({
                    Bucket: 'ecms-1256637595',
                    Region: 'ap-shanghai',
                    Key:key,
                    Sign: true,
                }, function (err, data) {
                    if(data && data.Url){    
                        const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};             
                        const new_list = [...that.state.fileList,file_obj];
                        that.setState({fileList:new_list});
                        if(index == source_list.length - 1){
                            that.setState({file_loading:false});
                        }
                    }
                });
            });
        }            
      }
      this.props.menuState.changeMenuCurrentUrl("/system/org/application");
      this.props.menuState.changeMenuOpenKeys("/system");
    });
  }

  componentDidUpdate(prevProps) {
    const prevMatch = prevProps.match || { params: {} };
    const { id } = this.props.match.params;
    if (prevMatch.params.id !== id) {
      //window.history.go(0)
      orgapplyDetail(id, { project_id: _util.getStorage('project_id') }).then((res) => {     
        this.setState({ 
          ...res.data,
          fileList:[]
        });
         //设置附件
      if(res.data&&res.data.source){      
        //初始化附件(腾讯云cos)
        var that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        const source_list = _util.switchToJson(res.data.source);
        if(source_list&&source_list.length){
            this.setState({file_loading:true})
            source_list.map((obj, index) => {
                const key = obj.url;
                var url = cos.getObjectUrl({
                    Bucket: 'ecms-1256637595',
                    Region: 'ap-shanghai',
                    Key:key,
                    Sign: true,
                }, function (err, data) {
                    if(data && data.Url){    
                        const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};             
                        const new_list = [...that.state.fileList,file_obj];
                        that.setState({fileList:new_list});
                        if(index == source_list.length - 1){
                            that.setState({file_loading:false});
                        }
                    }
                });
            });
        }            
      }
      });
    }
  }

  //设置头像
  renderImg = (str) => {
    const fileList = this.switchToJson(str);
    if(fileList&&fileList.length){
        const key = fileList[0]['url'];
        var that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:key,
            Sign: true,
        }, function (err, data) {
            if(data && data.Url){    
                that.setState({avatar_url:data.Url});
            }
        });
        
    }       
}


  switchToJson = (str) => {
      return eval('(' + str + ')');
  }

  apply = () => {
    const {
      application_approve,
      audit_remarks,
      department_id,
      org_type_id
    } = this.state;
    const { formatMessage } = this.props.intl;


    // if (application_approve && application_approve.length < 1) {
    //   message.error('绿码申请审批人必填');
    //   return false;
    // }

    var checkedKeys = [];
    if(org_type_id){
      const {typeoption} = this.state;
      const currentPermission = typeoption.find(item => {
        return item.id == org_type_id
      })
      if(currentPermission.permission&&currentPermission.permission.length){
        checkedKeys = currentPermission.permission
      }
    }

    const { id } = this.props.match.params;
    const permission = this.checkPermissionKeys(checkedKeys).join(",");
    const data = {
      id,
      operation: 4,
      application_approve: application_approve.join(','),
      permission: permission,
      project_id: _util.getStorage('project_id'),
      turnstile:department_id&&department_id.length ? department_id.join(',') : '',
      remark:audit_remarks,
    }
    applyAuditPost(data).then((res) => {
      message.success('审批通过');
      this.props.history.push("/system/org/application");
    });

  }

  unApply = () => {
    const { audit_remarks } = this.state;
    const { formatMessage } = this.props.intl;
    if (audit_remarks && audit_remarks >= 200) {
      message.error('审批备注最大长度不能超过200字节');
      return false;
    }

    const { id } = this.props.match.params;

    applyAuditPost({
      id: id,
      operation: 5,
      remarks: audit_remarks,
      project_id: _util.getStorage('project_id')
    }).then((res) => {
      message.success('审批未通过');
      this.props.history.push("/system/org/application");
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

  approveList = (approve_list) => {
    this.setState({
      approve_list
    });
  }

  handleRemarksChange = e => {
    this.setState({
      audit_remarks: e.target.value
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys, info) => {
    const { trees } = this.state
    const parent = checkedKeys.filter(item => {
      for (let i = 0; i < trees.length; i++) {
        if (trees[i].id == item) {
          return true
        }
      }
    })

    let result = []
    checkedKeys.map((value, index) => {
      if (parent.indexOf(value) < 0) {
        result.push(value)
      }
    })
    this.setState({ checkedKeys: result });
  }

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  }

  // renderTreeNodes = data => {
  //   if (data && data.length) {
  //     return data.map(item => {
  //       if (item.children) {
  //         return (
  //           <TreeNode title={item.name} key={item.id} dataRef={item}>
  //             {this.renderTreeNodes(item.children)}
  //           </TreeNode>
  //         );
  //       }
  //       return <TreeNode key={item.id} title={item.name} dataRef={item} />;
  //     });
  //   }
  // }

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

  fetchUser = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ search_data: [], fetching: true, search_info: "", search_id: null });
    SearchProjectUser({ q: value, project_id: _util.getStorage('project_id') }).then((res) => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const search_data = res.data.map(user => ({
        name: user.name,
        org:user.org,
        tel: user.tel,
        id_num: user.id_num,
        value: user.text,
        text: user.text,
        id: user.id
      }));
      this.setState({ search_data, fetching: false });
    });
  }

  onChange = (value,field) => {
    console.log(value,field)
    this.setState({
      [field]: value
    });
  }

  fileUpload  = (info) => {
    const that = this;
    var cos = _util.getCos(null,GetTemporaryKey);
    cos.putObject({
      Bucket: 'ecms-1256637595',
      Region: 'ap-shanghai',
      Key:`source/${info.file.uid}`,
      Body: info.file,
      onProgress: function (progressData) {
          console.log('上传中', JSON.stringify(progressData));
      },
    }, function (err, data) {
        if(data&&data.Location){
          //上传成功
          var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:`source/${info.file.uid}`,
            Sign: true,
          }, function (err, data) {
              if(data && data.Url){
                const {fileList} = that.state;
                const newFile  = {
                  uid: -(fileList&&fileList.length ? fileList.length + 1 :1),
                  name: info.file.name,
                  status: 'done',
                  url:data.Url,
                  cosKey: `source/${info.file.uid}`,
                };
                const new_fileList = [...fileList,newFile]
                that.setState({fileList:new_fileList});
              }
          });
        }
    });
  }

  //删除已上传文件
handleRemove = (info) => {
const {fileList} = this.state;
const new_fileList = fileList.filter(file => {
  return file.uid != info.uid
})
this.setState({fileList:new_fileList})
}

  render() {
    const {
      username,
      real_name,
      tel, phone,
      email,
      reason,
      remarks,
      status,
      status_desc,
      operation_name,
      operation_time,
      created_time,
      old_role,
      new_role,
      role,
      role_name,
      audit_info_list,
      next,
      info,
      trees,
      source_list,
      treeData,
      company,
      org_type,
      address,
      desc,
      name,
      fileList,
      turnstile_list,
      audit_remarks,
      confirmLoading,
      avatar_url
    } = this.state;
    const formItemLayout = {
      'labelCol': {
          'xs': {'span': 24},
          'sm': {'span': 7}
      },
      'wrapperCol': {
          'xs': {'span': 24},
          'sm': {'span': 12}
      }
  }
    const auditLists = [];
    if (Array.isArray(audit_info_list) && audit_info_list.length > 0) {
      auditLists.push({
        text: <FormattedMessage id="page.construction.staff.auditInfo" defaultMessage="审批流程" />,
        value: <Timeline style={{ margin: "5px auto -25px" }}>
          {
            audit_info_list.map((flow, flowIndex) => {
              return (
                <Timeline.Item
                  key={flowIndex}>
                  <div style={{ fontSize: "12px" }}><FormattedMessage id="page.system.staff.operator" defaultMessage="操作人" />:&nbsp;{flow.operation_name}</div>
                  <div style={{ fontSize: "12px" }}><FormattedMessage id="page.system.accessType.operate" defaultMessage="操作" />:&nbsp;{flow.status}</div>
                  <div style={{ fontSize: "12px" }}><FormattedMessage id="page.system.staff.time" defaultMessage="时间" />:&nbsp;{flow.operation_time}</div>
                  {
                    flowIndex > 0
                      ?
                      <div style={{ fontSize: "12px" }}><FormattedMessage id="page.construction.monitor.remark" defaultMessage="备注" />:&nbsp;{flow.remarks ? flow.remarks : "无"}</div>
                      :
                      null
                  }
                </Timeline.Item>
              );
            })
          }
          {
            Array.isArray(next) && next.length > 0
              ? next.map((value, index) => {
                return (
                  <Timeline.Item
                    color="#cecece"
                    key={index} >
                    <div style={{ fontSize: "12px" }}><FormattedMessage id="page.system.staff.operator" defaultMessage="操作人" />:&nbsp;{value.name}</div>
                    <div style={{ fontSize: "12px" }}><FormattedMessage id="page.system.accessType.operate" defaultMessage="操作" />:&nbsp;{<FormattedMessage id="app.home.status.wait_approve" defaultMessage="待审批" />}</div>
                  </Timeline.Item>
                );
              })
              : null
          }
        </Timeline>
      });
    }

    const operation = [];

    if (status === 3) {
      // operation.push({
      //   text: '红码审批人',
      //   value: <Select
      //     allowClear
      //     mode='multiple'
      //     style={{ width: 300 }}
      //     onChange={(value) => this.onChange(value, 'worker_approve')}
      //     showSearch
      //     placeholder={<FormattedMessage id="page.system.accessType.choosePlz" defaultMessage="请选择" />}
      //     value={this.state.worker_approve || undefined}
      //     optionFilterProp="children"
      //     getPopupContainer={triggerNode => triggerNode.parentNode}
      //     // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      //     filterOption={false}
      //     onSearch={this.fetchUser}
      //   >
      //     {
      //       this.state.search_data.map(d => {
      //         return <Option key={d.id} title={d.name}>{d.name}</Option>
      //       })
      //     }
      //   </Select>
      // })
      // operation.push({
      //   text: '绿码申请审批人',
      //   value: <Select
      //     allowClear
      //     mode='multiple'
      //     style={{ width: 300 }}
      //     onChange={(value) => this.onChange(value, 'application_approve')}
      //     showSearch
      //     placeholder={<FormattedMessage id="page.system.accessType.choosePlz" defaultMessage="请选择" />}
      //     value={this.state.application_approve || undefined}
      //     optionFilterProp="children"
      //     getPopupContainer={triggerNode => triggerNode.parentNode}
      //     // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      //     filterOption={false}
      //     onSearch={this.fetchUser}
      //   >
      //     {
      //       this.state.search_data.map(d => {
      //         return <Option key={d.id} title={d.name}>{d.name}</Option>
      //       })
      //     }
      //   </Select>
      // })

      operation.push({
        text: '入场闸机',
        value: <Select
          allowClear
          mode={'multiple'}
          style={{ width: 300 }}
          onChange={(value) => this.onChange(value,'department_id')}
          showSearch
          placeholder={<FormattedMessage id="page.system.accessType.choosePlz" defaultMessage="请选择" />}
          value={this.state.department_id || undefined}
          optionFilterProp="children"
          getPopupContainer={triggerNode => triggerNode.parentNode}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {
            this.state.turnstile_list.map(d => {
              return <Option key={d.id} title={d.name}>{d.name}</Option>
            })
          }
        </Select>
      })
      // operation.push({
      //   text: '组织权限',
      //   value: <Tree
      //     checkable
      //     expandedKeys={this.state.expandedKeys}
      //     autoExpandParent={this.state.autoExpandParent}
      //     onCheck={this.onCheck}
      //     checkedKeys={this.state.checkedKeys}
      //     onExpand={this.onExpand}
      //     onSelect={this.onSelect}
      //     selectedKeys={this.state.selectedKeys}
      //   >
      //     {this.renderTreeNodes(treeData)}
      //   </Tree>
      // })
    }

    const tableData = [
      {
        text: <FormattedMessage id="page.system.applyRole.company" defaultMessage="组织名称" />,
        value: _util.getOrNull(company)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.type" defaultMessage="组织类型" />,
        value: _util.getOrNull(org_type)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.address" defaultMessage="组织地址" />,
        value: _util.getOrNull(address)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.desc" defaultMessage="组织描述" />,
        value: _util.getOrNull(desc)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.name" defaultMessage="联系人" />,
        value: _util.getOrNull(name)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.phone" defaultMessage="联系人手机号" />,
        value: _util.getOrNull(phone)
      },

      {
        text: <FormattedMessage id="page.system.applyRole.applyTime" defaultMessage="申请时间" />,
        value: _util.getOrNull(created_time)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.status" defaultMessage="状态" />,
        value: status ? <Tag color={_util.getColor(status)} >{_util.genStatusDesc(status)}</Tag> : null
      },
      // {
      //     text: '头像',
      //     value: avatar_url?<img src={avatar_url} style={{height:'100px'}}></img>:''
      // },
      {
        text: <FormattedMessage id="page.system.accessType.file" defaultMessage="附件" />,
        value: fileList&&fileList.length?<Upload
                  fileList={fileList}
                ></Upload>:''
      },
      ...auditLists,
      ...operation
    ];

    const bread = [
      {
        name: <FormattedMessage id="menu.homepage" defaultMessage="首页" />,
        url: "/"
      },
      {
        name: <FormattedMessage id="page.system.accessType.systemManage" defaultMessage="系统管理" />
      },
      {
        name: <FormattedMessage id="page.system.accessType.orgApplyAudit" defaultMessage="组织审批" />,
        url: "/system/org/application"
      },
      {
        name: <FormattedMessage id="app.page.text.approval" defaultMessage="审批" />
      }
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="page.system.action.detail" defaultMessage="详情" />} data={tableData} />
          {
            status == 3 ?
              <Card 
                title={<FormattedMessage id="app.table.column.operate" defaultMessage="操作"/>}
                style={{margin: '0 auto 10px', width: '80%'}}>
                <Form>
                    <FormItem {...formItemLayout} label={<FormattedMessage id="page.construction.projectAudit.audit1" defaultMessage="当前审批人"/>}>
                        <span>{_util.getStorage('userInfo') ? _util.getStorage('userInfo').name : ''}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="page.construction.projectAudit.audit2" defaultMessage="审批备注"/>}
                    >
                        <TextArea
                            value={audit_remarks}
                            onChange={e => this.handleRemarksChange(e)}
                        />
                    </FormItem>
                    <FormItem
                        style={{display: 'flex', justifyContent: 'center'}} >
                        <Button type="primary" onClick={this.apply} loading={confirmLoading}
                                style={{marginRight: '10px'}}>
                            <FormattedMessage id="app.button.approve" defaultMessage="通过" />
                        </Button>
                        <Button type="danger" onClick={this.unApply} loading={confirmLoading}
                                style={{marginRight: '10px', bgColor: '#f5222d'}}>
                            <FormattedMessage id="app.button.unpass" defaultMessage="不通过" />
                        </Button>
                        <GoBackButton props={this.props}/>
                    </FormItem>
                </Form>
            </Card> :''
          }
          {
             status == 3 ? '' : <GoBackButton style={{ display: "block", margin: "0 auto" }} props={this.props} noConfirm />
          }
          
         
        </div>
      </div>
    );
  }
}

export default injectIntl(ApplyRoleDetail);
