import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input, Transfer, Table} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {orgtypeInfo} from "@apis/system/orgtype";
import {flowForm,flowDetail,flowClassification,flowApproval,flowPut,flowPost,flowSearch,flowRoleInfo} from "@apis/workflow/flow";
import GoBackButton from "@component/go-back";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import styles from "../../common.css";
import difference from 'lodash/difference';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea,Search } = Input;
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
      postData: {name: "", desc: "", abbr:'',classification: {id: undefined}, form: {id:undefined}, approval: {id:undefined},status:true},
      formOptions: [],
      classificationOptions: [],
      approvalOptions: [],
      addModal:false,
      work_type_list:[],
      tableLoading:false,
      sourceData:[],
      targetKeys:[],
        role_list:[],
        id:undefined,
        selectDisable:false,
        work_type_id:false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
        const {id} = this.props.match.params;
        if (id) {
          flowDetail(id, {project_id: _util.getStorage('project_id') }).then((res) => {
            this.setState({
                postData: res.data,
                id:id,
            });
          });
        }

        flowForm({project_id: _util.getStorage('project_id')}).then((res) => {
          this.setState({formOptions: res.data})
        });

        flowApproval({project_id: _util.getStorage('project_id')}).then((res) => {
          this.setState({approvalOptions: res.data})
        });

        this.setState({
          spinLoading: false
        });
        this.props.menuState.changeMenuCurrentUrl("/workflow/flow");
        this.props.menuState.changeMenuOpenKeys("/workflow");
  }

  handleSubmit(e) {
    e.preventDefault();
    // this.setState({
    //   confirmLoading: true
    // });
    const {postData,targetKeys,id}=this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        const {formatMessage} = this.props.intl;

        let data=postData;
        data.form_tid=postData.form.id;
        data.approval_tid=postData.approval.id;
        data.project_id=_util.getStorage('project_id');

        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            if (id) {
              flowPut(id, data).then((res) => {
                message.success('修改成功');
                _this.props.history.goBack();
              });
              return;
            }

            flowPost(data).then((res) => {
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
  }

  handleChangeOption=(value,field)=>{
    const{postData}=this.state;
    postData[field].id=value;
    this.setState(postData);
  };

  handleInputInfoChange=(value,field)=>{
    const{postData}=this.state;
    postData[field]=value;
    this.setState(postData);
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {formatMessage} = this.props.intl;
    const {work_type_id,selectDisable,confirmLoading, spinLoading, location_list, data, typeoption,tableLoading,sourceData,targetKeys,role_list,
      org_type,postData,classificationOptions,formOptions,approvalOptions,addModal,work_type_list} = this.state;

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

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10}
      }
    };

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
          name:'工作流类型',
          url: '/workflow/flow'
      },
      {
          name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit} {...formItemLayout}>
              {/*<FormData data={formData} form={this.props.form} layout={formItemLayout}/>*/}
              <Form.Item label="工作流名称">
              {getFieldDecorator('name', {
                initialValue:postData?postData.name:undefined,
                rules: [
                  {
                    required: true,
                    message: '请输入工作流名称',
                  },
                ],
              })(<Input placeholder={'请输入工作流名称'} value={postData.name} onChange={(e)=>this.handleInputInfoChange(e.target.value,'name')}/>)}
            </Form.Item>

            <Form.Item 
              label="缩写"
              required
              {...formItemLayout}
            >
              {getFieldDecorator('abbr', {
                initialValue:postData?postData.abbr:undefined,
                rules: [
                  {
                    required: true,
                    message: '请输入工作流缩写(不超过3个字符)',
                  },
                  {
                    pattern: /^[A-Z]+$/,
                    message: "请输入大写字母"
                  }
                ],
              })(<Input placeholder={'请输入工作流缩写'} maxLength={3} value={postData.abbr} onChange={(e)=>this.handleInputInfoChange(e.target.value,'abbr')}/>)}
            </Form.Item>

            <Form.Item label="描述">
              <TextArea placeholder={'请输入工作流描述'} value={postData.desc} onChange={(e)=>this.handleInputInfoChange(e.target.value,'desc')}/>
            </Form.Item>

            <FormItem
                label={'表单模板'}
                required
                {...formItemLayout}
              >
                  <Select
                    placeholder={'请选择'}
                    optionFilterProp="children"
                    value={postData.form.id}
                    onSelect={(value)=>this.handleChangeOption(value,'form')}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                      {formOptions.map(d =>
                         <Option key={d.id} value={d.id}>{d.name}</Option>)
                      }
                  </Select>
              </FormItem>

            <FormItem
                label={'审批流模板'}
                required
                {...formItemLayout}
              >
                  <Select
                    placeholder={'请选择'}
                    value={postData.approval.id}
                    onSelect={(value)=>this.handleChangeOption(value,'approval')}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                      {approvalOptions.map(d =>
                         <Option key={d.id} value={d.id}>{d.name}</Option>)
                      }
                  </Select>
              </FormItem>

            <FormItem
                label={'状态'}
                required
                {...formItemLayout}
              >
                  <Select
                    placeholder={'请选择'}
                    value={postData.status}
                    onSelect={(value)=>this.handleInputInfoChange(value,'status')}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                      <Option key={1} value={true}>激活</Option>
                      <Option key={2} value={false}>禁用</Option>
                  </Select>
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

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;
