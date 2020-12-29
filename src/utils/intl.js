
import React, { Component } from "react";
import ReactDOM from "react-dom";
// import App from './App'
// import registerServiceWorker from './registerServiceWorker'
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import zh from "react-intl/locale-data/zh";
import localeData from "./utils/locales/data.json";
import {
  inject,
  observer,
  Provider
} from "mobx-react";
// import menuState from './store/menu-state'
import "@utils/axios-config";


addLocaleData([...zh, ...en]);

// @inject('menuState')
@observer
class Intl extends Component {
  render() {
    let { locale, localeMessage, children } = this.props;
    //const { language } = this.props.menuState

    //let locale = language ?  language : localStorage.getItem('langs')

    // Split locales with a region code
    // const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    //const languageWithoutRegionCode = locale.toLowerCase().split(/[_-]+/)[0];

    // Try full locale, fallback to locale without region code, fallback to en
    // const messages = localeData[language] || localeData[languageWithoutRegionCode] || localeData.zh;
    //const messages = localeData[locale] || localeData[languageWithoutRegionCode] || localeData.zh;
    //console.log(messages)
    return (
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    );
  }
}


export default Intl;
// registerServiceWorker()