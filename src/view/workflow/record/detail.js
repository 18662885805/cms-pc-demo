import React from "react";
import {
  Form,
  Button,
  Modal,
  Spin,
  message,
  Select,
  Input,
  Tabs,
  Skeleton, Upload,
} from "antd";
import { inject, observer } from "mobx-react/index";
import CommonUtil from "@utils/common"; 
import MyBreadcrumb from "@component/bread-crumb";
import FormCreator from "@component/FormCreator";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import GoBackButton from "@component/go-back";
import styles from "../../common.css";
import ApprovalStep from "@component/approvalStep4";
import ApprovalInfo from "@component/approvalInfo2";
import {
  recordAllFlowDetail,
  recordPost,
  recordDetail,
  recordPut,
  recordSub,
} from "@apis/workflow/record";
import _ from "lodash";
import moment from "moment";
import {GetTemporaryKey} from "@apis/account/index"
import html2pdf from "html2pdf.js";
import { getCosSourse } from "@apis/system/cos";

const _util = new CommonUtil();
const { TabPane } = Tabs;
const { confirm } = Modal;

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

@inject("menuState")
@injectIntl
class WorkTypeAddForm extends React.Component {
  state = {
    spinning: true,
    params: {},
    id: null,
    sid: null,
    approval: {},
    form: {},
    tabActived: "1",
    pic_file:[],
    status:null,
    code:undefined,
    logoBase64: null
  };

  constructor(props) {
    super(props);
    let {
      location: { state: params = {} },
    } = this.props;
    if (!params) {
      const paramsInStorage = localStorage.getItem(
        "workflow-record-fill-params"
      );
      if (paramsInStorage) {
        params =
          typeof paramsInStorage === "object"
            ? paramsInStorage
            : JSON.parse(paramsInStorage);
      }
    }
    this.state.params = params;
    console.log("params", params);
    if (params && Object.keys(params).length > 0) {
      recordAllFlowDetail({
        project_id: _util.getStorage("project_id"),
        work_flow_id: params.id,
      }).then((res) => {
        this.setState({
          ...res.data,
        });
      });

      if (params.type !== 1) {
        recordDetail(params.record_id, {
          project_id: _util.getStorage("project_id"),
        }).then((res) => {
          let record=res.data.record;
          let pic_file=[];
          if(record&&record.length){
           //转换前端格式
           var that = this;
           var cos = _util.getCos(null,GetTemporaryKey);
           record.map((val,index)=>{
              const source_list = _util.switchToJson(val.source);
              if(source_list&&source_list.length){
              console.log('0525',source_list)
              // this.setState({file_loading:true});
              let pic_son=[];
              source_list.map((obj, index) => {
                  //pic_file[index]['pic_son'] = []
                  const key = obj.url;
                  var url = cos.getObjectUrl({
                      Bucket: 'ecms-1256637595',
                      Region: 'ap-shanghai',
                      Key:key,
                      Sign: true,
                  }, function (err, data) {
                      if(data && data.Url){
                          const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};
                          // const new_list = [...that.state.pic_file[index]['pic_son'],file_obj];
                          // that.setState({pic_file:new_list});
                         pic_son.push(file_obj)
                      }
                  });
              });
              pic_file[index]=pic_son
           }else{
              pic_file[index]=[]
            }
           });
           console.log(pic_file)
        }
          const form = {
            content: res.data.form_content,
          };

          this.setState({
            id: params.id,
            form,
            pic_file:pic_file,
            sid: res.data.id,
            record: res.data.record,
            formData: formDataNormalizer(res.data.form_data),
            status:res.data.status,
            code:res.data.code,
          });
        });
      }
    }
  }

  componentDidMount() {
    this.setState({
      spinning: false,
    });
    this.props.menuState.changeMenuCurrentUrl("/workflow/record");
    this.props.menuState.changeMenuOpenKeys("/workflow");
  }


  //保存工作流
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, params, approval } = this.state;
    const { id, remarks, type } = params;
    const schema = form.content || {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form_data = _.mapValues(values, (value, key) => {
          if (value) {
            if (key.indexOf("DatePicker_") !== -1) {
              return value.format("YYYY-MM-DD HH:mm:ss");
            }
            if (key.indexOf("Upload_") !== -1) {
              console.log("Upload", value);
              return value.map((file) => {
                return {
                  name: file.name,
                  url: file.url || file.response.file_name,
                  size: file.size,
                  type: file.type,
                };
              });
            }
          }

          return value;
        });
        if (type === 1) {
          const data = {
            project_id: _util.getStorage("project_id"),
            work_flow_id: id,
            form_data: JSON.stringify(form_data),
            remarks,
          };
          recordPost(data).then((res) => {
            if (res) {
              this.setState({ tabActived: "2", sid: res.data.id });
            }
          });
        }
        if (type === 2) {
          const data = {
            project_id: _util.getStorage("project_id"),
            form_data: JSON.stringify(form_data),
            work_flow_id: id,
          };
          recordPut(params.record_id, data).then((res) => {
            if (res) {
              this.setState({ tabActived: "2", sid: res.data.id });
            }
          });
        }
      }
    });
  };

  handleTabActivedChange = (key) => {
    this.setState({
      tabActived: key,
    });
  };

  renderDataName = (list) => {
    if(list&&list.length){
      var nameList = [];
      list.map(item => {
        nameList.push(item.key)
      });
      var nameStr = nameList
      return nameStr
    }else{
      return []
    }
  }

  handleFormSubmit = () => {
    const { sid, approval } = this.state;
    let step_array = this.refs["steps"].state.steps;
    console.log('0519',step_array)
    confirm({
      title: "确认提交?",
      content: "单击确认按钮后，将会提交数据",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        var step_info = [];
        if(step_array&&step_array.length){
          step_array.map((s,sIndex) => {
            var S_obj = {
              id:s.id,
              name:s.name,
              deadline:s.deadline,
              user:this.renderDataName(s.user ? s.user :'')
            }
            step_info.push(S_obj)
          })
        }
        let data = {
          project_id: _util.getStorage("project_id"),
          id: sid,
          remarks: "",
          change: JSON.stringify({
            id: approval.id,
            step: step_info,
          }),
        };
        recordSub(data).then((res) => {
          if (res) {
            message.success("提交成功");
            this.props.history.push("/workflow/record");
          }
        });
      },
    });
  };

  handleShowName=(type)=>{
      let type_name=''
      switch (type) {
        case 1:type_name='新增';
        break;
        case 2:type_name='修改';
        break;
        case 3:type_name='查看';
        break;
        default:type_name=''
      }
      return type_name
  };

  printCode=(val,val1,val2,val3,val4)=>{
      if(val){
          if(val===4){
              return <div style={{position:'relative'}}>
                         {/*方案一：上下排邮戳*/}
                         <div style={{marginBottom:'3px'}}>
                             {/*<img className={styles.waitImg} src={require('../../../assets/stamp-5.png')}/>*/}
                             <div className={styles.waitRectangle}/>
                             <span className={styles.waitSpan}>已通过</span>
                         </div>
                         <p className={styles.waitPWord}>{val1}</p>
                         {
                          val3 && val4 ? (
                            <img src={val3} alt={val4.alt || 'logo'} className={styles.waitLogo}/>
                          ): null
                        }
                      </div>
          }else if(val===5){
              return <div>
                         <div style={{marginBottom:'3px'}}>
                             <div className={styles.waitRectangleReject}/>
                             <span className={styles.waitSpan}>未通过</span>
                         </div>
                         <p className={styles.waitPWord}>{val1}</p>
                         {
                            val3 && val4 ? (
                              <img src={val3} alt={val4.alt || 'logo'} className={styles.waitLogo}/>
                            ): null
                          }
                      </div>
          }
      }
      return <div style={{position:'relative'}}>
        {
          val3 && val4 ? (
            <img src={val3} alt={val4.alt || 'logo'} className={styles.waitLogo}/>
          ): null
        }
      </div>
      
  };

    generatePDF=()=>{
        const printHtml = this.refs.print.innerHTML;
        const formHtml=`<div style="min-height: 1065px">${printHtml}</div>`;
        const flowHtml= this.refs.flow.innerHTML;
        const allHtml=formHtml+flowHtml;
        const { formatMessage } = this.props.intl;

        const opt = {
            margin:       0.3,
            filename:     '我的工作流',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', orientation: 'portrait', format: 'a4', },
        };
        // html2pdf().set(opt).from(allHtml).save()
        html2pdf().set(opt).from(allHtml).toPdf().get('pdf').then(function (pdf) {
          window.open(pdf.output('bloburl'), '_blank')
        });
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
  }

  render() {
    const {
      spinning,
      params,
      form,
      approval,
      sid,
      record,
      tabActived,
      formData,
      pic_file,
      status,
      code,
      logoBase64
    } = this.state;

    console.log('0525',pic_file)

    const { id, type } = params;
    console.log(type);
    const bread = [
      {
        name: (
          <FormattedMessage id="app.page.bread.home" defaultMessage="首页" />
        ),
        url: "/",
      },
      {
        name: (
          <FormattedMessage
            id="page.system.workFlow.systemManage"
            defaultMessage="工作流管理"
          />
        ),
      },
      {
        name: "我的工作流",
        url: "/workflow/record",
      },
      {
        name:this.handleShowName(type)
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
        <div className="content-wrapper content-no-table-wrapper" style={{position: 'static'}}>
          <Spin spinning={spinning}>
            <Tabs activeKey={tabActived} onChange={this.handleTabActivedChange}>
              <TabPane tab="表单" key="1">
                <div
                  style={{
                    width: "100%",
                    // height: "100%",
                    position: "relative",
                  }}
                  ref='print'
                  className={styles.printarea}
                >
                  {this.printCode(status,code,'1',logoBase64,schemaObj&&schemaObj.logo)}

                  <Skeleton active loading={schema === null}>
                    <FormCreator schema={schemaObj} renderEditor={false}>
                      <FormCreator.Render
                        form={this.props.form}
                        onSubmit={this.handleSubmit}
                        initialvalues={initialvalues}
                      >
                        {/* {
                          logoBase64 && schemaObj.logo&&status!==4 ? (
                            <img src={logoBase64} alt={schemaObj.logo.alt || 'logo'} {...schemaObj.logo.props}/>
                          ): null
                        } */}
                        <Form.Item
                          wrapperCol={{ span: 24 }}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            marginTop: 30,
                          }}
                        >
                          {type === 3 ? null : (
                              <div>
                                <Button
                                  htmlType="submit"
                                  type="primary"
                                  style={{ marginRight: 15 }}
                                >
                                  {type === 1 ? "保存" : "修改"}
                                </Button>
                                <GoBackButton props={this.props} />
                              </div>
                          )}
                        </Form.Item>
                      </FormCreator.Render>
                    </FormCreator>
                  </Skeleton>
                </div>

                  {
                    type===3?<div style={{textAlign:'center'}}>
                                <Button type='primary' style={{marginRight: '10px'}} onClick={this.generatePDF}>生成PDF</Button>
                                <GoBackButton props={this.props} />
                            </div>:null
                  }
              </TabPane>

              <TabPane tab="审批流" key="2" forceRender={true}>
                 <div className={styles.printarea} ref='flow' id='flow'>
                   {this.printCode(status,code,'2',logoBase64,schemaObj&&schemaObj.logo)}
                    <h1 className={styles.flowTitle}>审批流配置及审批进程表</h1>
                    <div className={styles.field}>
                      {/*<div className={styles.wrap} style={{border:'none'}}>*/}
                      <div className={styles.wrap} style={{border:'none'}}>
                        <span className={styles.title} style={{fontSize:'14px'}}>审批流配置</span>
                        <ApprovalInfo postData={approval} type={'record'}/>
                        <ApprovalStep
                          steps={approval && approval.step}
                          type={"record"}
                        />
                      </div>
                    </div>

                    {/*审核进程*/}
                    {record && record.length > 0 ? (
                      <div className={styles.field}>
                        {/*<div className={styles.wrap} style={{border:'none'}}>*/}
                        <div className={styles.wrap} style={{border:'none'}}>
                          <span className={styles.title} style={{fontSize:'14px'}}>审批流进程</span>
                          <table
                            width="100%"
                            border="0"
                            cellPadding="0"
                            cellSpacing="0"
                            style={{ tableLayout: "fixed" }}
                          >
                            <tbody>
                              {record.map((item, index) => {
                                return (
                                  <div>
                                  <tr key={index} style={{fontSize:'12px',lineHeight:'28px'}}>
                                    <td align="right" style={{ width: "6%" }}>
                                      <FormattedMessage id="page.construction.projectAudit.progress5" defaultMessage="审批人"/>:
                                    </td>
                                    <td align="center" style={{ width: "8%" }}>{item.operation_name}</td>
                                    <td align="right" style={{ width: "8%" }}><FormattedMessage id="app.table.column.operate" defaultMessage="操作"/>:</td>
                                    <td align="center" style={{ width: "8%" }}>{_util.flowStatus(item.status)}</td>

                                    <td align="right" style={{ width: "6%" }}>{item.status == 13 ? '委托人:' :''}</td>
                                    <td align="center" style={{ width: "4%" }}>{item.status == 13 ? (item.child_info&&item.child_info.name ? item.child_info.name :'') :''}</td>

                                    <td align="right" style={{ width: "8%" }}>操作时间:</td>
                                    <td align="center" style={{ width: "8%" }}>{item.created_time ?moment(item.created_time).format("YYYY-MM-DD"):''}</td>

                                    <td align="right" style={{ width: "8%" }}>截止时间:</td>
                                    <td align="center" style={{ width: "8%" }}>{item.dead_day ?item.dead_day : ''}</td>

                                    <td align="right" style={{ width: "8%" }}>
                                      <FormattedMessage id="page.construction.monitor.remark" defaultMessage="备注"/>:
                                    </td>
                                    <td align="center" style={{width: "10%",textOverflow: "ellipsis",whiteSpace: "nowrap",overflow: "hidden"}}>
                                      <span title={item.remarks}>{item.remarks?item.remarks:'-'}</span>
                                    </td>
                                    <td align="right" style={{ width: "8%" }}></td>
                                    <td align="center" style={{ width: "15%" }}></td>
                                    {/* <td align="right" style={{ width: "8%" }}>附件:</td>
                                    <td align="center" style={{ width: "15%" }}>
                                      {
                                        item.source?<Upload className={styles.uploadFlow} listType="picture-card" fileList={pic_file&&pic_file.length&&pic_file[index]} showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}/>
                                        :'-'
                                      }
                                    </td> */}
                                    
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
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}
                     </div>

                <div style={{ width: "100%", margin: "0 0 20px 42%" }}>
                  {type !== 3 && sid ? (
                    <Button
                      type="primary"
                      style={{ marginRight: "10px" }}
                      onClick={this.handleFormSubmit}
                    >
                      提交
                    </Button>
                  ) : null}
                  {
                    type===3?<Button type='primary' style={{marginRight: '10px'}} onClick={this.generatePDF}>生成PDF</Button>:null
                  }
                  <GoBackButton props={this.props} />
                </div>
              </TabPane>
            </Tabs>
          </Spin>
        </div>
      </div>
    );
  }
}

const WorkTypeAdd = Form.create()(WorkTypeAddForm);

export default WorkTypeAdd;
