import React, { Component } from "react";
import {
  Radio, Checkbox, Tag, Button, Icon, Upload
} from "antd";
import CardDetail from "../CardDetail";
import styles from "../../view/common.css";
import {FormattedMessage} from "react-intl";
import CommonUtil from "@utils/common";
import {GetTemporaryKey} from "@apis/account/index"
const _util = new CommonUtil();

class pdfFormFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList:[]
    }
  }

  valueToFileList=(source)=>{
      console.log(source);
			if (source) {
			   //转换前端格式
			   var that = this;
			   var cos = _util.getCos(null,GetTemporaryKey);
			   const source_list = source;
			   if(source_list&&source_list.length){
				   source_list.map((obj, index) => {
					   const key = obj.url;
					   var url = cos.getObjectUrl({
						   Bucket: 'ecms-1256637595',
						   Region: 'ap-shanghai',
						   Key:key,
						   Sign: true,
					   }, function (err, data) {
					   	   console.log(data);
						   if(data && data.Url){
							   const file_obj =  {thumbUrl:data.Url,url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};
							   const new_list = [...that.state.fileList,file_obj];
							   return new_list
                               //that.setState({fileList:new_list});
						   }
					   });
				   });
			   }
			}else{
				return []
		    }
	};

  render () {
    const { content } = this.props;
    const{fileList}=this.state;

    const props2 = {
      multiple: true,
      accept: "image/*",
      action: _util.getServerUrl(`/upload/auth/`),
      headers: {
          Authorization: 'JWT ' + _util.getStorage('token')
      },
    };

    return (
        <div>
           <table width="100%" border="0" cellPadding="0" cellSpacing="0">
                <tbody>
                {content&&content.map((content_item,index)=>{
                  switch (content_item.type) {
                    case 'grid':return <tr>
                          {content_item&&content_item.columns&&content_item.columns.map((item,i)=>{
                              console.log(item);
                            return item.list&&item.list[0]?
                              <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                              <span>{item.list[0].label}</span>:
                              <span>{item.list[0].type==='upload'?'':item.list[0].value}</span>
                              </td>:null
                              })}
                        </tr>
                    break;
                    case 'radio':return <tr>
                            <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                              <span>{content_item.label}</span>
                              <span>
                                 <Radio.Group value={content_item.value}>
                                   {content_item.options.map((option,index)=>{
                                     return <Radio value={option.value}>{option.label}</Radio>
                                   })}
                                  </Radio.Group>
                              </span>
                            </td>
                        </tr>;
                    break;
                    case 'checkboxGroup':return <tr>
                      <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                              <span>{content_item.label}</span>
                              <span>
                                 <Checkbox.Group options={content_item.options} defaultValue={content_item.value}/>
                              </span>
                            </td>
                    </tr>;
                    break;
                    case 'tag':return <tr>
                      <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                          <span>{content_item.label}</span>
                          <span>
                             <Tag color={content_item.tag_color}>{content_item.tag_name}</Tag>
                          </span>
                        </td>
                    </tr>;
                    break;
                    case 'upload':return <tr>
                      <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                          <span>{content_item.label}</span>
                          <span>
                             <Upload
                                  {...props2}
                                  fileList={this.valueToFileList(content_item.value)}
                                  // fileList={item.fileList}
                                  // beforeUpload={_util.beforeUpload}
                                  // onChange={(info)=>this.orgUpload(info,fieldName,index)}
                                  // accept='image/*'
                              />
                          </span>
                        </td>
                    </tr>;
                    break;
                    case 'typography':return <tr>
                            <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                              <span>{content_item.title_name}</span>
                              <span/>
                            </td>
                        </tr>;
                    break;
                    // default:return <tr>
                    //         <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                    //           <span>{content_item.label}</span>:
                    //           <span>{content_item.value}</span>
                    //         </td>
                    //     </tr>;
                    // break;
                  }
                    // return content_item.type==='grid'?
                    //     <tr>
                    //       {content_item.columns.map((item,i)=>{
                    //         return <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                    //           <span>{item.list[0].label}</span>:
                    //           <span>{item.list[0].value}</span>
                    //           </td>
                    //           })}
                    //     </tr>
                    //     :
                    //      <tr>
                    //         <td align="left" className={styles.flowColumn} style={{ paddingRight: '25px' }}>
                    //           <span>{content_item.label}</span>:
                    //           <span>{content_item.value}</span>
                    //         </td>
                    //     </tr>
                })}
                </tbody>
            </table>
        </div>
    )
  }
}

export default pdfFormFlow;