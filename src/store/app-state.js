import {
  observable,
  computed,
  autorun,
  action
} from "mobx";
import createBrowserHistory from "history/createBrowserHistory";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import menuState from "./menu-state";
import CommonUtil from "@utils/common";

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);
let _util = new CommonUtil();

class AppState {
  @observable count = 0
  @observable name = "drw"
  @observable permission = null
  @observable records = []
  @observable isRecords = false
  @observable responseStatus = null
  @observable routingStore = routingStore
  @observable tableData = {}
  @observable scrollTop = {}
  @observable order_id = ""
  @observable check_id = ""
  @observable pageSize = 200
  @observable currentPage = 1
  @observable sorts = {}
  @observable shouldSort = false
  @observable tableScrollTop = 0
  @observable currentProject = null
  @observable project_id = ''

  @computed get msg() {
    return `${this.name}的数量是${this.count}`;
  }

  @action setProjectId(project_id) {
    this.project_id = project_id;
  }

  @action add() {
    this.count += 1;
  }

  @action getPermission(permission) {
    this.permission = permission;
  }

  @action setProjectRecords(records) {
    this.records = records;
  }

  @action setRecordsStatus(status) {
    this.isRecords = status;
  }
  @action getPathname() {
    return this.routingStore.history.location.pathname;
  }
  @action setTableData(data) {
    this.tableData[this.routingStore.history.location.pathname] = data;
  }
  @action clearTable() {
    this.tableData = {};
    this.scrollTop = {};
  }
  @action setScrollTop(top) {
    this.tableScrollTop = top;
    // this.scrollTop[this.routingStore.history.location.pathname] = top
  }
  //--------------Add by JiangMinYu on 2019/09/20--------------
  @action setPageSize(pageSize) {
    this.pageSize = pageSize;
  }
  @action setCurrentPage(current) {
    this.currentPage = current;
  }
  @action setSorts(sorts) {
    this.sorts = sorts;
  }
  @action resetPageSize() {
    this.pageSize = 200;
  }
  @action changeShouldSort(boolean) {
    this.shouldSort = boolean;
  }
  @action resetCurrentPage() {
    this.currentPage = 1;
  }
  @action resetScrollTop() {
    this.scrollTop = {};
  }
  //-----------------------------------------------------------
  @action setEQPTWorkOrder(id) {
    this.order_id = id;
  }
  @action setEQPTCheckId(id) {
    this.check_id = id;
  }
  @action setResponseStatus(status) {
    let token = _util.getStorage("token");

    if (status === "needresetpassword") {

      this.routingStore.replace({
        pathname: "/password",
        state: {
          title: "注意",
          content: "你需要修改密码才可以继续使用"
        }
      });
    }

    if (status === 401) {
      const policy = _util.getStorage("agreePrivacyPolicy");
      if (policy) {
        localStorage.clear();
        _util.setStorage("agreePrivacyPolicy", policy);
      } else {
        localStorage.clear();
      }

      this.routingStore.push({
        pathname: "/login",
        search: `?redirect=${encodeURIComponent(window.location.pathname)}`
      });
    }

    if (status === 403) {
      if (!token) {
        this.routingStore.push({
          pathname: "/error"
        });
        return;
      }
      this.routingStore.push({
        pathname: "/403"
      });
    }

    if (status === 404) {
      if (!token) {
        this.routingStore.push({
          pathname: "/error"
        });
        return;
      }
      this.routingStore.push({
        pathname: "/404"
      });
    }

    if (status === 500) {
      if (!token) {
        this.routingStore.push({
          pathname: "/error"
        });
        return;
      }

      this.routingStore.push({
        pathname: "/500"
      });
    }
  }
}

const appState = new AppState();

export default appState;

export { history };
