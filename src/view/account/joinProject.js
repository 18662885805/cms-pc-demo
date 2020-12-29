import React from 'react'
import {
} from 'antd'
import {
    inject,
    observer
} from 'mobx-react'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import MyBreadcrumb from '@component/bread-crumb'
import GoBackButton from '@component/go-back'



let _util = new CommonUtil()

@inject('menuState') @observer @injectIntl
class JoinProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        
        }
    }

    componentDidMount() {
        
    }



    render() {

        return (
            <div>
                <MyBreadcrumb/>
                <div className="content-wrapper content-no-table-wrapper">
                    <GoBackButton 
                        style={{display: 'block', margin: '0 auto'}} 
                        props={this.props}
                        noConfirm />
                </div>
            </div>
        )
    }
}


export default JoinProject
