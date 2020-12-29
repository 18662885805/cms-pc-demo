import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Divider,
  Popconfirm,
  Tag,
  message, Select, Input,Modal,Form, Icon
} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import VirtualTable from "@component/VirtualTable3";
import {
  ProjectInfo,
  organize,
  organizeDelete,
  organizePost,
  enabledPost,
  // userStatusChange
} from "@apis/system/organize";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import {inject, observer} from "mobx-react/index";
import translation from "../translation";
import {getURL} from '@apis/system/url'
const _util = new CommonUtil();
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas'
const { Search } = Input;
const FormItem = Form.Item;



@inject("appState") @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props);
    const {formatMessage} = this.props.intl;
    this.state = {
      column: [
        {
          title: <FormattedMessage id="No"/>,    //序号
          width: 40,
          maxWidth: 40,
          dataIndex: "efm-index",
          render: (text, record, index) => {
            return (index + 1);
          }
        },
        {
          title: <FormattedMessage id="system.setting.org.name"/>,     //组织名称
          dataIndex: "company",
          sorter: _util.sortString,
          render: (text, record) => {
            return <Link to={{
              pathname: "/system/org/detail",
              state: {
                id: record.id
              }
            }} onClick={this.setScrollTop}>{_util.getOrNullList(record.company)}</Link>;
          }
        },
        {
          title: <FormattedMessage id="system.setting.org.type"/>,     //组织类型
          dataIndex: "type_desc",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="system.setting.org.address"/>,     //组织地址
          dataIndex: "address",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="system.setting.org.contact"/>,     //联系人
          dataIndex: "name",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="phone-number"/>,    //联系人手机号
          dataIndex: "phone",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
            title: <FormattedMessage id="Qr-code"/>,
            dataIndex: 'qrcode',
            sorter: _util.sortString,
            filter:false,
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
            title: <FormattedMessage id="status"/>,
            dataIndex: 'is_active_desc',
            sorter: _util.sortString,
            render: (text, record, index) => {
              return (
                record.status
                  ?
                  <Tag color={_util.getColor(4)}><FormattedMessage id="page.construction.location.active" defaultMessage="激活"/></Tag>
                  :
                  <Tag color={_util.getColor(5)}><FormattedMessage id="page.construction.location.disactive" defaultMessage="禁用"/></Tag>
              )
            }
        },
        {
          title: <FormattedMessage id="created"/>,     //创建人
          dataIndex: "created",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="created_time"/>,    //创建日期
          dataIndex: "created_time",
          filterType: "range-date",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="updated"/>,   //上次修改人
          dataIndex: "updated",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="updated_time"/>,    //修改日期
          filterType: "range-date",
          dataIndex: "updated_time",
          sorter: _util.sortDate,
          render: record => _util.getOrNullList(record)
        },
        {
          title: <FormattedMessage id="operate"/>,   //操作
          dataIndex: "operate",
          width: 110,
          minWidth: 110,
          maxWidth: 110,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: '/system/org/edit',
              state: {
                id: id
              }
            }
            const canEdit = _util.getStorage('is_project_admin')|| this.state.check(this, "edit");
            const canDelete = _util.getStorage('is_project_admin')|| this.state.check(this, "delete");
            // const canEdit = true;
            // const canDelete = true;
            if (!canEdit && !canDelete) return null;
            return (
              <div>
                {
                  canEdit?
                  <Link to={path} onClick={this.setScrollTop}><FormattedMessage id="global.revise" defaultMessage="修改"/></Link>:null
                }
                {
                  canDelete ?
                  <Popconfirm 
                    placement="topRight"
                    title={
                      <p>
                        <FormattedMessage id="page.system.accessType.ifDel"defaultMessage="如果删除相关记录依然存在，"/><br/>
                        <FormattedMessage id="page.system.accessType.ifDel2"defaultMessage="但用户将不能登录,请确认？"/>
                      </p>
                    }
                    okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                    cancelText={<FormattedMessage id="app.button.cancel"defaultMessage="取消"/>}
                    onConfirm={() => {
                      this.onDeleteOne(id);
                    }}>
                    <Divider type="vertical"/>
                    <a style={{color: "#f5222d"}}>
                      <FormattedMessage id="app.page.text.delete" defaultMessage="删除" />
                    </a>
                  </Popconfirm> : null
                }
            </div>
            );
          }
        }
      ],
      check: _util.check(),
      searchValue: "",
      pagination: {
        pageSize:_util.getSession("pageSize") ? _util.getSession("pageSize") : _util.getPageSize(),
        showSizeChanger: true,
        pageSizeOptions:["200", "1000", "3000"],
        // pageSizeOptions: _util.getPageSizeOptions(),
        current: _util.getSession("currentPage") ? _util.getSession("currentPage") : 1
      },
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      data: [],
      submitPerson: [],
      defaultScrollTop: 0,
      available:false, //列表内容为"所有用户"，不是“有效用户”
      clearScrollTop:false,
      addType:1,
      showAddModal:false,
      codevisible: false,
      Content: '/#/pages/person_register/index/?project_id=',
      org_mark:'',
      mark: '',
      url:''
    }
    this.getInfo = this.getInfo.bind(this)
  }

  componentDidMount() {
    // _util.fixTableHead()
    this.getInfo({
        project_id: _util.getStorage('project_id'),
        page_size: this.state.pagination.pageSize
    });
    ProjectInfo({project_id: _util.getStorage('project_id')}).then(res => {
      if(res.data&&res.data.mark){
        this.setState({mark:res.data.mark})
      }
    });
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

  getInfo(params) {
      this.setState({
          loading: true
      })
      organize(params).then((res) => {
          _util.getInfo(res, this)
      })
  }

  // getInfo = params => {
  //   const { pagination, searchValue,available } = this.state;
  //   const { getFn, dataMap, dataFilter } = this.props;
  //   console.log(params);

  //   this.setState({loading: true, data: []});
  //   const values = {
  //     // page: pagination.current,
  //     page:params&&params.is_active===2?1:pagination.current,
  //     page_size: pagination.pageSize,
  //     // is_active:available?2:0,
  //     ...params,
  //     project_id: _util.getStorage('project_id')
  //   };

  //   if (searchValue) {
  //     if(params&&params.is_active===2){
  //       console.log(values);
  //       // return false
  //     }else{
  //       values.search = searchValue;
  //     }
  //   }

  //   organize(values).then(res => {
  //     let { results, count } = res.data;
  //     const pagination = {...this.state.pagination};
  //     pagination.total = count;

  //     if (typeof dataMap === "function") {
  //       dataMap(results);
  //     }

  //     if (typeof dataFilter === "function") {
  //       results = dataFilter(results);
  //     }
  //     let targetArr = []
  //     if (results && results.length && results instanceof Array) {
  //       results.map((value, index, array) => {
  //         let uid = value.id;
  //         let user = value.user
  //         return targetArr.push({
  //           ...user,
  //           ...value,
  //           uid
  //         });
  //       });
  //     }
  //     console.log(targetArr)

  //     this.setState({ data: targetArr, pagination:pagination, loading: false});

  //   });
  // };

  onDeleteOne = id => {
    this.setState({ reset: false });
    const { formatMessage } = this.props.intl;
    const project_id = _util.getStorage('project_id');
    organizeDelete(project_id, {id:id}).then((res) => {
      this.getInfo({
        project_id: project_id,
        page_size: this.state.pagination.pageSize
      });
      this.setState({ reset: true });
      message.success('删除成功');
    });
  };

  changeUserStatus = () => {
    const { selectedRowKeys,available } = this.state;
    const { formatMessage } = this.props.intl;
    console.log(selectedRowKeys);
    if (selectedRowKeys.length <= 0) {
      message.error("");
      return;
    }

    this.setState({ reset:false });

    // userStatusChange({
    //   ids: selectedRowKeys.join(",")
    // }).then(() => {
    //   // message.success('');
    //   this.getInfo({is_active:available?2:0});
    //   this.setState({ reset:true });
    // });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  availableOrAll = () => {
    const { formatMessage } = this.props.intl;
    const { available } = this.state;

    this.getInfo({is_active:available?0:2});

    this.setState({available:!available});

    // new Promise((resolve)=>this.getInfo({is_active:available?0:2,resolve}))
    //     .then(()=>this.setState({available:!available}))
    //     .catch(function () {console.log('失败：');});

  };


   enabled = () => {
     const {formatMessage} = this.props.intl;
     const { selectedRowKeys,available } = this.state;
     this.setState({reset:false});

     if (selectedRowKeys.length === 0) {
       message.error(formatMessage(translation.select_enable_data)); //请选择要启用的数据!
      //  message.error("请选择要启用的数据"); //请选择要启用的数据!
       return;
     }

    //  userStatusChange({ ids: selectedRowKeys.join(","), project_id: _util.getStorage('project_id'), operation: 1 }).then((res) => {
    //   //  message.success(formatMessage(translation.enabled)); //已启用
    //    message.success('已启用');
    //    console.log(available);
    //    this.getInfo({is_active:available?2:0});
    //    // this.getInfo()
    //    this.setState({reset:true});
    //  });
   };

    doDisable = () => {
      const {formatMessage} = this.props.intl;
      const { selectedRowKeys,available } = this.state;
      this.setState({reset:false});
      if (selectedRowKeys.length === 0) {
        message.error(formatMessage(translation.select_disable_data)); //请选择要禁用的数据!
        // message.error('请选择要禁用的数据!'); //请选择要禁用的数据!
        return;
      }

      userStatusChange({ ids: selectedRowKeys.join(","), project_id: _util.getStorage('project_id'), operation: 2 }).then((res) => {
        console.log(res)
        // message.success(formatMessage(translation.disabled)); //已禁用
        message.success('已禁用');
        console.log(available);
        this.getInfo({is_active:available?2:0});
        // 已选择的数据清空
        this.setState({reset:true});
      }).catch((error) => {
        console.log(error)
        // this.setState({
        //   loginConfirmLoading: false
        // });
      });
    };

  exportExcel = () => {
    const {formatMessage} = this.props.intl;
    const { column,selectedRows } = this.state;
    if (selectedRows.length === 0) {
      message.error('请选择要导出的数据!');
      return;
    }
    _util.exportExcel(selectedRows, column,"组织管理");
  };

   doFilter = () => {
     const { column, filtering } = this.state;

     if (!filtering) {
       column.forEach(c => {
         if (c.dataIndex !== "operate" && c.dataIndex !== "efm-index" && c.dataIndex !== "operate1") {
           c.filter = true;
         }
       });
       this.setState({ column, filtering: true, reset: false });
     } else {
       column.forEach(c => {
         c.filter = false;
       });
       this.setState({ column, filtering: false, reset: true });
     }
   }

  handleSearch = value => {
    this.setState({clearScrollTop:true});
    const { pagination } = this.state;
    const project_id =_util.getStorage('project_id')
    pagination.current = 1;
    this.setState({ searchValue: value, pagination }, () => {
      this.getInfo({
        project_id:project_id,
        page : pagination.current,
        page_size : pagination.pageSize,
        search:value});
    });
  };

  handleTableChange(pagination, filters, sorter,_this) {
    const pager = {...pagination};
    pager.current = pagination.current;
    _this.setState({
      pagination: pager,
      data: []
    });
    _this.getInfo({
      page_size: pagination.pageSize,
      page: pagination.current,
      // ordering: sorter.order === 'ascend' ? '' + sorter.field : '-' + sorter.field,
      search: _this.state.search,
      is_active:_this.state.available===true?2:0,
      ...filters

    });
  }

  //记住scrollTop
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if(scrollTopPosition){
      _util.setSession("scrollTop", scrollTopPosition);
    }
  }

  openAddModal = () => {
    this.setState({showAddModal:true})
  }


  handleAddType = (value) => {
    this.setState({addType:value})
  }

  closeAddModal = () => {
    this.setState({showAddModal:false})
  }

  submitAddType = () => {
    const {addType} = this.state;
    if(addType == 1){
      this.props.history.push({
        pathname: "/system/user/add"
      });
    }else{
      this.props.history.push({
        pathname: "/system/user/contractor-add"
      });
    }
  }

  openModal = (obj) => {
    this.setState({ 
      codevisible: true,
      id: obj.id, 
      company: obj.company,
      org_mark: obj.mark,
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
//   // a_link.download=id;
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
    const { addType,showAddModal,column, data, check, refresh,pagination,reset,loading,filtering,available,clearScrollTop, codevisible} = this.state;
    const { formatMessage } = this.props.intl;
    const bread = [
      {
        name: formatMessage({
          id: "menu.homepage",
          defaultMessage: "首页"
        }),
        url: "/"
      },
      {
        name: formatMessage({
          id: "page.system.accessType.systemManage",
          defaultMessage: "系统管理"
        })
      },
      {
        name: formatMessage({
          id: "menu.system.org-apply",
          defaultMessage: "组织创建"
        }),
        url: "/system/org"
      }
    ];

    data.forEach(d => {
      if(d.status){
        d.is_active_desc = '激活'
      }else {
        d.is_active_desc = '禁用'
      }
      if(d.org_type){
        d.type_desc = d.org_type.name
      }
      if(d.owner){
        d.name = d.owner.name
        d.phone = d.owner.phone
      }
    });

  
    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <div className="btn-group">
            {          
              _util.getStorage('is_project_admin')||this.state.check(this, "add")
                ?
                <Link to={"/system/org/add"}>
                  <Button type="primary" >
                    <FormattedMessage id="component.tablepage.add" defaultMessage="新增" />
                  </Button>
                </Link>
                : null        
            }
            {/* <Link to={"/system/org/add"}>
              <Button type="primary" >
                <FormattedMessage id="component.tablepage.add" defaultMessage="新增" />
              </Button>
            </Link> */}
            <Button type="primary" onClick={this.exportExcel}>
              <FormattedMessage id="component.tablepage.export" defaultMessage="导出" />
            </Button>
            <Button
              style={{
                background: filtering ? "#87d068" : "#1890ff",
                border: 0,
                color: "#fff"
              }}
              onClick={this.doFilter}
            >
              <FormattedMessage id="component.tablepage.col-filter" defaultMessage="列筛选" />
            </Button>   
            <Search
              placeholder={'全表搜索'}  //全表搜索
              onSearch={this.handleSearch}
              enterButton
              style={{float: 'right', width: '250px'}}
            />        
          </div>
          <VirtualTable
            columns={column} //栏名
            dataSource={data} //数据
            onPaginationChange={()=>this.handleTableChange(pagination,{},{},this)}
            pagination={pagination}
            loading={loading}
            onSelectChange={this.onSelectChange} //选择行
            reset={reset}
            clearScrollTop={clearScrollTop}
            // refresh={refresh}
          />
           <Modal
            title='用户类型'
            footer={null}
            visible={showAddModal}
            onOk={this.submitAddType}
            onCancel={this.closeAddModal}
            okText={'确定'}
            cancelText={'取消'}
          >
              <Link to={{
                pathname: "/system/user/add",
                state: {
                  type: 1
                }
              }} style={{ marginRight: "20px" }} onClick={this.setScrollTop}>
                <Button type="primary"><FormattedMessage id="page.system.user.person" defaultMessage="个人" /></Button>
              </Link>

              <Link to={{
                pathname: "/system/user/add",
                state: {
                  type: 2
                }
              }} style={{ marginRight: "20px" }} onClick={this.setScrollTop}>
                <Button type="primary"><FormattedMessage id="page.system.user.group" defaultMessage="组织" /></Button>
              </Link>
          </Modal>

          <Modal
            title={`${this.state.company}二维码`}
            okText="提交"
            cancelText="取消"
            visible={codevisible}
            onOk={this.submitAddPersonModal}
            onCancel={this.hideCodeModal}
            width={600}
            footer={null}
          >
            {/* <div style={{ width: '100%', margin: '0 auto', textAlign: 'center' }}>
              <a download id='aId' title="点我下载！">
                <QRCode id='qrid' value={`${this.state.Content}${this.state.id}&mark=${this.state.mark}`} onClick={this.ClickDownLoad} size={200} />
              </a>
              <h2 style={{fontSize: '16px',textAlign: 'left'}}>提示：该二维码仅用于员工注册，使用移动端扫描二维码进行员工注册；</h2>
            </div> */}
            <div id="share">
              
              <a download id='aId'>
                <p style={{fontSize: '26px', marginBottom: '10px', lineHeight: 1}}>
                    {/* <span >Welcome to </span> */}
                    <span style={{color: 'rgba(3, 146, 69, 1)'}}>e</span>
                    <span style={{color: 'rgba(50,103,147, 1)'}}>CM</span>
                    <span style={{color: 'rgba(220,49,36, 1)'}}>S</span>
                </p>
                {/* <h2 style={{fontSize: '32px'}}>ecms</h2> */}
                <h3>{`${this.state.company}`}</h3>
                {/* {md5(`${this.state.Content}${this.state.id}`)} */}
                {/* {`${this.state.Content}${this.state.id}&mark=${this.state.mark}`} */}
                {/* {`${this.state.url}${this.state.Content}${this.state.id}&org_mark=${this.state.org_mark}&mark=${this.state.mark}`} */}
                <QRCode id='qrid' value={`${this.state.url}${this.state.Content}${this.state.id}&org_mark=${this.state.org_mark}&mark=${this.state.mark}`} size={200} />
                <div class="linearbg"></div>
                <h2 style={{fontSize: '0.8rem', padding: '10px 15px'}}>扫码或微信长按识别</h2>
                <h2 style={{fontSize: '0.8rem', padding: '0 15px'}}>扫码注册账号，加入该组织</h2>
              </a>
              <Icon type="cloud-download" style={{position: 'absolute', right: '10%'}} onClick={this.ClickDownLoad} />
              <a id="view"></a>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

