import React from "react";
import {
  Form,
  Tag,
  Upload,
  Spin,
} from "antd";
import {inject, observer} from "mobx-react/index";
import MyBreadcrumb from "@component/bread-crumb";
import {userDetail} from "@apis/system/user";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import {GetTemporaryKey} from "@apis/account/index"
import {organizeDetail} from "@apis/system/organize";
import moment from 'moment'
let _util = new CommonUtil();

@inject("menuState") @observer @injectIntl
class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img_url:'',
      fileList:[],
      file_loading:false
    };
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      organizeDetail(this.props.location.state.id, {project_id: _util.getStorage('project_id')}).then((res) => {
        this.setState({
          ...res.data
        });
        // if(res.data&&res.data.owner&&res.data.owner.avatar){
        //   this.renderImg(res.data.owner.avatar);
        // }
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
      });
    }
  }

  renderImg = (str) => {
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
                that.setState({img_url:data.Url});
            }
        });
    }       
  }

  switchToJson = (str) => {
    return eval('(' + str + ')');
  }

  render() {
    const {
      is_active,
      created_time,
      updated_time,
      img_url,
      company,
      org_type,
      desc,
      address,
      created,
      updated,
      owner,
      status,
      fileList,
      file_loading
    } = this.state;

    const tableData = [
      {
        text: '组织名',
        value: _util.getOrNull(company)
      },
      {
        text: '组织类型',
        value: _util.getOrNull(org_type && org_type.name)
      },
      {
        text: '描述',
        value: _util.getOrNull(desc)
      },
      {
        text: '地址',
        value: _util.getOrNull(address)
      },
      {
        text: '创建人',
        value: _util.getOrNull(created)
      },
      {
        text: <FormattedMessage id="page.system.accessType.createdTime" defaultMessage="创建时间"/>,
        value: _util.getOrNull(created_time ?  moment(created_time).format("YYYY-MM-DD HH:mm:ss") : '')
      },
      {
        text: '最后修改人',
        value: _util.getOrNull(updated)
      },
      {
        text: <FormattedMessage id="page.construction.staff.updatedTime" defaultMessage="上次修改时间"/>,
        value: _util.getOrNull(updated_time ?  moment(updated_time).format("YYYY-MM-DD HH:mm:ss") : '')
      },
      {
        text:<FormattedMessage id="page.system.applyRole.status" defaultMessage="状态"/>,
        value: status
          ?
          <Tag color={_util.getColor(4)}><FormattedMessage id="page.construction.location.active" defaultMessage="激活"/></Tag>
          :
          <Tag color={_util.getColor(5)}><FormattedMessage id="page.construction.location.disactive" defaultMessage="禁用"/></Tag>
      },
      {
        text: '联系人姓名',
        value: _util.getOrNull(owner&&owner.name ? owner.name :'')
      },
      {
        text: '联系人手机',
        value: _util.getOrNull(owner&&owner.phone ? owner.phone :'')
      },
      {
        text: '联系人身份证号',
        value: _util.getOrNull(owner&&owner.id_num ? owner.id_num :'')
      },
      {
          text: '附件',
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
          name: <FormattedMessage id="app.page.bread.system" defaultMessage="系统管理"/>
      },
      {
          name: <FormattedMessage id="app.page.bread.orgapply" defaultMessage="组织申请"/>,
          url: '/system/org'
      },
      {
          name: <FormattedMessage id="page.component.breadcrumb.detail" defaultMessage="详情" />
      }
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper content-no-table-wrapper">

          <CardDetail title={'组织详情'} data={tableData} />
          <GoBackButton
            style={{display: "block", margin: "0 auto"}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    );
  }
}
const UserDetail = Form.create()(UserInfo);

export default UserDetail;
