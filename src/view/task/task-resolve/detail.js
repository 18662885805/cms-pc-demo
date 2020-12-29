import React, { Fragment } from "react";
import {
  Form, Button, Modal, Spin, message, Upload, Icon, Row, Col, Checkbox, Tree, Select, Tag, Timeline, Input,Card
} from "antd";
import { inject, observer } from "mobx-react/index";
import debounce from "lodash/debounce";
import MyBreadcrumb from "@component/bread-crumb";
import CommonUtil from "@utils/common";
import GoBackButton from "@component/go-back";
import CardDetail from "@component/CardDetail";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import PicList from "@component/PicList";
import moment from 'moment'
const _util = new CommonUtil();
const {TextArea} = Input;
const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

@inject("menuState") @observer
class TaskResolveDetail extends React.Component {
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
      approve_list: [],
      info: {},
      worker_approve: [],
      application_approve: [],
      gatelist: [],
      trees: [],
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      source_list: [],
      search_data: [],
      treeData: [],
      turnstile_list:[],
      confirmLoading: false,
      avatar_url:'',
      fileList:[],
      file_loading:false,
      typeoption:[],
      org_type_id:'',
      task_status:''
    };
  }
 

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.status) {
      this.setState({task_status:this.props.location.state.status})
    } 
  }

  componentDidUpdate(prevProps) {
  }

  
  switchToJson = (str) => {
      return eval('(' + str + ')');
  }

  apply = () => {
    
  }

  unApply = () => {
  }



  handleRemarksChange = e => {
    this.setState({
      audit_remarks: e.target.value
    });
  }

  renderTaskStatusText(code){
    switch (code) {
    case 1:
      return (<Tag color="#a9a9a9">待提交</Tag>);
    case 2:
      return (<Tag color="#48d1cc">待接受</Tag>);
    case 3:
      return (<Tag color="#108ee9">执行中</Tag>);
    case 4:
      return (<Tag color="#ffd700">逾期</Tag>);
    case 5:
      return (<Tag color="#ff0000">已拒绝</Tag>);
    case 6:
      return (<Tag color="#87d068">已完成</Tag>);
    default:
      return null;
    }
  }


  render() {
    const {
      audit_remarks,
      confirmLoading,
      task_status
    } = this.state;
    const formItemLayout = {
      'labelCol': {
          'xs': {'span': 24},
          'sm': {'span': 7}
      },
      'wrapperCol': {
          'xs': {'span': 24},
          'sm': {'span': 12}
      }
  }

    const tableData = [
      {
        text: '发起人',
        value: '组长'
      },
      {
        text: '任务类型',
        value: 'bug类型'
      },
      {
        text: '行动内容',
        value: `Nginx 是一个免费的，开源的，高性能的HTTP服务器和反向代理，以及IMAP / POP3代理服务器。 Nginx 以其高性能，稳定性，丰富的功能，
        简单的配置和低资源消耗而闻名。在高连接并发的情况下，Nginx是Apache服务器不错的替代品。`
      },
      {
        text: '行动日期',
        value: '2020-05-01'
      },
      {
        text: '状态',
        value: this.renderTaskStatusText(task_status)
      },
      
    ];

    const bread = [
      {
        name: <FormattedMessage id="menu.homepage" defaultMessage="首页" />,
        url: "/"
      },
      {
        name: '重要问题'
      },
      {
        name: '问题处理',
      },
      {
        name: '处理'
      }
    ];

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper">
          <CardDetail title={<FormattedMessage id="page.system.action.detail" defaultMessage="详情" />} data={tableData} />
            <Card 
            title={<FormattedMessage id="app.table.column.operate" defaultMessage="操作"/>}
            style={{margin: '0 auto 10px', width: '80%'}}>
            <Form>
                <FormItem {...formItemLayout} label={'执行人'}>
                    <span>{_util.getStorage('userInfo') ? _util.getStorage('userInfo').name : ''}</span>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={'备注'}
                >
                    <TextArea
                        value={audit_remarks}
                        onChange={e => this.handleRemarksChange(e)}
                    />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={'附件'}
                >
                    <Upload>
                      <Button>
                          <Icon type="upload" />上传
                      </Button>
                    </Upload>
                </FormItem>
                {
                  task_status == 2 ?
                  <FormItem style={{display: 'flex', justifyContent: 'center'}} >
                    <Button type="primary" onClick={this.apply} loading={confirmLoading}
                            style={{marginRight: '10px'}}>
                        接受
                    </Button>
                    <Button type="danger" onClick={this.unApply} loading={confirmLoading}
                            style={{marginRight: '10px', bgColor: '#f5222d'}}>
                        拒绝
                    </Button>
                    <GoBackButton props={this.props}/>
                  </FormItem> :''
                }
                {
                  task_status == 3 || task_status == 4 ?
                  <FormItem style={{display: 'flex', justifyContent: 'center'}} >
                    <Button type="primary" onClick={this.apply} loading={confirmLoading}
                            style={{marginRight: '10px'}}>
                        完成提交
                    </Button>
                    <GoBackButton props={this.props}/>
                  </FormItem> :''
                }
               
            </Form>
        </Card> 
          
         
        </div>
      </div>
    );
  }
}

export default injectIntl(TaskResolveDetail);
