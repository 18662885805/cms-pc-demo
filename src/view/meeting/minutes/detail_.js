import React, { Fragment } from "react";
import { Form, Button, Modal, Spin, message, Tree, Select, Row, Col, Divider, Input, DatePicker, Upload, Icon, Anchor } from "antd";
import { inject, observer } from "mobx-react/index";
import CommonUtil from "@utils/common";
import MyBreadcrumb from "@component/bread-crumb";
import FormData from "@component/FormData";
// import { rolePost, rolePut, rolePermission, roleDetail } from "@apis/system/role";
import { MeetingMinutesPost, MeetingMinutesPut, MeetingMinutesDetail } from "@apis/meeting/minutes";
import { SearchProjectUser } from "@apis/system/user";
import GoBackButton from "@component/go-back";
import groupBy from "lodash/groupBy";
import { debounce, uniq, cloneDeep } from "lodash";
import { interviewee } from "@apis/event/interviewee";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import { GetTemporaryKey } from "@apis/account/index"
import FilePicList from "@component/FilePicList";
import styles from './index.module.css'
import translation from '../translation'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const { Option } = Select;
const { TextArea } = Input;
const { Link } = Anchor;
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
      // personlist: [],
      fileList: [],
      meeting: [{
        theme: '',
        topic: [{ name: '', content: [{ index: 0, name: '', source: [], fileList: [], append_time: null }] }]
      }],
      // meeting: [{
      //   theme: '',
      //   topic: [{ index: 0, name: '', content: [{ index: 0, name: '' }] }]
      // }],
      anchorList: [{index: 0, title: ''}],
      project_name: _util.getStorage('project_name'),
      fill_date: new Date()
    };
    this.lastFetchId = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
    // this.handleUploadChange = this.handleUploadChange.bind(this);
  }

  componentDidMount() {

    const { id } = this.props.match.params;

    if (id) {
      let _this = this
      MeetingMinutesDetail(id, {project_id: _util.getStorage('project_id')}).then((res) => {
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
                append_time: o.append_time ? o.append_time : null
              })
            });
          }
          return tempObj;
        };

        content.forEach(a => {
          targetArr.push(getValue(a));
        });

        let anchorList = []
        content.map((d,index) => {
          anchorList.push({index: index, title: d.name})
        })
        _this.setState({anchorList})

        // console.log(targetArr)
        _this.setState({
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

    _util.setSession('menufrom', this.props.menuState.menuCurrentUrl);
    this.setState({
      spinLoading: false
    });
    console.log(this.props.menuState.menuCurrentUrl)
    this.props.menuState.changeMenuCurrentUrl("/meeting/minutes");
    this.props.menuState.changeMenuOpenKeys("/meeting");
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps)
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
                  // console.log(obj)
                  const key = obj && obj.url;
                  var url = cos.getObjectUrl({
                    Bucket: 'ecms-1256637595',
                    Region: 'ap-shanghai',
                    Key: key,
                    Sign: true,
                  }, function (err, data) {
                    if (data && data.Url) {
                      // console.log(data.Url)
                      source_list.push({
                        uid: -(index + 1),
                        name: obj.name,
                        status: 'done',
                        url: data.Url,
                        thumbUrl: data.Url,
                        response: {
                          content: {
                            results: {
                              url: data.Url
                            }
                          }
                        }
                      })

                      if (meeting[aIndex].topic[bIndex].content[cIndex]) {
                        meeting[aIndex].topic[bIndex].content[cIndex].fileList = source_list
                        _this.setState({ meeting })
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
    console.log(info, cIndex, sIndex, qIndex)
    let { fileList } = info
    console.log(fileList)
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
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        // console.log(file.response.file_name)
        file.url = file.response.file_name;
        // file.url = _util.getImageUrl(file.response.content.results.url);
      }
      return file;
    });

    // meeting[cIndex].topic[sIndex].content[qIndex][field] = value

    // // onUploadFileOk
    const { meeting } = this.state
    let source = []
    if (fileList instanceof Array) {
      fileList.forEach((value) => {
        // source.push(value.response && value.response.file_name)
        source.push({ name: value.name, url: value.response && value.response.file_name })
      })
    }
    meeting[cIndex].topic[sIndex].content[qIndex].source = source
    // question[index].children.filter(c => c.id == uuid)[0].file_path = source.length ? source.join(',') : ''

    meeting[cIndex].topic[sIndex].content[qIndex].fileList = fileList

    // onUploadFileOk
    // if (fileList && fileList.length) {
    //   var _this = this;
    //   let source_list = []
    //   var cos = _util.getCos(null, GetTemporaryKey);
    //   fileList.map((obj, index) => {
    //     console.log(obj)
    //     const key = obj.response && obj.response.file_name;
    //     var url = cos.getObjectUrl({
    //       Bucket: 'ecms-1256637595',
    //       Region: 'ap-shanghai',
    //       Key: key,
    //       Sign: true,
    //     }, function (err, data) {
    //       if (data && data.Url) {
    //         console.log(data.Url)
    //         source_list.push({
    //           uid: -(index + 1),
    //           name: obj.name,
    //           status: 'done',
    //           url: data.Url,
    //           thumbUrl: data.Url,
    //           response: {
    //             content: {
    //               results: {
    //                 url: data.Url
    //               }
    //             }
    //           }
    //         })
    //         meeting[cIndex].topic[sIndex].content[qIndex].fileList = source_list
    //       }
    //     });
    //   })
    // }

    this.setState({
      meeting,
      fileList
      // uploadVisible: false,
      // fileList: []
    }, () => {
      console.log(this.state.meeting)
    })

  }

  handleSubmit(e) {
    const { search_id } = this.state;
    const { formatMessage } = this.props.intl;
    e.preventDefault();
    this.setState({
      confirmLoading: true
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let _this = this;
        const { formatMessage } = this.props.intl;
        const { meeting } = this.state

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
          // tempObj.key = obj.id;
          if (obj.content && obj.content.length) {
            tempObj.children = [];
            obj.content.map(o => {
              tempObj.children.push({
                content_type: o.content_type,
                content: o.content,
                executive: o.executive,
                dead_day: o.dead_day,
                source: o.source,
                task_type: o.task_type,
                task_code: o.task_code ? o.task_code : '',
                append_time: o.append_time ? o.append_time : null
              })
            });
          }
          return tempObj;
        };

        meeting.forEach(a => {
          targetArr.push(getValue(a));
        });
        // console.log(targetArr)
        const { participant, distributor, host, recorder, meeting_day, meeting_area } = this.state
        let params = {
          project_id: _util.getStorage('project_id'),
          meeting_type: this.props.location.state.typeId,
          name: values.name,
          participant: values.participant.join(','),
          distributor: values.distributor.join(','),
          host: values.host.join(','),
          recorder: values.recorder,
          meeting_day: values.meeting_day ? moment(values.meeting_day).format('YYYY-MM-DD') : meeting_day,
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
            // values.project_id = _util.getStorage('project_id')
            // console.log(_this.state.checkedKeys)
            // values.permission = _this.state.checkedKeys.filter(k => k && k.indexOf("-") < 0).join(",");
            // values.permission = _this.state.checkedKeys.filter(k => k.indexOf("$") < 0).join(",");
            // values.search_id = search_id;
            const { id } = _this.props.match.params;
            if (id) {
              // values.project_id = _util.getStorage('project_id')
              MeetingMinutesPut(id, params).then((res) => {
                message.success(formatMessage(translation.saved));
                _this.props.history.goBack();
              });
              return;
            }

            MeetingMinutesPost(params).then((res) => {
              message.success(formatMessage(translation.saved));
              _this.props.history.goBack();
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
      autoExpandParent: false
    });
  }

  renderTreeNodes = (data) => {
    if (data && data instanceof Array) {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} />;
      });
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
    const { meeting } = this.state
    let index = meeting.length;
    meeting.push({
      theme: '',
      topic: [{ index: 0, name: '', content: [{ index: 0, name: '', source: [], fileList: [], append_time: null }] }]
    })
    this.setState({
      meeting
    })
  }

  deleteTheme = (index) => {
    const { meeting } = this.state
    meeting.splice(index, 1)
    this.setState({
      meeting
    })
  }

  addTopic = (cIndex) => {
    const { meeting } = this.state
    let index = meeting[cIndex].topic.length;
    meeting[cIndex].topic.push({ index: index, name: '', content: [{ index: 0, name: '', source: [], fileList: [], append_time: null }] })
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
    meeting[cIndex].topic[sIndex].content.push({ index: index, name: '', source: [], fileList: [], append_time: null })
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
    const { meeting } = this.state
    // console.log(e.target.value)
    meeting[cIndex].theme = e.target.value
    this.setState({ meeting })
  }

  handleContentChange = (value, cIndex, sIndex, qIndex, field) => {
    console.log(value)
    const { meeting } = this.state
    if (field == 'executive') {
      let obj = this.state.searchOptions.filter(d => d.id == value)[0]
      console.log(obj)
      meeting[cIndex].topic[sIndex].content[qIndex][field] = obj
      this.setState({ meeting })
    } else {
      meeting[cIndex].topic[sIndex].content[qIndex][field] = value
      this.setState({ meeting })
    }
  }

  printPage() {
    //const printHtml = this.refs.print.innerHTML;//这个元素的样式需要用内联方式，不然在新开打印对话框中没有样式
    // window.print('printHtml');
     window.print();
}

  genPDF = () => {
    const printHtml = this.refs.print.innerHTML;
    const { formatMessage } = this.props.intl;
    let date = moment(new Date()).format('YYYYMMDDHHmm')
    const opt = {
        margin:       0.3,
        filename:     `会议纪要${date}.pdf`,
        // filename:     formatMessage({ id:"app.page.meeting.minutes", defaultMessage:"会议纪要"}),
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 , useCORS: true},
        jsPDF:        { unit: 'in', orientation: 'portrait', format: 'a4', },
        // pagebreak:    { mode: ['avoid-all'] }
    }
    html2pdf().set(opt).from(printHtml).save()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { confirmLoading, spinLoading, treeData, name, name_en, desc, desc_en, principal, permission, userdata, searchOptions, fileList,
      participant, distributor, host, recorder, meeting_day, meeting_area } = this.state;
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
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
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
        sm: { span: 10, offset: 7 },
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
      // {
      //   field: "org",
      //   type: "select",
      //   icon: "",
      //   value: null,
      //   text: "组织",
      //   placeholder: "组织",
      //   options: [],
      //   rules: [{required: true, message: "请选择组织"}]
      // },
      {
        field: "name",
        type: "char",
        icon: "",
        value: name ? name : null,
        text: "会议名称",
        placeholder: "会议名称",
        rules: [{ required: true, message: "请输入会议名称" }],
        disabled: true
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
        rules: [{ required: true, message: "请选择出席人" }],
        disabled: true
      },
      {
        field: "distributor",
        type: "search",
        mode: "multiple",
        icon: "",
        value: distributor ? distributor.map(d => { return d.id + '' }) : null,
        // value: '',
        text: "分发人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: searchOptions && searchOptions.length ? searchOptions : distributor,
        fetchUser: (value) => this.fetchUser(value),
        rules: [{ required: true, message: "请选择分发人" }],
        disabled: true
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
        rules: [{ required: true, message: "请选择主持人" }],
        disabled: true
      },
      {
        field: "recorder",
        type: "search",
        // mode: "multiple",
        icon: "",
        value: recorder ? recorder.id + '' : '',
        text: "记录人",
        placeholder: "根据姓名、手机搜索项目用户",
        options: recorder ? [recorder] : searchOptions,
        fetchUser: (value) => this.fetchUser(value),
        rules: [{ required: true, message: "请选择记录人" }],
        disabled: true
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
        rules: [],
        disabled: true
      },
      {
        field: "meeting_area",
        type: "char",
        icon: "",
        value: meeting_area ? meeting_area : null,
        text: "会议地点",
        placeholder: "会议地点",
        rules: [],
        disabled: true
      },
      // {
      //   field: "tree",
      //   type: "tree",
      //   icon: "",
      //   value: null,
      //   text: "权限",
      //   placeholder: "",
      //   trees: treeData,
      //   expandedKeys: this.state.expandedKeys,
      //   autoExpandParent: this.state.autoExpandParent,
      //   onCheck: this.onCheck,
      //   onExpand: this.onExpand,
      //   checkedKeys: this.state.checkedKeys,
      //   selectedKeys: this.state.selectedKeys,
      //   renderTreeNodes: value => this.renderTreeNodes(value),
      //   rules: []
      // },
      // {
      //   field: "principal",
      //   type: "search",
      //   icon: "",
      //   value: principal ? principal.id+'' : null,
      //   text: "角色审批人",
      //   placeholder: "根据姓名、手机、邮箱搜索项目用户",
      //   options: this.state.searchOptions,
      //   rules: [{required: true, message: "请选择角色审批人！"}]
      // },
    ]

    const { id } = this.props.match.params
    // const bread = [
    //   {
    //     name: <FormattedMessage id="app.page.bread.home" defaultMessage="首页" />,
    //     url: '/'
    //   },
    //   {
    //     name: <FormattedMessage id="app.page.bread.meeting" defaultMessage="会议管理" />
    //   },
    //   {
    //     name: <FormattedMessage id="app.page.bread.meetingminutes" defaultMessage="会议纪要" />,
    //     url: '/meeting/minutes'
    //   },
    //   {
    //     name: id ? <FormattedMessage id="app.page.bread.edit" defaultMessage="修改" /> : <FormattedMessage id="app.page.bread.add" defaultMessage="新增" />
    //   }
    // ]

    const typelist = [
      { id: 1, name: '无' },
      { id: 2, name: '信息' },
      { id: 3, name: '决定' },
      { id: 4, name: '任务' }
    ]

    const tasklist = [
      { id: 1, name: '普通任务' },
      { id: 2, name: '重要任务' }
    ]

    const props = {
      multiple: true,
      accept: 'image/*,.pdf,.xlsx,.xls,.docx,.doc,.zip',
      action: _util.getServerUrl('/upload/card/'),
      headers: {
        Authorization: 'JWT ' + _util.getStorage('token')
      },
      data: {
        site_id: _util.getStorage('site')
      },
      className: 'upload-list-inline',
    }

    return (
      <div>
        <MyBreadcrumb />
        <div className="content-wrapper content-no-table-wrapper meeting" style={{position: 'static'}}>
          <div className={styles.printarea} ref="print">
            {/* <Form className={_util.getENV() === 'prod' ? styles.bjcover : styles.mjkcover}> */}
            <Form>

              <div style={{ display: 'flex', alignItems: 'baseline',justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>{this.state.project_name}项目</h2>
                {/* <h2 className="noprint">会议编号：{this.state.code}</h2> */}
                <h2 style={{fontSize: '14px'}}>eCMS电子会议纪要：<span>{this.state.code}</span></h2>
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
                            // hasFeedback
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
                            // hasFeedback
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
                            // title={item.title ? `${item.index+1}.${item.title}` : ''} 
                            title={`${item.index+1}. ${item.title}`} 
                        />
                          ))                           
                      }
                      </Anchor>
                    </Col>
                  </Row>
                </div>
              <Divider className={styles.noprint}></Divider>

              {

                this.state.meeting.map((c, cIndex) => {
                  return (
                    <Fragment>
                      <div
                        // className={styles.theme}
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
                              <Input value={c.theme} disabled onChange={(e) => this.handleThemeChange(e, cIndex)} style={{ width: '100%' }} placeholder="请输入会议主题" />

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
                                // className={styles.topic}
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
                                      {/* {getFieldDecorator('title', {
                                        rules: [{
                                          required: true,
                                          message: '请输入标题',
                                        }],
                                      })( */}
                                      <Input placeholder="请输入标题" value={s.name} disabled onChange={e => this.handleTopicChange(e, cIndex, sIndex, 'name')} />
                                      {/* )} */}
                                    </FormItem>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                    <div className={styles.operate} style={{ position: 'absolute', top: '0', right: '0', width: '300px', padding: '5px 0' }}>
                                      
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
                                    </div>
                                  </Col>
                                </Row>
                              </div>

                              {
                                s.content.map((q, qIndex) => {
                                  return (
                                    <div
                                      // className={styles.content}
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
                                      <Row gutter={16}>
                                        <Col className="gutter-row" span={8}>
                                          <FormItem
                                            required
                                            {...formItemLayout}
                                            label={<FormattedMessage id="page.metting.minutes.type" defaultMessage="类型" />}
                                          >
                                            <Select
                                              disabled
                                              allowClear
                                              showSearch
                                              // onChange={value => this.handleFormChange(value, 'type')}
                                              onChange={(value) => this.handleContentChange(value, cIndex, sIndex, qIndex, 'content_type')}
                                              placeholder={formatMessage(translation.select)}
                                              value={q.content_type}
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
                                        <Col className="gutter-row" span={8}>
                                          <FormItem
                                            {...formItemLayout}
                                            label={<FormattedMessage id="page.meeting.minutes.todo" defaultMessage="执行人" />}
                                          >
                                            <Select
                                              allowClear
                                              showSearch
                                              // mode='multiple'
                                              // optionFilterProp="children"
                                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                              notFoundContent={this.state.fetching ? <Spin size="small" /> :
                                                <FormattedMessage id="global.nodata" defaultMessage="暂无数据" />}
                                              placeholder={'输入姓名或者手机号搜索'}
                                              onSearch={(value) => this.fetchUser(value)}
                                              // value={q.executive ? q.executive.id + '' : null}
                                              value={q.executive && q.executive.id + ''}
                                              onChange={(value) => this.handleContentChange(value, cIndex, sIndex, qIndex, 'executive')}
                                              // onChange={value => this.handleFormChange(value, '')}
                                              disabled
                                            >
                                              {
                                                searchOptions && searchOptions.length ?
                                                  Array.isArray(this.state.searchOptions) && this.state.searchOptions.map((d, index) =>
                                                    <Option title={d.id} key={d.id}>
                                                      {this.searchConcat(d)}
                                                    </Option>)

                                                  :
                                                  q.executive && Array.isArray([q.executive]) && [q.executive].map((d, index) =>
                                                    <Option title={d.id} key={d.id}>
                                                      {this.searchConcat(d)}
                                                    </Option>)

                                              }

                                            </Select>
                                          </FormItem>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                          <FormItem
                                            {...formItemLayout}
                                            label={<FormattedMessage id="page.meeting.minutes.enddate" defaultMessage="完成日期" />}
                                          >
                                            <DatePicker
                                              allowClear={false}
                                              placeholder="请选择完成日期"
                                              onChange={(value) => this.handleContentChange(value ? value.format("YYYY-MM-DD") : null, cIndex, sIndex, qIndex, 'dead_day')}
                                              // onChange={date => this.handleFormChange(date ? date.format('YYYY-MM-DD') : null, 'start_date')}
                                              // value={this.state.start_date ? moment(this.state.start_date) : null}
                                              value={q.dead_day ? moment(q.dead_day) : null}
                                              disabledDate={(current) => moment(current).isBefore(moment().format('YYYY-MM-DD'))}
                                              style={{ width: '100%' }}
                                              disabled
                                            />
                                          </FormItem>
                                        </Col>
                                      </Row>

                                      <Row gutter={16}>
                                        {
                                          this.props.location.state && this.props.location.state.templateId ?
                                            <Col className="gutter-row" span={8}>
                                              <FormItem
                                                // required
                                                {...formItemLayout}
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
                                                  disabled
                                                />
                                              </FormItem>
                                            </Col>
                                            :
                                            null
                                        }

                                        {
                                          q.content_type == 4 ?
                                            <Fragment>
                                              <Col className="gutter-row" span={8}>
                                                <FormItem
                                                  label={<FormattedMessage id="app.page.metting.theme" defaultMessage="任务编号" />}
                                                  {...formItemLayout}
                                                >

                                                  <Input value={q.task_code} disabled onChange={(e) => this.handleContentChange(e.target.value, cIndex, sIndex, qIndex, 'task_code')} placeholder="请输入任务编号" />

                                                </FormItem>
                                              </Col>

                                            </Fragment>
                                            :
                                            null
                                        }
                                      </Row>

                                      <Row gutter={16}>
                                        <Col className="gutter-row" span={24}>
                                          {/* <FormItem {...formItemLayout} label={`${cIndex + 1}.${qIndex + 1}内容`}> */}
                                          <FormItem required {...textformItemLayout} label={'内容'}>
                                            <TextArea
                                              value={q.content}
                                              onChange={(e) => this.handleContentChange(e.target.value, cIndex, sIndex, qIndex, 'content')}
                                              placeholder="请输入会议纪要内容"
                                              // className="custom"
                                              // autosize={{minRows: 2, maxRows: 6}}
                                              style={{ minHeight: 32 }}
                                              rows={4}
                                              // style={{ height: 50 }}
                                              // onKeyPress={this.handleKeyPress}
                                              disabled
                                            />
                                          </FormItem>
                                        </Col>
                                      </Row>

                                      <Row gutter={16}>
                                        <Col className="gutter-row" span={24}>
                                          <FormItem
                                            {...textformItemLayout}
                                            label={"附件"}
                                            // extra={"附件大小限制15M，格式限制jpg、jpeg、png、gif、bmp、pdf、xlsx、xls、docx、doc、zip"}
                                          >
                                            <div style={{ width: '100%' }}>
                                              {/* <Upload
                                                {...props2}
                                                listType="picture-card"
                                                fileList={q.fileList}
                                                beforeUpload={(file, files) => _util.beforeUploadFile(file, files, 3)}
                                                // onPreview={this.handlePreview}
                                                onChange={this.handleUploadChange.bind(this, cIndex, sIndex, qIndex)}
                                                accept='image/*,.pdf,.xlsx,.xls,.docx,.doc,.zip'
                                                // accept='image/*'
                                                disabled
                                              >
                                                
                                              </Upload> */}
                                              
                                              <FilePicList fileList={q.fileList} />
                                              {/* <Upload
                                                {...props}
                                                beforeUpload={_util.beforeUploadFile}
                                                onChange={this.handleUploadFile}
                                                fileList={fileList}
                                                className='upload-list-inline'
                                              >
                                                <Button>
                                                  <Icon type="upload" /> Upload
                                                </Button>
                                              </Upload> */}
                                            </div>
                                          </FormItem>
                                        </Col>
                                      </Row>

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

              {/* <FormItem {...submitFormLayout}>
                <div style={{ width: "100%", marginBottom: "20px" }}>
                  
                  <Button type='primary' style={{marginRight: '10px'}} onClick={this.genPDF}><FormattedMessage id="component.tablepage.exportPDF" defaultMessage="导出PDF" /></Button>
                  
                  <GoBackButton props={this.props} />
                </div>
              </FormItem> */}
            </Form>
          </div>

          <div style={{
            width: '100%', 
            marginTop: '20px', 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: 20
            }}>
                <Button type='primary' style={{marginRight: '10px'}} onClick={this.genPDF}><FormattedMessage id="component.tablepage.exportPDF" defaultMessage="导出PDF" /></Button>
                <Button type="primary" style={{marginRight: '10px'}} onClick={this.printPage}>打印</Button>
                <GoBackButton props={this.props} noConfirm/>
          </div>

        </div>

      </div>
    );
  }
}

const MeetingAdd = Form.create()(MeetingAddForm);

export default MeetingAdd;
