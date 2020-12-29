import React from "react";
import {
  inject,
  observer
} from "mobx-react";
import {
  Form,
  Tag,
  Upload,
  Spin,
  List
} from "antd";
import MyBreadcrumb from "@component/bread-crumb";
import {WorkflowFileDetail} from '@apis/document/workflow';
import {GetTemporaryKey} from "@apis/account/index"
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import messages from "@utils/formatMsg";
import moment from "moment";
let _util = new CommonUtil();

@inject("menuState") @observer @injectIntl
class DocumentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList:[],
      file_loading:false,
      version:1
    };
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      const {id,directory} = this.props.location.state;
      const project_id = _util.getStorage('project_id')
      WorkflowFileDetail(project_id, {
        id:id,
      }).then((res) => {
        this.setState({
          ...res.data
        });
        if(res.data&&res.data.source){
          //转换前端格式
          var that = this;
          var cos = _util.getCos(null,GetTemporaryKey);
          const source_list = JSON.parse(res.data.source);
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
        this.props.menuState.changeMenuCurrentUrl("/document/workflow");
        this.props.menuState.changeMenuOpenKeys("/document");
      });
    }
  }

  render() {
    const {code, name, desc,created,created_time,
      updated,updated_time,fileList,remarks,
      file_loading} = this.state;


    const tableData = [
      {
        text: '工作流',
        value: _util.getOrNull(code)
      },
      {
        text: '备注',
        value: _util.getOrNull(remarks)
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
        text: '文件',
        value: <Spin spinning={file_loading}>
                  <Upload fileList={fileList} showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}></Upload>
                </Spin>
      },   
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
          name: '工作流文档',
          url: '/document/workflow'
      },
      {
        name: '详情',
        url: '/document/workflow/detail'
      },
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情"/>} data={tableData} />
          <GoBackButton
            style={{display: "block", margin: "0 auto"}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    );
  }
}

export default DocumentDetail;
