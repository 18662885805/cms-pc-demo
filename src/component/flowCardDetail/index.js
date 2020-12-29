import React, { Component } from "react";
import {
  Card, Spin, Collapse, Timeline, Upload
} from "antd";
import FormCreator from "@component/FormCreator";
import styles from './index.css'
import CommonUtil from "@utils/common";
import {GetTemporaryKey} from "@apis/account/index"
const { Panel } = Collapse;
let _util = new CommonUtil();

const formDataNormalizer = (formData) => {
  if (!formData) {
    return null;
  }
  let formDataObject = formData;
  if (typeof formData === "string") {
    formDataObject = JSON.parse(formData);
  }
  if (Object.keys(formDataObject).length === 0) {
    return null;
  }
  return formDataObject
};

class flowCardDetail extends Component {

  render () {
    const { leftWidth, rightWidth } = this.props;

    const tableElement = <table style={{ width: "100%" }}>
      <tbody style={{ borderBottom: "1px solid #dee2e6" }}>
        {
          this.props.data.map((t, tIndex) => {
            console.log('t', t);
            return (
              t.text==='表单内容'?
                <tr key={tIndex}>
                      <td style={{
                        borderTop: "1px solid #dee2e6",
                        padding: "8px",
                        width:"20%",
                        color: "#333"
                      }}>{t.text}</td>
                      <td
                          className={styles.flowCollapse}
                          style={{
                        borderTop: "1px solid #dee2e6",
                        padding: "8px",
                        color: "#333",
                        width: "80%",
                        wordBreak: "break-all"
                      }}>
                        <Collapse
                          bordered={false}
                          defaultActiveKey={[]}
                          //expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        >
                          <Panel forceRender={true} header={'点开查看详情'} key="1" style={{borderRadius:'2px',border: 0,overflow:'hidden', position:'relative'}}>
                             {/* <FormBuilder
                                developer={true}
                                design={true}
                                data={{"data":JSON.parse(t.value).data,'submitUrl':'','config':JSON.parse(t.value).config?JSON.parse(t.value).config:{labelWidth:4,labelPosition:'right'}}}
                                // dataInfo={form&&form.content&&JSON.parse(form.content)}
                                type={3}
                                getForm={this.getForm}
                              /> */}

                              <FormCreator schema={t.value.form_content} renderEditor={false}>
                                <FormCreator.Render initialvalues={formDataNormalizer(t.value.form_data || null)}></FormCreator.Render>
                              </FormCreator>
                          </Panel>
                        </Collapse>
                      </td>
                    </tr>:
              t.text==='审批进度'?
                <tr style={{ background: "#fafafa" }}>
                      <td style={{
                        borderTop: "1px solid #dee2e6",
                        padding: "8px",
                        width: "20%",
                        color: "#333"
                      }}>{t.text}</td>
                      <td style={{
                        borderTop: "1px solid #dee2e6",
                        padding: "8px",
                        color: "#333",
                        width: "80%",
                        wordBreak: "break-all"
                      }}>
                        <Timeline className={styles.flowTime} style={{margin: '5px auto -25px'}}>
                          {t.value&&t.value.length>0&&t.value.map((value, index) => {
                                  console.log(value);
                                  return (
                                      <Timeline.Item
                                          key={index} >
                                          <div>
                                            {value.operation_company} {value.operation_name} {value.operation_phone}
                                          &emsp;&emsp;
                                          {_util.flowStatus(value.status)}
                                          </div>
                                          <div>{value.operation_time ? value.operation_time : ''}</div>
                                          {value.remarks ? <div>{value.remarks}</div> : null}
                                          {value.source?<Upload fileList={value.fileList} showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}/>:null}
                                      </Timeline.Item>
                                  )
                              })
                          }
                       </Timeline>
                      </td>
                    </tr>
               : <tr style={tIndex % 2 === 0 ? { background: "#fafafa" } : null} key={tIndex}>
                <td style={{
                  borderTop: "1px solid #dee2e6",
                  padding: "8px",
                  width: leftWidth || "25%",
                  color: "#333"
                }}>{t.text}</td>
                <td style={{
                  borderTop: "1px solid #dee2e6",
                  padding: "8px",
                  color: "#333",
                  width: rightWidth || "75%",
                  wordBreak: "break-all"
                }}>{t.value}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>;

    return (
      this.props.noCard
        ? tableElement
        : <Card
          title={this.props.title}
          style={{ width: "80%", margin: "0 auto 10px" }}>
          {tableElement}
          {this.props.children}
        </Card>
    );
  }
}

export default flowCardDetail;
