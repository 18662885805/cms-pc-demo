import React, { Component, Fragment } from "react";
import CommonUtil from "@utils/common";
import { Modal } from "antd";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";

const _util = new CommonUtil();

class CookieInfo extends Component {
    state = {
      agreePrivacyPolicy: _util.getStorage("agreePrivacyPolicy"),
      visible: false,
      privacy_english:  `<p>Suzhou MJK Intelligent Technology Co., Ltd. (hereinafter referred to as <span style="color: rgba(0,0,0,0.65);background-color: rgb(255,255,255);font-size: 14px;font-family: Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;">MJK</span>) respects and protects the privacy of all users who use the service. <span style="color: rgba(0,0,0,0.65);background-color: rgb(255,255,255);font-size: 14px;font-family: Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;">MJK</span> will treat and process this information with a high degree of diligence and prudence. By agreeing to the System Service Use Agreement, you are deemed to have agreed to the entire contents of this Privacy Policy. This Privacy Policy is an integral part of the System Service Use Agreement.</p>
                           <p>Information storage</p>
                           <p>The system collects your relevant information (including name, mobile, and work number, department, company mailbox) for the purpose of electronic process and push function. <span style="color: rgba(0,0,0,0.65);background-color: rgb(255,255,255);font-size: 14px;font-family: Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;">MJK </span>will not access and process this information without permission.</p>
                           <p>information security</p>
                           <p>1. The system uses a variety of technical means to ensure information security, network data transmission in the whole process of encryption, the website through the German T-System penetration test. Please keep your username and password information safe. <span style="color: rgba(0,0,0,0.65);background-color: rgb(255,255,255);font-size: 14px;font-family: Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;">MJK</span>will ensure that your information is not lost, misused and altered by security measures such as encrypting user passwords. Despite the aforementioned security measures, please also note that there is no “perfect security measure” on the information network.</p>
                           <p>2. When using this system, if you find that your personal information is leaked, please contact <span style="color: rgba(0,0,0,0.65);background-color: rgb(255,255,255);font-size: 14px;font-family: Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;">MJK</span>contact person immediately, so that <span style="color: rgba(0,0,0,0.65);background-color: rgb(255,255,255);font-size: 14px;font-family: Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;">MJK</span> can take corresponding measures.</p>
                           <p>3. Contact information: Zhang Zezhong zezhong.zhang@fmc24.com.</p>
                           <p>Information disclosure</p>
                           <p>Under the following circumstances, <span style="color: rgba(0,0,0,0.65);background-color: rgb(255,255,255);font-size: 14px;font-family: Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;">MJK</span>will disclose your personal information in whole or in part according to your personal wishes or the law:</p>
                           <p>1. Disclose to third parties with your prior consent.</p>
                           <p>2. Disclosure to third parties or administrative or judicial authorities in accordance with the relevant provisions of the law or the requirements of the administrative or judicial authorities.</p>
                           <p>3. If you are a qualified IPR complainant and have filed a complaint, it should be disclosed to the respondent at the request of the complainant so that both parties can handle possible rights disputes.</p>
                           <p>4. Other disclosures that <span style="color: rgba(0,0,0,0.65);background-color: rgb(255,255,255);font-size: 14px;font-family: Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;">MJK</span> considers appropriate in accordance with laws, regulations or privacy policies.</p>
                           <p>Use of cookies</p>
                           <p>1. This system uses cookies technology to ensure your login and use on the local computer; cookies only store limited account information.</p>
                           <p>2. In the event that you accept cookies, the system will set or access cookies on your computer so that you can log in or use cookies-dependent website services or features. You have the right to choose not to accept cookies. However, you may not be able to log in or use the services or features of this website that rely on cookies.</p>
                           <p>3. This policy will apply to the relevant information obtained through the cookies set by this system.</p>`
    };
    componentDidMount() {
      if (!this.state.agreePrivacyPolicy) {
        // privacySearch({type: 2}).then(res => {
        //   this.setState({
        //     privacy2: res.data.results.content,
        //     privacy2Id: res.data.results.id
        //   });
        // });
      }
    }
    handleCloseCookieInfo = () => {
      _util.setStorage("agreePrivacyPolicy", "yes");
      this.setState({
        agreePrivacyPolicy: "yes",
        visible: false
      });
    }
    openModal = () => {
      this.setState({
        visible: true
      });
    }
    closeModal = () => {
      this.setState({
        visible: false
      });
    };
    openEnPrivacy = () => {
      this.setState({
        enPrivacy: true
      });
    };
    closeEnPrivacy = () => {
      this.setState({
        enPrivacy: false
      });
    };

    render() {
      return (
        <Fragment>
          {
            !this.state.agreePrivacyPolicy
              ? <div style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                zIndex: 9999999,
                width: "100%",
                borderTop: "1px solid #e8e8e8"
              }}>
                <div
                  className="cookie"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    padding: "0 30px",
                    background: "rgb(242, 243, 243,0.8)",
                    lineHeight: "1.5rem"
                  }}>
                  <h2 style={{
                    fontSize: "30px",
                    fontWeight: "normal",
                    margin: "10px 0"}}>Cookie </h2>
                  {/*<p style={{ marginBottom: 10}}>这个网站只使用必需的cookies。</p>*/}
                  {/*<p>您可以在我们的<a style={{textDecoration: 'underline'}} onClick={this.openModal}><FormattedMessage id="app.modal.title.privacy" defaultMessage="隐私政策"/></a>中找到更多的信息。</p>*/}
                  <p>这个网站只使用必需的cookies。您可以在我们的<a style={{textDecoration: "underline"}} onClick={this.openModal}><FormattedMessage id="app.modal.title.privacy" defaultMessage="隐私政策"/></a>中找到更多的信息。</p>
                  <p>Cookies收集用于系统使用的匿名或汇总数据，例如身份认证，浏览器类型，IP地址，工号邮箱，语言偏好。例如：使用账号密码登录之后将会保存身份认证，下次无需再次输入；如果您选择某种语言作为查看我们网站的首选语言，我们就会将其存储在Cookies中，并确保您再次访问时，网站即以您已经选择的首选语言显示。</p>
                  <p>如果您拒绝这些Cookies，网站的登录认证等功能将无法正常运行，您将无法使用本系统提供的服务。</p>
                  <p style={{ marginTop: 10}}>This website only uses the necessary cookies.You can find more information in our <a style={{textDecoration: "underline"}} onClick={this.openEnPrivacy}>privacy policy</a></p>
                  <p>Cookies collect anonymous or aggregated data for system use, such as authentication, browser type, IP address, Employee ID, Email, and language preference. For example, after logging in with an account password, the identity will be saved and you will not need to enter it again next time. If you select a language as the preferred language for viewing our website, we will store it in cookies and make sure that when you visit again, The website is displayed in the preferred language of your choice.</p>
                  <p style={{ marginBottom: 10}}>If you refuse these cookies, the login authentication and other functions of the website will not function properly and you will not be able to use the services provided by this system.</p>
                  <div style={{
                    position: "absolute",
                    right: 30,
                    top: 10,
                    width: 200,
                    height: 40,
                    lineHeight: "40px",
                    textAlign: "center",
                    border: "2px solid #333",
                    cursor: "pointer"
                  }}
                  onClick={this.handleCloseCookieInfo}>接受/Accept</div>
                </div>

              </div>
              : null
          }
          <Modal
            title='隐私政策'
            visible={this.state.visible}
            onCancel={this.closeModal}
            footer={null}
            zIndex={99999999}
          >
          </Modal>

          <Modal
            title='Privacy Policy'
            visible={this.state.enPrivacy}
            onCancel={this.closeEnPrivacy}
            footer={null}
            zIndex={99999999}
          >
            <div dangerouslySetInnerHTML={{ __html: this.state.privacy_english}} style={{fontSize: 12}}></div>
          </Modal>
        </Fragment>

      );
    }
}

export default CookieInfo;