import React from "react";
import {
    Form,
    Button,
    Modal,
    Spin,
    message,
    Select,
    Input,
    Collapse,
    Card,
    Timeline,
    Upload,
    Icon,
    Tabs,
    Skeleton,
    Row,
    Col
} from "antd";
import {inject, observer} from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import { wait, waitDetail,waitAudit,waitBack,waitStop,waitProxy,waitJump,waitChild } from "@apis/workflow/wait";
import GoBackButton from "@component/go-back";
import FormBuilder from "@component/FormBuilder";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import translation from '../translation'
import SearchUserSelect from '@component/searchUserSelect'
import styles from '../../common.css'
import PdfFormFlow from '@component/pdfFormFlow'
import html2pdf from "html2pdf.js";
import ApprovalInfo from'@component/approvalInfo2'
import ApprovalStep from "@component/approvalStep4";
import FormCreator from "@component/FormCreator";
import _ from "lodash";
import moment from "moment";
import {GetTemporaryKey} from "@apis/account/index"
import { getCosSourse } from "@apis/system/cos";
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { Panel } = Collapse;
const {TextArea}=Input;
const { TabPane } = Tabs;
let _util = new CommonUtil();

  const formDataNormalizer = (formData) => {
      let formDataObject = formData;
      if (typeof formData === "string") {
        formDataObject = JSON.parse(formData);
      }
      if (Object.keys(formDataObject).length === 0) {
        return null;
      }
      return _.mapValues(formDataObject, (value, key) => {
        if (key.indexOf("DatePicker_") !== -1) {
          return moment(value);
        }
        return value;
      });
  };

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
      param_info: undefined,
      form:{},
      approval: undefined,
      child_step_id:undefined,
      e_type:undefined,
      info:undefined,
      id:undefined,
      logoBase64: null,
    form_content:undefined,
    record:undefined,
    form_name:'',
    type:'',
    fileList2:[],
    postData:{
        remarks:'',
        source:'',
        cc:'',
      },
        proxy_id:undefined,
        defaultActiveKey:'1',
        approvalInfo:{
            name:"",
            desc:'',
            final_result:undefined,
            is_begin_can_edit:false,
            is_process_can_edit:false,
            is_process_can_jump:false,
        },
        dtype:0,
        pic_file:[],
    };
  }

  componentWillMount() {
    const {id,work_flow_id,type} = this.props.location.state;
    const{approvalInfo}=this.state;

    if (id) {
      waitDetail(id, {work_flow_id:work_flow_id,project_id: _util.getStorage('project_id') }).then((res) => {
            this.setState({...res.data});
            if(res.data.info){
              
                approvalInfo.name=res.data.info.template_name;
                approvalInfo.desc=res.data.info.template_desc;
                approvalInfo.final_result=res.data.info.template_final_result;
                approvalInfo.is_begin_can_edit=res.data.info.template_is_begin_can_edit;
                approvalInfo.is_process_can_edit=res.data.info.template_is_process_can_edit;
                approvalInfo.is_process_can_jump=res.data.info.template_is_process_can_jump;
                const form={content:res.data.info.form_content};

                let record=res.data.info.record;
                let pic_file=[];
                
                if(record&&record.length){
                  console.log('0525',record)
                   //转换前端格式
                   var that = this;
                   var cos = _util.getCos(null,GetTemporaryKey);
                   record.map((val,index)=>{
                      const source_list = _util.switchToJson(val.source);
                      if(source_list&&source_list.length){
                        
                        let pic_son=[];
                        source_list.map((obj, index) => {
                            const key = obj.url;
                            cos.getObjectUrl({
                                Bucket: 'ecms-1256637595',
                                Region: 'ap-shanghai',
                                Key:key,
                                Sign: true,
                            }, function (err, data) {
                                if(data && data.Url){
                                    const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};
                                    pic_son.push(file_obj)
                                }
                            });
                        });
                        
                        pic_file[index]=pic_son
                      }else{
                        pic_file[index]=[]
                      }
                    });
                }

                this.setState({approvalInfo:approvalInfo,form,formData:formDataNormalizer(res.data.info.form_data),pic_file:pic_file,});
            }

      });
    }

    this.setState({
        spinLoading: false,
        dtype:type
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/record/wait");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }

  getForm=(data)=>{
      data.data.slice().map(a=>a.value='1');
      const{form,approval}=this.state;

      this.props.history.push({
        pathname: '/workflow/record/approval',
        param:[data,approval]
      });
  };

  generatePDF=()=>{
        const printHtml = this.refs.print.innerHTML;
        const formHtml=`<div style="min-height: 1100px">${printHtml}</div>`;
        // console.log(formHtml);
        const flowHtml= this.refs.flow.innerHTML;
        const allHtml=formHtml+flowHtml;
        const { formatMessage } = this.props.intl;

        const opt = {
            margin:       0.3,
            filename:     '工作流审批单',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', orientation: 'portrait', format: 'a4', },
            // pagebreak:    { mode: ['avoid-all'] }
        };
        html2pdf().set(opt).from(allHtml).toPdf().get('pdf').then(function (pdf) {
          window.open(pdf.output('bloburl'), '_blank')
        });
  };

  genPDF = () => {
        const printHtml = this.refs.print.innerHTML;
        const flowHtml= this.refs.flow.innerHTML;
        const allHtml=printHtml+flowHtml;
        const { formatMessage } = this.props.intl;

        const opt = {
            margin:       0.3,
            // filename:     '施工预约.pdf',
            filename:     '工作流审批单',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', orientation: 'portrait', format: 'a4', },
            // pagebreak:    { mode: ['avoid-all'] }
        }
        html2pdf().set(opt).from(allHtml).save()
        //html2pdf().set(opt).from(flowHtml).save()
    };

  handleTabChange=(key)=>{
    this.setState({defaultActiveKey:key==='1'?'2':'1'})
  };

  handleToApproval=(type)=>{
     this.setState({type:type,subVisible:true})
  };

  submitModal=()=>{
     const{info,id,type,postData,fileList2}=this.state;

     let data={
        project_id:_util.getStorage('project_id'),
        id:info.id,
        remarks:postData.remarks,
        source:JSON.stringify(_util.setSourceList(fileList2)),
        now_id:id,
     };

     const _this = this;
     if(type==='resolve'){
       data.operation=4;
       waitAudit(data).then((res) => {
          if(res){
            message.success('操作成功');
            _this.props.history.goBack();
          }
      });
     }
      if(type==='reject'){
        data.operation=5;
        waitAudit(data).then((res) => {
            if(res){
              message.success('操作成功');
              _this.props.history.goBack();
            }
        })
      };
  };

  hideModal=()=>{
      let postData={
        remarks:'',
        source:'',
        cc:'',
      };
      this.setState({subVisible:false,postData,fileList2:[]})
  };

  orgUpload = (info) => {
    let {fileList} = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;
    if (status === 'done') {
        message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)

    } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
    }

    this.setState({fileList2: fileList})
};

  getUser=(val)=>{
    const{postData}=this.state;
    postData.cc=val.join(',');
    this.setState(postData)
  };

  getUser2=(val)=>{
    this.setState({proxy_id:val})
  };

  handleRemarkChange=(value,field)=>{
    const {postData}=this.state;
    postData[field]=value;
    this.setState(postData)
  };

  printCode=(val)=>{
      if(val){
          if(val.status===4){
              return <div className={styles.waitPStatus}>
                         <p className={styles.waitPWord}>{val.code}</p>
                      </div>
          }else if(val.status===5){
              return <div className={styles.waitDStatus}>
                         <p className={styles.waitPWord}>{val.code}</p>
                      </div>
          }
      }else{
          return null
      }

  };

  setLogoBase64 = (url) => {
    if (!url) {
      return;
    }
    getCosSourse({ file_name: url }).then((res) => {
      if (res && res.data && res.data.data) {
        const logoBase64 = `data:image/png;base64,${res.data.data}`;
        this.setState({
          logoBase64,
        });
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {formatMessage} = this.props.intl;
    const {confirmLoading, spinLoading, location_list, data, typeoption,fileList2,defaultActiveKey,approvalInfo,dtype,pic_file,
      org_type,param_info,form,formData,approval,child_step_id,e_type,info,form_content,record,form_name,subVisible,type,postData,logoBase64} = this.state;

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
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      }
    };

    const bread = [
      {
          name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
          url: '/'
      },
      {
          name: <FormattedMessage id="page.system.workFlow.systemManage" defaultMessage="工作流管理"/>
      },
      {
          name: '待处理工作流',
          url: '/workflow/record/wait'
      },
    ];

    const schema = form.content || null;
    const initialvalues = formData || null;
    const schemaObj = schema ? JSON.parse(schema) : null
    if (!logoBase64 && schemaObj && Object.keys(schemaObj).length > 0) {
      if (schemaObj.logo && schemaObj.logo.url) {
        this.setLogoBase64(schemaObj.logo.url)
      }
    }
    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className='content-wrapper content-no-table-wrapper' style={{position: 'static'}}>
             <Tabs activeKey={defaultActiveKey} onChange={()=>this.handleTabChange(defaultActiveKey)}>
              <TabPane tab="表单" key="1">
                  <div>
                      <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                      ref='print'
                      className={styles.printarea}
                    >
                          {/*{info && info.status === 4 ?*/}
                          {this.printCode(info)}

                          <Skeleton active loading={schema === null}>
                            <FormCreator schema={schema} renderEditor={false} >
                              <FormCreator.Render
                                form={this.props.form}
                                onSubmit={this.handleSubmit}
                                initialvalues={initialvalues}
                              >
                                {
                                  logoBase64 && schemaObj.logo &&info.status!==4? (
                                    <img src={logoBase64} alt={schemaObj.logo.alt || 'logo'} {...schemaObj.logo.props}/>
                                  ): null
                                }

                              </FormCreator.Render>
                            </FormCreator>
                          </Skeleton>
                    </div>
                      <Form.Item
                              wrapperCol={{ span: 24 }}
                              style={{
                                width: "100%",
                                textAlign: "center",
                                marginTop: 30,
                              }}
                            >
                                {
                                  dtype===1?
                                      <div className={styles.noprint} style={{width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', marginBottom: 20}}>
                                            <Button type='primary' style={{marginRight: '10px'}} onClick={this.generatePDF}>生成PDF</Button>
                                            {/*<Button type="primary" style={{marginRight: '10px'}} onClick={this.printPage}>*/}
                                                {/*<FormattedMessage id="component.tablepage.print" defaultMessage="打印" />*/}
                                            {/*</Button>*/}
                                            <Button onClick={() => {this.props.history.goBack()}}>
                                                <FormattedMessage id="component.tablepage.goBack" defaultMessage="返回"/>
                                            </Button>
                                       </div>:
                                      dtype===2?
                                          <div style={{width: "100%", margin: "15px",textAlign:'center'}}>
                                              <Button type='primary' htmlType='submit' loading={confirmLoading}
                                                      style={{marginRight: "10px"}}
                                                      onClick={()=>this.handleToApproval('resolve')}
                                              >
                                                通过
                                              </Button>
                                              <Button type='primary' htmlType='submit' loading={confirmLoading}
                                                      style={{marginRight: "10px"}}
                                                      onClick={()=>this.handleToApproval('reject')}
                                              >
                                                拒绝
                                              </Button>
                                              <GoBackButton props={this.props}/>
                                         </div>:null
                               }
                              {/*<GoBackButton props={this.props} />*/}
                            </Form.Item>
                  </div>               
              </TabPane>

              <TabPane tab="审批流" key="2" forceRender={true}>
                  <div className={styles.printarea} ref='flow'>
                    <h1 className={styles.flowTitle}>审批流配置及审批进程表</h1>
                    <div className={styles.field} >
                         <div className={styles.wrap} id='root'>
                            <span className={styles.title} style={{fontSize:'14px'}}>审批流配置</span>
                            {/*<legend className={styles.legend}>员工信息:</legend>*/}
                            <ApprovalInfo postData={approvalInfo} type={'wait'}/>
                            <ApprovalStep
                              steps={info&&info.step}
                              type={"record"}
                            />
                        </div>
                    </div>

                    {/*审核进程*/}
                    {info&&info.record&&info.record.length>0?
                          <div className={styles.field}>
                          <div className={styles.wrap}>
                              <span className={styles.title} style={{fontSize:'14px'}}>审批流进程</span>
                              <table width="100%" border="0" cellPadding="0" cellSpacing="0" style={{tableLayout: 'fixed'}}>
                                  <tbody>
                                     {info.record.map((item,index)=>{
                                        return (
                                          <div>
                                          <tr key={index} style={{fontSize:'12px',lineHeight:'28px'}}>
                                            <td align="right" style={{width: '6%'}}><FormattedMessage id="page.construction.projectAudit.progress5" defaultMessage="审批人"/>:</td>
                                            <td align="center" style={{width: '8%'}}>{item.operation_name}</td>                                    
                                            <td align="right" style={{width: '8%'}}><FormattedMessage id="app.table.column.operate" defaultMessage="操作"/>:</td>
                                            <td align="center" style={{width: '8%'}}>{_util.flowStatus(item.status)}</td>

                                            <td align="right" style={{ width: "6%" }}>{item.status == 13 ? '委托人:' :''}</td>
                                            <td align="center" style={{ width: "4%" }}>{item.status == 13 ? (item.child_info&&item.child_info.name ? item.child_info.name :'') :''}</td>

                                            <td align="right" style={{ width: "8%" }}>操作时间:</td>
                                            <td align="center" style={{ width: "8%" }}>{item.created_time ?moment(item.created_time).format("YYYY-MM-DD"):''}</td>

                                            
                                            <td align="right" style={{ width: "8%" }}>截止时间:</td>
                                            <td align="center" style={{ width: "8%" }}>{item.dead_day ?item.dead_day : ''}</td>

                                          

                                            <td align="right" style={{width: '8%'}}><FormattedMessage id="page.construction.monitor.remark" defaultMessage="备注"/>:</td>
                                            <td align="center" style={{width: '10%',textOverflow: 'ellipsis',whiteSpace: 'nowrap',overflow: 'hidden'}}><span title={item.remarks?item.remarks:'-'}>{item.remarks}</span></td>
                                            <td align="right" style={{ width: "8%" }}></td>
                                            <td align="center" style={{ width: "15%" }}>
                                                {/* {
                                                    item.source?<Upload className={styles.uploadFlow} listType="picture-card" fileList={pic_file&&pic_file.length&&pic_file[index]} showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}/>
                                                    :'-'
                                                } */}
                                            </td>
                                        </tr>
                                        <tr key={index} style={{fontSize:'12px',lineHeight:'28px'}}>
                                          <td align="right" style={{ width: "6%" }}>附件:</td>
                                          <td align="center" style={{ width: "20%",padding:'0'}}>
                                            <div style={{width:'100%',margin:0}}>
                                              {
                                                item.source?<Upload className={styles.uploadFlow} fileList={pic_file&&pic_file.length&&pic_file[index]} showUploadList={{showRemoveIcon:false,showDownloadIcon:false}} style={{fontSize:'12px'}}/>
                                                :'-'
                                              }
                                            </div>
                                          </td>
                                        </tr>
                                        </div>
                                      )})}
                                  </tbody>
                              </table>
                          </div>
                       </div>:null
                    }
                  </div>
                   {
                      dtype===1?
                          <div style={{width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', marginBottom: 20}}>
                            <Button type='primary' style={{marginRight: '10px'}} onClick={this.generatePDF}>生成PDF</Button>
                            {/*<Button type="primary" style={{marginRight: '10px'}} onClick={this.printPage}>*/}
                                {/*<FormattedMessage id="component.tablepage.print" defaultMessage="打印" />*/}
                            {/*</Button>*/}
                            <Button onClick={() => {this.props.history.goBack()}}>
                                <FormattedMessage id="component.tablepage.goBack" defaultMessage="返回"/>
                            </Button>
                   </div>:
                          dtype===2?
                              <div style={{width: "100%", margin: "15px",textAlign:'center'}}>
                                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                                          style={{marginRight: "10px"}}
                                          onClick={()=>this.handleToApproval('resolve')}
                                  >
                                    通过
                                  </Button>
                                  <Button type='primary' htmlType='submit' loading={confirmLoading}
                                          style={{marginRight: "10px"}}
                                          onClick={()=>this.handleToApproval('reject')}
                                  >
                                    拒绝
                                  </Button>
                                  <GoBackButton props={this.props}/>
                             </div>:null
                  }
              </TabPane>
            </Tabs>
        </div>

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
                            fileList={fileList2}
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
    );
  }
}

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;