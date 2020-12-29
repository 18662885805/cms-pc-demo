import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
    Divider,
    Popconfirm,
    message, Tag, Icon, Button, Table, Modal,Form,Input
} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {type, typeDelete, typePost,typePut} from '@apis/workorder/type'
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {inject, observer} from 'mobx-react/index'
const _util = new CommonUtil();
const {TextArea}=Input;

const typeMessage = defineMessages({
  title1: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  title2: {
      id:"page.work.my.title26",
      defaultMessage:"接单人"
  },
  title3: {
      id:"page.doc.temp.title3",
      defaultMessage:"报修类型"
  },
  title4: {
    id: 'page.doc.allDoc.title7',
    defaultMessage: '创建人',
  },
  title5: {
    id: 'page.oneStop.cardAnnual.createdTime',
    defaultMessage: '创建时间',
  },
    title6: {
    id: 'page.construction.contractor.lastReviser',
    defaultMessage: '上次修改人',
  },
    title7: {
    id: 'page.oneStop.cardAnnual.updatedTime',
    defaultMessage: '上次修改时间',
  },
    title8: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
     title9: {
    id: 'page.order.type.factoryName',
    defaultMessage: '工厂',
  },
      title10: {
    id: 'page.order.type.weekend',
    defaultMessage: '周末是否接单',
  },
      title11: {
    id: 'page.walkthrough.status',
    defaultMessage: '状态',
  },
});

@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
          column: [
              {
                  //title: '序号',
                  title:formatMessage(typeMessage.title1),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  //title: '工单类型',
                  title:'简码',
                  // minWidth: 120,
                  // width: 120,
                  // maxWidth: 80,
                  dataIndex: 'code',
                  sorter: _util.sortString,
                  render:record => _util.getOrNullList(record)
              },
              {
                  //title: '工单类型',
                  title:'任务类型',
                  minWidth: 120,
                  width: 120,
                  // maxWidth: 80,
                  dataIndex: 'name',
                  sorter: _util.sortString,
                  render:record => _util.getOrNullList(record)
              },
              {
                  //title: '创建人',
                  title:formatMessage(typeMessage.title4),
                  dataIndex: 'created',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '创建日期',
                  title:formatMessage(typeMessage.title5),
                  dataIndex: 'created_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '上次修改人',
                  title:formatMessage(typeMessage.title6),
                  dataIndex: 'updated',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
               {
                  //title: '创建日期',
                  title:'上次修改时间',
                  dataIndex: 'created_time',
                  filterType: 'range-date',
                  sorter: _util.sortDate,
                  render: record => _util.getOrNullList(record)
              },
              {
                  //title: '操作',
                  title:formatMessage(typeMessage.title8),
                  dataIndex: 'operate',
                  width: 120,
                  minWidth: 120,
                  maxWidth: 120,
                  render: (text, record) => {
                      const {id} = record
                      const path = {
                          pathname: '/workorder/ordercategory/add',
                          state: {
                              desc: record.desc,
                              user_id: record.user_id,
                              user: record.user_name,
                              user_tel: record.user_tel,
                              id: record.id,
                              factory_id:record.factory_id,
                              work_day:record.workday_start_time,
                              weekend:record.weekend_start_time,
                              work_start:record.workday_start_time,
                              work_end:record.workday_end_time,
                              week_start:record.weekend_start_time,
                              week_end:record.weekend_end_time,
                          }
                      };

                      const { formatMessage } = this.props.intl;
                      const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
                      const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");

                      return <Fragment>
                          {
                              canEdit?
                                  <Fragment>
                                  <span style={{ color:'#1890ff',cursor: "pointer",}} onClick={()=>this.addType(2,record)}>
                                     <FormattedMessage id="app.page.text.modify" defaultMessage="修改" />
                                  </span>
                                  <Divider type='vertical'/>
                                  </Fragment>:null
                          }

                          {
                              canDelete?<Popconfirm
                              title={<p>确定删除?</p>}
                              placement="topRight"
                              okText={formatMessage(messages.alarm3)}
                              cancelText={formatMessage(messages.alarm4)}
                              onConfirm={() => {
                                  this.onDeleteOne(id)
                              }}>
                              <a style={{color: '#f5222d'}}><FormattedMessage id="global.delete" defaultMessage="删除"/></a>
                          </Popconfirm>:null
                          }
                      </Fragment>
                  }
              }
          ],
          check: _util.check(),
          selectedRowKeys: [],
          selectedRows: [],
          typeVisible:false,
          name:"",
          typeAdd:1,
          postData: {
              name: null,
              code:null,
          },
          id:undefined,
      }
  }
  onDeleteOne = id => {
    this.setState({ refresh: false });
    const { formatMessage } = this.props.intl;
    typeDelete(id,{project_id:_util.getStorage("project_id")}).then((res) => {
      message.success(formatMessage(messages.alarm9))
      this.setState({ refresh: true })
    })
  };

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    }
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  };

  addType=(type,record)=>{
      if(type===1){
          this.setState({typeVisible:true,typeAdd:type})
      }else{
          const{name,id,code}=record;
          const{postData}=this.state;
          postData.name=name;
          postData.code=code;
          this.setState({typeVisible:true,typeAdd:type,postData,id:id});
          console.log(this.state.postData)
      }
  };

  handleName=(val,field)=>{
      const { postData } = this.state;
      postData[field] = val;
      this.setState({postData})
  };

  hideTypeModal=()=>{
    this.setState({typeVisible:false,postData:{}})
  };

  submitTypeModal=(val)=>{
      const {postData}=this.state;
      postData.project_id=_util.getStorage("project_id");
      const { formatMessage } = this.props.intl;
      this.setState({refresh: false});

      if (val===1) {
        typePost(postData).then(res => {
          //message.success('保存成功')
            message.success(formatMessage(messages.saved))
          this.setState({
            typeVisible: false,
            refresh: true,
            postData:{},
          })
        })
      } else {
        const id =this.state.id;
        console.log(id);
        typePut(id,postData).then(res => {
          //message.success('修改成功')
          message.success(formatMessage(messages.modify_success))
          this.setState({
            typeVisible: false,
            refresh: true,
            postData:{},
          })
        })
      }
  };

  render() {
    const { column, check, refresh,typeVisible,typeAdd,postData } = this.state;
    const { formatMessage } = this.props.intl;
    const canAdd = _util.getStorage('is_project_admin') || this.state.check(this, "add");
    const bread = [
      {
        name: formatMessage({
          id: "menu.homepage",
          defaultMessage: "首页"
        }),
        url: "/"
      },
      {
        name: formatMessage({
          id: "page.system.task.systemManage",
          defaultMessage: "任务管理"
        })
      },
      {
        name:'任务类型',
        url: "/assignment/type"
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
        <div className="content-wrapper">
            <TablePage
            refresh={refresh}
            getFn={type}
            //getFn={typeOrder}
            columns={column}
            // enableFn={check(this, 'enabled') && typeEnable}
            // disableFn={check(this, 'disabled') && typeDisable}
            //addPath={check(this, 'add') && '/workorder/ordercategory/add'}
            excelName={true && '任务类型'}
            onSelectChange={this.onSelectChange}   //选择行
          >
                {
                    canAdd?<Button type={'primary'} onClick={()=>this.addType(1)}>新增</Button>
                    :null
                }

          </TablePage>

            <Modal
                title={'操作'}
                style={{ top: 20 }}
                visible={typeVisible}
                onOk={()=>this.submitTypeModal(typeAdd)}
                onCancel={this.hideTypeModal}
                okText={typeAdd===1?'保存':'修改'}
                cancelText={'取消'}
                destroyOnClose={true}
            >
              {
                <Form {...formItemLayout}>
                      <Form.Item label={'简码'} required={true}>
                          <Input
                              placeholder="请输入任意4位大写字母"
                              style={{width:'100%'}}
                              value={postData.code}
                              maxLength={4}
                              onChange={(e)=>this.handleName(e.target.value,'code')}
                          />
                      </Form.Item>
                      <Form.Item label={'任务类型'} required={true}>
                          <Input
                              placeholder="请输入类型名称"
                              style={{width:'100%'}}
                              value={postData.name}
                              onChange={(e)=>this.handleName(e.target.value,'name')}
                          />
                      </Form.Item>
                  </Form>
              }
          </Modal>
        </div>
      </div>
    )
  }
}
