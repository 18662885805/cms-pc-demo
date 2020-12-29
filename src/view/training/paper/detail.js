import React from 'react'
import {Radio} from 'antd'
import {
    inject,
    observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {papersDetail} from '@apis/training/paper'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import CardDetail from '@component/CardDetail'
import moment from "moment";

let _util = new CommonUtil()

@inject('menuState') @observer
class InTrainingPaperDetail extends React.Component {

    state = {}

    componentDidMount() {
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            papersDetail(project_id,{id: this.props.location.state.id}).then((res) => {
                this.setState({
                    ...res.data
                })
            })
        }
    }

    
    render() {
        const {
            name,
            created,
            created_time,
            updated,
            updated_time,
            subject,
        } =  this.state

        const tableData = [
            {
                text: <FormattedMessage id="page.training.papers.paper_name" defaultMessage="试卷名" />,
                value: _util.getOrNull(name)
            },
            {
                text: <FormattedMessage id="page.training.papers.created" defaultMessage="创建人" />,
                value: _util.getOrNull(created)
            },
            {
                text: <FormattedMessage id="page.training.papers.created_time" defaultMessage="创建时间" />,
                value: created_time ? moment(created_time).format("YYYY-MM-DD HH:mm:ss") : _util.getOrNull(created_time)
            },
            {
                text: <FormattedMessage id="page.training.papers.updated" defaultMessage="上次修改人" />,
                value: _util.getOrNull(updated)
            },
            {
                text: <FormattedMessage id="page.training.papers.updated_time" defaultMessage="上次修改时间" />,
                value: updated_time ? moment(updated_time).format("YYYY-MM-DD HH:mm:ss") : _util.getOrNull(updated_time)
            },
            {
                text: <FormattedMessage id="page.training.papers.subject" defaultMessage="题目" />,
                value:Array.isArray(subject)
                    ?
                    subject.map((s, sIndex) => {
                        return (
                            <div key={sIndex} style={{
                                marginTop: sIndex === 0 ? 0 : '20px',
                                borderLeft: '3px solid #eee',
                                paddingLeft: '10px'
                            }}>
                                <div style={{marginBottom: '5px'}}>{`Q${sIndex + 1}`}:&emsp;{s.title}</div>
                                {
                                    Array.isArray(s.content)
                                    ?
                                    s.content.map((c, cIndex) => {
                                        return (
                                            <div key={cIndex} style={{
                                                marginBottom: '5px',
                                                paddingLeft: '20px'
                                            }}>
                                                <Radio disabled={true} checked={c.status == 1 ? true : false} />{c.title}
                                            </div>
                                        )
                                    })
                                    :
                                    null
                                }     
                            </div>
                        )
                    })
                    :
                    <FormattedMessage id="app.page.content.none" defaultMessage="无" />
            },
            
        ]

        return (
            <div>
                <MyBreadcrumb/>
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

export default InTrainingPaperDetail
