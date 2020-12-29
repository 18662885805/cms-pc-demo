import React from "react";
import {inject, observer} from "mobx-react/index";
import { Upload } from "antd";
import MyBreadcrumb from "@component/bread-crumb";
import {messageDetail} from "@apis/today/message"
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import PicList from '@component/PicList'
import {GetTemporaryKey} from "@apis/account/index"

let _util = new CommonUtil();

@inject("menuState") @observer @injectIntl
class PushMessageDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      username: "",
      name: "",
      tel: "",
      email: "",
      phone: "",
      department_name: "",
      role: "",
      status: "",
      is_active: "",
      last_login: "",
      fileList:[]
    };
  }

  componentDidMount() {
    const project_id = _util.getStorage('project_id');
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      messageDetail(project_id, {id:this.props.location.state.id}).then((res) => {
        let data = res.data;
        console.log('0308',data)
        let source_list = [];
        if (data.content && data.m_type ===  2) {
          //转换前端格式
          var that = this;
          var cos = _util.getCos(null,GetTemporaryKey);
          const source_list = JSON.parse(data.content);
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
        this.setState({
          ...data,
        });
      });
    }
  }

  render() {
    const {
      title,
      name,
      audio,
      created,
      updated,
      m_type,
      content,
      fileList,
      source_list
    } = this.state;

    let message = [];
    if (m_type === 1) {
        message = [{
          text: <FormattedMessage id="page.system.accessType.content" defaultMessage="内容"/>,
          value: _util.getOrNull(content)
        },
      ]
    }else{
        message = [
          {
            text: <FormattedMessage id="page.system.accessType.file" defaultMessage="附件"/>,
            value: fileList ?
                    <div className="clearfix">
                        <Upload
                            fileList={fileList}
                            showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}
                        >
                        </Upload>
                    </div>
                :
                <FormattedMessage id="app.page.content.none" defaultMessage="-" />
          }
      ]
    }
    const tableData = [
      {
        text: <FormattedMessage id="page.system.accessType.title" defaultMessage="标题"/>,
        value: _util.getOrNull(title)
      },
      {
        text: <FormattedMessage id="page.system.accessType.type" defaultMessage="类型"/>,
        value: m_type === 1 ? '文字' : '音频'
      },
      {
        text: <FormattedMessage id="page.system.accessType.publisher" defaultMessage="发布人"/>,
        value: _util.getOrNull(created)
      },
      {
        text:<FormattedMessage id="page.system.accessType.lastReviser" defaultMessage="上次修改人"/>,
        value: _util.getOrNull(updated)
      },
      ...message
    ];

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="page.system.accessType.pushMessageDetail" defaultMessage="消息通知详情"/>} data={tableData} />
          <GoBackButton
            style={{display: "block", margin: "0 auto"}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    );
  }
}

export default PushMessageDetail;
