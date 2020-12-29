import React from 'react'
import {Upload} from 'antd'
import {
    inject,
    observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {materialsDetail} from '@apis/training/material'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import CardDetail from '@component/CardDetail'
import moment from 'moment'
import {GetTemporaryKey} from "@apis/account/index"

let _util = new CommonUtil()

@inject('menuState') @observer
class InTrainingMaterialDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
        }
    }

    componentDidMount() {
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            materialsDetail(project_id,{id: this.props.location.state.id}).then((res) => {
                const results = res.data;
                if(results.source){
                    //转换前端格式
                    var that = this;
                    var cos = _util.getCos(null,GetTemporaryKey);
                    const source_list = JSON.parse(results.source);
                    if(source_list&&source_list.length){
                        this.setState({file_loading:true})
                        source_list.map((obj, index) => {
                            const key = obj.url;
                            var url = cos.getObjectUrl({
                                Bucket: 'ecms-1256637595',
                                Region: 'ap-shanghai',
                                Key:key,
                                Sign: true,
                            }, function (err, data) {
                                if(data && data.Url){    
                                    const file_obj =  {url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};             
                                    const new_list = [...that.state.fileList,file_obj];
                                    that.setState({fileList:new_list});
                                    if(index == source_list.length - 1){
                                        that.setState({file_loading:false});
                                    }
                                }
                            });
                        });
                    }            
                  }    

                this.setState({
                    ...results,
                })
            })
        }
    }

    renderStatus = (value) => {
        if(value){
            if(_util.getStorage('langs') === 'en'){
                return 'Active';
            }else{
                return '激活';
            }     
        }else{
            if(_util.getStorage('langs') === 'en'){
                return 'Disabled';
            }else{
                return '禁用';
            }
        }
    }

    
    render() {
        const {
            name, desc, paper, created, created_time, status, source, fileList, updated, updated_time
        } = this.state;




        const tableData = [
            {
                text: <FormattedMessage id="page.training.material.material_name" defaultMessage="资料名称" />,
                value: _util.getOrNull(name)
            },
            {
                text: <FormattedMessage id="page.training.material.material_desc" defaultMessage="资料描述" />,
                value: _util.getOrNull(desc)
            },
            {
                text: <FormattedMessage id="page.training.material.created" defaultMessage="创建者" />,
                value: _util.getOrNull(created)
            },
            {
                text: <FormattedMessage id="page.training.material.created_time" defaultMessage="创建时间" />,
                value: _util.getOrNull(created_time ? moment(created_time).format('YYYY-MM-DD') : null)
            },
            {
                text: <FormattedMessage id="page.training.material.updated" defaultMessage="上次修改人" />,
                value: _util.getOrNull(updated)
            },
            {
                text: <FormattedMessage id="page.training.material.updated_time" defaultMessage="修改日期" />,
                value: _util.getOrNull(updated_time ? moment(updated_time).format('YYYY-MM-DD') : null)
            },
            {
                text: <FormattedMessage id="page.training.material.status" defaultMessage="状态" />,
                value: _util.getOrNull(this.renderStatus(status))
            },
            {
                text: <FormattedMessage id="page.training.material.file" defaultMessage="附件" />,
                value: source ?
                    <div className="clearfix">
                        <Upload
                            fileList={fileList}
                            showUploadList={{showRemoveIcon:false,showDownloadIcon:false}}
                        >
                        </Upload>
                    </div>
                :
                <FormattedMessage id="app.page.content.none" defaultMessage="无" />
            },
            
        ]

        return (
            <div>
                <MyBreadcrumb/>
                <div className="content-wrapper content-no-table-wrapper">
                    <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情" />} data={tableData}  />
                    <GoBackButton 
                        style={{display: 'block', margin: '0 auto'}} 
                        props={this.props}
                        noConfirm />
                </div>
            </div>
        )
    }
}

export default InTrainingMaterialDetail
