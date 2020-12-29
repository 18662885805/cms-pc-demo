import React from 'react'
import {Form, Button, Modal, Spin, message, Input, Select,InputNumber,DatePicker,Transfer,Tag} from 'antd'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {trainPost} from '@apis/training/manage'
import {materials} from '@apis/training/material'
import GoBackButton from '@component/go-back'
import moment from 'moment';
import { SearchProjectUser } from "@apis/system/user";


const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option
const { Search } = Input;



let _util = new CommonUtil()

const messages = defineMessages({
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
  train_name_check: {
    id: 'app.train.check.train_name_check',
    defaultMessage: '请输入培训名称',
  },
  train_score_check:{
    id: 'app.train.check.train_score_check',
    defaultMessage: '请输入每题分数',
  },
  train_duration_check: {
    id: 'app.train.check.train_duration_check',
    defaultMessage: '请输入培训时间',
  },
  train_count_check:{
    id: 'app.train.check.train_count_check',
    defaultMessage: '请输入培训题数',
  },
  train_clearance_check:{
    id: 'app.train.check.train_clearance_check',
    defaultMessage: '请输入培训合格分数',
  },
  train_desc_check:{
    id: 'app.train.check.train_desc_check',
    defaultMessage: '请输入培训描述',
  },
  desc: {
    id: 'app.placeholder.material.desc',
    defaultMessage: '描述',
  },
  train_materials_check:{
    id: 'app.train.check.train_materials_check',
    defaultMessage: '请选择培训资料',
  },
  train_role_check:{
    id: 'app.train.check.train_role_check',
    defaultMessage: '请选择培训角色',
  },
  train_expire_time_check:{
    id: 'app.train.check.train_expire_time_check',
    defaultMessage: '请选择截止日期',
  },
  certificate_expire_time_check:{
    id:'app.train.check.certificate_expire_time_check',
    defaultMessage: '请选择证书有效期',
  },
  train_user_check:{
    id: 'app.train.check.train_user_check',
    defaultMessage: '请选择培训人员',
  },
  select: {
    id: 'app.placeholder.select',
    defaultMessage: '-- 请选择 --',
  },
  selectUserByDepartment: {
    id: 'app.placeholder.department',
    defaultMessage: '-- 请输入部门 --',
  },

  nodata: {
    id: 'app.placeholder.nodata',
    defaultMessage: '暂无数据',
  },
});

@injectIntl
class EntranceRegisterAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      fetching: false,
      name: '',
      desc: '',
      materials:[
          {id:1,name:'入场培训一'},
          {id:1,name:'入场培训二'},
      ],
      expireTime:'',
      certificateExpireTime:'',
      addModal:false,

      targetKeys: [],
      selectedKeys: [],
      disabled: false,
      sourceData:[],
      tableLoading:false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
        spinLoading: false
    })
  }



  handleChangeUser = (value) => {
    this.setState({selectedUsers:value})
  }

  onChangeBeginDay = (date, dateString) => {
    this.setState({expireTime:dateString})
  }

  onChangeEffectiveDay = (date, dateString) => {
    this.setState({certificateExpireTime:dateString})
  }

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  }

  //role,user,materials:string:A,B,C,D

  handleSubmit(e) {
    e.preventDefault()
    const {formatMessage} = this.props.intl
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const _this = this
        _this.setState({
          confirmLoading: true
        });

        values.materials = values.materials ? values.materials.join(',') : null;
        values.begin_day = this.state.expireTime;
        confirm({
          title: formatMessage(messages.confirm_title),
          content: formatMessage(messages.confirm_content),
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            const project_id = _util.getStorage('project_id');
            trainPost(project_id,values).then((res) => {
              message.success(formatMessage(messages.save_success))      
              _this.props.history.goBack()
            })
          },
          onCancel() {
          },
        })
        this.setState({
          confirmLoading: false
        })
      }
    })
  }

    closeAddModal = () => {
        this.setState({
            addModal:false
        })
    }

    showAddModal = () => {
        this.setState({
            addModal:true
        })
    }

    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };
    
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });   
        console.log('sourceSelectedKeys: ', sourceSelectedKeys);//当前待选区选中key
        console.log('targetSelectedKeys: ', targetSelectedKeys);//当前选中区选中key
    };
    
    handleScroll = (direction, e) => {
        console.log('0302','direction:', direction);
        console.log('0302','target:', e.target);
    };
    
    renderItem = (item,index) => {
        const customLabel = (
          <span className="custom-item">
            <Tag color="#108ee9"> {item.name}</Tag>-{item.phone}        
          </span>
        );
        return {
          label: customLabel, // for displayed item
          value: item.id, // for title and filter matching
        };
    };

    searchUser = (val) => {
        if(val){
            this.setState({tableLoading:true});
            SearchProjectUser({ q: val, project_id: _util.getStorage('project_id') }).then((res) => {
                if(res.data && res.data.length){
                    var leftDataList = []
                    res.data.map((person) => {
                        const personObj = person;
                        personObj.key = person.id;
                        leftDataList.push(personObj)
                    });
                    this.setState({sourceData:leftDataList,tableLoading:false})
                }else{
                    this.setState({sourceData:[],tableLoading:false})
                }          
            });
        }else{
            this.setState({sourceData:[],tableLoading:false})
        }
    }

 
  render() {
    const {getFieldDecorator} = this.props.form
    const { formatMessage } = this.props.intl
    const {
      confirmLoading,
      spinLoading,
      materials,
      addModal,
      targetKeys,
      selectedKeys,
      sourceData,
      tableLoading 
    } = this.state

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 10},
      },
    };

    const materialList = materials instanceof Array && materials.length ? materials.map(d =>
      <Option key={d.id} value={d.id}>{d.name}</Option>) : [];
 
    return (
      <div>
        <MyBreadcrumb/>
        <div className="content-wrapper">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                label={<FormattedMessage id="page.training.myrecord.myrecord_name" defaultMessage="培训名称" />}
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: formatMessage(messages.train_name_check),        
                  }],
                })(<Input/>)}
              </FormItem>
              <FormItem
                label={<FormattedMessage id="page.training.train.score" defaultMessage="每题分数" />}
                {...formItemLayout}
              >
                {getFieldDecorator('score', {
                  rules: [{
                    required: true,
                    message: formatMessage(messages.train_score_check),         
                  }],
                })(<InputNumber min={1}/>)}
              </FormItem>
              <FormItem
                label={<FormattedMessage id="page.training.exam.duration" defaultMessage="培训时长(分钟)" />}
                {...formItemLayout}
              >
                {getFieldDecorator('examination_time', {
                  rules: [{
                    required: true,
                    message: formatMessage(messages.train_duration_check),         
                  }],
                })(<InputNumber min={1}/>)}
              </FormItem>
              <FormItem
                label={<FormattedMessage id="page.training.exam.count" defaultMessage="培训题数" />}
                {...formItemLayout}
              >
                {getFieldDecorator('length', {
                  rules: [{
                    required: true,
                    message: formatMessage(messages.train_count_check),         
                  }],
                })(<InputNumber min={1}/>)}
              </FormItem>
              <FormItem
                label={<FormattedMessage id="page.training.train.clearance" defaultMessage="合格分数" />}
                {...formItemLayout}
              >
                {getFieldDecorator('clearance', {
                  rules: [{
                    required: true,
                    message: formatMessage(messages.train_clearance_check),         
                  }],
                })(<InputNumber min={1}/>)}
              </FormItem>
              
              <FormItem {...formItemLayout} label={'培训课程'} >
                {getFieldDecorator('manages', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.train_materials_check),         
                    },
                  ],
                })(
                  <Select
                    placeholder={formatMessage(messages.select)}
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {materialList}
                  </Select>
                )}
              </FormItem>

              

              <FormItem {...formItemLayout} label={'培训开始日期'} >
                {getFieldDecorator('begin_day', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.train_expire_time_check),         
                    },
                  ],
                })(
                  <DatePicker 
                    onChange={this.onChangeBeginDay}
                    showToday={false}
                    //disabledDate={this.disabledDate}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={'培训有效期'} >
                {getFieldDecorator('effective_day', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(messages.certificate_expire_time_check),         
                    },
                  ],
                })(<InputNumber min={1}/>)}
              </FormItem>    
              <FormItem {...submitFormLayout}>
                <div style={{width: '100%', marginBottom: '20px'}}>
                  <Button type="primary" htmlType="submit" loading={confirmLoading}
                          style={{marginRight: '10px'}}>
                     <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                  <GoBackButton props={this.props}/>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    )
  }
}

const EntranceRegisterAdd = Form.create()(EntranceRegisterAddForm)

export default EntranceRegisterAdd
