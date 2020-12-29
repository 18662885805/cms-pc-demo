import React, {createRef} from "react";
import { Upload as AntdUpload, Button, Icon, message } from "antd";
import { getCosUrl } from '../utils'
import CommonUtil from "@utils/common";

const _util = new CommonUtil();

function beforeUpload(file) {
  const isLt30M = file.size / 1024 / 1024 < 30;
  if (!isLt30M) {
    message.error("上传文件不能大于30MB!");
  }
  return isLt30M;
}

class Upload extends React.PureComponent {
  state = {
    uploading: false,
    value: [],
    fileList: [],
    urlList: {}
  };
  constructor(props) {
    super(props);
    this.initialized = createRef(false);
  }

  componentDidMount = () => {
    const { initialvalue } = this.props
    console.log('initialvalue', initialvalue)
    if (initialvalue &&  initialvalue.length > 0) {
      this.setDefaultFileList(initialvalue)
    }
  }

  setDefaultFileList = async (initialvalue) => {
    const defaultFileList = []
    for (let index in initialvalue) {
      const file = initialvalue[index]
      defaultFileList.push({
        uid: file.url,
        url: await getCosUrl(file.url),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'done',
        response: {
          file_name: file.url
        }
      })
    }
    this.setState({
      fileList: defaultFileList
    })
  }

  handleChanged = async (info) => {
    const { onChange } = this.props;
    let fileList = [...info.fileList];
    if (info.file.status === "uploading") {
      this.setState({ uploading: true });
    }
    for (let index in fileList) {
      if (fileList[index].response && fileList[index].response.file_name  && !fileList[index].url) {
        fileList[index].url = await getCosUrl(fileList[index].response.file_name)
      }
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} 上传成功`);
      this.setState({ uploading: false });
      onChange(fileList);
    }

    if (info.file.status === "removed") {
      onChange(fileList);
    }
    console.log('r',info.file)
    if (info.file.status === "error") {
      message.error(`${info.file.name} ${info.file.response}.`);
      this.setState({ uploading: false });
    }
    
    this.setState({
      fileList
    });
  };

  render() {
    const { uploading, fileList } = this.state;
    const { children, initialvalue } = this.props;

    if (!this.initialized.current) {
      if (initialvalue && initialvalue.length > 0 && fileList.length === 0) {
        this.initialized.current = true;
        this.setDefaultFileList(initialvalue)
      }
    }
    return (
      <AntdUpload
        action={_util.getServerUrl(`/upload/auth/`)}
        headers={{ Authorization: "JWT " + _util.getStorage("token") }}
        onChange={this.handleChanged}
        fileList={fileList}
        beforeUpload={beforeUpload}
      >
        <Button loading={uploading}>
          <Icon type="upload" />
          {uploading ? "上传中..." : children}
        </Button>
      </AntdUpload>
    );
  }
}

export default Upload;
