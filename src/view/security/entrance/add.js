import React from 'react'
import {
    Form, Button, Modal, Spin, Tree, Select, message,  Input, Row, Col, Switch, Transfer,Table,Card,Tag,List
} from 'antd'
import {inject, observer} from "mobx-react/index";
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {user} from "@apis/myadmin/user"
import {SearchProjectUser} from "@apis/system/user";
import {
    SearchByStaffType,
    workerType
  } from "@apis/staff";
import {entrancePost,org_staff,orgApprove,EntryTraining,orgApproveList,FactoryapplyPost2} from '@apis/security/factoryapply'
import {trainingInfoList} from '@apis/training/start'
import GoBackButton from '@component/go-back'
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import debounce from 'lodash/debounce'
import difference from 'lodash/difference';
import styles from './index.css'
import moment from 'moment'
const FormItem = Form.Item
const confirm = Modal.confirm
const { Option } = Select;
const { Search } = Input;
let _util = new CommonUtil()


//待选区column
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
        dataIndex: 'staff_type_name',
        title: '身份',
        align:'center'
      },
    {
        dataIndex: 'work_type_name',
        title: '职务',
        align:'center'
    },
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
          dataIndex: 'staff_type_name',
          title: '身份',
          align:'center'
        },
      {
          dataIndex: 'work_type_name',
          title: '职务',
          align:'center'
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



@inject("menuState") @injectIntl
class EntranceAddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            formData: {},
            spinLoading: true,  
            targetKeys: [],
            selectedKeys: [],
            disabled: false,
            sourceData:[],
            tableLoading:false,
            searchDisable:false,
            approval_list: [],
            factory_approve:'',
            need_training:false,
            training_list:[],
            work_type_list:[],
            addModal:false,
            showUserList:[]
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {  
        const project_id = _util.getStorage('project_id');
        let userdata = _util.getStorage('userdata');
        if(userdata.org){
            this.setState({
                org_name:userdata.org.company ? userdata.org.company : '',
                org_id:userdata.org.id ? userdata.org.id: ''
            });
            this.setState({tableLoading:true})
            //该组织下所有人员
            org_staff({project_id:project_id,organization_id:userdata.org.id}).then(res => {
                if(res&&res.data){
                    var leftDataList = []
                    //待审批
                    if(res.data.data_wait&&res.data.data_wait.length){
                        res.data.data_wait.map((person) => {
                            const personObj = person;
                            personObj.key = person.id;
                            leftDataList.push(personObj)
                        });
                    }
                    
                    this.setState({sourceData:leftDataList})
                }
                this.setState({tableLoading:false})
            });
            //绿码审批人
            orgApproveList({project_id:project_id,org_id:userdata.org.id}).then(res => {
                if(res&&res.data){
                    this.setState({approval_list:res.data})
                }
            });
            //入场培训
            EntryTraining({project_id:project_id}).then(res => {
                if(res&&res.data){
                    this.setState({training_list:res.data})
                }
            });
            //职务
            workerType({project_id:project_id,org_id:userdata.org.id}).then(res => {
                if(res&&res.data){
                    this.setState({work_type_list:res.data})
                }
            })
        }else{
            message.warning('123')
        }
        this.setState({
            spinLoading: false,
        });
        
    }

    handleSubmit(e) {
        e.preventDefault() 
        const {factory_approve,targetKeys,need_training} = this.state;
        if(targetKeys.length == 0){
            message.warning('请选择人员')
            return
        }
        this.setState({
            confirmLoading: true
        })
        const project_id = _util.getStorage('project_id');
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _this = this
                const { formatMessage } = this.props.intl;
                const data = {
                    training:values.training&&values.training.length ? values.training.join(',') : '',
                    need_training:need_training,
                    staff:targetKeys.length ? targetKeys.join(',') :'',
                    factory_approve:factory_approve,
                    apply_remark:values.remarks ? values.remarks :'',
                };
                console.log('0413',data)
                confirm({
                    title: '确认提交?',
                    content: '单击确认按钮后，将会提交数据',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        FactoryapplyPost2(project_id,data).then((res) => {
                            message.success('添加成功');
                            _this.props.history.goBack()
                        })
                    },
                    onCancel() {
                    },
                })
            } else {
            }
            this.setState({
                confirmLoading: false
            })
        })
    }

    getAllMyAdminUser = () => {
        this.setState({tableLoading:true})
        user().then((res) => {
            if(res.data && res.data.results){
                var leftDataList = []
                res.data.results.map((person) => {
                    const personObj = person;
                    personObj.key = person.id;
                    leftDataList.push(personObj)
                });
                this.setState({sourceData:leftDataList})
            }
            this.setState({tableLoading:false})
        })
    }

    setPersonType = (value) => {
        //this.setState({tableLoading:true})
        // const project_id = _util.getStorage('project_id');
        // SearchByStaffType({project_id:project_id,staff_type:value}).then(res => {
        //   if(res.data && res.data.length){
        //     var leftDataList = []
        //     res.data.map((person) => {
        //         const personObj = person;
        //         personObj.key = person.id;
        //         leftDataList.push(personObj)
        //     });
        //     this.setState({sourceData:leftDataList,tableLoading:false})
        //   }else{
        //       this.setState({sourceData:[],tableLoading:false})
        //   }          
        // })
        this.setState({tableLoading:true})
        const {sourceData} = this.state;
        const filterData = sourceData.filter(item => 
            {return item.staff_type == value} 
        )
        console.log('0308',filterData,sourceData,value)
        if(filterData&&filterData.length){
            var leftDataList = []
            filterData.map((person) => {
                const personObj = person;
                personObj.key = person.id;
                leftDataList.push(personObj)
            });
            this.setState({sourceData:leftDataList,tableLoading:false})
        }else{
            this.setState({sourceData:[],tableLoading:false})
        }     
    }


    handleApprove = value => {
        console.log('0308',value)
        if(value && value.key){
            this.setState({
                factory_approve:parseInt(value.key)
            })
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
    
    handleScroll = (direction, e) => {
        console.log('0302','direction:', direction);
        console.log('0302','target:', e.target);
    };
    
    handleDisable = disabled => {
        this.setState({ disabled });
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
            this.getAllMyAdminUser();
        }
    }

    handleNeedTraining = (val) => {
        this.setState({need_training:val})
    }
    

    showAddModal = () => {
        this.setState({
            addModal:true
        })
    }

    //确认选中的人
    confirmTargetUser = () => {
        const {sourceData,targetKeys} = this.state;
        var showUserList = []
        if(targetKeys&&targetKeys.length){
            targetKeys.forEach(id => {
                console.log('0311','-------',id,sourceData)
                const targetObject = sourceData.find(data => {
                    return data.key == id
                });
                if(targetObject){
                    showUserList.push(targetObject)
                }
            });
        };
        console.log('0311','-------',showUserList)
        this.setState({showUserList:showUserList})
        this.closeAddModal();
    }

    closeAddModal = () => {
        this.setState({
            addModal:false
        })
    }

    renderShowList = (item) => {
        return(
        <List.Item>姓名:&nbsp;{item.name}&nbsp;&nbsp;&nbsp;&nbsp;手机:&nbsp;{item.phone}</List.Item>
        )
    }
    



    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;
        const { 
            confirmLoading, spinLoading,approval_list,training_list,targetKeys,addModal,
            selectedKeys,sourceData,oriTargetKeys,tableLoading,need_training,work_type_list ,showUserList
        } = this.state
        const _this = this;


        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 10 }
            }
        };
        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 10 }
            }
        };

        const workTypeOption = work_type_list instanceof Array && work_type_list.length ? work_type_list.map(d =>
            <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

            const bread = [
                {
                    name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
                    url: '/'
                },
                {
                    name: '入场管理'
                },
                {
                    name: '绿码申请',
                    url: '/staff/list/factoryapply'
                },
                {
                    name:'新增',
                    url: '/staff/list/factoryapply/add'
                }
              ]

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper content-no-table-wrapper">
                    <Spin spinning={spinLoading}>
                        <Form onSubmit={this.handleSubmit}>   
                            <FormItem
                                {...formItemLayout}
                                label={'申请人员'}
                                required
                            >              
                                    <Button type='primary' icon="edit" onClick={() => this.showAddModal()}>选择人员</Button>
                                    {this.state.targetKeys&&this.state.targetKeys.length ? 
                                        <List
                                            size="small"
                                            header={
                                                <div style={{textAlign:'center'}}>
                                                    申请列表&nbsp; &nbsp; &nbsp; &nbsp;
                                                    {`${this.state.targetKeys ? this.state.targetKeys.length : 0}人`}                                           
                                                </div>
                                            }
                                            bordered
                                            dataSource={showUserList}
                                            renderItem={item => this.renderShowList(item)}
                                        />
                                    : null}                                  
                            </FormItem>                        
                            <FormItem label={'审批人'} {...formItemLayout}>
                                {getFieldDecorator('factory_approve', {
                                    rules: [{required: true, message:'请选择'}],
                                })(
                                    <Select
                                        labelInValue
                                        placeholder="选择用户"
                                        filterOption={false}
                                        onChange={this.handleApprove}
                                        style={{ width: '100%' }}
                                    >
                                        {approval_list.length ? approval_list.map(d => (
                                            <Option key={d.id}>{d.user.name}</Option>
                                        )) : []}
                                    </Select>
                                )}                               
                            </FormItem>
                            <FormItem label={'备注'} {...formItemLayout}>
                                {getFieldDecorator('remarks', {                                 
                                })(
                                    <Input.TextArea />
                                )}                               
                            </FormItem>
                            
                            <FormItem
                                {...formItemLayout}
                                label={'是否需要培训'}>
                                <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={this.handleNeedTraining}/>
                            </FormItem>
                            {
                                need_training ?
                                <FormItem {...formItemLayout}
                                    label={'入场培训'}
                                >
                                    {getFieldDecorator('training', {
                                        rules: [{required: true, message:'请选择'
                                        }],
                                    })(
                                        <Select  style={{ width: '100%' }}  mode="multiple">
                                            {training_list.length ? training_list.map(d => (
                                                <Option key={d.id}>{d.name}</Option>
                                            )) : []}
                                        </Select>
                                    )}
                                </FormItem>  : ''  
                            }
                                              
                            <FormItem {...submitFormLayout}>
                                <div style={{ width: '100%', marginBottom: '20px' }}>
                                    <Button type="primary" htmlType="submit" loading={confirmLoading}
                                        style={{ marginRight: '10px' }}>
                                        <FormattedMessage id="app.button.save" defaultMessage="保存" />
                                    </Button>
                                    <GoBackButton props={this.props} />
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
                            width='1100px'
                            bodyStyle={{display:"flex",flexDirection:'column',alignItems:'center'}}
                        >
                            <div className={styles.searchContainer}>

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
                                    titles={['待选区', '申请入场']}
                                    locale={{itemUnit:'人',itemsUnit:'人'}}
                                    style={{width:'1000px'}}
                                />
                            </Spin>
                        </Modal>
                    </Spin>
                </div>
            </div>
        )
    }
}

const EntranceAdd = Form.create()(EntranceAddForm)

export default EntranceAdd
