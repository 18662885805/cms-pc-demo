import React from "react";
import {
  Form,
  Tag,
} from "antd";
import {inject, observer} from "mobx-react/index";
import MyBreadcrumb from "@component/bread-crumb";
import {userDetail} from "@apis/system/user";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import CommonUtil from "@utils/common";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import {GetTemporaryKey} from "@apis/account/index"
let _util = new CommonUtil();

@inject("menuState") @observer @injectIntl
class UserInfo extends React.Component {
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
      source_list: [],
      img_url:''
    };
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      userDetail(this.props.location.state.id, {project_id: _util.getStorage('project_id')}).then((res) => {
        this.setState({
          ...res.data
        });
        // if(res.data&&res.data.user&&res.data.user.avatar){
        //   this.renderImg(res.data.user.avatar);
        // }
        this.props.menuState.changeMenuCurrentUrl("/system/user");
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
      role,
      is_active,
      created_time,
      updated_time,
      user,
      org,
      img_url,
    } = this.state;

    const tableData = [
      {
        text: <FormattedMessage id="page.system.applyRole.user" defaultMessage="姓名"/>,
        value: _util.getOrNull(user && user.name)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.phone" defaultMessage="手机"/>,
        value: _util.getOrNull(user && user.phone)
      },
      {
        text: <FormattedMessage id="page.system.applyRole.rolePlay" defaultMessage="角色"/>,
        value: Array.isArray(role) && role.length > 0
          ?
          role.map((r, rIndex) => {
            return <Tag key={rIndex}>{r.name}</Tag>;
          })
          :
          "-"
      },
      {
        text: '组织',
        value: _util.getOrNull(org)
      },
      {
        text: <FormattedMessage id="page.system.accessType.createdTime" defaultMessage="创建时间"/>,
        value: _util.getOrNull(created_time)
      },
      {
        text: <FormattedMessage id="page.construction.staff.updatedTime" defaultMessage="上次修改时间"/>,
        value: _util.getOrNull(updated_time)
      },
      {
        text:<FormattedMessage id="page.system.applyRole.status" defaultMessage="状态"/>,
        value: is_active
          ?
          <Tag color={_util.getColor(4)}><FormattedMessage id="page.construction.location.active" defaultMessage="激活"/></Tag>
          :
          <Tag color={_util.getColor(5)}><FormattedMessage id="page.construction.location.disactive" defaultMessage="禁用"/></Tag>
      },
      // {
      //     text: '头像',
      //     value: <img src={img_url} style={{height:'100px'}}></img>
      // },   
      
    ];

    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper content-no-table-wrapper">

          <CardDetail title={<FormattedMessage id="page.system.applyRole.userDetail" defaultMessage="用户详情"/>} data={tableData} />
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
