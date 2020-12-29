import React from "react";
import {
    Form, 
    Button, 
    Modal, 
    Spin, 
    message, 
    Select, 
    Input,
    Tree,
    Card,
    Icon,
    Row,
    Col,
    InputNumber,
    DatePicker,
} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import GoBackButton from "@component/go-back";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import {orgtypeInfo} from "@apis/system/orgtype";
import {SearchProjectUser} from "@apis/system/user";

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
      RuleData:[{name:'',desc:'',contacts:[{c_name:'',c_phone:''}]}],
      cardShow:true,
      typeoption:[],
      searchOptions: [],
      types:[
          {id:1,name:'问题类型1'},
          {id:1,name:'问题类型2'},
          {id:1,name:'问题类型3'},
       ],
       search_data: [],
       fetching: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
        this.setState({typeoption: res.data})
    })
    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/system/org/type");
    this.props.menuState.changeMenuOpenKeys("/system");
  }

  
  handleSubmit(e) {
    const {id} = this.props.match.params;
    e.preventDefault();
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            
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
        id: user.id
      }));
      this.setState({ search_data, fetching: false });
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading,types,search_data} = this.state;

      

      const formItemLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 7},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 12},
          md: {span: 10},
        },
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
          name: '重要问题'
      },
      {
          name: '问题发起',
      },
      {
          name: id ?  <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> :<FormattedMessage id="app.page.bread.add" defaultMessage="新增"/>
      }
    ]

    const formData = [
        {
          field: "org_approve",
          type: "search",
          icon: "",
          value: null,
          text: '执行人',
          placeholder: <FormattedMessage id="search-user" defaultMessage="根据姓名、手机搜索项目用户" />,
          options: search_data,
          rules: [{ required: true, message: '' }]
        },
      ];

    const typeList = types instanceof Array && types.length ? types.map(d =>
        <Option key={d.id} value={d.id}>{d.name}</Option>) : [];
    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label={'问题类型'} >
                <Input value={'类型1'} disabled/>
              </FormItem>    
              <FormItem {...formItemLayout} label={'行动内容'} >
                {getFieldDecorator('desc', {
                  rules: [
                    {
                      required: true,
                      message: '',         
                    },
                  ],
                })(
                    <TextArea placeholder={'请输入行动内容'}/>
                )}
              </FormItem>     
              <FormItem {...formItemLayout} label={'行动日期'} >
                {getFieldDecorator('day', {
                  rules: [
                    {
                      required: true,
                      message: '',         
                    },
                  ],
                })(
                    <DatePicker style={{width:'100%'}}/>
                )}
              </FormItem> 
              <FormItem {...formItemLayout} label={'执行人'} >
                <Input value={'jmy'} disabled/>
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
