import React from "react";
import {Form, Button, Modal, Spin, message, Select, Radio} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import { channelForm, channelPost, channelDetail, channelPut } from "@apis/system/channel/index";
// import { factoryList } from "@apis/system/factory/index";
import {SearchProjectUser} from "@apis/system/user";
import GoBackButton from "@component/go-back";
import {debounce} from "lodash";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import translation from '../translation'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class ChannelAddForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      factoryList: [],
      searchOptions: [],
      checked: 1
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }

  componentDidMount () {

    const {id} = this.props.match.params;
    if (id) {
      channelDetail(
        id, {project_id: _util.getStorage('project_id')}
      ).then((res) => {
        const {user} = res.data
        this.setState({
          searchOptions: user,
          data: res.data
        });
      });
    }

    // factoryList().then((res) => {
    //   this.setState({
    //     factoryList: res.data.results,
    //     spinLoading: false
    //   });
    // });
    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/document/register");
    this.props.menuState.changeMenuOpenKeys("/document");
  }

  // componentWillMount () {
  //   // channelForm().then((res) => {
  //   //   this.setState({
  //   //     formData: res.data.results
  //   //   });
  //   // });
  //   this.setState({
  //     spinLoading: false
  //   });
  // }

  handleSubmit (e) {
    e.preventDefault();
    // this.setState({
    //   confirmLoading: true
    // });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        // values.factory_id = _this.props.location.state.factory_id;
        values.project = _util.getStorage('project_id');
        // values.project_id = _util.getStorage('project_id');
        values.user = Array.isArray(values.person) ? values.person.join(",") : values.person;
        const { formatMessage } = this.props.intl;
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            const { id } = _this.props.match.params;
            if (id) {
              channelPut(id, values).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
              return;
            }

            channelPost(values).then((res) => {
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
    if (value) {
      this.setState({
        search_id: value
      });
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { confirmLoading, spinLoading, factoryList, data } = this.state;
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
      // {
      //   field: "factory_id",
      //   type: "select",
      //   icon: "",
      //   value: data ? data.factory_id : null,
      //   text: "项目",
      //   placeholder: "项目",
      //   options: [
      //     {id: "b0213d52-af93-4a16-87f9-b5cd4a4d2960", name: "Szh1"},
      //     {id: "481ec590-d0db-4216-a379-c2519909c7ff", name: "Szh2"},
      //     {id: "c783d027-f922-4abc-8369-c404b4835986", name: "Szh3"},
      //     {id: "c783d027-f922-4abc-8369-c404b4835922", name: "Szh5"},
      //   ],
      //   rules: []
      // },
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
      // {
      //   field: "user",
      //   type: "select",
      //   mode: "multiple",
      //   icon: "",
      //   value: data ? data.phone : null,
      //   text: "门岗",
      //   placeholder: "门岗",
      //   options: [
      //     {id: "1f65944c-986b-421e-9403-8f55a5fbdce8", name: "wewer"},
      //     {id: "24cfa2f8-577d-487d-87af-b6385ccb4f0e", name: "qwe"}
      //   ],
      //   rules: []
      // }
      // {
      //   field: "role",
      //   type: "select",
      //   mode: "multiple",
      //   icon: "",
      //   value: role ? role.map(d => d.id) : null,
      //   text: "角色",
      //   // extra: "注：新权限在管理员审批通过后， 用户重新登录本账号方可生效。",
      //   placeholder: "角色",
      //   options: roleList,
      //   rules: [{required: true, message: "请选择角色"}],
      // },
      {
        field: "person",
        type: "search",
        mode: "multiple",
        icon: "",
        // value: data ? data.user[0].id+'' : null,
        value: data ? data.owner.map(d => d.id+'') : null,
        text: "目录所有人",
        placeholder: "根据姓名、手机、邮箱搜索项目用户",
        options: this.state.searchOptions,
        rules: [{required: true, message: "请选择目录所有人"}]
      },
      {
        field: "person",
        type: "search",
        mode: "multiple",
        icon: "",
        // value: data ? data.user[0].id+'' : null,
        value: data ? data.publisher.map(d => d.id+'') : null,
        text: "发布人",
        placeholder: "根据姓名、手机、邮箱搜索项目用户",
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
          name: <FormattedMessage id="app.page.bread.register" defaultMessage="注册文档区"/>,
          url: '/document/register'
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
                      // onChange={this.handleReaderPerson}
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

              {/* <FormData data={formData} form={this.props.form} layout={formItemLayout} /> */}


              {/*{*/}
                {/*formData.content ? formData.content.map((item, index) => {*/}
                  {/*return (*/}
                    {/*<FormItem*/}
                      {/*key={index}*/}
                      {/*label={item.text}*/}
                      {/*hasFeedback*/}
                      {/*{...formItemLayout}*/}
                    {/*>*/}
                      {/*{*/}
                        {/*item.value*/}
                          {/*? getFieldDecorator(item.field, {*/}
                            {/*initialValue: item.value,*/}
                            {/*rules: item.rules*/}
                          {/*})(*/}
                            {/*_util.switchItem(item, _this)*/}
                          {/*)*/}
                          {/*: getFieldDecorator(item.field, {*/}
                            {/*rules: item.rules*/}
                          {/*})(*/}
                            {/*_util.switchItem(item, _this)*/}
                          {/*)*/}
                      {/*}*/}
                    {/*</FormItem>*/}
                  {/*);*/}
                {/*}) : ""*/}
              {/*}*/}

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

const ChannelAdd = Form.create()(ChannelAddForm);

export default ChannelAdd;
