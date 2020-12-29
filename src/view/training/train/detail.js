import React from 'react'
import {
    inject,
    observer
} from 'mobx-react'
import { Popconfirm, message,Tag,Tooltip } from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {trainstartDetail} from '@apis/training/start'
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
            trainstartDetail(project_id,{id: this.props.location.state.id}).then((res) => {
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
            training,
            created_name,
            updated_name,
            is_access_card,
            users
        } =  this.state;


        const tableData = [
            {
                text: <FormattedMessage id="page.training.myrecord.myrecord_name" defaultMessage="培训名称" />,
                value: _util.getOrNull(training&&training[0]['name'])
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
                text:'门禁关联',
                value: <Tag color={is_access_card ? '#ffa500' : '#008000'}>
                            {is_access_card ? '关联' : '不关联'}
                        </Tag>
            },  

            {
                text: <FormattedMessage id="page.training.papers.created" defaultMessage="创建人" />,
                value: _util.getOrNull(created_name)
            },

            {
                text: <FormattedMessage id="page.training.papers.updated" defaultMessage="上次修改人" />,
                value: _util.getOrNull(updated_name)
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
            {
                text: '培训人员',
                value: (
                    <List
                        size="small"
                        bordered
                        dataSource={users}
                        renderItem={item => <List.Item>{item.name}-{item.phone}</List.Item>}
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
                name: '培训启动',
                url: '/training/start/training'
            },
            {
              name: <FormattedMessage id="page.component.breadcrumb.detail" defaultMessage="详情"/>
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