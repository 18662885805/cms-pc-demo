import React from "react";
import {Form, Button, Modal, Spin, message, Select, Radio} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {
    TemporaryPost,
}from '@apis/document/temp';
import {SearchProjectUser} from "@apis/system/user";
import GoBackButton from "@component/go-back";
import SelectUserModal from "@component/SelectUserModal";
import {debounce} from "lodash";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import translation from '../translation'
import values from "postcss-modules-values";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class TempAddForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      factoryList: [],
      searchOptions: [],
      checked: 1,
      reader_list:[],
      selectUserModalVisible:false
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }

  componentDidMount () {
    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/document/temporary/document");
    this.props.menuState.changeMenuOpenKeys("/document");
  }



  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        const {checked,reader_list} = this.state;
        const project_id = _util.getStorage('project_id');
        const { formatMessage } = this.props.intl;
        console.log('0324',values)
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            //新增
            const postData = {
              name:values.name,
              desc:values.desc,
              owner:values.owner_list&&values.owner_list.length ? values.owner_list.join(',') :'',
              publisher:values.publisher_list&&values.publisher_list.length ? values.publisher_list.join(',') :'',
              reader_condition:checked == 1 ? 1 : 2 ,//1:所有人,2:固定人
            }
            TemporaryPost(project_id,postData).then((res) => {
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

  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      checked: e.target.value,
    });
  };

  handleReaderPerson = value => {
    console.log('0324',value);
    this.setState({reader_list:value})
  }

  closeSelectUserModal = () => {
    this.setState({selectUserModalVisible:false})
  }

  showSelectUserModal = () => {
    this.setState({selectUserModalVisible:true})
  }

  confirmSelectUserModal = () => {
    this.setState({selectUserModalVisible:false})
  }

  showUser = (val) => {
    console.log('0325',val)
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { confirmLoading, spinLoading, factoryList, data,
      selectUserModalVisible } = this.state;
    // const formItemLayout = formData.formItemLayout;
    const _this = this;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10}
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const factory = factoryList instanceof Array && factoryList.length ? factoryList.map(d =>
      <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

    const formData = [
      {
        field: "name",
        type: "char",
        icon: "",
        value: data ? data.name : null,
        text: "目录名称",
        placeholder: "目录名称",
        rules: [{required: true, message: "请输入目录名称"}]
      },
      {
        field: "desc",
        type: "textarea",
        icon: "",
        value: data ? data.desc : null,
        text: "描述",
        placeholder: "描述",
        rules: [{required: true, message: "请输入描述"}]
      },
      {
        field: "owner_list",
        type: "search",
        mode: "multiple",
        icon: "",
        value: data ? data.owner.map(d => d.id+'') : null,
        text: "目录所有人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: this.state.searchOptions,
        rules: [{required: true, message: "请选择目录所有人"}]
      },
      {
        field: "publisher_list",
        type: "search",
        mode: "multiple",
        icon: "",
        value: data ? data.publisher.map(d => d.id+'') : null,
        text: "发布人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: this.state.searchOptions,
        rules: [{required: true, message: "请选择发布人"}]
      },
    ];

    const { id } = this.props.match.params
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="app.page.bread.document" defaultMessage="文档管理"/>
      },
      {
          name: <FormattedMessage id="app.page.bread.directory" defaultMessage="目录管理"/>,
          url: '/document/directory'
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
            <SelectUserModal 
              selectUserModalVisible={selectUserModalVisible}
              closeSelectUserModal={this.closeSelectUserModal}
              showUser={this.showUser}
            />
            <Form onSubmit={this.handleSubmit}>

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

              <FormItem  {...formItemLayout}
                  label={'查看人'}
                  required
              >
                <Radio.Group onChange={this.onChange} value={this.state.checked}>
                  <Radio value={1}>所有人</Radio>
                  <Radio value={2}>固定人员</Radio>
                </Radio.Group>
              </FormItem>

              {
                this.state.checked === 2 ?
                  <FormItem  {...formItemLayout}
                      label={' '}
                      colon={false}
                  >
                    <Select
                      // showArrow
                      mode="multiple"
                      showSearch
                      // allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      notFoundContent={this.state.fetching ? <Spin size="small"/> :
                        <FormattedMessage id="global.nodata" defaultMessage="暂无数据"/>}
                      placeholder={'输入姓名或者座机搜索'}
                      onSearch={this.fetchUser}
                      onChange={this.handleReaderPerson}
                      // value={this.state.search_id}
                    >
                      {
                        this.state.searchOptions.map(s => {
                          return <Option key={s.id} title={_util.searchConcat(s)}>{_util.searchConcat(s)}</Option>;
                        })
                      }
                    </Select>
                  </FormItem>
                  :
                  null
              }

              {/* <Button onClick={() => this.showSelectUserModal()}>Demo</Button> */}



              <FormItem {...submitFormLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                    style={{ marginRight: "10px" }}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存"/>
                  </Button>
                  <GoBackButton props={this.props} />
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const DirectoryAdd = Form.create()(TempAddForm);

export default DirectoryAdd;
