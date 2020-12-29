import React from "react";
import { Icon,Button,message,Spin,Modal } from "antd";
import {
  inject,
  observer
} from "mobx-react";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import CommonUtil from "@utils/common";
import styles from "./index.module.css";
import {
  Player,
  ControlBar,
  PlaybackRateMenuButton,
  VolumeMenuButton,
  BigPlayButton,
  PlayToggle
} from "video-react";
import { Document, Page } from "react-pdf";

import "../../../node_modules/video-react/dist/video-react.css";


let _util = new CommonUtil();
const confirm = Modal.confirm;
const messages = defineMessages({
  confirm_title: {
    id: "page.training.learn.startExamTitle",
    defaultMessage: "确认开始考试?"
  },
  contentText: {
    id: "page.training.learn.startExamContent",
    defaultMessage: "即将进入考试页面"
  },
  okText: {
    id: "app.button.ok",
    defaultMessage: "确认"
  },
  cancelText: {
    id: "app.button.cancel",
    defaultMessage: "取消"
  }
});

@inject("menuState") @observer @injectIntl
class TrainingLearn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: false,
      ended: false,
      currentIndex: 0,
      fileLearned: 0,
      currentSrc: "",
      currentSrcType: "",
      hasStarted: false,
      isPlaying:false,
      videoLoading:false,
      startExamDisable:true,
      test_pdf_list:[
        "http://pdf.dfcfw.com/pdf/H2_AN201910241369669630_1.pdf",
        "http://pdf.dfcfw.com/pdf/H2_AN201910251369746174_1.pdf",
        "http://pdf.dfcfw.com/pdf/H2_AN201910251369746962_1.pdf",
        "http://pdf.dfcfw.com/pdf/H2_AN201910251369743752_1.pdf",
        "http://pdf.dfcfw.com/pdf/H2_AN201910241369689922_1.pdf"
      ],
      pdfPage:1,
      pdfPages:0,
      examUrl:this.props.examUrl ? this.props.examUrl :"/404",
      source_list:[]
    };
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state.id === undefined) {
      this.props.history.replace("/404");
    } else {
      this.refs.player.subscribeToStateChange(this.handleVideoChange);//Subscribe to the player state changes.
      this.getMaterial(this.props.location.state.id);
      this.setState({
        spinLoading: false,
        training_id:this.props.location.state.id
      });
    }

    // this.refs.player.subscribeToStateChange(this.handleVideoChange);//Subscribe to the player state changes.
    // this.getMaterial(this.props.id);
    // this.setState({
    //     spinLoading: false,
    //     training_id:this.props.id
    // });
  }


    getMaterial = (training_id) => {
      const {getMaterial} = this.props;
      const site_id = _util.getStorage("site_id");
      if(getMaterial){
        getMaterial({site_id:site_id,training_id:training_id}).then((res) => {
          const {results} = res.data;
          const {source_list} = results;

          var videoList = [];//video url list
          var pdfList = [];//pdf url list

          source_list.forEach(item => {
            var index1=item.lastIndexOf(".");
            var index2=item.length;
            var fileType=item.substring(index1,index2);
            if(fileType === ".pdf"){
              pdfList.push(item);
            }else{
              videoList.push(item);
            }
          });

          const new_source_list = (videoList).concat(pdfList);

          this.setState({
            source_list,
            videoList,
            pdfList,
            new_source_list,
            currentSrcType:new_source_list ? this.getFileType(new_source_list[0]) : ""
          });
        });
      }else{
        this.setState({
          videoList:[],
          pdfList:[],
          new_source_list:[]
        });
      }
    }


    onDocumentComplete = (pages) => {
      if(pages){
        this.setState({ pdfPage:1, pdfPages:pages._pdfInfo.numPages });
      }
    }


    getFileType = (item) => {
      var index1=item.lastIndexOf(".");
      var index2=item.length;
      var fileType=item.substring(index1,index2);
      return fileType;
    }

    handleVideoChange = state => {
      const {
        paused,
        userActivity,
        hasStarted,
        ended,
        currentSrc,
        duration,
        readyState,
        networkState
      } = state;

      this.setState({
        userActivity,
        paused,
        hasStarted,
        ended,
        currentSrc,
        duration,
        readyState,
        networkState
      });
    }

    //播放
    play = () => {
      this.refs.player.play();
    }

    //暂停视频
    pause = () => {
      this.refs.player.pause();
    }

    //切换视频源
    load = () => {
      this.refs.player.load();
    }

    //上一视频
    prevVideo = () => {
      const { currentIndex } = this.state;

      this.setState({
        currentIndex: currentIndex - 1
      });
    }

    //下一视频
    nextVideo = () => {
      const { currentIndex } = this.state;
      this.setState({
        currentIndex: currentIndex + 1
      });
    }

    nextFile = () => {
      const { currentIndex,fileLearned,new_source_list } = this.state;
      if(currentIndex + 1 === (new_source_list && new_source_list.length)){
        //当前是最后一个了
        message.warning("This is last");
      }else{
        this.setState({
          currentIndex: currentIndex + 1,
          fileLearned: fileLearned + 1,
          currentSrcType:this.getFileType(new_source_list[currentIndex + 1]),
          ended:false,
          pdfPage:1
        });
      }
    }

    prevFile = () => {
      const { currentIndex,fileLearned,new_source_list } = this.state;
      if(currentIndex === 0){
        //当前是最后一个了
        message.warning("This is first");
      }else{
        this.setState({
          currentIndex: currentIndex - 1,
          fileLearned: fileLearned - 1,
          currentSrcType:this.getFileType(new_source_list[currentIndex - 1]),
          ended:false,
          pdfPage:1
        });
      }
    }

    nextPage = () => {
      const{pdfPage,pdfPages} = this.state;
      if(pdfPage === pdfPages){
        return;
      }else{
        var newPage = pdfPage + 1;
        this.setState({pdfPage:newPage});
      }
    }

    prevPage = () => {
      const{pdfPage} = this.state;
      if(pdfPage === 1){
        return;
      }else{
        var newPage = pdfPage - 1;
        this.setState({pdfPage:newPage});
      }
    }


    //开始考试
    startExam = () => {
      const { training_id,examUrl} = this.state;
      this.props.history.push({
        pathname: examUrl,
        state: {
          id:training_id
        }
      });
    }

    openConfirmModal = (e) => {
      e.preventDefault();
      const {formatMessage} = this.props.intl;
      const _this = this;
      confirm({
        title: formatMessage(messages.confirm_title),
        content: formatMessage(messages.contentText),
        okText: formatMessage(messages.okText),
        cancelText: formatMessage(messages.cancelText),
        onOk() {
          _this.startExam();
        },
        onCancel() {

        }
      });
    }


    render() {
      const {
        source_list,
        videoList,
        pdfList,
        new_source_list,
        currentIndex,
        currentSrcType,
        hasStarted,
        ended,
        paused,
        readyState,
        networkState,
        pdfPage,
        pdfPages,
        test_pdf_list
      } = this.state;
      const videoNum = videoList ? videoList.length : 0;

      return (
        <div style={{height:"100%"}}>
          {source_list.length ?
            <div id='iframeContent' className={currentSrcType === ".pdf" ? styles.iframeContentShow : styles.iframeContentHidden}>
              <div className={styles.learnHeader}>
                <div className={styles.headerOpearte}>
                  <div onClick={this.prevPage} className={styles.pdfPageButton}>
                    <FormattedMessage id="page.training.learn.prevPage" defaultMessage="上一页" />
                  </div>
                  <p className={styles.headerInfo}>{pdfPage}/{pdfPages}</p>
                  <div onClick={this.nextPage} className={styles.pdfPageButton}>
                    <FormattedMessage id="page.training.learn.nextPage" defaultMessage="下一页" />
                  </div>
                </div>
              </div>
              <Document
                className={styles.pdfDocument}
                onLoadSuccess={this.onDocumentComplete}
                // file={test_pdf_list[currentIndex - videoNum]}
                file={pdfList? (pdfList.length ? _util.getImageUrl(pdfList[currentIndex - videoNum]) : "") : "" }
                renderMode='canvas'
              >
                <Page
                  pageNumber={pdfPage}
                  scale={1.5}
                  className={styles.pdfPage}
                />
              </Document>
            </div>
            :""
          }
          {
            <div id='PlayerContent' className={currentSrcType === ".pdf" ? styles.PlayerContentHidden :styles.PlayerContentShow}>
              <Player
                className={styles.videoObj}
                ref="player"
                width='100%'
                height='100%'
                fluid={false}
                src={videoList ? (videoList.length > 0 ? _util.getImageUrl(new_source_list[currentIndex]) : null) : null}
              >
                <ControlBar disableDefaultControls={true}>
                  <PlayToggle />
                  <PlaybackRateMenuButton
                    rates={[5, 2, 1, 0.5, 0.1]}
                    order={7.1}
                  />
                  <VolumeMenuButton />
                </ControlBar>
                <BigPlayButton position="center" disabled />
              </Player>
              <Spin className={styles.loadingSpin} spinning={!!((currentSrcType !== ".pdf" && readyState === 0 ))} size="large"/>
              {/* <div className={(currentSrcType !== '.pdf' && readyState === 0 )? styles.loadingSpiner : styles.loadingSpinerHidden }>
                        </div> */}
              <div className={(currentSrcType !== ".pdf" && readyState === 0 && networkState === 3) ? styles.videoErrorShow : styles.videoErrorHidden}>
                <span style={{color:"#fff"}}>
                  <FormattedMessage id="page.training.learn.message.networkError" defaultMessage="网络错误，请重试！" />
                </span>
              </div>
              <div className={ended&&hasStarted ? styles.videoBtnBoxShow : styles.videoBtnBox}>
                {
                  currentIndex + 1 === (new_source_list && new_source_list.length) ?
                    <div>
                      <span style={{color:"#fff"}}>
                        <FormattedMessage id="page.training.learn.message.lastVideo" defaultMessage="所有视频播放结束,请点击开始考试按钮" />
                      </span>
                    </div> :
                    <div>
                      <span style={{color:"#fff"}}>
                        <FormattedMessage id="page.training.learn.message.nextVideo" defaultMessage="视频播放结束,请点击下一资料按钮" />
                      </span>
                    </div>
                }

              </div>
            </div>
          }
          <div className={styles.learnFooter}>
            <div className={styles.textShow}>
              {
                (source_list ? source_list : []).length === 0 ?
                  <div>
                    <span><FormattedMessage id="page.training.learn.noMaterial" defaultMessage="暂无资料" /></span>
                  </div> :
                  <div>
                    <span><FormattedMessage id="page.training.learn.allMaterial" defaultMessage="资料总数" />:{new_source_list ? new_source_list.length : 0}</span>
                    <span><FormattedMessage id="page.training.learn.currentMaterial" defaultMessage="当前资料" />:{new_source_list ? (currentIndex ? currentIndex + 1 : 1) : 0}</span>
                  </div>
              }
            </div>
            <div className={styles.footerOpearte}>
              <Button onClick={this.prevFile} disabled={currentIndex === 0} type="primary">
                <Icon type="left" />
                <FormattedMessage id="page.training.learn.prevMaterial" defaultMessage="上一个资料" />
              </Button>
              <div className={styles.playOpearte}>
                {
                  currentSrcType === ".pdf" ? null :
                    (
                      paused ?
                        <Icon onClick={this.play} type='play-circle' style={{fontSize:"40px",color:"#fff"}} /> :
                        <Icon onClick={this.pause} type='pause-circle' style={{fontSize:"40px",color:"#fff"}} />
                    )
                }
              </div>
              {
                currentIndex + 1 === (new_source_list && new_source_list.length) ?
                  <Button onClick={this.openConfirmModal} type="danger">
                    <FormattedMessage id="page.training.learn.startexam" defaultMessage="开始考试" />
                    <Icon type="edit" />
                  </Button>:
                  <Button onClick={this.nextFile} type="primary">
                    <FormattedMessage id="page.training.learn.nextMaterial" defaultMessage="下一个资料" />
                    <Icon type="right" />
                  </Button>
              }
            </div>
          </div>
        </div>
      );
    }
}


export default TrainingLearn;
