import React from 'react'
import {Form, Button, Modal, Spin, message, Input, Select,InputNumber,DatePicker,Transfer,Tag,Table,Card,Switch,
List,Checkbox,Radio} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {trainingInfoList,trainstartPost} from '@apis/training/start'
import { SearchProjectUser } from "@apis/system/user";
import {
  SearchByOrganization,
  SearchByWorkType,
  SearchByStaffType,
  SearchStaffCertificate,
  workerType,
  ProjecWorkType
} from "@apis/staff";
import {SearchStaffTypeByOrg} from '@apis/home';
import GoBackButton from '@component/go-back'
import moment from 'moment';

import difference from 'lodash/difference';
import styles from './index.css'
import { useFlexLayout } from 'react-table'
import values from 'postcss-modules-values'

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option
const { Search } = Input;
let _util = new CommonUtil()

const messages = defineMessages({
  confirm_title: {
    id: 'app.confirm.title.submit',
    defaultMessage: '确认提交?',
  },
  confirm_content: {
    id: 'app.common.button.content',
    defaultMessage: '单击确认按钮后，将会提交数据',
  },
  okText: {
    id: 'app.button.ok',
    defaultMessage: '确认',
  },
  cancelText: {
    id: 'app.button.cancel',
    defaultMessage: '取消',
  },
  save_success: {
    id: 'app.message.save_success',
    defaultMessage: '保存成功',
  },
  train_name_check: {
    id: 'app.train.check.train_name_check',
    defaultMessage: '请输入培训名称',
  },
  train_score_check:{
    id: 'app.train.check.train_score_check',
    defaultMessage: '请输入每题分数',
  },
  train_duration_check: {
    id: 'app.train.check.train_duration_check',
    defaultMessage: '请输入培训时间',
  },
  train_count_check:{
    id: 'app.train.check.train_count_check',
    defaultMessage: '请输入培训题数',
  },
  train_clearance_check:{
    id: 'app.train.check.train_clearance_check',
    defaultMessage: '请输入培训合格分数',
  },
  train_desc_check:{
    id: 'app.train.check.train_desc_check',
    defaultMessage: '请输入培训描述',
  },
  desc: {
    id: 'app.placeholder.material.desc',
    defaultMessage: '描述',
  },
  train_materials_check:{
    id: 'app.train.check.train_materials_check',
    defaultMessage: '请选择培训资料',
  },
  train_role_check:{
    id: 'app.train.check.train_role_check',
    defaultMessage: '请选择培训角色',
  },
  train_expire_time_check:{
    id: 'app.train.check.train_expire_time_check',
    defaultMessage: '请选择截止日期',
  },
  certificate_expire_time_check:{
    id:'app.train.check.certificate_expire_time_check',
    defaultMessage: '请选择证书有效期',
  },
  train_user_check:{
    id: 'app.train.check.train_user_check',
    defaultMessage: '请选择培训人员',
  },
  select: {
    id: 'app.placeholder.select',
    defaultMessage: '-- 请选择 --',
  },
  selectUserByDepartment: {
    id: 'app.placeholder.department',
    defaultMessage: '-- 请输入部门 --',
  },

  nodata: {
    id: 'app.placeholder.nodata',
    defaultMessage: '暂无数据',
  },
});

//待选区column
const leftTableColumns = [
  {
    dataIndex: 'name',
    title: '姓名',
    align:'center',
    width:100
  },
  {
    dataIndex: 'phone',
    title: '手机',
    align:'center',
    width:120
  },
  {
    dataIndex: 'organization_nam',
    title: '组织',
    align:'center'
  },
  {
      dataIndex: 'staff_type_name',
      title: '身份',
      align:'center',
      width:80
    },
  {
      dataIndex: 'work_type_name',
      title: '职务',
      align:'center',
      width:100
  },
];
//选中区column
const rightTableColumns = [
  {
      dataIndex: 'name',
      title: '姓名',
      align:'center',
      width:100
    },
    {
      dataIndex: 'phone',
      title: '手机',
      align:'center',
      width:120
    },
    {
      dataIndex: 'organization_nam',
      title: '组织',
      align:'center',
      
    },
    {
        dataIndex: 'staff_type_name',
        title: '身份',
        align:'center',
        width:80
      },
    {
        dataIndex: 'work_type_name',
        title: '职务',
        align:'center',
        width:100
    },

];

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer 
      {...restProps} 
      showSelectAll={false}
      titles={restProps.titles}
      operations={restProps.operations}
      style={restProps.style}
      locale={restProps.locale}
  >
    {({
      tableLoading,
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
          onSelectAll(selected, selectedRows) {
              const treeSelectedKeys = selectedRows.map(({ key }) => key);
              const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys);
              onItemSelectAll(diffKeys, selected);
          },
          onSelect({ key }, selected) {
              onItemSelect(key, selected);
          },
          selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          bordered={true}
          size="small"
          loading={restProps.tableLoading}
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          scroll={{ y: 240 }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

@injectIntl
class TrainingTrainAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      fetching: false,
      name: '',
      desc: '',
      expireTime:'',
      certificateExpireTime:'',
      addModal:false,

      targetKeys: [],
      selectedKeys: [],
      disabled: false,
      sourceData:[],
      tableLoading:false,
      training_list:[],
      org_list:[],
      work_type_list:[],
      targetKeys:[],
      selectDisable:false,
      org_id:'',
      work_type_id:'',
      staff_type:'',
      search_info:'',
      WorkTypeLabeledValue:'',
      selectedUserList:[],
      selectedUserList_loading:false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const project_id = _util.getStorage('project_id');
    this.setState({project_id});
    //获取培训列表
    trainingInfoList({project_id:project_id}).then(res => {
      console.log('0308',res.data)
      if(res&&res.data){
          this.setState({training_list:res.data})
      }
    });
    //获取该项目所有职务
    ProjecWorkType({project_id:project_id}).then(res => {
        if(res&&res.data){
            this.setState({work_type_list:res.data})
        }
    })
    //获取组织列表
    SearchStaffTypeByOrg({project_id:project_id}).then(res => {
      if(res.data){
          console.log('0316',res.data);
          this.setState({org_list:res.data})
      }
    })
    this.setState({
        spinLoading: false
    })
  }



  handleChangeUser = (value) => {
    this.setState({selectedUsers:value})
  }

  onChangeBeginDay = (date, dateString) => {
    this.setState({stratTime:dateString})
  }

  onChangeEndDay = (date, dateString) => {
    this.setState({endTime:dateString})
  }

  
  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  }

  //role,user,materials:string:A,B,C,D
  testPost = () => {
    const project_id = _util.getStorage('project_id');
    let data = {
      training:1,
      length:10,
      clearance:60,
      examination_time:30,
      begin_day:'2020-03-09',
      end_day:'2020-04-09',
      is_access_card:false,
      users:'5,6,7'
    };
    trainstartPost(project_id,data)
  }

  handleSubmit(e) {
    e.preventDefault()
    const {formatMessage} = this.props.intl;
    const {selectedUserList} = this.state;
    if(selectedUserList&&selectedUserList.length){
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const _this = this
          _this.setState({
            confirmLoading: true
          });
          values.begin_day = this.state.stratTime;
          values.end_day = this.state.endTime;
          values.is_access_card = values.is_access_card ? true : false;
          values.users = selectedUserList&&selectedUserList.length ? _util.renderListToString(selectedUserList,'id') :'';
          //values.user = this.state.targetKeys&&this.state.targetKeys.length ? this.state.targetKeys.join(',') :'';
          confirm({
            title: '确认提交?',
            content: '单击确认按钮后，将会提交数据',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              const project_id = _util.getStorage('project_id');
              trainstartPost(project_id,values).then((res) => {
                message.success('保存成功')      
                _this.props.history.goBack()
              })
            },
            onCancel() {
            },
          })
          this.setState({
            confirmLoading: false
          })
        }
      })
    }else{
      message.warning('请选择人员!')
    }
    
  }

  //确认选中的人
  confirmTargetUser = () => {
    this.setState({selectedUserList_loading:true})
    const {sourceData,targetKeys,selectedUserList} = this.state;
    if(targetKeys&&targetKeys.length){
        targetKeys.forEach(id => {
            const targetObject = sourceData.find(data => {
                return data.key == id
            });
            if(targetObject){
              //去重
              var  same_check =  selectedUserList.find(s => {
                return s.id == id 
              })
              console.log('0331',same_check);
              if(!same_check){
                selectedUserList.push(targetObject)
              }
            }
        });
    };
    this.setState({selectedUserList:selectedUserList,selectedUserList_loading:false})
    this.closeAddModal();
}

    closeAddModal = () => {
        this.setState({
            addModal:false
        })
    }

    showAddModal = () => {
        this.setState({
            addModal:true,
            dataSource:[],
            targetKeys:[]
        })
    }

    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };
    
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });   
        console.log('sourceSelectedKeys: ', sourceSelectedKeys);//当前待选区选中key
        console.log('targetSelectedKeys: ', targetSelectedKeys);//当前选中区选中key
    };
    
    handleScroll = (direction, e) => {
        console.log('0302','direction:', direction);
        console.log('0302','target:', e.target);
    };
    
    renderItem = (item,index) => {
        const customLabel = (
          <span className="custom-item">
            <Tag color="#108ee9"> {item.name}</Tag>-{item.phone}        
          </span>
        );
        return {
          label: customLabel, // for displayed item
          value: item.id, // for title and filter matching
        };
    };

    searchUser = (val) => {
        if(val){
            this.setState({tableLoading:true});
            SearchProjectUser({ q: val, project_id: _util.getStorage('project_id') }).then((res) => {
                if(res.data && res.data.length){
                    var leftDataList = []
                    res.data.map((person) => {
                        const personObj = person;
                        personObj.key = person.id;
                        leftDataList.push(personObj)
                    });
                    this.setState({sourceData:leftDataList,tableLoading:false})
                }else{
                    this.setState({sourceData:[],tableLoading:false})
                }          
            });
        }else{
            this.setState({sourceData:[],tableLoading:false})
        }
    }

    setPersonType = (value) => {
      this.setState({tableLoading:true});
      const project_id = _util.getStorage('project_id');
      SearchByStaffType({project_id:project_id,staff_type:value}).then(res => {
        if(res.data && res.data.length){
          var leftDataList = []
          res.data.map((person) => {
              const personObj = person;
              personObj.key = person.id;
              leftDataList.push(personObj)
          });
          this.setState({sourceData:leftDataList,tableLoading:false})
        }else{
            this.setState({sourceData:[],tableLoading:false})
        }          
      })
    }

    setWorkType= (value) => {
      this.setState({tableLoading:true});
      const project_id = _util.getStorage('project_id');
      SearchByWorkType({project_id:project_id,work_type_id:value}).then(res => {
        if(res.data && res.data.length){
          var leftDataList = []
          res.data.map((person) => {
              const personObj = person;
              personObj.key = person.id;
              leftDataList.push(personObj)
          });
          this.setState({sourceData:leftDataList,tableLoading:false})
        }else{
            this.setState({sourceData:[],tableLoading:false})
        }          
      })
    }


    setDataSource = (list) => {
      if(list&&list.length){
        var leftDataList = []
        list.map((person) => {
            const personObj = person;
            personObj.key = person.id;
            leftDataList.push(personObj)
        });
        this.setState({sourceData:leftDataList,tableLoading:false})
      }else{
        this.setState({sourceData:[],tableLoading:false})
      }
    }

    //筛选组织
    selectOrg = (value) => {
      this.setState({tableLoading:true,org_id:value,search_info:'',WorkTypeLabeledValue:''});
      //获取该组织职务
      ProjecWorkType({project_id:this.state.project_id,org_id:value}).then(res => {
        if(res&&res.data){
          this.setState({work_type_list:res.data,work_type_id:''})
        }
      });
      //搜索  
      const {project_id,work_type_id,staff_type} = this.state;
      if(value || work_type_id || staff_type){
        //有任一筛选条件
        SearchByWorkType({
          project_id:project_id,
          work_type_id:'',
          staff_type:staff_type,
          org_id:value
        }).then(res => {
          this.setDataSource(res.data?res.data:'');      
        })
      }else{
        //无筛选条件
        this.setState({sourceData:[],tableLoading:false})
      }
    }

    selectStaffType = (value) => {
      this.setState({tableLoading:true,staff_type:value,search_info:''});
      const {project_id,work_type_id,org_id} = this.state;
      if(value || work_type_id || org_id){
        SearchByWorkType({
          project_id:project_id,
          work_type_id:work_type_id,
          staff_type:value,
          org_id:org_id
        }).then(res => {
          this.setDataSource(res.data?res.data:'');   
        })
      }else{
        this.setState({sourceData:[],tableLoading:false})
      }
    }

    selectWorkType = (value) => {
      console.log('0330',value);
      this.setState({WorkTypeLabeledValue:value})
      const value_list = value.key ? value.key.split('-') : [] ;
      var work_type_id = parseInt(value_list&&value_list.length ?  value_list[0] :'') 
      var org_id_2 = parseInt(value_list&&value_list.length ?  value_list[1] :'') 
      console.log('0326',work_type_id)
      this.setState({tableLoading:true,work_type_id:work_type_id,search_info:''});
      const {project_id,staff_type,org_id} = this.state;
      if(staff_type||org_id||work_type_id){
        SearchByWorkType({
          project_id:project_id,
          work_type_id:work_type_id,
          staff_type:staff_type,
          org_id:org_id ? org_id :org_id_2
        }).then(res => {
          this.setDataSource(res.data?res.data:'');   
        })
      }else{
        this.setState({sourceData:[],tableLoading:false})
      }
    }

    // selectWorkType = (value) => {
    //   this.setState({tableLoading:true,work_type_id:value,search_info:''});
    //   const {project_id,staff_type,org_id} = this.state;
    //   if(staff_type||org_id||value){
    //     SearchByWorkType({
    //       project_id:project_id,
    //       work_type_id:value,
    //       staff_type:staff_type,
    //       org_id:org_id
    //     }).then(res => {
    //       this.setDataSource(res.data?res.data:'');   
    //     })
    //   }else{
    //     this.setState({sourceData:[],tableLoading:false})
    //   }
    // }


    setSearchInfo = (value) => {
      this.setState({search_info:value});
    }

    selectSearchInfo = (value) => {
      this.setState({tableLoading:true,search_info:value,selectDisable:true});
      const {project_id} = this.state;
      SearchByWorkType({
        project_id:project_id,
        search_info:value
      }).then(res => {
        this.setDataSource(res.data?res.data:'');     
      })
    }

    handleSelectDisable = (val) => {
      this.setState({selectDisable:false})
      if(!val){
        this.setState({org_id:'',staff_type:'',work_type_id:''})
      }
    }

    renderInfoList = (item) => {
      return(
      <List.Item className={styles.user_item}>
        <div>{item.name}-{item.phone}</div>
        <div><Tag color="red" style={{cursor:"pointer"}} onClick={() => this.deleteUser(item.id)}>删除</Tag></div>
      </List.Item>
      )
    }

    deleteUser = (id) => {
      this.setState({selectedUserList_loading:true})
      const {selectedUserList} = this.state;
      var new_selectedUserList = selectedUserList.filter(u => {
        return u.id != id
      });
      this.setState({selectedUserList:new_selectedUserList,selectedUserList_loading:false})
    }


    

 
  render() {
    const {getFieldDecorator} = this.props.form
    const { formatMessage } = this.props.intl
    const {
      confirmLoading,
      spinLoading,
      addModal,
      targetKeys,
      selectedKeys,
      sourceData,
      tableLoading,
      training_list,
      org_list,
      work_type_list,
      selectDisable,
      org_id,
      staff_type,
      work_type_id,
      search_info,
      WorkTypeLabeledValue,
      selectedUserList,
      selectedUserList_loading,
    } = this.state

    

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
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10},
      },
    };

    const trainingOption = training_list instanceof Array && training_list.length ? training_list.map(d =>
      <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

    const orgOption = org_list instanceof Array && org_list.length ? org_list.map(d =>
      <Option key={d.org_id} value={d.org_id}>{d.org_name}</Option>) : [];

  // const workTypeOption = work_type_list instanceof Array && work_type_list.length ? work_type_list.map(d =>
  //   <Option key={d.id} value={d.id}>{`${d.name}(${d.org_name})`}</Option>) : [];

    const workTypeOption = work_type_list instanceof Array && work_type_list.length ? work_type_list.map(d =>
    <Option key={`${d.id}-${d.org_id}`} value={`${d.id}-${d.org_id}`}>{`${d.name}—${d.org_name}`}</Option>) : [];

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="menu.training" defaultMessage="培训管理"/>
      },
      {
          name: '培训启动',
          url: '/training/start/training'
      },
      {
        name: <FormattedMessage id="page.component.breadcrumb.add" defaultMessage="新增"/>
      },
    ]
 
    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                label={<FormattedMessage id="page.training.myrecord.myrecord_name" defaultMessage="培训名称" />}
                {...formItemLayout}
              >
                {getFieldDecorator('training', {
                  rules: [{
                    required: true,
                    message: '请选择培训',        
                  }],
                })(
                  <Select
                    placeholder={formatMessage(messages.select)}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                      {trainingOption}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'培训开始日期'} >
                {getFieldDecorator('begin_day', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.train_expire_time_check),         
                    },
                  ],
                })(
                  <DatePicker 
                    onChange={this.onChangeBeginDay}
                    showToday={false}
                    disabledDate={this.disabledDate}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={'培训结束日期'} >
                {getFieldDecorator('end_day', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.train_expire_time_check),         
                    },
                  ],
                })(
                  <DatePicker 
                    onChange={this.onChangeEndDay}
                    showToday={false}
                    disabledDate={this.disabledDate}
                  />
                )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={'是否关联门禁'}>
                  {getFieldDecorator("is_access_card", {
                  })(
                    <Radio.Group>
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label={'培训人员'} >
                {/* {`${this.state.targetKeys ? this.state.targetKeys.length : 0}人`}
                &nbsp; &nbsp; &nbsp; &nbsp; */}
                <Button type='primary' icon="edit" onClick={() => this.showAddModal()}>添加人员</Button>
                {selectedUserList&&selectedUserList.length ? 
                <Spin spinning={selectedUserList_loading}>
                  <List
                      size="small"
                      header={
                          <div style={{textAlign:'center'}}>
                              人员列表&nbsp; &nbsp; &nbsp; &nbsp;
                              {`${selectedUserList ? selectedUserList.length : 0}人`}                                           
                          </div>
                      }
                      bordered
                      dataSource={selectedUserList}
                      renderItem={item => this.renderInfoList(item)}
                  />
                </Spin>                
                : null}
              </FormItem>
              <FormItem {...submitFormLayout}>
                <div style={{width: '100%', marginBottom: '20px'}}>
                  <Button type="primary" htmlType="submit" loading={confirmLoading}
                          style={{marginRight: '10px'}}>
                     <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                  <GoBackButton props={this.props}/>
                </div>
              </FormItem>
            </Form>
            <Modal
                title={'添加人员'}
                visible={addModal}
                onOk={() => this.confirmTargetUser()}
                onCancel={() => this.closeAddModal()}
                okText={'确认'} //提交
                cancelText={'取消'} //取消
                width='1300px'
                bodyStyle={{display:"flex",flexDirection:'column',alignItems:'center'}}
                destroyOnClose
            >
                <div className={styles.searchContainer}>
                    <Select
                        onChange={this.selectOrg}
                        style={{width:'200px'}}
                        placeholder={'---组织筛选---'}
                        disabled={selectDisable}
                        allowClear
                        value={org_id ? org_id :'---组织筛选---'}
                    >
                      {orgOption}
                    </Select>
                    <Select
                        onChange={this.selectStaffType}
                        style={{width:'200px'}}
                        placeholder={'---人员类型筛选---'}
                        disabled={selectDisable}
                        allowClear
                        value={staff_type ? staff_type : '---人员类型筛选---'}
                    >
                      <Option value={1}>管理人员</Option>
                      <Option value={2}>安全人员</Option>
                      <Option value={3}>特殊工种</Option>
                      <Option value={4}>普通员工</Option>
                    </Select>
                    <Select
                        onChange={this.selectWorkType}
                        style={{width:'200px'}}
                        placeholder={'---职务类型筛选---'}
                        disabled={selectDisable}
                        allowClear
                        //value={work_type_id ? work_type_id :'---职务类型筛选---'}
                        value = {WorkTypeLabeledValue?WorkTypeLabeledValue:{key:0,label:'---职务类型筛选---'}}
                        labelInValue
                    >
                      {workTypeOption}
                    </Select>
                    <Search
                        placeholder="模糊搜索"
                        enterButton="搜索"
                        onChange={(e) => this.setSearchInfo(e.target.value)}
                        onSearch={value => this.selectSearchInfo(value)}
                        onBlur={() => this.handleSelectDisable(false)}
                        style={{width:'200px'}}
                        value={search_info}
                    />
                </div>
                <Spin spinning={tableLoading}>
                     <TableTransfer
                        dataSource={sourceData}
                        targetKeys={targetKeys}
                        onChange={this.handleChange}//转移数据后
                        onSelectChange={this.handleSelectChange}//选中数据时
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                        tableLoading={tableLoading}
                        titles={['待选', '参加培训']}
                        // operations={['添加至选中区', '移出选中区']}
                        locale={{itemUnit:'人',itemsUnit:'人'}}
                        style={{width:'1200px'}}
                    />
                </Spin>
            </Modal>
          </Spin>
        </div>
      </div>
    )
  }
}

const TrainingTrainAdd = Form.create()(TrainingTrainAddForm)

export default TrainingTrainAdd
