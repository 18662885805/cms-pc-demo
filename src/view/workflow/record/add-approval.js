import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input, Radio, Checkbox, Row, Col} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {orgtypeInfo} from "@apis/system/orgtype";
import {recordPost, recordPut, recordDetail,recordSub} from "@apis/workflow/record";
import GoBackButton from "@component/go-back";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import ApprovalStep from '@component/approvalStep'
import SearchUserSelect from '@component/searchUserSelect'
import SearchUserTransfer from '@component/searchUserTransfer'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;
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
      postData:{
        name:"",
        desc:'',
        final_result:0,
        is_begin_can_edit:false,
        is_process_can_edit:false,
        is_process_can_jump:false,
      },
      form_content:undefined,
      id:undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if(this.props.location.param){
      let postData2=this.props.location.param&&this.props.location.param[1];
      let id=this.props.location.param&&this.props.location.param[0];
      this.setState({postData:postData2,id:id});
    }
    // let {postData}=this.props
    // const {id} = this.props.match.params;
    // if(this.props.location.param){
    //   let postData2=this.props.location.param&&this.props.location.param[1];
    //   let form_content=this.props.location.param&&this.props.location.param[0];
    //   this.setState({postData:postData2,form_content:form_content});
    // }
    //
    // if (id) {
    //   classificationDetail(id, {project_id: _util.getStorage('project_id') }).then((res) => {
    //     // const {org_type} = res.data
    //     this.setState({
    //       // org_type,
    //       data: res.data
    //     });
    //   });
    // }

    // orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
    //   this.setState({typeoption: res.data})
    // })

    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/approval");
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

  handleSubmit=()=>{
    const{postData,form_content,id}=this.state;

    let step_array=this.refs['steps'].state.steps;
    console.log(id);
    console.log(postData.step);

    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
        let _this = this;
        // const {formatMessage} = _this.props.intl;

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
            console.log(step_info)

            let data = {
            project_id:_util.getStorage('project_id'),
            //id:id,
            id:_this.props.location.param[0],
            remarks:'',
            change:JSON.stringify({
                id: postData.id,
                step:step_info
            })
        };

            // let _this=this;
            recordSub(data).then((res) => {
                if(res){
                    message.success('提交成功');
                   _this.props.history.push('/workflow/record')
                }
            })

            // recordPost(data).then((res) => {
            //   message.success(formatMessage(translation.saved));
            //   _this.props.history.push('/workflow/record')
            //   // _this.props.history.goBack();
            // });
          },
          onCancel () {
             _this.setState({
                    confirmLoading: false
             });
          }
        });
    //   }
    //   this.setState({
    //     confirmLoading: false
    //   });
    // });
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

  handleChange = (value,field) => {
    const {postData}=this.state;
    postData[field]=value;
    this.setState(postData)
  };

  getSponsor=(val)=>{
    const{postData}=this.state;
    postData.sponsor=val.join(',');
    this.setState(postData)
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, location_list, data, typeoption, org_type,postData,id} = this.state;
    console.log(postData);

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

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
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
        field: "abbreviation",
        type: "char",
        icon: "",
        value: data ? data.abbreviation : null,
        text: "简码",
        placeholder: "请输入三位简码",
        rules: [{required: true, message: "请输入简码"}]
      },
      {
        field: "name",
        type: "char",
        icon: "",
        value: data ? data.name : null,
        text: "名称",
        placeholder: "请输入分类名称",
        rules: [{required: true, message: "请输入分类名称"}]
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
      // {
      //   field: "desc",
      //   type: "textarea",
      //   icon: "",
      //   value: data ? data.desc : null,
      //   text: "描述",
      //   placeholder: "请输入职务描述",
      //   rules: []
      // },
    ];

    //const { id } = this.props.match.params;

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
        name: formatMessage({
          id: "page.component.workFlow.record1",
          defaultMessage: "我的工作流"
        }),
        url: "/workflow/record"
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
            <Form {...formItemLayout}>

            {/*<Form.Item label="模板名称">*/}
              {/*<Input disabled={true} placeholder={'请输入模板名称'} value={postData.name} onChange={(e)=>this.handleChange(e.target.value,'name')}/>*/}
            {/*</Form.Item>*/}

            {/*<Form.Item label="描述">*/}
              {/*<TextArea disabled={true} placeholder={'请输入模板描述'} value={postData.desc} onChange={(e)=>this.handleChange(e.target.value,'desc')}/>*/}
            {/*</Form.Item>*/}

            {/*<Form.Item label="工作流结果由以下决定">*/}
                  {/*<Radio.Group disabled={true} onChange={(e)=>this.handleChange(e.target.value,'final_result')} value={postData.final_result}>*/}
                    {/*<Radio style={radioStyle} value={1}>*/}
                      {/*最终步骤结果（由主审核员决定）*/}
                    {/*</Radio>*/}
                    {/*<Radio style={radioStyle} value={2}>*/}
                      {/*所有步骤的最终结果*/}
                    {/*</Radio>*/}
                  {/*</Radio.Group>*/}
            {/*</Form.Item>*/}

            {/*<Form.Item label="工作流发起人">*/}
              {/*<Row>*/}
                {/*<Col span={4} >*/}
                  {/*<Select placeholder={'请选择'} value={postData.sponsor_condition} disabled={true} onChange={(value)=>this.handleChange(value,'sponsor_condition')}>*/}
                      {/*<Option value={1}>所有人员</Option>*/}
                      {/*<Option value={2}>具体的人</Option>*/}
                  {/*</Select>*/}
                {/*</Col>*/}
                {/*<Col span={16} offset={1}>*/}
                  {/*<SearchUserTransfer dis_info={true} getSponsor={this.getSponsor} conditionType={postData.sponsor_condition} sponsor={postData.sponsor}/>*/}
                {/*</Col>*/}
              {/*</Row>*/}
            {/*</Form.Item>*/}

            {/*<Form.Item label="工作流发起人选项">*/}
              {/*<Form>*/}
                {/*<Form.Item label="当工作流开始时">*/}
                  {/*<Checkbox checked={postData.is_begin_can_edit} disabled={true} onChange={(e)=>this.handleChange(e.target.checked,'is_begin_can_edit')}>发起人可以编辑步骤的期限和参与者</Checkbox>*/}
                {/*</Form.Item>*/}
              {/*</Form>*/}
              {/*<Form>*/}
                {/*<Form.Item label="当工作流正在进行时">*/}
                  {/*<Checkbox checked={postData.is_process_can_edit} disabled={true} onChange={(e)=>this.handleChange(e.target.checked,'is_process_can_edit')}>发起人可以编辑步骤参与者</Checkbox>*/}
                  {/*<Checkbox checked={postData.is_process_can_jump} disabled={true} onChange={(e)=>this.handleChange(e.target.checked,'is_process_can_jump')}>发起人可以跳过步骤</Checkbox>*/}
                {/*</Form.Item>*/}
              {/*</Form>*/}
            {/*</Form.Item>*/}

              {/*<Form.Item label="默认步骤完成规则">*/}

              {/*<Form>*/}
                {/*<Form.Item label="并行步骤完成当">*/}
                  {/*<Select placeholder={'请选择'} value={1} disabled={true}>*/}
                    {/*<Option value={1}>所有步骤完成时</Option>*/}
                    {/*<Option value={2}>任何步骤完成时</Option>*/}
                    {/*<Option value={3}>除被否决外的所有步骤完成时</Option>*/}
                  {/*</Select>*/}
                {/*</Form.Item>*/}
              {/*</Form>*/}

              {/*<Form>*/}
                {/*<Form.Item label="当被否决时">*/}
                  {/*<Select placeholder={'请选择'} value={2} disabled={true}>*/}
                    {/*<Option value={1}>返回工作流发起人</Option>*/}
                    {/*<Option value={2}>继续下个步骤</Option>*/}
                  {/*</Select>*/}
                {/*</Form.Item>*/}
              {/*</Form>*/}
            {/*</Form.Item>*/}

              {/*<Form.Item label="最终传送–其他(抄送)收件人">*/}
                {/*<SearchUserSelect getUser={this.getUser} cc={postData.cc} dis_info={true}/>*/}
              {/*</Form.Item>*/}

              <ApprovalStep ref={'steps'} steps={postData.step} type={'record'} is_begin_can_edit={postData.is_begin_can_edit}/>
              {/*<FormData data={formData} form={this.props.form} layout={formItemLayout}/>*/}

              <FormItem {...submitFormLayout}>
                <div style={{width: "100%", marginBottom: "20px"}}>
                  <Button type='primary'
                          // loading={confirmLoading}
                          style={{marginRight: "10px"}}
                          onClick={this.handleSubmit}
                  >
                    提交
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

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;
