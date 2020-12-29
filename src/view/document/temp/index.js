import React, { Fragment } from 'react'
import { Modal, Select, message, Tag, Row, Col, Card, Spin, Tree, Divider,Icon,Button,Checkbox,
  Popconfirm,Tooltip,Form,Input,Upload} from 'antd'
import { Link } from 'react-router-dom'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import moment from "moment";
import {
    Temporary,
    TemporaryDetail,
    TemporaryPost,
    TemporaryPut,
    TemporaryDelete,
    TemporaryDocument,
    TemporaryDocumentDetail,
    TemporaryDocumentPost,
    TemporaryDocumentPut,
    TemporaryDocumentDelete
}from '@apis/document/temp';
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


const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const { Search } = Input;
const _util = new CommonUtil();



@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl
    this.state = {
      check: _util.check(), 
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
            const {id,directory} = record
            let path = {
              pathname: '/document/temporary/document/detail',
              state: {
                id: id,
                directory:directory.id ? directory.id :''
              }
            };
            return (
                <Link to={path}>
                  {value}
                </Link>
            )
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
        // {
        //   title: '版本',
        //   dataIndex: 'version',
        //   sorter: _util.sortString,
        //   render: record => _util.getOrNullList(`V${record}`)
        // },
        {
          title:'上传人',
          dataIndex: 'created',
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
        },
        {
          title: '上传时间',
          dataIndex: 'created_time',
          filterType: 'range-date',
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record ?  moment(record).format("YYYY-MM-DD HH:mm:ss") : '')
        }, {
          title: '最后修改人',      
          dataIndex: 'updated',
          sorter: _util.sortString,
          filterType: 'select',
          render: record => _util.getOrNullList(record)
      },
      {
          title: '最后修改时间',      
          dataIndex: 'updated_time',
          sorter: _util.sortDate,
          filterType: 'range-date',
          render: record => _util.getOrNullList(record ?  moment(record).format("YYYY-MM-DD HH:mm:ss") : '')
      },
        {
          title: '操作',    //操作
          dataIndex: 'operate',
          width: 120,
          render: (text, record, index) => {
            const id = record.id;
            const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
            const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");
            return (
              <div
              >
                {
                  canEdit ?
                  <a onClick={() => this.showEdit(record)}>修改</a> :''
                }                
                <Divider type="vertical"/>
                {
                  canDelete ? 
                  <Popconfirm
                    placement="left"
                    title={<FormattedMessage id="app.pop.title.delete" defaultMessage="确认删除？" />}
                    okText={<FormattedMessage id="app.button.ok" defaultMessage="确认" />}
                    cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消" />}
                    onConfirm={() => {
                      this.onDeleteFile(id)
                  }}>
                    <a style={{ color: '#f5222d' }}> <FormattedMessage id="app.page.text.delete" defaultMessage="删除" /> </a>
                  </Popconfirm> :''
                }
                
              </div>
            )
          }
        }
      ],
        
      temporaryList:[],
      selectedTempKey:'',
      createDocumentVisible:false,
      new_temp_name:'',

      uploadVisiable:false,
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
      editNodeVisible:false,
      edit_temp:null,
      replaceVisiable:false,
      replace_Filelist:[],
      edit_data:'',
      selectedRows:[],
      document_edit_file:[],
      project_id:_util.getStorage('project_id') ? _util.getStorage('project_id') :'',
      search: '',
      loading:false
    }
  }

  componentDidMount(){
    const project_id =  _util.getStorage('project_id');
    this.setState({project_id})
    this.getTemp();
    var selectedTempKey = _util.getStorage('selectedTempKey');
    if(selectedTempKey){
      this.handeTemporary(selectedTempKey)
    }
  }

  componentWillReceiveProps(nextProps){
  }


  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if (scrollTopPosition) {
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  getTemp = () => {
    const project_id =  _util.getStorage('project_id');
    this.setState({level_loading:true,selectedTempKey:''});
    Temporary({project_id:project_id}).then((res) => {
        if(res.data){
          if(res.data.results){
            this.setState({
              temporaryList:res.data.results
            })
          }
        }
        this.setState({level_loading:false})
    })
  }


  getFile = (directory_id,new_search,new_pagination) => {
    this.setState({tableLoading:true,fileData:[]})
    const {pagination,project_id} = this.state;
    const params = {
        directory_id:directory_id,
        project_id:project_id,
        page : new_pagination ? new_pagination.current : pagination.current,
        page_size : new_pagination ? new_pagination.pageSize : pagination.pageSize,
        search:new_search
    }
    TemporaryDocument(params).then(res => {
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

  //点击一级目录
  handeTemporary = (id) => {
    const {selectedTempKey} = this.state;
    if(selectedTempKey == id){
      return
    }
    this.setState({
      selectedTempKey:id,
    });
    _util.setStorage('selectedTempKey',id);
    this.getFile(id)
  }



  showUpload = () => {
    this.setState({uploadVisiable:true});
  }

  hideUpload = () => {
    this.setState({
      uploadVisiable:false,
      new_file_name:'',
      new_file_desc:'',
      fileList:[]
    })
  }

  handleDesc = (e) => {
    this.setState({new_file_desc:e.target.value})
  }

  handleName = (e) => {
    this.setState({new_file_name:e.target.value})
  }

  fileUpload_ = (info) => {
    let {fileList,file} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;
    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
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
    }
    
  }

  fileUpload = (info) => {
    let {fileList,file} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;

    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }

    if(fileList&&fileList.length){
      this.setState({fileList:[fileList[0]]})
    }else{
      this.setState({fileList:fileList})
    }
    
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


  handleUploadSubmit = () => {
    const {
      project_id,
      new_file_name,
      new_file_desc,
      selectedTempKey,
      fileList
    } = this.state;
    if(fileList&&fileList.length){
      if(fileList[0]['response']){
        var file = [
          {
            name:fileList[0]['name'],
            url:fileList[0]['response']['file_name'],
            size:fileList[0]['size'],
            type:fileList[0]['type'],
          }
        ]
        var directory = selectedTempKey;
        if(!directory){
          message.warning('请选择目录!')
          return
        }
        const data = {
          name:new_file_name,
          desc:new_file_desc,
          directory:directory,
          source:JSON.stringify(file),
        }
        TemporaryDocumentPost(project_id,data).then(res => {
          message.success('提交成功')
          this.hideUpload();
          this.getFile(directory)
        })
      }else{
        message.warning('文件未上传成功')
      }
    }else{
      message.warning('未上传文件')
    }
    
  }


  

  showCreateModal  = () => {
    this.setState({createDocumentVisible:true})
  }

  hideCreateDocumentModal = () => {
    this.setState({createDocumentVisible:false})
  }

  handleNewTempName = (val) => {
    this.setState({new_temp_name:val})
  }

  createTemp = () => {
    const {new_temp_name,project_id} = this.state;
    if(!new_temp_name){
        message.warning('请输入目录名')
        return
    }
    TemporaryPost(project_id,{name:new_temp_name}).then(res => {
        this.hideCreateDocumentModal()
        message.success('保存成功');
        this.getTemp();
    })
  }


  //打开编辑目录
  openEditTempModal = (e,record) => {
    e.stopPropagation();
    this.setState({editNodeVisible:true,edit_temp:record})
  }

  //关闭编辑目录
  hideEditTempModal = () => {
    this.setState({
      editNodeVisible:false,
      edit_temp:null
    });
    this.getTemp();
  }

  handleEditTempName = (value) => {
    const {edit_temp} = this.state;
    edit_temp.name = value
    this.setState({edit_temp})
  }

  //编辑目录
  editTemp = () => {
    const {project_id,edit_temp} = this.state;
    const data = {
      id:edit_temp.id,
      name:edit_temp.name
    }
    TemporaryPut(project_id,data).then(res => {
      message.success('修改成功')
      this.hideEditTempModal()
    })
  }

  //删除目录
  deleteTemp = () => {
    const {project_id,edit_temp} = this.state;
    const data = {
      id:edit_temp.id,
    }
    const _this = this
    confirm({
      title: '确认删除?',
      content: '单击确认按钮后，将会删除数据',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        TemporaryDelete(project_id,data).then(res => {
          message.success('修改成功')
          _this.hideEditTempModal()
        })
      },
      onCancel() {
      },
    })
  }

  //修改替换文件Modal
  showEdit = (record) => {
    this.setState({replaceVisiable:true,edit_data:record});
    //已上传文件 => fileList
    const {source} = record;
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

  hideReplace = () => {
    this.setState({replaceVisiable:false,replace_Filelist:[],replace_id:''})
  }

  //上传替换文件
  replaceUpload = (info) => {
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
    }else{
      this.setState({document_edit_file:fileList})
    }
  }


  handleEdit = (val,field) => {
    const {edit_data} = this.state;
    edit_data[field] = val;
    this.setState({edit_data});
  }

  //修改替换文件
  handleReplace = () => {
    const {project_id,replace_Filelist,edit_data,document_edit_file} = this.state;
    if(!(document_edit_file&&document_edit_file.length)){
      message.warning('请上传文件')
      return
    }
    if(!document_edit_file[0]['response']){
      message.warning('文件未上传成功')
      return
    }
    var file = [
      {
        name:document_edit_file[0]['name'],
        url:document_edit_file[0]['response']&&document_edit_file[0]['response']['file_name'] ? document_edit_file[0]['response']['file_name'] :document_edit_file[0]['cosKey'],
        // name:replace_Filelist[0]['name'],
        // url:replace_Filelist[0]['response']['file_name'],
        // size:replace_Filelist[0]['size'],
        // type:replace_Filelist[0]['type'],
      }
    ];
    var directory = edit_data&&edit_data.directory ? edit_data.directory.id :'';
    const data = {
      id:edit_data&&edit_data.id ? edit_data.id :'',
      directory:directory,
      name:edit_data&&edit_data.name ? edit_data.name :'',
      desc:edit_data&&edit_data.desc ? edit_data.desc :'',
      source:JSON.stringify(file)
    }
    TemporaryDocumentPut(project_id,data).then(res => {
      message.success('保存成功');
      this.hideReplace();
      this.getFile(directory)
    })
  }

  //删除文件
  onDeleteFile = (id) => {
    const {formatMessage} = this.props.intl;
    const {project_id,selectedTempKey} = this.state;
    const directory = selectedTempKey;
    if(!directory){
      message.warning('请选择目录!')
    }
    TemporaryDocumentDelete(project_id,{id:id,directory:directory}).then((res) => {
      message.success('已删除')      //已删除
      this.getFile(directory);
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }

  //下载文档
  downloadFile = () => {
    const {selectedRowKeys,selectedRows} = this.state;
    
    if (selectedRows && selectedRows.length) {
      this.setState({refresh:true});
      var cos = _util.getCos(null,GetTemporaryKey);
      var that = this;
      selectedRows.map((f,fIndex) => {
        var download_file_name  = f.name ? f.name :'文档管理'
        if(f.source){
          const source_list = JSON.parse(f.source);
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

  //修改页码
  handleTableChange = (pagination, filters = {}, sorter = {}) => {
    const {selectedTempKey} = this.state;
    const pager = {...pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      fileData: []
    });
    const {search} = this.state;
    this.getFile(selectedTempKey,search,pager)
  }

  //搜索
  handleSearch = (value) => {
    const {selectedTempKey} = this.state;
    _util.removeSession('scrollTop');
    this.setState({search:value})
    this.getFile(selectedTempKey,value)
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
    const { column, check, refresh,
      temporaryList,selectedTempKey,fileList,
      createDocumentVisible,uploadVisiable,
      level_loading,fileData,pagination,tableLoading,
      editNodeVisible,edit_temp,replaceVisiable,
      replace_Filelist,edit_data,new_file_name,
      selectedRows,document_edit_file,filtering,
       } = this.state;
    const { formatMessage } = this.props.intl;
    const props2 = {
      multiple: true,
      action: _util.getServerUrl(`/upload/document/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    }

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.component.breadcrumb.document" defaultMessage="文档管理"/>
      },
      {
          name: '临时文档管理',
          url: '/document/temporary/document'
      },

    ]

    const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");


    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper">
          <div className="btn-group" style={{display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
              <Button type='primary'  onClick={() => this.showCreateModal()}>新增目录</Button>
              {
                selectedTempKey ?
                <div>
                  {
                    canAdd ?
                    <Button type='primary'  onClick={() => this.showUpload()} disabled={!selectedTempKey}>上传文件</Button> :''
                  }          
                  <Button type='primary'  onClick={() => this.downloadFile()}>下载</Button>    
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
                    style={{width: '280px'}}
                  />    
                </div>
                :''
              }            
          </div>
          <Row gutter={24} style={{height: 'calc(100vh - 228px)',borderBottom:'1px solid rgb(232, 232, 232)'}}>          
            {/* 一级目录区 */}
            <Col span={6} style={{ overflow: "hidden", padding:0}}>
              <Spin spinning={level_loading}>
                <Scrollbars
                  style={{
                    height: 'calc(100vh - 228px)',
                    borderRight:'1px solid rgb(232, 232, 232)'
                  }}>
                  <Fragment>  
                    {
                        temporaryList&&temporaryList.length ?
                            temporaryList.map((d,index) => {
                                return(
                                <div 
                                    key={d.id} 
                                    className={styles.firstLevelItem}                 
                                    style={{background:selectedTempKey == d.id ? 'rgba(0,0,0,0.08)' :''}}
                                    onClick={() => this.handeTemporary(d.id)} 
                                >
                                    <div className={styles.firstLevelItemLeft} >
                                        <img 
                                            src={require(selectedTempKey == d.id ? './file_o.png' : './file.png')} 
                                            style={{height:'30px',marginRight:'5px'}}
                                        />
                                        <span>{d.name}</span>
                                    </div>  
                                    <div className={styles.firstLevelItemRight} >
                                        <Tooltip title="编辑">
                                          <Icon type='edit' style={{marginRight:"10px"}} onClick={(e) => this.openEditTempModal(e,d)}/>
                                        </Tooltip>                                     
                                    </div>
                                                              
                                </div>
                                ) 
                            }) 
                            :
                            <div className={styles.NoData}>
                                <p> <FormattedMessage id="global.nodata" defaultMessage="暂无数据" /> </p>
                            </div>
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
                </div>
            </Col>
          </Row>
          <Modal
              title={'新增目录'}
              visible={createDocumentVisible}
              onOk={() => this.createTemp()}
              onCancel={() => this.hideCreateDocumentModal()}
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
                      onChange={e => this.handleNewTempName(e.target.value)}
                      defaultValue={null}
                  />
              </FormItem>                     
          </Modal>


          {/* 编辑目录 */}
          <Modal
              title={'编辑'}
              visible={editNodeVisible}
              onCancel={() => this.hideEditTempModal()}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
              footer={
                <div>
                  <Button  onClick={() => this.hideEditTempModal()}>取消</Button>
                  <Button type='primary' onClick={() => this.editTemp()}>确认</Button>
                  <Button type='danger' onClick={() => this.deleteTemp()}>删除</Button>             
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
                      onChange={e => this.handleEditTempName(e.target.value)}
                      value={edit_temp&&edit_temp.name ? edit_temp.name :''}
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
          >
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
              >
                <Input onChange={this.handleName} value={new_file_name}/>
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }} 
                wrapperCol={{ span: 15 }} 
                label={'文件描述'}
              >
                <Input onChange={this.handleDesc}/>
              </FormItem>
                 
          </Modal>



          {/* 替换文件 */}
          <Modal
              title={'修改文件'}
              visible={replaceVisiable}
              onOk={this.handleReplace}
              onCancel={this.hideReplace}
              okText={'保存'}
              cancelText={'取消'}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
            <FormItem
              labelCol={{ span: 5 }} 
              wrapperCol={{ span: 15 }} 
              label={'文件名称'}
              required={true}
            >
              <Input onChange={(e) => this.handleEdit(e.target.value,'name')} value={edit_data&&edit_data.name ? edit_data.name :''}/>
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }} 
              wrapperCol={{ span: 15 }} 
              label={'文件描述'}
            >
              <Input onChange={(e) => this.handleEdit(e.target.value,'desc')} value={edit_data&&edit_data.desc ? edit_data.desc :''}/>
            </FormItem>
            <FormItem 
               labelCol={{ span: 5 }} 
               wrapperCol={{ span: 15 }} 
               label={'选择文件'}
               required={true}
            >
              <Upload
                {...props2}
                fileList={document_edit_file}
                //beforeUpload={_util.beforeUpload}
                onChange={this.replaceUpload}
              >
                {
                  document_edit_file&&document_edit_file.length == 0 ?
                  <Button>
                      <Icon type="upload" />上传
                  </Button>:''
                }
                
              </Upload>    
            </FormItem>          
          </Modal>
        </div>
      </div>
    )
  }
}