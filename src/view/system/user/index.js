import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Divider,
  Popconfirm,
  Tag,
  message, Select, Input,Modal,Form,
} from "antd";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import VirtualTable from "@component/VirtualTable3";
import {
  user,
  userDelete,
  disabledPost,
  enabledPost,
  userStatusChange
} from "@apis/system/user";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import {inject, observer} from "mobx-react/index";
import translation from "../translation";
const _util = new CommonUtil();
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
          title: formatMessage(translation.No),    //序号
          width: 40,
          maxWidth: 40,
          dataIndex: "efm-index",
          render: (text, record, index) => {
            return (index + 1);
          }
        },
        {
          title: formatMessage(translation.account),    //手机号
          dataIndex: "phone",
          // filterType: 'search',
          sorter: _util.sortString,
          render: (text, record) => {
            return <Link to={{
              pathname: "/system/user/detail",
              state: {
                id: record.id
              }
            }} onClick={this.setScrollTop}>{_util.getOrNullList(record.phone)}</Link>;
          }
        },
        {
          title: formatMessage(translation.name),     //姓名
          dataIndex: "name",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: '组织',    //组织
          dataIndex: "org",
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: formatMessage(translation.role),     //角色
          dataIndex: "role_name",
          filterType: "select",
          sorter: _util.sortString,
          render: (text, record, index) => {
            const id = record.id
            let arr = record.role.map(d => {return d.name})
            return (
              <div>
                {arr.join(',')}
              </div>
            )
          }
        },
        {
          title: formatMessage(translation.status),
          dataIndex: "is_active_desc",
          sorter: _util.sortString,
          render: (text, record) => <Tag color={_util.getColor(record.is_active ? 4 : 5)}>{text}</Tag>
        },
        {
          title: formatMessage(translation.operate),   //操作
          dataIndex: "operate",
          width: 110,
          minWidth: 110,
          maxWidth: 110,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: `/system/user/add/${id}`,
              state: {
                type: 1
              }
            };
            const canEdit = this.state.check(this, "edit");
            const canDelete = this.state.check(this, "delete");

            if (!canEdit && !canDelete) return null;

            return (
              <div>
                {
                  canDelete ?
                    <Popconfirm placement="topRight"
                      title={<p><FormattedMessage id="page.system.accessType.ifDel"
                        defaultMessage="如果删除相关记录依然存在，"/><br/><FormattedMessage
                        id="page.system.accessType.ifDel2"
                        defaultMessage="但用户将不能登录,请确认？"/></p>}
                      //title={<p>如果删除相关记录依然存在，<br />但用户将不能登录,请确认？</p>}
                      // okText='确认'
                      // cancelText='取消'
                      okText={<FormattedMessage id="app.button.ok" defaultMessage="确认"/>}
                      cancelText={<FormattedMessage id="app.button.cancel"
                        defaultMessage="取消"/>}
                      onConfirm={() => {
                        this.onDeleteOne(id);
                      }}>
                      <a style={{color: "#f5222d"}}>
                      <FormattedMessage id="app.page.text.delete" defaultMessage="删除" />
                      </a>
                    </Popconfirm>
                    :
                    null
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
      showAddModal:false
    };
  }

  componentDidMount() {
    this.getInfo({
      project_id: _util.getStorage('project_id'),
      page_size: this.state.pagination.pageSize
    });
  }

  getInfo = params => {
    const { pagination, searchValue,available } = this.state;
    const { getFn, dataMap, dataFilter } = this.props;
    console.log(params);

    this.setState({loading: true, data: []});
    const values = {
      // page: pagination.current,
      page:params&&params.is_active===2?1:pagination.current,
      page_size: pagination.pageSize,
      // is_active:available?2:0,
      ...params,
      project_id: _util.getStorage('project_id')
    };

    if (searchValue) {
      if(params&&params.is_active===2){
        console.log(values);
        // return false
      }else{
        values.search = searchValue;
      }
    }

    // if(available){
    //     values.is_active=2
    // }

    user(values).then(res => {
      let { results, count } = res.data;
      const pagination = {...this.state.pagination};
      pagination.total = count;

      if (typeof dataMap === "function") {
        dataMap(results);
      }

      if (typeof dataFilter === "function") {
        results = dataFilter(results);
      }
      let targetArr = []
      if (results && results.length && results instanceof Array) {
        results.map((value, index, array) => {
          let uid = value.id;
          let user = value.user
          return targetArr.push({
            ...user,
            ...value,
            uid
          });
        });
      }
      console.log(targetArr)

      this.setState({ data: targetArr, pagination:pagination, loading: false});

    });
  };

  onDeleteOne = id => {
    this.setState({ reset: false });
    const { formatMessage } = this.props.intl;
    const{available}=this.state;
    userDelete(id, {project: _util.getStorage('project_id')}).then(() => {
      message.success('删除成功');
      this.getInfo({is_active:available?2:0});
      this.setState({ reset: true });
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

    userStatusChange({
      ids: selectedRowKeys.join(",")
    }).then(() => {
      // message.success(formatMessage(messages.alarm32));
      this.getInfo({is_active:available?2:0});
      this.setState({ reset:true });
    });
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

     userStatusChange({ ids: selectedRowKeys.join(","), project_id: _util.getStorage('project_id'), operation: 1 }).then((res) => {
      //  message.success(formatMessage(translation.enabled)); //已启用
       message.success('已启用');
       console.log(available);
       this.getInfo({is_active:available?2:0});
       // this.getInfo()
       this.setState({reset:true});
     });
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
    _util.exportExcel(selectedRows, column,"用户管理");
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
    pagination.current = 1;
    this.setState({ searchValue: value, pagination }, () => {
      this.getInfo();
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

  render() {
    const { addType,showAddModal,column, data, check, refresh,pagination,reset,loading,filtering,available,clearScrollTop} = this.state;
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
          id: "page.component.breadcrumb.user_manage",
          defaultMessage: "用户管理"
        }),
        url: "/system/user"
      }
    ];

    data.forEach(d => {
      if(d.is_active){
        d.is_active_desc = '激活'
      }else {
        d.is_active_desc = '禁用'
      }

      if(d.status === 1){
        d.status_desc = '个人'
      }else if(d.status === 2){
        d.status_desc = '组织'
      }else{
        d.status_desc = '工人'
      }

      if(d.role&&d.role.length){
        let arr = d.role.map(d => {return d.name});
        d.role_name = arr.join(',')
      }
     
    });

    

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper">
          <div className="btn-group">
            {
              this.state.check(this, "enabled")
                ?
                <Button type="primary" onClick={() => this.enabled()}>
                  <FormattedMessage id="component.tablepage.use" defaultMessage="启用" />
                </Button>
                : null
            }
            {
              this.state.check(this, "disabled")
                ?
                <Button type="primary" onClick={() => this.doDisable()}>
                  <FormattedMessage id="component.tablepage.disable" defaultMessage="禁用" />
                </Button>
                : null
            }
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
        </div>
      </div>
    );
  }
}

