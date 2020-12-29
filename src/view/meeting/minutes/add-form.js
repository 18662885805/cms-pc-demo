import React, { Fragment } from "react";
import { Form, Button, Modal, Spin, message, Tree, Select, Row, Col, Divider, Input, DatePicker, Upload, Icon, Anchor, Tabs } from "antd";
import { inject, observer } from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
import { MeetingMinutesPost, MeetingMinutesPut, MeetingMinutesDetail, TaskCodeSearch } from "@apis/meeting/minutes";
import { SearchProjectUser } from "@apis/system/user";
import { GetTemporaryDocument, getRegisterDocument } from '@apis/document/register';
import GoBackButton from "@component/go-back";
import groupBy from "lodash/groupBy";
import { debounce, uniq, cloneDeep } from "lodash";
import { interviewee } from "@apis/event/interviewee";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"
import moment from 'moment'
import MyIcon from "@component/MyIcon";
import { GetTemporaryKey } from "@apis/account/index"
import styles from './index.module.css'
import translation from '../translation'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const { Option } = Select;
const { TextArea } = Input;
const { Link } = Anchor;
const { TabPane } = Tabs;
let _util = new CommonUtil();

@inject("menuState") @injectIntl
class MeetingAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      formData: {},
      spinLoading: true,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      searchOptions: [],
      fileList: [],
      meeting: [{
        theme: '',
        topic: [{ name: '', is_show: true, content: [{ index: 0, name: '', source: [], fileList: [], append_time: '' }] }]
      }],
      anchorList: [{ index: 0, title: '' }],
      project_name: _util.getStorage('project_name'),
      userdata: _util.getStorage('userdata'),
      recorder: { id: _util.getStorage('userdata').id, name: _util.getStorage('userdata').name, phone: _util.getStorage('userdata').phone, org: _util.getStorage('userdata').org.company },
      fill_date: new Date(),
      meeting_day: moment(new Date()),
      uploadVisiable: false,
      temp_value: [],
      temp_list: [],
      register_value: [],
      register_list: [],
      upload_type: 1,
      tempdoc: [],
      regdoc: [],
      taskOptions: []
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
    // this.handleUploadChange = this.handleUploadChange.bind(this);
  }

  componentDidMount() {

    const { id } = this.props.match.params;

    if (id && this.props.location.state.templateId === undefined) {
      let _this = this
      MeetingMinutesDetail(id, { project_id: _util.getStorage('project_id') }).then((res) => {
        const { content, permission, principal } = res.data

        let targetArr = []
        const getValue = (obj) => {
          const tempObj = {};
          tempObj.theme = obj.name;
          // tempObj.key = obj.id;
          if (obj.children && obj.children.length) {
            tempObj.topic = [];
            obj.children.map(o => {
              tempObj.topic.push(getChildValue(o))
            });
          }
          return tempObj;
        };

        const getChildValue = (obj) => {
          const tempObj = {};
          tempObj.name = obj.name;
          tempObj.is_show = obj.is_show;
          // tempObj.key = obj.id;
          if (obj.children && obj.children.length) {
            tempObj.content = [];
            obj.children.map(o => {
              tempObj.content.push({
                index: Math.random().toString(36).substring(2),
                content_type: o.content_type,
                content: o.content,
                executive: o.executive_info,
                dead_day: o.dead_day,
                fileList: [],
                source: _util.switchToJson(o.source),
                task_type: o.task_type,
                task_code: o.task_code ? o.task_code : '',
                task_id: o.task_id ? o.task_id : '',
                append_time: o.append_time ? o.append_time : ''
              })
            });
          }
          return tempObj;
        };

        content.forEach(a => {
          targetArr.push(getValue(a));
        });
        console.log(11111)
        let anchorList = []
        content.map((d, index) => {
          anchorList.push({ index: index, title: d.name })
        })
        _this.setState({ anchorList })

        // console.log(targetArr)
        _this.setState({
          typeId: _this.props.location.state.typeId,
          meeting: targetArr,
          // checkedKeys: permission.map(c => c + ''),
          // searchOptions: principal ? [principal] : [],
          ...res.data
        }, () => {
          _this.getFileList();
        });

        // this.props.menuState.changeMenuCurrentUrl("/meeting/minutes");
        // this.props.menuState.changeMenuOpenKeys("/meeting");
      });
    }

    if (this.props.location.state !== undefined && this.props.location.state.typeId !== undefined) {
      this.setState({ typeId: this.props.location.state.typeId })
    }

    console.log(0, this.props.location.state)
    if (this.props.location.state === undefined || this.props.location.state.typeId === undefined) {
      this.props.history.replace('/404')
    } else {
      const { templateId } = this.props.location.state;
      if (templateId) {
        let _this = this
        MeetingMinutesDetail(templateId, { project_id: _util.getStorage('project_id') }).then((res) => {
          const { content, permission, principal } = res.data

          let targetArr = []
          const getValue = (obj) => {
            const tempObj = {};
            tempObj.theme = obj.name;
            tempObj.is_copy = true;
            // tempObj.key = obj.id;
            if (obj.children && obj.children.length) {
              tempObj.topic = [];
              obj.children.map(o => {
                tempObj.topic.push(getChildValue(o))
              });
            }
            return tempObj;
          };

          const getChildValue = (obj) => {
            const tempObj = {};
            tempObj.name = obj.name;
            tempObj.is_show = obj.is_show;
            tempObj.is_copy = true;
            // tempObj.key = obj.id;
            if (obj.children && obj.children.length) {
              tempObj.content = [];
              obj.children.map(o => {
                tempObj.content.push({
                  is_copy: true,
                  index: Math.random().toString(36).substring(2),
                  content_type: o.content_type,
                  content: o.content,
                  executive: o.executive_info,
                  dead_day: o.dead_day,
                  fileList: [],
                  source: _util.switchToJson(o.source),
                  task_type: o.task_type,
                  task_code: o.task_code ? o.task_code : '',
                  append_time: o.append_time ? o.append_time : ''
                })

              });
            }
            return tempObj;
          };

          content.forEach(a => {
            targetArr.push(getValue(a));
          });

          let anchorList = []
          content.map((d, index) => {
            anchorList.push({ index: index, title: d.name })
          })
          _this.setState({ anchorList })
          console.log(222222)
          // console.log(targetArr)
          _this.setState({
            templateId,
            typeId: _this.props.location.state.typeId,
            meeting: targetArr,
            // checkedKeys: permission.map(c => c + ''),
            // searchOptions: principal ? [principal] : [],
            ...res.data
          }, () => {
            _this.getFileList();
          });

          // this.props.menuState.changeMenuCurrentUrl("/meeting/minutes");
          // this.props.menuState.changeMenuOpenKeys("/meeting");
        });
      }
    }
    _util.setSession('menufrom', this.props.menuState.menuCurrentUrl);
    this.setState({
      spinLoading: false
    });
    console.log(this.props.menuState.menuCurrentUrl)
    this.props.menuState.changeMenuCurrentUrl("/meeting/minutes");
    this.props.menuState.changeMenuOpenKeys("/meeting");
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps)
  }

  componentWillUnmount() {

  }

  getFileList = () => {
    const { meeting } = this.state
    let _this = this;
    meeting.map((a, aIndex) => {
      if (a.topic && a.topic.length) {
        a.topic.map((b, bIndex) => {
          if (b.content && b.content.length) {
            b.content.map((c, cIndex) => {
              if (c.source && c.source.length) {

                let source_list = []
                var cos = _util.getCos(null, GetTemporaryKey);
                Array.isArray(c.source) && c.source.map((obj, index) => {
                  // console.log(1,obj,obj.name,obj.url)
                  const key = obj && obj.url;
                  var url = cos.getObjectUrl({
                    Bucket: 'ecms-1256637595',
                    Region: 'ap-shanghai',
                    Key: key,
                    Sign: true,
                  }, function (err, data) {
                    if (data && data.Url) {
                      // console.log(2, obj.url, data.Url)
                      source_list.push({
                        uid: -(index + 1),
                        name: obj.name,
                        status: 'done',
                        url: data.Url,
                        thumbUrl: data.Url,
                        response: {
                          file_name: obj.url
                        }
                      })

                      if (meeting[aIndex].topic[bIndex].content[cIndex]) {
                        meeting[aIndex].topic[bIndex].content[cIndex].fileList = source_list
                        _this.setState({ meeting }, () => {
                          console.log(_this.state.meeting)
                        })
                      }

                    }
                  });
                })
              }
            })

          }
        })
      }
    })
  }

  handleUploadChange(cIndex, sIndex, qIndex, info) {
    let { fileList } = info
    const status = info.file.status
    const { formatMessage } = this.props.intl
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功.`)   //上传成功
    } else if (status === 'error') {
      message.error(`${info.file.name} ${info.file.response.msg}.`)
    }

    // 2. Read from response and show file link
    // fileList = fileList.map(file => {
    //   if (file.response) {
    //     // Component will show file.url as link
    //     // console.log(file.response.file_name)
    //     file.url = file.response.file_name;
    //     // file.url = _util.getImageUrl(file.response.content.results.url);
    //   }
    //   return file;
    // });

    // meeting[cIndex].topic[sIndex].content[qIndex][field] = value

    const { meeting } = this.state
    let source = []
    if (fileList instanceof Array) {
      fileList.forEach((value) => {
        // source.push(value.response && value.response.file_name)
        source.push({ name: value.name, url: value.response && value.response.file_name })
      })
    }
    meeting[cIndex].topic[sIndex].content[qIndex].source = source

    meeting[cIndex].topic[sIndex].content[qIndex].fileList = fileList

    this.setState({
      meeting,
      // fileList
      // uploadVisible: false,
      // fileList: []
    }, () => {
      // console.log(this.state.meeting)
    })

  }

  handleSubmit(e) {
    const { search_id } = this.state;
    const { formatMessage } = this.props.intl;
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let _this = this;
        const { formatMessage } = this.props.intl;
        const { meeting } = this.state

        if (meeting.some(d => { return d.theme == '' })) {
          message.error('请填写会议主题')
          return
        }
        // console.log(meeting.every(c => {return c.topic.every(s => {return s.content.every(q => {return q.content_type}) } )}))
        if (meeting.every(c => { return c.topic.every(s => { return s.content.every(q => { return q.content_type }) }) }) === false) {
          message.error('请选择会议类型')
          return
        }

        if (meeting.every(c => { return c.topic.every(s => { return s.content.every(q => { return q.content }) }) }) === false) {
          message.error('请填写会议内容')
          return
        }

        this.setState({
          confirmLoading: true
        });

        let targetArr = []
        const getValue = (obj) => {
          const tempObj = {};
          tempObj.name = obj.theme;
          // tempObj.key = obj.id;
          if (obj.topic && obj.topic.length) {
            tempObj.children = [];
            obj.topic.map(o => {
              tempObj.children.push(getChildValue(o))
            });
          }
          return tempObj;
        };
        // const getChildValue = (obj) => {
        //   const tempObj = {};
        //   tempObj.name = obj.name;
        //   // tempObj.key = obj.id;
        //   if (obj.content&&obj.content.length) {
        //     tempObj.children = [];
        //     tempObj.children = obj.content
        //     // obj.content.map(o => {
        //     //   tempObj.children = obj.content
        //     // });
        //   }
        //   return tempObj;
        // };

        const getChildValue = (obj) => {
          const tempObj = {};
          tempObj.name = obj.name;
          tempObj.is_show = obj.is_show;
          // tempObj.key = obj.id;
          if (obj.content && obj.content.length) {
            tempObj.children = [];
            obj.content.map(o => {
              tempObj.children.push({
                content_type: o.content_type,
                content: o.content,
                executive: o.executive ? o.executive : '',
                dead_day: o.dead_day ? o.dead_day : '',
                source: o.source,
                task_type: o.task_type,
                task_id: o.task_id ? o.task_id : '',
                task_code: o.task_code ? o.task_code : '',
                append_time: o.append_time ? o.append_time : ''
              })
            });
          }
          return tempObj;
        };

        meeting.forEach(a => {
          targetArr.push(getValue(a));
        });
        // console.log(targetArr)
        const { participant, distributor, host, recorder, meeting_day, meeting_area, typeId } = this.state
        let params = {
          project_id: _util.getStorage('project_id'),
          meeting_type: _this.props.location.state ? _this.props.location.state.typeId : typeId,
          name: values.name,
          participant: values.participant.join(','),
          participant_text: values.participant_text,
          distributor: values.distributor.join(','),
          distributor_text: values.distributor_text,
          host: values.host.join(','),
          recorder: values.recorder,
          meeting_day: values.meeting_day ? moment(values.meeting_day).format('YYYY-MM-DD HH:mm') : meeting_day,
          meeting_area: values.meeting_area ? values.meeting_area : meeting_area,
          content: JSON.stringify(targetArr)
        }
        // console.log(params)
        // return
        confirm({
          title: '确认提交?',
          content: '单击确认按钮后，将会提交数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            // values.permission = _this.state.checkedKeys.filter(k => k && k.indexOf("-") < 0).join(",");
            // values.permission = _this.state.checkedKeys.filter(k => k.indexOf("$") < 0).join(",");
            // values.search_id = search_id;
            const { id } = _this.props.match.params;
            // const {templateId} = _this.props.location.state
            if (_this.state.templateId) {
              MeetingMinutesPost(params).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.push('/meeting/minutes')
                // _this.props.history.goBack();
              });
              return;
            }
            if (id) {
              // values.project_id = _util.getStorage('project_id')
              MeetingMinutesPut(id, params).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.push('/meeting/minutes')
                // _this.props.history.goBack();
              });
              return;
            }

            MeetingMinutesPost(params).then((res) => {
              message.success(formatMessage(translation.saved));
              _this.props.history.push('/meeting/minutes')
              // _this.props.history.goBack();
            });
          },
          onCancel() {
          }
        });
      }
      this.setState({
        confirmLoading: false
      });
    });
  }

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  renderTreeNodes = (data) => {
    if (data && data instanceof Array) {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode {...item} />
      })
    }
  }

  handleApprovalPerson = value => {
    if (value) {
      this.setState({
        search_id: value
      });
    }
  }

  searchConcat(d) {
    const { name, org, department, id_num, phone, company } = d;
    let temp = "";

    if (name) {
      temp += name;
    }
    if (company) {
      temp += ("-" + company);
    }
    if (department) {
      temp += ("-" + department);
    }
    if (org) {
      temp += ("-" + org);
    }
    if (id_num) {
      temp += ("-" + id_num);
    }
    // if (phone) {
    //   temp += ("-" + phone);
    // }
    return temp;
  }

  fetchUser = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    this.setState({
      fetching: true,
      searchOptions: []
    });
    SearchProjectUser({
      q: value,
      project_id: _util.getStorage('project_id')
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const searchOptions = res.data.map(user => ({
        id: user.id,
        name: user.name,
        // value: user.name,
        // text: user.name,
        // org:user.org,
        // tel: user.tel,
        phone: user.phone,
        org: user.org
      }));
      this.setState({
        searchOptions,
        fetching: false
      });
    });
  }

  fetchTaskCode = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    this.setState({
      fetching: true,
      taskOptions: []
    });
    TaskCodeSearch({
      serial: value,
      project_id: _util.getStorage('project_id')
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const searchOptions = res.data.map(d => ({
        id: d.id,
        name: d.serial,
        org: d.org_name,
        org_id: d.org_id,
        date: d.duedate,
        serial: d.serial
      }));
      console.log(searchOptions)
      this.setState({
        taskOptions: searchOptions,
        fetching: false
      });
    });
  }

  handleFormChange = (value, field) => {
    // console.log(value, field)
    if (field === 'person_no') {
      const { persOptions } = this.state
      const { name, pers_no, cost_center, department } = persOptions.filter(o => o.id === value)[0]
      this.setState({
        name,
        pers_no,
        cost_center,
        department
      })
    }
    this.setState({
      [field]: value
    })
  }

  addTheme = () => {
    const { meeting, anchorList } = this.state
    let index = meeting.length;
    meeting.push({
      theme: '',
      topic: [{ index: 0, name: '', is_show: true, content: [{ index: 0, name: '', source: [], fileList: [], append_time: '' }] }]
    })
    anchorList.push({ title: '', index: index })
    this.setState({
      meeting,
      anchorList
    })
  }

  deleteTheme = (index) => {
    const { meeting, anchorList } = this.state
    meeting.splice(index, 1)
    anchorList.splice(index, 1)
    this.setState({
      meeting,
      anchorList
    })
  }

  addTopic = (cIndex) => {
    const { meeting } = this.state
    let index = meeting[cIndex].topic.length;
    meeting[cIndex].topic.push({ index: index, name: '', is_show: true, content: [{ index: 0, name: '', source: [], fileList: [], append_time: '' }] })
    this.setState({
      meeting
    })
  }

  deleteTopic = (cIndex, sIndex) => {
    const { meeting } = this.state
    meeting[cIndex].topic.splice(sIndex, 1)
    this.setState({
      meeting
    })
  }

  addContent = (cIndex, sIndex, qIndex) => {
    const { meeting } = this.state
    let index = meeting[cIndex].topic[sIndex].content.length;
    meeting[cIndex].topic[sIndex].content.push({ index: index, name: '', source: [], fileList: [], append_time: '' })
    this.setState({
      meeting
    })
  }

  deleteContent = (cIndex, sIndex, qIndex) => {
    const { meeting } = this.state
    meeting[cIndex].topic[sIndex].content.splice(qIndex, 1)
    this.setState({
      meeting
    })
  }

  moveUpTheme = (index) => {
    const { meeting } = this.state
    let arr = meeting
    let newArr = []
    if (arr.length > 1 && index !== 0) {
      newArr = this.swapArray(arr, index, index - 1);
      // meeting = newArr
      this.setState({ meeting: newArr })
    } else {
      message.info('已经是第一个了');
    }
  }

  moveDownTheme = (index) => {
    const { meeting } = this.state
    let arr = meeting
    let newArr = []
    if (arr.length > 1 && index !== (arr.length - 1)) {
      newArr = this.swapArray(arr, index, index + 1);
      // meeting = newArr
      this.setState({ meeting: newArr }, () => {
        // console.log(meeting)
      })
    } else {
      message.info('已经是最后一个了');
    }
  }

  moveUpTopic = (cIndex, index) => {
    const { meeting } = this.state
    let arr = meeting[cIndex].topic
    let newArr = []
    if (arr.length > 1 && index !== 0) {
      newArr = this.swapArray(arr, index, index - 1);
      meeting[cIndex].topic = newArr
      this.setState({ meeting })
    } else {
      message.info('已经是第一个了');
    }
  }

  moveDownTopic = (cIndex, index) => {
    const { meeting } = this.state
    let arr = meeting[cIndex].topic
    let newArr = []
    // console.log(arr, index)
    if (arr.length > 1 && index !== (arr.length - 1)) {
      newArr = this.swapArray(arr, index, index + 1);
      // arr[cIndex] = arr.splice(index, 1, arr[cIndex])[0]
      // console.log(this.swapArray(arr, index, index + 1))
      meeting[cIndex].topic = newArr
      // let obj = cloneDeep(meeting)
      this.setState({ meeting }, () => {
        // console.log(meeting)
      })
    } else {
      message.info('已经是最后一个了');
    }
  }

  moveUpContent = (cIndex, sIndex, index) => {
    const { meeting } = this.state
    let arr = meeting[cIndex].topic[sIndex].content
    let newArr = []
    if (arr.length > 1 && index !== 0) {
      newArr = this.swapArray(arr, index, index - 1);
      meeting[cIndex].topic[sIndex].content = newArr
      this.setState({ meeting })
    } else {
      message.info('已经是第一个了');
    }
  }

  moveDownContent = (cIndex, sIndex, index) => {
    const { meeting } = this.state
    let arr = meeting[cIndex].topic[sIndex].content
    let newArr = []
    if (arr.length > 1 && index !== (arr.length - 1)) {
      newArr = this.swapArray(arr, index, index + 1);
      meeting[cIndex].topic[sIndex].content = newArr
      this.setState({ meeting }, () => {
        // console.log(meeting)
      })
    } else {
      message.info('已经是最后一个了');
    }
  }

  swapArray(arr, index1, index2) {
    // console.log(index1, index2)
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }

  handleTopicChange = (e, cIndex, sIndex, field) => {
    const { meeting } = this.state
    // console.log(e.target.value)
    meeting[cIndex].topic[sIndex][field] = e.target.value
    this.setState({ meeting })
  }

  handleThemeChange = (e, cIndex) => {
    const { meeting, anchorList } = this.state
    // console.log(e.target.value)
    meeting[cIndex].theme = e.target.value
    anchorList[cIndex].title = e.target.value
    this.setState({ meeting, anchorList })
  }

  handleContentChange = (value, cIndex, sIndex, qIndex, field) => {
    console.log(value)
    const { meeting, taskOptions } = this.state
    if (field == 'task_id') {
      if(taskOptions.length === 0){
        return
      }
      let obj = taskOptions[0]
      console.log(obj)
      meeting[cIndex].topic[sIndex].content[qIndex][field] = value
      // meeting[cIndex].topic[sIndex].content[qIndex].executive = {id: obj.org_id, name: obj.org}
      meeting[cIndex].topic[sIndex].content[qIndex].executive = obj.org
      meeting[cIndex].topic[sIndex].content[qIndex].dead_day = obj.date
      meeting[cIndex].topic[sIndex].content[qIndex].task_code = obj.serial
      // let obj = this.state.searchOptions.filter(d => d.id == value)[0]
      // // console.log(obj)
      // meeting[cIndex].topic[sIndex].content[qIndex][field] = obj
      this.setState({ meeting })
    } else {
      meeting[cIndex].topic[sIndex].content[qIndex][field] = value
      this.setState({ meeting })
    }
  }

  handleOnBlur = () => {
    this.setState({
      searchOptions: []
    })
  }

  onAnchorChange = () => {

  }

  goBack = () => {
    let _this = this
    confirm({
      title: '确认返回上一个页面?',
      content: '单击确认按钮后，将会返回上一个页面',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        _this.props.history.push('/meeting/minutes')
      },
      onCancel() {

      }
    })
  }

  isShowTopic = (cIndex, sIndex) => {
    const { meeting } = this.state
    // console.log(e.target.value)
    meeting[cIndex].topic[sIndex].is_show = !meeting[cIndex].topic[sIndex].is_show
    this.setState({ meeting })
  }

  showUpload = (cIndex, sIndex, qIndex, e) => {
    // console.log(cIndex, sIndex, qIndex, e)
    const { meeting } = this.state
    // console.log(meeting[cIndex].topic[sIndex].content[qIndex].fileList)
    let fileList = meeting[cIndex].topic[sIndex].content[qIndex].fileList
    if (fileList && fileList.length >= 5) {
      message.error('最多上传5个附件')
      return
    }
    this.setState({
      // fileList,
      cIndex, sIndex, qIndex,
      uploadVisiable: true
    });
  }

  handleUploadType = (key) => {
    this.setState({
      upload_type: key,
      fileList: [],
      temp_list: [],
      temp_value: [],
      tempdoc: [],
      register_list: [],
      register_value: [],
      regdoc: [],
    })
  }

  hideUpload = () => {
    this.setState({
      fileList: [],
      temp_list: [],
      temp_value: [],
      tempdoc: [],
      register_list: [],
      register_value: [],
      regdoc: [],
      upload_type: 1,
      uploadVisiable: false
    })
  }

  fileUpload = (info) => {
    let { fileList, file } = info;
    const status = info.file.status;
    const { formatMessage } = this.props.intl;

    if (status === 'done') {
      message.success(`${info.file.name} ${formatMessage({ id: "app.message.upload_success", defaultMessage: "上传成功" })}`)

    } else if (status === 'error') {
      message.error(`${info.file.name} ${info.file.response}.`)
    }

    this.setState({ fileList })

  }

  handleUploadSubmit = () => {
    const { fileList, upload_type, tempdoc, regdoc, cIndex, sIndex, qIndex } = this.state;
    const { meeting } = this.state
    let _this = this
    let source = []
    if (upload_type == 1) {
      if (fileList instanceof Array && fileList.length > 0) {
        fileList.forEach((value) => {
          source.push({ name: value.name, url: value.response && value.response.file_name })
        })
        // console.log(source)
        let old_file = meeting[cIndex].topic[sIndex].content[qIndex].source
        if (old_file.concat(source).length > 5) {
          message.error('最多上传5个附件')
          return
        } else {
          meeting[cIndex].topic[sIndex].content[qIndex].source = old_file.concat(source)
        }
        _this.setState({ meeting }, () => {
          _this.getFileList();
        })
        _this.hideUpload();
      } else {
        message.error('请选择附件')
        return
      }
    }
    if (upload_type == 2) {
      if (tempdoc && tempdoc.length > 0) {
        tempdoc.map(c => {
          JSON.parse(c.source).map(d => {
            source.push({
              name: d.name,
              url: d.url
            })
          })
        })
      } else {
        message.error('请选择附件')
        return
      }

      let old_file = meeting[cIndex].topic[sIndex].content[qIndex].source
      if (old_file.concat(source).length > 5) {
        message.error('最多上传5个附件')
        return
      } else {
        meeting[cIndex].topic[sIndex].content[qIndex].source = old_file.concat(source)
      }
      _this.setState({ meeting }, () => {
        _this.getFileList();
      })
      _this.hideUpload();
    }

    if (upload_type == 3) {
      if (regdoc && regdoc.length > 0) {
        regdoc.map(c => {
          JSON.parse(c.source).map(d => {
            source.push({
              name: d.name,
              url: d.url
            })
          })
        })
      } else {
        message.error('请选择附件')
        return
      }

      let old_file = meeting[cIndex].topic[sIndex].content[qIndex].source
      if (old_file.concat(source).length > 5) {
        message.error('最多上传5个附件')
        return
      } else {
        meeting[cIndex].topic[sIndex].content[qIndex].source = old_file.concat(source)
      }

      _this.setState({ meeting }, () => {
        _this.getFileList();
      })
      _this.hideUpload();
    }

  }

  fetchTemp = (value) => {
    if (!value) {
      return
    }
    const { project_id } = this.state;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ temp_list: [], fetching: true, search_info: "", search_id: null });
    GetTemporaryDocument({ q: value, project_id: _util.getStorage('project_id') }).then((res) => {
      const temp_list = res.data;
      this.setState({ temp_list, fetching: false });
    });
  }

  fetchRegister = (value) => {
    if (!value) {
      return
    }
    const { project_id } = this.state;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ register_list: [], fetching: true, search_info: "", search_id: null });
    getRegisterDocument({ q: value, project_id: _util.getStorage('project_id') }).then((res) => {
      const register_list = res.data;
      this.setState({ register_list, fetching: false });
    });
  }

  renderFileList = (index) => {
    const { tempdoc, regdoc, fileList } = this.state
    let _this = this;
    console.log(tempdoc)
    let source = []
    if (index === 1) {
      tempdoc.map(c => {
        JSON.parse(c.source).map(d => {
          source.push({
            name: d.name,
            url: d.url
          })
        })
      })
    }
    if (index === 2) {
      regdoc.map(c => {
        JSON.parse(c.source).map(d => {
          source.push({
            name: d.name,
            url: d.url
          })
        })
      })
    }

    // console.log(source)

    if (source && source.length) {

      let source_list = []
      var cos = _util.getCos(null, GetTemporaryKey);
      Array.isArray(source) && source.map((obj, index) => {
        // console.log(1,obj,obj.name,obj.url)
        const key = obj && obj.url;
        var url = cos.getObjectUrl({
          Bucket: 'ecms-1256637595',
          Region: 'ap-shanghai',
          Key: key,
          Sign: true,
        }, function (err, data) {
          if (data && data.Url) {
            // console.log(2, obj.url, data.Url)
            source_list.push({
              uid: -(index + 1),
              name: obj.name,
              status: 'done',
              url: data.Url,
              thumbUrl: data.Url,
              response: {
                file_name: obj.url
              }
            })

            _this.setState({ fileList: source_list }, () => {
              console.log(_this.state.fileList)
            })

          }
        });
      })
    } else {
      _this.setState({ fileList: [] })
    }

  }

  handleSelectTemp = (value) => {
    const { temp_list, temp_value, tempdoc, fileList } = this.state;
    let _this = this
    let temp_Filelist = temp_list.filter(t => {
      return t.code == value
    })
    console.log(tempdoc.concat(temp_Filelist))
    let arr = temp_value.concat(value)
    _this.setState({ temp_value: arr, tempdoc: tempdoc.concat(temp_Filelist) }, () => {
      _this.renderFileList(1);
    })
  }

  handleDeSelectTemp = (value) => {
    const { temp_list, temp_value, tempdoc } = this.state;
    let _this = this
    let arr1 = tempdoc.filter(obj => obj.code !== value);
    let arr2 = temp_value.filter(v => v !== value);
    // console.log(arr1, arr2)
    this.setState({ temp_value: arr2, tempdoc: arr1 }, () => {
      _this.renderFileList(1);
    })
  }

  handleSelectRegister = (value) => {
    const { register_list, register_value, regdoc } = this.state;
    let _this = this
    let temp_Filelist = register_list.filter(t => {
      return t.code == value
    })
    console.log(regdoc.concat(temp_Filelist))
    let arr = register_value.concat(value)
    this.setState({ register_value: arr, regdoc: regdoc.concat(temp_Filelist) }, () => {
      _this.renderFileList(2);
    })
  }

  handleDeSelectRegister = (value) => {
    const { register_list, register_value, regdoc } = this.state;
    let _this = this
    let arr1 = regdoc.filter(obj => obj.code !== value);
    let arr2 = register_value.filter(v => v !== value);
    // console.log(arr1, arr2)
    this.setState({ register_value: arr2, regdoc: arr1 }, () => {
      _this.renderFileList(2);
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { confirmLoading, spinLoading, treeData, name, name_en, desc, desc_en, principal, permission, userdata, searchOptions, taskOptions, fileList,
      participant, distributor, host, recorder, meeting_day, meeting_area, participant_text, distributor_text, uploadVisiable,
      temp_value, temp_list, register_value, register_list } = this.state;
    const { formatMessage } = this.props.intl
    const _this = this;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };

    const titleformItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    const subformItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };

    const textformItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 }
      }
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 10 }
      }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 6 },
      },
    };
    // let trees = [];
    // const treeDataGroup = groupBy(treeData, t => t.menu_id);
    // Object.keys(treeDataGroup).forEach((k, index) => {
    //   trees.push({
    //     key: `$${index}`,
    //     title: treeDataGroup[k][0].menu_name,
    //     children: treeDataGroup[k]
    //   });
    // });

    const props2 = {
      multiple: true,
      action: _util.getServerUrl('/upload/document/'),
      headers: {
        Authorization: 'JWT ' + _util.getStorage('token')
      },
      className: 'upload-list-inline',
    }

    const uploadButton = (
      <Button>
        <Icon type="upload" /> upload
      </Button>
    );

    const formData = [
      {
        field: "name",
        type: "char",
        icon: "",
        value: name ? name : null,
        text: "会议名称",
        placeholder: "会议名称",
        rules: [{ required: true, message: "请输入会议名称" }]
      },
      {
        field: "participant",
        type: "search",
        mode: "multiple",
        icon: "",
        value: participant ? participant.map(d => { return d.id + '' }) : null,
        text: "出席人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: searchOptions && searchOptions.length ? searchOptions : participant,
        fetchUser: (value) => this.fetchUser(value),
        onBlur: () => this.handleOnBlur(),
        searchConcat: (e) => this.searchConcat(e),
        // onFocus: () => this.handleOnFocus(),
        rules: [{ required: true, message: "请选择出席人" }]
      },
      {
        field: "distributor",
        type: "search",
        mode: "multiple",
        icon: "",
        value: distributor ? distributor.map(d => { return d.id + '' }) : null,
        text: "抄送人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: searchOptions && searchOptions.length ? searchOptions : distributor,
        fetchUser: (value) => this.fetchUser(value),
        onBlur: () => this.handleOnBlur(),
        searchConcat: (e) => this.searchConcat(e),
        rules: [{ required: true, message: "请选择抄送人" }]
      },
      {
        field: "participant_text",
        type: "char",
        icon: "",
        value: participant_text ? participant_text : null,
        text: "其它出席人",
        placeholder: "其它出席人",
        rules: []
      },
      
      {
        field: "distributor_text",
        type: "char",
        icon: "",
        value: distributor_text ? distributor_text : null,
        text: "其它抄送人",
        placeholder: "其它抄送人",
        rules: []
      },
      {
        field: "host",
        type: "search",
        mode: "multiple",
        icon: "",
        value: host ? host.map(d => { return d.id + '' }) : null,
        text: "主持人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: searchOptions && searchOptions.length ? searchOptions : host,
        fetchUser: (value) => this.fetchUser(value),
        onBlur: () => this.handleOnBlur(),
        searchConcat: (e) => this.searchConcat(e),
        rules: [{ required: true, message: "请选择主持人" }]
      },
      {
        field: "recorder",
        type: "search",
        // mode: "multiple",
        icon: "",
        value: recorder ? recorder.id + '' : '',
        text: "记录人",
        placeholder: "根据姓名、手机搜索项目用户",
        // options: recorder ? [recorder] : searchOptions,
        options: searchOptions && searchOptions.length ? searchOptions : recorder ? [recorder] : [],
        fetchUser: (value) => this.fetchUser(value),
        onBlur: () => this.handleOnBlur(),
        searchConcat: (e) => this.searchConcat(e),
        rules: [{ required: true, message: "请选择记录人" }]
      },
      {
        field: "meeting_day",
        type: "datetime",
        icon: "",
        value: null,
        value: meeting_day ? moment(meeting_day) : null,
        text: "会议时间",
        placeholder: "会议时间",
        // onChange: value => this.handleFormChange(value ? value.format("YYYY-MM-DD HH:mm") : null, "meeting_day"),
        rules: [{ required: true, message: "请选择会议时间" }],
        anytime:true,
      },
      {
        field: "meeting_area",
        type: "char",
        icon: "",
        value: meeting_area ? meeting_area : null,
        text: "会议地点",
        placeholder: "会议地点",
        rules: [{ required: true, message: "请填写会议地点" }]
      }
    ]

    const { id } = this.props.match.params
    const bread = [
      {
        name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页" />,
        url: '/'
      },
      {
        name: <FormattedMessage id="app.page.bread.meeting" defaultMessage="会议管理" />
      },
      {
        name: <FormattedMessage id="app.page.bread.meetingminutes" defaultMessage="会议纪要" />,
        url: '/meeting/minutes'
      },
      {
        name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改" /> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
      }
    ]

    const typelist = [
      { id: 1, name: '无' },
      { id: 2, name: '信息' },
      { id: 3, name: '决定' },
      { id: 4, name: '任务' }
    ]

    return (
      <div>
        <MyBreadcrumb bread={bread} />
        <div className="content-wrapper content-no-table-wrapper meeting">
          <Spin spinning={spinLoading}>
            <Form onSubmit={this.handleSubmit}>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>{this.state.project_name}项目</h2>
                <h2 style={{ fontSize: '14px' }}>eCMS电子会议纪要</h2>
              </div>

              <Row gutter={16}>
                {
                  formData ? formData.map((item, index) => {
                    return (
                      item.field === "name" ?
                        <Col className="gutter-row" span={24}>
                          <FormItem
                            required
                            key={index}
                            label={item.text}
                            extra={item.extra}
                            hasFeedback
                            {...formItemLayout1}
                          >
                            {
                              item.value
                                ?
                                getFieldDecorator(item.field, {
                                  initialValue: item.value,
                                  rules: item.rules
                                })(
                                  _util.switchItem(item, _this)
                                )
                                :
                                getFieldDecorator(item.field, {
                                  rules: item.rules
                                })(
                                  _util.switchItem(item, _this)
                                )
                            }
                          </FormItem>
                        </Col>
                        :
                        <Col className="gutter-row" span={12}>
                          <FormItem
                            key={index}
                            label={item.text}
                            extra={item.extra}
                            hasFeedback
                            {...formItemLayout}
                          >
                            {
                              item.value
                                ?
                                getFieldDecorator(item.field, {
                                  initialValue: item.value,
                                  rules: item.rules
                                })(
                                  _util.switchItem(item, _this)
                                )
                                :
                                getFieldDecorator(item.field, {
                                  rules: item.rules
                                })(
                                  _util.switchItem(item, _this)
                                )
                            }
                          </FormItem>
                        </Col>
                    );
                  }) : null
                }
              </Row>

              <Divider></Divider>
              {
                this.state.anchorList && this.state.anchorList.length && this.state.anchorList[0].title ?
                  <Fragment>
                    <div className={styles.topicindex}>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={24}>
                          <h2 style={{ fontSize: '16px', display: 'inline-flex', alignItems: 'center', fontWeight: '700', width: '100%' }}>主题索引&nbsp;&nbsp;</h2>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={24}>
                          <Anchor affix={false} onChange={this.onAnchorChange}>
                            {
                              this.state.anchorList.map(item => (
                                <Link key={`${item.index}`}
                                  href={`#anchor-${item.index}`}
                                  title={item.title ? `${item.index + 1}.${item.title}` : ''}
                                // title={`${item.index+1}. ${item.title}`} 
                                />
                              ))
                            }
                          </Anchor>
                        </Col>
                      </Row>
                    </div>
                    <Divider className={styles.noprint}></Divider>
                  </Fragment>
                  :
                  null
              }

              {

                this.state.meeting.map((c, cIndex) => {
                  return (
                    <Fragment>
                      <div
                        className={styles.theme}
                        style={{
                          // margin: '0 auto 10px',
                          // padding: '10px',
                          overflow: 'hidden',
                          // borderBottom: subject.length > 1 ? '1px dashed #e8e8e8' : 'none',
                          // boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                          width: '100%',
                          position: 'relative',
                          padding: '5px 0',
                          border: '1px dashed #fff'
                        }}
                        key={cIndex}
                      >
                        <Row gutter={16}>
                          <Col className="gutter-row" span={18} name={`anchor-${cIndex}`}
                            id={`anchor-${cIndex}`}>
                            <FormItem
                              className="theme"
                              required
                              label={`${cIndex + 1}.主题`}
                              {...subformItemLayout}
                              colon={false}
                              style={{ fontSize: '16px', fontWeight: '700' }}
                            // style={{ fontSize: '16px', display: 'inline-flex', alignItems: 'center', fontWeight: '700', width: '100%' }}
                            >
                              <Input value={c.theme} disabled={c.is_copy} onChange={(e) => this.handleThemeChange(e, cIndex)} style={{ width: '100%' }} placeholder="请输入会议主题" />

                            </FormItem>
                            {/* <h2 style={{ fontSize: '16px', display: 'inline-flex', alignItems: 'center', fontWeight: '700', width: '100%' }}>{`${cIndex + 1}.`}主题&nbsp;&nbsp;<Input value={c.theme} onChange={(e) => this.handleThemeChange(e, cIndex)} style={{ width: '80%' }} placeholder="请输入会议主题" /></h2> */}
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <div className={styles.operate} style={{ position: 'absolute', top: '0', right: '0', width: '300px', padding: '5px 0' }}>
                              <Button className="sbtn" type="dashed" onClick={this.addTheme}>
                                <Icon type="plus" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="添加" />
                              </Button>
                              {
                                this.state.meeting && this.state.meeting.length > 1 ?
                                  <Button className="sbtn" type="dashed" onClick={() => this.deleteTheme(cIndex)} style={{ marginLeft: '10px' }}>
                                    <Icon type="minus" /> 删除
                                  </Button>
                                  :
                                  null
                              }
                              <Button className="sbtn" type="dashed" onClick={() => this.moveUpTheme(cIndex)} style={{ marginLeft: '10px' }}>
                                <Icon type="arrow-up" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="上移" />
                              </Button>
                              <Button className="sbtn" type="dashed" onClick={() => this.moveDownTheme(cIndex)} style={{ marginLeft: '10px' }}>
                                <Icon type="arrow-down" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="下移" />
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {
                        c.topic.map((s, sIndex) => {
                          return (
                            <Fragment>
                              <div
                                className={styles.topic}
                                style={{
                                  // margin: '0 auto 10px',
                                  // padding: '10px',
                                  overflow: 'hidden',
                                  // borderBottom: subject.length > 1 ? '1px dashed #e8e8e8' : 'none',
                                  // boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                                  width: '100%',
                                  position: 'relative',
                                  padding: '5px 0',
                                  border: '1px dashed #fff',
                                  marginBottom: '10px',
                                  fontWeight: '700'

                                }}
                                key={s.index}
                              >
                                <Row gutter={16}>
                                  {/* <Col className="gutter-row" span={18} style={{ paddingLeft: '0' }}> */}
                                  <Col className="gutter-row" span={18}>
                                    <FormItem
                                      // required
                                      className="topic"
                                      label={`${cIndex + 1}.${sIndex + 1}标题`}
                                      {...subformItemLayout}
                                      colon={false}
                                    >

                                      <Input placeholder="请输入标题" disabled={s.is_copy} value={s.name} onChange={e => this.handleTopicChange(e, cIndex, sIndex, 'name')} />

                                    </FormItem>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                    <div className={styles.operate} style={{ position: 'absolute', top: '0', right: '0', width: '300px', padding: '5px 0' }}>
                                      {/* <Icon type="plus" onClick={()=>this.addTopic(cIndex)}/>  */}
                                      <Button className="sbtn" type="dashed" onClick={() => this.addTopic(cIndex)}>
                                        <Icon type="plus" /> 添加
                                      </Button>
                                      {
                                        c.topic && c.topic.length > 1 ?
                                          // <Icon type="minus" onClick={()=>this.deleteTopic(cIndex,sIndex)}/>
                                          <Button className="sbtn" type="dashed" onClick={() => this.deleteTopic(cIndex, sIndex)} style={{ marginLeft: '10px' }}>
                                            <Icon type="minus" /> 删除
                                          </Button>
                                          :
                                          null
                                      }
                                      <Button className="sbtn" type="dashed" onClick={() => this.moveUpTopic(cIndex, sIndex)} style={{ marginLeft: '10px' }}>
                                        <Icon type="arrow-up" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="上移" />
                                      </Button>
                                      <Button className="sbtn" type="dashed" onClick={() => this.moveDownTopic(cIndex, sIndex)} style={{ marginLeft: '10px' }}>
                                        <Icon type="arrow-down" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="下移" />
                                      </Button>
                                      <Button className="sbtn" type="dashed" onClick={() => this.isShowTopic(cIndex, sIndex)} style={{ marginLeft: '10px' }}>
                                        {
                                          s.is_show === true ?
                                            <Fragment><MyIcon type="anticon-eye_close" style={{ color: 'inherit', verticalAlign: 'middle' }} /> &nbsp;隐藏</Fragment>
                                            :
                                            <Fragment><MyIcon type="anticon-eye" style={{ color: 'inherit', verticalAlign: 'middle' }} /> &nbsp;显示</Fragment>
                                        }
                                      </Button>
                                    </div>
                                  </Col>
                                </Row>
                              </div>

                              {
                                s.is_show && s.content.map((q, qIndex) => {
                                  return (
                                    <div
                                      className={styles.content}
                                      style={{
                                        margin: '0 auto 10px',
                                        // padding: '10px',
                                        overflow: 'hidden',
                                        // borderBottom: subject.length > 1 ? '1px dashed #e8e8e8' : 'none',
                                        // boxShadow: '1px 1px 5px rgba(0, 0, 0, .15)',
                                        width: '100%',
                                        position: 'relative',
                                        border: '1px dashed #999',
                                        padding: '10px 20px'
                                      }}
                                      key={q.index}
                                    >
                                      <div className="ctxbox">
                                        <div className="cleft">
                                        {/* <Row gutter={16}> */}
                                            {
                                              this.props.match.params && this.props.match.params.id && q.append_time ?
                                                
                                                  <FormItem
                                                    // required
                                                    {...textformItemLayout}
                                                    label={<FormattedMessage id="page.meeting.minutes.enddate" defaultMessage="填写日期" />}
                                                  >
                                                    <DatePicker
                                                      disabled
                                                      allowClear={false}
                                                      placeholder="请选择填写日期"
                                                      onChange={(value) => this.handleContentChange(value ? value.format("YYYY-MM-DD") : null, cIndex, sIndex, qIndex, 'append_time')}
                                                      // onChange={date => this.handleFormChange(date ? date.format('YYYY-MM-DD') : null, 'fill_date')}
                                                      // value={this.state.fill_date ? moment(this.state.fill_date) : null}
                                                      value={q.append_time ? moment(q.append_time) : null}
                                                      disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                                                      style={{ width: '100%' }}
                                                    />
                                                  </FormItem>
                                                
                                                :
                                                null
                                            }

                                          {/* </Row> */}
                                          <FormItem required {...textformItemLayout} label={'内容'}>
                                            <TextArea
                                              value={q.content}
                                              onChange={(e) => this.handleContentChange(e.target.value, cIndex, sIndex, qIndex, 'content')}
                                              placeholder="请输入会议纪要内容"
                                              // className="custom"
                                              autosize={{ minRows: 2, maxRows: 6 }}
                                              style={{ minHeight: 32 }}
                                              rows={4}
                                              disabled={q.is_copy}
                                            // style={{ height: 50 }}
                                            // onKeyPress={this.handleKeyPress}
                                            />
                                          </FormItem>

                                          <FormItem
                                            {...textformItemLayout}
                                            label={"附件"}
                                            extra={"附件大小限制15M，格式限制jpg、jpeg、png、gif、bmp、pdf、xlsx、xls、docx、doc、zip"}>
                                            <div style={{ width: '100%' }}>
                                              {
                                                q.is_copy ?
                                                  <Button type="default" size={'small'} disabled><Icon type="upload" /> Upload</Button>
                                                  :
                                                  <span className="btn ant-btn ant-btn-sm" onClick={this.showUpload.bind(this, cIndex, sIndex, qIndex)}><Icon type="upload" /> Upload</span>
                                              }

                                              <Upload
                                                {...props2}
                                                fileList={q.fileList}
                                                beforeUpload={(file, files) => _util.beforeUploadFile(file, files, 3)}
                                                // onPreview={this.handlePreview}
                                                onChange={this.handleUploadChange.bind(this, cIndex, sIndex, qIndex)}
                                                accept='image/*,.pdf,.xlsx,.xls,.docx,.doc,.zip'
                                                // accept='image/*'
                                                disabled={q.is_copy}
                                                showUploadList={{ showRemoveIcon: true, showDownloadIcon: true }}
                                              >
                                                {/* {q.fileList.length < 5 ? uploadButton : null} */}
                                              </Upload>
                                            </div>
                                          </FormItem>
                                        </div>
                                        <div className="cright">
                                          <Row gutter={16}>
                                            <Col className="gutter-row" span={24}>
                                              <FormItem
                                                required
                                                {...formItemLayout}
                                                label={<FormattedMessage id="page.metting.minutes.type" defaultMessage="类型" />}
                                              >
                                                <Select
                                                  style={{ width: '100%' }}
                                                  allowClear
                                                  showSearch
                                                  // onChange={value => this.handleFormChange(value, 'type')}
                                                  onChange={(value) => this.handleContentChange(value, cIndex, sIndex, qIndex, 'content_type')}
                                                  placeholder={formatMessage(translation.select)}
                                                  value={q.content_type}
                                                  disabled={q.is_copy}
                                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                  {
                                                    typelist instanceof Array && typelist.length ? typelist.map((d, index) => {
                                                      return (<Option key={index} value={d.id}>{d.name}</Option>)
                                                    }) : null
                                                  }
                                                </Select>
                                              </FormItem>
                                            </Col>
                                            {
                                              q.content_type == 4 ?
                                                <Fragment>
                                                  <Col className="gutter-row" span={24}>
                                                    <FormItem
                                                      label={<FormattedMessage id="app.page.metting.theme" defaultMessage="任务编号" />}
                                                      {...formItemLayout}
                                                    >

                                                      {/* <Input value={q.task_code} disabled={q.is_copy} onChange={(e) => this.handleContentChange(e.target.value, cIndex, sIndex, qIndex, 'task_code')} placeholder="请输入任务编号" /> */}
                                                      <Select
                                                        allowClear
                                                        showSearch
                                                        // optionFilterProp="children"
                                                        filterOption={false}
                                                        // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                        notFoundContent={this.state.fetching ? <Spin size="small" /> :
                                                          <FormattedMessage id="global.nodata" defaultMessage="暂无数据" />}
                                                        placeholder={'输入任务编号搜索'}
                                                        onSearch={(value) => this.fetchTaskCode(value)}
                                                        // value={q.executive ? q.executive.id + '' : null}
                                                        value={q.task_code && q.task_code + ''}
                                                        disabled={q.is_copy}
                                                        onChange={(value) => this.handleContentChange(value, cIndex, sIndex, qIndex, 'task_id')}
                                                      >

                                                        {
                                                          taskOptions instanceof Array && taskOptions.length ? taskOptions.map((t, index) => {
                                                            return (<Option key={t.id} value={t.id}>{t.name}</Option>)
                                                          }) : (<Option value={q.task_id}>{q.task_code}</Option>)
                                                          
                                                        }

                                                      </Select>
                                                    </FormItem>
                                                  </Col>
                                                  <Col className="gutter-row" span={24}>
                                                    <FormItem
                                                      {...formItemLayout}
                                                      label={<FormattedMessage id="page.meeting.minutes.group" defaultMessage="组织" />}
                                                    >
                                                      <Input value={q.executive} disabled style={{ width: '100%' }} placeholder="" />

                                                    </FormItem>
                                                  </Col>
                                                  <Col className="gutter-row" span={24}>
                                                    <FormItem
                                                      {...formItemLayout}
                                                      label={<FormattedMessage id="page.meeting.minutes.enddate" defaultMessage="截止日期" />}
                                                    >
                                                      <DatePicker
                                                        allowClear={false}
                                                        placeholder=""
                                                        onChange={(value) => this.handleContentChange(value ? value.format("YYYY-MM-DD") : null, cIndex, sIndex, qIndex, 'dead_day')}
                                                        // onChange={date => this.handleFormChange(date ? date.format('YYYY-MM-DD') : null, 'start_date')}
                                                        // value={this.state.start_date ? moment(this.state.start_date) : null}
                                                        value={q.dead_day ? moment(q.dead_day) : null}
                                                        disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                                                        style={{ width: '100%' }}
                                                        disabled={true}
                                                      />
                                                    </FormItem>
                                                  </Col>

                                                </Fragment>
                                                :
                                                null
                                            }
                                          </Row>

                                          
                                        </div>
                                      </div>


                                      {/* <Row gutter={16}>
                                        <Col className="gutter-row" span={24}>
                                          
                                        </Col>
                                      </Row>

                                      <Row gutter={16}>
                                        <Col className="gutter-row" span={24}>
                                          
                                        </Col>
                                      </Row> */}

                                      <div className={styles.operate} style={{ position: 'absolute', bottom: '10px', right: '0', width: '300px', padding: '5px 0' }}>
                                        <Button className="sbtn" type="dashed" onClick={() => this.addContent(cIndex, sIndex, qIndex)}>
                                          <Icon type="plus" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="添加" />
                                        </Button>
                                        {
                                          s.content.length > 1 ?
                                            <Button className="sbtn" type="dashed" onClick={() => this.deleteContent(cIndex, sIndex, qIndex)} style={{ marginLeft: '10px' }}>
                                              <Icon type="minus" /> 删除
                                            </Button>
                                            :
                                            null
                                        }
                                        <Button className="sbtn" type="dashed" onClick={() => this.moveUpContent(cIndex, sIndex, qIndex)} style={{ marginLeft: '10px' }}>
                                          <Icon type="arrow-up" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="上移" />
                                        </Button>
                                        <Button className="sbtn" type="dashed" onClick={() => this.moveDownContent(cIndex, sIndex, qIndex)} style={{ marginLeft: '10px' }}>
                                          <Icon type="arrow-down" /> <FormattedMessage id="page.meeting.minutes.add" defaultMessage="下移" />
                                        </Button>
                                      </div>

                                    </div>
                                  )
                                })
                              }
                            </Fragment>
                          )
                        })
                      }
                      {/* <Divider></Divider> */}
                    </Fragment>
                  )
                })
              }

              <Modal
                className="meetingmodal"
                title={'附件上传'}
                visible={uploadVisiable}
                onOk={this.handleUploadSubmit}
                onCancel={this.hideUpload}
                okText={'保存'}
                cancelText={'取消'}
                maskClosable={false}
                okButtonProps={null}
                destroyOnClose={true}
                bodyStyle={{ paddingTop: 0 }}
              >
                <Tabs defaultActiveKey="1" onChange={(activeKey) => this.handleUploadType(activeKey)}>
                  <TabPane tab="本地上传" key="1">
                    <FormItem
                      labelCol={{ span: 5 }}
                      wrapperCol={{ span: 15 }}
                      label={'选择文件'}
                      required={true}
                    >
                      <Upload
                        {...props2}
                        // fileList={fileList&&fileList.length > 0 ? [fileList[fileList.length - 1]] : fileList}
                        fileList={fileList}
                        //beforeUpload={_util.beforeUpload}
                        onChange={this.fileUpload}
                      >
                        {
                          fileList && fileList.length < 5 ?
                            <Button>
                              <Icon type="upload" />上传
                          </Button>
                            :
                            null
                        }

                      </Upload>
                    </FormItem>

                  </TabPane>
                  <TabPane tab="临时目录" key="2">
                    <FormItem
                      {...formItemLayout}
                      // labelCol={{ span: 5 }} 
                      // wrapperCol={{ span: 15 }} 
                      label={'选择文件'}
                      required={true}
                    // extra={'请输入文档编号或文档名称搜索'}
                    >
                      <Select
                        allowClear
                        mode='multiple'
                        style={{ width: '100%' }}
                        onSelect={(value) => this.handleSelectTemp(value)}
                        onDeselect={(value) => this.handleDeSelectTemp(value)}
                        showSearch
                        placeholder={'请输入文档编号或文档名称搜索'}
                        value={temp_value ? temp_value : []}
                        optionFilterProp="children"
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        filterOption={false}
                        onSearch={this.fetchTemp}
                      >
                        {
                          temp_list && temp_list.length ? temp_list.map(d => {
                            return <Option key={d.code} value={d.code} title={d.name}><span>{d.code}-{d.name}</span></Option>
                          }) : []
                        }
                      </Select>
                      <Upload
                        {...props2}
                        // fileList={fileList&&fileList.length > 0 ? [fileList[fileList.length - 1]] : fileList}
                        fileList={fileList}
                        //beforeUpload={_util.beforeUpload}
                        onChange={this.fileUpload}
                      >
                      </Upload>

                    </FormItem>

                  </TabPane>
                  <TabPane tab="注册文档" key="3">
                    <FormItem
                      // labelCol={{ span: 5 }} 
                      // wrapperCol={{ span: 15 }} 
                      {...formItemLayout}
                      label={'选择文件'}
                      required={true}
                    >
                      <Select
                        allowClear
                        mode='multiple'
                        style={{ width: '100%' }}
                        onSelect={(value) => this.handleSelectRegister(value)}
                        onDeselect={(value) => this.handleDeSelectRegister(value)}
                        showSearch
                        placeholder={'请输入文档编号或文档名称搜索'}
                        value={register_value ? register_value : []}
                        optionFilterProp="children"
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        filterOption={false}
                        onSearch={this.fetchRegister}
                      >
                        {
                          register_list && register_list.length ? register_list.map(d => {
                            return <Option key={d.code} value={d.code} title={d.name}><span>{d.code}-{d.name}</span></Option>
                          }) : []
                        }
                      </Select>
                      <Upload
                        {...props2}
                        // fileList={fileList&&fileList.length > 0 ? [fileList[fileList.length - 1]] : fileList}
                        fileList={fileList}
                        //beforeUpload={_util.beforeUpload}
                        onChange={this.fileUpload}
                      >
                      </Upload>
                    </FormItem>

                  </TabPane>
                </Tabs>
              </Modal>

              <FormItem {...submitFormLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  <Button type="primary" loading={confirmLoading}
                    style={{ marginRight: "10px" }}
                    onClick={this.handleSubmit}
                  >
                    <FormattedMessage id="app.button.save" defaultMessage="保存" />
                  </Button>
                  {/* <GoBackButton props={this.props} /> */}
                  <Button onClick={() => this.goBack()}>返回</Button>
                </div>
              </FormItem>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

const MeetingAdd = Form.create()(MeetingAddForm);

export default MeetingAdd;
