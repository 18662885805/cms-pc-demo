import React from "react";
import {
  Icon,
  Input as AntInput,
  Select,
  DatePicker,
  InputNumber,
  Cascader,
  Tooltip,
  TimePicker,
  message,
  Spin,
  notification,
  Checkbox,
  Row,
  Col,
  Switch,
  Tag,
  Upload,
  Button,
  Tree
} from "antd";
import { FormattedMessage } from "react-intl";
import intl from "react-intl-universal";
import moment from "moment";
import inputDecorate from "@component/input-decorate";
import ViewPwd from "@component/ViewPwd";
import {throttle} from "lodash";
import JSEncrypt from "jsencrypt";
import groupBy from "lodash/groupBy";
import COS from 'cos-js-sdk-v5'

// import XLSX from 'xlsx'
const {Option} = Select;
const {TextArea} = AntInput;
const TreeNode = Tree.TreeNode;
const Input = inputDecorate(AntInput);

const toString = Object.prototype.toString;

let baseUrl = "";
let env = process.env;
if (env.NODE_ENV === "development") {
  baseUrl = "https://testpc.mjk24.com";
} else{
  if(env.REACT_APP_ENV === "test"){
    baseUrl = "https://testpc.mjk24.com";
  }
  if(env.REACT_APP_ENV === "prod"){
    baseUrl = "https://testpc.mjk24.com";
  }
}

class CommonUtil {
  fixTableHead() {
    const tableWrapper = document.querySelector("#root .ant-table-body");
    const tableHead = document.querySelector("#root .ant-table-body thead");
    const tr = tableHead.querySelector("tr");
    const cloneTr = tr.cloneNode(true);
    cloneTr.id = "temp-tr";

    tableWrapper.addEventListener("scroll", throttle(e => this.handleTableScroll(e, tableHead, tr, cloneTr), 100));
  }

    handleTableScroll = (e, tableHead, tr, cloneTr) => {
      const tableBody = document.querySelector("#root .ant-table-body tbody");
      const tbodyTr = tableBody.getElementsByTagName("tr")[0];
      const tdWidth = [];
      tbodyTr && tbodyTr.querySelectorAll("td").forEach(td => { //th获取宽度不准确，所以用td来获取宽度
        tdWidth.push(td.offsetWidth);
      });

      if (e.target.scrollTop > 36) {
        tableHead.insertBefore(cloneTr, tr);
        tr.id = "tr-fixed";
        tr.style.left = tr.pageX + "px";
        tr.querySelectorAll("th").forEach((th, index) => {
          th.style.width = tdWidth[index] + "px"; //用td获取的宽度设置th的宽度
          th.style.display = "inline-block";
        });

      } else {
        const tempTr = document.getElementById("temp-tr");
        if (tempTr) {
          tableHead.removeChild(tempTr);
        }
        tr.id = "";
        tr.querySelectorAll("th").forEach(th => {
          th.style.width = "";
          th.style.display = "table-cell";
        });
      }

    }
    // // 获取请求url地址
    replace_str(old_str, front_len, end_len) {
      let length = old_str.length - front_len - end_len;
      let sub_str = "";
      for (let i = 0; i < length; i++) {
        sub_str += "*";
      }
      return old_str.substring(0, front_len) + sub_str + old_str.substring(front_len + length);
    }

    hide_id_num(id_num) {
      if (id_num) {
        const length = id_num.length;
        if (length > 14) {
          return this.replace_str(id_num, 6, length - 14);
        }
        if (length > 7) {
          return this.replace_str(id_num, 7, 0);
        }
        if (length > 5) {
          return this.replace_str(id_num, 5, 0);
        }
      }
      return id_num;
    }

    getServerUrl(path) {
      return "/v1" + path;
    }

    // 获取图片地址
    getImageUrl(path) {
      // console.log(process.env)
      //return 'https://efcm.mjk24.com/source/' + path
      //return 'https://efm.mjk24.com/source/' + path
      // return baseUrl + "/source/" + path;
      return baseUrl + "/" + path;
    }

    //实例化腾讯云COS
    getCos(key,fn){
      var timestamp = (new Date()).valueOf();
      var that  = this;
      var cos = new COS({
        getAuthorization: function (options, callback) {
          const UploadExpiredTime =  that.getStorage('UploadExpiredTime');
          if(UploadExpiredTime&&timestamp < UploadExpiredTime){
            //未过期
            callback({
              TmpSecretId: that.getStorage('tmpSecretId'),
              TmpSecretKey:  that.getStorage('TmpSecretKey'),
              XCosSecurityToken: that.getStorage('XCosSecurityToken'),
              StartTime: timestamp, 
              ExpiredTime:that.getStorage('UploadExpiredTime'), 
            });
          }else{
            //过期
            fn().then((res) => {
              if(res.data){
                const {credentials,expiredTime,startTime} = res.data;
                that.setStorage('UploadExpiredTime',expiredTime)
                const {sessionToken,tmpSecretId,tmpSecretKey} = credentials;
                callback({
                  TmpSecretId: tmpSecretId,
                  TmpSecretKey: tmpSecretKey,
                  XCosSecurityToken: sessionToken,
                  StartTime: startTime, 
                  ExpiredTime: expiredTime, 
                });
              }
            })
          } 
       }
      });
      return cos
    }

    //Cos图片列表上传格式转化
    setSourceList(fileList){
      let source = []
      if (fileList instanceof Array) {
        fileList.forEach((value,index) => {
          if(value.cosKey){
            source.push({name:value.name,url:value.cosKey})
          }else if(value.response){
            source.push({name:value.name,url:value.response.file_name})
          }          
        })
      }
      return source
    }

    //转换cosKey格式
    setCosKeyFileList(fileList){
      let new_fileList = []
      if (fileList instanceof Array) {
        fileList.map((file,fIndex) => {
            if(file.response&& !file.cosKey){
              const fileObj = {
                name:file.name,cosKey:file.response.file_name
              }
              new_fileList.push(fileObj)
            }else{
              new_fileList.push(file)
            }
        })
      }
      return new_fileList
    }




    //API接口上传文件(多张)
    uploadApiFilelist(that,info,field){
      let {fileList} = info;
      const status = info.file.status;
      if (status === 'done') {
          message.success(`${info.file.name}上传成功`)
      } else if (status === 'error') {
          message.error(`${info.file.name} ${info.file.response}.`)
      }
      fileList = fileList.map(file => {
          if (file.response) {
              file.url = this.getImageUrl(file.response.file_name);
          }
          return file;
      });
      that.setState({[field]: fileList})
    }

    //API接口上传文件(单张)
    uploadApiFile(that,info,field){
      let {file} = info;
      const status = info.file.status;
      if (status === 'done') {
          message.success(`${info.file.name}上传成功`) 
      } else if (status === 'error') {
        message.error(`${info.file.name} ${info.file.response}.`)
      }
      if (file.response) {
        file.url = this.getImageUrl(file.response.file_name);
      }
      that.setState({[field]:[file]})
    }

    //API文件列表上传格式化
    setAPIsourceList(fileList){
      let source = []
      if (fileList instanceof Array) {
        fileList.forEach((value) => {
          source.push({name:value.name,url:value.response.file_name})
        })
      }
      return source
    }

    //初始化文件列表
    InitializeApiFilelist(that,source,field){
      let new_file_list = [];
      if(source){
        this.switchToJson(source).length ? this.switchToJson(source).map((item,index) => {
          new_file_list.push({
              uid: -[index + 1],
              name: item.name,
              status: 'done',
              url: this.getImageUrl(item.url),
              thumbUrl: this.getImageUrl(item.url),
              response:{file_name:item.url}
          })
        }): [];
      }
      that.setState({[field]: new_file_list})
    }

     //初始化文件列表(腾讯云cos)
    

    //显示证件信息
    setCertificate(that,source,fn){
      source.forEach(c => {
        c.fileList = []
      });
      const certificateData = source;
      that.setState({certificateData})
      var _that = that;
      var cos = this.getCos(null,fn);
      certificateData.map((c, cIndex) => {
          if(c.file){
              //转换前端格式  
              if(!this.switchToJson(c.file).length){
                _that.setState({certificateLoading:false})
                return
              } 
              if(!this.switchToJson(c.file)[0]['url']){
                _that.setState({certificateLoading:false})
                return
              }
              const file_list = this.switchToJson(c.file);
              if(file_list&&file_list.length){
                file_list.map((s,sIndex) => {
                  const key = s.url;
                  var url = cos.getObjectUrl({
                      Bucket: 'ecms-1256637595',
                      Region: 'ap-shanghai',
                      Key:key,
                      Sign: true,
                  }, function (err, data) {
                      if(data && data.Url){   
                          //获取成功
                          const {fileList} = c; 
                          const newFile =  {url:data.Url,name:s.name,uid:-(sIndex+1),status: "done",cosKey:s.url};  
                          const new_list = [...fileList,newFile];
                          const {certificateData} = _that.state;
                          certificateData[cIndex]['fileList'] = new_list;
                          _that.setState({certificateData,certificateLoading:false})
                      }else{
                          //获取失败
                      }
                  });                             
                });
              }else{
                _that.setState({certificateData,certificateLoading:false})
              }               
          }else{
              c.fileList = [];
              _that.setState({certificateData,certificateLoading:false})
          }  
      });
    }

    //显示cos头像图片
    setAvatar(that,avatar_source,field,fn){
      const fileList = this.switchToJson(avatar_source);
      if(fileList&&fileList.length){
        const key = fileList[0]['url'];
        var _that = that;
        var cos = this.getCos(null,fn);
        var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:key,
            Sign: true,
        }, function (err, data) {
            if(data && data.Url){    
              _that.setState({[field]:data.Url});
            }
        });
      } 
      return     
    }

    setLogo(that,avatar_source,field,fn){
      that.setState({logo_loading:true})
      const fileList = this.switchToJson(avatar_source);
      if(fileList&&fileList.length){
        const key = fileList[0]['url'];
        var _that = that;
        var cos = this.getCos(null,fn);
        var url = cos.getObjectUrl({
            Bucket: 'ecms-1256637595',
            Region: 'ap-shanghai',
            Key:key,
            Sign: true,
        }, function (err, data) {
            if(data && data.Url){    
              _that.setState({[field]:data.Url,logo_loading:false});
            }
        });
      } 
      return     
    }

    //获取cos图片URL
    setCosUrl(that,field,cos,key){
      var url = cos.getObjectUrl({
        Bucket: 'ecms-1256637595',
        Region: 'ap-shanghai',
        Key:key,
        Sign: true,
      }, function (err, data) {
          if(data && data.Url){
            that.setState({field:data.Url})
          }
      });
    }

    checkPermissionKeys(list){
      var r = /^\d+$/;
      var checkedKeys_list = [];
      if(list&&list.length){
        list.forEach(k => {
          if(r.test(k)){
            checkedKeys_list.push(parseInt(k))
          }
        })
      }
      return checkedKeys_list;
    }

    


    cosUpload(info,fileList,fn){
      var timestamp = (new Date()).valueOf();
      var that  = this;
      //注册cos
      var cos = new COS({
        getAuthorization: function (options, callback) {
          const UploadExpiredTime =  that.getStorage('UploadExpiredTime');
          if(UploadExpiredTime&&timestamp < UploadExpiredTime){
            //未过期
            callback({
              TmpSecretId: that.getStorage('tmpSecretId'),
              TmpSecretKey:  that.getStorage('TmpSecretKey'),
              XCosSecurityToken: that.getStorage('XCosSecurityToken'),
              StartTime: timestamp, 
              ExpiredTime:that.getStorage('UploadExpiredTime'), 
            });
          }else{
            //过期
            fn().then((res) => {
              if(res.data){
                const {credentials,expiredTime,startTime} = res.data;
                const {sessionToken,tmpSecretId,tmpSecretKey} = credentials;
                callback({
                  TmpSecretId: tmpSecretId,
                  TmpSecretKey: tmpSecretKey,
                  XCosSecurityToken: sessionToken,
                  StartTime: startTime, 
                  ExpiredTime: expiredTime, 
                });
              }
            })
          } 
       }
      });
      cos.putObject({
        Bucket: 'ecms-1256637595',
        Region: 'ap-shanghai',
        Key:`source/${info.file.uid}`,
        Body: info.file,
        onProgress: function (progressData) {
            console.log('上传中', JSON.stringify(progressData));
        },
      }, function (err, data) {
          console.log(err, data);
          if(data&&data.Location){
            var url = cos.getObjectUrl({
              Bucket: 'ecms-1256637595',
              Region: 'ap-shanghai',
              Key:`source/${info.file.uid}`,
              Sign: true,
            }, function (err, data) {
                console.log(err || data && data.Url);
                if(data && data.Url){
                  console.log('data.Url----------',data.Url);
                  const newFile  = [{
                    uid: -(fileList.length + 1),
                    name: info.file.name,
                    status: 'done',
                    url: `source/${info.file.uid}`,
                    response: {
                      content: {
                        results: {
                          url: `source/${info.file.uid}`
                        }
                      }
                    }
                  }]
                  fileList.push(newFile)
                }
            });
          }
      });
      return fileList
    }

    // 下载链接到本地
    getHrefUrl(path) {
      window.open(baseUrl + "/source/" + path);
      // return baseUrl + '/source/' + path
    }

    // 获取url参数
    getHashParam(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
        queryString = window.location.hash.split("?")[1] || "",
        result = queryString.match(reg);
      return result ? decodeURIComponent(result[2]) : null;
    }

    // 获取路径
    getParam(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
        queryString = window.location.search.split("?")[1] || "",
        result = queryString.match(reg);
      return result ? decodeURIComponent(result[2]) : null;
    }

    // 向本地存储里放数据
    setStorage(name, data) {
      let jsonString = JSON.stringify(data);
      window.localStorage.setItem(name, jsonString);
    }

    // 向本地存储里放数据
    setSession(name, data) {
      let string = JSON.stringify(data);
      window.sessionStorage.setItem(name, string);
    }

    // 从本地存储获取数据
    getStorage(name) {
      let data = window.localStorage.getItem(name);
      if (data && data !== "undefined") {
        // JSON.parse
        return JSON.parse(data);
      } else {
        return "";
      }
    }

    getSession(name) {
      let data = window.sessionStorage.getItem(name);
      if (data) {
        // JSON.parse
        return JSON.parse(data);
      } else {
        return "";
      }
    }

    // 删除本地存储
    removeStorage(name) {
      window.localStorage.removeItem(name);
    }

    removeSession(name) {
      window.sessionStorage.removeItem(name);
    }

    setCookie(cname,cvalue) {
      var date=new Date();
      var days=10;
      date.setTime(date.getTime()+days*24*3600*1000);
      // document.cookie = cname + " = " + cvalue + ";path=/"
      document.cookie = cname + " = " + cvalue + ";path=/;expires=" + date.toGMTString();
    }

    getCookie(name) {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
      } else{
        return null;
      }
    }

    // 跳转登录
    doLogin() {
      if (window.location.pathname === "/login") return "/login";
      if (window.location.pathname === "/404") return "/login";
      if (window.location.pathname === "/500") return "/login";
      if (window.location.pathname === "/403") return "/login";
      if (window.location.pathname === "/needresetpassword") return "/login";
      return "/login?redirect=" + encodeURIComponent(window.location.pathname);
    }


    // 生成表单
    switchItem(item, _this, dateIndex) {
      const type = item.type;
      let prefix = "";
      if (item.icon) {
        prefix = <Icon type={item.icon} style={{color: "rgba(0,0,0,.25)"}}/>;
      }
      switch (type) {
      case "int":
        return <InputNumber placeholder={item.placeholder} prefix={prefix}/>;
      case "textarea":
        return <TextArea placeholder={item.placeholder} disabled={item.disabled} />;
      case "char":
        return <Input
          hidenum={!!((item.field === "id_num" || item.field === "phone"))}
          disabled={item.disabled}
          prefix={prefix}
          placeholder={item.placeholder}
          autoComplete={"off"}
          // onChange={
          //    _this && _this.props && ((_this.props.location && _this.props.location.pathname.search('appointment/fit') > -1 || (_this.props.location && _this.props.location.pathname.search('appointment/cargo') > -1)) && (typeof _this.changeForm === 'function'))
          //         ? e => _this.changeForm(e) : null}
          onChange={item.onChange}/>;
      case "password":
        return <ViewPwd inputName={item.field} placeholder={item.placeholder} disabled={item.disabled} pwd={item.value} onChange={(e) => _this.onChange(e)}/>
      case "email":
        return <Input type='email' prefix={prefix} placeholder={item.placeholder}/>;
      case "datetime":
        return <DatePicker
          disabled={item.disabled}
          placeholder={intl.get("app.commonjs.placeholder.select_date")} 
          showTime
          disabledDate={item.anytime ? '' : (current) => moment(current).isBefore(moment().format("YYYY-MM-DD"))}
          format="YYYY-MM-DD HH:mm" style={{width: "100%"}}/>;
      case "time":
        if (_this.props.location && _this.props.location.pathname.search("temporarycard") > -1) {
          return <TimePicker
            placeholder={intl.get("app.commonjs.placeholder.select_time")}
            format="HH:mm"
            style={{
              width: "100%"
            }}
          />;
        }
        return <TimePicker
          placeholder={intl.get("app.commonjs.placeholder.select_time")}
          format="HH:mm"
          style={{width: "100%"}}
        />;

      case "date":
        return <DatePicker
          // onChange={
          //     item.delayChange ?
          //         _this.onDateChange :
          //         (item.dateIndex === dateIndex ? _this.onDateChangeEnd : _this.onDateChangeStart)}
          // onOpenChange={item.dateIndex === dateIndex ? _this.onDateOpenChange : () => {
          // }}
          onChange={item.onChange}
          placeholder={item.placeholder}
          disabledDate={typeof _this.disabledEndDate === "function" ? _this.disabledEndDate : (current) => moment(current).isBefore(moment().format("YYYY-MM-DD"))}
          format="YYYY-MM-DD" style={{width: "100%"}}
        />;

      case "select":
        return (
          <Select 
          disabled={item.disabled}
          showSearch
          labelInValue={item.obj}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          allowClear
          placeholder={item.placeholder}
          notFoundContent={intl.get("app.commonjs.placeholder.nodata")}
          mode={item.mode ? item.mode : ""}
          onChange={item.onChange}
          onSelect={item.onSelect}
          onBlur={item.onBlur}
          onFocus={item.onFocus}
            // onSelect={(option) => {
            //     if (_this.props.location && _this.props.location.pathname.indexOf('/system/user') > -1 && item.field === 'cost_center_id') {
            //         if (typeof _this.handleCostCenter === 'function') {
            //             _this.handleCostCenter(option)
            //         }
            //         return
            //
            //     }
            //
            //     if (_this.props.location && _this.props.location.pathname === '/info' && item.field === 'cost_center_id') {
            //         if (typeof _this.handleCostCenter === 'function') {
            //             _this.handleCostCenter(option)
            //         }
            //         return
            //
            //     }
            //
            //     if (item.field !== 'cate_id') return
            //     let person
            //     _this.state.formData.content.forEach((con, index) => {
            //         if (con.field === 'cate_id') {
            //             con.options.forEach((opt, index) => {
            //                 if (opt.id === option) {
            //                     person = opt.person
            //                 }
            //             })
            //         }
            //         if (con.field === 'touser_name') {
            //             con.autoPlace = person
            //         }
            //     })
            // }}
          >
            {
              item.options && item.options.map((option, index) => {

                return (<Option key={option.id} value={option.id} disabled={option.disabled}>{option.number ? option.number : option.name}</Option>);
              })
            }
          </Select>
        );

      case "search":
        return (
          <Select
            allowClear
            showSearch
            mode={item.mode ? item.mode : ""}
            placeholder={item.placeholder}
            notFoundContent={_this.state.fetching ? <Spin size="small"/> : intl.get("app.commonjs.placeholder.nodata")}
            filterOption={false}
            onSearch={item.fetchUser ? item.fetchUser : _this.fetchUser}
            onChange={item.onChange}
            onSelect={item.onSelect}
            style={{width: "100%"}}
            disabled={item.disabled}
            onBlur={item.onBlur}
            onFocus={item.onFocus}
          >
            {item.options && item.options.map((d, index) => {
              return <Option
                title={item.searchConcat ? item.searchConcat(d) : this.searchConcat(d)}
                key={d.id}
                // value={d.id}
                // value={d.value}
              >
                {item.searchConcat ? item.searchConcat(d) : this.searchConcat(d)}
                {/* {d.value} */}
                {/* {
                                `姓名: ${d.text}${d.tel ? ';座机: ' + d.tel : ''}${d.department ? ';部门: ' + d.department : ''}${d.id_num ? ';证件号码; ' + d.id_num : ''}`
                            } */}
              </Option>;
            })}


          </Select>
        );
      case "cascader":
        return (
          <Cascader
            options={item.options}
            fieldNames={
              item.options.length > 0 && item.options[0].hasOwnProperty("id") && item.options[0].hasOwnProperty("name")
                ?
                {
                  label: "name",
                  value: "id"
                }
                :
                {
                  label: "label",
                  value: "value",
                  children: "children"
                }
            }
            // onChange={(value, selectedOptions) => {console.log(value)}}
            placeholder={item.placeholder}
            onChange={_this.onLocationChange}
          />
        );
      case "checkbox":
        return (
          <Checkbox.Group style={{width: "100%"}}>
            <Row>
              {
                item.options.map((d, index) => {
                  return (
                    <Col span={8} key={index}>
                      <Checkbox value={d.id} key={index} disabled={d.disabled}>{d.name} {d.desc}</Checkbox>
                    </Col>
                  );
                })
              }
            </Row>
          </Checkbox.Group>
        );
      case "switch":
        return (
          <Switch onChange={item.onChange} defaultChecked={item.value} />
        );
      case "tree":
        return (
          <Tree
            checkable
            expandedKeys={item.expandedKeys}
            autoExpandParent={item.autoExpandParent}
            onCheck={item.onCheck}
            checkedKeys={item.checkedKeys}
            onExpand={item.onExpand}
            onSelect={item.onSelect}
            selectedKeys={item.selectedKeys}
          >
            {item.renderTreeNodes(item.trees)}
          </Tree>
        );
      case "upload":
        return (
          <Upload
            {...item.props}
            beforeUpload={item.beforeUpload}
            onChange={item.onChange}
            fileList={item.fileList}
            className='upload-list-inline'
          >
            {
              item.fileList && item.fileList.length < item.maxlength ?
              <Button>
                <Icon type="upload"/> Upload
              </Button>
              :
              null
            }
          </Upload>
        );
      default:
        return <Input
          placeholder={item.placeholder}
          autoComplete={"off"}
        />;
      }
    }

    // 当前时间
    getNow() {
      let now = new Date(),
        hour = now.getHours(),
        str_now = "";
      if (hour < 6) {
        str_now = "凌晨好！";
      }
      else if (hour < 9) {
        str_now = "早上好！";
      }
      else if (hour < 12) {
        str_now = "上午好！";
      }
      else if (hour < 14) {
        str_now = "中午好！";
      }
      else if (hour < 17) {
        str_now = "下午好！";
      }
      else if (hour < 19) {
        str_now = "傍晚好！";
      }
      else if (hour < 22) {
        str_now = "晚上好！";
      }
      else {
        str_now = "夜里好！";
      }
      return str_now;
    }

    // 提示错误信息
    responseError(value) {
      message.config({
        maxCount: 1
      });
      if (value) {
        if (value instanceof Array) {
          let res = value[0];
          if (!(res instanceof String)) {
            this.responseError(res);
          } else {
            message.error(value);
          }
        } else if (value instanceof Object) {
          let res = Object.values(value);
          if (!(res instanceof String)) {
            this.responseError(res);
          } else {
            message.error(value);
          }
        } else {
          message.error(value);
        }
      }
    }

    // table每页显示多少条
    getPageSize() {
      return 200;
    }
    // getPageSize() {
    //     return 20
    // }

    // 180627a
    // getPageSizeOptions() {
    //     return ['20','200', '1000', '3000']
    // }

    getPageSizeOptions() {
      return ["200", "1000", "3000"];
    }

    // 判断两个对象的值是否相等
    isFunction(obj) {
      return toString.call(obj) === "[object Function]";
    }

    eq(a, b, aStack, bStack) {
      if (a === b) return a !== 0 || 1 / a === 1 / b;
      if (a == null || b == null) return false;
      if (a !== a) return b !== b;
      let type = typeof a;
      if (type !== "function" && type !== "object" && typeof b !== "object") return false;
      return this.deepEq(a, b, aStack, bStack);
    }

    deepEq(a, b, aStack, bStack) {
      let className = toString.call(a);
      if (className !== toString.call(b)) return false;
      switch (className) {
      case "[object RegExp]":
      case "[object String]":
        return "" + a === "" + b;
      case "[object Number]":
        if (+a !== +a) return +b !== +b;
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case "[object Date]":
      case "[object Boolean]":
        return +a === +b;
      default:
      }
      let areArrays = className === "[object Array]";
      if (!areArrays) {
        if (typeof a !== "object" || typeof b !== "object") return false;
        let aCtor = a.constructor,
          bCtor = b.constructor;
        if (aCtor === bCtor && !(this.isFunction(aCtor) && aCtor instanceof aCtor && this.isFunction(bCtor) && bCtor instanceof bCtor) && ("constructor" in a && "constructor" in b)) {
          return false;
        }
      }
      aStack = aStack || [];
      bStack = bStack || [];
      let length = aStack.length;
      while (length--) {
        if (aStack[length] === a) {
          return bStack[length] === b;
        }
      }
      aStack.push(a);
      bStack.push(b);
      if (areArrays) {
        length = a.length;
        if (length !== b.length) return false;
        while (length--) {
          if (!this.eq(a[length], b[length], aStack, bStack)) return false;
        }
      }
      else {
        let keys = Object.keys(a),
          key;
        length = keys.length;
        if (Object.keys(b).length !== length) return false;
        while (length--) {
          key = keys[length];
          if (!(b.hasOwnProperty(key) && this.eq(a[key], b[key], aStack, bStack))) return false;
        }
      }
      aStack.pop();
      bStack.pop();
      return true;

    }

    // 如果为空，页面上显示空， 用于列表页
    getOrNullList(obj) {
      // const { formatMessage } = this.props.intl;
      if (!obj && obj !== 0) {
        return <FormattedMessage id="app.commonjs.none" defaultMessage="-" />;

      } else {
        if (typeof obj === "string" || typeof obj === "number") {
          let reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/;
          if(isNaN(obj)&&!isNaN(Date.parse(obj)) && obj.match(reg) != null){
            return (
              <Tooltip
                title={moment(obj).format('YYYY-MM-DD HH:mm')}
                placement="topLeft"
                mouseEnterDelay={0.4}>
                {moment(obj).format('YYYY-MM-DD HH:mm')}
              </Tooltip>
            );
          }
          return (
            <Tooltip
              title={obj}
              placement="topLeft"
              mouseEnterDelay={0.4}>
              {obj}
            </Tooltip>
          );
        } else if (Array.isArray(obj)) {
          if (obj.length) {
            let str = "";
            obj.map((value) => {
              return str += value + " ";
            });
            //180627a
            return (
              <Tooltip
                title={str}
                mouseEnterDelay={0.4}>
                {str}
              </Tooltip>
            );
          } else {
            return <FormattedMessage id="app.commonjs.none" defaultMessage="-" />;
          }
        } else {
          return obj.name;
        }
      }
    }

    // 对后台传过来的带T的时间进行处理
    getTtime(obj) {
      // console.log(obj)
      if (!obj && obj !== 0) {
        return <FormattedMessage id="app.commonjs.none" defaultMessage="-" />;
      } else {
        let time_obj=new Date(+new Date(obj)+8*3600*1000).toISOString().replace(/T/g," ").replace(/\.[\d]{3}Z/,"");
        return (
          <Tooltip
            title={time_obj}
            placement="topLeft"
            mouseEnterDelay={0.4}>
            {time_obj}
          </Tooltip>
        );
      }
    }

    // 如果为空，页面上显示空, 用于详情页
    getOrNull(obj, hide) {
      if (!obj) {
        return <FormattedMessage id="app.commonjs.none" defaultMessage="-" />;
      } else {
        if (typeof obj === "string" || typeof obj === "number") {
          if (hide) {
            return this.hide_id_num(obj);
          }
          let reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/;
          if(isNaN(obj)&&!isNaN(Date.parse(obj)) && obj.match(reg) != null){
            return moment(obj).format('YYYY-MM-DD HH:mm')
          }
          return obj;
        } else if (Array.isArray(obj)) {
          if (obj.length) {
            let str = "";
            obj.map((value) => {
              return str += value + " ";
            });
            return str;
          } else {
            return <FormattedMessage id="app.commonjs.none" defaultMessage="-" />;
          }
        } else {
          return obj.name;
        }
      }
    }

    // 上传图片前检查
    beforeUploadImg(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/bmp" || file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 3;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          message.error(intl.get("app.commonjs.message.error_format"));
        }
        if (!isLt2M) {
          message.error(intl.get("app.commonjs.message.over_size"));
        }
        if (isJPG && isLt2M) {
          resolve(file);
        } else {
          reject(file);
        }
      });
    }

    // 上传附件
    beforeUploadFile(file, files, limit = 15) {
      const lessLimit = file.size / 1024 / 1024 < limit;
      return new Promise((resolve, reject) => {
        if (!lessLimit) {
          //message.error(`附件大小不超过${limit}MB!`);
          message.error(`${intl.get("app.commonjs.message.size")}${limit}${intl.get("app.commonjs.message.unit")}`);
        }
        if (lessLimit) {
          resolve(file);
        } else {
          reject(file);
        }
      });
    }

    beforeUpload(file) {
      const typeOk = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/bmp" || file.type === "image/gif";
      const sizeOk = file.size / 1024 / 1024 < 3;
      return new Promise((resolve, reject) => {
        if (!typeOk) {
          message.error(intl.get("app.commonjs.message.error_format"));
        }
        if (!sizeOk) {
          message.error(intl.get("app.commonjs.message.over_size"));
        }
        if (typeOk && sizeOk) {
          resolve(file);
        } else {
          reject(file);
        }
      });
    }

    // 上传图片
    handleUploadChange(info, _this) {
      let {fileList} = info;
      const status = info.file.status;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList)
      }
      if (status === "done") {
        message.success(`${info.file.name} ${intl.get("app.commonjs.message.uploaded")}.`);
      } else if (status === "error") {
        message.error(`${info.file.name} ${intl.get("app.commonjs.message.upload_failed")}.`);
      }
      _this.setState({fileList});
    }

    // 点击文件链接或预览图标时的回调
    handleUploadPreview(file, _this) {
      _this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true
      });
    }

    // 关闭图片阅览
    handleUploadCancel(_this) {
      _this.setState({previewVisible: false});
    }

    // 上传成功后转为base64显示
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    }

    // 下面几个方法用于列表页抽离出来
    // 获取数据后的操作


    getInfo(res, _this) {
      let data = res.data;
      if (typeof data === "string") return;

      const pagination = {..._this.state.pagination};
      pagination.total = data.count;
      let data_array = data.results;
      let result = [];
      if (data_array && data_array.length && data_array instanceof Array) {
        data_array.map((value, index, array) => {
          let uid = value.id;
          let project_status = value.status;
          return result.push({
            ...value,
            ...value.info,
            uid,
            project_status
          });
        });
      }

      document.getElementById("root").scrollTop = 0;
      // console.log(pagination.current)
      _this.setState({
        data: result,
        loading: false,
        pagination: pagination
      });
    }
    getList = (res, _this) => {
      const { results, count } = res.data;
      const { pagination } = _this.state;

      pagination.total = count;
      _this.setState({ data: results, pagination });
    }


    // 获取数据后的操作
    //施工审批列表进详情
    getRouterParams(res, _this) {
      let data = res.data;
      const pagination = {..._this.state.pagination};
      pagination.total = data.count;
      let data_array = data.results;
      console.log(res);
      let result = [];
      if (data_array.length && data_array instanceof Array) {
        data_array.map((value, index, array) => {
          // console.log(value)
          let fid = value.id;
          return result.push({
            ...value,
            ...value.info,
            fid
          });

        });
      }
      _this.setState({
        data: result,
        loading: false,
        pagination: pagination
      });
      console.log(_this.state.data);
    }


    // 列表改变
    handleTableChange(pagination, filters, sorter, _this) {
      //180627e
      // console.log(_this)
      const pager = {...pagination};
      pager.current = pagination.current;
      _this.setState({
        pagination: pager,
        data: []
      });
      _this.getInfo({
        //180627e
        page_size: pagination.pageSize,
        page: pagination.current,
        // ordering: sorter.order === 'ascend' ? '' + sorter.field : '-' + sorter.field,
        search: _this.state.search,
        ...filters
      });
    }

    setScrollGlobal(val){
      console.log(val);
      const {tableScrollTop}=val;
      // const scrollTopPosition = this.props.appState.tableScrollTop;
      console.log(tableScrollTop);
      if(tableScrollTop){
        console.log(1);
        this.setSession("scrollTop", tableScrollTop);
      }
    }


    // 删除时有关联的 提示
    openNotification(msg) {
      const key = `open${Date.now()}`;
      let data = "";
      Array.isArray(msg) && msg.map((value, index, array) => {
        data += `<span style="margin-left:20px;color:#f5222d">${value}</span><br>`;
        return null;
      });
      notification["error"]({
        message: intl.get("app.commonjs.message.delete_first"),
        description: <div dangerouslySetInnerHTML={{__html: data}}/>,
        key
      });
    }

    //删除
    onDeleteOne(res, _this) {
      message.success(intl.get("app.commonjs.message.deleted"));
      const {pagination} = _this.state;
      _this.getInfo({
        page_size: pagination.pageSize,
        page: pagination.current
      });
    }

    // 搜索
    handleSearch(value, _this) {
      const pager = {..._this.state.pagination};
      pager.current = 1;
      _this.setState({
        search: value,
        pagination: pager,
        data: []
      });
      _this.getInfo({
        search: value,
        // pagination: pager,
        page_size: pager.pageSize,
        project_id: this.getStorage('project_id'),
      });
    }

    // 导出
    exportExcel(selectedRows, column, fileName) {
      const columnMap = {};
      column.forEach((c, index) => {
        if (!c.dataIndex) return;
        if (c.dataIndex === "avatar") return;
        if (c.dataIndex === "operate") return;
        if (c.dataIndex === "efm-index") return;

        columnMap[c.dataIndex] = {
          title: c.title,
          sort: index
        };
      });
      const columnMapPair = Object.keys(columnMap);
      let sortTitle = columnMapPair.map(c => columnMap[c].title);
      const rows = Array.isArray(selectedRows) && selectedRows.map(row => {
        let obj = {};
        for (let k in row) {
          let idx = columnMapPair.indexOf(k);
          if (idx > -1) {
            obj[columnMap[columnMapPair[idx]].title] = this.getOrNull(row[k]);
          }
        }
        return obj;
      });

      if (rows.length > 0) {
        console.log(rows);

            import("xlsx").then(XLSX => {
              const wb = XLSX.utils.book_new();
              const ws = XLSX.utils.json_to_sheet(rows, {
                header: sortTitle
              });
              XLSX.utils.book_append_sheet(wb, ws);
              return XLSX.writeFile(wb, `${fileName}.xlsx`);
            });

      } else {
        message.warning(intl.get("app.commonjs.message.selectdata"));
      }

    }

    //权限鉴定
    check() {
      let permit = this.getStorage("permission")
      let arr = []
      if (permit && permit !== "undefined") {
        arr = this.getStorage("permission");
      } else {
        arr = [];
      }

      let obj = groupBy(arr, t => t.url);
      let _this = this
      let permission = {}
      Object.keys(obj).map(function(key){
        obj[key].map(f => {return _this.reqtype(f.action)})
        return permission[key] = obj[key].map(f => {return _this.reqtype(f.action)})
      });

      const checkPath = (pathname, action) => {
        if(this.getStorage('myadmin')){
          return true
        }else{
          return permission && Array.isArray(permission[pathname]) && permission[pathname].indexOf(action) > -1;
        }
      };

      return (ctx, type, otherPath) => {
        const {location} = ctx.props;
        let {pathname} = location;

        if (otherPath) {
          pathname = otherPath;
        }

        if (type === "assignmentGet") {
          return checkPath(pathname, "GET");
        }

        if (type === "add") {
          return checkPath(pathname, "POST");
        }

        if (type === "edit") {
          return checkPath(pathname, "PUT");
        }

        if (type === "delete") {
          return checkPath(pathname, "DELETE");
        }

        if (type === "enabled") {
          return checkPath(`${pathname}/enabled`, "POST");
        }

        if (type === "disabled") {
          return checkPath(`${pathname}/disabled`, "POST");
        }

        if (type === "excel") {
          return checkPath(`${pathname}/excel`, "POST");
        }

        if (type === "updated") {
          return checkPath(`${pathname}/updated`, "POST");
        }

        if (type === "apply") {
          return checkPath(`${pathname}/apply`, "POST");
        }

        if (type === "audit") {
          return checkPath(`${pathname}/audit`, "POST");
        }

        if (type === "out") {
          return checkPath(`${pathname}/out`, "POST");
        }
      };
    }

    checkpermit(path){
      let permission = JSON.parse(localStorage.getItem("permission"));
      return permission && permission[path] && Object.keys(permission).indexOf(path) > -1;
    }

    reqtype(action) {
      if(action === -1){
        return ''
      }
      if(action === 1){
        return 'GET'
      }
      if(action === 2){
        return 'POST'
      }
      if(action === 3){
        return 'PUT'
      }
      if(action === 4){
        return 'DELETE'
      }
    }

    //返回<Tag></Tag>颜色
    getColor(type) {
      let color;
      // console.log(type)
      switch (type) {
      case 1: //创建
        color = "cyan";
        break;
      case 2: //待提交
        color = "cyan";
        break;
      case 3: //待审批  待处理
        color = "#2db7f5";
        break;
      case 4: //审批通过  已处理
        color = "#87d068";
        break;
      case 5: //审批未通过
        color = "#f50";
        break;
      case 6: //撤回  退回  被撤回  被退回  未生效
        color = "#ccc";
        break;
      case 7: //已关闭
        color = "#108ee9";
        break;
      case 8: //被撤回
        color = "#ccc";
        break;
      case 9: //被退回
        color = "#ccc";
        break;
      default:
        color = "#ccc";
      }

      return color;
    }

    orderTag(record){
      let tag_div=undefined;
      switch (record) {
      case 1:
        return <div><Tag color="#2db7f5"><FormattedMessage id="page.order.myOrder.sending" defaultMessage="派发中"/></Tag></div>;
        break;
      case 2:
        return <div><Tag color="#108ee9"><FormattedMessage id="page.order.myOrder.conducting" defaultMessage="执行中"/></Tag></div>;
        break;
      case 3:
        return <div><Tag color="#87d068"><FormattedMessage id="page.order.myOrder.finished" defaultMessage="已完成"/></Tag></div>;
        break;
      case 4:
        return <div><Tag color="#CCCCCC"><FormattedMessage id="page.order.myOrder.completed" defaultMessage="已关闭"/></Tag></div>;
        break;
      case 5:
        return <div><Tag color="#CCCCCC"><FormattedMessage id="page.order.myOrder.completed" defaultMessage="已关闭"/></Tag></div>;
        break;
      case 7:
        return <div><Tag color="#2db7f5"><FormattedMessage id="page.order.myOrder.sending" defaultMessage="派发中"/></Tag></div>;
        break;
      case 8:
        return <div><Tag color="#2db7f5"><FormattedMessage id="page.order.myOrder.sending" defaultMessage="派发中"/></Tag></div>;
        break;
      case 9:
        return <div><Tag color="#CCCCCC"><FormattedMessage id="page.order.myOrder.cancelled" defaultMessage="已取消"/></Tag></div>;
        break;
      case 10:
        return <div><Tag color="#f50"><FormattedMessage id="page.order.myOrder.pause" defaultMessage="暂停中"/></Tag></div>;
        break;
      }
      // return tag_div
    }

    encryptRequest(data, key) {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(key);
      return encrypt.encrypt(data);
    }

    setTooltip(title) {
      return (
        <Tooltip
          title={title}
          placement="topLeft"
          mouseEnterDelay={0.4}>
          {title}
        </Tooltip>
      );
    }

    searchConcat(d) {
      const { name, tel, department, id_num, phone, company,org } = d;
      let temp = "";

      if (name) {
        temp += name;
      }
      if (org) {
        temp += ("-" + org);
      }
      // if (company) {
      //   temp += ("-" + company);
      // }
      // if (department) {
      //   temp += ("-" + department);
      // }
      // if (tel) {
      //   temp += ("-" + tel);
      // }
      // if (id_num) {
      //   temp += ("-" + id_num);
      // }
      // if (phone) {
      //   temp += ("-" + phone);
      // }
      return temp;
    }

    formatSeconds(second) {
      const h = Math.floor(second / 3600) < 10 ? "0"+Math.floor(second / 3600) : Math.floor(second / 3600);
      const m = Math.floor((second / 60 % 60)) < 10 ? "0" + Math.floor((second / 60 % 60)) : Math.floor((second / 60 % 60));
      const s = Math.floor((second % 60)) < 10 ? "0" + Math.floor((second % 60)) : Math.floor((second % 60));
      return second = h + ":" + m + ":" + s;
    }

    formatDuring(mss){
      // const { formatMessage } = this.props.intl;
      var days = parseInt(mss / (60 * 60 * 24));
      var hours = parseInt(mss / (60 * 60)%24);
      var minutes = parseInt((mss / 60) % 60);
      // var seconds = (mss % (1000 * 60)) / 1000;
      var seconds = Math.round(mss % 60);
      let form_date="";
      if(days){
        form_date+=days+"day";
      }
      if(hours){
        form_date+=hours + "hr";
      }
      if(minutes){
        form_date+=minutes + "min";
      }
      if(seconds){
        form_date+=seconds + "s";
      }
      //console.log(form_date);
      return form_date;
      // return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
    }

    getType(o) {
      const type = Object.prototype.toString.call(o);
      const typeLength = type.length;

      return type.substring(8, typeLength - 1);
    }

    isPlainObject(o) {
      const type = Object.prototype.toString.call(o);
      const typeLength = type.length;

      return type.substring(8, typeLength - 1) === "Object";
    }

    getFileSize(num) {
      if(!num){
        return "0 Bytes";
      }
      const sizeArr = ["Bytes", "KB", "MB", "GB", "TB"];

      let index = 0, srcsize = parseFloat(num);
      index = Math.floor(Math.log(srcsize)/Math.log(1024));
      let size = srcsize/Math.pow(1024,index);
      size = size.toFixed(2);
      return size + sizeArr[index];
    }

    plateNumberTest(number) {
      return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(number);
    }

    sortDate(a, b) {
      if (!a && b) return 1;
      if (a && !b) return -1;
      return moment(a).isBefore(moment(b)) ? -1 : 1;
    }
    sortNumber = (a, b) => {
      if ((!a && a !== 0) && b) return 1;
      if (a && (!b && b !== 0)) return -1;
      return a - b;
    }
    sortString = (a, b) => {
      if ((!a && a !== 0) && b) return 1;
      if (a && (!b && b !== 0)) return -1;
      if (a && b) {
        return (a.toString()).localeCompare(b.toString());
      }
    }
    genStatusDesc = status => {
      let status_desc;

      if (status === 1) {
        status_desc = intl.get("app.carryout.status.created");   //未操作
      }
      if (status === 2) {
        status_desc = "待提交"
      }
      if (status === 3) {
        status_desc = intl.get("app.carryout.status.wait_approve");    //待审批
      }
      if (status === 4) {
        status_desc = intl.get("app.carryout.status.approved");    //审批通过
      }
      if (status === 5) {
        status_desc = intl.get("app.carryout.status.not_approved");    //审批未通过
      }
      if (status === 6) {
        status_desc = intl.get("app.carryout.status.withdraw");    //召回
      }
      if (status === 7) {
        status_desc = intl.get("app.carryout.status.return_back");   //退回
      }
      if (status === 8) {
        status_desc = intl.get("app.carryout.status.submit");    //提交
      }
      console.log(status,status_desc)
      return status_desc;
    }

    getAccessTypeDesc = type => {
      let type_desc;

      if (type === 1) {
        type_desc = '施工访客';
      }
      if (type === 2) {
        type_desc = '普通访客';
      }
      if (type === 3) {
        type_desc = '装卸货访客';
      }

      return type_desc;
    }

    getDurationTime = record => {
      if (record.status === 1) {
        let m1 = moment(record.created_time).valueOf();
        let m2 = moment(Date.now()).valueOf();
        let time = moment.duration(m2 - m1, "ms");
        if (time.get("days") < 1 && time.get("hours") < 1 && time.get("minutes") < 1) {
          return (
            <div>{time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && time.get("hours") < 1) {
          return (
            <div>{time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && time.get("hours") < 8) {
          return (
            <div>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && (time.get("hours") >= 8 && time.get("hours") < 12)) {
          return (
            <div style={{ color: "#19FF00" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && (time.get("hours") >= 12 && time.get("hours") < 24)) {
          return (
            <div style={{ color: "#0006FF" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") > 0) {
          return (
            <div style={{ color: "#FF0016" }}>
              {
                (time.get("months") > 0 ? time.get("months") + intl.get("page.event.accessrecord.month") : null) +
                time.get("days") + intl.get("page.event.accessrecord.day") + time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")
              }
            </div>
          );
        }
      }
      if (record.status === 2) {
        let m1 = moment(record.created_time).valueOf();
        let m2 = moment(record.out_time).valueOf();
        let time = moment.duration(m2 - m1, "ms");
        if (time.get("days") < 1 && time.get("hours") < 1 && time.get("minutes") < 1) {
          return (
            <div>{time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && time.get("hours") < 1) {
          return (
            <div>{time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && time.get("hours") < 8) {
          return (
            <div>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && (time.get("hours") >= 8 && time.get("hours") < 12)) {
          return (
            <div style={{ color: "#19FF00" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") < 1 && (time.get("hours") >= 12 && time.get("hours") < 24)) {
          return (
            <div style={{ color: "#0006FF" }}>{time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")}</div>
          );
        }
        if (time.get("days") > 0) {
          return (
            <div style={{ color: "#FF0016" }}>
              {
                (time.get("months") > 0 ? time.get("months") + intl.get("page.event.accessrecord.month") : null) +
                time.get("days") + intl.get("page.event.accessrecord.day") + time.get("hours") + intl.get("page.event.accessrecord.hour") + time.get("minutes") + intl.get("page.event.accessrecord.minute") + time.get("seconds") + intl.get("page.event.accessrecord.second")
              }
            </div>
          );
        }
      }
    }

    getStatusTag(code){
      switch (code) {
      case "0":
        return (<Tag color="#87d068">正常</Tag>);
      case "1":
        return (<Tag color="#f50">异常</Tag>);
      case "2":
        return (<Tag color="#108ee9">异常已处理</Tag>);
      }
    }
    getTaskStatus(code){
      switch (code) {
      case "0":
        return (<Tag color="#87d068">计划中</Tag>);
      case "1":
        return (<Tag color="#2db7f5">待处理</Tag>);
      case "2":
        return (<Tag color="#f50">已过期</Tag>);
      }
    }

    getParkTag(code){
      switch (code) {
      case 0:
        return (<Tag color="#87d068">启用</Tag>);
      case 1:
        return (<Tag color="#f50">禁用</Tag>);
      case 2:
        return (<Tag color="#108ee9">失效</Tag>);
      }
    }

    getLanguage(code){
      switch (code) {
      case 1:
        return (<FormattedMessage id="page.event.vipvisitor.zh" defaultMessage="中文"/>);
      case 2:
        return (<FormattedMessage id="page.event.vipvisitor.en" defaultMessage="英文"/>);
      case 3:
        return (<FormattedMessage id="page.event.vipvisitor.none" defaultMessage="无"/>);
      }
    }

    getENV(){
      if (env.NODE_ENV === "development") {
        return "dev";
      } else{
        if(env.REACT_APP_ENV === "test"){
          return "test";
        }
        if(env.REACT_APP_ENV === "prod"){
          return "prod";
        }
      }
    }


    //渲染列表中的数组数据
    renderDataName(list){
      if(list&&list.length){
        var nameList = [];
        list.map(item => {
          nameList.push(item.name)
        });
        var nameStr = nameList.join(',')
        return nameStr
      }else{
        return null
      }
    }

    getUserStatus(code){
      switch (code) {
      case 1:
        return (<Tag color="cyan">个人</Tag>);
      case 2:
        return (<Tag color="geekblue">组织</Tag>);
      case 3:
        return (<Tag color="purple">工人</Tag>);
      }
    }

    getPersonType(code){
      switch (code) {
      case 1:
        return (<Tag color="cyan">管理人员</Tag>);
      case 2:
        return (<Tag color="geekblue">安全人员</Tag>);
      case 3:
        return (<Tag color="purple">特殊工种</Tag>);
      case 4:
        return (<Tag color="green">普工</Tag>);
      default:
        return null;
      }
    }

    getPersonTypeDesc(code){
      switch (code) {
      case 1:
        return '管理人员';
      case 2:
        return '安全人员';
      case 3:
        return '特殊工种';
      case 4:
        return '普工';
      default:
        return null;
      }
    }

    getRequestType(code){
      switch (code) {
      case 1:
        return (<Tag color="#48d1cc">GET</Tag>);
      case 2:
        return (<Tag color="#32cd32">POST</Tag>);
      case 3:
        return (<Tag color="#ffd700">PUT</Tag>);
      case 4:
        return (<Tag color="#ff0000">DELETE</Tag>);
      default:
        return null;
      }
    }

    renderAuditStatus(code){
      switch (code) {
      case 1:
        return (<Tag color="#a9a9a9">未操作</Tag>);
      case 2:
        return (<Tag color="#48d1cc">待提交</Tag>);
      case 3:
        return (<Tag color="#108ee9">待审批</Tag>);
      case 4:
        return (<Tag color="#87d068">审批通过</Tag>);
      case 5:
        return (<Tag color="#ff0000">审批未通过</Tag>);
      case 6:
        return (<Tag color="#ffd700">召回</Tag>);
      case 7:
        return (<Tag color="#f50">退回</Tag>);
      case 8:
        return (<Tag color="#000080">提交</Tag>);
      default:
        return null;
      }
    }

    renderListToString(list,name,name2){
      if(list&&list.length){
        var data = [];
        list.forEach(item => {
          if(name2){
            data.push(item[name][name2])
          }else{
            data.push(item[name])
          }
        });
        return data.join(',')
      }else{
        return ''
      }
    }

    switchToJson = (str) => {
      if(str){
        return eval('(' + str + ')');
      }else{
        return null
      }    
    }

    renderAuditStatusText(code){
      switch (code) {
      case 1:
        return (<Tag color="#a9a9a9">未操作</Tag>);
      case 2:
        return (<Tag color="#48d1cc">待提交</Tag>);
      case 3:
        return (<Tag color="#108ee9">待审批</Tag>);
      case 4:
        return (<Tag color="#87d068">审批通过</Tag>);
      case 5:
        return (<Tag color="#ff0000">审批未通过</Tag>);
      case 6:
        return (<Tag color="#ffd700">召回</Tag>);
      case 7:
        return (<Tag color="#f50">退回</Tag>);
      case 8:
        return (<Tag color="#000080">提交</Tag>);
      default:
        return null;
      }
    }

    renderDocumentStatusText(code){
      switch (code) {
      case 1:
        return (<Tag color="#48d1cc">待提交</Tag>);
      case 2:
        return (<Tag color="#108ee9">审核中</Tag>);
      case 3:
        return (<Tag color="#87d068">已发布</Tag>);
      case 4:
        return (<Tag color="#f50">禁用中</Tag>);
      case 5:
        return (<Tag color="#ff0000">审批未通过</Tag>);
      default:
        return null;
      }
    }


    renderMeetingStatusText(code){
      switch (code) {
      case 1:
        return (<Tag color="#48d1cc">待提交</Tag>);
      case 2:
        return (<Tag color="#108ee9">审核中</Tag>);
      case 3:
        return (<Tag color="#87d068">已发布</Tag>);
      case 4:
        return (<Tag color="#f50">未通过</Tag>);
      default:
        return null;
      }
    }


    renderApproval = (record) => {
      switch(record){
        case 1:
          return (<Tag color="#108ee9">待审批</Tag>);
        case 2:
          return (<Tag color="#87d068">审批通过</Tag>);
        case 3:
          return (<Tag color="#f50">审批未通过</Tag>);
        default:
          return null;
      }
    }

    renderApprovalDesc = (record) => {
      switch(record){
        case 1:
          return '待审批';
        case 2:
          return '审批通过';
        case 3:
          return '审批未通过';
        default:
          return null;
      }
    }

    renderNeedTraining = (record) => {
      if(record){
        return (<Tag color="#ffa500">需要参加</Tag>);
      }else{
        return (<Tag color="#008000">不需参加</Tag>);
      }
    }

    renderAccessCard = (record) => {
      if(record){
        return (<Tag color="#87d068">启用</Tag>);
      }else{
        return (<Tag color="#f50">禁用</Tag>);
      }
    }

    renderIsEntry = (record) => {
      if(record){
        return (<Tag color="#108ee9">入场培训</Tag>);
      }else{
        return '';
      }
    }

    flowStatus=(val)=>{
        console.log(val);
        let status_desc="";
        switch (val) {
            case 1:status_desc='未操作';
            break;
            case 2:status_desc='待提交';
            break;
            case 3:status_desc='待审批';
            break;
            case 4:status_desc='审批通过';
            break;
            case 5:status_desc='审批未通过';
            break;
            case 6:status_desc='召回';
            break;
            case 7:status_desc='退回';
            break;
            case 8:status_desc='提交';
            break;
            case 9:status_desc='跳过';
            break;
            case 10:status_desc='已撤回';
            break;
            case 11:status_desc='发起人修改步骤参与人';
            break;
            case 12:status_desc='代理';
            break;
            case 13:status_desc='委托';
            break;
        }
        return status_desc
    }

    isNull=( str )=>{
      if ( str == "" ) return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    };

    transferAssignmentArea=(results)=>{
        new Promise(
            function(resolve,reject){
                let level1_array=[];
                let level2_array=[];
                let level3_array=[];
                results.map(a=>{
                    a.title=a.name;
                    a.key=a.id;
                    a.children=[];
                    switch (a.level) {
                        case 1:level1_array.push(a);
                        break;
                        case 2:level2_array.push(a);
                        break;
                        case 3:level3_array.push(a);
                        break
                    }
                });
                resolve([level1_array,level2_array,level3_array])
            }
        ).then(
            (res)=>{
                res[1].map(item2=> {
                    res[2].map(item3 => {
                        if (item3.father === item2.id) {
                            item2.children.push(item3)
                        }
                    });
                });

                res[0].map(item1=>{
                    res[1].map(item2=>{
                        if(item2.father===item1.id){
                            item1.children.push(item2)
                        }
                    })
                });

                console.log(res[0]);
                return res[0]

                // this.setState({trees:{title:'全部区域',key:0,children:res[0]}})
                // console.log(this.state.trees)
            }
        );
    }

    renderAssignmentStatus=(code)=>{
      switch (code) {
      case '待派发':
        return (<Tag color="cyan">待派发</Tag>);
      case '已派发':
        return (<Tag color="#48d1cc">已派发</Tag>);
      case '执行中':
        return (<Tag color="#108ee9">执行中</Tag>);
      case '待关闭':
        return (<Tag color="#87d068">待关闭</Tag>);
      case '已关闭':
        return (<Tag color="#f50">已关闭</Tag>);
      case '已撤销':
        return (<Tag color="#ff0000">已撤销</Tag>);
      default:
        return (<Tag color="#ccc">{code}</Tag>);
      }
    };
}

export default CommonUtil;