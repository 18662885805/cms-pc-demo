import React from "react";
import {Form, Button, Modal, Spin, message, Select, Radio,List,Tag} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {SearchProjectUser} from "@apis/system/user";
import GoBackButton from "@component/go-back";
import SelectUserModal from "@component/SelectUserModal";
import {debounce} from "lodash";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import translation from '../translation'
import styles from './index.css'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class DirectoryAddForm extends React.Component {
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
      selectUserModalVisible:false,
      reader_info_list:[],
      testId:'',
      selectedUserList_loading:false,
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }

  componentDidMount () {
    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/completion/type");
    this.props.menuState.changeMenuOpenKeys("/completion");
  }



  handleSubmit (e) {
    e.preventDefault();
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
    this.setState({
      reader_list:val,
      reader:val&&val.length? val.join(',') :''
    })
  }

  showUserInfoList = (list) => {
    this.setState({selectedUserList_loading:true});
      const {reader_info_list} = this.state;
      if(list&&list.length){
        list.map(u => {
          //验证去重
          var  same_check =  reader_info_list.find(s => {
            return u.id == s.id 
          })         
          if(!same_check){
            reader_info_list.push(u)        
          }
        })
      }
      this.setState({reader_info_list,selectedUserList_loading:false})
  }

  renderShowList = (item) => {
    return(
      <List.Item className={styles.user_item}>
        <div>{item.name}-{item.phone}</div>
        <div><Tag color="red" style={{cursor:"pointer"}} onClick={() => this.deleteUser(item.id)}>删除</Tag></div>
      </List.Item>
    )
}

deleteUser = (id) => {
  this.setState({selectedUserList_loading:true})
  const {reader_info_list} = this.state;
  var new_selectedUserList = reader_info_list.filter(u => {
    return u.id != id
  });
  this.setState({reader_info_list:new_selectedUserList,selectedUserList_loading:false})
}

  render () {
    const { getFieldDecorator } = this.props.form;
    const { confirmLoading, spinLoading, factoryList, data,
      selectUserModalVisible,reader_info_list,selectedUserList_loading } = this.state;
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



    const formData = [
      {
        field: "name",
        type: "char",
        icon: "",
        value: data ? data.name : null,
        text: "类型名称",
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
      },
      {
        field: "owner_list",
        type: "search",
        mode: "multiple",
        icon: "",
        value: data ? data.owner.map(d => d.id+'') : null,
        text: "类型所有人",
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
          name: <FormattedMessage id="app.page.bread.document" defaultMessage="竣工文档"/>
      },
      {
          name: <FormattedMessage id="app.page.bread.directory" defaultMessage="类型配置"/>,
          url: '/completion/type'
      },
      {
        name: '新增',
        url: '/completion/type/add'
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
              showUserInfoList={this.showUserInfoList}
              that={this}
              selectedField={'testId'}
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
                    <Button onClick={() => this.showSelectUserModal()} type='primary'>添加人员</Button>
                    {reader_info_list&&reader_info_list.length ? 
                    <Spin spinning={selectedUserList_loading}>
                      <List
                          size="small"
                          header={
                              <div style={{textAlign:'center'}}>
                                  人员列表&nbsp; &nbsp; &nbsp; &nbsp;
                                  {`${reader_info_list ? reader_info_list.length : 0}人`}                                           
                              </div>
                          }
                          bordered
                          dataSource={reader_info_list}
                          renderItem={item => this.renderShowList(item)}
                      />
                    </Spin>
                      
                    : null}
                  </FormItem>
                  :
                  null
              }

              



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

const DirectoryAdd = Form.create()(DirectoryAddForm);

export default DirectoryAdd;
