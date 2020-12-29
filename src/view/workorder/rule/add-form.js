import React from 'react'
import {
    Form,
    Button,
    Modal,
    Spin,
    message,
    Row,
    Col,
    Input,
    Select,
    Radio,
    TimePicker,Icon,Card,Switch,Tooltip
} from 'antd'

import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import {rulePost, rulePut,ruleDetail,rulePerson} from '@apis/workorder/rule'
import {SearchStaffTypeByOrg} from '@apis/home';
import GoBackButton from '@component/go-back'
import {interviewee} from '@apis/event/interviewee/'
import debounce from 'lodash/debounce'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import moment from 'moment'
import SearchUserSelect from '@component/searchUserSelect'
import {cloneDeep} from 'lodash'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

let _util = new CommonUtil();

class OrderTypeAddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmLoading: false,
            formData: {},
            spinLoading: true,
            fileList: [],
            previewVisible: false,
            previewImage: '',
            fetching: false,
            data: [],
            user: '',
            search_id:undefined,
            areaOptions:[],
            factory_id:undefined,
            work_day:0,
            weekend:0,
            work_start:'8:30',
            work_end:'18:00',
            week_start:'8:30',
            week_end:'18:00',

            project_id:_util.getStorage('project_id'),
            role_list:[],
            postData:{
                org:undefined,
                users:[],
                rules_arr:[],
            },
            isEdit:false,
            id:undefined,
            isUpgrade:false,
            user_list:[],
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.lastFetchId = 0;
    }

    componentWillMount() {
        this.setState({
            spinLoading: false
        });

        const { state } = this.props.location;
        const {postData}=this.state;

        if (state && state.id) {
            console.log(state);
            ruleDetail(state.id,{project_id:_util.getStorage("project_id")}).then((res) => {
                console.log(res.data.rules);
                rulePerson({org_id: res.data.org,project_id:_util.getStorage("project_id")}).then((res)=>{
                     this.setState({user_list:res.data})
                });
                let res_data=cloneDeep(res.data);
                postData.org=res_data.org;
                postData.users=res_data.users.map(a=>a.id);
                //postData.users=res_data.users.map(a=>a.id).join(',');
                postData.users_data=res_data.users;
                let isUpgrade=false;
                if(res_data.rules&&res_data.rules.length){
                    res_data.rules.map(item=>{
                        item.person_info=eval('(' + item.person_info + ')')
                    });
                    postData.rules_arr=res_data.rules;
                    isUpgrade=true
                }else{
                    postData.rules_arr=[{name:'',interval:0,person_info:[{person_name:"",person_phone:""}]}]
                }
                //postData.rules_arr=res.data.rules;
                this.setState({id:state.id,postData:postData,isUpgrade:isUpgrade})
            });
        }else{
            postData.rules_arr=[{name:'',interval:0,person_info:[{person_name:"",person_phone:""}]}]
        }

        SearchStaffTypeByOrg({project_id:this.state.project_id}).then(res => {
          if(res.data){
              this.setState({role_list:res.data})
          }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { postData,isEdit,id,isUpgrade } = this.state;
        let post_value=cloneDeep(postData);
        post_value.project_id=_util.getStorage("project_id");
        post_value.rules=isUpgrade?JSON.stringify(postData.rules_arr):null;
        post_value.users=postData.users.join(',');
        const { formatMessage } = this.props.intl;

        // if(!factory_id){
        //     message.error(formatMessage(messages.inOne7))
        //     return
        // }
        //
        // if (!desc) {
        //     message.error(formatMessage(messages.order4))
        //     return
        // }
        // if (!search_id) {
        //     message.error(formatMessage(messages.order5))
        //     return
        // }

        this.setState({
            confirmLoading: true
        });

        if (id) {
            rulePut(id,post_value).then(res => {
                message.success(formatMessage(messages.alarm7))
                this.setState({
                    confirmLoading: false
                })
                this.props.history.goBack()
            }).catch(e => {
                this.setState({
                    confirmLoading: false
                })
            });
        }else{
              // if(work_day){
              //     post_param.workday_start_time=work_start;
              //     post_param.workday_end_time=work_end
              // }
              //
              // if(weekend){
              //     post_param.weekend_start_time=week_start;
              //     post_param.weekend_end_time=week_end;
              // }

              rulePost(post_value).then(res => {
                    message.success(formatMessage(messages.alarm7))
                    this.setState({
                        confirmLoading: false
                    })
                    this.props.history.goBack()
                }).catch(e => {
                    this.setState({
                        confirmLoading: false
                    })
                })
        }
    }

     handleSelectType=(val,field)=>{
         console.log(val);
         const {postData}=this.state;
         if(field==='org'){
             rulePerson({org_id: val,project_id:_util.getStorage("project_id")}).then((res)=>{
                 console.log(res);
                 postData[field]=val;
                 this.setState({user_list:res.data,postData:postData})
             })
         }else if(field==='users'){
             // let user=postData.users;
             // user.push(val);
             postData[field]=val;
             this.setState(postData)
         }else{
             postData[field]=val;
             this.setState(postData)
         }
     };

    onRadioChange = (val1,val2) => {
        console.log(val1,val2)
        if(val2==='work'){
            this.setState({
              work_day:val1,
            });
        }else if(val2==='weekend'){
            this.setState({
              weekend:val1,
            });
        }
    };

    getUser=(val)=>{
        const{postData}=this.state;
        postData.users=val.join(',');
        this.setState(postData)
    };

    handleInputRule = (val,field,index) => {
        const{postData}=this.state;
        postData.rules_arr[index][field]=val;
        this.setState(postData)
    };

    handleInputPerson = (val,field,index,p) => {
        const{postData}=this.state;
        postData.rules_arr[index]['person_info'][p][field]=val;
        this.setState(postData)
    };

    delRule = (index) => {
          const { postData } = this.state;
          postData.rules_arr.splice(index,1);
          this.setState({postData});
    };

    add = () => {
          const { postData } = this.state;
          let postDataNew=postData.rules_arr.concat([{name:'',interval:undefined,person_info:[{person_name:"",person_phone:""}]}]);
          postData.rules_arr=postDataNew;
          this.setState(postData)
      };

    addPerson = (pIndex,index) => {
          const { postData } = this.state;
          let postDataNew=postData.rules_arr[index].person_info.concat([{person_name:"",person_phone:""}]);
          postData.rules_arr[index].person_info=postDataNew;
          this.setState(postData)
      };

    delPerson = (pIndex,index) => {
          const { postData } = this.state;
          postData.rules_arr[index].person_info.splice(pIndex,1);
          this.setState({postData});
    };

    handleUpgrade = (val) => {
       console.log(val)
        this.setState({isUpgrade:val})
    };

    render() {
        const {getFieldDecorator} = this.props.form
        const {id,confirmLoading, spinLoading, fetching, user, data,areaOptions,postData,role_list,isUpgrade,user_list} = this.state;

        const formRemindLayout = {
            'labelCol': {
                'xs': {'span': 24},
                'sm': {'span': 4}
            },
            'wrapperCol': {
                'xs': {'span': 24},
                'sm': {'span': 18}
            }
        };

        const bread = [
          {
              name: <FormattedMessage id="page.accessory.bread.homepage" defaultMessage="首页"/>,
              url: '/'
          },
          {
              name:'任务管理'
          },
          {
              name: '执行规则',
              url: '/assignment/rule'
          },
            {
              name: id ? <FormattedMessage id="global.revise" defaultMessage="修改"/>:<FormattedMessage id="component.tablepage.add" defaultMessage="新增" />,
              url: ''
          }

        ];

        const { formatMessage } = this.props.intl;

        const ruleItems=postData&&postData.rules_arr&&postData.rules_arr.map((item,index)=>(
            <div>
                <Card size="small"
                      title={'规则'+(index+1)}
                      style={{marginBottom:'10px'}}
                      extra={<a onClick={()=>this.delRule(index)}>删除</a>}>
                      <Row style={{marginBottom:'10px',lineHeight:'32px'}}>
                          <Col span={3}>
                              <Tooltip title="请描述清楚，以便后续让被提醒人明白">
                                  <label>标题:</label>
                              </Tooltip>
                          </Col>
                          <Col span={8}>
                              <Input value={item.name} placeholder={'请输入'} onChange={e => this.handleInputRule(e.target.value,'name',index)}/>
                          </Col>
                          <Col span={5} offset={1}>
                              <Tooltip title="每隔对应的天数，系统将给提醒人发信息">
                                  <label>时间间隔(天):</label>
                              </Tooltip>
                          </Col>
                          <Col span={5}>
                              <Input value={item.interval} placeholder={'天'} onChange={e => this.handleInputRule(e.target.value,'interval',index)}/>
                          </Col>
                    </Row>

                    {
                        item.person_info.map((person,p)=>{
                            return <Row style={{marginBottom:'10px',lineHeight:'32px'}}>
                        <Col span={3}>
                            <span>提醒人:</span>
                        </Col>
                        <Col span={8}><Input placeholder={'请输入提醒人姓名'} value={person.person_name} onChange={e => this.handleInputPerson(e.target.value,'person_name',index,p)}/></Col>
                        <Col span={10} offset={1}><Input placeholder={'请输入联系人联系电话'} value={person.person_phone} onChange={e => this.handleInputPerson(e.target.value,'person_phone',index,p)}/></Col>

                         {item.person_info.length>1?
                            <Col span={1}>
                                <Icon
                                        className="dynamic-delete-button"
                                        type="minus-circle-o"
                                        theme='twoTone'
                                        style={{cursor: 'pointer',marginLeft:'5px'}}
                                        // disabled={item.person_info.length === 1}
                                        onClick={() => this.delPerson(p,index)}
                                    />
                            </Col> :null
                         }

                         {item.person_info.length===p+1?
                             <Col span={1}>
                             <Icon
                                     className="dynamic-delete-button"
                                     type="plus-circle"
                                     theme='twoTone'
                                     style={{cursor: 'pointer',marginLeft:'5px'}}
                                     // disabled={item.person_info.length === 1}
                                     onClick={() => this.addPerson(p, index)}
                                 />
                             </Col>:null
                         }
                    </Row>
                        })
                    }
                </Card>
            </div>
        ));

        
        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <Row className="content-wrapper content-no-table-wrapper">
                    <Spin spinning={spinLoading}>
                        <Card title="组织执行人"  style={{width:'60%',margin:'0 15% 20px'}}>
                          <Form>
                                <FormItem label={'组织'} {...formRemindLayout} required >
                                    <Select value={postData.org} style={{ width: '100%'}} placeholder={'请先选择组织'} onSelect={value => this.handleSelectType(value,'org')} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        {role_list && role_list.length ?
                                            role_list.map((option, index) => {
                                                return (<Option key={option.org_id} value={option.org_id}>{option.org_name}</Option>)
                                            }) : null
                                        }
                                    </Select>
                                </FormItem>

                                <FormItem {...formRemindLayout} label={'执行人'} required>
                                    <Select mode="multiple" value={postData.users} style={{ width: '100%'}} placeholder={'请选择'} onChange={value => this.handleSelectType(value,'users')}>
                                        {user_list && user_list.length ?
                                            user_list.map((option, index) => {
                                                return (<Option key={option.id} value={option.id}>{option.name}</Option>)
                                            }) : null
                                        }
                                    </Select>
                                    {/*<SearchUserSelect getUser={this.getUser} cc={postData.users_data}/>*/}
                                </FormItem>

                                <FormItem {...formRemindLayout} label={'是否升级'}>
                                    <Switch checkedChildren="是" checked={isUpgrade} unCheckedChildren="否" onChange={this.handleUpgrade} />
                                </FormItem>
                          </Form>
                        </Card>

                        {
                            isUpgrade?<Card title="升级规则" style={{width:'60%',margin:'0 15% 20px'}}>
                            <Form>
                              <FormItem {...formRemindLayout} label={'规则'} required>
                                        {ruleItems}
                                        <Row>
                                            <Col span={24}>
                                              <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                                                <Icon type="plus" /> 新增规则
                                              </Button>
                                            </Col>
                                        </Row>
                                    </FormItem>
                            </Form>
                        </Card>:null
                        }


                        <div style={{width: '100%', margin: '40px 0',textAlign:'center'}}>
                            <Button type="primary" loading={confirmLoading} onClick={this.handleSubmit}
                                    style={{marginRight: '10px'}}>
                                {id?'修改':'保存'}
                            </Button>
                            <GoBackButton props={this.props}/>
                        </div>
                    </Spin>
                </Row>
            </div>
        )
    }
}

const OrderTypeAdd = Form.create()(OrderTypeAddForm);

export default injectIntl(OrderTypeAdd)
