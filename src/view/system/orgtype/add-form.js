import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input,Tree,Card,Icon,Row,
  Col,} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {orgtypePost, orgtypePut, orgtypeDetail} from "@apis/system/orgtype";
import {SwitchProject} from "@apis/system/project";
import GoBackButton from "@component/go-back";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;
const {TreeNode} = Tree;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class OrgTypeAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      treeData: [],
      typeoption: [],
      checkedKeys: [],
      selectedKeys:[],
      workTypeData:[{name:'',desc:'',certificate:[{c_name:''}]}],
      cardShow:true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const {id} = this.props.match.params;
    if (id) {
      orgtypeDetail(id, {project_id: _util.getStorage('project_id') }).then((res) => {
        this.setState({
          ...res.data
        });
        //初始化权限
        if(res.data&&res.data.permission){
          this.setState({
            checkedKeys:res.data.permission.map(c => c+'')
          })
        }
        //初始化职务
        if(res.data&&res.data.work_type&&res.data.work_type.length){
          let work_list = [];
          res.data.work_type.map((w,index) => {
            const w_obj = {
              id:w.id,
              name:w.name,
              desc:w.desc,
              certificate:this.renderCertificateToList(w.certificate)
            }
            work_list.push(w_obj)
          })
          this.setState({
            workTypeData:work_list,
            cardShow:true,
          })
        }
      });
    }


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
    

    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/system/org/type");
    this.props.menuState.changeMenuOpenKeys("/system");
  }

  renderCertificateToList = (str) => {
    if(!str){
      return [{c_name:''}]
    }
    var str_list = str.split('{|}')
    if(str_list&&str_list.length){
      var c_list = []
      str_list.forEach(s => {
        c_list.push({c_name:s})
      })
      return c_list;
    }else{
      return [{c_name:''}]
    }
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


  renderList = (list) => {
    if(list&&list.length){
      var data = [];
      list.forEach(item => {
        if(item['c_name']){
          data.push(item['c_name'])
        }
      });
      return data
    }else{
      return []
    }
  }

  handleSubmit(e) {
    const {id} = this.props.match.params;
    e.preventDefault();
    // this.setState({
    //   confirmLoading: true
    // });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        const {formatMessage} = this.props.intl;
        const {checkedKeys,workTypeData} = this.state;
        let workTypeList = [];
        workTypeData.map((w,wIndex) => {
          let c_list = _this.renderList(w.certificate);
          const workObj = {
            id:w.id ? w.id :'',
            name:w.name,
            desc:w.desc,
            certificate:c_list&&c_list.length?c_list.join('{|}'):''
          }
          workTypeList.push(workObj)
        })
        let data = {
          name: values.name,
          desc: values.desc,
          permission: checkedKeys.filter(k => k && k.indexOf("-") < 0).join(","),
          work_type:JSON.stringify(workTypeList),
          project_id: _util.getStorage('project_id')
        }
        console.log('123',workTypeList,data)
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            if(id){
              orgtypePut(id,data).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
            }else{
              orgtypePost(data).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
            }
            
          },
          onCancel () {
          }
        });
      }
      this.setState({
        confirmLoading: false
      });
    });
  }



  showCard = () => {
    const{cardShow} = this.state;
    this.setState({cardShow:!cardShow})
  }

  handleWorkTypeData = (value,field,index) => {
    const { workTypeData } = this.state;
    workTypeData[index][field] = value;
    this.setState({
      workTypeData
    })
  };

  handleCertificateData = (value,field,pIndex,cIndex) => {
    const { workTypeData } = this.state;
    workTypeData[pIndex]['certificate'][cIndex][field] = value;
    console.log('0321',workTypeData)
    this.setState({
      workTypeData
    })
  }

  addForm = (i) => {
    const { workTypeData} = this.state;
    if(!workTypeData[i].name){
        message.error('请输入证件名称！');
        return false
    }
    workTypeData.push({
      name:'',desc:'',certificate:[{c_name:''}]
    });
    this.setState({workTypeData})
  };

  removeForm = index => {
    const { workTypeData } = this.state;
    workTypeData.splice(index, 1);
    this.setState({workTypeData})
  };

  addC = (pIndex,cIndex) => {
    const { workTypeData} = this.state;
    if(!workTypeData[pIndex].certificate[cIndex]['c_name']){
      message.error('请输入证件名称！');
      return false
    }
    workTypeData[pIndex].certificate.push({
        c_name:'',
    });
    this.setState({workTypeData})
  }

  removeC = (pIndex,cIndex)  => {
    const { workTypeData } = this.state;
    workTypeData[pIndex].certificate.splice(cIndex, 1);
    this.setState({workTypeData})
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, location_list, data,treeData,desc,
      cardShow,workTypeData,name} = this.state;

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

    const formItemInfo={
      labelCol:{
        sm: {span:8},
        xs: {span: 24}
      },
      wrapperCol:{
        sm: {span: 15,offset:1},
        xs: {span: 24}
      }
    };

    const _this = this;
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10}
      }
    };

    const {formatMessage} = this.props.intl;
    const {id} = this.props.match.params;
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="app.page.bread.system" defaultMessage="系统管理"/>
      },
      {
          name: <FormattedMessage id="app.page.bread.orgtype" defaultMessage="组织类型"/>,
          url: '/system/org/type'
      },
      {
          name: id ?  <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> :<FormattedMessage id="app.page.bread.add" defaultMessage="新增"/>
      }
    ]
    let formData = [
      {
        field: "tree",
        type: "tree",
        icon: "",
        value: null,
        text: "组织权限",
        placeholder: "",
        trees: treeData,
        expandedKeys: this.state.expandedKeys,
        autoExpandParent: this.state.autoExpandParent,
        onCheck: this.onCheck,
        onExpand: this.onExpand,
        checkedKeys: this.state.checkedKeys,
        selectedKeys: this.state.selectedKeys,
        renderTreeNodes: value => this.renderTreeNodes(value),
        // rules: [{required: true, message: "请配置组织权限"}]
      },
    ]
    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              <FormItem  {...formItemLayout}
                label={'类型名称'}
              >
                  {getFieldDecorator('name', {
                      rules: [{required: true, message:''}],
                      initialValue: name ? name : null,
                  })(
                      <Input/>
                  )}   
              </FormItem>
              <FormItem  {...formItemLayout}
                label={'描述'}
              >
                  {getFieldDecorator('desc', {    
                     initialValue: desc ?desc : null,                 
                  })(
                      <TextArea/>
                  )}   
              </FormItem>
              {
                formData ? formData.map((item, index) => {
                  return (
                      <FormItem
                        key={index}
                        label={item.text}
                        extra={item.extra}
                        hasFeedback
                        {...formItemLayout}
                      >
                      {
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
               <FormItem  {...formItemLayout}
                label={'组织职务'}
                required
              >
                {/* <Button type='primary' onClick={() => this.showCard()}>
                    {
                        cardShow ? '删除' : '新增'
                    }
                </Button> */}
                {cardShow && workTypeData.map((p, pIndex) => {
                  return(
                    <Card               
                      style={{marginBottom: '15px',width:'100%'}}
                      bordered={true}
                      actions={
                        workTypeData.length === 1
                        ? [<span style={{padding:'0 auto'}} onClick={() => this.addForm(pIndex)}><Icon type="plus"/> 添加职务</span>]
                        : workTypeData.length - 1 === pIndex
                          ? [<span style={{padding:'0 auto'}} onClick={() => this.addForm(pIndex)}><Icon type="plus"/> 添加职务</span>,
                              <span style={{padding:'0 auto'}} onClick={() => this.removeForm(pIndex)}><Icon type="delete"/> 删除职务</span>,
                            ]
                            : [<span style={{padding:'0 auto'}} onClick={() => this.removeForm(pIndex)}><Icon type="delete"/> 删除职务</span>]
                      }
                  >
                      <FormItem  {...formItemLayout} required label={'职务名称'}>
                          <Input name='name'
                              value={p.name}
                              placeholder={"请输入职务名称"}
                              onChange={e => this.handleWorkTypeData(e.target.value, 'name',pIndex)}/>
                      </FormItem>
                      <FormItem  {...formItemLayout} label={'描述'}>
                          <Input name='desc'
                              value={p.desc}
                              placeholder={"请输入职务描述"}
                              onChange={e => this.handleWorkTypeData(e.target.value, 'desc',pIndex)}/>
                      </FormItem>
                      <FormItem  {...formItemLayout} label={'职务证件(选填)'}>
                          {
                            p.certificate && p.certificate.map((c,cIndex) => {
                              return(
                                <Card
                                  style={{marginBottom: '5px',width:'100%',border:'1px solid #87cefa'}}
                                  //bodyStyle={{background:'#f5f5f5'}}
                                  bodyStyle={{background:'rgba(0,0,0,0.02)'}}
                                  bordered={true}
                                  actions={
                                    p.certificate.length === 1
                                    ? [<span style={{padding:'0 auto',color:'#108ee9'}} onClick={() => this.addC(pIndex,cIndex)}><Icon type="idcard"/> 添加证件</span>]
                                    : p.certificate.length - 1 === cIndex
                                      ? [<span style={{padding:'0 auto',color:'#108ee9'}} onClick={() => this.addC(pIndex,cIndex)}><Icon type="idcard"/> 添加证件</span>,
                                          <span style={{padding:'0 auto',color:'red'}} onClick={() => this.removeC(pIndex,cIndex)}><Icon type="close-circle"/> 删除证件</span>,
                                        ]
                                        : [<span style={{padding:'0 auto',color:'red'}} onClick={() => this.removeC(pIndex,cIndex)}><Icon type="close-circle"/> 删除证件</span>]
                                  }
                                >
                                  <FormItem  {...formItemLayout} label={'证件名称'}>
                                      <Input name='c_name'
                                          value={c.c_name}
                                          placeholder={"请输入证件名称"}
                                          onChange={e => this.handleCertificateData(e.target.value, 'c_name',pIndex,cIndex)}/>
                                  </FormItem>
                                </Card>
                              )
                            })
                          }
                      </FormItem>
                  </Card>
                  )              
              })}
              </FormItem>
             
                 

              <FormItem {...submitFormLayout}>
                <div style={{width: "100%", marginBottom: "20px"}}>
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                          style={{marginRight: "10px"}}>
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

const OrgTypeAdd = Form.create()(OrgTypeAddForm);

export default OrgTypeAdd;
