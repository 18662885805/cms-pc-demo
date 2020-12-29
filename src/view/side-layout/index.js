import React from "react";
import {
  Layout,
  Menu,
  Icon,
  Dropdown,
  Tabs,
  Popover,
  message,
  Modal,
  Spin,
  Drawer,
  Carousel,
  Badge,
  Tag,
  Button,
  Tooltip
} from "antd";
import {Link, withRouter} from "react-router-dom";
import {
  inject,
  observer
} from "mobx-react";
import moment from 'moment'
import CommonUtil from "@utils/common";
import {logout} from "@apis/account/index";
import styles from "./index.less"
import stylesMsg from './index.css';
import todostyles from './todo.module.css'
import {Scrollbars} from "react-custom-scrollbars";
import getNotification from '@utils/getNotification'
import { List as VList, WindowScroller  } from 'react-virtualized'
import intl from "react-intl-universal";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import menuobj from '@utils/menu'
import {UserProject,SwitchProject} from "@apis/system/project";
import {messageList,noticeList,todoList,todoDelete,noticeDelete,noticeRead } from '@apis/home';
import {GetTemporaryKey} from "@apis/account/index"

const {Header, Content, Sider, Footer} = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane
let _util = new CommonUtil();


@inject("menuState","appState") @observer
class SideLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: [],
      defaultSelectedKeys: ["1"],
      collapsed: false,
      bellSpin: false,
      visible: false,
      showModal: false,
      mode: "inline",
      roleVisible: false,
      roleContent: "",
      helpVisible: false,
      helpValue: '',
      topMessage: [],
      showMessageModal:false,
      msgContent: "",
      msgType: "",
      msgTitle: "",
      need_handle_list: [],
      message_list: [],
      fileList: [],
      language: _util.getStorage("langs") || _util.getCookie("django_language") || "zh-Hans",
      userType:_util.getStorage("userType") ? parseInt(_util.getStorage("userType")) :3,
      projectDrawer:false,
      // project_id:null,
      projectList: [],
      currentProject:null,//当前项目信息
      permit: {},
      user_name:'',
      user_logo:'',
      logo_loading:false,
      is_active: true
    };
  }

    toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed
      });
      this.props.menuState.changeFirstHide(!this.props.menuState.firstHide);
    }


    componentDidMount() {
      
      const userInfo = _util.getStorage("userInfo");
      if(_util.getStorage("token")){
        this.getTopMessage()
        this.timer = setInterval(this.getTopMessage, 1000 * 2 * 60)
        UserProject().then((res) => {
          this.setState({
            projectList: res.data
          });
        });
        //渲染菜单
      this.renderMenu();
      }
    }

    componentWillReceiveProps(nextProps){
      // console.log('0407')
      //根据角色配置、渲染菜单
      const {pathname} = nextProps.location;
      if(pathname === '/myadmin/home'){
        _util.removeStorage('project');
        _util.removeStorage('project_id');
        this.renderMenu();
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.setState({
          topMessage: []
        });
      }
    }

    componentDidUpdate() {
      
    }

    componentWillUnmount() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }

    /**
     * 匹配菜单
     * 
     */
    getMenuSource = () => {
      const myadmin = _util.getStorage('myadmin');
      let arr = [];
      const project_id = _util.getStorage('project_id')
      if(!project_id){         //未进入具体项目
        if(myadmin === true){  //MJK管理员
          arr = [
            {"title":"team", "name": "用户管理", "to": "/myadmin/user", "children": [], "is_show": true, "order": 1, "wx_url": null},
            {"title":"project","name":"项目管理","to":"/myadmin/project","children":[],"is_show":true,"order":2,"wx_url":null},
            {"title":"area-chart","name":"权限管理","to":"/myadmin/permission","children":[],"is_show":true,"order":3,"wx_url":null},
            {"title":"ordered-list","name":"隐私政策","to":"/myadmin/privacy","children":[],"is_show":true,"order":4,"wx_url":null},
          ];
          return arr
        }else {
          return new Promise((resolve, reject) => {
            SwitchProject({project_id: _util.getStorage('project_id')}).then((res) => {             
              let permit = []
              if(res.data && res.data.org_permission_data){
                _util.setStorage('orgpermission', res.data.org_permission_data);
              }
              //is_project_admin
              if(res.data && res.data.is_project_admin){
                _util.setStorage('permission', res.data.permission);
                _util.setStorage('is_project_admin', true);
              }else {
                _util.setStorage('userdata', res.data.user_info);
                _util.setStorage('permission', res.data.user_info && res.data.user_info.permission);
              }
              
              if(res.data.contractor){
                _util.setStorage('contractor', res.data.contractor)
              }else{
                _util.removeStorage('contractor')
              }

              this.setState({is_active: res.data.is_active})
              
              if(res.data.user_info){ //有权限,项目第一个人，最高权限
                if(res.data.is_project_admin){
                  permit = res.data.org_permission_data
                  _util.setStorage('permission', res.data.org_permission_data);
                }else{
                  permit = res.data.user_info.permission
                  _util.setStorage('permission', res.data.user_info.permission);
                }
               
                menuobj.map((d,index)=>{
                  if(JSON.stringify(permit).indexOf(d.to) > -1){
                    d.is_show = true
                  }else {
                    d.is_show = false
                  }
                  d.children instanceof Array && d.children.map((c,cindex)=>{
                    // console.log(c.to,JSON.stringify(permit).indexOf(c.to))
                    if(JSON.stringify(permit).indexOf(c.to) > -1){
                      c.is_show = true
                    }else {
                      // d.is_show = false
                      c.is_show = false
                    }
                  })
                })
                resolve(menuobj)
              }else{
                permit = res.data.permission
                // _util.setStorage('permission', res.data.user_info.permission);
                menuobj.map((d,index)=>{
                  if(JSON.stringify(permit).indexOf(d.to) > -1){
                    d.is_show = true
                  }else {
                    d.is_show = false
                  }
                  d.children instanceof Array && d.children.map((c,cindex)=>{
                    // console.log(c.to,JSON.stringify(permit).indexOf(c.to))
                    if(JSON.stringify(permit).indexOf(c.to) > -1){
                      c.is_show = true
                    }else {
                      // d.is_show = false
                      c.is_show = false
                    }
                  })
                })
                resolve(menuobj)
              }
            })
          })
        }
      }else{
        //进入具体项目
        const {projectList} = this.state;
        if(projectList&&projectList.length){
          var currentProject = projectList.find(item => {
            return item.id == project_id
          });
          this.setState({currentProject})
        }
        return new Promise((resolve, reject) => {
          SwitchProject({project_id: _util.getStorage('project_id')}).then((res) => {
            if(res.data && res.data.is_project_admin){
              _util.setStorage('is_project_admin',true)
              this.setState({is_active: res.data.is_active})
              //MJK&&项目管理员
              if(res.data.user_info){
                //项目内人员
                _util.setStorage('userdata', res.data.user_info);
              } 
              _util.setStorage('permission', res.data.permission);
              const permit = res.data.permission;
              menuobj.map((d,index)=>{              
                if(JSON.stringify(permit).indexOf(d.to) > -1){
                  d.is_show = true
                }else {
                  d.is_show = false
                }
                d.children instanceof Array && d.children.map((c,cindex)=>{
                  if(JSON.stringify(permit).indexOf(c.to) > -1){
                    c.is_show = true
                  }else {
                    c.is_show = false
                  }
                })
              })
               // ***********************************************************************************
               const system_menu = menuobj.find(m => {
                return m.to == '/system'
              })
              
              if(system_menu){
                menuobj.map((d,index)=>{              
                  d.children instanceof Array && d.children.map((c,cindex)=>{
                    
                    if(c.to ==  "/system/org/type" || c.to ==  "/system/role" || c.to ==  "/system/turnstile"){
                      c.is_show = true
                    }
                  })
                })
              }
              // ***********************************************************************************
              resolve(menuobj)
            }else{
              //组织账号
              _util.setStorage('userdata', res.data.user_info);
              _util.setStorage('permission', res.data.user_info && res.data.user_info.permission);
              const permit = res.data.user_info.permission;
              menuobj.map((d,index)=>{
                if(JSON.stringify(permit).indexOf(d.to) > -1){
                  d.is_show = true
                }else {
                  d.is_show = false
                }
                d.children instanceof Array && d.children.map((c,cindex)=>{
                  // console.log(c.to,JSON.stringify(permit).indexOf(c.to))
                  if(JSON.stringify(permit).indexOf(c.to) > -1){
                    c.is_show = true
                  }else {
                    // d.is_show = false
                    c.is_show = false
                  }
                })
              })         
              resolve(menuobj)
            }

            //地址信息
            if(res.data && res.data.address){
              _util.setStorage('address', res.data.address);
              _util.setStorage('city', res.data.city ? res.data.city: null);
            }else{
              _util.setStorage('address', '苏州');
            }
            //项目信息
            if(res.data && res.data.name){
              _util.setStorage('project_name', res.data.name);
            }else{
              _util.setStorage('project_name', 'MJK');
            }

            //组织权限
            if(res.data && res.data.org_permission_data){
              _util.setStorage('orgpermission', res.data.org_permission_data);
            }

            //用户公司名&logo
            if(res.data&&res.data.project){
              const {name,logo} = res.data.project;
              if(name){
                this.setState({user_name:name})
              };
              if(logo){
                _util.setLogo(this,logo,'user_logo',GetTemporaryKey)
              }
            }


            // if(res.data.user_info && !res.data.is_project_admin){ //有权限
            //   permit = res.data.user_info.permission
            //   _util.setStorage('permission', res.data.user_info.permission);
            //   menuobj.map((d,index)=>{
            //     if(JSON.stringify(permit).indexOf(d.to) > -1){
            //       d.is_show = true
            //     }else {
            //       d.is_show = false
            //     }
            //     d.children instanceof Array && d.children.map((c,cindex)=>{
            //       // console.log(c.to,JSON.stringify(permit).indexOf(c.to))
            //       if(JSON.stringify(permit).indexOf(c.to) > -1){
            //         c.is_show = true
            //       }else {
            //         // d.is_show = false
            //         c.is_show = false
            //       }
            //     })
            //   })
            //   resolve(menuobj)
            // }else{
            //   permit = res.data.permission
            //   // _util.setStorage('permission', res.data.user_info.permission);
            //   menuobj.map((d,index)=>{
            //     if(JSON.stringify(permit).indexOf(d.to) > -1){
            //       d.is_show = true
            //     }else {
            //       d.is_show = false
            //     }
            //     d.children instanceof Array && d.children.map((c,cindex)=>{
            //       // console.log(c.to,JSON.stringify(permit).indexOf(c.to))
            //       if(JSON.stringify(permit).indexOf(c.to) > -1){
            //         c.is_show = true
            //       }else {
            //         // d.is_show = false
            //         c.is_show = false
            //       }
            //     })
            //   })
            //   resolve(menuobj)
            // }
            
          })
        })      
      }
    }


    /**
     * 
     * 渲染菜单
     * */
    async renderMenu() {
      const mjk_menu = [
        { "title": "", "name": "组织类型配置", "to": "/system/org/type", "children": [], "is_show": false, "order": 1, "wx_url": null,"is_super":true },               
        { "title": "", "name": "角色权限", "to": "/system/role", "children": [], "is_show": false, "order": 2, "wx_url": null,"is_super":true },    
        { "title": "", "name": "闸机管理", "to": "/system/turnstile", "children": [], "is_show": false, "order": 3, "wx_url": null,"is_super":true },   
      ]
      const project_id = _util.getStorage('project_id');
      if(project_id < 0){
        return
      }
      let menu = await this.getMenuSource();
      _util.setStorage('menu', menu)
      if (menu) {
        if (menu && menu instanceof Array) {
          menu.sort((a, b) => a.order - b.order);
          menu.forEach(m => {
            if (m.children.length > 0) {
              m.children.sort((a, b) => a.order - b.order);
            }
          });
          

          // const system_menu = menu.find(m => {
          //   return m.to == '/system'
          // })
          // if(system_menu){
          //   const {children} = system_menu;
          //   system_menu.children = [...mjk_menu,...children]
          //   var user_menuList = menu.filter(m => {
          //     return m.to != '/system'
          //   })
          //   var new_menuList = [...user_menuList,system_menu]
          //   this.setState({
          //     menuList: menu
          //   });
          // }else{
          //   this.setState({
          //     menuList: menu
          //   });
          // }

          this.setState({
            menuList: menu
          });
          
          
          
          menu.map((value, index, array) => {
            if (value.children.length && value.children instanceof Array) {
              value.children.map((value2, index2, array) => {
                let path = window.location.pathname.split("/");
                let parent_url = "";

                if (path.length > 3) {
                  parent_url = path.slice(0, 4).join("/");
                } else {
                  parent_url = path.join("/");
                }
                if (value2.to === parent_url) {
                  this.props.menuState.changeFirstHide(false);
                  this.props.menuState.changeMenuCurrentUrl(value2.to);
                  this.props.menuState.changeMenuOpenKeys(value.to);
                }
                return null;
              });
            } else {
              if (value.to === window.location.pathname) {
                this.props.menuState.changeMenuCurrentUrl(value.to);
              }
            }
            return null;
          });
        }
      }
    }

    handleSelectKey = (e) => {
      this.props.menuState.changeMenuCurrentUrl(e.key);
    }

    onOpenChange = (item) => {
      if (item.length > 1) {
        this.props.menuState.changeMenuOpenKeys(item.slice(1)[0]);
      } else {
        this.props.menuState.changeMenuOpenKeys(item[0]);
      }
      this.props.menuState.changeFirstHide(false);
    }

    //Add by JiangMinYu on 2019/09/20
    removeStorageInfo = (url) => {
      _util.removeSession("currentPage");
      _util.removeSession("scrollTop");
      _util.removeSession("pageSize");
      _util.removeSession("filtering");
      _util.removeSession("sorts");
      this.props.appState.resetPageSize();
      this.props.appState.resetCurrentPage();
      this.props.appState.resetScrollTop();
      this.clearDocumentModuleStorage();
      this.clearWorkflowModuleStorage();
    };

    //清空文档管理目录记录
    clearDocumentModuleStorage = () => {
      //临时目录
      _util.removeStorage("selectedTempKey");
      //注册目录
      _util.removeStorage("selectedFirstLevelKey");
      _util.removeStorage("selectedSecondLevelKey");
      _util.removeStorage("selectedThirdLevelKey");
      _util.removeStorage("selectedFirstLevelName");
      _util.removeStorage("selectedSecondLevelName");
      _util.removeStorage("selectedThirdLevelName");
      //工作流文档目录
      _util.removeStorage("document_workflow_key");
      _util.removeStorage("document_workflow_name");
      _util.removeStorage("document_workflow_record_key");
      _util.removeStorage("document_workflow_record_name");
    }

    //清空工作流记录
    clearWorkflowModuleStorage = () => {
      _util.removeStorage("workflow_wait_key");
      _util.removeStorage("workflow_wait_name");
      _util.removeStorage("workflow_record_key");
      _util.removeStorage("workflow_record_name");
    }

    checkShowMenu = (menu) => {
      const myadmin = _util.getStorage('myadmin')
      if(menu){
        if(menu.is_super){
          if(myadmin){
            return true
          }else{
            return false
          }
        }else{
          return true
        }
      }else{
        return false
      }
    }

    //渲染菜单
    generateMenu(dataSource) {
      this.checkShowMenu()
      if (dataSource.length && dataSource instanceof Array) {
        return (
          dataSource.map((menu, index) => {
            if (menu.children.length && menu.children instanceof Array) {
              //主菜单
              let icon;
              icon = <Icon type={menu.title} />;
              // if (menu.title === "setting" || menu.title === "team" || menu.title === "profile" || menu.title === "layout") {
              //   icon = <Icon type={menu.title} />;
              // } else {
              //   icon = <MyIcon type={`anticon-${menu.title}`} />;
              // }
              return (
                menu.is_show ?
                  <SubMenu
                    key={menu.to}
                    title={<span>
                      {icon}
                      <span>{menu.name}</span></span>}>
                    {this.generateMenu(menu.children)}
                  </SubMenu> : null
              );
            } else {
              //子菜单
              return (
                this.checkShowMenu(menu) && menu.is_show ?
                  <Menu.Item key={menu.to} onClick={() => this.removeStorageInfo(menu.to)}>
                    <Tooltip placement="right" title={menu.name}>
                    <Link to={menu.to} style={{paddingLeft:'22px'}}>
                      {menu.name}
                    </Link>
                    </Tooltip>              
                  </Menu.Item>: null
              );
            }
          })
        );
      }
    }

    handleVisibleChange = (visible) => {
      this.setState({visible})
    }

    //注销
    handleLogout = () => {
      const {formatMessage} = this.props.intl;
      logout().then((res) => {
        message.success(intl.get("app.component.side_layout.logout_success")); //注销成功
        localStorage.removeItem("menu");
        // localStorage.removeItem("project");
        // localStorage.removeItem("project_id");
        localStorage.removeItem("role");
        localStorage.removeItem("permission");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("lastLogin");
        this.props.menuState.setLogin(false);

        window.location.href = "/login";
      });
    }


    //修改语言
    changeLang = ({ key }) => {
      if(this.state.language == key){
        return;
      }else {
        this.props.menuState.setLanguage(key);
        _util.setStorage("langs", key);
        _util.setCookie("django_language", key);
        this.setState({language: key});
      }
    }

    //打开右抽屉
    showProjectDrawer = () => {
      this.setState({projectDrawer:true})
    };

    //关闭右抽屉
    closeProjectDrawer = () => {
      this.setState({projectDrawer:false})
    }

    //切换项目
    switchProject = (val) => {
      var prev_project_id = _util.getStorage('project_id')
      if(prev_project_id == val){
        //未切换项目
        return
      }
      _util.setStorage('project_id',val);
      _util.removeStorage('is_project_admin');
      this.props.appState.setProjectId(val);//在mbox中修改project
      this.props.menuState.changeFetching(true);
      this.props.menuState.changeFetching(false);
      const project = this.state.projectList.find(item => {
        return item.id === val
      });
      _util.setStorage('project',project);
     
      //获取项目信息
      SwitchProject({project_id: val}).then((res) => {
        if(res.data && res.data.user_info){
          //项目内人员
          _util.setStorage('userdata', res.data.user_info);
        } 
        if(res.data && res.data.org_permission_data){
          _util.setStorage('orgpermission', res.data.org_permission_data);
        }
        if(_util.getStorage('myadmin') || _util.getStorage('admin') || res.data && res.data.is_project_admin){
          _util.setStorage('permission', res.data.permission);
          this.setState({
            permit: res.data.permission
          });
        }else {
          _util.setStorage('permission', res.data.user_info && res.data.user_info.permission);
          this.setState({
            permit: res.data.user_info && res.data.user_info.permission
          });
        }

        this.setState({is_active: res.data.is_active})

        if(res.data.contractor){
          _util.setStorage('contractor', res.data.contractor)
        }else{
          _util.removeStorage('contractor')
        }

        //用户公司名&logo
        if(res.data&&res.data.project){
          const {name,logo} = res.data.project;
          if(name){
            this.setState({user_name:name})
          }else{
            this.setState({user_name:''})
          }
          if(logo){
            _util.setLogo(this,logo,'user_logo',GetTemporaryKey)
          }else{
            this.setState({user_logo:''})
          }
        }else{
          this.setState({user_name:'',user_logo:''})
        }
        
      });

      //渲染菜单
      this.renderMenu();
      this.props.history.replace({
        pathname: '/',
        state: {
          id:val
        }
      });
      this.closeProjectDrawer();

      //消息通知
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.getTopMessage()
      this.timer = setInterval(this.getTopMessage, 1000 * 2 * 60)
    }


    switchMJKHome = () => {
      _util.removeStorage('project')
      _util.removeStorage('project_id')
      this.renderMenu();
      this.props.history.push({
        pathname: '/myadmin/user',
      });
      this.closeProjectDrawer();
    }

    //获取通知消息
    getTopMessage = () => {
      this.setState({
        topMessage: []
      });
      const project_id = _util.getStorage("project_id");
      if(project_id&&project_id>0){
        messageList({project_id:project_id}).then(res => {
          if(res&&res.data&&res.data.results){
            this.setState({topMessage:res.data.results})
          }
        })
        noticeList({project_id:project_id}).then(res => {
          if(res.data&&res.data.results){
            this.setState({ message_list:res.data.results}) 
          }
        })
        todoList({project_id:project_id}).then(res => {
          if(res.data&&res.data.results){
            this.setState({need_handle_list:res.data.results})
          }
        })
      }
    }

    showMsgDetail = (id) => {
      const {topMessage} = this.state;
      const currentMessage = topMessage.find(item => {
        return item.id == id
      });
      const {title,m_type,content} = currentMessage;
      if(m_type == 1){
        //文字
        this.setState({
          msgContent: content,
          msgTitle: title,
          msgType:m_type,
          showMessageModal: true,
        })
      }else{
        console.log('0218',_util.switchToJson(content)[0]['url'])
        var source = _util.switchToJson(content)[0]['url'];
        if (source) {
          //转换前端格式
          var that = this;
          var cos = _util.getCos(null,GetTemporaryKey);
          var url = cos.getObjectUrl({
              Bucket: 'ecms-1256637595',
              Region: 'ap-shanghai',
              Key:source,
              Sign: true,
          }, function (err, data) {
              if(data && data.Url){    
                window.open(data.Url)
              }
          });   
      }             
      }  
    }

    handleMsgModalCancel = () => {
      this.setState({
        msgContent: '',
        msgTitle: '',
        msgType:'',
        showMessageModal: false
      })
    }


    //待办跳转
    handleTodo = (item) => {
      const _this = this;
      const {t_type,d_id,id} = item;
      if(t_type == 1){
        _this.props.history.push('/')
      }else if(t_type == 2){
        _this.props.history.push({
          pathname: "/workflow/record/wait/pdf",
          // pathname: '/workflow/record/wait/detail',
          state: {
            id: d_id,
            type:2
          }
        })
      }else if(t_type == 3){
        _this.props.history.push(`/system/org/application/audit/${d_id}`)
        _this.setState({visible:false})
      }else if(t_type == 4){
        _this.props.history.push({
          pathname: "/staff/approve/audit",
          state: {
            id: d_id
          }
        })
        _this.setState({visible:false})
      }else if(t_type == 5){
        _this.props.history.push({
          pathname: "/staff/my/factoryapply/audit",
          state: {
            id: d_id
          }
        })
        _this.setState({visible:false})
      }else if(t_type == 6){
        //培训
        message.warning('请在手机上查看')
        _this.setState({visible:false})
      }else if(parseInt(t_type) == 7){
        _this.props.history.push({
          pathname: "/assignment/wait/detail",
          state: {
            id: d_id
          }
        });
        _this.setState({visible:false})
      }
      else{
        _this.props.history.push('/')
      }
      // switch(t_type){
      //   case 1:
      //     _this.props.history.push('/')
      //   case 2:
      //     _this.props.history.push('/')
      //   case 3://组织审批
      //     _this.props.history.push(`/system/org/application/audit/${d_id}`)
      //     _this.setState({visible:false})
      //   case 4://员工审批
      //     _this.props.history.push(`/system/staff/audit/audit/${d_id}`)
      //     _this.setState({visible:false})
      //   case 5://绿码审批
      //     _this.props.history.push(`/system/safety/my/factoryapply/audit/${d_id}`)
      //     _this.setState({visible:false})
      // }
    }

    deleteTodo = (id) => {
      //单个删除
      const project_id = _util.getStorage("project_id");
      todoDelete(project_id,{id:id}).then(res => {
        this.setState({visible:false})
        this.getTopMessage()
      })
    }

    deleteAllTodo = () => {
      //全部删除
      const project_id = _util.getStorage("project_id");
      todoDelete(project_id,{mode:true}).then(res => {
        this.setState({visible:false})
        this.getTopMessage()
      })
    }

    deleteNotice = (id) => {
      //单个删除
      const project_id = _util.getStorage("project_id");
      noticeDelete(project_id,{id:id}).then(res => {
        this.setState({visible:false})
        this.getTopMessage()
      })
    }

    

    readNotice = (id) => {
      //单个已读
      const project_id = _util.getStorage("project_id");
      noticeRead(project_id,{id:id}).then(res => {
        this.setState({visible:false})
        this.getTopMessage()
      })
    }

    deleteAllNotice = () => {
      //全部删除
     const project_id = _util.getStorage("project_id");
     noticeDelete(project_id,{mode:true}).then(res => {
       this.setState({visible:false})
       this.getTopMessage()
     })
   }

   readAllNotice = () => {
     //全部已读
     const project_id = _util.getStorage("project_id");
     noticeRead(project_id,{mode:true}).then(res => {
       this.setState({visible:false})
       this.getTopMessage()
     })
   }

   goToHome = () => {
    this.props.history.push('/');
    this.props.menuState.changeMenuCurrentUrl("/");
    this.props.menuState.changeMenuOpenKeys("/");
   }

    
    
    render() {
      const {
        collapsed,
        mode,
        defaultSelectedKeys,
        projectDrawer,
        projectList,
        currentProject,
        menuList,
        visible,
        topMessage,
        user_name,
        user_logo,
        logo_loading
      } = this.state;
      const { formatMessage } = this.props.intl;
      const userMenu = (
        <Menu >
          <Menu.Item >
              <Link to='/account/info'><Icon type="user"/>&nbsp;&nbsp;
                  <FormattedMessage
                      id="global.center" 
                      defaultMessage="个人中心" />     
              </Link>
          </Menu.Item>
          <Menu.Divider/>
          <Menu.Item >
              <Link to='/password'><Icon type="lock"/>&nbsp;&nbsp;
                  <FormattedMessage
                      id="global.password" 
                      defaultMessage="修改密码" /> 
              </Link>
          </Menu.Item>
          <Menu.Divider/>
          <Menu.Item >
              <Link to='/account/changePhone'><Icon type="mobile"/>&nbsp;&nbsp;
                  <FormattedMessage
                      id="global.mobile" 
                      defaultMessage="修改手机号" /> 
              </Link>
          </Menu.Item>
          <Menu.Divider/>
        </Menu>
      );


      const drawerStyleAdmin = {
        drawer:{backgroundImage:'linear-gradient(to right, #f0ffff , #ffffff)'},
        header:{backgroundImage:'linear-gradient(to right, #f0ffff , #ffffff)'},
        body:{background:'#ADD8FF',padding:0}
      }

      const drawerTitleStyleAdmin = {
        width:'100%',
        height:'64px',
        background:'#f0ffff',
        color:'#174276',
        textAlign:'center',
        lineHeight:'64px',
      }

      const projectOptions = projectList instanceof Array && projectList.length ? projectList.map(d =>
        <p 
          key={d.id} 
          value={d.id} 
          onClick={() => this.switchProject(d.id)} 
          style={{cursor:'pointer',width:'100%',height:'30px',lineHeight:'30px',textAlign:'center'}}
        >
          {d.name}
        </p>) : [];
      
      const userInfo = _util.getStorage("userInfo");
      const project = _util.getStorage("project");
      const userdata = _util.getStorage("userdata") ? _util.getStorage("userdata") : null;

      // const {message_list, need_handle_list} = this.props.menuState
      const {message_list,need_handle_list} = this.state;
      const msgLen = message_list.length
      const msgNoReadLen = message_list.filter(m => !m.is_read).length
      const handleLen = need_handle_list.length

      const messageMenu = 
      <Tabs defaultActiveKey="1">
      <TabPane
          tab={
              <span>
                  <FormattedMessage
                      id="global.message" 
                      defaultMessage="消息" />
                  {
                      msgNoReadLen > 0 ? '(' + msgNoReadLen + ')' : ''
                  }
              </span>
          }
          key="1">
          {
              msgLen === 0
              ? <div style={{
                  lineHeight: '53px',
                  height: 53,
                  textAlign: 'center'
              }}><FormattedMessage
              id="global.nodata" 
              defaultMessage="暂无数据" /></div>
              : <VList
              width={336}
              height={
                  msgLen === 1
                  ? 92
                  : msgLen === 2
                      ? 184
                      : msgLen === 3
                          ? 276
                          : msgLen === 4
                              ? 368
                              : 400}
              rowCount={message_list.length}
              rowHeight={92}
              rowRenderer={({
                  index, key, style
              }) => {
                  const item = message_list[index]

                  return (
                      <div style={{ 
                          ...style,
                          overflow: 'hidden',
                          padding: 10,
                          opacity: item.is_read ? 0.7 : 1,
                          borderTop: index === 0 ? 0 : '1px solid #e8e8e8',
                          display: 'flex'
                      }}
                      key={key}
                      >
                          <div style={{
                              float: 'left',
                              width: 56,
                              maxWidth: 56,
                              minWidth: 56
                          }}>
                              <img 
                                  src={require('./dd.png')}
                                  style={{
                                      display: 'block',
                                      width: 30,
                                      height: 30,
                                      borderRadius: '100%',
                                      margin: '2px auto 0'
                                  }} />
                              {
                                  item.is_read
                                  ? null
                                  : <div
                                      style={{
                                          textAlign: 'center',
                                          fontSize: 12,
                                          height: 20,
                                          lineHeight: '20px',
                                          cursor: 'pointer'
                                      }}
                                      onClick={() => this.readNotice(item.id)}>
                                      <FormattedMessage
                      id="global.read" 
                      defaultMessage="已读" />
                                      </div>
                              }
                              <div
                                  style={{
                                      textAlign: 'center',
                                      fontSize: 12,
                                      height: 20,
                                      lineHeight: '20px',
                                      cursor: 'pointer'
                                  }}
                                  onClick={() => this.deleteNotice(item.id)}>
                                  <FormattedMessage
                      id="global.delete" 
                      defaultMessage="删除" />
                              </div>
                          </div>
                          <div style={{
                              float: 'left',
                              flexGrow: 1,
                              // width: 250
                          }}>
                              <div style={{
                                  width: '100%',
                                  height: 32,
                                  lineHeight: '32px',
                                  overflow: 'hidden',
                                  // whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                  wordBreak: 'break-all',
                                  wordWrap: 'break-word',
                                  fontSize: 14
                              }}
                              title={item.title}>
                                  {item.title}
                              </div>
                              <div style={{
                                  height: 20,
                                  lineHeight: '18px',
                                  color: 'rgba(0, 0, 0, .45)',
                                  fontSize: 12,
                              }}>
                                  <span>{item.content ? item.content :''}</span><br />
                                  <span>{moment(item.created_time).fromNow()}</span>
                              </div>
                          </div>
                      </div>
                     
                  )
              }}
          />
          }
          {
              msgLen <= 0
                  ?
                  null
                  :
                  <div className={todostyles.clear}>
                      <span
                          style={{width: '50%', float: 'left',cursor:'pointer'}}
                          onClick={() => this.readAllNotice()}>
                          <FormattedMessage
                      id="global.clear-message" 
                      defaultMessage="全部已读" />
                          </span>
                      <span
                          style={{width: '50%', float: 'left',cursor:'pointer'}}
                          onClick={() => this.deleteAllNotice()}>
                          <FormattedMessage
                      id="global.clear-all" 
                      defaultMessage="全部删除" />
                      </span>
                  </div>
          }

      </TabPane>
      <TabPane
          tab={
              <span>
                  <FormattedMessage
                      id="global.todo" 
                      defaultMessage="待办" />
                  {
                      handleLen > 0 ? '(' + handleLen + ')' : ''
                  }
              </span>
          }
          key="2"
      >
          {
              handleLen === 0
              ? <div style={{
                  lineHeight: '53px',
                  height: 53,
                  textAlign: 'center'
              }}>
                  <FormattedMessage
                      id="global.nodata" 
                      defaultMessage="暂无数据" />
                  </div>
              : <VList
              width={336}
              height={
                  handleLen === 1
                  ? 92
                  : handleLen === 2
                      ? 184
                      : handleLen === 3
                          ? 276
                          : handleLen === 4
                              ? 368
                              : 400}
              rowCount={need_handle_list.length}
              rowHeight={92}
              rowRenderer={({
                  index, key, style
              }) => {
                  const item = need_handle_list[index]
                  return (
                      <div style={{ ...style,overflow: 'hidden',padding: 10,borderTop: index === 0 ? 0 : '1px solid #e8e8e8'}}
                        key={key}                          
                      >
                        <div style={{height: 32,lineHeight: '32px',fontSize: 14,overflow: 'hidden',}}>
                          <span title={item.title} style={{float: 'left',cursor:'pointer'}} onClick={() => this.handleTodo(item)}>
                              {item.title}
                          </span>
                          <Tag 
                            color='red'
                            style={{float: 'right', fontSize: 12,cursor:'pointer'}}
                            onClick={() => this.deleteTodo(item.id)}
                          >
                              <FormattedMessage id="global.delete" defaultMessage="删除" />
                          </Tag>
                        </div>
                        <div
                          style={{
                              width: '100%',
                              height: 36,
                              lineHeight: '18px',
                              fontSize: 12,
                              color: 'rgba(0, 0, 0, .45)',
                              overflow: 'hidden',
                          }}
                        >
                            <span>{item.content ? item.content :''}</span><br/>
                            <span>{item.created_time ? moment(item.created_time).format('YYYY-MM-DD HH:MM:SS') : ''}</span>                        
                        </div>
                        {/* <div
                            style={{
                              display:'flex',
                              alignItems:'center',
                              marginTop:'10px'
                            }}
                        >
                            <Button size='small' type='primary' onClick={() => this.handleTodo(item)}>处理</Button>
                            <Button size='small' type='danger' onClick={() => this.deleteTodo(item.id)} style={{marginLeft:'10px'}}>删除</Button>
                        </div> */}
                      </div>
                  )
                }
              }
          /> 
          }
          {
              handleLen <= 0
                  ?
                  null
                  :
                  <div className={todostyles.clear}>
                      <span
                          style={{width: '100%', float: 'left'}}
                          onClick={() => this.deleteAllTodo()}
                      >
                          <FormattedMessage
                      id="global.clear-all" 
                      defaultMessage="全部删除" /></span>
                  </div>
          }
      </TabPane>
  </Tabs>

      return (
        <div style={{height: "100%", overflow: "hidden"}}>
          {
            this.props.menuState.fetching
              ?
              <div style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: "rgba(255, 255, 255, .4)",
                zIndex: 9999999
              }}>
                <Spin style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}></Spin>
              </div>
              :
              null
          }
          <Layout>


            {/* Sider */}
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              width={230}
              className="sider"
              style={{paddingBottom: '16px'}}
            >
              <div className="logo" key="logo" onClick={() => this.goToHome()} style={{cursor:'pointer'}}>
                  <img src={require("./logo_cloud.png")} alt="logo"/>
                  <h1>{user_name ? user_name :'eCMS'}</h1>
              </div>
              <Scrollbars
                style={{
                  marginTop: "5px",
                  height: "calc( 100vh - 69px )"
                }}
                autoHide>
                <Menu
                  theme="light"
                  mode={mode}
                  defaultSelectedKeys={defaultSelectedKeys}
                  selectedKeys={[this.props.menuState.menuCurrentUrl]}
                  openKeys={this.props.menuState.firstHide ? null : [this.props.menuState.menuOpenKeys]}
                  onSelect={this.handleSelectKey}
                  onOpenChange={this.onOpenChange}
                  style={{
                    padding: "0 0 16px 0",
                    width: "100%"
                  }}
                >
                  {
                    this.generateMenu(menuList)
                  }
                </Menu>
              </Scrollbars>
            </Sider>


           
            <Layout style={{height: "100%", overflow: "hidden"}}>

               {/* Header */}
              <Header style={{background: "#fff", padding: 0, zIndex: 1}}>
                <div className="header" style={{overflow:'hidden'}}>
                  <Icon
                    className="trigger"
                    type={collapsed ? "menu-unfold" : "menu-fold"}
                    onClick={this.toggle}
                  />
                  <div className="nav">
                    <ul>
                      <li>
                        <Dropdown overlay={userMenu}>
                          <a style={{display: "block", height: 64}}
                            className="ant-dropdown-link user-menu">
                            <span className='margin-left-10' style={{
                              display: "inline-block",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden"
                            }}>
                              {/* {userInfo.phone ? userInfo.phone : ''} */}
                              {userdata&&userdata.name ? userdata.name : userInfo&&userInfo.name ? userInfo.name :'MJK'}
                              {/* {userdata ? `-${userdata.org&&userdata.org.company ? userdata.org.company :''}` : null} */}
                            </span>
                          </a>
                        </Dropdown>
                      </li>

                      <li>
                        <a rel="noopener noreferrer" onClick={() => this.handleLogout()}><Icon
                          type="poweroff"/>&nbsp;&nbsp;
                        <FormattedMessage
                          id="global.logout"
                          defaultMessage="注销" />
                        </a>
                      </li>

                      <li>
                        <div onClick={()=>this.showProjectDrawer()} style={{cursor: 'pointer', textAlign: 'center'}}>
                            <Icon type="environment" style={{color: "#12517D",marginRight:'5px'}}/>
                            <span style={{color: "#12517D"}}>
                            {_util.getStorage('project_id') ? `${_util.getStorage('project_name')}${this.state.is_active === false ? '(已归档)' : '' }` : "MJK"}
                            </span>
                        </div>     
                      </li>

                      <li>
                          <Popover
                              id='topPopover'
                              content={messageMenu}
                              trigger="click"
                              visible={visible}
                              onVisibleChange={this.handleVisibleChange}
                              placement="bottom"
                              arrowPointAtCenter
                              popupClassName={todostyles.popover}
                          >

                              <a style={{display: 'block', marginTop: 2}}>
                                  <Badge count={msgNoReadLen + handleLen}>
                                      <Icon type="bell"/>&nbsp;&nbsp;
                                      <FormattedMessage
                                  id="global.notice" 
                                  defaultMessage="重要通知" />
                                  </Badge>
                              </a>

                          </Popover>
                      </li>

                      <li style={{marginRight:'10px',}}>
                        <Dropdown overlay={
                          <Menu
                            selectedKeys={[this.state.language]}
                            onClick={this.changeLang}>
                            <Menu.Item className="lang" key='zh-Hans'>
                              {/*<img src="https://image.flaticon.com/icons/svg/299/299914.svg" />*/}
                              <img src={require("../../assets/locales/china.png")} />
                              <span className="lang-txt">CN</span>
                            </Menu.Item>
                            <Menu.Item className="lang" key='en'>
                              {/*<img src="https://image.flaticon.com/icons/svg/299/299722.svg" />*/}
                              <img src={require("../../assets/locales/uk.png")} />
                              <span className="lang-txt">EN</span>
                            </Menu.Item>
                          </Menu>
                        }>
                          <div className="current" style={{
                            lineHeight: "64px",
                            height: 64,
                            cursor: "pointer",
                          }}>
                            {
                              this.state.language == "zh-Hans" ?
                                <img src={require("../../assets/locales/china.png")} style={{marginBottom:'3px'}}/>
                                :
                                <img src={require("../../assets/locales/uk.png")} style={{marginBottom:'3px'}}/>
                            }
                            {
                              this.state.language == "zh-Hans" ?
                                <span className="lang-txt" style={{marginBottom:'3px'}}>CN</span>
                                :
                                <span className="lang-txt" style={{marginBottom:'3px'}}>EN</span>
                            }
                          </div>
                        </Dropdown>
                      </li> 
                      {
                       topMessage&&topMessage.length ? 
                        <li style={{marginRight:'5px'}}>
                          <a rel="noopener noreferrer">
                          <Icon type="sound"/>
                          </a>
                        </li> : null
                      }
                      
                      <li style={{ width: '200px', paddingTop: '9px',marginLeft:'0'}}>
                        <Carousel dots={null} vertical autoplay>
                            {
                                Array.isArray(topMessage) && topMessage.map((msg, index) => {
                                    return (
                                        <div
                                            className={stylesMsg.msgBar}
                                            key={index}>
                                            
                                            <span onClick={() => this.showMsgDetail(msg.id)}>{msg.title}</span>
                                        </div>
                                    )
                                })
                            }
                            {
                                Array.isArray(topMessage) && (topMessage.length === 1) ?
                                    <div
                                        className={stylesMsg.msgBar}>
                                        {/* <Icon type="sound" style={{
                                            fontSize: '15px',
                                        }}/>&nbsp; */}
                                        <span onClick={() => this.showMsgDetail(topMessage[0].id)}>{topMessage[0].title}</span>
                                    </div> : null
                            }
                        </Carousel>
                      </li>                  
                    </ul>
                    <Modal
                        title={
                            <div style={{
                                width: '90%',
                                wordBreak: 'break-all',
                                wordWrap: 'break-word'
                            }}>
                                <span>{this.state.msgTitle}</span>
                            </div>
                        }
                        visible={this.state.showMessageModal}
                        onCancel={this.handleMsgModalCancel}
                        footer={null}
                    >
                        <p style={{
                            wordBreak: 'break-all',
                            wordWrap: 'break-word'
                        }}>{this.state.msgContent}</p>
                    </Modal>
                    <Modal
                      title={
                        <div style={{
                          width: "90%",
                          wordBreak: "break-all",
                          wordWrap: "break-word"
                        }}>
                          <span>{this.state.msgTitle}</span>
                          <span style={{
                            color: "#aaa",
                            fontSize: "12px",
                            marginLeft: "20px"
                          }}>{this.state.msgCreatedTime}</span>
                        </div>
                      }
                      visible={this.state.showModal}
                      onCancel={this.handleModalCancel}
                      footer={null}
                    >
                      <p style={{
                        wordBreak: "break-all",
                        wordWrap: "break-word"
                      }}>{this.state.msgName}</p>
                    </Modal>
                  </div>
                  <div style={{float:"right",height:'100%'}}>
                    <Spin spinning={logo_loading}>
                    {user_logo ? <img src={user_logo} alt="logo" style={{height:'40px',maxWidth:'120px'}}/> : '' }  
                    </Spin>
                  </div>
                </div>
              </Header>
              <Content >
                {this.props.children}
              </Content>
              <Footer style={{textAlign: "center"}}>
                <a href="http://www.beian.miit.gov.cn" target="_Blank" style={{color: "#12517D"}}>苏ICP备18027894号-1</a>&nbsp;&nbsp;&nbsp;&nbsp;
                            ©2019 <FormattedMessage id="app.component.side_layout.copyright" defaultMessage="苏州曼捷科智能科技有限公司版权所有"/> V1.0
              </Footer>
            </Layout>
          </Layout>

          {/*  Drawer */}
          <Drawer
            placement="right"
            closable={false}
            onClose={this.closeProjectDrawer}
            visible={projectDrawer}
            drawerStyle={drawerStyleAdmin.drawer}
            headerStyle={drawerStyleAdmin.header}
            bodyStyle={drawerStyleAdmin.body}
          >
            <div>
              <div
                style={drawerTitleStyleAdmin} 
              >
                项目列表
              </div>
              {projectOptions}
              {
                _util.getStorage('myadmin') === true ?
                <div 
                  style={{width:'100%',height:'40px',background:'#daa520',color:"#001529",textAlign:'center',lineHeight:'40px',cursor:'pointer'}} 
                  onClick={() => this.switchMJKHome()}
                >
                  返回MJK主页
                </div>
                :
                  null
              }
              
            </div>      
          </Drawer>
        </div>
      );
    }
}

export default withRouter(injectIntl(SideLayout));
