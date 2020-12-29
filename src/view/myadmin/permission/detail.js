import React from 'react'
import {Col, Row, Form, Card} from 'antd'
import {inject, observer} from "mobx-react/index"

import MyBreadcrumb from '@component/bread-crumb'
import {permissionDetail} from "@apis/system/permission"
import GoBackButton from '@component/go-back'
import CardDetail from '@component/CardDetail'
import CommonUtil from '@utils/common'
import styles from '@view/common.css';
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
const FormItem = Form.Item

let _util = new CommonUtil()

@inject('menuState') @observer
class PermissionDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            menu: '',
            url: '',
            action: ''
        }
    }

    componentDidMount() {
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            permissionDetail(this.props.location.state.id).then((res) => {
                this.setState({
                    ...res.data.results
                })
                this.props.menuState.changeMenuCurrentUrl('/system/permission')
                this.props.menuState.changeMenuOpenKeys('/system')
            })
        }
    }

    render() {
        const {name, menu, url, action} = this.state
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
                md: {span: 10},
            },
        };

        const tableData = [
            {
                text: <FormattedMessage id="page.system.accessType.permissionName" defaultMessage="权限名称"/>,
                value: _util.getOrNull(name)
            },
            {
                text: <FormattedMessage id="page.system.accessType.menuName" defaultMessage="菜单名称"/>,
                value: _util.getOrNull(menu)
            },
            {
                text: <FormattedMessage id="page.system.accessType.url" defaultMessage="接口地址"/>,
                value: _util.getOrNull(url)
            },
            {
                text: <FormattedMessage id="page.system.accessType.action" defaultMessage="请求方式"/>,
                value: _util.getOrNull(action)
            }
        ]

        return (
            <div>
                <div className="content-wrapper content-no-table-wrapper">

                    <CardDetail title={<FormattedMessage id="page.system.accessType.permissionDetail" defaultMessage="权限详情"/>} data={tableData}  />

                    <GoBackButton
                        style={{display: 'block', margin: '0 auto'}}
                        props={this.props}
                        noConfirm/>
                </div>
            </div>
        )
    }
}

export default injectIntl(PermissionDetail)
