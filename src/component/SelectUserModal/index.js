import React from 'react'
import {Form, Button, Modal, Spin, message, Input, Select,InputNumber,DatePicker,Transfer,Tag,Table,Card,Switch} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import {trainingInfoList,trainstartPost} from '@apis/training/start'
import { SearchProjectUser } from "@apis/system/user";
import {
  SearchByWorkType,
  SearchByStaffType,
  workerType,
  ProjecWorkType
} from "@apis/staff";
import {SearchStaffTypeByOrg} from '@apis/home';
import moment from 'moment';
import difference from 'lodash/difference';
import styles from './index.module.css'


const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option
const { Search } = Input;
let _util = new CommonUtil()

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
class SelectUserModal extends React.Component {
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
      WorkTypeLabeledValue:''
    }
  }

  componentDidMount() {
    const project_id = _util.getStorage('project_id');
    this.setState({project_id});
    //获取该项目所有职务
    ProjecWorkType({project_id:project_id}).then(res => {
      if(res&&res.data){
          this.setState({work_type_list:res.data})
      }
  })
    //获取组织列表
    SearchStaffTypeByOrg({project_id:project_id}).then(res => {
      if(res.data){
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


    closeAddModal = () => {
        this.setState({
            addModal:false
        })
    }

    showAddModal = () => {
        this.setState({
            addModal:true
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

     // workerType({project_id:project_id}).then(res => {
    //     if(res&&res.data){
    //         this.setState({work_type_list:res.data})
    //     }
    // })

    setDataSource = (list) => {
      if(list&&list.length){
        var leftDataList = []
        list.map((person) => {
            const personObj = person;
            //personObj.key = this.props.keyId ? person[this.props.keyId] : person.id;
            personObj.key =person.id;
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
      })
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
      this.setState({WorkTypeLabeledValue:value})
      const value_list = value.key ? value.key.split('-') : [] ;
      var work_type_id = parseInt(value_list&&value_list.length ?  value_list[0] :'') 
      var org_id_2 = parseInt(value_list&&value_list.length ?  value_list[1] :'') 
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

    closeModal = () => {
      this.props.closeSelectUserModal();
      this.setState({dataSource:[],targetKeys:[]})
    }

    confirmUser = () => {
        const {targetKeys,sourceData} = this.state;
        var showUserList = []
        if(targetKeys&&targetKeys.length){
            targetKeys.forEach(id => {
                const targetObject = sourceData.find(data => {
                    return data.key == id
                });
                if(targetObject){
                    showUserList.push(targetObject)
                }
            });
        };
        this.closeModal();
        this.props.showUser(targetKeys);
        this.props.showUserInfoList(showUserList);
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
    } = this.state

    const {
        selectUserModalVisible,
        closeSelectUserModal,
        confirmSelectUserModal
    } = this.props;

    const orgOption = org_list instanceof Array && org_list.length ? org_list.map(d =>
      <Option key={d.org_id} value={d.org_id}>{d.org_name}</Option>) : [];

      const workTypeOption = work_type_list instanceof Array && work_type_list.length ? work_type_list.map(d =>
        <Option key={`${d.id}-${d.org_id}`} value={`${d.id}-${d.org_id}`}>{`${d.name}—${d.org_name}`}</Option>) : [];
 
    return (
        <Modal
            title={'添加人员'}
            visible={selectUserModalVisible}
            onOk={() => this.confirmUser()}
            onCancel={() => this.closeModal()}
            //onCancel={closeSelectUserModal}
            okText={'确认'} //提交
            cancelText={'取消'} //取消
            width='1300px'
            bodyStyle={{display:"flex",flexDirection:'column',alignItems:'center'}}
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
                    titles={['待选', '选中']}
                    // operations={['添加至选中区', '移出选中区']}
                    locale={{itemUnit:'人',itemsUnit:'人'}}
                    style={{width:'1200px'}}
                />
            </Spin>
        </Modal>
    )
  }
}

const TrainingTrainAdd = Form.create()(SelectUserModal)

export default TrainingTrainAdd
