import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input,Tabs} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {recordAllFlowDetail,recordPost,recordDetail,recordPut,recordSub} from "@apis/workflow/record";
import GoBackButton from "@component/go-back";
import FormBuilder from "@component/FormBuilder";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import ApprovalStep from '@component/approvalStep'
import ApprovalInfo from'@component/approvalInfo'
import styles from '../../common.css'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const {TextArea}=Input;
const { TabPane } = Tabs;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class WorkTypeAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      factoryList: [],
      is_parent: false,
      location_list: [],
      typeoption: [],
      param_info: undefined,
      form:{},
      approval: undefined,
      id: undefined,
      data:[],
      subVisible:false,
      remarks:'',
      ids:undefined,
      postData:{
        name:"",
        desc:'',
        final_result:0,
        is_begin_can_edit:false,
        is_process_can_edit:false,
        is_process_can_jump:false,
        step:undefined,
      },
      defaultActiveKey:'1',
      sid:undefined,
      type:undefined,
      record:undefined,
    };
    this.handleSaveForm = this.handleSaveForm.bind(this);
    this.myUsernameRef1 = React.createRef();
  }

  componentWillMount() {
    let{form}=this.state;
    let info=this.props.location.param;
    let type=this.props.location&&this.props.location.param&&this.props.location.param.type;
    this.setState({type:type});

    if(info) {
      if (info.type === 1) {
        recordAllFlowDetail({project_id: _util.getStorage('project_id'), work_flow_id: info.id}).then((res) => {
          this.setState({...res.data})
        });
      } else {
        recordDetail(info.ids, {project_id: _util.getStorage('project_id')}).then((res) => {
          form.content = res.data.form_content;
          this.setState({id: info.id, form: form, ids: info.ids, sid: res.data.id,record:res.data.record})
        }).then((res1) => {
          recordAllFlowDetail({project_id: _util.getStorage('project_id'), work_flow_id: info.id}).then((res) => {
            this.setState({approval: res.data.approval})
          });
        });
      }
    }

    this.setState({
      spinLoading: false,
      remarks:info&&info.remarks
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/record");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }

  getForm=(data)=>{
      const{ids,id,approval}=this.state;

      let res=true;
      data.data.map((item)=>{
        if(item.columns){
          item.columns.map((column_item)=>{
            if(column_item.list[0]&&column_item.list[0].required&&!column_item.list[0].value){
              res=false;
              return false
            }
          })
        }else{
          if(item.required&&!item.value){
              res=false;
              return false
          }
        }
      });

      if(res){
        if(this.props.location.param.type===1){
          const{form,approval,id,remarks}=this.state;

          let data_info={};
          data_info.project_id=_util.getStorage('project_id');
          data_info.work_flow_id=id;
          data_info.source_data=approval;
          data_info.form_content=JSON.stringify(data);
          data_info.remarks=remarks;

           recordPost(data_info).then((res) => {
              if(res){
                console.log(res)
                this.setState({defaultActiveKey:'2',sid:res.data.id})
              }
           });
      }else if(this.props.location.param.type===2){
          let post_data={};
          post_data.form_content=JSON.stringify(data);
          post_data.project_id=_util.getStorage('project_id');
          post_data.work_flow_id=id;

          recordPut(ids, post_data).then((res) => {
            this.setState({defaultActiveKey:'2',sid:res.data.id})
          });
        }
      }else{
        message.error('带*号的部分为必填项，请补充完后再进入下一步');
        return false
      }
  };

  handleTabChange=(key)=>{
    this.setState({defaultActiveKey:key==='1'?'2':'1'})
  };

  handleSaveForm(){
      console.log(this.myUsernameRef1);
      let data={};
      data.data=this.myUsernameRef1.current.props.store.data;
      data.config=this.myUsernameRef1.current.props.store.config;
      data.index=this.myUsernameRef1.current.props.store.index;
      data.submitUrl=this.myUsernameRef1.current.props.store.submitUrl;
      this.getForm(data);
  };

  handleFormSubmit=()=>{
    const{postData,form_content,sid,approval}=this.state;

    let step_array=this.refs['steps'].state.steps;

    let _this = this;

    confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            _this.setState({
                  confirmLoading: true
            });

            let step_info=[];
            step_array.map((val)=>{
              let step_obj={}
              step_obj.id=val.id;
              step_obj.deadline=parseInt(val.deadline);
              step_obj.child=[];
              val.child.map((item)=>{
                 step_obj.child.push({id:item.id,user:item.user})
              });
              step_info.push(step_obj)
            });

            let data = {
            project_id:_util.getStorage('project_id'),
            //id:id,
            id:sid,
            remarks:'',
            change:JSON.stringify({
                id: approval.id,
                step:step_info
            })
        };

        recordSub(data).then((res) => {
            if(res){
                message.success('提交成功');
               _this.props.history.push('/workflow/record')
            }
        })},
          onCancel () {
             _this.setState({
                    confirmLoading: false
             });
          }
        });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {formatMessage} = this.props.intl;
    const {confirmLoading, spinLoading, location_list, data, typeoption, org_type,param_info,
      form,approval,subVisible,remarks,postData,defaultActiveKey,sid,type,record} = this.state;

  //   let test=[
  //     { demo:false,
  //       fieldName: "typography0",
  //       icon: "file-text",
  //       key: "typography0",
  //       label: "typography0",
  //       level: 2,
  //       name: "文本",
  //       required: false,
  //       requiredMessage: "",
  //       title_level: 1,
  //       title_name: "付款申请表",
  //       title_position: "right",
  //       type: "typography"},
  //     {
  //       demo: false,
  //       fieldName: "input1",
  //       icon: "edit",
  //       key: "input1",
  //       label: "信息1",
  //       level: 1,
  //       name: "单行文本",
  //       required: false,
  //       requiredMessage: "",
  //       type: "input",
  //     }, {
  //       demo: false,
  //       fieldName: "textarea2",
  //       icon: "ordered-list",
  //       key: "textarea2",
  //       label: "信息2",
  //       level: 1,
  //       name: "多行文本",
  //       required: false,
  //       requiredMessage: "",
  //       type: "textarea",
  //     }, {
  //       demo: false,
  //       fieldName: "radio3",
  //       icon: "check-circle",
  //       key: "radio3",
  //       label: "信息3",
  //       level: 1,
  //       name: "单选框组",
  //       optionRowShow: 3,
  //       options: [{label: "default1", value: "default1Value"},
  //         {label: "default2", value: "default2Value"}],
  //       required: false,
  //       requiredMessage: "",
  //       type: "radio",
  //     }, {
  //       demo: false,
  //       fieldName: "checkboxGroup4",
  //       icon: "check-square",
  //       key: "checkboxGroup4",
  //       label: "信息4",
  //       level: 1,
  //       name: "多选框组",
  //       optionRowShow: 3,
  //       options:[{label: "default1", value: "default1Value"},
  //         {label: "default2", value: "default2Value"}],
  //       required: false,
  //       requiredMessage: "",
  //       type: "checkboxGroup",
  //     }, {
  //       demo: false,
  //       fieldName: "datePicker5",
  //       icon: "calendar",
  //       key: "datePicker5",
  //       label: "信息5",
  //       level: 1,
  //       name: "日期选择器",
  //       required: false,
  //       requiredMessage: "",
  //       type: "datePicker",
  //     }, {
  //       demo: false,
  //       fieldName: "timePicker6",
  //       icon: "hourglass",
  //       key: "timePicker6",
  //       label: "信息6",
  //       level: 1,
  //       name: "时间选择器",
  //       required: false,
  //       requiredMessage: "",
  //       type: "timePicker",
  //     }, {
  //       demo: false,
  //       fieldName: "select7",
  //       icon: "down-square",
  //       key: "select7",
  //       label: "信息7",
  //       level: 1,
  //       name: "下拉选择框",
  //       options: [{label: "default1", value: "default1Value"},
  //         {label: "default2", value: "default2Value"}],
  //       required: false,
  //       requiredMessage: "",
  //       type: "select",
  // }, {
  //       demo: false,
  //       fieldName: "inputNumber8",
  //       icon: "calculator",
  //       key: "inputNumber8",
  //       label: "信息8",
  //       level: 1,
  //       name: "计数器",
  //       required: false,
  //       requiredMessage: "",
  //       type: "inputNumber",
  //     }, {
  //       demo: false,
  //       fieldName: "tag9",
  //       icon: "tag",
  //       key: "tag9",
  //       label: "信息9",
  //       level: 1,
  //       name: "标签",
  //       required: false,
  //       requiredMessage: "",
  //       tag_color: "",
  //       tag_name: "标签名",
  //       type: "tag",
  //     },{
  //       demo: false,
  //       fieldName: "upload10",
  //       icon: "picture",
  //       key: "upload10",
  //       label: "信息10",
  //       level: 2,
  //       name: "附件",
  //       required: false,
  //       requiredMessage: "",
  //       type: "upload"}
  //   ];

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

    const { id } = this.props.match.params;
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
          name: '我的工作流',
          url: '/workflow/record'
      },
      {
          name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Tabs activeKey={defaultActiveKey} onChange={()=>this.handleTabChange(defaultActiveKey)}>
              <TabPane tab="表单" key="1">
                <Form>
                    <FormBuilder
                      developer={true}
                      design={false}
                      //data={{"data":test,'submitUrl':'','config':{labelWidth:6,labelPosition:'right'}}}
                      data={{"data":form&&form.content&&JSON.parse(form.content).data,'submitUrl':'','config':form&&form.content&&JSON.parse(form.content).config?JSON.parse(form.content).config:{labelWidth:4,labelPosition:'right'}}}
                      type={type===1?2:type===2?4:6}
                      getForm={this.getForm}
                      ref={'formBuilder'}
                      Mref={this.myUsernameRef1}
                    />
                 </Form>

                  <div style={{width: "100%", margin: "0 0 20px 42%"}}>
                    {type===1||type===2?
                      <Button type='primary'
                            loading={confirmLoading}
                            style={{marginRight: "10px"}}
                            onClick={this.handleSaveForm}
                      >
                        {type===1?'保存':'修改'}
                      </Button>:null
                    }

                    <GoBackButton props={this.props}/>
                  </div>
              </TabPane>

              <TabPane tab="审批流" key="2" forceRender={true}>
                <div className={styles.field}>
                    <div className={styles.wrap}>
                        <span className={styles.title}>审批流配置</span>
                        <ApprovalInfo postData={approval}/>
                        <ApprovalStep ref={'steps'} steps={approval&&approval.step} type={'record'} is_begin_can_edit={approval&&approval.is_begin_can_edit}/>
                    </div>
                </div>

                {/*审核进程*/}
                  {record&&record.length>0?
                      <div className={styles.field}>
                      <div className={styles.wrap}>
                          <span className={styles.title}>审批流进程</span>
                          <table width="100%" border="0" cellPadding="0" cellSpacing="0" style={{tableLayout: 'fixed'}}>
                              <tbody>
                                {record.map((item,index)=>{
                                   return (<tr key={index}>
                                      <td align="right" style={{width: '12%'}}><FormattedMessage id="page.construction.projectAudit.progress5" defaultMessage="审批人"/>:</td>
                                      <td align="center" style={{width: '15%'}}>{item.operation_name}</td>
                                      <td align="right" style={{width: '12%'}}>审批人电话:</td>
                                      <td align="center" style={{width: '20%'}}>{item.operation_phone}</td>
                                      <td align="right" style={{width: '8%'}}><FormattedMessage id="app.table.column.operate" defaultMessage="操作"/>:</td>
                                      <td align="center" style={{width: '15%'}}>{_util.flowStatus(item.status)}</td>
                                      <td align="right" style={{width: '8%'}}><FormattedMessage id="page.construction.monitor.remark" defaultMessage="备注"/>:</td>
                                      <td align="center" style={{width: '10%',textOverflow: 'ellipsis',whiteSpace: 'nowrap',overflow: 'hidden'}}><span title={item.remarks}>{item.remarks}</span></td>
                                  </tr>)})}
                              </tbody>
                          </table>
                      </div>
                   </div>:null
                  }

                  <div style={{width: "100%", margin:'0 0 20px 42%'}}>
                    {type !== 3 && sid ?
                        <Button type='primary'
                                style={{marginRight: "10px"}}
                                onClick={this.handleFormSubmit}
                        >
                          提交
                        </Button>
                    :null}
                    <GoBackButton props={this.props}/>
                  </div>
              </TabPane>
            </Tabs>

          </Spin>
        </div>
      </div>
    );
  }
}

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;
