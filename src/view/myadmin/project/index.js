import React from 'react'
import { Link } from 'react-router-dom'
import {
  Popconfirm,
  Divider,
  message,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Icon
} from 'antd'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import moment from "moment";
import{project,projectDelete}from '@apis/myadmin/project';
import {AddProjectUser ,userSearch} from '@apis/admin/project';
import {getURL} from '@apis/system/url'
import {user} from '@apis/admin/user';
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages,} from 'react-intl'
import {inject, observer} from 'mobx-react'
import QRCode from 'qrcode.react';
// import md5 from 'js-md5'
import html2canvas from 'html2canvas'

const _util = new CommonUtil();
const FormItem = Form.Item;

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  description:{
      id: 'page.inspection.description',
      defaultMessage: '描述',
  },
  created: {
      id: 'page.inspection.created',
      defaultMessage: '创建人',
  },
  created_time: {
      id: 'page.inspection.created_time',
      defaultMessage: '创建时间',
  },
  updated: {
      id: 'page.inspection.updated',
      defaultMessage: '上次修改人',
  },
  updated_time: {
      id: 'page.inspection.updated_time',
      defaultMessage: '修改日期',
  },
  select: {
      id: 'app.placeholder.select',
      defaultMessage: '-- 请选择 --',
  },
  confirm_title: {
      id: 'app.confirm.title.submit',
      defaultMessage: '确认提交?',
    },
  confirm_content: {
      id: 'app.common.button.content',
      defaultMessage: '单击确认按钮后，将会提交数据',
  },
  okText: {
      id: 'app.button.ok',
      defaultMessage: '确认',
  },
  cancelText: {
      id: 'app.button.cancel',
      defaultMessage: '取消',
  },
  save_success: {
      id: 'app.message.save_success',
      defaultMessage: '保存成功',
  },
  operate: {
      id: 'app.table.column.operate',
      defaultMessage: '操作',
  },
  deleted: {
      id: 'app.message.material.deleted',
      defaultMessage: '已删除',
  },
});

@inject('appState') @observer  @injectIntl
export default class extends React.Component {
  constructor(props) {
      super(props)
      const {formatMessage} = this.props.intl
      this.state = {
          column: [
              {
                  // title: '序号',
                  title: formatMessage({ id:"app.table.column.No", defaultMessage:"序号"}),
                  width: 40,
                  maxWidth: 40,
                  dataIndex: 'efm-index',
                  render: (text, record, index) => {
                      return (index + 1)
                  }
              },
              {
                  title: '项目名称',
                  dataIndex: 'name',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              {
                  title: '描述',
                  dataIndex: 'desc',
                  sorter: _util.sortString,
                  render: record => _util.getOrNullList(record)
              },
              // {
              //   title: '项目权限',
              //   dataIndex: 'permission',
              //   sorter: _util.sortString,
              //   render: record => _util.getOrNullList(record ? _util.renderDataName(record) :null)
              // },
              {
                title: '项目管理员',
                dataIndex: 'contact_person',
                sorter: _util.sortString,
                // render: record => _util.getOrNullList(record ? _util.renderDataName(record) :null)
                render: record => _util.getOrNullList(record)
              },
              {
                  title: '二维码',
                  dataIndex: 'qrcode',
                  sorter: _util.sortString,
                  render: (text, record, index) => {
                    const id = record.id
                    return (
                      <div onClick={() => this.openModal(record)}>
                        <a style={{color: '#f5222d'}}>
                          <FormattedMessage id="app.myadmin.project.view" defaultMessage="查看" />
                        </a>
                      </div>
                    )
                  }
              },
              {
                title: formatMessage(messages.created),      
                dataIndex: 'created',
                sorter: _util.sortString,
                filterType: 'select',
                render: record => _util.getOrNullList(record)
              },
              {
                  title: formatMessage(messages.created_time),      
                  dataIndex: 'created_time',
                  sorter: _util.sortDate,
                  filterType: 'range-date',
                  render: record => _util.getOrNullList(record ? moment(record).format('YYYY-MM-DD HH:mm:ss') :null)
              },
              {
                  title: formatMessage(messages.updated),      
                  dataIndex: 'updated',
                  sorter: _util.sortString,
                  filterType: 'select',
                  render: record => _util.getOrNullList()
              },
              {
                  title: formatMessage(messages.updated_time),      
                  dataIndex: 'updated_time',
                  sorter: _util.sortDate,
                  filterType: 'range-date',
                  render: record => _util.getOrNullList(record ? moment(record).format('YYYY-MM-DD HH:mm:ss') : null)
              },
              {
                  // title: '操作',
                  title: formatMessage({ id:"app.table.column.operate", defaultMessage:"操作"}),
                  dataIndex: 'operate',
                  width: 180,
                  minWidth: 180,
                  maxWidth: 180,
                  render: (text, record, index) => {
                      const id = record.id
                      return (
                          <div>
                              {/* <a style={{ color: '#483d8b', marginRight: '10px' }} onClick={() => this.showAddPersonModal(id)}>
                                  添加人员
                              </a>
                              <Divider type="vertical"/> */}
                              <Link to={{
                                pathname: '/myadmin/project/edit',
                                state: {
                                  id:id
                                }
                              }} style={{ marginRight: '10px' }} onClick={this.setScrollTop}> <FormattedMessage id="app.page.text.modify" defaultMessage="修改" /> 
                              </Link>
                              <Divider type="vertical"/>
                              <Popconfirm
                                  title={<FormattedMessage id="app.button.sureDel" defaultMessage="确定删除？"/>}
                                  okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                                  cancelText={<FormattedMessage id="app.button.cancel" defaultMessage="取消"/>}
                                  onConfirm={() => {
                                      this.onDeleteOne(id)
                                  }}>
                                  <a style={{color: '#f5222d'}}>
                                      <FormattedMessage id="global.delete" defaultMessage="删除"/>
                                  </a>
                              </Popconfirm>
                          </div>
                      );
                  }
              }
          ],
          check: _util.check(),
          add_person_data: [],
          addPersonVisible: false,
          personVisible: false,
          personList: [],
          fetching: false,
          codevisible: false,
          Content: '/#/pages/org_register/index/?project_id=',
          mark: '',
          url:'',
      }
  }

  componentDidMount(){
    getURL().then(res => {
      if(res.data&&res.data.url){
        this.setState({ 
          url:res.data.url
        })
      }else{
        message.warning('获取URL失败')
      }  
    })
  }
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  onDeleteOne = id => {
    this.setState({ refresh: false })
    const { formatMessage } = this.props.intl;
    projectDelete(id).then((res) => {
      message.success(formatMessage(messages.deleted));
      this.setState({ refresh: true })
    })
  }

  showAddPersonModal = (id) => {
    user().then(res => {
      this.setState({
        addPersonVisible: true,
        add_person_data: res.data.results,
        project_id: id
      })
    })
  };

  hideAddPersonModal = () => {
    this.setState({
      addPersonVisible: false,
      add_person_data: [],
      chose_data: [],
      project_id: null
    })
  }

  submitAddPersonModal = () => {
    const {project_id, admin_user} = this.state;
    const { formatMessage } = this.props.intl;
    this.setState({ refresh: false });
    AddProjectUser(project_id,{ids: admin_user.join(',')}).then(res => {
        message.success('人员添加成功');
        this.hideAddPersonModal();
        this.setState({
            selectedRowKeys:[],
            refresh: true
        });
    })

  };

  handleAddPersonChange = (chose_data) => {
    console.log(chose_data)
    this.setState({
        chose_data
    })
  }

  fetchUser = (value) => {
    this.setState({ personList: [], fetching: true });
    userSearch({ q: value }).then((res) => {
        if (res.data) {
            this.setState({ personList: res.data, fetching: false });
        }
    })
  };

  handleChange = value => {
    this.setState({
        personList: [],
        fetching: false,
    })
    var userList = [];
    if (value && value.length) {
        value.map((item) => {
            userList.push(item.key)
        });
        this.setState({
            admin_user: userList
        });
    }
 };

 openModal = (obj) => {
  this.setState({ 
    codevisible: true,
    id: obj.id, 
    project: obj.name,
    mark: obj.mark,
  })
 }
 hideCodeModal = () => {
  this.setState({codevisible: false})
 }

//  ClickDownLoad=()=>{
//   var Qr=document.getElementById('qrid');  
//   let image = new Image();
//   image.src = Qr.toDataURL("image/png");
//   var a_link=document.getElementById('aId');
//   a_link.href=image.src;
//   // a_link.download='下载1';
//  }

 ClickDownLoad=()=>{
  const targetDom = document.getElementById("share");
  // const copyDom = targetDom.cloneNode(true)
  html2canvas(targetDom,{
    allowTaint: false,
    useCORS: true,
  }).then(canvas => {
    const container = document.querySelector('#view')
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild)
    }
    // var Qr=document.getElementById('qrid');  
    let dataImg = new Image();
    // image.src = Qr.toDataURL("image/png");
    dataImg.src = canvas.toDataURL('image/png');
    const alink = document.createElement("a");
    document.querySelector('#view').appendChild(dataImg)

    alink.href=dataImg.src;
    alink.download = "code.jpg";
    alink.click();
  })
 }

  render() {
    const { column, check, refresh ,addPersonVisible, personVisible,personList, fetching, codevisible} = this.state;
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <div className="content-wrapper">
          <TablePage
            refresh={refresh}
            getFn={project}
            columns={column}
            excelName={'项目管理'}
            dataMap={data => {
              data.forEach(d => {
                const { status } = d
                if (status) {
                  d.status_desc = <FormattedMessage id="component.tablepage.use" defaultMessage="启用" />
                } else {
                  d.status_desc = <FormattedMessage id="page.construction.location.disactive" defaultMessage="禁用"/>
                }
              })
            }}
          >
             <Button type="primary">
               <Link to={'/myadmin/project/add'}>
                <FormattedMessage id="component.tablepage.add" defaultMessage="新增" />
               </Link>
            </Button>
          </TablePage>
          <Modal
            title="添加人员"
            okText="提交"
            cancelText="取消"
            visible={addPersonVisible}
            onOk={this.submitAddPersonModal}
            onCancel={this.hideAddPersonModal}
            width={600}
          >
            <div style={{ width: '80%', margin: '0 auto' }}>
               <Select
                    mode="multiple"
                    labelInValue
                    placeholder="选择用户"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchUser}
                    onChange={this.handleChange}
                    style={{ width: '100%' }}
                >
                    {personList.map(d => (
                        <Option key={d.id}>{`姓名:${d.name}  手机:${d.phone}`}</Option>
                    ))}
                </Select>
            </div>

          </Modal>

          <Modal
            title="已添加人员"
            visible={personVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            {
              this.state.addedworker ?
                this.state.addedworker.map((value, index, array) => {
                  return (
                    <Tag key={value.id} closable onClose={this.remove.bind(this, index)}>{value.name}</Tag>)
                })
                : ''
            }
          </Modal>

          <Modal
            title={`${this.state.project}二维码`}
            okText="提交"
            cancelText="取消"
            visible={codevisible}
            onOk={this.submitAddPersonModal}
            onCancel={this.hideCodeModal}
            width={600}
            footer={null}
          >
            <div id="share">
              
              <a download id='aId'>
                <p style={{fontSize: '26px', marginBottom: '10px', lineHeight: 1}}>
                    {/* <span >Welcome to </span> */}
                    <span style={{color: 'rgba(3, 146, 69, 1)'}}>e</span>
                    <span style={{color: 'rgba(50,103,147, 1)'}}>CM</span>
                    <span style={{color: 'rgba(220,49,36, 1)'}}>S</span>
                </p>
                {/* <h2 style={{fontSize: '32px'}}>ecms</h2> */}
                <h3>{`${this.state.project}`}</h3>
                {/* {md5(`${this.state.Content}${this.state.id}`)} */}
                {/* {`${this.state.Content}${this.state.id}&mark=${this.state.mark}`} */}
                <QRCode id='qrid' value={`${this.state.url}${this.state.Content}${this.state.id}&mark=${this.state.mark}`} size={200} />
                <div class="linearbg"></div>
                <h2 style={{fontSize: '0.8rem', padding: '10px 15px'}}>扫码或微信长按识别</h2>
                <h2 style={{fontSize: '0.8rem', padding: '0 15px'}}>注册您的组织，加入该项目</h2>
              </a>
              <Icon type="cloud-download" style={{position: 'absolute', right: '10%'}} onClick={this.ClickDownLoad} />
              <a id="view"></a>
            </div>

          </Modal>

        </div>
      </div>
    )
  }
}