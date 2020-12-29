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
        this.props.menuState.changeMenuCurrentUrl("/document/register");
        this.props.menuState.changeMenuOpenKeys("/document");
      });
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
    const {shared,downloadVisiable} = this.state;


   

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
        name: '分享记录',
        url: '/document/register/document/share'
      },
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper content-no-table-wrapper">
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
