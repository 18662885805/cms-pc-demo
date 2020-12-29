import React from "react";
import {Row, Col, Form, Radio, Modal, Spin, Icon, Button, Affix,Anchor} from "antd";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import {
  inject,
  observer
} from "mobx-react";
import moment from "moment";
import CommonUtil from "@utils/common";
import styles from "./index.module.css";

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;


let _util = new CommonUtil();

const messages = defineMessages({
  confirm_title: {
    id: "app.confirm.title.submit",
    defaultMessage: "确认提交?"
  },
  contentText: {
    id: "app.exam.button.contentText",
    defaultMessage: "没有答完题, 是否提交?"
  },
  okText: {
    id: "app.button.ok",
    defaultMessage: "确认"
  },
  cancelText: {
    id: "app.button.cancel",
    defaultMessage: "取消"
  },
  chooseone: {
    id: "app.exam.check.chooseone",
    defaultMessage: "请选择一个正确答案"
  },

  select: {
    id: "app.placeholder.select",
    defaultMessage: "-- 请选择 --"
  },
  nodata: {
    id: "app.placeholder.nodata",
    defaultMessage: "暂无数据"
  }
});


@inject("menuState") @observer @injectIntl
class MyTrainingExam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      spinLoading: true,
      title: "",
      question: [],
      result: null,
      visible: false,
      survey: {
        name: "",
        subject: []
      },
      hour: "00",
      minute: "00",
      second: "00",
      timer: 0,
      seconds: null,
      selectedArrs: [],
      returnUrl:this.props.returnUrl ? this.props.returnUrl :"/",
      name:this.props.name ? this.this.props.name : ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      //获取试题
      this.getPapers(this.props.location.state.id);
      this.setState({
        spinLoading: false
      });
    }
  }


    getPapers = (training_id) => {
      const {getPapers} = this.props;
      if(getPapers){
        getPapers({training_id:training_id}).then((res) => {
          const examtime = _util.getStorage("examtime");
          if (!examtime) {
            _util.setStorage("examtime", Date.now());
            this.setState({
              timer: res.data.results.examination_time * 60
            });
          } else {
            this.setState({
              timer: res.data.results.examination_time * 60 - Math.floor((Date.now() - examtime) / 1000)
            });
          }
          this.startTimer();
          let subject_id = [];
          res.data.results.subject.map((value) => {
            subject_id.push(value.id);
          });
          this.setState({
            pass: res.data.results.clearance,
            question: res.data.results.subject,
            training_id:this.props.location.state.id,
            subject_id: subject_id
          });
        });
      }
    };


    handleSubmit(e) {
      e.preventDefault();
      const {formatMessage} = this.props.intl;
      this.props.form.validateFields((err, values) => {
        const _this = this;
        if (err) {
          confirm({
            // title: '确认提交?',
            content: formatMessage(messages.contentText), //没有答完题, 是否提交?
            okText: formatMessage(messages.okText),
            cancelText: formatMessage(messages.cancelText),
            onOk() {
              _this.eaxmSubmit();
            },
            onCancel() {
            }
          });
        } else {
          _this.eaxmSubmit();
        }
      });
    }


    eaxmSubmit() {
      this.props.form.validateFields((err, values) => {
        const _this = this;
        _this.setState({
          confirmLoading: true
        });
        const {training_id, subject_id} = this.state;
        let answer = [];
        Object.keys(values).forEach((item, index) => {
          const strArr = item.split("-");
          let idx = strArr[1];
          if (item.indexOf("checked") != -1) {
            if (values[item]) {
              answer.push({sub_id: subject_id[idx], id: values[item]});
            }
          }
        });
        const data = {
          training_id,
          content: JSON.stringify(answer)
        };

        const {postAnswer} = this.props;
        if(postAnswer){
          postAnswer(data).then((res) => {
            _util.removeStorage("examtime");
            _this.setState({
              result: res.data.results,
              visible: true
            });
            this.timeFun();
            const {results} = res.data;
            const code = results ? results.code : 1;
            if(code){
              //未通过
              return;
            }else{
              //通过
              this.resetMenuPermission();
            }
          });
        }

        this.setState({
          confirmLoading: false
        });

      });
    }


    handleSubmit1(e) {
      e.preventDefault();
      const {formatMessage} = this.props.intl;
      this.props.form.validateFields((err, values) => {
        // if (!err) {
        const _this = this;
        _this.setState({
          confirmLoading: true
        });
        const {subject_id,training_id} = this.state;

        let answer = [];
        Object.keys(values).forEach((item, index) => {
          const strArr = item.split("-");
          let idx = strArr[1];
          if (item.indexOf("checked") != -1) {
            if (values[item]) {
              answer.push({sub_id: subject_id[idx], id: values[item]});
            }
          }
        });
        const data = {
          training_id,
          content: JSON.stringify(answer)
        };
        confirm({
          // title: '确认提交?',
          content: formatMessage(messages.contentText), //没有答完题, 是否提交?
          okText: formatMessage(messages.okText),
          cancelText: formatMessage(messages.cancelText),
          onOk() {
            const {postAnswer} = this.props;
            if(postAnswer){
              postAnswer(data).then((res) => {
                _util.removeStorage("examtime");
                _this.setState({
                  result: res.data.results,
                  visible: true
                });
              });
            }
          },
          onCancel() {
          }
        });
        this.setState({
          confirmLoading: false
        });
        // }
      });
    }

    // 启动定时器
    startTimer() {
      this.timer = setInterval(() => {
        let countDown = this.state.timer;
        if (countDown === 0) {
          this.eaxmSubmit();
          this.clear();
          this.setInterval(-1);
        } else {
          this.setInterval(--countDown);
          const hour = parseInt(countDown / (60 * 60) % 24) >= 10 ? parseInt(countDown / (60 * 60) % 24) : "0" + parseInt(countDown / (60 * 60) % 24);
          const minute = parseInt(countDown / 60 % 60) >= 10 ? parseInt(countDown / 60 % 60) : "0" + parseInt(countDown / 60 % 60);
          const second = parseInt(countDown % 60) >= 10 ? parseInt(countDown % 60) : "0" + parseInt(countDown % 60);
          this.setState({
            hour: hour,
            minute: minute,
            second: second
          });
        }

      }, 1000);
      this.setInterval(this.state.timer);
    }

    clear() {
      if (this.timer) {
        clearInterval(this.timer);
      }

    }

    setInterval(timer) {
      this.setState({timer});
    }

    componentWillUnmount() {
      this.clear();
    }


    handleOk = () => {
      const {returnUrl} = this.state;
      this.props.history.push({
        pathname:returnUrl
      });
    }

    timeFun() {
      this.setState({
        seconds: 30
      });
      this.clock = setInterval(() => {
        this.setState(() => ({
          seconds: this.state.seconds - 1
          // dlgTipTxt: `已发送(${preState.seconds - 1}s重新发送)`,
        }), () => {
          if (this.state.seconds <= 0) {
            this.setState({isDisabled: false});
            clearInterval(this.clock);
            this.props.history.push({
              pathname: "/in_training/my_training"
            });
          }
        });
      }, 1000);
    }

    handleRadioChange = index => {
      const {selectedArrs} = this.state;
      if (selectedArrs.indexOf(index) < 0) {
        selectedArrs.push(index);
      }
      this.setState(selectedArrs);
    }

    skipIndex(q){
    }

    render() {
      const {getFieldDecorator} = this.props.form;
      const { formatMessage } = this.props.intl;
      const {confirmLoading, spinLoading, question, pass, result, hour, minute, second, seconds,name} = this.state;

      return (
        <div>
          <div className="content-wrapper"
            id='training'
            style={{background: "#f7f7f7", minHeight: "1000px",scrollBehavior:"smooth"}}>
            <Spin spinning={spinLoading}>
              <div className={styles.examBox}>
                <Form onSubmit={this.handleSubmit}>
                  <div className={styles.qtitle}>
                    <h2>{name}</h2>
                  </div>

                  <div className={styles.topbar}>
                    <div className={styles.basicInfo}>
                      <div className="score">
                        <FormattedMessage id="page.training.exam.standard" defaultMessage="总分数/通关分数" />：<i id="total_score">100</i>/<i id="clearance">{pass}</i>
                        <FormattedMessage id="page.training.exam.score" defaultMessage="分" />
                      </div>
                      <div className="time">
                        <FormattedMessage id="page.training.exam.duration" defaultMessage="培训时长" />：<i>60</i>
                        <FormattedMessage id="page.training.exam.minute" defaultMessage="分钟" />
                      </div>
                      <div className="count">
                        <FormattedMessage id="page.training.exam.count" defaultMessage="培训题数" />：<i id="count">{question.length}</i>
                        <FormattedMessage id="page.training.exam.unit" defaultMessage="道" />
                      </div>
                    </div>

                    <Affix offsetTop={0} target={() => document.getElementById("root")}>
                      <ul className={styles.timuTypeBox}>
                        <li className={styles.select} data-timutype="0"><FormattedMessage id="page.training.exam.single" defaultMessage="单选题" /></li>
                      </ul>
                    </Affix>
                  </div>

                  <div className={styles.page}>
                    <Row gutter={15}>
                      <Col span={18}>
                        <div className={styles.preview}>

                          {
                            question.map((q, index) => {
                              return (
                                <div
                                  key={index}
                                  id={q.id}
                                  style={{
                                    padding: "15px 20px 5px",
                                    overflow: "hidden",
                                    borderBottom: "1px solid #f1f1f1"
                                  }}
                                >
                                  <div>
                                    <div style={{marginBottom: "10px"}}
                                      id={`${index + 1}${q.name}`}
                                    >
                                      {q ? `${index + 1} 、${q.name}` : null}
                                    </div>
                                    <FormItem style={{marginBottom: 0}}>
                                      {getFieldDecorator(`checked-${index}`, {
                                        rules: [
                                          {
                                            message: formatMessage(messages.chooseone), //请选择一个正确答案
                                            required: true
                                          }
                                        ]
                                      })(
                                        <RadioGroup
                                          onChange={() => this.handleRadioChange(index)}
                                          style={{width: "100%"}}
                                          buttonStyle="solid"
                                        >
                                          {
                                            q.children instanceof Array && q.children.length ?
                                              q.children.map((c, idx) => {
                                                return (
                                                  <Radio.Button
                                                    value={c.id}
                                                    style={{
                                                      width: "100%",
                                                      height: "100%"
                                                    }}
                                                  ><span>{c ? c.name : null}</span>
                                                  </Radio.Button>
                                                );
                                              })
                                              :
                                              ""
                                          }
                                        </RadioGroup>
                                      )}
                                    </FormItem>
                                  </div>
                                </div>

                              );

                            })
                          }
                        </div>
                      </Col>
                      <Col span={6}>
                        <Affix offsetTop={69} target={() => document.getElementById("root")}>
                          <div className={styles.answerCard}>

                            <div className={styles.answerStatus}>
                              <div style={{
                                display: "inline-block",
                                color: "#40a9ff",
                                fontSize: "16px"
                              }}>
                                <Icon type="clock-circle-o"/>
                                <div style={{paddingLeft: "5px", display: "inline-block"}}>
                                  <span>{hour}</span> : <span>{minute}</span> :
                                  <span>{second}</span>
                                </div>
                              </div>
                              <span style={{float: "right"}}><FormattedMessage id="page.training.exam.remaintime" defaultMessage="剩余考试时间" /></span>
                            </div>
                            <div className="thirdLeiAnswer">
                              <div className={styles.radioAnswer}>
                                <span><FormattedMessage id="page.training.exam.single" defaultMessage="单选题" /></span>


                                <ol className="clearfix">
                                  {
                                    question.map((q, index) => {
                                      return (
                                        <a href={`#${q.id}`}>
                                          <li
                                            data-answerid={index + 1}
                                            style={{
                                              background: this.state.selectedArrs.indexOf(index) > -1 ? "#40a9ff" : "none",
                                              color: this.state.selectedArrs.indexOf(index) > -1 ? "#fff" : "#000"
                                            }}>{index + 1}
                                          </li>
                                        </a>

                                      );
                                    })
                                  }
                                </ol>


                              </div>
                            </div>
                            <div className={styles.submitAnswer}>
                              <Button
                                className={styles.submit}
                                loading={confirmLoading}
                                style={{border: "none"}}
                                onClick={this.handleSubmit}
                              >
                                <FormattedMessage id="page.training.exam.submitpaper" defaultMessage="提交试卷" />
                              </Button>
                            </div>
                          </div>
                        </Affix>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>


              {
                result ?
                  <Modal
                    title={<FormattedMessage id="app.modal.title.examresult" defaultMessage="考试结果" />}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    closable={false}
                    maskClosable={false}
                  >
                    {
                      result.info == "未通过培训" ?
                        <p style={{color: "red", fontSize: "18px"}}>{result.info}</p>
                        :
                        <p style={{color: "#40a9ff", fontSize: "18px"}}>{result.info}</p>
                    }

                    <p><label><FormattedMessage id="page.training.exam.scores" defaultMessage="得分" />：</label>{result ? result.score : ""}<FormattedMessage id="page.training.exam.score" defaultMessage="分" /></p>

                    {
                      result.expire_time ?
                        <p>
                          <label><FormattedMessage id="page.training.exam.valid_date" defaultMessage="有效期至" />：</label>{result.expire_time ? moment(result.expire_time).format("YYYY-MM-DD") : ""}
                        </p>
                        :
                        ""
                    }

                    <div className="btn-box" style={{marginTop: "20px", textAlign: "right"}}>
                      <Button onClick={this.handleOk}><span>{seconds}</span><FormattedMessage id="page.in_training.exam.click_and_return" defaultMessage="秒后即将返回，点击立即返回" /></Button>
                    </div>

                  </Modal>
                  :
                  ""
              }
            </Spin>
          </div>
        </div>
      );
    }
}

const TrainingExam = Form.create()(MyTrainingExam);

export default TrainingExam;
