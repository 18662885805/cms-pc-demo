import React from "react";
import {inject, observer} from "mobx-react/index";
import MyBreadcrumb from "@component/bread-crumb";
import { orgapplyDetail } from "@apis/system/orgapply";
import CommonUtil from "@utils/common";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import { Tag, Timeline, Upload } from "antd";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import PicList from "@component/PicList";
import {GetTemporaryKey} from "@apis/account/index"
import moment from 'moment'
let _util = new CommonUtil();

@inject("menuState") @observer
class ApplyRoleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      name: "",
      tel: "",
      email: "",
      reason: "",
      remarks: "",
      operation_name: "",
      operation_time: "",
      status: 0,
      created_time: "",
      old_role: "",
      new_role: "",
      info: {},
      img_url:'',
      fileList:[],
      file_loading:false
    };
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
        this.props.history.replace('/404')
    } else {
        orgapplyDetail(this.props.location.state.id, {project_id: _util.getStorage('project_id')}).then((res) => {
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
          this.props.menuState.changeMenuCurrentUrl("/system/org/application");
          this.props.menuState.changeMenuOpenKeys("/system");
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
      status,
      operation_time,
      created_time,
      audit_info_list,
      next,
      company,
      org_type,
      address,
      desc,
      img_url,
      fileList
    } = this.state;

    const tableData = [
      {
        text: <FormattedMessage id="page.system.applyRole.company" defaultMessage="组织名称" />,
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
        text: <FormattedMessage id="page.system.applyRole.address" defaultMessage="组织地址" />,
        value: _util.getOrNull(address)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.desc" defaultMessage="组织描述" />,
        value: _util.getOrNull(desc)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.applyTime" defaultMessage="申请时间"/>,
        value: _util.getOrNull(created_time ?  moment(created_time).format("YYYY-MM-DD HH:mm:ss") : '')
      },
      {
        text: '审批时间',
        value: _util.getOrNull(operation_time ?  moment(operation_time).format("YYYY-MM-DD HH:mm:ss") : '')
      },
      {
        text:<FormattedMessage id="page.system.applyRole.status" defaultMessage="状态"/>,
        value: status ? <Tag color={_util.getColor(status)} >{_util.genStatusDesc(status)}</Tag> : null
      },
    {
        text: '附件',
        value: fileList&&fileList.length ? <Upload
                  fileList={fileList}
                  showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}
                ></Upload> :''
    },   
  ];

    const bread = [
      {
        name: <FormattedMessage id="menu.homepage" defaultMessage="首页"/>,
        url: "/"
      },
      {
        name: <FormattedMessage id="page.system.accessType.systemManage" defaultMessage="系统管理"/>
      },
      {
        name: <FormattedMessage id="page.system.accessType.permissionApplyAudit" defaultMessage="权限申请审批"/>,
        url: "/system/applyroleaudit"
      },
      {
        name: <FormattedMessage id="page.system.action.detail" defaultMessage="详情"/>
      }
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread}/>
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="page.system.action.detail" defaultMessage="详情"/>} data={tableData} />
          <GoBackButton
            style={{display: "block", margin: "0 auto"}}
            props={this.props}
            noConfirm/>
        </div>
      </div>
    );
  }
}

export default injectIntl(ApplyRoleDetail);
