import React from 'react'
import {
    inject,
    observer
} from 'mobx-react'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {trainRecordDetail} from  '@apis/training/record'
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import CardDetail from '@component/CardDetail'
import moment from 'moment'

let _util = new CommonUtil()

@inject('menuState') @observer
class TrainingMyRecordDetail extends React.Component {

    state = {}

    componentDidMount() {
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            trainRecordDetail(project_id,{id: this.props.location.state.id}).then((res) => {
                this.setState({
                    ...res.data.results
                })
            })
        }
    }

    
    render() {
        const {
            training,
            department,
            pers_no,
            real_name,
            score,
            created_time
        } = this.state;
        const name = training ? training.name : null;
        const certificate_expire_time = training ? training.certificate_expire_time : null;
        const clearance = training ? training.clearance : null;


        const tableData = [
            {
                text: <FormattedMessage id="page.training.myrecord.myrecord_name" defaultMessage="培训名称" />,
                value: _util.getOrNull(name)
            },
            {
                text: <FormattedMessage id="page.training.myrecord.pers_no" defaultMessage="工号" />,
                value: _util.getOrNull(pers_no)
            },
            {
                text: <FormattedMessage id="page.training.myrecord.real_name" defaultMessage="姓名" />,
                value: _util.getOrNull(real_name)
            },
            {
                text: <FormattedMessage id="page.training.myrecord.department" defaultMessage="部门" />,
                value: _util.getOrNull(department)
            },
            {
                text: <FormattedMessage id="page.training.myrecord.score" defaultMessage="分数" />,
                value: score
            },
            {
                text: <FormattedMessage id="page.training.material.status" defaultMessage="状态" />,
                value: (score >= clearance) ? <FormattedMessage id="page.training.pass" defaultMessage="通过"/> : <FormattedMessage id="page.training.no_pass" defaultMessage="未通过"/>
            },
            {
                text: <FormattedMessage id="page.training.myrecord.join_time" defaultMessage="培训时间" />,
                value: _util.getOrNull(created_time ? moment(created_time).format('YYYY-MM-DD') : null)
            },
            {
                text: <FormattedMessage id="page.training.train.certificate_expire_time" defaultMessage="证书有效期" />,
                value: _util.getOrNull(certificate_expire_time)
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

export default TrainingMyRecordDetail
