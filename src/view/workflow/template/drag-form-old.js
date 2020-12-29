import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {orgtypeInfo} from "@apis/system/orgtype";
import {TemplatePost, TemplatePut, TemplateDetail} from "@apis/workflow/template";
import GoBackButton from "@component/go-back";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import FormBuilder from "@component/FormBuilder";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
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
      info:{},
      showModal:false,
    };
    this.handleSaveForm = this.handleSaveForm.bind(this);
    this.handlePreviewForm = this.handlePreviewForm.bind(this);
    this.myUsernameRef = React.createRef();
  }

  componentDidMount() {
    this.setState({info:{...this.props.location.param}});

    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/template");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }

  closeModal=(data)=>{
    this.setState({showModal:data})
  };

  getForm=(data)=>{
      console.log(data);
      data.data.map((val)=>{
        if(val.value){
          val.value=null
        }

        if(val.type==='grid'&&val.columns&&val.columns.length>0){
          val.columns.map((item)=>{
            if(item.list[0]&&item.list[0].value){
              item.list[0].value=null
            }
          })
        }
        val.key=val.fieldName
      });

      const{info}=this.state;
      const {formatMessage} = this.props.intl;

      info.content=JSON.stringify(data);

      let _this = this;

      confirm({
        title: '确认提交?',
        content: '单击确认按钮后，将会提交数据',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          if (info.id) {
            TemplatePut(info.id, info).then((res) => {
              message.success(formatMessage(translation.saved));
              _this.props.history.push('/workflow/template');
            });
            // return;
          }else{
            TemplatePost(info).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.push('/workflow/template');
            });
          }
        },
        onCancel () {}
      });

      this.setState({
        confirmLoading: false
      });
  };

  handleSaveForm(){
      console.log(this.myUsernameRef);
      let data={};
      data.data=this.myUsernameRef.current.props.store.data;
      data.config=this.myUsernameRef.current.props.store.config;
      data.index=this.myUsernameRef.current.props.store.index;
      data.submitUrl=this.myUsernameRef.current.props.store.submitUrl;
      this.getForm(data);
  };

  handlePreviewForm(){
     this.setState({showModal:true})
  };

  render() {
    const {confirmLoading, spinLoading, location_list, data, typeoption, org_type,info,showModal} = this.state;
    const {getFieldDecorator} = this.props.form;
    const {formatMessage} = this.props.intl;
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 24, offset: 0}
      }
    };

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
          name: <FormattedMessage id="page.component.workFlow.template" defaultMessage="表单配置"/>,
          url: '/workflow/template'
      },
      {
          name: info.id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form>
              <FormBuilder
                developer={true}
                design={true}
                previewModal={showModal}
                closeModal={this.closeModal}
                data={{"data":info.content?JSON.parse(info.content).data:[],'submitUrl':'','config':info.content?JSON.parse(info.content).config:{labelWidth:4,labelPosition:'right'}}}
                getForm={this.getForm}
                type={1}
                ref={'form'}
                Mref={this.myUsernameRef}
              />
              <FormItem {...submitFormLayout}>
                <div style={{margin: "10px 0 20px 40%"}}>
                  <Button type='primary' loading={confirmLoading}
                          style={{marginRight: "10px"}}
                          onClick={this.handleSaveForm}
                  >
                    {info.id?'修改':'保存'}
                  </Button>
                  <Button type='primary'
                          style={{marginRight: "10px"}}
                          onClick={this.handlePreviewForm}
                  >
                    预览
                  </Button>
                  <GoBackButton
                    style={{display: "inline-block", margin: "0 auto"}}
                    props={this.props}
                  />
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
