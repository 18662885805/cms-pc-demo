import React from "react";
import {
  observable,
  action
} from "mobx";

class MenuState {
    @observable menuOpenKeys = null
    @observable menuCurrentUrl = "/"
    @observable firstHide = true
    @observable message_list = []
    @observable need_handle_list = []
    @observable isLogin = false
    @observable avatar = ""
    @observable fetching = false
    @observable pdfShow = false
    @observable pdfElement = null
    @observable trainingInfoView = {}
    // @observable language = '' || 'zh-Hans'
    @observable language = ""

    @action setLanguage (lang) {
      this.language = lang;
    }
    @action setPdfShow (show) {
      this.pdfShow = show;
    }
    @action setPdfElement (element) {
      this.pdfElement = element;
    }

    @action changeFetching (f) {
      this.fetching = f;
    }

    @action changeAvatar(avatar) {
      this.avatar = avatar;
    }

    @action changeMenuOpenKeys (openKeys) {
      this.menuOpenKeys = openKeys;
    }

    @action changeMenuCurrentUrl (url) {
      this.menuCurrentUrl = url;
    }

    @action changeFirstHide (flag) {
      this.firstHide = flag;
    }

    @action changeMessageList (message_list) {
      this.message_list = message_list;
    }

    @action changeNeedList (need_handle_list) {
      this.need_handle_list = need_handle_list;
    }

    @action setLogin (isLogin) {
      this.isLogin = isLogin;
    }

    @action setTrainingInfoView (permissionObj) {
      this.trainingInfoView = permissionObj;
    }
}

const menuState = new MenuState();

export default menuState;
