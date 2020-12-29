import React from "react";
import {
  inject,
  observer
} from "mobx-react";
import {
  Button,
  Form,
  Tag,
  Upload,
  Spin,
  List,
  message,
  Modal
} from "antd";
import MyBreadcrumb from "@component/bread-crumb";
import {documentRegisterFileDetail,DisabledShared} from "@apis/document/register";
import {GetTemporaryKey} from "@apis/account/index"
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import messages from "@utils/formatMsg";
import moment from "moment";
import FileSaver from "file-saver"
import Downloader from 'js-file-downloader';
import styles from './index.module.css'
let _util = new CommonUtil();

@inject("menuState") @observer @injectIntl
class DocumentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList:[],
      file_loading:false,
      version:1,
      shared:[],
      downloadVisiable:false,
      history_loading:false,
      downloadRecordList:[]
    };
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      const {id,directory,show_dis} = this.props.location.state;
      const project_id = _util.getStorage('project_id')
      documentRegisterFileDetail(project_id, {
        id:id,
        directory:directory,
        show_dis:show_dis ? true :''
      }).then((res) => {
        this.setState({
          ...res.data
        });

        if(res.data&&res.data.shared&&res.data.shared.length){
          this.setState({shared:res.data.shared})
        }


        if(res.data&&res.data.source){
          //转换前端格式
          var that = this;
          var cos = _util.getCos(null,GetTemporaryKey);
          const source_list = _util.switchToJson(res.data.source);
          if(source_list&&source_list.length){
             this.setState({file_loading:true})
             source_list.map((obj, index) => {
                 const key = obj.url;
                 var url = cos.getObjectUrl({
                     Bucket: 'ecms-1256637595',
                     Region: 'ap-shanghai',
                     Key:key,
                     Sign: true,
                 }, function (err, data) {
                     if(data && data.Url){    
                         const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};             
                         const new_list = [...that.state.fileList,file_obj];
                         that.setState({fileList:new_list});
                         if(index == source_list.length - 1){
                             that.setState({file_loading:false});
                         }
                     }
                 });
             });
          }                
       }
        this.props.menuState.changeMenuCurrentUrl("/document/register");
        this.props.menuState.changeMenuOpenKeys("/document");
      });
    }
  }


  // downloadFile1 = () => {
  //   //方法一
  //   const {source} = this.state;
  //   var cos = _util.getCos(null,GetTemporaryKey);
  //   const source_list = _util.switchToJson(source);
  //   if(source_list&&source_list.length){
  //     source_list.map((obj, index) => {
  //         const key = obj.url;
  //         const type = obj.type;
  //         const name = obj.name;
  //         cos.getObject({
  //           Bucket: 'ecms-1256637595',
  //           Region: 'ap-shanghai',
  //           Key: key,              /* 必须 */
  //         }, function(err, data) {
  //           console.log(err || data.Body); 
  //           if(data&&data.Body){
  //             var blob = new Blob([data.Body], {type : type});
  //             FileSaver.saveAs(blob, name);
  //           } 
  //         });
  //     });
  //   }    
  // }


  downloadFile2 = () => {
    //方法二
    const {source} = this.state;
    var cos = _util.getCos(null,GetTemporaryKey);
    const source_list = _util.switchToJson(source);
    if(source_list&&source_list.length){
      source_list.map((obj, index) => {
          const key = obj.url;
          const type = obj.type;
          const name = obj.name;
          var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:key,
            Sign: true,
        }, function (err, data) {
            if(data && data.Url){
              new Downloader({ 
                url: data.Url
              })
              .then(function () {
                message.success(`${name}下载成功`)
              })
              .catch(function (error) {
                message.warning(`${name}下载失败`)
              });
            }
        });
      });
    }    
  }

  // downloadFile3 = () => {
  //   const {source} = this.state;
  //   var cos = _util.getCos(null,GetTemporaryKey);
  //   const source_list = _util.switchToJson(source);
  //   if(source_list&&source_list.length){
  //     source_list.map((obj, index) => {
  //         const key = obj.url;
  //         const type = obj.type;
  //         const name = obj.name;
  //         var url = cos.getObjectUrl({
  //           Bucket: 'ecms-1256637595',
  //           Region: 'ap-shanghai',
  //           Key:key,
  //           Sign: true,
  //       }, function (err, data) {
  //           if(data && data.Url){  
  //             const elt = document.createElement('a');
  //             elt.setAttribute('href', data.Url);
  //             elt.setAttribute('download', name);
  //             elt.style.display = 'none';
  //             document.body.appendChild(elt);
  //             elt.click();
  //             document.body.removeChild(elt);
  //           }
  //       });
  //     });
  //   }    
  // }

  renderSubRecord = (record) => {
    if(record&&record.length){
      return (
        <List
            size="small"
            bordered
            dataSource={record}
            renderItem={item => (
              <List.Item className={styles.sub_record_item}>
                <div>{`提交人:${item.created}`}</div>
                <div>{item.created_time ? moment(item.created_time).format("YYYY-MM-DD HH:mm:ss") :''}</div>
              </List.Item>
            )}
        />
      )
    }else{
      return ''
    }
  }

  renderAuditRecord = (record) => {
    if(record&&record.length){
      return (
        <List
            size="small"
            bordered
            dataSource={record}
            renderItem={item => (
              <List.Item className={styles.audit_record_item}>
                <div className={styles.audit_record_item_created}>
                  <div>{`审批人:${item.created}`}</div>
                  <div>{item.created_time ? moment(item.created_time).format("YYYY-MM-DD HH:mm:ss") :''}</div>
                </div>
                {/* <div className={styles.audit_record_audit_detail}>
                  <div>{this.renderAuditStatus(item.status)}</div>
                  <div>{item.remarks}</div>
                </div> */}
                
              </List.Item>
            )}
        />
      )
    }else{
      return ''
    }
  }

  renderAuditStatus = (status) => {
    if(status ==4){
      return <Tag color="#108ee9">通过</Tag>
    }else if(status==5){
      return <Tag color="#f50">不通过</Tag>
    }else{
      return ''
    }
  }


  renderShareUser = (list) => {
    if(list&&list.length){
      return(
        <List
            size="small"
            bordered
            dataSource={list}
            renderItem={item => 
              <List.Item className={styles.shareRecordUserList}>
                <div>{item.name}-{item.phone}</div>
                <div>下载次数:&nbsp;&nbsp;{item.log&&item.log.length ? <a onClick={() => this.showDownloadRecord(item)}>{item.log.length}</a> :'0'}</div>
              </List.Item>}
        />
      )
    }
  }

  showDownloadRecord = (item) => {
    this.setState({downloadVisiable:true,history_loading:true});
    if(item.log&&item.log.length){
      this.setState({downloadRecordList:item.log})
    }
    this.setState({history_loading:false})
  }

  hideHistory = () => {
    this.setState({downloadVisiable:false,downloadRecordList:[]})
  }


  renderSubRecord = (record) => {
    if(record&&record.length){
      return (
        <List
            size="small"
            bordered
            dataSource={record}
            renderItem={item => (
              <List.Item className={styles.sub_record_item}>
                <div>{`提交人:${item.created}`}</div>
                <div>{item.created_time ? moment(item.created_time).format("YYYY-MM-DD HH:mm:ss") :''}</div>
              </List.Item>
            )}
        />
      )
    }else{
      return ''
    }
  }

  disableShare = (id) => {
    const project_id = _util.getStorage('project_id');
    DisabledShared(project_id,{shared_id:id}).then(res => {
      message.success('操作成功');
      const {id,directory,show_dis} = this.props.location.state;
      documentRegisterFileDetail(project_id, {
        id:id,
        directory:directory,
        show_dis:show_dis ? true :''
      }).then((res) => {
        this.setState({
          ...res.data
        });
        if(res.data&&res.data.shared&&res.data.shared.length){
          this.setState({shared:res.data.shared})
        }
      });
    })
  }

  renderShare = (item) => {
    const{title,expire,created,created_time,person,is_active,id} = item;
    return [
      {
        text: '有效期(天)',
        value: _util.getOrNull(expire)
      },
      {
        text: '分享人',
        value: _util.getOrNull(created)
      },
      {
        text: '分享时间',
        value: _util.getOrNull(created_time ?  moment(created_time).format("YYYY-MM-DD HH:mm:ss") : '')
      },
      {
        text: '状态',
        value: is_active ? <Tag color="#108ee9">已启用</Tag> : <Tag color="#f50">已禁用</Tag>
      },
      {
        text: '操作',
        value: is_active ? <Button type='danger' size='small' onClick={() => this.disableShare(id)}>禁用</Button> :''
      },
      {
        text:'被分享人',
        value:this.renderShareUser(person)
      }
    ]
  }




  render() {
    const {code, name, desc,created,created_time,
      updated,updated_time,status,fileList,
      file_loading,version,audit_record,sub_record,shared,downloadVisiable} = this.state;


    const tableData = [
      {
        text: '文件编号',
        value: _util.getOrNull(code)
      },
      {
        text: '文件名称',
        value: _util.getOrNull(name)
      },
      {
        text: '文件描述',
        value: _util.getOrNull(desc)
      },
      {
        text: '上传人',
        value: _util.getOrNull(created)
      },
      {
        text: '上传时间',
        value: _util.getOrNull(created_time ?  moment(created_time).format("YYYY-MM-DD HH:mm:ss") : '')
      },
      {
        text: '最后修改人',
        value: _util.getOrNull(updated)
      },
      {
        text: '最后修改时间',
        value: _util.getOrNull(updated_time ?  moment(updated_time).format("YYYY-MM-DD HH:mm:ss") : '')
      },
      {
        text: '状态',
        value: _util.renderDocumentStatusText(status)
      },
      {
        text: '文件',
        value: <Spin spinning={file_loading}>
                  <Upload fileList={fileList} showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}></Upload>
                </Spin>
      },   
      {
        text: '版本',
        value: _util.getOrNull(`V${version}`)
      },  
      {
        text: '提交记录',
        value: this.renderSubRecord(sub_record)
      },
      {
        text: '审批记录',
        value: this.renderAuditRecord(audit_record)
      }
    ];

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
      {
        name: '详情',
        url: '/document/register/document/detail'
      },
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情"/>} data={tableData} />
          {shared&&shared.length ?
            shared.map((s,sIndex) => {
              return  <CardDetail title={s.title ? `分享标题: ${s.title}` :''} data={this.renderShare(s)} />
            })
           :''
          }
          <GoBackButton
            style={{display: "block", margin: "0 auto"}}
            props={this.props}
            noConfirm/>
        </div>
        {/* 下载记录 */}
        <Modal
              title={'下载记录'}
              visible={downloadVisiable}
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
                dataSource={this.state.downloadRecordList}
                renderItem={
                  (item,index) => <List.Item>
                    <span>下载时间:&nbsp;{item.created_time ? moment(item.created_time).format("YYYY-MM-DD HH:mm:ss") :''}</span>
                  </List.Item>}
              />
            </Spin>  
          </Modal>
      </div>
    );
  }
}

export default DocumentDetail;
