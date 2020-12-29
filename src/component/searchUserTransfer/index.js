import React, { Component } from "react";
import {
  Button, Input, Modal, Select, Spin, Table, Transfer
} from "antd";
import styles from "../../view/common.css";
import difference from 'lodash/difference';
import CommonUtil from "@utils/common";
import {
  SearchByOrganization,
  SearchByWorkType,
  SearchByStaffType,
  SearchStaffCertificate,
  workerType,
  ProjecWorkType
} from "@apis/staff";
import {SearchStaffTypeByOrg} from '@apis/home';
import {flowRoleInfo,flowSearch} from "@apis/workflow/flow";

const {Search } = Input;
const leftTableColumns = [
  {
    dataIndex: 'name',
    title: '姓名',
    align:'center'
  },
  {
    dataIndex: 'phone',
    title: '手机',
    align:'center'
  },
  {
    dataIndex: 'organization_nam',
    title: '组织',
    align:'org'
  },
  // {
  //     dataIndex: 'staff_type_name',
  //     title: '身份',
  //     align:'center'
  //   },
  // {
  //     dataIndex: 'work_type_name',
  //     title: '职务',
  //     align:'center'
  // },
];
//选中区column
const rightTableColumns = [
  {
      dataIndex: 'name',
      title: '姓名',
      align:'center'
    },
    {
      dataIndex: 'phone',
      title: '手机',
      align:'center'
    },
    {
      dataIndex: 'organization_nam',
      title: '组织',
      align:'org'
    },
    // {
    //     dataIndex: 'staff_type_name',
    //     title: '身份',
    //     align:'center'
    //   },
    // {
    //     dataIndex: 'work_type_name',
    //     title: '职务',
    //     align:'center'
    // },

];

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
let _util = new CommonUtil();

class SearchUserTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        work_type_id:undefined,
        project_id:_util.getStorage('project_id'),
        org_id:undefined,
        WorkTypeLabeledValue:undefined,
        staff_type:undefined,
        search_info:"",
    };
  }

  componentDidMount() {
        console.log(this.props);
        setTimeout(function () {
          let{targetKeys,project_id}=this.state;
          if(this.props.sponsor&&this.props.sponsor.length>0){
              //targetKeys=this.props.sponsor.map(a=>a.project_id);
            targetKeys=this.props.sponsor.map(a=>a.id);
            console.log(targetKeys);
            this.setState({targetKeys});
            this.props.getSponsor(targetKeys);

            let _this=this;
            SearchByWorkType({
                project_id:project_id,
                search_info:''
              }).then((res) => {
                _this.setDataSource(res.data?res.data:'');
            });
          }
        }.bind(this),1000)

        // workerType({project_id:_util.getStorage('project_id'),org_id:localStorage.getItem('userdata')&&JSON.parse(localStorage.getItem('userdata')).org.id}).then(res => {
        //     if(res&&res.data){
        //         this.setState({work_type_list:res.data})
        //     }
        // });
        //
        // flowRoleInfo({project_id:_util.getStorage('project_id')}).then(res => {
        //     if(res&&res.data){
        //         this.setState({role_list:res.data})
        //     }
        // });
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //     console.log(nextProps);
  //     let{targetKeys}=this.state;
  //     if(this.props.sponsor&&this.props.sponsor.length>0){
  //         //targetKeys=this.props.sponsor.map(a=>a.project_id);
  //       targetKeys=this.props.sponsor.map(a=>a.id);
  //       console.log(targetKeys);
  //       this.setState({targetKeys});
  //       //this.props.getSponsor(targetKeys)
  //     }
  // }

    showAddModal = () => {
      const {project_id}=this.state;
      workerType({project_id:project_id,org_id:localStorage.getItem('userdata')&&JSON.parse(localStorage.getItem('userdata')).org.id}).then(res => {
            if(res&&res.data){
                this.setState({work_type_list:res.data})
            }
        });

        SearchStaffTypeByOrg({project_id:project_id}).then(res => {
          if(res.data){
              this.setState({role_list:res.data})
          }
        });

        // flowRoleInfo({project_id:_util.getStorage('project_id')}).then(res => {
        //     if(res&&res.data){
        //         this.setState({role_list:res.data})
        //     }
        // });

        this.setState({
            addModal:true
        })
  };

  closeAddModal = (type) => {
      const {targetKeys}=this.state;
      if(type===1){
        this.props.getSponsor(targetKeys)
      }
      this.setState({
          addModal:false
      })
  };

  setPersonType = (value) => {
      this.setState({tableLoading:true,staff_type:value,search_info:''});
      const {project_id,work_type_id,org_id} = this.state;
      if(value ||work_type_id||org_id){
          SearchByWorkType({
          project_id:project_id,
          work_type_id:work_type_id,
          staff_type:value,
          org_id:org_id
        }).then(res => {
        this.setDataSource(res.data?res.data:'');
      })}else{
          this.setState({sourceData:[],tableLoading:false})
      }
    };

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
    };

  setOrgType= (value) => {
      console.log(value)
      this.setState({tableLoading:true,org_id:value,search_info:'',WorkTypeLabeledValue:undefined});
      const {project_id,work_type_id,staff_type} = this.state;

      ProjecWorkType({project_id:project_id,org_id:value}).then(res => {
        if(res&&res.data){
          this.setState({work_type_list:res.data,work_type_id:''})
        }
      });

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
    };

  searchUser = (val) => {
        const{project_id}=this.state;
        this.setState({selectDisable:true});
        if(val){
            this.setState({tableLoading:true});
            SearchByWorkType({
                project_id:project_id,
                search_info:val
              }).then((res) => {
                this.setDataSource(res.data?res.data:'');
            });
        }else{
            this.setState({sourceData:[],tableLoading:false})
        }
    };

  setSearchInfo = (value) => {
      this.setState({search_info:value});
  };

  handleSelectDisable = (val) => {
      this.setState({selectDisable:false})
      if(!val){
        this.setState({org_id:undefined,staff_type:undefined,work_type_id:undefined,WorkTypeLabeledValue:undefined})
      }
  };

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

    setDataSource = (list) => {
      if(list&&list.length){
        var leftDataList = []
        list.map((person) => {
            const personObj = person;
            //personObj.key = person.id;
            personObj.key=person.project_user_id;
            leftDataList.push(personObj)
        });
        this.setState({sourceData:leftDataList,tableLoading:false})
      }else{
        this.setState({sourceData:[],tableLoading:false})
      }
    };

    selectWorkType = (value) => {
        console.log(value);
      this.setState({WorkTypeLabeledValue:value})
      // const value_list = value.key ? value.key.split('-') : [] ;
      // var work_type_id = parseInt(value_list&&value_list.length ?  value_list[0] :'')
      //var org_id_2 = parseInt(value_list&&value_list.length ?  value_list[1] :'')

      this.setState({tableLoading:true,work_type_id:value,search_info:''});
      const {project_id,staff_type,org_id} = this.state;
      if(staff_type||org_id||value){
        SearchByWorkType({
          project_id:project_id,
            work_type_id:value,
          //work_type_id:work_type_id,
          staff_type:staff_type,
          org_id:org_id
        }).then(res => {
          this.setDataSource(res.data?res.data:'');
        })
      }else{
        this.setState({sourceData:[],tableLoading:false})
      }
    }

  render () {
    const { leftWidth, rightWidth,conditionType,sponsor,dis_info } = this.props;
    const {selectDisable,confirmLoading, spinLoading, location_list, data,tableLoading,sourceData,targetKeys,role_list,search_info,
      postData,formOptions,approvalOptions,addModal,work_type_list,org_id,WorkTypeLabeledValue,staff_type}=this.state;

    console.log(this.state.targetKeys);
    // if(sponsor){
    //     this.setState({targetKeys:sponsor})
    // }

    return (
        <div>
            {
                conditionType===2?<div>
                    {`${this.state.targetKeys ? this.state.targetKeys.length : 0}人`}
                     &nbsp; &nbsp; &nbsp; &nbsp;
                    <Button icon="edit" onClick={() => this.showAddModal()} disabled={dis_info}>选择人员</Button>
                  </div>:null
            }

          <div>
            <Modal
                title={'添加人员'}
                visible={addModal}
                onOk={() => this.closeAddModal(1)}
                onCancel={() => this.closeAddModal(2)}
                okText={'确认'} //提交
                cancelText={'取消'} //取消
                width='1100px'
                bodyStyle={{display:"flex",flexDirection:'column',alignItems:'center'}}
            >
                <div className={styles.searchContainer}>
                    <Select
                        onChange={this.setOrgType}
                        style={{width:'200px'}}
                        placeholder={'---组织筛选---'}
                        allowClear={true}
                        disabled={selectDisable}
                        value={org_id}
                    >
                      {role_list.map(d => <Option key={d.org_id} value={d.org_id}>{d.org_name}</Option>)}
                    </Select>

                    <Select
                        onChange={this.setPersonType}
                        style={{width:'200px'}}
                        placeholder={'---人员类型筛选---'}
                        disabled={selectDisable}
                        allowClear
                        value={staff_type}
                    >
                      <Option value={1}>管理人员</Option>
                      <Option value={2}>安全人员</Option>
                      <Option value={3}>特殊工种</Option>
                      <Option value={4}>普工</Option>
                    </Select>

                    <Select
                        onChange={this.selectWorkType}
                        style={{width:'200px'}}
                        placeholder={'---职务类型筛选---'}
                        disabled={selectDisable}
                        allowClear
                        value = {WorkTypeLabeledValue}
                        // value={work_type_id ? work_type_id :'---职务类型筛选---'}
                    >
                      {work_type_list&&work_type_list.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
                    </Select>

                    <Search
                        placeholder="模糊搜索"
                        enterButton="搜索"
                        onSearch={value => this.searchUser(value)}
                        onChange={(e) => this.setSearchInfo(e.target.value)}
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
                        titles={['待选', '已选']}
                        // operations={['添加至选中区', '移出选中区']}
                        locale={{itemUnit:'人',itemsUnit:'人'}}
                        style={{width:'1000px'}}
                    />
                </Spin>
            </Modal>
          </div>
        </div>
    )
  }
}

export default SearchUserTransfer;