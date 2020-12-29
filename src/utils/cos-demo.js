import React from "react";
import {
  Form, Button, Spin, Icon, message, Upload
} from "antd";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { projectInfoList} from "@apis/system/project";
import GoBackButton from "@component/go-back";
import {GetTemporaryKey} from "@apis/account/index"

const FormItem = Form.Item;
let _util = new CommonUtil();

const messages = defineMessages({
  name: {
    id: "app.placeholder.system.projectname",
    defaultMessage: "请输入项目名称"
  },
  desc: {
    id: "app.placeholder.system.desc",
    defaultMessage: "描述"
  },
  location: {
    id: "app.placeholder.system.location",
    defaultMessage: "省市区"
  },
  address: {
    id: "app.placeholder.system.address",
    defaultMessage: "详细地址"
  },
  admin: {
    id: "app.placeholder.system.admin",
    defaultMessage: "请选择项目管理员"
  },
  groupapply: {
    id: "app.placeholder.system.groupapply",
    defaultMessage: "组织注册审批人"
  },
  personapply: {
    id: "app.placeholder.system.personapply",
    defaultMessage: "个人注册审批人 "
  },
  joinapply: {
    id: "app.placeholder.system.joinapply",
    defaultMessage: "组织加入审批人"
  },
  personjoinapply: {
    id: "app.placeholder.system.personjoinapply",
    defaultMessage: "个人加入审批人"
  },
});

@injectIntl
class CosDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      spinLoading: true,
      fileList: [],
      img_url:''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    projectInfoList({project_id: _util.getStorage('project_id')}).then((res) => {
        var that = this;
        var cos = _util.getCos(null,GetTemporaryKey);
        if (data.file) {
            //转换前端格式
          JSON.parse(data.file).map((obj, index) => {
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
                }
            });
          });
        }
        if(data.avatar){//设置头像
            this.renderImg(data.avatar);
        }
    })
}


    //设置头像
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





  handleSubmit(e) {
    e.preventDefault();
    const { formatMessage } = this.props.intl;
    this.props.form.validateFields((err, values) => {
      const { fileList } = this.state;
      if (!err) {
        const _this = this;
        let source = _util.setSourceList(fileList)//转换后端格式
        const data = {
          file: JSON.stringify(source),
        };
        console.log('cos-demo',data)
      }
      this.setState({
        confirmLoading: false
      });
    });
  }
 
  //文件上传
  fileUpload  = (info) => {
    const that = this;
    var cos = _util.getCos(null,GetTemporaryKey);
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
                const {fileList} = that.state;
                const newFile  = {
                  uid: -(fileList&&fileList.length ? fileList.length + 1 :1),
                  name: info.file.name,
                  status: 'done',
                  url:data.Url,
                  cosKey: `source/${info.file.uid}`,
                }
                const new_fileList = [...fileList,newFile]//文件列表，单个文件直接new_fileList = [newFile]
                that.setState({fileList:new_fileList});
              }
          });
        }
    });
  }


  //删除已上传文件
  handleRemove = (info) => {
    const {fileList} = this.state;
    const new_fileList = fileList.filter(file => {
      return file.uid != info.uid
    })
    this.setState({fileList:new_fileList})
  }

  render() {
    const {
      confirmLoading, spinLoading, fileList,img_url
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };


    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper content-no-table-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>       
              <FormItem  {...formItemLayout}
                  label={'附件'}
                  required
              >
                  <Upload
                    fileList={fileList}
                    beforeUpload={_util.beforeUpload} 
                    customRequest={this.fileUpload}
                    onRemove={this.handleRemove}
                    accept='image/*'
                    listType="picture-card"
                    className="upload-list-inline"
                  >
                  {uploadButton}
                  </Upload>
              </FormItem>
              <FormItem  {...formItemLayout}
                  label={'头像'}
              >
                  <img src={img_url} style={{height:'100px',border:'1px solid #d3d3d3'}}></img>
              </FormItem>
              
              <FormItem {...tailFormItemLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button type="primary" htmlType="submit" loading={confirmLoading}
                    style={{ marginRight: "10px" }}>
                    <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                  <GoBackButton props={this.props} />
                </div>
              </FormItem>
            </Form>

          </Spin>
        </div>
      </div>
    );
  }
}

export default CosDemo = Form.create()(CosDemo);


[
  {
    "name":"证件一",
    "no":"2143214124",
    "valid_date":"2021-03-01",
    "file":[
      {name:"质量.jpg",url:"source/rc-upload-1584347213911-5"},
    ]
  }
]