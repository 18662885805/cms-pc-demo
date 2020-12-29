import React, { Component } from "react";
import {
  Button, Card, Icon, Input, message, Modal, Upload,Form,Select
} from "antd";
import {FormattedMessage, injectIntl} from "react-intl";
import SearchUserSelect from '@component/searchUserSelect'
import CommonUtil from "@utils/common";

let _util = new CommonUtil();
const FormItem = Form.Item;
const {TextArea}=Input;
const { Option } = Select;

@injectIntl
class flowModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subVisible:false,
      type:undefined,
      steps:undefined,
      postData:{
        remarks:'',
        source:'',
        step_id:undefined,
        fileList:[],
      },
    };
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({subVisible:nextProps.subVisible,type:nextProps.type,steps:nextProps.steps})
  }

  getUser=(val)=>{
    const{postData}=this.state;
    postData.cc=val.join(',');
    this.setState(postData)
  };

  handleRemarkChange=(value,field)=>{
    const {postData}=this.state;
    postData[field]=value;
    this.setState(postData)
  };

  orgUpload = (info) => {
    let {postData}=this.state;
    postData.fileList = info.fileList;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;
    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)
    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }
    console.log(postData);
    this.setState(postData)
    //this.setState({fileList2: fileList})
};

  submitModal = e => {
        e.preventDefault();

        this.props.getModalData(this.state.postData)

        // e.preventDefault()
        // const _this = this;
        // const { formatMessage } = this.props.intl;
        // const {selectedRowKeys, approve_list, pagination, makePersons, selectedRows,auditPersons,driverInfo} = _this.state;
        // _this.setState({refresh:false});
        //
        // recordAllFlowDetail({project_id: _util.getStorage('project_id'),work_flow_id:selectedRows[0].work_flow_id}).then((res)=>{
        //     console.log(res)
        // });
        //
        // let data = {
        //     project_id:_util.getStorage('project_id'),
        //     id: selectedRows[0].id,
        //     remarks:'123',
        //     change:JSON.stringify({
        //         id: '5',
        //         step: [
        //             {
        //                 id: 5,
        //                 deadline: 10,
        //                 child: [
        //                     {
        //                         id: 5,
        //                         user: [108]
        //                     }
        //                 ]
        //             }
        //         ]
        //     })
        // };
        //
        // confirm({
        //   title: '确认提交?',
        //   content: '单击确认按钮后，将会提交数据',
        //   okText: '确认',
        //   cancelText: '取消',
        //     onOk() {
        //         recordSub(data).then((res) => {
        //             if(res){
        //                 message.success('提交成功');
        //                 _this.hideModal();
        //                 _this.setState({refresh:true});
        //             }
        //         })
        //     },
        //     onCancel() {
        //     },
        // })
    };

  hideModal = () => {
        this.setState({
            subVisible: false,
        })
  };

  render () {
    const{subVisible,postData,steps,type}=this.state;

    console.log(type)

    const props2 = {
      multiple: true,
      accept: "image/*",
      action: _util.getServerUrl(`/upload/auth/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    };

     const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
        <div>
          <Modal
            title={'操作'}
            style={{ top: 20 }}
            visible={subVisible}
            onOk={this.submitModal}
            onCancel={this.hideModal}
            okText={<FormattedMessage id="component.tablepage.sure" defaultMessage="确定" />}
            cancelText={<FormattedMessage id="page.oneStop.cardOperation.close" defaultMessage="关闭" />}
            destroyOnClose={true}
        >
              <Form  {...formItemLayout}>
                {type==='jump'?
                  <Form.Item label={'跳过步骤'} required>
                        <Select onSelect={(value)=>this.handleRemarkChange(value,'step_id')}>
                          {steps&&steps.map((item,index)=>{
                            return <Option key={index} value={item.id}>{`步骤${index+1} 包含的子步骤:${item.child.map(a=>a.name).join(',')} `}</Option>
                          })}
                        </Select>
                    </Form.Item>:null
                }
                    <Form.Item label={'抄送人'}>
                         <SearchUserSelect getUser={this.getUser}/>
                    </Form.Item>

                    <Form.Item label={'备注'}>
                        <TextArea
                          placeholder="请输入"
                          style={{width:'100%'}}
                          onChange={(e)=>this.handleRemarkChange(e.target.value,'remarks')}
                        />
                    </Form.Item>

                    <Form.Item label={'附件'}>
                         <Upload
                            {...props2}
                            fileList={postData.fileList}
                            beforeUpload={_util.beforeUpload}
                            onChange={this.orgUpload}
                            //customRequest={this.fileUpload}
                            accept='image/*'
                            //onRemove={this.handleRemove}
                          >
                          <Button>
                              <Icon type="upload" />上传
                          </Button>
                          </Upload>
                    </Form.Item>
              </Form>
            </Modal>
        </div>
    )
  }
}

export default flowModal;