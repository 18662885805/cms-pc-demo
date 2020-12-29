import React from "react";
import {Form, Button, Modal, Spin, message, Select, Radio,List,Tag} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import {documentDirectoryDetail,documentDirectoryPut} from "@apis/document/directory";
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
      owner_list:[],
      data:{},
      search_data1:[],
      search_data2:[],
      reader_info_list:[],
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
  }

  componentDidMount () {
    const project_id = _util.getStorage('project_id');
    this.setState({project_id});
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
        this.props.history.replace('/404')
    } else {
        documentDirectoryDetail(project_id,{id:this.props.location.state.id}).then(res => {
            if(res.data){
                this.setState({
                  id:this.props.location.state.id,
                  data:res.data,
                  search_data1:res.data.owner ? res.data.owner :[],
                  search_data2:res.data.publisher ? res.data.publisher :[],
                  reader_info_list:res.data.reader&&res.data.reader.length ? res.data.reader :[],
                  checked:res.data.reader_condition ? res.data.reader_condition : 1
                })
            }
        })
    }
    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/document/directory");
    this.props.menuState.changeMenuOpenKeys("/document");
  }



  handleSubmit (e) {
    e.preventDefault();
    // this.setState({
    //   confirmLoading: true
    // });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        const {checked,reader_info_list,id} = this.state;
        var readerList = this.renderListToString(reader_info_list);
        var reader = readerList&&readerList.length ? readerList.join(',') :'';
        const project_id = _util.getStorage('project_id');
        const { formatMessage } = this.props.intl;
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            const postData = {
              id:id,
              name:values.name,
              desc:values.desc,
              owner:values.owner&&values.owner.length ? values.owner.join(',') :'',
              publisher:values.publisher&&values.publisher.length ? values.publisher.join(',') :'',
              reader_condition:checked == 1 ? 1 : 2 ,//1:所有人,2:固定人
              reader:checked == 1 ? '' : reader
            }
            documentDirectoryPut(project_id,postData).then((res) => {
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


  renderListToString = (list) => {
    var id_list = []
    if(list&&list.length){
      list.map(item => {
        if(item['project_user_id']){
          id_list.push(item['project_user_id'])
        }else{
          id_list.push(item['id'])
        }
      })
    }
    return id_list
  }

  fetchUser = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    this.setState({
      fetching: true,
      search_data1: []
    });
    SearchProjectUser({
      q: value,
      project_id: _util.getStorage('project_id')
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const search_data1 = res.data.map(user => ({
        name: user.name,
        value: user.name,
        text: user.name,
        id: user.id,
        org:user.org,
        tel: user.tel,
        phone: user.phone
      }));
      this.setState({
        search_data1,
        fetching: false
      });
    });
  }

  fetchUser2 = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    this.setState({
      fetching: true,
      search_data2: []
    });
    SearchProjectUser({
      q: value,
      project_id: _util.getStorage('project_id')
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const search_data2 = res.data.map(user => ({
        name: user.name,
        value: user.name,
        text: user.name,
        id: user.id,
        org:user.org,
        tel: user.tel,
        phone: user.phone
      }));
      this.setState({
        search_data2,
        fetching: false
      });
    });
  }

  selectUser2 = (value,field) => {
    console.log('0330',value)
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
            return u.project_user_id == s.id 
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
        <div><Tag color="red" style={{cursor:"pointer"}} onClick={() => this.deleteSelectedUser(item.id)}>删除</Tag></div>
      </List.Item>
    )
}

  deleteSelectedUser = (id) => {
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
      selectUserModalVisible,reader_info_list} = this.state;
    // const formItemLayout = formData.formItemLayout;
    const _this = this;

    console.log('0330',data)

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
      },
      {
        field: "owner",
        type: "search",
        mode: "multiple",
        icon: "",
        value: data&&data.owner ? data.owner.map(d => {return d.id +''}) : null,
        text: "目录所有人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: this.state.search_data1,
        fetchUser:  (value) => this.fetchUser(value),
        rules: [{required: true, message: "请选择目录所有人"}]
      },
      {
        field: "publisher",
        type: "search",
        mode: "multiple",
        icon: "",
        value: data&&data.publisher ? data.publisher.map(d =>{return d.id +''}) : null,
        text: "发布人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: this.state.search_data2,
        fetchUser:  (value) => this.fetchUser2(value),
        rules: [{required: true, message: "请选择发布人"}]
      },
    ];

    return (
      <div>
        <MyBreadcrumb  />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <SelectUserModal 
              selectUserModalVisible={selectUserModalVisible}
              closeSelectUserModal={this.closeSelectUserModal}
              showUser={this.showUser}
              showUserInfoList={this.showUserInfoList}
              that={this}
              selectedField={'testId'}
              keyId={'project_user_id'}
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
                <Radio.Group onChange={this.onChange} value={this.state.checked} >
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
                    {/* <Select
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
                    </Select> */}
                     <Button onClick={() => this.showSelectUserModal()} type='primary'>添加人员</Button>
                     {reader_info_list&&reader_info_list.length ? 
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
                    : null}
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

const DirectoryAdd = Form.create()(DirectoryAddForm);

export default DirectoryAdd;
