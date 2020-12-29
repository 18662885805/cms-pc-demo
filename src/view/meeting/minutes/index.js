import React, { Fragment } from 'react'
import { Modal, Select, message, Tag, Row, Col, Card, Spin, Tree, Divider,Icon,Button,Checkbox,
  Popconfirm,Tooltip,Form,Input,Upload,Tabs,Breadcrumb,List, Timeline} from 'antd'
import { Link } from 'react-router-dom'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import moment from "moment";
import { 
  documentRegister,
  CreateNodeDirectory,
  GetDirectoryNode,
  documentRegisterFile,
  documentRegisterFileDetail,
  documentRegisterFilePost,
  documentRegisterFilePut,
  documentRegisterFileDelete,
  GetTemporaryDocument,
  SubDocument,
  AuditDocument,
  UpdateNodeDirectory,
  DisableDocument,
  ReplaceDocument,
  DeleteNodeDirectory,
  documentRegisterInfo,
} from '@apis/document/register';
import { user } from '@apis/admin/user';
import { MeetingTypeInfo, MeetingTypeNodeInfo, SubTypePost, SubTypePut, SubTypeDelete } from "@apis/meeting/type";
import { MeetingMinutes, MeetingMinutesDelete, MeetingMinutesSubmit, MeetingMinutesAudit, MeetingMinutesDetail } from "@apis/meeting/minutes";
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import translation from "../translation";
import VirtualTable from '@component/VirtualTable3'
import { inject, observer } from 'mobx-react'
import styles from './index.module.css'
import { Scrollbars } from 'react-custom-scrollbars'
import TablePage from '@component/TablePage'
import {GetTemporaryKey} from "@apis/account/index"
import Downloader from 'js-file-downloader';



const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select
const { TabPane } = Tabs;
const { Search } = Input;
const {TextArea} = Input;
const confirm = Modal.confirm
const _util = new CommonUtil();

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  description: {
    id: 'app.page.document.description',
    defaultMessage: '描述',
  },
  created: {
    id: 'app.page.document.created',
    defaultMessage: '创建人',
  },
  created_time: {
    id: 'app.page.document.created_time',
    defaultMessage: '创建时间',
  },
  updated: {
    id: 'app.page.document.updated',
    defaultMessage: '上次修改人',
  },
  updated_time: {
    id: 'app.page.document.updated_time',
    defaultMessage: '修改日期',
  },
  status: {
    id: 'app.page.document.status',
    defaultMessage: '状态',
  },
  select: {
    id: 'app.placeholder.select',
    defaultMessage: '-- 请选择 --',
  },
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
  operate: {
    id: 'app.table.column.operate',
    defaultMessage: '操作',
  },
  deleted: {
    id: 'app.message.material.deleted',
    defaultMessage: '已删除',
  },
});

@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl
    this.state = {
      column: [
        {
          title: '序号',
          width: 40,
          maxWidth: 40,
          dataIndex: 'efm-index',
          render: (text, record, index) => {
            return (index + 1)
          }
        },
        {
          title: '会议编号',
          dataIndex: 'code',
          sorter: _util.sortString,
          render: (value, record) => {
            const {id,meeting_type,status} = record
            let path = {
              pathname: `/meeting/minutes/detail/${id}`,
              // state: {
              //   id: id,
              //   meeting_type: meeting_type ? meeting_type :''
              // }
            };
            if(status == 4){
              //return <span>{value}</span>
              return (
                <Link to={path}>
                  {value}
                </Link>
              )
            }else{
              return (
                <Link to={path}>
                  {value}
                </Link>
              )
            }
          }
        },
        {
          title: '会议名称',
          dataIndex: 'name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: '会议时间',
          dataIndex: 'meeting_day',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: '流转记录',
          // dataIndex: '',
          sorter: _util.sortString,
          render: (value, record) => {
            if(record.status != 1) {
              return(<a onClick={() => this.showAuditRecord(record.id)}>查看</a>)
            }else {
              return ''
            }
          }
        },        
        // { 
        //   title: '版本',
        //   dataIndex: 'version',
        //   sorter: _util.sortString,
        //   render: (text, record, index) => {
        //     const {version,history} = record;
        //     if(history&&history.length){
        //       return <a onClick={() => this.showHistory(history)}>{`V${version}`}</a>
        //     }else{
        //       return <span>{`V${version}`}</span>
        //     }
        //   }
        // },
      //   {
      //     title:'上传人',
      //     dataIndex: 'created',
      //     sorter: _util.sortString,
      //     filterType: 'select',
      //     render: record => _util.getOrNullList(record)
      //   },
      //   {
      //     title: '上传时间',
      //     dataIndex: 'created_time',
      //     filterType: 'range-date',
      //     sorter: _util.sortDate,
      //     render: record => _util.getOrNullList(record ?  moment(record).format("YYYY-MM-DD HH:mm:ss") : '')
      //   }, {
      //     title: '最后修改人',      
      //     dataIndex: 'updated',
      //     sorter: _util.sortString,
      //     filterType: 'select',
      //     render: record => _util.getOrNullList(record)
      // },
      // {
      //     title: '最后修改时间',      
      //     dataIndex: 'updated_time',
      //     sorter: _util.sortDate,
      //     filterType: 'range-date',
      //     render: record => _util.getOrNullList(record ?  moment(record).format("YYYY-MM-DD HH:mm:ss") : '')
      // },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: _util.sortString,
          render: record => _util.renderMeetingStatusText(record)
        },
        {
          title: '操作',    //操作
          dataIndex: 'operate',
          width: 120,
          render: (text, record, index) => {
            const {id,status,meeting_type} = record;
            let path = {
              pathname: `/meeting/minutes/add/${id}`,
              state: {
                typeId: _util.getSession('subid').id
                // typeId: this.state.subid
                // templateId: this.state.template
              }
            }
            return (
              <div
                style={{paddingLeft:'5px'}}
              >
                
                {
                  (status == 1 || status == 4) ? <Link to={path}><a style={{marginRight:'5px' }}>修改</a></Link> :''
                }
                {/* {
                  status == 3 ? <a onClick={() => this.showReplace(id)} style={{ color: 'green',marginRight:'5px' }}>替换</a> :''
                }        */}
                {(status == 1 || status == 4) ?
                  <Popconfirm
                    // placement="left"
                    title={<FormattedMessage id="app.pop.title.delete" defaultMessage="确认删除？" />}
                    okText={<FormattedMessage id="app.button.ok" defaultMessage="确认" />}
                    cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消" />}
                    onConfirm={() => {
                      this.onDeleteFile(id)
                  }}>
                    <a style={{ color: '#f5222d'}}> <FormattedMessage id="app.page.text.delete" defaultMessage="删除" /> </a>
                  </Popconfirm> :''
                }               
              </div>
            )
          }
        }
      ],
      check: _util.check(),    
      show_dis:'',
      firstLevelList:[],
      secondLevelList:[],
      thirdLevelList:[],
      selectedFirstLevelKey:'',
      selectedSecondLevelKey:'',
      selectedThirdLevelKey:'',
      selectedFirstLevelName:'',
      selectedSecondLevelName:'',
      selectedThirdLevelName:'',
      secondShow:false,
      thirdShow:false,
      new_node_name:'',
      new_node_level:'',
      createNodeVisible:false,
      uploadVisiable:false,
      new_file_desc:'',
      new_file_name:'',
      fileList:[],
      refresh:false,
      level_loading:false,
      fileData:[],
      pagination: {
        pageSize: _util.getSession('pageSize') ? _util.getSession('pageSize') : _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions: _util.getPageSizeOptions(),
        current: _util.getSession('currentPage') ? _util.getSession('currentPage') : 1
      },
      tableLoading:false,
      filtering:false,
      upload_type:1,
      temp_data:[],
      temp_value:'',
      selectedRowKeys: [],
      selectedRows: [],
      auditVisible:false,
      audit_remarks:'',
      editNodeVisible: false,
      edit_node:'',
      edit_level:'',
      edit_node_parent:'',
      replaceVisiable:false,
      replace_Filelist:[],
      replace_id:'',
      historyVisiable:false,
      historyList:[],
      history_url_list:[],
      history_loading:false,
      refresh:false,
      download_loading:false,
      documentEditVisiable:false,
      document_edit_data:{},
      document_edit_file:[],
      new_document_edit_file:[],
      subid: '',
      template: '',
      modalVisible: false,
      templateModal: false,
      recordModal: false,
      audit_record: [],
      searchOptions: [],
      project_id: _util.getStorage('project_id')
    }
  }

  componentDidMount(){
    if(_util.getSession('menufrom') !== '/meeting/minutes') {
      _util.removeSession('parent')
      _util.removeSession('subid')
    }

    const project_id =  _util.getStorage('project_id');
    this.setState({project_id,level_loading:true})
    MeetingTypeInfo({project_id:project_id}).then((res) => {
      if(res.data){
        this.setState({
          firstLevelList:res.data
        })
      }
      this.setState({level_loading:false})
    })

    if(_util.getSession('parent') && _util.getSession('subid')) {
      MeetingTypeNodeInfo({nid: _util.getSession('parent').id,project_id:project_id}).then(res => {
        if(res.data&&res.data.length){
          this.setState({
            secondLevelList:res.data,
            secondShow:true
          })
        }
        // this.setState({level_loading:false, })
      })
      this.getFile(_util.getSession('subid').id)
    }
  
  }

  componentWillUnmount(){
    _util.removeSession('menufrom')
  }

  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if (scrollTopPosition) {
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }


  showAddPersonModal = (id) => {
    user().then(res => {
      this.setState({
        addPersonVisible: true,
        add_person_data: res.data.results,
        project_id: id
      })
    })
  }

  showModal = (params) => {
    console.log(params)
    this.setState({
      personVisible: true,
      addedworker: params.worker,
      project_id: params.id,
      rowdata: params
    });
  }

  hideAddPersonModal = () => {
    this.setState({
      addPersonVisible: false,
      add_person_data: [],
      chose_data: [],
      project_id: null
    })
  }

  getFile = (id) => {
    this.setState({ reset: false })
    this.setState({tableLoading:true,fileData:[]})
    const {show_dis,pagination,project_id} = this.state;
    const params = {
      meeting_type_id: id,
      show_dis:show_dis ? true : '',
      project_id:project_id,
      page : pagination.current,
      page_size : pagination.pageSize,
    }
    MeetingMinutes(params).then(res => {
      if(res.data){    
        let { results, count } = res.data;
        if(count){
          pagination.total = count;
          this.setState({pagination})
        }
        if(results&&results.length){
          this.setState({
            fileData: results,
            searchOptions: results
          })
        }
        this.setState({tableLoading:false, reset: true})

      }
    })
  }

  //点击一级目录
  handeFirstLevel = (id,name) => {
    const {selectedFirstLevelKey, selectedRowKeys, selectedRows} = this.state;
    if(selectedFirstLevelKey == id){
      return
    }
    this.setState({level_loading:true})
    this.closeSecondLevel();//清空二级目录
    // this.closeThirdLevel();//清空三级目录
    const {project_id} = this.state;
    console.log(id)
    _util.removeSession('subid');
    _util.setSession('parent',{"id": id, "name": name});
    this.setState({
      selectedFirstLevelKey:id,
      new_node_parent: id,
      selectedFirstLevelName:name,
      selectedSecondLevelName: '',
      selectedRowKeys: [],
      selectedRows: []
    });
    MeetingTypeNodeInfo({nid:id,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          secondLevelList:res.data,
          secondShow:true
        })
      }
      this.setState({level_loading:false, })
    })
    this.getFile(id)
  }

  handeSecondLevel = (id,name) => {
    const {selectedSecondLevelKey, selectedRowKeys, selectedRows} = this.state;
    if(selectedSecondLevelKey == id){
      return
    }
    // this.setState({level_loading:true})
    // this.closeThirdLevel();//清空三级目录
    const {project_id} = this.state;
    _util.setSession('subid',{"id": id, "name": name});
    this.setState({
      selectedSecondLevelKey:id,
      subid: id,
      selectedSecondLevelName:name,
      selectedRowKeys: [],
      selectedRows: []
    });
    // GetDirectoryNode({nid:id,project_id:project_id}).then(res => {
    //   if(res.data&&res.data.length){
    //     this.setState({
    //       thirdLevelList:res.data,
    //       thirdShow:true
    //     })
    //   }
    //   this.setState({level_loading:false, })
    // })
    this.getFile(id)
  }

  handeThirdLevel = (id,name) => {
    const {selectedThirdLevelKey} = this.state;
    if(selectedThirdLevelKey == id){
      return
    }
    this.setState({selectedThirdLevelKey:id,selectedThirdLevelName:name});
    this.getFile(id)
  }

  openCreateNodeModal = (e,id,level) => {
    e.stopPropagation();
    console.log(id,level)
    this.setState({createNodeVisible:true,new_node_level:level,new_node_parent:id})
    if(level == 2){
      this.closeSecondLevel()
    }else if(level == 3){
      this.closeThirdLevel()
    }
    // const {project_id} = this.state;
    // CreateNodeDirectory({project_id:project_id,nid:id}).then(res => {
    //   message.success('创建成功')
    // })
  }

  //打开编辑子目录
  openEditNodeModal = (e,record,level) => {
    console.log(record)
    e.stopPropagation();
    this.setState({
      editNodeVisible:true,
      edit_node:record,
      edit_level:level,
      // new_node_parent:record.parent ? record.parent.id :'',
      // new_node_parent:record ? record.id :'',
    })
  }

  //关闭编辑子目录
  hideEditNodeModal = () => {
    const {edit_level} = this.state;
    this.setState({
      editNodeVisible:false,
      edit_node:'',
      edit_level:'',
      subname: '',
      subabbr: ''
    });
    if(edit_level == 2){
      this.freshNewSecondLevel();//刷新二级子目录
    }else if(edit_level == 3){
      this.freshNewThirdLevel();//刷新三级子目录
    }
  }

  // handleNewNodeName = (value) => {
  //   this.setState({new_node_name:value})
  // }

  handleNodeChange = (value, field) => {
    this.setState({
      [field]: value
    })
  }

  // handleEditNodeName = (value) => {
  //   const {edit_node} = this.state;
  //   edit_node.name = value
  //   this.setState({edit_node})
  // }

  hideCreateNewNodeModal = () => {
    this.setState({createNodeVisible:false})
  }

  //创建子目录
  createNode = () => {
    const {
      subname,
      subabbr,
      new_node_level,
      new_node_parent,
      // new_node_name,
      project_id
    } = this.state;
    if(!subname){
      message.warning('请输入会议类型名称')
      return
    }
    if(!subabbr){
      message.warning('请输入会议缩写')
      return
    }
    this.setState({level_loading:true})
    let params = {
      project_id,
      name: subname, 
      abbr: subabbr, 
      parent: new_node_parent
    }
    SubTypePost(params).then(res => {
      this.hideCreateNewNodeModal();
      if(new_node_level == 2){
         //刷新新的二级目录列表
        this.freshNewSecondLevel();
      }else if(new_node_level == 3){
         //刷新新的三级目录列表
         this.freshNewThirdLevel();
      }
      this.setState({level_loading:false})
    }).catch(err => {
      this.hideCreateNewNodeModal();
      this.setState({level_loading: false})
    })
  }

  //编辑子目录
  editNode = () => {
    const {project_id,edit_node, new_node_parent, subname, subabbr} = this.state;
    console.log(new_node_parent)
    const data = {
      project_id,
      id:edit_node.id,
      // parent:edit_node.parent.id,
      parent: new_node_parent,
      name: subname ? subname : edit_node.name,
      abbr: subabbr ? subabbr : edit_node.abbr
    }
    SubTypePut(data).then(res => {
      message.success('修改成功')
      this.hideEditNodeModal()
    },()=>{
      this.setState({editNodeVisible: false})
    })
  }

  //删除子目录
  deleteNode = () => {
    const {project_id,edit_node} = this.state;
    const _this = this;
    let params = {
      project_id,
      id: edit_node.id
    }
    confirm({
      title: '确认删除?',
      content: '单击确认按钮后，将会删除数据',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // SubTypeDelete(project_id,{id:edit_node.id ?edit_node.id :''}).then(res => {
        SubTypeDelete(params).then(res => {
          message.success('删除成功')
          _this.hideEditNodeModal()
        })
      },
      onCancel() {
      },
    })
    
  }


  //刷新新的二级目录列表
  freshNewSecondLevel = () => {
    const {new_node_parent,project_id} = this.state;
    MeetingTypeNodeInfo({nid:new_node_parent,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          secondLevelList:res.data,
          secondShow:true,
          selectedFirstLevelKey:new_node_parent,
        })
        this.closeThirdLevel();
      }else{
        this.closeSecondLevel();
        this.closeThirdLevel();
      }
    })
  }

  //刷新新的三级目录列表
  freshNewThirdLevel = () => {
    const {new_node_parent,project_id} = this.state;
    GetDirectoryNode({nid:new_node_parent,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          thirdLevelList:res.data,
          thirdShow:true,
          selectedSecondLevelKey:new_node_parent,
        })
      }else{
        this.closeThirdLevel();
      }
    })
  }

  //关闭&&清空二级目录
  closeSecondLevel = () => {
    this.setState({
      secondLevelList:[],
      secondShow:false,
      selectedSecondLevelKey:''
    })
  }

  //关闭&&清空三级目录
  closeThirdLevel = () => {
    this.setState({
      thirdLevelList:[],
      thirdShow:false,
      selectedThirdLevelKey:''
    })
  }

  showUpload = () => {
    this.setState({uploadVisiable:true});
  }

  hideUpload = () => {
    this.setState({
      new_file_name:'',
      new_file_desc:'',
      fileList:[],
      uploadVisiable:false,
    })
  }

  handleDesc = (e) => {
    this.setState({new_file_desc:e.target.value})
  }

  handleName = (e) => {
    this.setState({new_file_name:e.target.value})
  }


  //修改注册目录文件
  editFileUpload = (info) => {
    let {fileList,file} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;

    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
    this.setState({document_edit_file:fileList})
    if(fileList&&fileList.length){
      if(fileList[0]['name']){
        const full_name = fileList[0]['name']
        const full_name_list = full_name.split('.');
        if(full_name_list&&(full_name_list.length>0)){
          const fileType = full_name_list.pop();
        }
        var new_file_name = full_name_list.join('.')
        this.handleDocumentEditData(new_file_name,'name')
      }
    }
  }


  //目录上传文件
  fileUpload = (info) => {
    let {fileList,file} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;

    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
    this.setState({fileList:fileList})
    if(fileList&&fileList.length){
      if(fileList[0]['name']){
        const full_name = fileList[0]['name']
        const full_name_list = full_name.split('.');
        if(full_name_list&&(full_name_list.length>0)){
          const fileType = full_name_list.pop();
        }
        this.setState({new_file_name:full_name_list.join('.')})
      }
    }
  }


  //目录文件上传提交
  handleUploadSubmit = () => {
    const {
      project_id,
      new_file_name,
      new_file_desc,
      selectedFirstLevelKey,
      selectedSecondLevelKey,
      selectedThirdLevelKey,
      fileList,
      upload_type,
      temp_Filelist,
    } = this.state;
    
    var file;
    var temp_file;
    if(upload_type == 1){
      if(!(fileList&&fileList.length)){
        message.warning('请上传文件')
        return
      }
      if(!fileList[0]['response']){
        message.warning('文件未上传成功')
        return
      }
      file = [
        {
          name:fileList[0]['name'],
          url:fileList[0]['response']['file_name'],
          size:fileList[0]['size'],
          type:fileList[0]['type'],
        }
      ]
    }else{
      temp_file = temp_Filelist.source
    }
    var directory = selectedThirdLevelKey?selectedThirdLevelKey:selectedSecondLevelKey?selectedSecondLevelKey:selectedFirstLevelKey?selectedFirstLevelKey:'';
    if(!directory){
      message.warning('请选择目录!')
      return
    }
    if(!file && !temp_file){
      message.warning('请选择文件!')
      return
    }
    const data = {
      name:new_file_name,
      desc:new_file_desc,
      directory:directory,
      source:file ? JSON.stringify(file) : temp_file,
    }
    documentRegisterFilePost(project_id,data).then(res => {
      message.success('提交成功')
      this.hideUpload();
      this.getFile(directory);
    })
  }


  handleTableChange = (pagination, filters = {}, sorter = {}) => {
    _util.handleTableChange(pagination, filters, sorter, this)
  }

  checkSelectedLevel = () => {
    const {
      selectedFirstLevelKey,
      selectedSecondLevelKey,
      selectedThirdLevelKey
    } = this.state;
    // if(selectedThirdLevelKey||selectedSecondLevelKey||selectedFirstLevelKey){
    if(selectedSecondLevelKey || _util.getSession('subid').id){
      return true
    }else{
      return false
    }
  }

  checkCurrentKey = () => {
    const {
      selectedFirstLevelKey,
      selectedSecondLevelKey,
      selectedThirdLevelKey
    } = this.state;
    if(selectedThirdLevelKey){
      return selectedThirdLevelKey
    }else if(selectedSecondLevelKey){
      return selectedSecondLevelKey
    }else if(selectedFirstLevelKey){
      return selectedFirstLevelKey
    }else{
      return null
    }
  }


  onDeleteFile = (id) => {
    const {formatMessage} = this.props.intl;
    const {subid} = this.state;
    // const directory = this.checkCurrentKey();
    // if(!directory){
    //   message.warning('请选择目录!')
    // }
    MeetingMinutesDelete(id, {project_id: _util.getStorage('project_id'), meeting_type_id: subid}).then((res) => {
      message.success('已删除')      //已删除
      this.getFile(subid);
    })
  }

  handleUploadType = (key) => {
    this.setState({upload_type:key})
  }

  fetchTemp = (value) => {
    if(!value){
      return
    }
    const {project_id} = this.state;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ temp_data: [], fetching: true, search_info: "", search_id: null });
    GetTemporaryDocument({ q: value, project_id:project_id}).then((res) => {
      const temp_data = res.data;
      this.setState({ temp_data, fetching: false });
    });
  }

  onHandleTemp = (value) => {
    const {temp_data} = this.state;
    this.setState({temp_value:value})
    const temp_Filelist = temp_data.find(t => {
      return t.code == value
    })
    this.setState({
      temp_Filelist,
      new_file_name:temp_Filelist.name ? temp_Filelist.name :'',
      new_file_desc:temp_Filelist.desc ? temp_Filelist.desc :'',
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }


  //下载文档
  downloadFile = () => {
    const {selectedRowKeys,selectedRows,project_id} = this.state;
    if (selectedRows && selectedRows.length) {
      this.setState({refresh:true});
      var cos = _util.getCos(null,GetTemporaryKey);
      var that = this;
      selectedRows.map((f,fIndex) => {
        var download_file_name  = f.name ? f.name :'document'
        if(f.source){
          const source_list = _util.switchToJson(f.source);
          const file = source_list[0];
          console.log('0402',file);
          const key = file.url ? file.url : '';
          const name = file.name ? file.name : '文档管理';
          if(!key){
            return
          }
          var url = cos.getObjectUrl({
              Bucket: 'ecms-1256637595',
              Region: 'ap-shanghai',
              Key:key,
              Sign: true,
          }, function (err, data) {
              if(data && data.Url){
                new Downloader({ 
                  url: data.Url,
                  filename:download_file_name
                }).then(function () {
                  message.success(`${name}下载成功`);
                  that.setState({refresh:false})
                }).catch(function (error) {
                  message.warning(`${name}下载失败`)
                  that.setState({refresh:false})
                });
              }else{
                that.setState({refresh:false})
              }
          });
        }
      })
    }else{
      message.warning('请选择数据');
    }   
  }

  //提交文档
  subDocument = () => {
    const {selectedRowKeys,selectedRows,project_id} = this.state;
    if (selectedRowKeys && selectedRowKeys.length) {
      if(selectedRows.length && selectedRows.some(d => {return d.status !== 1 && d.status !== 4})) {
        message.warning('审核中、已发布的会议纪要无法提交');
      }else {
        this.setState({refresh:true})
        MeetingMinutesSubmit({project_id, ids: selectedRowKeys.join(',')}).then((res) => {
          message.success('提交成功')
          this.setState({selectedRowKeys:[],selectedRows:[],refresh:false})
          this.getFile(this.checkCurrentKey()) 
        });        
      }
    }else{
        message.warning('请选择数据');
    }   
  }

  //禁用文档
  disableDocument  = () => {
    const {selectedRowKeys,selectedRows,project_id} = this.state;
    if (selectedRowKeys && selectedRowKeys.length) {
      this.setState({refresh:true})
      const data = selectedRowKeys.join(',')
      DisableDocument(project_id,{ids:data}).then((res) => {
        message.success('提交成功')
        this.getFile(this.checkCurrentKey())
        this.setState({selectedRowKeys:[],selectedRows:[],refresh:false})
      });
    }else{
        message.warning('请选择数据');
    }   
  }

  //打开审批modal
  showAuditModal = () => {
    const {selectedRowKeys,selectedRows} = this.state;
    // console.log(selectedRows)
    if (selectedRowKeys && selectedRowKeys.length) {
      if(selectedRows.length && selectedRows.some(d => {return d.status !== 2})) {
        message.warning('请选择审批中的会议纪要');
        return
      }else {
        this.setState({auditVisible:true})
      }      
    }else{
        message.warning('请选择数据');
    }
  }


   //关闭审批modal
  hideAuditModal = () => {
    this.setState({auditVisible:false})
  }


  //审批备注
  handleRemarksChange(e) {
    this.setState({
        audit_remarks: e.target.value
    })
  }

  //审批通过
  applyMeeting = () => {
    const {selectedRowKeys,selectedRows,project_id,audit_remarks, source} = this.state;
    if (selectedRowKeys && selectedRowKeys.length) {
      this.setState({refresh:true})
      const data = {
        project_id,
        ids:selectedRowKeys.join(','),
        remarks:audit_remarks,
        source: JSON.stringify(source),
        operation: 4
      }
      MeetingMinutesAudit(data).then((res) => {
        message.success('审批通过');
        this.hideAuditModal();
        this.getFile(this.checkCurrentKey());
        this.setState({selectedRowKeys:[],selectedRows:[],refresh:false});
      }).catch(error => {
        this.hideAuditModal();
      });
    }else{
        message.warning('请选择数据');
    }
  }

  //审批不通过
  unapplyMeeting = () => {
    const {selectedRowKeys,selectedRows,project_id,audit_remarks, source} = this.state;
    if (selectedRowKeys && selectedRowKeys.length) {
      this.setState({refresh:true})
      const data = {
        project_id,
        ids:selectedRowKeys.join(','),
        remarks:audit_remarks,
        source: JSON.stringify(source),
        operation: 5
      }
      MeetingMinutesAudit(data).then((res) => {
        message.success('审批不通过');
        this.hideAuditModal();
        this.getFile(this.checkCurrentKey());
        this.setState({selectedRowKeys:[],selectedRows:[],refresh:false});
      }).catch(error => {
        this.hideAuditModal();
      });
    }else{
        message.warning('请选择数据');
    }
  }

  showReplace = (id) => {
    this.setState({replaceVisiable:true,replace_id:id})
  }

  hideReplace = () => {
    this.setState({replaceVisiable:false,replace_Filelist:[],replace_id:''})
  }

  handleReplace = () => {
    const {project_id,replace_id,replace_Filelist} = this.state;
    if(!(replace_Filelist&&replace_Filelist.length)){
      message.warning('请上传文件')
      return
    }
    if(!replace_Filelist[0]['response']){
      message.warning('文件未上传成功')
      return
    }
    var file = [
      {
        name:replace_Filelist[0]['name'],
        url:replace_Filelist[0]['response']['file_name'],
        size:replace_Filelist[0]['size'],
        type:replace_Filelist[0]['type'],
      }
    ];
    const data = {
      id:replace_id,
      source:JSON.stringify(file)
    }
    ReplaceDocument(project_id,data).then(res => {
      message.success('保存成功');
      this.getFile(this.checkCurrentKey())
      this.hideReplace();
    })
  }

  replaceUpload = (info) => {
    let {fileList,file} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;

    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
    this.setState({replace_Filelist:fileList})
  }


  //修改注册目录文件
  showEdit = (id,directory) => {
    this.setState({documentEditVisiable:true})
    const project_id = _util.getStorage('project_id')
    documentRegisterFileDetail(project_id, {
      id:id,
      directory:directory&&directory.id ? directory.id :''
    }).then(res => {
      if(res&&res.data){
        this.setState({document_edit_data:res.data});
        //已上传文件 => fileList
        const {source} = res.data;
        if(source){
          var that = this;
          var cos = _util.getCos(null,GetTemporaryKey);
          const source_list = _util.switchToJson(source);
          if(source_list&&source_list.length){ 
            var obj = source_list[0]
            const key = obj.url;
            var url = cos.getObjectUrl({
                Bucket: 'ecms-1256637595',
                Region: 'ap-shanghai',
                Key:key,
                Sign: true,
            }, function (err, data) {
                if(data && data.Url){    
                    const file_obj =  {url:data.Url,name:obj.name,uid:-1,status: "done",cosKey:obj.url};             
                    const document_edit_file = [file_obj]
                    that.setState({document_edit_file});  
                }
            });       
         }          
        }
      }
    })
  }

  //编辑注册目录文件字段
  handleDocumentEditData = (val,field) => {
    console.log(val,field)
    const {document_edit_data} = this.state;
    document_edit_data[field] = val;
    this.setState({document_edit_data})
  }

  hideDocumentEdit = () => {
    this.setState({documentEditVisiable:false});
  }

  handleDocumentEditSubmit  =() => {
    const {document_edit_file,document_edit_data,project_id} = this.state;
    const {id,name,desc,directory} = document_edit_data;
    console.log(document_edit_file,document_edit_data);
    if(document_edit_file&&document_edit_file.length){
      if(!document_edit_file[0]['response']){
        message.warning('文件未上传成功')
        return
      }
      var file = [
        {
          name:document_edit_file[0]['name'],
          url:document_edit_file[0]['response']&&document_edit_file[0]['response']['file_name'] ? document_edit_file[0]['response']['file_name'] :document_edit_file[0]['cosKey'],
        }
      ]
      //console.log('0414',document_edit_data,document_edit_file,file)
      const data = {
        id:id,
        name:name,
        desc:desc,
        directory:directory&&directory.id ? directory.id :'',
        source:JSON.stringify(file),
      }
      
      documentRegisterFilePut(project_id,data).then(res => {
        message.success('修改成功')
        this.setState({documentEditVisiable:false});
        this.getFile(directory.id);
      })
    }else{
      message.warning('请上传文件')
    }
    
  }

  //修改显示禁用
  handleShowDis = (val) => {
    console.log(val)
    this.setState({show_dis:val});
    //this.getFile(this.checkCurrentKey());
    this.setState({tableLoading:true,fileData:[]})
    const {show_dis,pagination,project_id} = this.state;
    const params = {
      directory_id:this.checkCurrentKey(),
      show_dis:val?true:'',
      project_id:project_id,
      page : pagination.current,
      page_size : pagination.pageSize,
    }
    documentRegisterFile(params).then(res => {
      if(res.data){   
        let { results, count } = res.data;
        if(count){
          pagination.total = count;
          this.setState({pagination})
        }
        if(results&&results.length){
          this.setState({fileData:results})
        }
        this.setState({tableLoading:false})

      }
    })
  }

  showHistory = (history) => {
    this.setState({historyVisiable:true});
    this.renderHistoryFile(history)
  }

  hideHistory = () => {
    this.setState({historyVisiable:false,history_url_list:[]})
  }

  renderHistoryFile = (historyList) => { 
    this.setState({history_loading:true})
    const {history_url_list} = this.state;
    if(historyList&&historyList.length){
      //转换前端格式
        var that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        historyList.map((h,hIndex) => { 
          const source = _util.switchToJson(h.source)[0];//文件
          const key = source.url;
          var url = cos.getObjectUrl({
              Bucket: 'ecms-1256637595',
              Region: 'ap-shanghai',
              Key:key,
              Sign: true,
          }, function (err, data) {
              if(data && data.Url){       
                  const fileList = [{url:data.Url,name:source.name,uid:-1,status: "done"}] ;
                  const new_h = {...h,fileList:fileList} ;
                  history_url_list.push(new_h);
                  that.setState({history_url_list})
              }
          });
          if(hIndex == historyList.length -1){
            this.setState({history_loading:false});
          }
      })     
    }            
  }

  closeModal = () => {
      this.setState({
          modalVisible: false,
      })
  }

  newMeeting = () => {
    this.setState({modalVisible: true})
  }
  
  copyTemplate = () => {
    this.setState({
      modalVisible: false,
      templateModal: true
    })
  }

  StatusText = (code) => {
    switch (code) {
    case 1:
      return '创建';
    case 2:
      return '提交';
    case 3:
      return '通过';
    case 4:
      return '不通过';
    default:
      return null;
    }
  }

  doFilter = () => {
    const {column, filtering} = this.state

    if (!filtering) {
      column.forEach(c => {
        if (c.dataIndex !== 'operate' && c.dataIndex !== 'efm-index' && c.dataIndex !== 'operate1') {
          c.filter = true
        }
      })
      this.setState({column, filtering: true, reset: false})
    } else {
      column.forEach(c => {
        c.filter = false
      })
      this.setState({column, filtering: false, reset: true})
    }
  }

  handleFormChange = (value, field) => {
    // console.log(value, field)
    if (field === 'person_no') {
      const { persOptions } = this.state
      const { name, pers_no, cost_center, department } = persOptions.filter(o => o.id === value)[0]
      this.setState({
        name,
        pers_no,
        cost_center,
        department
      })
    }
    this.setState({
      [field]: value
    })
  }
  handleOk = () => {
    this.props.history.push({
        pathname: `/meeting/minutes/add/${this.state.template}`,
        state: {
          // id: this.state.template,
          typeId: _util.getSession('subid').id,
          templateId: this.state.template
        }
    })    
  }

  handleCancel = () => {
    this.setState({
      templateModal: false,
      recordModal: false
    })
  }

  showAuditRecord = (id) => {
    MeetingMinutesDetail(id, {project_id: _util.getStorage('project_id')}).then((res) => {
      const { audit_record } = res.data
      let obj = audit_record[0]
      let record = []
      if(obj.updated) {
        record = [
          {name: obj.created, operate_time: moment(obj.created_time).format('YYYY-MM-DD HH:mm'), status: 2},
          {name: obj.updated, operate_time: moment(obj.updated_time).format('YYYY-MM-DD HH:mm'), status: obj.status, remarks: obj.remarks}
        ]
      }else {
        record = [
          {name: obj.created, operate_time: moment(obj.created_time).format('YYYY-MM-DD HH:mm'), status: 2}
        ]
      }
      this.setState({audit_record: record, recordModal: true})
    })
  }

  handleUploadChange(info) {
    // console.log(info, cIndex, sIndex, qIndex)
    let { fileList } = info
    const status = info.file.status
    const { formatMessage } = this.props.intl
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功.`)   //上传成功
    } else if (status === 'error') {
      message.error(`${info.file.name} ${info.file.response.msg}.`)
    }
    // // onUploadFileOk
    const { meeting } = this.state
    let source = []
    if (fileList instanceof Array) {
      fileList.forEach((value) => {
        // source.push(value.response && value.response.file_name)
        source.push({ name: value.name, url: value.response && value.response.file_name })
      })
    }
    // meeting[cIndex].topic[sIndex].content[qIndex].source = source
    // meeting[cIndex].topic[sIndex].content[qIndex].fileList = fileList

    this.setState({
      source,
      meeting,
      fileList
      // uploadVisible: false,
      // fileList: []
    }, () => {
      // console.log()
    })

  }

  render() {
    const { column, check, refresh,
      firstLevelList,selectedFirstLevelKey,selectedSecondLevelKey,selectedThirdLevelKey,fileList,
      secondLevelList,thirdLevelList,secondShow,thirdShow,createNodeVisible,uploadVisiable,
      level_loading,fileData,pagination,tableLoading,temp_data,temp_value,
      selectedFirstLevelName,selectedSecondLevelName,selectedThirdLevelName,
      auditVisible,audit_remarks,editNodeVisible,edit_node,replaceVisiable,replace_Filelist,
      selectedRows,historyVisiable,historyList,history_url_list,new_file_name,new_file_desc,
      download_loading,documentEditVisiable,document_edit_data,document_edit_file, reset, filtering 
       } = this.state;
    const { formatMessage } = this.props.intl;
    let params = {
      project_id: _util.getStorage('project_id')
    }

    const uploadButton = (
      <Button>
        <Icon type="upload" /> upload
      </Button>
    );

    const props2 = {
      multiple: true,
      action: _util.getServerUrl(`/upload/document/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    }

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: '会议管理'
      },
      {
          name: '会议纪要',
          url: '/meeting/minutes'
      },
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <Spin indicator={antIcon} tip="下载中..." spinning={download_loading}>
          <div className="btn-group" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <Breadcrumb className={styles.file_Breadcrumb} style={{height:'32px'}}>
                <Breadcrumb.Item>
                  <Icon type="folder" theme="twoTone" />
                  <span>{'会议纪要'}</span>
                </Breadcrumb.Item>
                {
                  selectedFirstLevelKey || _util.getSession('parent') ?
                  <Breadcrumb.Item>
                    <Icon type="folder" theme="twoTone" />
                    <span>{selectedFirstLevelName ? selectedFirstLevelName : _util.getSession('parent').name}</span>
                  </Breadcrumb.Item>:''
                }
                
                {
                  selectedSecondLevelKey || _util.getSession('subid') ?
                  <Breadcrumb.Item>
                    <Icon type="folder" theme="twoTone" />
                    <span>{selectedSecondLevelName ? selectedSecondLevelName : _util.getSession('subid').name}</span>
                  </Breadcrumb.Item> :''
                }
                {
                  selectedThirdLevelKey ?
                  <Breadcrumb.Item>
                    <Icon type="folder" theme="twoTone" />
                    <span>{selectedThirdLevelName}</span>
                  </Breadcrumb.Item> :''
                } 
              </Breadcrumb>
            </div>
           {
             this.checkSelectedLevel() ? 
              <div>
                {/* <Button type='primary'  onClick={() => this.showUpload()} disabled={!this.checkSelectedLevel()}>上传</Button> */}
                <Button type='primary' onClick={() => this.newMeeting()} disabled={!this.checkSelectedLevel()}>新建会议</Button>
                <Button
                  style={{
                    background: filtering ? '#87d068' : '#1890ff',
                    border: 0,
                    color: '#fff'
                  }}
                  onClick={this.doFilter}
                >
                  <FormattedMessage id="component.tablepage.col-filter" defaultMessage="列筛选"/>
                </Button>
                {/* <Link to={{
                  pathname: "/meeting/minutes/add",
                  state: {
                    id: this.state.subid
                  }
                }}><Button type='primary' onClick={() => this.newMeeting()} disabled={!this.checkSelectedLevel()}>新建会议</Button></Link> */}
                {/* <Button type='primary'  onClick={() => this.downloadFile()}>下载</Button> */}
                <Button type='primary'  onClick={() => this.subDocument()}>提交</Button>
                <Button type='primary'  onClick={() => this.showAuditModal()}>审批</Button>
                {/* <Button type='danger'   onClick={() => this.disableDocument()}>禁用</Button> */}
                {/* <Checkbox onChange={(e) => this.handleShowDis(e.target.checked)} checked={this.state.show_dis}>显示禁用</Checkbox> */}
              </div>
              :
              null         
           }
   
          </div>

          <Modal
              title={'会议新增'}
              style={{ top: 20 }}
              visible={this.state.modalVisible}
              onCancel={this.closeModal}
              footer={null}
              maskClosable={false}
            >
              <div style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                <Link to={{
                  pathname: "/meeting/minutes/add",
                  state: {
                    typeId: _util.getSession('subid').id
                  }
                }}>
                    <Button type='primary' icon='form'>新建表单</Button>
                </Link>
                <Button icon='copy' onClick={() => this.copyTemplate()}>
                    会议复制
                </Button>
                {/* <Upload {...props}>
                    <Button icon='upload' style={{margin: '0 10px 0 10px'}}>
                        <FormattedMessage id="page.oneStop.cardOperation.excelImport" defaultMessage="选择excel导入"/>
                    </Button>
                </Upload> */}

                {/* <a href={_util.getImageUrl('template_excel/chip.xlsx')} download="芯片模板.xlsx">
                    <Button icon='download' >
                        <FormattedMessage id="page.oneStop.cardOperation.downExcel" defaultMessage="下载excel模板"/>
                    </Button>
                </a> */}
              </div>
          </Modal>

          <Modal
              title="选择会议模板"
              style={{ top: 20 }}
              visible={this.state.templateModal}
              // footer={null}
              maskClosable={false}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText="确定"
              cancelText="取消"
          >
              <div style={{
                  display: 'flex',
                  justifyContent: 'center'
              }}>
                <Select
                  allowClear
                  showSearch
                  onChange={value => this.handleFormChange(value, 'template')}
                  placeholder={formatMessage(translation.select)}
                  //value={this.state.demonstration}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  style={{width: '100%'}}
                >
                  {
                    this.state.searchOptions instanceof Array && this.state.searchOptions.length ? this.state.searchOptions.map((d, index) => {
                      return (<Option key={index} value={d.id}>{`${d.name}-${d.code}`}</Option>)
                    }) : null
                  }
                </Select>

                {/* <Select
                    allowClear
                    showSearch
                    placeholder={'请选择模板'}
                    notFoundContent={this.state.fetching ? <Spin size="small"/> : <FormattedMessage id="global.nodata" defaultMessage="暂无数据" /> }
                    filterOption={false}
                    onSearch={this.fetchUser}
                    onSelect={this.handleSelect}
                    style={{width: '100%'}}
                    value=''
                  >                       
                        {this.state.searchOptions.map((option, index) => {
                            return (
                                <Option
                                    // title={option.id}
                                    // value={option.id}
                                    name={option.name}
                                    title={_util.searchConcat(option)}
                                    key={option.id}
                                    >{_util.searchConcat(option)}</Option>
                                )
                            })
                        }
                </Select> */}
              </div>
          </Modal>

          <Modal
              title="流转记录"
              // style={{ top: 20 }}
              visible={this.state.recordModal}
              footer={null}
              maskClosable={false}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText="确定"
              cancelText="取消"
          >
              <div style={{
                  display: 'flex',
                  justifyContent: 'center'
              }}>
                <Timeline style={{ marginTop: 8 }}>
                  {
                    this.state.audit_record.map((info, infoIndex) => {
                      return (
                        <Timeline.Item style={{ fontSize: 12 }}>
                          <div>操作者:&emsp;{info.name}</div>
                          <div>操作:&emsp;{this.StatusText(info.status)}</div>
                          <div>操作时间:&emsp;{info.operate_time}</div>
                          {
                            infoIndex === 0
                              ? null
                              : <div>备注:&emsp;{_util.getOrNull(info.remarks)}</div>
                          }
                        </Timeline.Item>
                      )
                    })
                  }
                </Timeline>

              </div>
          </Modal>


          <Row gutter={24} style={{height: 'calc(100vh - 228px)',borderBottom:'1px solid rgb(232, 232, 232)'}}>          
            {/* 一级目录区 */}
            <Col span={firstLevelList&&firstLevelList.length ? 4 :0} style={{ overflow: "hidden", padding:0}}>
              <Spin spinning={level_loading}>
                <Scrollbars
                  style={{
                    height: 'calc(100vh - 228px)',
                    borderRight:'1px solid rgb(232, 232, 232)'
                  }}>
                  <Fragment>  
                    {
                      Array.isArray(firstLevelList) &&firstLevelList.map((d,index) => {
                        return(
                          <div 
                            key={d.id} 
                            className={styles.firstLevelItem}                 
                            style={{background:selectedFirstLevelKey == d.id || _util.getSession('parent').id == d.id ? 'rgba(0,0,0,0.08)' :''}}
                            onClick={() => this.handeFirstLevel(d.id,d.name)} 
                          >
                            <div className={styles.firstLevelItemLeft} >
                              <img 
                                src={require(selectedFirstLevelKey == d.id || _util.getSession('parent').id == d.id ? './file_o.png' : './file.png')} 
                                style={{height:'30px',marginRight:'5px'}}
                              />
                              <span>{d.name}</span>
                            </div>  
                            <Tooltip title="添加二级会议">
                              <Icon type='plus-square' onClick={(e) => this.openCreateNodeModal(e,d.id,2)}/>
                            </Tooltip>                          
                          </div>
                        ) 
                      })
                    }
                  </Fragment>
                </Scrollbars>
              </Spin>
            </Col>


            {/* 二级目录区 */}
            <Col span={secondLevelList&&secondLevelList.length ? 4 : 0} style={{ overflow: "hidden", padding:0}}>
            <Spin spinning={level_loading}>
            <Scrollbars
              style={{
                height: 'calc(100vh - 228px)',
                display:secondShow ? 'block' : 'none',
                borderRight:'1px solid rgb(232, 232, 232)'
              }}
            >                     
              <Fragment>  
              {
                  secondLevelList&&secondLevelList.map((d,index) => {
                    return(
                      <div 
                        key={d.id} 
                        className={styles.firstLevelItem} 
                        style={{background:selectedSecondLevelKey == d.id || _util.getSession('subid').id == d.id ? 'rgba(0,0,0,0.08)' :''}}
                        onClick={() => this.handeSecondLevel(d.id,d.name)} 
                      >
                          <div className={styles.firstLevelItemLeft} >
                            <img 
                              src={require(selectedSecondLevelKey == d.id || _util.getSession('subid').id == d.id ? './file_o.png' : './file.png')} 
                              style={{height:'30px',marginRight:'5px'}}
                            />
                            <span>{d.name}</span>
                          </div>
                          <div className={styles.firstLevelItemRight}>                            
                            <Tooltip title="编辑">
                              <Icon type='edit' onClick={(e) => this.openEditNodeModal(e,d,2)} style={{marginRight:'5px'}}/>
                            </Tooltip>
                            {/* <Tooltip title="添加子目录">
                              <Icon type='plus-square' onClick={(e) => this.openCreateNodeModal(e,d.id,3)}/>
                            </Tooltip> */}
                          </div>                        
                      </div>
                    ) 
                  })
                }
              </Fragment>
            </Scrollbars>
            </Spin>
            </Col>


            {/* 三级目录区 */}
            <Col span={thirdLevelList&&thirdLevelList.length ? 4 : 0} style={{ overflow: "hidden", padding:0}}>
            <Spin spinning={level_loading}>
            <Scrollbars
              style={{
                height: 'calc(100vh - 228px)',
                display:thirdShow ? 'block' : 'none',
                borderRight:'1px solid rgb(232, 232, 232)'
              }}
            >                     
              <Fragment>  
              {
                  thirdLevelList&&thirdLevelList.map((d,index) => {
                    return(
                      <div 
                        key={d.id} 
                        className={styles.firstLevelItem} 
                        style={{background:selectedThirdLevelKey == d.id ? 'rgba(0,0,0,0.03)' :''}}
                        onClick={() => this.handeThirdLevel(d.id,d.name)}
                      >
                        <div className={styles.firstLevelItemLeft}>
                          <Tooltip title={d.name}>
                            <img 
                              src={require(selectedThirdLevelKey == d.id ? './file_o.png' : './file.png')} 
                              style={{height:'30px',marginRight:'5px'}}
                            />
                            <span className={styles.firstLevelItemLeft_text}>{d.name}</span>
                          </Tooltip> 
                        </div>  
                        <div className={styles.firstLevelItemRight} >
                          <Tooltip title="编辑">
                            <Icon type='edit' onClick={(e) => this.openEditNodeModal(e,d,3)} />
                          </Tooltip>
                        </div> 
                      </div>
                    ) 
                  })
                }
              </Fragment>
            </Scrollbars>
            </Spin>
            </Col>      
            <Col style={{ overflow: "hidden"}}>
                <div
                  style={{
                    height: '100%',
                    overflowY: 'hidden',
                  }}
                >
                  
                  <VirtualTable
                    refresh={refresh}
                    columns={column}
                    dataSource={fileData}
                    onPaginationChange={this.handleTableChange}
                    pagination={pagination}
                    loading={tableLoading}
                    onSelectChange={this.onSelectChange}
                    reset={reset}
                    filtering={this.state.filtering}
                    selectedRows={selectedRows}
                  />

                  {/* <TablePage
                    refresh={refresh}
                    getFn={documentRegisterFile}
                    columns={column}
                    param={{
                      directory_id:selectedThirdLevelKey?selectedThirdLevelKey : selectedSecondLevelKey ? selectedSecondLevelKey :selectedFirstLevelKey ? selectedFirstLevelKey:'',
                      show_dis:1
                    }}
                  >
                    <Button type='primary'  onClick={() => this.showUpload()}>上传</Button>
                    <Button type='primary'>下载</Button>
                    <Button type='primary'>审批</Button>
                    <Button type='danger'>禁用</Button>
                    <Button type='primary'>显示禁用</Button>
                  </TablePage> */}
                  
                </div>
            </Col>
          </Row>

          {/* 添加子目录 */}
          <Modal
              title={'添加二级类型'}
              visible={createNodeVisible}
              onOk={() => this.createNode()}
              onCancel={() => this.hideCreateNewNodeModal()}
              okText={'确认'}
              cancelText={'取消'}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'类型名称'}
                  required
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleNodeChange(e.target.value, 'subname')}
                      defaultValue={null}
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'缩写'}
                  required
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleNodeChange(e.target.value, 'subabbr')}
                      defaultValue={null}
                  />
              </FormItem>                   
          </Modal>

          {/* 编辑子目录 */}
          <Modal
              title={'编辑'}
              visible={editNodeVisible}
              onCancel={() => this.hideEditNodeModal()}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
              footer={
                <div>
                  {/* <Button  onClick={() => this.hideEditNodeModal()}>取消</Button> */}
                  <Button type='primary' onClick={() => this.editNode()}>修改</Button>
                  <Button type='danger'onClick={() => this.deleteNode()}>删除</Button>             
                </div>
              }
          >
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'类型名称'}
                  required
              >
                  <Input 
                      allowClear
                      style={{width: '100%'}}
                      onChange={e => this.handleNodeChange(e.target.value, 'subname')}
                      // value={edit_node&&edit_node.name ? edit_node.name :''}
                      value={this.state.subname ? this.state.subname : edit_node.name}
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'缩写'}
                  required
              >
                  <Input 
                      allowClear
                      style={{width: '100%'}}
                      onChange={e => this.handleNodeChange(e.target.value, 'subabbr')}
                      value={this.state.subabbr ? this.state.subabbr : edit_node.abbr}
                  />
              </FormItem>                  
          </Modal>

          {/* 上传文件 */}
          <Modal
              title={'上传'}
              visible={uploadVisiable}
              onOk={this.handleUploadSubmit}
              onCancel={this.hideUpload}
              okText={'保存'}
              cancelText={'取消'}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
              bodyStyle={{paddingTop:0}}
          >
            <Tabs defaultActiveKey="1" onChange={(activeKey) => this.handleUploadType(activeKey)}>
              <TabPane tab="本地上传" key="1">
              <FormItem 
                    labelCol={{ span: 5 }} 
                    wrapperCol={{ span: 15 }} 
                    label={'选择文件'}
                    required={true}
                >
                  <Upload
                    {...props2}
                    fileList={fileList}
                    //beforeUpload={_util.beforeUpload}
                    onChange={this.fileUpload}
                  >
                    {
                      fileList&&fileList.length == 0 ?
                      <Button>
                          <Icon type="upload" />上传
                      </Button>:''
                    }
                    
                  </Upload>    
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'文件名称'}
                  required={true}
                  placeholder={'请输入文件名称'}
                >
                  <Input onChange={this.handleName} value={new_file_name}/>
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'文件描述'}
                  placeholder={'请输入文件描述'}
                >
                  <Input onChange={this.handleDesc}/>
                </FormItem>
                 
              </TabPane>
              <TabPane tab="临时目录" key="2">
                <FormItem 
                    labelCol={{ span: 5 }} 
                    wrapperCol={{ span: 15 }} 
                    label={'选择文件'}
                    required={true}
                    extra={'请输入文档编号或文档名称搜索'}
                >
                    <Select
                    allowClear
                    //mode='multiple'
                    style={{ width: '100%' }}
                    onChange={(value) => this.onHandleTemp(value)}
                    showSearch
                    placeholder={'请输入文档编号或文档名称搜索'}
                    
                    value={temp_value}
                    optionFilterProp="children"
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    filterOption={false}
                    onSearch={this.fetchTemp}
                  >
                    {
                      temp_data&&temp_data.length ? temp_data.map(d => {
                      return <Option key={d.code} value={d.code} title={d.name}><span>{d.code}-{d.name}</span></Option>
                      }) :[]
                    }
                  </Select>
                </FormItem> 
                <FormItem
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'文件名称'}
                  required={true}
                  placeholder={'请输入文件名称'}
                >
                  <Input onChange={this.handleName} value={new_file_name}/>
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'文件描述'}
                  placeholder={'请输入文件描述'}
                >
                  <Input onChange={this.handleDesc} value={new_file_desc}/>
                </FormItem>
                
              </TabPane>
            </Tabs>             
          </Modal>


          {/* 修改文件 */}
          <Modal
              title={'修改'}
              visible={documentEditVisiable}
              onOk={this.handleDocumentEditSubmit}
              onCancel={this.hideDocumentEdit}
              okText={'保存'}
              cancelText={'取消'}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              <FormItem 
                    labelCol={{ span: 5 }} 
                    wrapperCol={{ span: 15 }} 
                    label={'选择文件'}
                    required={true}
                >
                  <Upload
                    {...props2}
                    fileList={document_edit_file}
                    onChange={this.editFileUpload}
                  >
                    {
                      document_edit_file&&document_edit_file.length == 0 ?
                      <Button>
                          <Icon type="upload" />上传
                      </Button>:''
                    }                  
                  </Upload>    
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'文件名称'}
                  required={true}
                  placeholder={'请输入文件名称'}
                >
                  <Input onChange={(e) => this.handleDocumentEditData(e.target.value,'name')} value={document_edit_data.name ? document_edit_data.name :''}/>
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'文件描述'}
                  placeholder={'请输入文件描述'}
                >
                  <Input onChange={(e) => this.handleDocumentEditData(e.target.value,'desc')} value={document_edit_data.desc ? document_edit_data.desc :''}/>
                </FormItem>                        
          </Modal>


           {/* 替换文件 */}
           <Modal
              title={'替换文件'}
              visible={replaceVisiable}
              onOk={this.handleReplace}
              onCancel={this.hideReplace}
              okText={'保存'}
              cancelText={'取消'}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
            <Upload
              {...props2}
              fileList={replace_Filelist}
              //beforeUpload={_util.beforeUpload}
              onChange={this.replaceUpload}
            >
              {
                replace_Filelist&&replace_Filelist.length == 0 ?
                <Button>
                    <Icon type="upload" />上传
                </Button>:''
              }
              
            </Upload>         
          </Modal>

          {/* 审批 */}
          <Modal
              title={'会议审批'}
              visible={auditVisible}
              onCancel={() => this.hideAuditModal()}
              okText={'确认'}
              cancelText={'取消'}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
              footer={null}
          >
              <Form>
                  <FormItem
                      label={<FormattedMessage id="page.construction.projectAudit.audit2" defaultMessage="审批备注"/>}
                  >
                      <TextArea
                         value={audit_remarks}
                         onChange={e => this.handleRemarksChange(e)} 
                      />
                  </FormItem>
                  <FormItem
                    label={"附件（选填）"}
                    extra={"附件大小限制15M，格式限制jpg、jpeg、png、gif、bmp、pdf、xlsx、xls、docx、doc、zip"}>
                    <div style={{ width: '50%' }}>
                      <Upload
                        {...props2}
                        fileList={fileList}
                        beforeUpload={(file, files) => _util.beforeUploadFile(file, files, 3)}
                        // onPreview={this.handlePreview}
                        onChange={this.handleUploadChange.bind(this)}
                        accept='image/*,.pdf,.xlsx,.xls,.docx,.doc,.zip'
                        // accept='image/*'
                      >
                        {fileList.length < 5 ? uploadButton : null}
                      </Upload>
                    </div>
                  </FormItem>
                  <FormItem
                      style={{display: 'flex', justifyContent: 'center'}} >
                      <Button type="primary" onClick={() => this.applyMeeting()} 
                              style={{marginRight: '10px'}}>
                          <FormattedMessage id="app.button.approve" defaultMessage="通过" />
                      </Button>
                      <Button type="danger" onClick={() => this.unapplyMeeting()} 
                              style={{marginRight: '10px', bgColor: '#f5222d'}}>
                          <FormattedMessage id="app.button.unpass" defaultMessage="不通过" />
                      </Button>                   
                  </FormItem>
              </Form>          
          </Modal>
          

          {/* 历史版本 */}
          <Modal
              title={'历史版本'}
              visible={historyVisiable}
              onCancel={this.hideHistory}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
              footer={null}
          >
            <Spin spinning={this.state.history_loading}>
              <List
                size="small"
                bordered
                dataSource={history_url_list&&history_url_list.length ? history_url_list :[]}
                renderItem={
                  (item,index) => <List.Item style={{display:'flex',alignItems:"center"}}>
                    <span>{`V${index + 1}`}</span>&nbsp;&nbsp;
                    <span>上传时间:{item.created_time ? moment(item.created_time).format("YYYY-MM-DD HH:mm:ss") :''}</span>&nbsp;&nbsp;
                    <Upload 
                      fileList={item.fileList}
                      showUploadList={{showRemoveIcon: false}} 
                    />
                  </List.Item>}
              />
            </Spin>  
          </Modal>
        </Spin>
        </div>
      </div>
    )
  }
}