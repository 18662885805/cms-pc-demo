import React from "react";
import {Form, Button, Modal, Spin, message, Select, Input,Tabs,Table} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import {orgtypeInfo} from "@apis/system/orgtype";
import {recordAllFlow} from "@apis/workflow/record";
import {flowClassification} from "@apis/workflow/flow";
import GoBackButton from "@component/go-back";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TabPane } = Tabs;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class WorkTypeAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      factoryList: [],
      is_parent: false,
      location_list: [],
      typeoption: [],
      classificationOptions: [],
      myAllFlow:[],
      selectedRows:[],
      selectedRowKeys:[],
      selectedRowsTab2:[],
      selectedRowKeysTab2:[],
      frequentFlow:[],
      tabKey:'1',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    if (id) {
      classificationDetail(id, {project_id: _util.getStorage('project_id') }).then((res) => {
        // const {org_type} = res.data
        this.setState({
          // org_type,
          data: res.data
        });
      });
    }

    // flowClassification({project_id: _util.getStorage('project_id')}).then((res) => {
    //   this.setState({classificationOptions: res.data})
    // });

    this.setState({
      spinLoading: false
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/record");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }

  // componentWillMount() {
  //   locationForm().then((res) => {
  //     this.setState({
  //       formData: res.data.results
  //     });
  //   });
  //   this.setState({
  //     spinLoading: false
  //   });
  // }

  handleFilterClassification=(value)=>{
    recordAllFlow({project_id: _util.getStorage('project_id'),classification_id:parseInt(value)}).then((res) => {
      this.setState({myAllFlow: res.data})
    });
  };

  handleToDrag=()=>{
    console.log(1)
    const{selectedRows}=this.state;

    console.log(selectedRows);
    if(selectedRows.length===1){
      this.props.history.push({
        pathname: '/workflow/record/fill',
        param:selectedRows[0]
      });
    }else{
      message.error('请选择一条审批流');
    }


    // recordAllFlow({project_id: _util.getStorage('project_id'),classification_id:parseInt(value)}).then((res) => {
    //   this.setState({myAllFlow: res.data})
    // });
  };

  handleToFrequent=()=>{
    const{selectedRows}=this.state;

    console.log(selectedRows);
    if(selectedRows.length>0){
      let flows=_util.getStorage('frequent_flow');
      let flows_new=flows?flows.concat(selectedRows):[].concat(selectedRows);
      _util.setStorage('frequent_flow', flows_new);
      this.setState({tabKey:'2'})
      //localStorage.setItem(frequentFlow, JSON.stringify(selectedRows));
    }else{
      message.error('请至少选择一条数据');
    }
  };

   handleFromFrequent=()=>{
    const{selectedRowsTab2,selectedRowKeysTab2}=this.state;
    if(selectedRowsTab2.length>0){
      let flows=_util.getStorage('frequent_flow');
      selectedRowKeysTab2.map((val)=>{
        flows.splice(val,1)
      });
      console.log(flows)
      //let flows_new=flows?flows.concat(selectedRows):[].concat(selectedRows);
      _util.setStorage('frequent_flow', flows);
      this.setState({frequentFlow:flows,selectedRowsTab2:[],selectedRowKeysTab2:[]})
      //localStorage.setItem(frequentFlow, JSON.stringify(selectedRows));
    }else{
      message.error('请至少选择一条数据');
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    // this.setState({
    //   confirmLoading: true
    // });
    
    this.props.form.validateFields((err, values) => {
      console.log(this.props.match.params.id)
      if (!err) {
        let _this = this;
        const {formatMessage} = this.props.intl;

        let data = {
          name: values.name,
          abbreviation:values.abbreviation,
          // org_type: values.org_type,
          // desc: values.desc,
          project_id: _util.getStorage('project_id')
        };
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            const { id } = _this.props.match.params;
            if (id) {
              classificationPut(id, data).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
              return;
            }

            classificationPost(data).then((res) => {
              message.success(formatMessage(translation.saved));
              _this.props.history.goBack();
            });
          },
          onCancel () {
          }
        });
      }
      this.setState({
        confirmLoading: false
      });
    });
  }

  onLevelChange = (value) => {
    areaInfo({project_id: _util.getStorage('project_id'), level: 1}).then((res) => {
      this.setState({
        location_list: res.data
      });
    });
    this.setState({
      is_parent: value === 2 ? true : false
    });
  };

  handleTabChanges=(value)=>{
     this.setState({tabKey:value,selectedRows:[],selectedRowKeys:[]})
  };

  tableChange=(pagination, filters, sorter,)=>{
    if(pagination.current){
      console.log(1)
      this.setState({selectedRows:[],selectedRowKeys:[]})
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {confirmLoading, spinLoading, location_list, data, typeoption, org_type,classificationOptions,myAllFlow,frequentFlow,tabKey} = this.state;

    let frequent_info=[]
    if(_util.getStorage("frequent_flow")){
      frequent_info=_util.getStorage("frequent_flow")
    }
    //let frequent_flow_info=_util.getStorage("frequent_flow")&&JSON.parse(_util.getStorage("frequent_flow"))

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      }
    };

    const _this = this;
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10}
      }
    };

    // const location = location_list instanceof Array && location_list.length ? location_list.map(d =>
    //   <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

    const {formatMessage} = this.props.intl;

    let parent = [];

    if (this.state.is_parent) {
      parent = [
        {
          field: "parent",
          type: "select",
          icon: "",
          value: data ? data.parent : null,
          text: "上级场所",
          placeholder: "上级场所",
          options: location_list,
          rules: []
        }
      ];
    }

    const formData = [
        {
        field: "abbreviation",
        type: "char",
        icon: "",
        value: data ? data.abbreviation : null,
        text: "简码",
        placeholder: "请输入三位简码",
        rules: [{required: true, message: "请输入简码"}]
      },
      {
        field: "name",
        type: "char",
        icon: "",
        value: data ? data.name : null,
        text: "名称",
        placeholder: "请输入分类名称",
        rules: [{required: true, message: "请输入分类名称"}]
      },
      // {
      //   field: "org_type",
      //   type: "select",
      //   icon: "",
      //   value: org_type ? org_type.id : null,
      //   text: "组织类型",
      //   placeholder: "请选择组织类型",
      //   // onChange: (value) => this.onLevelChange(value),
      //   options: typeoption,
      //   rules: [{required: true, message: "请选择组织类型"}]
      // },
      // {
      //   field: "desc",
      //   type: "textarea",
      //   icon: "",
      //   value: data ? data.desc : null,
      //   text: "描述",
      //   placeholder: "请输入职务描述",
      //   rules: []
      // },
    ];

    const { id } = this.props.match.params
    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
          name: '我的工作流',
          url: '/workflow/record'
      },
      {
          name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改"/> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ];

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        // render: text => <a>{text}</a>,
      },
      {
        title: '描述',
        dataIndex: 'desc',
      },
    ];

const data_source = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({selectedRows:selectedRows,selectedRowKeys:selectedRowKeys})
  },

  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const rowSelection2 = {
  onChange: (selectedRowIndex, selectedRow) => {
    const{selectedRowKeys}=this.state;
    console.log(`selectedRowKeys2: ${selectedRowKeys}`, 'selectedRows2: ', selectedRows);
    this.setState({selectedRowsTab2:selectedRow,selectedRowKeysTab2:selectedRowIndex})
  },

  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper'>
          <Spin spinning={spinLoading}>
            <Form >

              <Tabs activeKey={tabKey} onChange={(activeKey)=>this.handleTabChanges(activeKey)} style={{minHeight:"300px"}}>
                <TabPane tab="所有工作流" key="1">
                    <Select
                        onChange={this.handleFilterClassification}
                        style={{width:'200px'}}
                        placeholder={'---分类筛选---'}
                    >
                      {classificationOptions.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
                    </Select>

                  <Table rowSelection={rowSelection} rowKey={record => record.id} columns={columns} dataSource={myAllFlow} />,
                </TabPane>
                <TabPane tab="常用工作流" key="2">
                  <Table rowSelection={rowSelection2} rowKey={record => record.id} columns={columns} dataSource={frequent_info} />,
                </TabPane>
              </Tabs>
              {/*<FormData data={formData} form={this.props.form} layout={formItemLayout}/>*/}

              <FormItem {...submitFormLayout}>
                <div style={{width: "100%", marginBottom: "20px"}}>
                  <Button type='primary' loading={confirmLoading}
                          style={{marginRight: "10px"}}
                          onClick={()=>this.handleToDrag()}
                  >
                    下一步
                  </Button>
                  {tabKey==='1'?
                    <Button type='primary' loading={confirmLoading}
                            style={{marginRight: "10px"}}
                            onClick={() => this.handleToFrequent()}
                    >
                      添到常用工作流
                    </Button>:null
                  }
                  {tabKey==='2'?
                    <Button type='primary' loading={confirmLoading}
                            style={{marginRight: "10px"}}
                            onClick={() => this.handleFromFrequent()}
                    >
                      移出常用工作流
                    </Button>:null
                  }
                  <GoBackButton props={this.props}/>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;
