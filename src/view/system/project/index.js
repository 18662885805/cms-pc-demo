import React from 'react'
import { Modal, Select, message } from 'antd'
import { Link } from 'react-router-dom'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import moment from "moment";
import { projectInfoList } from '@apis/system/project';
import {user} from '@apis/admin/user';
import TablePage from '@component/TablePage'
import { FormattedMessage, injectIntl, defineMessages, } from 'react-intl'
import { inject, observer } from 'mobx-react'

const { Option } = Select

const _util = new CommonUtil();

const messages = defineMessages({
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },
  description: {
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

@inject('appState') @observer @injectIntl
export default class extends React.Component {
  constructor(props) {
    super(props)
    const { formatMessage } = this.props.intl
    this.state = {
      column: [
        {
          // title: '序号',
          title: formatMessage({ id: "app.table.column.No", defaultMessage: "序号" }),
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
        {
          title: '省市区',
          dataIndex: 'province',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: '详细地址',
          dataIndex: 'address',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record)
        },
        {
          title: '项目管理员',
          dataIndex: 'admin_user',
          sorter: _util.sortString,
          render: record => _util.getOrNullList(record ? _util.renderDataName(record) : null)
        },
        // {
        //   title: '添加人员',
        //   dataIndex: 'operate',
        //   width: 100,
        //   minWidth: 100,
        //   maxWidth: 100,
        //   render: (text, record, index) => {
        //     const id = record.id
        //     return (
        //         <div>

        //           <a style={{ color: '#f5222d' }} onClick={() => this.showAddPersonModal(id)}>
        //             <FormattedMessage id="app.button.add" defaultMessage="添加" />
        //           </a>

        //         </div>
        //     );
        //   }
        // },
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
          render: record => _util.getOrNullList(record ? moment(record).format('YYYY-MM-DD HH:mm:ss') : null)
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
          title: formatMessage({ id: "app.table.column.operate", defaultMessage: "操作" }),
          dataIndex: 'operate',
          width: 120,
          minWidth: 120,
          maxWidth: 120,
          render: (text, record, index) => {
            const id = record.id
            let path = {
              pathname: `/system/project/setting/${id}`,
            }
            return (
              <div>
                <Link to={path} style={{ marginRight: '10px' }} onClick={this.setScrollTop}> <FormattedMessage id="app.page.text.modify" defaultMessage="修改" />
                </Link>
              </div>
            );
          }
        }
      ],
      add_person_data: [],
      addPersonVisible: false,
      personVisible: false,
      check: _util.check(),
    }
  }
  setScrollTop = () => {
    const scrollTopPosition = this.props.appState.tableScrollTop;
    if (scrollTopPosition) {
      _util.setSession('scrollTop', scrollTopPosition);
    };
  }

  showAddPersonModal = (id) => {
    user().then(res => {
      this.setState({
        addPersonVisible: true,
        add_person_data: res.data.results,
        project_id: id
      })
    })
  }

  showModal = (params) => {
    console.log(params)
    this.setState({
      personVisible: true,
      addedworker: params.worker,
      project_id: params.id,
      rowdata: params
    });
  }

  hideAddPersonModal = () => {
    this.setState({
      addPersonVisible: false,
      add_person_data: [],
      chose_data: [],
      project_id: null
    })
  }

  submitAddPersonModal = () => {
    const {project_id, chose_data} = this.state;
    const { formatMessage } = this.props.intl;
    this.setState({ refresh: false });
    // this.setState({ refresh: false });
    // AddProjectUser({project_id: project_id, ids: chose_data.join(',')}).then(res => {
    //     message.success('人员添加成功');
    //     this.hideAddPersonModal();
    //     this.setState({
    //         selectedRowKeys:[],
    //         refresh: true
    //     });
    // })

  };

  handleAddPersonChange = (chose_data) => {
    console.log(chose_data)
    this.setState({
        chose_data
    })
}

  render() {
    const { column, check, refresh, addPersonVisible, personVisible } = this.state;
    const { formatMessage } = this.props.intl;
    let params = {
      project_id: _util.getStorage('project_id')
    }
    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper">
          <TablePage
            param={params}
            refresh={refresh}
            getFn={projectInfoList}
            columns={column}
            addPath={"/system/project/setting"}
            excelName={'项目管理'}
            dataMap={data => {
              data.forEach(d => {
                const { status } = d
                if (status) {
                  d.status_desc = <FormattedMessage id="component.tablepage.use" defaultMessage="启用" />
                } else {
                  d.status_desc = <FormattedMessage id="page.construction.location.disactive" defaultMessage="禁用" />
                }
              })
            }}
          >
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
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear={true}
                notFoundContent={<FormattedMessage id="global.nodata" defaultMessage="暂无数据" />}
                mode='multiple'
                style={{ width: '100%' }}
                onChange={this.handleAddPersonChange}
              // value={chose_data}
              >
                {
                  this.state.add_person_data.map((option, index) => {
                    return (<Option key={index} value={option.id}>{option.name}</Option>)
                  })
                }
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

        </div>
      </div>
    )
  }
}