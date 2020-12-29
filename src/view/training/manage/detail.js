import React from 'react'
import {
    inject,
    observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {trainDetail} from '@apis/training/manage'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import CardDetail from '@component/CardDetail'
import { List} from 'antd';
import moment from 'moment';

let _util = new CommonUtil()

@inject('menuState') @observer
class InTrainingTrainDetail extends React.Component {

    state = {}

    componentDidMount() {
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            trainDetail(project_id,{id: this.props.location.state.id}).then((res) => {
                this.setState({
                    ...res.data
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
            name,
            created,
            created_time,
            updated,
            updated_time,
            examination_time,
            materials,
            status,
            clearance,
            score,
            length,
            paper_info,
            created_name,
            updated_name,
        } =  this.state;


        const tableData = [
            {
                text: <FormattedMessage id="page.training.myrecord.myrecord_name" defaultMessage="培训名称" />,
                value: _util.getOrNull(name)
            },
            {
                text: <FormattedMessage id="page.training.material.status" defaultMessage="状态" />,
                value: _util.getOrNull(this.renderStatus(status))
            },
            {
                text: <FormattedMessage id="page.training.papers.created" defaultMessage="创建人" />,
                value: _util.getOrNull(created_name)
            },
            {
                text: <FormattedMessage id="page.training.papers.created_time" defaultMessage="创建时间" />,
                value: _util.getOrNull(created_time ? moment(created_time).format('YYYY-MM-DD') : null)
            },
            {
                text: <FormattedMessage id="page.training.papers.updated" defaultMessage="上次修改人" />,
                value: _util.getOrNull(updated_name)
            },
            {
                text: <FormattedMessage id="page.training.papers.updated_time" defaultMessage="上次修改时间" />,
                value: _util.getOrNull(updated_time ? moment(updated_time).format('YYYY-MM-DD') : null)
            }, 
            {
                text: <FormattedMessage id="page.training.exam.duration" defaultMessage="培训时长" />,
                value: _util.getOrNull(examination_time)
            }, 
            {
                text:'题目数量',
                value: _util.getOrNull(length)
            }, 
            {
                text:'每题分数',
                value: _util.getOrNull(score)
            }, 
            {
                text:'合格分数',
                value: _util.getOrNull(clearance)
            },  
            {
                text:'培训试卷',
                value: _util.getOrNull(paper_info&&paper_info.name ? paper_info.name :'')
            },  
            {
                text: <FormattedMessage id="page.training.material.materials" defaultMessage="培训资料" />,
                value: (
                    <List
                        size="small"
                        bordered
                        dataSource={materials}
                        renderItem={item => <List.Item>{item.name}</List.Item>}
                    />
                )
            }, 
        ]

        const bread = [
            {
                name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页"/>,
                url: '/'
            },
            {
                name: <FormattedMessage id="menu.training" defaultMessage="培训管理"/>
            },
            {
                name:'培训配置',
                url: '/training/management'
            },
            {
                name: <FormattedMessage id="page.component.breadcrumb.detail" defaultMessage="详情"/>,
            },
          ]

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper content-no-table-wrapper">
                    <CardDetail title={<FormattedMessage id="app.page.detail" defaultMessage="详情" />} data={tableData} />
                    <GoBackButton 
                        style={{display: 'block', margin: '0 auto'}} 
                        props={this.props}
                        noConfirm />
                </div>
            </div>
        )
    }
}

export default InTrainingTrainDetail