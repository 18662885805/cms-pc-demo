import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input, Timeline, Row, Col, Card,Collapse} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {orgtypeInfo} from "@apis/system/orgtype";
import {classificationPost, classificationPut, classificationDetail} from "@apis/workflow/classification";
import {TemplateDetail,} from "@apis/workflow/template";
import {allrecordDetail} from "@apis/workflow/allrecord";
import GoBackButton from "@component/go-back";
import FormBuilder from "@component/FormBuilder";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import { CaretRightOutlined } from '@ant-design/icons';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { Panel } = Collapse;
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
      form: undefined,
      approval: undefined,
      form_content:undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // let{param_info}=this.state;
    const {id} = this.props.location.state;
    let info=this.props.location.param;

    if(info){
      recordAllFlowDetail({project_id: _util.getStorage('project_id'),work_flow_id:info.id}).then((res)=>{
        this.setState({...res.data})
      });
      this.setState({param_info:info});
    }

    if (id) {
      allrecordDetail(id, {project_id: _util.getStorage('project_id') }).then((res) => {
        console.log(res);
        this.setState({
          // org_type,
          ...res.data
        });
      });
    }

    // orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
    //   this.setState({typeoption: res.data})
    // })

    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/allrecord");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }

  // componentWillMount() {
  //   locationForm().then((res) => {
  //     this.setState({
  //       formData: res.data.results
  //     });
  //   });
  //   this.setState({
  //     spinLoading: false
  //   });
  // }

  handleSubmit(e) {
    e.preventDefault();
    // this.setState({
    //   confirmLoading: true
    // });
    
    this.props.form.validateFields((err, values) => {
      console.log(this.props.match.params.id)
      if (!err) {
        let _this = this;
        const {formatMessage} = this.props.intl;

        let data = {
          name: values.name,
          abbreviation:values.abbreviation,
          // org_type: values.org_type,
          // desc: values.desc,
          project_id: _util.getStorage('project_id')
        };
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            const { id } = _this.props.match.params;
            if (id) {
              classificationPut(id, data).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
              return;
            }

            classificationPost(data).then((res) => {
              message.success(formatMessage(translation.saved));
              _this.props.history.goBack();
            });
          },
          onCancel () {
          }
        });
      }
      this.setState({
        confirmLoading: false
      });
    });
  };

  handleStepTwo=(e)=>{
     e.preventDefault();
     this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        const {formatMessage} = this.props.intl;

        let data = {
          name: values.name,
          desc: values.desc,
          project_id: _util.getStorage('project_id')
        };

        console.log(data);
        this.props.history.push({pathname:'/workflow/template/drag',param:data});
      }
     })
  };

  onLevelChange = (value) => {
    areaInfo({project_id: _util.getStorage('project_id'), level: 1}).then((res) => {
      this.setState({
        location_list: res.data
      });
    });
    this.setState({
      is_parent: value === 2 ? true : false
    });
  };

  handleToApproval=()=>{

  };

  getForm=(data)=>{
      console.log(data.data.slice());
      data.data.slice().map(a=>a.value='1');
      const{form,approval}=this.state;

      this.props.history.push({
        pathname: '/workflow/record/approval',
        param:[data,approval]
      });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, location_list, data, typeoption,
      org_type,param_info,form,approval,record,form_content,form_name} = this.state;

    console.log(form_content)
    console.log(form_content&&JSON.parse(form_content).data);

    let test=[{demo: false,
      fieldName: "input0",
      icon: "edit",
      key: "input0",
      label: "项目名称",
      level: 1,
      name: "单行文本",
      required: false,
      requiredMessage: "",
      type: "input",
      value:'123'
    },{
      demo: false,
      fieldName: "radio1",
      icon: "check-circle",
      key: "radio1",
      label: "radio1",
      level: 1,
      name: "单选框组",
      optionRowShow: 3,
      options:[{label: "default1",value: "1"}, {label: "default2",value: "2"}],
      required: false,
      requiredMessage: "",
      type: "radio",
      value: "1",
    }
    ]

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

    // const location = location_list instanceof Array && location_list.length ? location_list.map(d =>
    //   <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

    const {formatMessage} = this.props.intl;

    let parent = [];

    if (this.state.is_parent) {
      parent = [
        {
          field: "parent",
          type: "select",
          icon: "",
          value: data ? data.parent : null,
          text: "上级场所",
          placeholder: "上级场所",
          options: location_list,
          rules: []
        }
      ];
    }

    const formData = [
      {
        field: "name",
        type: "char",
        icon: "",
        value: data ? data.name : null,
        text: "标题",
        placeholder: "请输入表单标题",
        rules: [{required: true, message: "请输入表单标题"}]
      },
      // {
      //   field: "org_type",
      //   type: "select",
      //   icon: "",
      //   value: org_type ? org_type.id : null,
      //   text: "组织类型",
      //   placeholder: "请选择组织类型",
      //   // onChange: (value) => this.onLevelChange(value),
      //   options: typeoption,
      //   rules: [{required: true, message: "请选择组织类型"}]
      // },
      {
        field: "desc",
        type: "textarea",
        icon: "",
        value: data ? data.desc : null,
        text: "描述",
        placeholder: "请输入表单描述",
        rules: []
      },
    ];

    const { id } = this.props.match.params
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
          name: '所有工作流记录',
          url: '/workflow/allrecord/wait'
      },
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Card
              title={'详情'}
              style={{ width: "80%", margin: "0 auto 10px" }}
            >
              <table style={{ width: "100%" }}>
                <tbody style={{ borderBottom: "1px solid #dee2e6" }}>
                    <tr>
                      <td style={{
                        borderTop: "1px solid #dee2e6",
                        padding: "8px",
                        width:"20%",
                        color: "#333"
                      }}>表单详情</td>
                      <td style={{
                        borderTop: "1px solid #dee2e6",
                        padding: "8px",
                        color: "#333",
                        width: "80%",
                        wordBreak: "break-all"
                      }}>
                        <Collapse
                          bordered={false}
                          defaultActiveKey={['1']}
                          //expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        >
                          <Panel header={form_name} key="1" style={{background: '#f7f7f7',borderRadius:'2px',border: 0,overflow:'hidden'}}>
                             <FormBuilder
                                developer={true}
                                design={true}
                                data={{"data":form_content&&JSON.parse(form_content).data,'submitUrl':'','config':form_content&&JSON.parse(form_content).config?JSON.parse(form_content).config:{labelWidth:4,labelPosition:'right'}}}
                                // dataInfo={form&&form.content&&JSON.parse(form.content)}
                                type={3}
                                getForm={this.getForm}
                              />
                          </Panel>
                        </Collapse>
                      </td>
                    </tr>
                    {record&&record.length>0?
                    <tr style={{ background: "#fafafa" }}>
                      <td style={{
                        borderTop: "1px solid #dee2e6",
                        padding: "8px",
                        width: "20%",
                        color: "#333"
                      }}>审批进度</td>
                      <td style={{
                        borderTop: "1px solid #dee2e6",
                        padding: "8px",
                        color: "#333",
                        width: "80%",
                        wordBreak: "break-all"
                      }}>
                        <Timeline style={{margin: '5px auto -25px'}}>
                          {record.map((value, index) => {
                                  return (
                                      <Timeline.Item
                                          key={index} >
                                          <div>
                                            {value.operation_company} {value.operation_name} {value.operation_phone}
                                          &emsp;&emsp;
                                          {_util.flowStatus(value.status)}
                                          </div>
                                          <div>{value.operation_time ? value.operation_time : ''}</div>
                                          {
                                              value.remarks ? <div>{value.remarks}</div> : null
                                          }
                                      </Timeline.Item>
                                  )
                              })
                          }
                       </Timeline>
                      </td>
                    </tr>:null}
                </tbody>
              </table>
            </Card>

            {/*<Form>*/}
              {/*/!*<FormData data={formData} form={this.props.form} layout={formItemLayout}/>*!/*/}
              {/*<FormBuilder*/}
                {/*developer={true}*/}
                {/*design={true}*/}
                {/*data={{"data":test,'submitUrl':''}}*/}
                {/*// dataInfo={form&&form.content&&JSON.parse(form.content)}*/}
                {/*type={3}*/}
                {/*getForm={this.getForm}*/}
              {/*/>*/}

            {/*</Form>*/}
            {/*{record&&record.length>0?*/}
                {/*<Row>*/}
                  {/*<Col span={4}/>*/}
                  {/*<Col span={16}>*/}
                    {/*<p>审批进度</p>*/}
                     {/*<Timeline style={{margin: '5px auto -25px'}}>*/}
                        {/*{record.map((value, index) => {*/}
                                {/*return (*/}
                                    {/*<Timeline.Item*/}
                                        {/*key={index} >*/}
                                        {/*<div>*/}
                                          {/*{value.operation_company} {value.operation_name} {value.operation_phone}*/}
                                        {/*&emsp;&emsp;*/}
                                        {/*{_util.flowStatus(value.status)}*/}
                                        {/*</div>*/}
                                        {/*<div>{value.operation_time ? value.operation_time : ''}</div>*/}
                                        {/*{*/}
                                            {/*value.remarks ? <div>{value.remarks}</div> : null*/}
                                        {/*}*/}
                                    {/*</Timeline.Item>*/}
                                {/*)*/}
                            {/*})*/}
                        {/*}*/}
                     {/*</Timeline>*/}
                  {/*</Col>*/}
                {/*</Row>*/}
                {/*:null}*/}
          </Spin>
          <GoBackButton
            style={{display: 'block', margin: '0 auto'}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    );
  }
}

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;
