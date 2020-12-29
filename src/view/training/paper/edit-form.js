import React from 'react'
import {Modal,Form, message, Icon, Button, Row, Col, Input, Radio} from 'antd'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import MyBreadcrumb from '@component/bread-crumb'
import {papersDetail, papersPut} from '@apis/training/paper'
import GoBackButton from '@component/go-back'
import CommonUtil from "@utils/common";

const _util = new CommonUtil();
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm

const messages = defineMessages({
  paper_name: {
    id: 'app.papers.check.paper_name',
    defaultMessage: '请填写试卷名称!',
  },
  subject: {
    id: 'app.papers.check.subject',
    defaultMessage: '请添加试卷题目!',
  },
  subject_name: {
    id: 'app.papers.check.subject_name',
    defaultMessage: '请填写题目名称!',
  },
  options: {
    id: 'app.papers.check.options',
    defaultMessage: '请添加题目选项!',
  },
  is_true: {
    id: 'app.papers.check.is_true',
    defaultMessage: '请设置一项正确选项!',
  },
  content: {
    id: 'app.papers.check.content',
    defaultMessage: '请填写选项内容!',
  },
  added: {
    id: 'app.message.papers.added',
    defaultMessage: '添加成功',
  },
  modified: {
    id: 'app.message.papers.modified',
    defaultMessage: '修改成功',
  },
  input_title: {
    id: 'app.placeholder.papers.input_title',
    defaultMessage: '请在此输入试卷标题',
  },
  edit_title: {
    id: 'app.placeholder.papers.edit_title',
    defaultMessage: '请编辑题目标题',
  },
  edit_option: {
    id: 'app.placeholder.papers.edit_option',
    defaultMessage: '请编辑选项',
  },
});

@injectIntl
class PapersAddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            survey: {
                name: '',
                subject: []
            },
        }
    }

    componentDidMount() {
        const project_id = _util.getStorage('project_id');
        if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
            this.props.history.replace('/404')
        } else {
            papersDetail(project_id,{id: this.props.location.state.id}).then((res) => {
                const {survey} = this.state
                survey.name = res.data.name
                survey.subject = res.data.subject
                this.setState({
                    survey,
                })
            })
            
        }
    }

    handleSubmit() {
        const {survey} = this.state;
        console.log(survey)
        const { formatMessage } = this.props.intl;
        const project_id = _util.getStorage('project_id');
        if (!survey.name) {
            message.error(formatMessage(messages.paper_name))      //请填写试卷名称!
            return
        }

        if (survey.subject.length <= 0) {
            message.error(formatMessage(messages.subject))       //请添加试卷题目!
        } else {
            const { subject } = survey

            for (let i = 0, len = subject.length; i < len; i++) {
                if (!subject[i].title) {
                    message.error(formatMessage(messages.subject_name))     //请填写题目名称!
                    return
                }

                if (subject[i].content.length <= 0) {
                    message.error(formatMessage(messages.options))         //请添加题目选项!
                } else {
                    const { content } = subject[i]

                    if (!content.some(c => c.status)) {
                        message.error(formatMessage(messages.is_true))       //请设置一项正确选项!
                        return
                    }

                    for (let j = 0, l = content.length; j < l; j++) {
                        if (!content[j].title) {
                            message.error(formatMessage(messages.content))           //请填写选项内容!
                            return
                        }
                    }
                }
            }
            var that = this;
            confirm({
                title: '确认提交?',
                content: '单击确认按钮后，将会提交数据',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    papersPut(project_id,{
                        id: that.props.location.state.id, 
                        name: survey.name,
                        subject: JSON.stringify(survey.subject),
                    }).then(res => {
                        that.setState({
                            loading: true
                        })
                        that.props.history.goBack()
                    })
                },
                onCancel() {
                },
            })

            
        }

        
    }

    handlePaperName = e => {
        const {survey} = this.state
        survey.name = e.target.value
        this.setState({
            survey
        })
    }

    addQuestion = () => {
        const {survey} = this.state
        const { formatMessage } = this.props.intl
        if (survey.name === '') {
            message.error(formatMessage(messages.paper_name))       //请填写试卷名称
            return
        }
        survey.subject.push({
            title: '',
            content: []
        })
        this.setState({
            survey
        })
    }

    deleteQuestion(index) {
        const {survey} = this.state;

        survey.subject.splice(index, 1)

        this.setState({
            survey
        })
    }

    addChoice(index) {
        const {survey} = this.state

        survey.subject[index].content.push({
            title: '',
            status: 2
        })
        this.setState({
            survey
        })
    }

    deleteChoice(index, idx) {
        const {survey} = this.state

        survey.subject[index].content.splice(idx, 1)

        this.setState({
            survey
        })
    }

    handleRadio = (e, index) => {
        const { survey } = this.state

        survey.subject[index].content.forEach(c => c.status = 2)
        survey.subject[index].content[e.target.value].status = 1
        
        this.setState({
            survey
        })
    }

    hanldeQuestion = (e, index) => {
        const { survey } = this.state

        survey.subject[index].title = e.target.value

        this.setState({
            survey
        })
    }

    handleChoice = (e, index, idx) => {
        const { survey } = this.state

        survey.subject[index].content[idx].title = e.target.value

        this.setState({
            survey
        })
    }

    render() {
        const {
            survey
        } = this.state
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };

        return (
            <div>
                <MyBreadcrumb/>
                <div className="content-wrapper content-no-table-wrapper">
                        <Form>
                            <div >
                                <FormItem label={<FormattedMessage id="page.training.papers.paper_title" defaultMessage="试卷标题" />}
                                    {...formItemLayout}
                                    required>
                                    <Input
                                        placeholder={formatMessage(messages.input_title)}    //请在此输入试卷标题
                                        onChange={e => this.handlePaperName(e)}
                                        value={survey.name} />
                                </FormItem>
                            </div>

                            <div >

                                {
                                    survey.subject.map((q, qIndex) => {
                                        return (
                                            <div 
                                                key={qIndex} 
                                                style={{
                                                    margin: '0 auto 10px',
                                                    padding: '10px',
                                                    overflow: 'hidden',
                                                    boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                                                    width: '60%',
                                                    position: 'relative'
                                                }}
                                                 >
                                                <FormItem
                                                    label={`Q${qIndex + 1}`}
                                                    {...formItemLayout}
                                                    required
                                                >
                                                    <Input 
                                                        placeholder={formatMessage(messages.edit_title)}     //请编辑题目标题
                                                        onChange={e => this.hanldeQuestion(e, qIndex)}
                                                        value={survey.subject[qIndex].title} />
                                                    <FormItem style={{marginBottom: 0}}>

                                                            <RadioGroup 
                                                                onChange={e => this.handleRadio(e, qIndex)}
                                                                style={{width: '100%'}}
                                                                value={
                                                                    '' + survey.subject[qIndex].content.map(con => con.status).indexOf(1)
                                                                }>
                                                                {
                                                                    q.content.map((c, cIndex) => {
                                                                        return (
                                                                            <FormItem
                                                                                key={cIndex}
                                                                                label={c.label}
                                                                                
                                                                            >

                                                                                <Row gutter={5}>
                                                                                    <Col span={3} >
                                                                                     
                                                                                        <Radio 
                                                                                               value={`${cIndex}`}></Radio>

                                                                                    </Col>
                                                                                    <Col span={13}>
                                                                                        <FormItem
                                                                                            key={cIndex}
                                                                                            required
                                                                                        >
                                                                                            <Input
                                                                                                placeholder={formatMessage(messages.edit_option)}   //请编辑选项
                                                                                                onChange={e => this.handleChoice(e, qIndex, cIndex)}
                                                                                                value={survey.subject[qIndex].content[cIndex].title} />

                                                                                        </FormItem>
                                                                                    </Col>
                                                                                    <Col span={8}>
                                                                                        <a onClick={() => {
                                                                                            this.deleteChoice(qIndex, cIndex)
                                                                                        }}
                                                                                           style={{paddingLeft: '15px'}}><Icon
                                                                                            type="delete"
                                                                                            style={{color: 'red'}} /></a>
                                                                                    </Col>
                                                                                </Row>

                                                                            </FormItem>
                                                                        )
                                                                    })
                                                                }
                                                            </RadioGroup>
                                                        <Button 
                                                            type='dashed' 
                                                            icon='plus'
                                                            onClick={() => {
                                                                this.addChoice(qIndex)
                                                            }}> <FormattedMessage id="app.button.papers.addoption" defaultMessage="添加选项" /> </Button>
                                                    </FormItem>
                                                </FormItem>
                                              
                                                <Icon 
                                                    type="close-circle-o"
                                                    style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                        top: '10px',
                                                        cursor: 'pointer',
                                                        color: 'red'
                                                    }}
                                                    onClick={() => {
                                                        this.deleteQuestion(qIndex)
                                                    }} />
                                             
                                            </div>

                                        )

                                    })
                                }
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <Button type='dashed' icon='plus' onClick={this.addQuestion}> <FormattedMessage id="app.button.papers.addsubject" defaultMessage="新增题目" /> </Button>

                                </div>

                            </div>
                            <FormItem style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                                    <Button 
                                        type="primary" 
                                        onClick={() => this.handleSubmit()}
                                        loading={this.state.loading}   
                                        style={{marginRight: '10px'}}>
                                        <FormattedMessage id="app.button.save" defaultMessage="保存" />
                                    </Button>
                                    <GoBackButton props={this.props}/>
                            </FormItem>
                        </Form>
                </div>
            </div>
        )
    }
}

const PapersAdd = Form.create()(PapersAddForm)

export default PapersAdd
