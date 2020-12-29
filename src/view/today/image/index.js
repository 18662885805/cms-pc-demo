import React from "react";
import { Link } from "react-router-dom";
import { Divider, Popconfirm, message, Tag,Button, Modal,Form,Input,Upload,Icon,Table,Spin, } from "antd";
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import COS from 'cos-js-sdk-v5'
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import TablePage from "@component/TablePage";
import {FormattedMessage, injectIntl, defineMessages, intlShape} from "react-intl";
import {imageList,imagePost,imageDelete,imagePut} from "@apis/today/image"
import {GetTemporaryKey} from "@apis/account/index"
import {inject, observer} from "mobx-react/index";
import moment from 'moment';

const _util = new CommonUtil();
const FormItem = Form.Item;

const messages = defineMessages({
  No: {
    id: "app.table.column.No",
    defaultMessage: "序号"
  },
  title: {
    id:"page.system.setting.title",
    defaultMessage:"标题"
  },
  type: {
    id:"page.system.setting.type",
    defaultMessage:"类型"
  },
  content: {
    id:"page.system.setting.content",
    defaultMessage:"内容"
  },
  created: {
    id:"page.system.setting.created",
    defaultMessage:"创建人"
  },
  created_time: {
    id:"page.system.setting.created_time",
    defaultMessage:"创建日期"
  },
  updated: {
    id:"page.system.setting.updated",
    defaultMessage:"上次修改人"
  },
  updated_time: {
    id:"page.system.setting.updated_time",
    defaultMessage:"修改日期"
  },
  status: {
    id:"page.system.setting.status",
    defaultMessage:"状态"
  },
  operate: {
    id:"page.system.setting.operate",
    defaultMessage:"操作"
  },
})

let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];


@inject("appState") @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      column: [
        {
          title: formatMessage(messages.No),
          dataIndex: "efm-index",
          width:'50px',
          render: (text, record, index) => {
            return (index + 1);
          }
        },
        {
          title: '图片描述',
          dataIndex: "desc",
          render: (text, record, index) => {
            const id = record.id;
            return (
                 <a onClick={() => this.openPreviewModal(record)}>
                   {record.desc}
                </a>       
               
            );
          }
        },
        {
          title: '图片文件名',
          dataIndex: "name",
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created),
          dataIndex: "created",
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.created_time),
          dataIndex: "created_time",
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(messages.operate),
          render: (text, record, index) => {
            const id = record.id;
            const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
            const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");
            return (
              <div>
                {
                  canEdit ?
                  <a onClick={() => this.openEditModal(record)}>
                      <FormattedMessage id="global.revise" defaultMessage="修改"/>
                  </a> :''
                }                      
                <Divider type="vertical"/>
                {
                  canDelete ?
                  <Popconfirm placement="topRight"
                      title={<p><FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/></p>}
                      okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                      cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                      onConfirm={() => {
                        this.onDeleteOne(id);
                      }}>
                      <a style={{ color: "#f5222d" }}><FormattedMessage id="global.delete" defaultMessage="删除"/></a>
                  </Popconfirm> :''
                }  
              </div>
            );
          }
        }
      ],
      check: _util.check(),
      uploadVisiable:false,
      fileList:[],
      previewImage:'',
      previewVisible:false,
      tableData:[
        {id:1,title:'图片一',desc:'desc-1',created:'jmy',created_time:"2020-02-27"},
        {id:2,title:'图片二',desc:'desc-2',created:'jmy',created_time:"2020-02-27"},
      ],
      desc:'',
      count:0,
      imageUrl:null,
      imageUrl2:null,
      editModal:false,
      edit_img_url:'',
      editData:{},
      previewModal:null,
      previewModal:false,
      file_loading:false
    };
  }

  componentDidMount(){
    const project_id = _util.getStorage('project_id');
    this.setState({project_id:project_id})
    this.getImageList();
    GetTemporaryKey().then((res) => {
      if(res.data){
        const {credentials,expiredTime,startTime} = res.data;
        console.log('0312',credentials);
        const {sessionToken,tmpSecretId,tmpSecretKey} = credentials;
        this.setState({sessionToken,tmpSecretKey,tmpSecretId,expiredTime,startTime});
        _util.setStorage('sessionToken', sessionToken);
        _util.setStorage('tmpSecretKey', tmpSecretKey);
        _util.setStorage('tmpSecretId', tmpSecretId);
        _util.setStorage('UploadExpiredTime', expiredTime);
      }
    })
  }

  componentWillUnmount(){
    console.log('0304',this.state.tableData)
  }

  getImageList = () => {
    const project_id = _util.getStorage('project_id')
    imageList({project_id:project_id}).then((res) => {
      if(res&&res.data){
        console.log('0305',res.data.results);
        this.setState({
          count:res.data.count,
          tableData:res.data.results
        })
      }
    })
  }


  

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { tableData } = this.state;
    const dragRow = tableData[dragIndex];

    this.setState(
      update(this.state, {
        tableData: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      }),
    );
  };
  
  
  onDeleteOne = id => {
    const {formatMessage} = this.props.intl;
    const project_id = _util.getStorage('project_id');
    this.setState({ refresh: false });
    imageDelete(project_id, {id:id}).then(() => {
      message.success('删除成功');
      this.setState({ refresh: true });
    });
  }

  showUpload = () => {
      this.setState({uploadVisiable:true});
  }

  hideUpload = () => {
    this.setState({uploadVisiable:false})
  }

  handleAddSubmit = () => {
    this.setState({ refresh: false });
    const project_id = _util.getStorage('project_id');
    const {fileList,desc,count} = this.state;
    let file = _util.setSourceList(fileList);
    if(!desc){
      message.warning('请输入描述')
      return
    }
    if(!file){
      message.warning('请上传文件')
      return
    }
    const data = {
      desc:desc,
      place:count + 1,
      source:JSON.stringify(file),
    }
    imagePost(project_id,data).then((res) => {
      if(res.data){
        this.hideUpload();
        message.success('添加成功');
        this.setState({ refresh: true ,fileList: []});
      }
    })
  }

  setSourceList = (fileList) => {
    let source = []
    if (fileList instanceof Array) {
      fileList.forEach((value) => {
        source.push({name:value.name,url:value.cosKey})
      })
    }
    return source
  }

  handleUpload = (info) => {
    var that = this;
    var cos = _util.getCos(null,GetTemporaryKey)
    cos.putObject({
      Bucket: 'ecms-1256637595',
      Region: 'ap-shanghai',
      Key:`source/${info.file.uid}`,
      Body: info.file,
      onProgress: function (progressData) {
        console.log('上传中', JSON.stringify(progressData));
      },
    }, function (err, data) {
        if(data&&data.Location){
          //上传成功
          message.success(`${info.file.name}上传成功`)
          //获取cos URL
          var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:`source/${info.file.uid}`,
            Sign: true,
          }, function (err, data) {
              if(data && data.Url){
                console.log('---cos URL---',data.Url);
                const newFile  = [{
                  uid: -1,
                  name: info.file.name,
                  status: 'done',
                  url:data.Url,
                  cosKey: `source/${info.file.uid}`,
                }]
                that.setState({fileList:newFile});
              }
          });
        }else{
          message.warning('上传失败,请重试')
        }
    });
  }

  testUpload2 = (info) => {
    message.success(`${info.file.name}上传成功`);
    const newFile  = [{
      uid: -1,
      name: 'image-1',
      status: 'done',
      url: 'source/pic30.nipic.com/20130607/8716187_224735233000_2.jpg',
      response: {
        content: {
          results: {
            url: 'source/pic30.nipic.com/20130607/8716187_224735233000_2.jpg'
          }
        }
      }
    }]
    this.setState({fileList: newFile})
  }



  showImageUrl = () => {
    var timestamp = (new Date()).valueOf();
    var that  = this;
    var cos = new COS({
      // 必选参数
      getAuthorization: function (options, callback) {
        const UploadExpiredTime =  _util.getStorage('UploadExpiredTime');
        if(UploadExpiredTime&&timestamp < UploadExpiredTime){
          //未过期
          callback({
            TmpSecretId: _util.getStorage('tmpSecretId'),
            TmpSecretKey:  _util.getStorage('TmpSecretKey'),
            XCosSecurityToken: _util.getStorage('XCosSecurityToken'),
            StartTime: timestamp, 
            ExpiredTime:_util.getStorage('UploadExpiredTime'), 
          });
        }else{
          //过期
          GetTemporaryKey().then((res) => {
            if(res.data){
              const {credentials,expiredTime,startTime} = res.data;
              const {sessionToken,tmpSecretId,tmpSecretKey} = credentials;
              callback({
                TmpSecretId: tmpSecretId,
                TmpSecretKey: tmpSecretKey,
                XCosSecurityToken: sessionToken,
                StartTime: startTime, 
                ExpiredTime: expiredTime, 
              });
            }
          })
        } 
     }
    });
    var url = cos.getObjectUrl({
      Bucket: 'ecms-1256637595',
      Region: 'ap-shanghai',
      Key: '1mb.zip',
      Expires: 60,
      Sign: true,
    }, function (err, data) {
        console.log(err || data && data.Url);
    });
    console.log('url',url);
  }



  imageUpload = (info) => {
    let {fileList,file} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;

    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
    this.setState({fileList: fileList})
  }

  handlePreview = (file) => {
      this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
      });
  }

  handleCancel = () => {
      this.setState({previewVisible:false})
  }

  handleDesc = (e) => {
    console.log(e.target.value);
    this.setState({desc:e.target.value})
  }

  showUrl = () =>{
    var cos = _util.getCos(null,GetTemporaryKey);
    var url = _util.getCosUrl(this,cos,'source/rc-upload-1584183270170-2');
  }

  openEditModal = (record) => {
    this.setState({editModal:true,editData:record})
    this.renderImg(record&&record.source); 
  }

  handleEditSubmit = () => {
    this.setState({ refresh: false });
    const {project_id,editData} = this.state;
    imagePut(project_id,editData).then(res => {
        message.success('保存成功')  
        this.setState({refresh:true})    
        this.closeEditModal();
    })
  }

  closeEditModal=()=>{
    this.setState({editModal:false,editData:{},edit_img_url:''});
  }

  handleEditData = (value, field) => {
    const { editData } = this.state
    editData[field] = value
    this.setState({
      editData
    })
  }

  openPreviewModal = (record) => {
    this.setState({previewModal:true})
    this.renderImg(record&&record.source); 
  }

  closePreviewModal = () => {
    this.setState({previewModal:false,edit_img_url:''})
  }



  renderImg = (str) => {
    this.setState({file_loading:true})
    const fileList = this.switchToJson(str);
    if(fileList&&fileList.length){
        const key = fileList[0]['url'];
        var that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:key,
            Sign: true,
        }, function (err, data) {
            if(data && data.Url){  
              that.setState({edit_img_url:data.Url,file_loading:false});
            }
        });
    }       
}

switchToJson = (str) => {
  return eval('(' + str + ')');
}




  render() {
    const { column, check, refresh,uploadVisiable,fileList,previewImage,previewVisible,tableData,editModal,
      edit_img_url,editData,previewModal } = this.state;
    const { formatMessage } = this.props.intl;
    const props2 = {
      multiple: true,
      action: _util.getServerUrl(`/upload/auth/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    }
    const canAdd = _util.getStorage('is_project_admin')|| this.state.check(this, "add");
    return (
      <div>
        <MyBreadcrumb />       
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={imageList}
            columns={column}
            dataMap={data => {
              data.forEach(d => {
                d.name = _util.switchToJson(d.source)&&_util.switchToJson(d.source).length ? _util.switchToJson(d.source)[0]['name'] : ''
              });
            }}
          >
            {canAdd ? <Button type="primary" icon="upload" onClick={() => this.showUpload()}>上传</Button> :''}
          </TablePage>
          
          {/* <Table
            columns={column}
            dataSource={tableData}
            components={this.components}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow,
            })}
          /> */}
          <Modal
              title={'上传'}
              visible={uploadVisiable}
              onOk={this.handleAddSubmit}
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
                label={'图片描述'}
                required={true}
              >
                <Input onChange={this.handleDesc} placeholder={'请输入描述'}/>
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'选择图片'}
                  required={true}
              >
                <Upload
                  {...props2}
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={_util.beforeUpload}
                  onChange={this.imageUpload}
                  //customRequest={this.handleUpload}
                  accept='image/*'
                  className='avatar-uploader'
                >
                  {
                    fileList&&fileList.length == 0 ?
                    <Button>
                        <Icon type="upload" />上传
                    </Button>:''
                  }
                  
                </Upload>    
                <Modal visible={previewVisible} footer={null}
                        onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
              </FormItem>    
          </Modal>
          <Modal
              title={<FormattedMessage id="app.page.text.modify" defaultMessage="修改" />}
              visible={editModal}
              onOk={() => this.handleEditSubmit()}
              onCancel={() => this.closeEditModal()}
              okText={'保存'}
              cancelText={<FormattedMessage id="app.component.tablepage.cancelText" defaultMessage="取消" />}
              maskClosable={false}
              okButtonProps={null}
              destroyOnClose={true}
          >
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'描述'}
                  required={true}
              >
                  <Input 
                      style={{width: '100%'}}
                      onChange={e => this.handleEditData(e.target.value,'desc')}
                      value={editData.desc ? editData.desc :null}
                      placeholder={'请输入描述'}
                  />
              </FormItem>
              <FormItem 
                  labelCol={{ span: 5 }} 
                  wrapperCol={{ span: 15 }} 
                  label={'图片'}
              >
                <Spin spinning={this.state.file_loading}> 
                  <img src={edit_img_url} style={{height:'200px'}}></img>
                </Spin> 
                  
              </FormItem>                  
          </Modal>
          <Modal
              title={'预览'}
              visible={previewModal}
              onCancel={() => this.closePreviewModal()}
              footer={null}
              okButtonProps={null}
              destroyOnClose={true}
              width={'700px'}
              bodyStyle={{display:'flex',justifyContent:'center'}}
          >           
            <Spin spinning={this.state.file_loading}> 
                  <img src={edit_img_url} style={{maxWidth:'600px'}}></img>
                </Spin>       
          </Modal>
        </div>        
      </div>
    );
  }
}