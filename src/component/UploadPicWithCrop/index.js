import React, { Component } from "react";
import {
  Button,
  Modal,
  Icon,
  Spin,
  message
} from "antd";
import {Cropper} from "react-image-cropper";
import axios from "axios";
import styles from "./index.module.css";
import CommonUtil from "@utils/common";
import PicList from "@component/PicList";

let _util = new CommonUtil();

class UploadPicWithCrop extends Component {
    state = {
      uploadedImg: [],
      previewImage: ""
    }

    handleChange = () => {
      if (this.input && this.input.files.length > 0) {
        const file = this.input.files[0];
        if (file.size > 3 * 1024 * 1024) {
          message.error("图片大小限制3M!");
          return;
        }
        _util.getBase64(file, (res) => {
          this.setState({
            previewVisible: true,
            previewImage: res
          });
        });

      }
    }
    closeCrop = () => {
      this.input.value = null;
      this.setState({
        previewVisible: false
      });
      // this.removePreview()
    }

    dataURLtoFile = (dataurl, filename) => {
      var arr = dataurl.split(","), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    }

    componentDidUpdate(prevProps) {
      if (!Array.isArray(prevProps.prePics)) return;
      if (!Array.isArray(this.props.prePics)) return;
      if (prevProps.prePics.length !== this.props.prePics.length) {
        const { uploadedImg } = this.state;
        this.setState({
          uploadedImg: [...this.props.prePics, ...uploadedImg]
        });
      }
    }

    async getCropImg() {
      try {
        const file = this.cropper.crop();

        this.setState({
          cropperImg: file
        });

        const formData = new FormData();
        formData.append("file", this.dataURLtoFile(file, "1.png"));
        formData.append("site_id", _util.getStorage("site"));
        const config = {
          headers: {
            "Authorization": "JWT " + _util.getStorage("token")
          }
        };
        const instance=axios.create({
          withCredentials: true
        });

        this.setState({
          uploading: true
        });

        const res = await instance.post(_util.getServerUrl("/upload/avatar/"), formData, config);
        const { url } = res.data.content.results;

        this.input.value = null;
        this.setState({
          uploading: false,
          previewVisible: false
        });

        if (url) {
          const { uploadedImg } = this.state;
          uploadedImg.push(url);
          if (this.props.onChange) {
            this.props.onChange(uploadedImg);
          }
          this.setState({
            uploadedImg
          });
        }
      } catch (e) {
        message.error(e);
      }

    }

    handlePicChange = fileLists => {
      const { onChange } = this.props;
      if (onChange) {
        onChange(fileLists.map(f => f.uid));
      }
      this.setState({
        uploadedImg: fileLists.map(f => f.uid)
      });
    }

    render() {
      const { uploadedImg } = this.state;

      return (
        <div className={styles.UploadWrap}>
          {
            uploadedImg.length > 0
              ?
              <PicList fileList={uploadedImg.map(pic => {
                return {
                  uid: pic,
                  url: _util.getImageUrl(pic)
                };
              })} canRemove onChange={
                this.handlePicChange
              } />
              :
              <div style={{
                position: "relative",
                width: 104,
                height: 104,
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: "#fafafa",
                border: "1px dashed #d9d9d9",
                transition: "border-color 0.3s ease"
              }}>
                <Icon type='plus' style={{
                  color: "#999",
                  fontSize: "32px",
                  marginTop: "20px"
                }} />
                <div style={{
                  textAlign: "center",
                  color: "#666"
                }}>Upload</div>
                <input
                  type='file'
                  accept='image/*'
                  ref={input => this.input = input}
                  onChange={this.handleChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    bottom: 0,
                    cursor: "pointer",
                    opacity: 0,
                    zIndex: 1
                  }} />
              </div>
          }

          <Modal
            visible={this.state.previewVisible}
            onCancel={this.closeCrop}
            maskClosable={false}
            closable={false}
            footer={null}
          >
            <div style={{
              position: "relative"
            }}>
              {
                this.state.uploading
                  ?
                  <div style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "100%",
                    background: "rgba(255, 255, 255, .7)",
                    zIndex: 1
                  }}>
                    <Spin tip="处理中..." style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)"
                    }}></Spin>
                  </div>
                  :
                  null
              }

              <Cropper
                src={this.state.previewImage}
                ref={ref => { this.cropper = ref; }}
                width={200}
                height={200}
                allowNewSelection={false} />
              <div style={{
                marginTop: "10px",
                overflow: "hidden"
              }}>
                <Button
                  onClick={this.closeCrop}
                  type='primary'
                  style={{
                    float: "right"

                  }}>取消</Button>
                <Button
                  onClick={this.getCropImg.bind(this)}
                  type='primary'
                  style={{
                    float: "right",
                    marginRight: "10px"
                  }}>确定</Button>
              </div>
            </div>

          </Modal>
        </div>
      );
    }
}

export default UploadPicWithCrop;