import React, { Fragment } from 'react'
import { Modal, Select, message, Tag, Row, Col, Card, Spin, Tree, Divider,Icon,Button,Checkbox,
  Popconfirm,Tooltip,Form,Input,Upload,Tabs,Breadcrumb,Table,List, InputNumber} from 'antd'
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
  SharedDocument
} from '@apis/document/register';
import { user } from '@apis/admin/user';
import { FormattedMessage, injectIntl, defineMessages, } from 'react-intl'
import translation from "../translation";
import VirtualTable from '@component/VirtualTable3'
import { inject, observer } from 'mobx-react'
import styles from './index.module.css'
import { Scrollbars } from 'react-custom-scrollbars'
import TablePage from '@component/TablePage'
import {GetTemporaryKey} from "@apis/account/index"
import Downloader from 'js-file-downloader';
import copy from  'copy-to-clipboard';
import {getURL} from '@apis/system/url'


const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select
const { TabPane } = Tabs;
const { Search } = Input;
const {TextArea} = Input;
const confirm = Modal.confirm
const _util = new CommonUtil();


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
          dataIndex: 'efm-index',
          render: (text, record, index) => {
            return (index + 1)
          }
        },
        {
          title: '文件编号',
          dataIndex: 'code',
          width: 160,
          sorter: _util.sortString,
          render: (value, record) => {
            const {id,directory,status} = record
            let path = {
              pathname: '/document/register/document/detail',
              state: {
                id: id,
                directory:directory.id ? directory.id :'',
                show_dis:status == 4 ? true : '',
              }
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
          title: '文件名称',
          dataIndex: 'name',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: '文件描述',
          dataIndex: 'desc',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        { 
          title: '版本',
          dataIndex: 'version',
          width: 60,
          sorter: _util.sortString,
          render: (text, record, index) => {
            const {version,history} = record;
            if(history&&history.length){
              return <a onClick={() => this.showHistory(history)}>{`V${version}`}</a>
            }else{
              return <span>{`V${version}`}</span>
            }
          }
        },
        // { 
        //   title: '分享记录',
        //   dataIndex: 'code',
        //   sorter: _util.sortString,
        //   render: (value, record) => {
        //     const {id,directory,status,shared} = record
        //     let path = {
        //       pathname: '/document/register/document/share',
        //       state: {
        //         id: id,
        //         directory:directory.id ? directory.id :'',
        //         show_dis:status == 4 ? true : '',
        //       }
        //     };
        //     return (
        //       status == 3 && shared && shared.length?
        //       <Link to={path}>
        //         查看
        //       </Link> :''
        //     )
            
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
          width: 80,
          sorter: _util.sortString,
          render: record => _util.renderDocumentStatusText(record)
        },
        {
          title: '操作',    //操作
          dataIndex: 'operate',
          width: 120,
          render: (text, record, index) => {
            const {id,status,directory} = record;
            let path = {
              pathname: '/training/paper/edit',
              state: {
                id: id
              }
            }
            return (
              <div
                style={{paddingLeft:'5px'}}
              >     
                {
                  (status == 1 || status == 5) ? <a onClick={() => this.showEdit(id,directory)} style={{marginRight:'5px' }}>修改</a> :''
                } 
                {
                  status == 3 ? 
                  <div>
                    <a onClick={() => this.showReplace(id)} style={{ color: 'green',marginRight:'5px' }}>替换</a>
                    <a onClick={() => this.showShare(id)}>分享</a>
                  </div> :''
                }             
                {(status == 1 || status == 5) ?
                  <Popconfirm
                    placement="left"
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
      editNodeVisible:'',
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
      project_id:_util.getStorage('project_id') ? _util.getStorage('project_id') :'',
      shareVisiable:false,
      shareUser:[{name:'',phone:''}],
      urlVisiable:false,
      shareURL:'http://localhost:3000/downloadURL/',
      baseURL:'http://localhost:3000',
      LinkInfo:'',
      shareInfo:{document_id:'',title:'',expire:7},
      shareRecordVisiable:false,
      search: '',
      loading:false
    }
  }

  componentDidMount(){
    const project_id =  _util.getStorage('project_id');
    this.setState({project_id,level_loading:true});
    documentRegisterInfo({project_id:project_id}).then((res) => {
      if(res.data){
        this.setState({
          firstLevelList:res.data
        })
      }
      this.setState({level_loading:false});
      this.initialOpenState();
    });
    getURL().then(res => {
      if(res.data&&res.data.pc_url){
        this.setState({ 
          baseURL:res.data.pc_url
        })
      }else{
        message.warning('获取URL失败')
      }  
    })
    
  }

  componentWillReceiveProps(nextProps){
    
  }

  initialOpenState = () => {
    var selectedFirstLevelKey = _util.getStorage('selectedFirstLevelKey');
    var selectedSecondLevelKey = _util.getStorage('selectedSecondLevelKey');
    var selectedThirdLevelKey = _util.getStorage('selectedThirdLevelKey');
    var selectedFirstLevelName = _util.getStorage('selectedFirstLevelName');
    var selectedSecondLevelName = _util.getStorage('selectedSecondLevelName');
    var selectedThirdLevelName = _util.getStorage('selectedThirdLevelName');
    if(selectedThirdLevelKey&&selectedThirdLevelName){
      this.initialThirdLevel(selectedThirdLevelKey,selectedThirdLevelName)
      return
    }
    if(selectedSecondLevelKey&&selectedSecondLevelName){
      this.initialSecondLevel(selectedSecondLevelKey,selectedSecondLevelName)
      return
    }
    if(selectedFirstLevelKey&&selectedFirstLevelName){
      this.initialFirstLevel(selectedFirstLevelKey,selectedFirstLevelName)
      return
    }
  }

  //恢复三级目录打开
  initialThirdLevel = (id,name) => {
    const {project_id} = this.state;
    var selectedFirstLevelKey = _util.getStorage('selectedFirstLevelKey');
    var selectedSecondLevelKey = _util.getStorage('selectedSecondLevelKey');
    var selectedFirstLevelName = _util.getStorage('selectedFirstLevelName');
    var selectedSecondLevelName = _util.getStorage('selectedSecondLevelName');
    //获取文件列表
    this.getFile(id);
    //打开一级目录
    this.setState({level_loading:true})
    this.closeSecondLevel();//清空二级目录
    this.closeThirdLevel();//清空三级目录
    this.setState({
      selectedFirstLevelKey:selectedFirstLevelKey,
      selectedFirstLevelName:selectedFirstLevelName
    });
    GetDirectoryNode({nid:selectedFirstLevelKey,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          secondLevelList:res.data,
          secondShow:true
        })
      }else{
        this.setState({
          secondLevelList:[],
          secondShow:false
        })
      }
      this.setState({level_loading:false, })
    })
    //打开二级目录
    this.setState({level_loading:true})
    this.closeThirdLevel();//清空三级目录
    this.setState({
      selectedSecondLevelKey:selectedSecondLevelKey,
      selectedSecondLevelName:selectedSecondLevelName
    });
    GetDirectoryNode({nid:selectedSecondLevelKey,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          thirdLevelList:res.data,
          thirdShow:true
        })
      }else{
        this.setState({
          thirdLevelList:[],
          thirdShow:false
        })
      }
      this.setState({level_loading:false, })
    })
    //打开三级目录
    this.setState({selectedThirdLevelKey:id,selectedThirdLevelName:name});
  }


  //恢复二级目录打开
  initialSecondLevel = (id,name) => {
    const {project_id} = this.state;
    var selectedFirstLevelKey = _util.getStorage('selectedFirstLevelKey');
    var selectedFirstLevelName = _util.getStorage('selectedFirstLevelName');
    //获取文件列表
    this.getFile(id)
    //打开一级目录
    this.setState({level_loading:true})
    this.closeSecondLevel();//清空二级目录
    this.closeThirdLevel();//清空三级目录
    this.setState({
      selectedFirstLevelKey:selectedFirstLevelKey,
      selectedFirstLevelName:selectedFirstLevelName
    });
    GetDirectoryNode({nid:selectedFirstLevelKey,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          secondLevelList:res.data,
          secondShow:true
        })
      }else{
        this.setState({
          secondLevelList:[],
          secondShow:false
        })
      }
      this.setState({level_loading:false, })
    })
    //打开二级目录
    this.setState({level_loading:true})
    this.closeThirdLevel();//清空三级目录
    this.setState({
      selectedSecondLevelKey:id,
      selectedSecondLevelName:name
    });
    GetDirectoryNode({nid:id,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          thirdLevelList:res.data,
          thirdShow:true
        })
      }else{
        this.setState({
          thirdLevelList:[],
          thirdShow:false
        })
      }
      this.setState({level_loading:false, })
    })
  }

  //恢复一级目录打开
  initialFirstLevel = (id,name) => {
    const {project_id} = this.state;
    //获取文件列表
    this.getFile(id)
    //打开一级目录
    this.setState({level_loading:true})
    this.closeSecondLevel();//清空二级目录
    this.closeThirdLevel();//清空三级目录
    this.setState({
      selectedFirstLevelKey:id,
      selectedFirstLevelName:name
    });
    GetDirectoryNode({nid:id,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          secondLevelList:res.data,
          secondShow:true
        })
      }else{
        this.setState({
          secondLevelList:[],
          secondShow:false
        })
      }
      this.setState({level_loading:false, })
    })
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

  getFile = (directory_id,new_search,new_pagination) => {
    this.setState({tableLoading:true,fileData:[]})
    const {show_dis,pagination,project_id,search} = this.state;
    const params = {
      directory_id:directory_id,
      show_dis:show_dis ? true : '',
      project_id:project_id,
      page : new_pagination ? new_pagination.current : pagination.current,
      page_size : new_pagination ? new_pagination.pageSize : pagination.pageSize,
      search:new_search
    }
    documentRegisterFile(params).then(res => {
      if(res.data){    
        console.log('0506','getFile',directory_id)
        let { results, count } = res.data;
        if(count){
          pagination.total = count;
          this.setState({pagination})
        }else{
          this.setState({pagination: {
            pageSize: _util.getSession('pageSize') ? _util.getSession('pageSize') : _util.getPageSize(),
            showSizeChanger: true,
            pageSizeOptions: _util.getPageSizeOptions(),
            current: _util.getSession('currentPage') ? _util.getSession('currentPage') : 1
          }})
        }
        if(results&&results.length){
          this.setState({fileData:results})
        }else{
          this.setState({fileData:[]})
        }
        this.setState({tableLoading:false})

      }
    })
  }

  //点击一级目录
  handeFirstLevel = (id,name) => {
    const {selectedFirstLevelKey} = this.state;
    // if(selectedFirstLevelKey == id){
    //   return
    // }
    this.setState({level_loading:true})
    this.closeSecondLevel();//清空二级目录
    this.closeThirdLevel();//清空三级目录
    const {project_id} = this.state;
    this.setState({
      selectedFirstLevelKey:id,
      selectedFirstLevelName:name
    });
    _util.setStorage('selectedFirstLevelKey',id);
    _util.setStorage('selectedFirstLevelName',name);
    GetDirectoryNode({nid:id,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          secondLevelList:res.data,
          secondShow:true
        })
      }else{
        this.setState({
          secondLevelList:[],
          secondShow:false
        })
      }
      this.setState({level_loading:false, })
    })
    this.getFile(id)
  }

  //点击二级目录
  handeSecondLevel = (id,name) => {
    const {selectedSecondLevelKey} = this.state;
    // if(selectedSecondLevelKey == id){
    //   return
    // }
    this.setState({level_loading:true})
    this.closeThirdLevel();//清空三级目录
    const {project_id} = this.state;
    this.setState({
      selectedSecondLevelKey:id,
      selectedSecondLevelName:name
    });
    _util.setStorage('selectedSecondLevelKey',id);
    _util.setStorage('selectedSecondLevelName',name);
    GetDirectoryNode({nid:id,project_id:project_id}).then(res => {
      if(res.data&&res.data.length){
        this.setState({
          thirdLevelList:res.data,
          thirdShow:true
        })
      }else{
        this.setState({
          thirdLevelList:[],
          thirdShow:false
        })
      }
      this.setState({level_loading:false, })
    })
    this.getFile(id)
  }

  //点击三级目录
  handeThirdLevel = (id,name) => {
    const {selectedThirdLevelKey} = this.state;
    // if(selectedThirdLevelKey == id){
    //   return
    // }
    this.setState({selectedThirdLevelKey:id,selectedThirdLevelName:name});
    _util.setStorage('selectedThirdLevelKey',id);
    _util.setStorage('selectedThirdLevelName',name);
    this.getFile(id)
  }

  openCreateNodeModal = (e,id,level) => {
    e.stopPropagation();
    console.log('0326',id,level)
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
    e.stopPropagation();
    this.setState({
      editNodeVisible:true,
      edit_node:record,
      edit_level:level,
      new_node_parent:record.parent ? record.parent.id :'',
    })
  }

  //关闭编辑子目录
  hideEditNodeModal = () => {
    const {edit_level} = this.state;
    this.setState({
      editNodeVisible:false,
      edit_node:'',
      edit_level:'',
    });
    if(edit_level == 2){
      this.freshNewSecondLevel();//刷新二级子目录
    }else if(edit_level == 3){
      this.freshNewThirdLevel();//刷新三级子目录
    }
  }

  handleNewNodeName = (value) => {
    this.setState({new_node_name:value})
  }

  handleEditNodeName = (value) => {
    const {edit_node} = this.state;
    edit_node.name = value
    this.setState({edit_node})
  }

  hideCreateNewNodeModal = () => {
    this.setState({createNodeVisible:false})
  }

  //创建子目录
  createNode = () => {
    const {
      new_node_level,
      new_node_parent,
      new_node_name,
      project_id
    } = this.state;
    if(!new_node_name){
      message.warning('请输入目录名称')
      return
    }
    this.setState({level_loading:true})
    CreateNodeDirectory(project_id,{name:new_node_name,parent:new_node_parent}).then(res => {
      this.hideCreateNewNodeModal();
      if(new_node_level == 2){
         //刷新新的二级目录列表
        this.freshNewSecondLevel();
      }else if(new_node_level == 3){
         //刷新新的三级目录列表
         this.freshNewThirdLevel();
      }
      this.setState({level_loading:false})
    })
  }

  //编辑子目录
  editNode = () => {
    const {project_id,edit_node} = this.state;
    const data = {
      id:edit_node.id,
      parent:edit_node.parent.id,
      name:edit_node.name
    }
    UpdateNodeDirectory(project_id,data).then(res => {
      message.success('修改成功')
      this.hideEditNodeModal()
    })
  }

  //删除子目录
  deleteNode = () => {
    const {project_id,edit_node} = this.state;
    const _this = this;
    confirm({
      title: '确认删除?',
      content: '单击确认按钮后，将会删除数据',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        DeleteNodeDirectory(project_id,{id:edit_node.id ?edit_node.id :''}).then(res => {
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
    GetDirectoryNode({nid:new_node_parent,project_id:project_id}).then(res => {
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
    _util.removeStorage('selectedSecondLevelKey')
  }

  //关闭&&清空三级目录
  closeThirdLevel = () => {
    this.setState({
      thirdLevelList:[],
      thirdShow:false,
      selectedThirdLevelKey:''
    })
    _util.removeStorage('selectedThirdLevelKey')
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
    
    if(fileList&&fileList.length){
      this.setState({document_edit_file:[fileList[0]]})
      if(fileList[0]['name']){
        const full_name = fileList[0]['name']
        const full_name_list = full_name.split('.');
        if(full_name_list&&(full_name_list.length>0)){
          const fileType = full_name_list.pop();
        }
        var new_file_name = full_name_list.join('.')
        this.handleDocumentEditData(new_file_name,'name')
      }
    }else{
      this.setState({document_edit_file:fileList})
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
    //this.setState({fileList:fileList})
    if(fileList&&fileList.length){
      this.setState({fileList:[fileList[0]]})
      if(fileList[0]['name']){
        const full_name = fileList[0]['name']
        const full_name_list = full_name.split('.');
        if(full_name_list&&(full_name_list.length>0)){
          const fileType = full_name_list.pop();
        }
        this.setState({new_file_name:full_name_list.join('.')})
      }
    }else{
      this.setState({fileList:fileList})
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
    const pager = {...pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      fileData: []
    });
    const {search} = this.state;
    this.getFile(this.checkCurrentKey(),search,pager)
  }

  checkSelectedLevel = () => {
    const {
      selectedFirstLevelKey,
      selectedSecondLevelKey,
      selectedThirdLevelKey
    } = this.state;
    if(selectedThirdLevelKey||selectedSecondLevelKey||selectedFirstLevelKey){
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
    const {project_id} = this.state;
    const directory = this.checkCurrentKey();
    if(!directory){
      message.warning('请选择目录!')
    }
    documentRegisterFileDelete(project_id,{id:id,directory:directory}).then((res) => {
      message.success('已删除')      //已删除
      this.getFile(directory);
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
        var download_file_name  = f.name ? f.name :'文档管理'
        if(f.source){
          const source_list = _util.switchToJson(f.source);
          if(!(source_list&&source_list.length)){
            return
          }
          const file = source_list[0];
          const key = file.url ? file.url : '';
          const name = file.name ? file.name : '文档管理';
          if(!key){
            return
          }
          var fileType = that.getFileType(name)
          var url = cos.getObjectUrl({
              Bucket: 'ecms-1256637595',
              Region: 'ap-shanghai',
              Key:key,
              Sign: true,
          }, function (err, data) {
              if(data && data.Url){
                var filename = fileType ? download_file_name + '.' + fileType : download_file_name;
                new Downloader({ 
                  url: data.Url,
                  filename:filename
                }).then(function () {
                  message.success(`${filename}下载成功`);
                  that.setState({refresh:false})
                }).catch(function (error) {
                  message.warning(`${filename}下载失败`)
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

  //获取文件类型
  getFileType = (name) => {
    const full_name_list = name.split('.');
    let fileType;
    if(full_name_list&&(full_name_list.length>1)){
      fileType = full_name_list.pop();
    }else{
      fileType = '';
    }
    return fileType
  }

  //提交文档
  subDocument = () => {
    const {selectedRowKeys,selectedRows,project_id} = this.state;
    if (selectedRowKeys && selectedRowKeys.length) {
      this.setState({refresh:true})
      const data = selectedRowKeys.join(',')
      SubDocument(project_id,{ids:data}).then((res) => {
        message.success('提交成功')
        this.setState({selectedRowKeys:[],selectedRows:[],refresh:false})
        this.getFile(this.checkCurrentKey()) 
      });
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
    this.setState({auditVisible:true})
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
  applyDocument = () => {
    const {selectedRowKeys,selectedRows,project_id,audit_remarks} = this.state;
    if (selectedRowKeys && selectedRowKeys.length) {
      this.setState({refresh:true})
      const data = {
        ids:selectedRowKeys.join(','),
        remarks:audit_remarks,
        operation:4
      }
      AuditDocument(project_id,data).then((res) => {
        message.success('提交成功');
        this.hideAuditModal();
        this.getFile(this.checkCurrentKey());
        this.setState({selectedRowKeys:[],selectedRows:[],refresh:false});
      });
    }else{
        message.warning('请选择数据');
    }
  }

  //审批不通过
  unapplyDocument = () => {
    const {selectedRowKeys,selectedRows,project_id,audit_remarks} = this.state;
    if (selectedRowKeys && selectedRowKeys.length) {
      this.setState({refresh:true})
      const data = {
        ids:selectedRowKeys.join(','),
        remarks:audit_remarks,
        operation:5
      }
      AuditDocument(project_id,data).then((res) => {
        message.success('提交成功');
        this.hideAuditModal();
        this.getFile(this.checkCurrentKey());
        this.setState({selectedRowKeys:[],selectedRows:[],refresh:false});
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
    // this.setState({replace_Filelist:fileList})
    if(fileList&&fileList.length){
      this.setState({replace_Filelist:[fileList[0]]})
    }else{
      this.setState({replace_Filelist:fileList})
    }
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
                    const file_obj =  {url:data.Url,name:obj.name,uid:-1,status: "done",cosKey:obj.url,response:{file_name:obj.url}};             
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
    console.log('0426',document_edit_file,document_edit_data)
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

  showShare = (id) => {
    const {shareInfo} = this.state;
    shareInfo['document_id'] = id;
    this.setState({shareVisiable:true,shareInfo})
  }

  hideShare = () => {
    this.setState({
      shareVisiable:false,
      shareUser:[{name:'',phone:''}],
      shareInfo:{document_id:'',title:'',expire:7}
    })
  }

  handleShareInfo = (value,field) => {
    console.log(value)
    const {shareInfo} = this.state;
    shareInfo[field] = value;
    this.setState({
      shareInfo
    })
  }

  handleShareUser = (value,field,index) => {
    const {shareUser} = this.state;
    shareUser[index][field] = value;
    this.setState({
      shareUser
    })
  }

  addShareUser = (i) => {
    const {shareUser} = this.state;
    if(!shareUser[i].name || !shareUser[i].phone){
        message.error('请补全被分享人信息！');
        return false
    }
    shareUser.push({
      name:'',phone:''
    });
    this.setState({shareUser})
  };


  removeShareUser = index => {
    const { shareUser } = this.state;
    shareUser.splice(index, 1);
    this.setState({shareUser})
  };

  submitShare = () => {
    const {project_id,shareInfo,shareUser} = this.state;
    console.log(shareInfo,shareUser)
    const {document_id,title,expire} = shareInfo;
    var Link_title = title;
    var project_name = _util.getStorage('project_name')
    if(!document_id){
      message.warning('请选择要分享的文档!')
      return
    }
    if(!title){
      message.warning('请输入分享标题!')
      return
    }
    if(shareUser&&shareUser.length){
      if(!shareUser[0].name || !shareUser[0].phone){
        message.warning('请补全被分享人信息!')
        return
      }
      var data = {
        document_id:document_id,
        title:title,
        expire:expire,
        person:JSON.stringify(shareUser)
      }
      SharedDocument(project_id,data).then(res => {
        console.log('0512',res)
        if(res&&res.data){
          this.hideShare();
          if(res.data.url){
            const {baseURL,project_id} = this.state;
            var shareURL = `${baseURL}/downloadURL/?url=${res.data.url}&project_id=${project_id}`
            var LinkInfo = `项目名称:${project_name}  分享标题:${Link_title}  下载链接:${baseURL}/downloadURL/?url=${res.data.url}&project_id=${project_id}`
            this.setState({
              urlVisiable:true,
              shareURL,
              LinkInfo,
              url:res.data.url,
            })
          }
        }
      })
      
    }else{
      message.warning('请输入被分享人!')
    }
  }

  hideURL = () => {
    this.setState({urlVisiable:false,shareURL:''})
  }

  copyURL = () => {
    const {url,LinkInfo} = this.state;
    if(url){
      copy(LinkInfo);
      message.success('复制成功')
    }
  }

  showShareHistory = () => {
    this.setState({shareRecordVisiable:true})
  }

  hideShareHistory = () => {
    this.setState({shareRecordVisiable:false})
  }


  handleSearch = (value) => {
    _util.removeSession('scrollTop');
    this.setState({search:value})
    this.getFile(this.checkCurrentKey(),value)
  }

  //筛选
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
  




  render() {
    const { column, check, refresh,filtering,
      firstLevelList,selectedFirstLevelKey,selectedSecondLevelKey,selectedThirdLevelKey,fileList,
      secondLevelList,thirdLevelList,secondShow,thirdShow,createNodeVisible,uploadVisiable,
      level_loading,fileData,pagination,tableLoading,temp_data,temp_value,
      selectedFirstLevelName,selectedSecondLevelName,selectedThirdLevelName,
      auditVisible,audit_remarks,editNodeVisible,edit_node,replaceVisiable,replace_Filelist,
      selectedRows,historyVisiable,historyList,history_url_list,new_file_name,new_file_desc,
      download_loading,documentEditVisiable,document_edit_data,document_edit_file,shareVisiable,
      shareUser,urlVisiable,shareRecordVisiable,
    } = this.state;
    const { formatMessage } = this.props.intl;

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
          name: '文档管理'
      },
      {
          name: '注册文档管理',
          url: '/document/register/document'
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
                  <span>{'注册文档管理'}</span>
                </Breadcrumb.Item>
                {
                  selectedFirstLevelKey?
                  <Breadcrumb.Item>
                    <Icon type="folder" theme="twoTone" />
                    <span onClick={() => this.handeFirstLevel(selectedFirstLevelKey,selectedFirstLevelName)} style={{cursor:'pointer'}}>{selectedFirstLevelName}</span>
                  </Breadcrumb.Item>:''
                }
                
                {
                  selectedSecondLevelKey?
                  <Breadcrumb.Item>
                    <Icon type="folder" theme="twoTone" />
                    <span onClick={() => this.handeSecondLevel(selectedSecondLevelKey,selectedSecondLevelName)} style={{cursor:'pointer'}}>{selectedSecondLevelName}</span>
                  </Breadcrumb.Item> :''
                }
                {
                  selectedThirdLevelKey ?
                  <Breadcrumb.Item>
                    <Icon type="folder" theme="twoTone" />
                    <span onClick={() => this.handeThirdLevel(selectedThirdLevelKey,selectedThirdLevelName)} style={{cursor:'pointer'}}>{selectedThirdLevelName}</span>
                  </Breadcrumb.Item> :''
                } 
              </Breadcrumb>
            </div>
           
           {
             this.checkSelectedLevel() ?
             <div>
              <Button type='primary'  onClick={() => this.showUpload()} disabled={!this.checkSelectedLevel()}>上传</Button>
              <Button type='primary'  onClick={() => this.downloadFile()}>下载</Button>
              <Button type='primary'  onClick={() => this.subDocument()}>提交</Button>
              <Button type='primary'  onClick={() => this.showAuditModal()}>审批</Button>
              <Button type='danger'   onClick={() => this.disableDocument()}>禁用</Button>
              <Checkbox onChange={(e) => this.handleShowDis(e.target.checked)} checked={this.state.show_dis}>显示禁用</Checkbox>
              <Button
                style={{
                  background: filtering ? '#87d068' : '#1890ff',
                  border: 0,
                  color: '#fff'
                }}
                onClick={this.doFilter}
              >
                <FormattedMessage id="component.tablepage.col-filter" defaultMessage="列筛选" />
              </Button>
              <Search
                placeholder={'全表搜索'}  //全表搜索
                onSearch={this.handleSearch}
                enterButton
                style={{width: '160px'}}
              />
            </div> :''
           }
            
          </div>
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
                      firstLevelList&&firstLevelList.map((d,index) => {
                        return(
                          <div 
                            key={d.id} 
                            className={styles.firstLevelItem}                 
                            style={{background:selectedFirstLevelKey == d.id ? 'rgba(0,0,0,0.08)' :''}}
                            onClick={() => this.handeFirstLevel(d.id,d.name)} 
                          >
                            <div className={styles.firstLevelItemLeft} >
                              <img 
                                src={require(selectedFirstLevelKey == d.id ? './file_o.png' : './file.png')} 
                                style={{height:'30px',marginRight:'5px'}}
                              />
                              <span>{d.name}</span>
                            </div>  
                            <Tooltip title="添加子目录">
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
                        style={{background:selectedSecondLevelKey == d.id ? 'rgba(0,0,0,0.08)' :''}}
                        onClick={() => this.handeSecondLevel(d.id,d.name)} 
                      >
                          <div className={styles.firstLevelItemLeft} >
                            <img 
                              src={require(selectedSecondLevelKey == d.id ? './file_o.png' : './file.png')} 
                              style={{height:'30px',marginRight:'5px'}}
                            />
                            <span>{d.name}</span>
                          </div>
                          <div className={styles.firstLevelItemRight}>                            
                            <Tooltip title="编辑">
                              <Icon type='edit' onClick={(e) => this.openEditNodeModal(e,d,2)} style={{marginRight:'5px'}}/>
                            </Tooltip>
                            <Tooltip title="添加子目录">
                              <Icon type='plus-square' onClick={(e) => this.openCreateNodeModal(e,d.id,3)}/>
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
              title={'添加子目录'}
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
                  label={'目录名称'}
                  required
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleNewNodeName(e.target.value)}
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
                  <Button  onClick={() => this.hideEditNodeModal()}>取消</Button>
                  <Button type='primary' onClick={() => this.editNode()}>确认</Button>
                  <Button type='danger'onClick={() => this.deleteNode()}>删除</Button>             
                </div>
              }
          >
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'目录名称'}
                  required
              >
                  <Input 
                      allowClear
                      style={{width: '100%'}}
                      onChange={e => this.handleEditNodeName(e.target.value)}
                      value={edit_node&&edit_node.name ? edit_node.name :''}
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
              title={'审批文件'}
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
                      style={{display: 'flex', justifyContent: 'center'}} >
                      <Button type="primary" onClick={() => this.applyDocument()} 
                              style={{marginRight: '10px'}}>
                          <FormattedMessage id="app.button.approve" defaultMessage="通过" />
                      </Button>
                      <Button type="danger" onClick={() => this.unapplyDocument()} 
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

          {/* 分享 */}
          <Modal
              title={'分享'}
              visible={shareVisiable}
              onCancel={this.hideShare}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
              onOk={this.submitShare}
              okText={'保存'}
              cancelText={'取消'}
              width={'600px'}
          >
            <FormItem
              labelCol={{ span: 5 }} 
              wrapperCol={{ span: 18 }} 
              label={'分享标题'}
              required={true}
            >
              <Input onChange={e => this.handleShareInfo(e.target.value, 'title')}/>
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }} 
              wrapperCol={{ span: 18 }} 
              label={'有效期(天)'}
              required={true}
            >
              <InputNumber min={1} max={7} defaultValue={1} onChange={(value) => this.handleShareInfo(value, 'expire')}/>
            </FormItem>  
            <FormItem
              labelCol={{ span: 5 }} 
              wrapperCol={{ span: 18 }} 
              label={'被分享人'}
              required={true}
            >
              <Scrollbars
                style={{
                  height:'200px',
                }}
              >
                <Fragment>
                  <List
                  bordered
                  dataSource={shareUser}
                  size="small"
                  renderItem={
                    (item,index) => 
                    <List.Item className={styles.line_item}>
                      <Row gutter={24} className={styles.line_item}>
                        <Col span={8}>
                          <Input 
                            value={item.name ? item.name :''}
                            onChange={e => this.handleShareUser(e.target.value, 'name',index)}
                            maxLength={64}
                            placeholder={'姓名'}
                            size="small"
                          />
                        </Col>
                        <Col span={16} className={styles.line_item}>
                          <Input 
                            value={item.phone ? item.phone :''} 
                            maxLength={11}
                            onChange={e => this.handleShareUser(e.target.value, 'phone',index)}
                            placeholder={'手机'}
                            size="small"
                          />
                          <div className={styles.shareUserOperate}>
                          {
                            shareUser.length - 1 == index ? (
                              shareUser.length == 1 ? 
                                <Icon 
                                    type="plus-circle" 
                                    theme="twoTone" 
                                    style={{cursor:'pointer'}}
                                    onClick={() => this.addShareUser(index)}
                                  />
                              :<div className={styles.line_item}>
                                <Icon 
                                  type="minus-circle" 
                                  theme="twoTone" 
                                  style={{cursor:'pointer'}}
                                  onClick={() => this.removeShareUser(index)}
                                />
                                &nbsp;
                                &nbsp;
                                <Icon 
                                  type="plus-circle" 
                                  theme="twoTone" 
                                  style={{cursor:'pointer'}}
                                  onClick={() => this.addShareUser(index)}
                                />
                              </div>
                            )                             
                            :<Icon 
                              type="minus-circle" 
                              theme="twoTone" 
                              style={{cursor:'pointer'}}
                              onClick={() => this.removeShareUser(index)}
                            />
                          }
                          </div>

                          
                        </Col>                     
                      </Row>
                    </List.Item>}
                />
                </Fragment>
              </Scrollbars>
            </FormItem> 
          </Modal>

          {/* 分享链接 */}
          <Modal
              title={'分享链接'}
              visible={urlVisiable}
              onCancel={this.hideURL}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
              footer={
                <Button type='primary' onClick={() => this.copyURL()}>复制</Button>
              }
          >
            <TextArea  value={this.state.LinkInfo}/>
          </Modal>


          {/* 分享记录 */}
          <Modal
              title={'历史版本'}
              visible={shareRecordVisiable}
              onCancel={this.hideShareHistory}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
              footer={null}
          >
            
          </Modal>

        </Spin>
        </div>
      </div>
    )
  }
}