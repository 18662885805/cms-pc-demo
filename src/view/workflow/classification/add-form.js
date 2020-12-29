import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {orgtypeInfo} from "@apis/system/orgtype";
import {classificationPost, classificationPut, classificationDetail} from "@apis/workflow/classification";
import GoBackButton from "@component/go-back";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
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
      typeoption: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    if (id) {
      classificationDetail(id, {project_id: _util.getStorage('project_id') }).then((res) => {
        // const {org_type} = res.data
        this.setState({
          // org_type,
          data: res.data
        });
      });
    }

    orgtypeInfo({project_id: _util.getStorage('project_id')}).then((res) => {
      this.setState({typeoption: res.data})
    })

    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/classification");
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
  }

  onLevelChange = (value) => {
    areaInfo({project_id: _util.getStorage('project_id'), level: 1}).then((res) => {
      this.setState({
        location_list: res.data
      });
    });
    this.setState({
      is_parent: value === 2 ? true : false
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, location_list, data, typeoption, org_type} = this.state;

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
        field: "abbreviation",
        type: "char",
        icon: "",
        value: data ? data.abbreviation : null,
        text: "简码",
        placeholder: "简码字母不超过三位",
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
          name: <FormattedMessage id="page.component.workFlow.worktype" defaultMessage="分类配置"/>,
          url: '/workflow/classification'
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
            <Form onSubmit={this.handleSubmit}>

              <FormData data={formData} form={this.props.form} layout={formItemLayout}/>

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
