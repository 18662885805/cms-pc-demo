import "react-app-polyfill/ie9";
import React from "react";
import ReactDOM from "react-dom";
import CookieInfo from "@component/CookieInfo";
import App from "./App";
//import Ppa from './Ppa'
// import registerServiceWorker from './registerServiceWorker'
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import zh from "react-intl/locale-data/zh";
import localeData from "@utils/locales/data.json";
import CommonUtil from "@utils/common";
import {
  inject,
  observer,
  Provider
} from "mobx-react";
import menuState from "./store/menu-state";
import "@utils/axios-config";
import intl from "react-intl-universal";

let _util = new CommonUtil();

const locales = {
  "en": require("@utils/locales/en"),
  "zh-Hans": require("@utils/locales/zh")
};

function isIE() {
  var av = navigator.appVersion.toLowerCase();
  var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;

  return av.indexOf("msie") > -1 || isIE11 || av.indexOf("edge") > -1;
}

addLocaleData([...zh, ...en]);

@inject("menuState")
@observer
class Ppa extends React.Component {

  state = {initDone: false};

  componentDidMount() {
    this.loadLocales();
  }

  loadLocales() {
    let currentLocale = intl.determineLocale({
      // urlLocaleKey: 'lang',
      cookieLocaleKey: "django_language",
      localStorageLocaleKey: "langs"
    });

    // console.log(currentLocale)

    intl.init({
      currentLocale,
      locales
    }).then(() => {
      // After loading CLDR locale data, start to render
	  this.setState({initDone: true});
    });

  }

  render() {
    const { language } = this.props.menuState;
    // let locale = language ?  language : _util.getStorage('langs')
    let locale = _util.getStorage("langs") || _util.getCookie("django_language") || "zh-Hans";

    if(locale !== "en" && locale !== "zh-Hans"){
      menuState.setLanguage(locale);
      _util.setStorage("langs", "zh-Hans");
      _util.setCookie("django_language", "zh-Hans");
    }

    // Split locales with a region code
    // const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    const languageWithoutRegionCode = locale.toLowerCase().split(/[_-]+/)[0];

    // Try full locale, fallback to locale without region code, fallback to en
    // const messages = localeData[language] || localeData[languageWithoutRegionCode] || localeData.zh;
    const messages = localeData[locale] || localeData[languageWithoutRegionCode] || localeData.zh;
    // console.log(messages)
    return (
      <IntlProvider locale={locale} messages={messages}>
        <div style={{height: "100%"}}>
          <App />
          <CookieInfo />
        </div>
      </IntlProvider>
    );
  }
}

if (!isIE()) {
  ReactDOM.render(
    <Provider menuState={menuState}>
      <Ppa />
    </Provider>,
    document.getElementById("root")
  );
}

// registerServiceWorker()