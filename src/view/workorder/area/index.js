import React from 'react'
import {Link} from 'react-router-dom'
import {
    Form,
    Layout,
    Table,
    Button,
    Input,
    Popconfirm,
    Divider,
    Menu,
    Tree,
    Dropdown,
    Icon,
    Row,
    Col,
    Card,
    message,
    Spin, Modal
} from 'antd'

import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {area,areaPost,areaPut,areaDelete} from '@apis/workorder/area'
import {areaInfo, factory, factoryDelete} from '@apis/system/factory'
import {location, locationDelete} from '@apis/system/location'
import {floor, floorDelete} from '@apis/system/floor'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import translation from "../../workflow/translation";
const Search = Input.Search
const TreeNode = Tree.TreeNode;
let _util = new CommonUtil();
const {Header, Content} = Layout;

// Item1
@injectIntl
class FactoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeVisible:false,
            name:'',
        }
    }

    handleName=(val)=>{
        this.setState({name:val});
        console.log(val)
    };

    render() {
        const{typeVisible}=this.state;
        const {confirmLoading, data, columns, loading, form, pagination, rowSelection, factoryVisible, FloorVisible, handleTableChange, exportExcel, handleSearch} = this.props
        const {getFieldDecorator, getFieldValue} = form;
        const { formatMessage } = this.props.intl;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
     };

        return (
            <div>
               <div style={{display: factoryVisible ? 'block' : 'none'}}>
                <div className="btn-group">
                    {/*<Link to="/system/factory/add">*/}
                        {/*<Button type="primary" >新增厂区</Button>*/}
                    {/*</Link>*/}
                    {/*<Button type="primary" onClick={this.addArea}>新增</Button>*/}
                    {/*<Button type="primary" onClick={exportExcel.bind(this, 1)}><FormattedMessage id="component.tablepage.export" defaultMessage="导出" /></Button>*/}
                    <Search
                        placeholder={formatMessage(messages.search_placeholder)}
                        onSearch={handleSearch.bind(this, 1)}
                        enterButton
                        style={{float: 'right', width: '300px'}}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    expandIconColumnIndex={-1}
                    onChange={handleTableChange}
                    pagination={pagination}
                    loading={loading}
                    rowSelection={rowSelection}
                    rowKey={record => record.id}
                />
            </div>

            {/*<Modal*/}
                {/*title={'新增'}*/}
                {/*style={{ top: 20 }}*/}
                {/*visible={typeVisible}*/}
                {/*onOk={()=>this.submitTypeModal()}*/}
                {/*onCancel={this.hideTypeModal}*/}
                {/*okText={'保存'}*/}
                {/*cancelText={'取消'}*/}
                {/*destroyOnClose={true}*/}
            {/*>*/}
              {/*{*/}
                {/*<Form {...formItemLayout}>*/}
                      {/*<Form.Item label={'区域名称'} required={true}>*/}
                          {/*<Input*/}
                              {/*placeholder="请输入区域名称"*/}
                              {/*style={{width:'100%'}}*/}
                              {/*onChange={(e)=>this.handleName(e.target.value)}*/}
                          {/*/>*/}
                      {/*</Form.Item>*/}
                  {/*</Form>*/}
              {/*}*/}
          {/*</Modal>*/}
            </div>
        )
    }
}

const FactoryTable = Form.create()(FactoryList)

//Home
@injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props);
      const {formatMessage} = this.props.intl
      this.state = {
            column: [
                {
                    title: formatMessage({ id:"app.table.column.No", defaultMessage:"序号"}),
                    width: '40px',
                    render: (text, record, index) => {
                        return (index + 1)
                    }
                },

                {
                    //title: formatMessage({ id:"page.system.accessType.factoryName2", defaultMessage:"厂区名称"}),
                    title:'名称',
                    dataIndex: 'name',
                    render: record => _util.getOrNullList(record)
                },
                {
                    //title: formatMessage({ id:"page.system.accessType.factoryAddress2", defaultMessage:"厂区地址2"}),
                    title:'创建时间',
                    dataIndex: 'created_time',
                    render: record => _util.getOrNullList(record)
                },
                {
                    title: '操作',
                    render: (text, record, index) => {
                        const id = record.id;
                        let path = {
                            pathname: '/system/map/config',
                            state: {
                                id: id,
                                name: record.name,
                                number: record.number
                            }
                        };

                        return (
                            <div>
                                <div>
                                    <span onClick={()=>this.addArea(2,record)} style={{color: '#1890ff',cursor: 'pointer'}}>
                                        <FormattedMessage id="global.revise" defaultMessage="修改"/>
                                    </span>
                                    <Divider type="vertical"/>
                                    <Popconfirm placement="topRight"
                                        title={<p>确认删除？</p>}
                                        okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                                        cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                                        onConfirm={() => {this.onDeleteOne(record.id)}}
                                    >
                                        <a style={{color: '#f5222d'}}><FormattedMessage id="global.delete" defaultMessage="删除"/></a>
                                    </Popconfirm>
                                </div>
                            </div>
                        )
                    }
                },
            ],
            data: [],
            pagination: {
                pageSize: _util.getPageSize(),
                showSizeChanger: true,
                pageSizeOptions: _util.getPageSizeOptions(),
                current: 1
            },
            loading: false,
            treeLoading: true,
            selectedRowKeys: null,
            search: null,
            selectedRows: [],
            uuid: null,
            factoryVisible: true,
            locationVisible: false,
            FloorVisible: false,
            RoomVisible: false,
            doorVisible: false,
            lockVisible: false,
            lockAdd: true,
            trees: null,
            expandedKeys: ['0'],
            selectedKeys: ['0'],
            expandAllState: true,
            typeVisible:false,
            type:0,
            name:'',
            uid:undefined,
            level:undefined,
            check: _util.check(),
        };
        this.handleTableChange = this.handleTableChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.onDeleteOne = this.onDeleteOne.bind(this)
        this.openNotification = this.openNotification.bind(this)
        this.getInfo = this.getInfo.bind(this)
        this.exportExcel = this.exportExcel.bind(this)
    }

    getInfo(params) {
        // this.setState({
        //     loading: true
        // })
        // factory(params).then((res) => {
        //     _util.getInfo(res, this)
        // })
    }

    getInfo2 = (params) => {
        this.setState({
            loading: true
        })
        let selectedKeys = _util.getSession('selectedKeys')
        location({factory_id: selectedKeys[0],...params}).then((res) => {
            _util.getInfo(res, this)
        })
    }

    getInfo3 = (params) => {
        this.setState({
            loading: true
        })
        let selectedKeys = _util.getSession('selectedKeys')
        floor({location_id: selectedKeys[0],...params}).then((res) => {
            _util.getInfo(res, this)
        })
    }

    getInfo4 = (params) => {
        this.setState({
            loading: true
        })
        let selectedKeys = _util.getSession('selectedKeys')
        // room({floor_id: selectedKeys[0],...params}).then((res) => {
        //     _util.getInfo(res, this)
        // })
    }

    getInfo5 = (params) => {
        this.setState({
            loading: true
        })
        let selectedKeys = _util.getSession('selectedKeys')
        // door({room_id: selectedKeys[0],...params}).then((res) => {
        //     _util.getInfo(res, this)
        // })
    };

    getInfo6 = (params) => {
        this.setState({
            loading: true
        })
        let selectedKeys = _util.getSession('selectedKeys')
        // lock({door_id: selectedKeys[0],...params}).then((res) => {
        //     _util.getInfo(res, this)
        // })
    };

    getTree=()=>{
        area({project_id: _util.getStorage("project_id"),page_size:10000}).then((res) => {
            console.log(res);
            new Promise(
                function(resolve,reject){
                    let level1_array=[];
                    let level2_array=[];
                    let level3_array=[];
                    res.data.results.map(a=>{
                        a.title=a.name;
                        a.key=a.id;
                        a.children=[];
                        switch (a.level) {
                            case 1:level1_array.push(a);
                            break;
                            case 2:level2_array.push(a);
                            break;
                            case 3:level3_array.push(a);
                            break
                        }
                    });
                    resolve([level1_array,level2_array,level3_array])
                }
            ).then(
                (res)=>{
                    res[1].map(item2=> {
                        res[2].map(item3 => {
                            if (item3.father === item2.id) {
                                item2.children.push(item3)
                            }
                        });
                    });

                    res[0].map(item1=>{
                        res[1].map(item2=>{
                            if(item2.father===item1.id){
                                item1.children.push(item2)
                            }
                        })
                    });

                    this.setState({trees:{title:'全部区域',key:0,children:res[0],level:0},data:res[0],selectedKey:[]});
                    console.log(this.state.trees)
                }
            );

            // let level1_array=res.data.results.map(a=>a.level=1);
            // let level2_array=res.data.results.map(a=>a.level=2);
            // let level3_array=res.data.results.map(a=>a.level=3);
            // console.log(level1_array)
            // this.setState({
            //     treeLoading: false,
            //     trees: res.data.results,
            // })
        });

    };

    componentDidMount() {
        // _util.fixTableHead()
        this.onSelectChange()
        //Tree树形

        this.getTree();

        this.setState({
            treeLoading: false,
        });

        let expandedKeys = _util.getSession('expandedKeys')
        // let selectedKeys = _util.getSession('selectedKeys');
         let selectedKeys = ['0']
        let selectedType = _util.getSession('selectedType')
        this.setState({
            uuid: selectedKeys ? selectedKeys[0] : null,
            expandedKeys: expandedKeys ? expandedKeys : [],
            // selectedKeys:['0']
            selectedKeys: selectedKeys ? selectedKeys : [],
        })

        if (selectedKeys.length != 0 && selectedType != null) {

            if (selectedType == 'site') {
                this.getInfo({
                    page_size: this.state.pagination.pageSize
                })

                this.setState({
                    factoryVisible: true,
                    locationVisible: false,
                    FloorVisible: false,
                    RoomVisible: false,
                    doorVisible: false,
                    lockVisible: false,
                })
            }

            if (selectedType == 'factory') {
                this.setState({
                    loading: true
                })
                location({factory_id: selectedKeys[0]}).then((res) => {
                    _util.getInfo(res, this)
                })

                this.setState({
                    factoryVisible: false,
                    locationVisible: true,
                    FloorVisible: false,
                    RoomVisible: false,
                    doorVisible: false,
                    lockVisible: false,
                })
            }

            if (selectedType == 'location') {
                this.setState({
                    loading: true
                })
                floor({location_id: selectedKeys[0]}).then((res) => {
                    _util.getInfo(res, this)
                })

                this.setState({
                    factoryVisible: false,
                    locationVisible: false,
                    FloorVisible: true,
                    RoomVisible: false,
                    doorVisible: false,
                    lockVisible: false,
                })
            }

            if (selectedType == 'floor') {
                this.setState({
                    loading: true
                })
                room({floor_id: selectedKeys[0]}).then((res) => {
                    _util.getInfo(res, this)
                })

                this.setState({
                    factoryVisible: false,
                    locationVisible: false,
                    FloorVisible: false,
                    RoomVisible: true,
                    doorVisible: false,
                    lockVisible: false,
                })
            }

            if (selectedType == 'room') {
                this.setState({
                    loading: true
                })
                door({room_id: selectedKeys[0]}).then((res) => {
                    _util.getInfo(res, this)
                })

                this.setState({
                    factoryVisible: false,
                    locationVisible: false,
                    FloorVisible: false,
                    RoomVisible: false,
                    doorVisible: true,
                    lockVisible: false,
                })

            }
            if (selectedType == 'door') {
                this.setState({
                    loading: true
                })
                lock({door_id: selectedKeys[0]}).then((res) => {
                    _util.getInfo(res, this)
                })

                this.setState({
                    factoryVisible: false,
                    locationVisible: false,
                    FloorVisible: false,
                    RoomVisible: false,
                    doorVisible: false,
                    lockVisible: true,
                })
            }
        } else {
            this.getInfo({
                page_size: this.state.pagination.pageSize
            })
        }

    }

    handleTableChange(pagination, filters, sorter) {
        _util.handleTableChange(pagination, filters, sorter, this)
    }

    handleSearch(index,value) {
        const _this = this
        if(index == 1){
            const pager = {..._this.state.pagination}
            pager.current = 1
            _this.setState({
                search: value,
                pagination: pager,
            })
            _this.getInfo({
                search: value,
                // pagination: pager,
                page_size: pager.pageSize
            })
        }
        if(index == 2){
            const pager = {..._this.state.pagination}
            pager.current = 1
            _this.setState({
                search: value,
                pagination: pager,
            })
            _this.getInfo2({
                search: value,
                // pagination: pager,
                page_size: pager.pageSize
            })
        }
        if(index == 3){
            const pager = {..._this.state.pagination}
            pager.current = 1
            _this.setState({
                search: value,
                pagination: pager,
            })
            _this.getInfo3({
                search: value,
                // pagination: pager,
                page_size: pager.pageSize
            })
        }
        if(index == 4){
            const pager = {..._this.state.pagination}
            pager.current = 1
            _this.setState({
                search: value,
                pagination: pager,
            })
            _this.getInfo4({
                search: value,
                // pagination: pager,
                page_size: pager.pageSize
            })
        }
        if(index == 5){
            const pager = {..._this.state.pagination}
            pager.current = 1
            _this.setState({
                search: value,
                pagination: pager,
            })
            _this.getInfo5({
                search: value,
                // pagination: pager,
                page_size: pager.pageSize
            })
        }
        if(index == 6){
            const pager = {..._this.state.pagination}
            pager.current = 1
            _this.setState({
                search: value,
                pagination: pager,
            })
            _this.getInfo6({
                search: value,
                // pagination: pager,
                page_size: pager.pageSize
            })
        }
        // _util.handleSearch(value, this)
    }

    openNotification(msg) {
        _util.openNotification(msg)
    }

    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
        });

        _util.setSession('expandedKeys', expandedKeys)

    };

    onSelect = (selectedKeys, info) => {
        const {trees}=this.state;
        if(parseInt(selectedKeys[0])===0){
            this.setState({data:trees.children})
        }else{
            trees.children.map(item=>{
               if(item.id===parseInt(selectedKeys[0])){
                   this.setState({data:item.children})
               }else if(item.children.length&&item.children.map(a=>a.id).indexOf(parseInt(selectedKeys[0]))>-1){
                   this.setState({data:item.children[item.children.map(a=>a.id).indexOf(parseInt(selectedKeys[0]))].children});
                   //console.log(item.children[item.children.map(a=>a.id).indexOf(parseInt(selectedKeys[0]))])
               }
            });
        }

        console.log(selectedKeys,info);
        //let selectedType = info.selectedNodes.length !== 0 ? info.selectedNodes[0].props.dataRef.type : null
        let selectedType=null;
        this.setState({selectedKeys});
        this.setState({uuid: selectedKeys ? selectedKeys[0] : null,});
        this.setState({level:info.node.props.level});
        _util.setSession('selectedKeys', selectedKeys)
        _util.setSession('selectedType', selectedType)
    };


    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    }

    onDeleteOne(id) {
        const { formatMessage } = this.props.intl;
        areaDelete(id,{project_id:_util.getStorage("project_id")}).then(() => {
            // this.setState({treeLoading: true,});
            message.success(formatMessage(messages.alarm10))
            let selectedKeys = _util.getSession('selectedKeys')
            this.getTree({
                page_size: this.state.pagination.pageSize,

            });
            this.setState({selectedKeys:['0']})

            // this.setState({
            //     factoryVisible: true,
            //     locationVisible: false,
            //     FloorVisible: false,
            //     RoomVisible: false,
            //     doorVisible: false,
            //     lockVisible: false,
            // })
        })
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({selectedRowKeys, selectedRows})
    };

    exportExcel=(index,event)=> {
        console.log(index)
        const {selectedRows, column, column2, column3, column4, column5, column6} = this.state;
        const { formatMessage } = this.props.intl;
        if(index == 1){
            _util.exportExcel(selectedRows, column,'区域管理')
        }
        if(index ==2){
            _util.exportExcel(selectedRows, column2, formatMessage({ id:"page.component.breadcrumb.build_manage", defaultMessage:"建筑管理"}))
        }
        if(index ==3){
            _util.exportExcel(selectedRows, column3, formatMessage({ id:"page.component.breadcrumb.floor_manage", defaultMessage:"楼层管理"}))
        }
        if(index ==4){
            _util.exportExcel(selectedRows, column4, formatMessage({ id:"page.component.breadcrumb.room_manage", defaultMessage:"房间管理"}))
        }
        if(index ==5){
            _util.exportExcel(selectedRows, column5, formatMessage({ id:"page.component.breadcrumb.door_manage", defaultMessage:"门管理"}))
        }
        if(index ==6){
            _util.exportExcel(selectedRows, column6, formatMessage({ id:"page.component.breadcrumb.lock_manage", defaultMessage:"锁芯管理"}))
        }
    }

    addArea=(type,record)=>{
        console.log(this.props);
        this.setState({typeVisible:true,type:type,name:record&&record.name,uid:record&&record.id})
    };

    hideTypeModal=()=>{
        this.setState({typeVisible:false})
    };

    submitTypeModal=()=>{
        const {formatMessage} = this.props.intl;
        const{type,uid}=this.state;
        let data={
            name:this.state.name,
            father:this.state.uuid,
            project_id: _util.getStorage("project_id")
        };
        if(type===1){
            areaPost(data).then((res) => {
                  message.success(formatMessage(translation.saved));
                  this.getTree();
            });
        }else if(type===2){
            areaPut(uid,data).then((res) => {
                  message.success('修改成功');
                  this.getTree()
            });
        }
        this.setState({typeVisible:false,selectedKeys:['0']})
    };

    handleName=(val)=>{
        this.setState({name:val});
    };

    render() {
        const {
            type,name,typeVisible,trees, confirmLoading, column, data, uuid, pagination, loading, selectedRowKeys,
            factoryVisible, level,check
        } = this.state;

        const canAdd = _util.getStorage('is_project_admin') || this.state.check(this, "add");
        console.log(this.state.check(this, "add"));

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        };

        const bread = [
          {
            name:'首页',
            url: "/"
          },
          {
            name:'任务管理'
          },
          {
            name:'区域管理',
            url: "/assignment/area"
          }
        ];

        const formItemLayout = {
              labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
              },
         };

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <Content style={{margin: '0 24px 0'}}>
                    <Row gutter={24}>
                        <Col span={6} style={{ overflow: 'hidden' }}>
                            <Card
                                // loading={loading}
                                bordered={false}
                                title=""
                                // extra={iconGroup}
                                style={{marginTop: 24, height: '500px',overflowY: 'scroll', width: '336px'}}
                            >
                                <Spin spinning={this.state.treeLoading} style={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }} tip={<FormattedMessage id="page.selfeqpt.text.loading" defaultMessage="加载中"/>}>

                                <Tree
                                    // checkable
                                    showLine
                                    onExpand={this.onExpand}
                                    defaultExpandAll={true}
                                    expandedKeys={this.state.expandedKeys}
                                    // defaultExpandAll={true}
                                    onSelect={this.onSelect}
                                    onCheck={this.onCheck}   //点击复选框触发
                                    selectedKeys={this.state.selectedKeys}
                                    treeData={trees}
                                >
                                </Tree>
                                </Spin>
                            </Card>
                        </Col>

                        <Col span={18}>
                            <Card
                                bordered={false}
                                title=""
                                // extra={iconGroup}
                                style={{marginTop: 24,position:'relative'}}>
                                <div style={{position:'absolute'}}>
                                    {
                                        canAdd&&(level<3||!level)?
                                        <Button type="primary" onClick={()=>this.addArea(1)} style={{marginRight:'8px'}}>新增</Button>
                                    :null
                                    }
                                    <Button type="primary" onClick={()=>this.exportExcel(1, 1)}><FormattedMessage id="component.tablepage.export" defaultMessage="导出" /></Button>
                                </div>

                                <FactoryTable
                                    factoryVisible={factoryVisible}
                                    confirmLoading={confirmLoading}
                                    columns={column}
                                    data={data}
                                    uuid={uuid}
                                    pagination={pagination}
                                    loading={loading}
                                    rowSelection={rowSelection}
                                    onChange={this.handleTableChange}
                                    exportExcel={this.exportExcel}
                                    handleSearch={this.handleSearch}
                                    rowKey={record => record.id}
                                    ref={(form) => {this.form_1 = form}}
                                >
                                </FactoryTable>
                            </Card>
                        </Col>
                    </Row>

                    <Modal
                        title={type===1?'新增':'修改'}
                        style={{ top: 20 }}
                        visible={typeVisible}
                        onOk={()=>this.submitTypeModal()}
                        onCancel={this.hideTypeModal}
                        okText={'保存'}
                        cancelText={'取消'}
                        destroyOnClose={true}
                    >
                      {
                        <Form {...formItemLayout}>
                              <Form.Item label={'区域名称'} required={true}>
                                  <Input
                                      placeholder="请输入区域名称"
                                      style={{width:'100%'}}
                                      value={name}
                                      onChange={(e)=>this.handleName(e.target.value)}
                                  />
                              </Form.Item>
                          </Form>
                      }
                  </Modal>
                </Content>
            </div>
        )
    }
}
