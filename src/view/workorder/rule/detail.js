import React from 'react'
import {inject, observer} from "mobx-react/index"
import MyBreadcrumb from '@component/bread-crumb'
import {ruleDetail} from "@apis/workorder/rule"
import GoBackButton from '@component/go-back'
import CommonUtil from '@utils/common'
import CardDetail from '@component/CardDetail'
import { FormattedMessage, injectIntl, defineMessages, intlShape } from 'react-intl'
import messages from '@utils/formatMsg'
import {Tag} from "antd";

let _util = new CommonUtil()

@inject('menuState') @observer
class OrderTypeDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            ruleDetail(this.props.location.state.id,{project_id:_util.getStorage("project_id")}).then((res) => {
                console.log(res);
                let data = res.data;
                this.setState({
                    ...data
                })
                this.props.menuState.changeMenuCurrentUrl('/assignment/rule')
                this.props.menuState.changeMenuOpenKeys('/assignment')
            })
        }
    }

    render() {
        const {
            desc,
            created,
            created_time,
            updated,
            updated_time,
            rules,
            users,
            org_name
        } = this.state;

        const {formatMessage} = this.props.intl;

        const tableData = [
            {
                text:'组织',
                value: _util.getOrNull(org_name)
            },
            {
                text:'执行人',
                value:  users instanceof Array && users.length
                ?users.map((person,pIndex)=>{
                                return (<p style={{margin:'0'}} key={pIndex}>
                                    <span style={{
                                        // float: "left",
                                        lineHeight: "22px",
                                        fontSize: "12px",
                                        // padding: "0 7px",
                                        margin: "0 8px 0 0"
                                    }}>组织:&nbsp;{_util.getOrNull(person.org)}
                                    </span>

                                    <span style={{
                                        // float: "left",
                                        lineHeight: "22px",
                                        fontSize: "12px",
                                        // padding: "0 7px",
                                        margin: "0 8px 0 0"
                                    }}><FormattedMessage id="page.construction.projectAudit.staffInfo1" defaultMessage= '姓名'/>:&nbsp;{_util.getOrNull(person.name)}
                                    </span>

                                    <span style={{
                                        // float: "left",
                                        lineHeight: "22px",
                                        fontSize: "12px",
                                        padding: "0 7px",
                                        margin: "0 8px 0 0"
                                    }}>电话:&nbsp;{_util.getOrNull(person.phone)}
                                    </span>
                                </p>)
                            }
                )
                :'-'
            },
            {
                text:'规则',
                value: rules instanceof Array && rules.length
                ?
                            rules.map((value, index) => {
                                console.log(value);
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            marginTop: index === 0 ? '0' : '20px',
                                            borderLeft: '3px solid rgb(232,232,232)',
                                            paddingLeft: '10px',
                                            fontSize: "12px",
                                        }}>
                                        <p style={{margin:'0'}}>{value.name}&nbsp;&nbsp;&nbsp;&nbsp;间隔时间:{value.interval}天</p>
                                        {value.person_info && eval('(' + value.person_info + ')').map((person,pIndex)=>{
                                            return (<p style={{margin:'0'}} key={pIndex}>
                                                <span style={{
                                                    // float: "left",
                                                    lineHeight: "22px",
                                                    fontSize: "12px",
                                                    // padding: "0 7px",
                                                    margin: "0 8px 0 0"
                                                }}>提醒人姓名:&nbsp;{_util.getOrNull(person.person_name)}
                                                </span>

                                                <span style={{
                                                    // float: "left",
                                                    lineHeight: "22px",
                                                    fontSize: "12px",
                                                    padding: "0 7px",
                                                    margin: "0 8px 0 0"
                                                }}>联系电话:&nbsp;{_util.getOrNull(person.person_phone)}
                                                </span>
                                            </p>)
                                        }
                                        )}
                                    </div>
                                )
                            })

                :'-'
            },

            {
                text: <FormattedMessage id="page.construction.contractor.createDate" defaultMessage="创建日期"/>,
                value: _util.getOrNull(created_time)
            },
            // {
            //     text:<FormattedMessage id="page.construction.contractor.lastReviser" defaultMessage="上次修改人"/>,
            //     value: _util.getOrNull(updated)
            // },
            {
                text:<FormattedMessage id="page.construction.contractor.lastReviseDate" defaultMessage="上次修改时间"/>,
                value: _util.getOrNull(updated_time)
            },
        ];

         const bread = [
          {
            name: formatMessage({
              id: "menu.homepage",
              defaultMessage: "首页"
            }),
            url: "/"
          },
          {
            name: formatMessage({
              id: "page.system.task.systemManage",
              defaultMessage: "任务管理"
            })
          },
          {
            name:'执行规则',
            url: "/assignment/rule"
          }
        ];

        return (
            <div>
                <MyBreadcrumb bread={bread}/>
                <div className="content-wrapper content-no-table-wrapper">
                    <CardDetail title={<FormattedMessage id="page.order.myOrder.detail" defaultMessage="详情"/>} data={tableData}  />
                    <GoBackButton 
                        style={{display: 'block', margin: '0 auto'}} 
                        props={this.props}
                        noConfirm />
                </div>
            </div>
        )
    }
}

export default injectIntl(OrderTypeDetail)
