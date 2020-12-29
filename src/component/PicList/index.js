import React, { Component, Fragment } from "react";
import {
  Modal,
  Upload
} from "antd";

class PicList extends Component {
    state = {
      preview: false,
      previewSrc: ""
    }

    openModal = pic => {
      this.setState({
        preview: true,
        previewSrc: pic.url
      });
    }

    closeModal = () => {
      this.setState({
        preview: false,
        previewSrc: ""
      });
    }

    handleRemove = file => {
      const { fileList } = this.props;

      let index;

      fileList.forEach((f, fIndex) => {
        if (f.uid = file.uid) {
          index = fIndex;
        }
      });

      fileList.splice(index, 1);

      const { onChange } = this.props;

      if (onChange) {
        onChange(fileList);
      }

      this.setState({
        fileList
      });
    }

    render() {
      const { fileList } = this.props;

      return (
        <Fragment>
          <Upload
            listType={this.props.type ? this.props.type : "picture-card"}
            fileList={fileList}
            onPreview={
              this.props.type === "picture"
                ? null
                : pic => this.openModal(pic)
            }
            showUploadList={{
              showRemoveIcon: !!this.props.canRemove
            }}
            onRemove={this.handleRemove}>
          </Upload>
          <Modal
            visible={this.state.preview}
            footer={null}
            onCancel={this.closeModal}
            closable={false}>
            <img alt='' style={{width: "100%"}} src={this.state.previewSrc}/>
          </Modal>
        </Fragment>
      );
    }
}

export default PicList;