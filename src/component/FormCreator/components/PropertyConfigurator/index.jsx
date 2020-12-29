import React from "react";
import {
  Input,
  Card,
  Radio,
  Button,
  InputNumber,
  Upload,
  message,
  Checkbox,
  Collapse,
  Row,
  Col,
  Typography,
  Icon,
  Select,
  Switch,
} from "antd";
import CommonUtil from "@utils/common";
import { GetTemporaryKey } from "@apis/account/index";

const { Text } = Typography;
const { Panel } = Collapse;

const _util = new CommonUtil();

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("只能上传JPG/PNG图片文件！");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片文件不能大于2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class PropertyConfigurator extends React.PureComponent {
  state = {
    uploading: false,
    logoUrl: null,
  };

  getImage = (url) => {
    if (!url) {
      return;
    }
    const cos = _util.getCos(null, GetTemporaryKey);
    new Promise((resolve, reject) => {
      cos.getObjectUrl(
        {
          Bucket: "ecms-1256637595",
          Region: "ap-shanghai",
          Key: url,
          Sign: true,
        },
        (err, data) => {
          if (data && data.Url) {
            resolve(data.Url);
          } else {
            reject(err);
          }
        }
      );
    }).then((res) => {
      this.setState({
        logoUrl: res,
      });
    });
  };

  handleUpload = (info, set) => {
    if (info.file.status === "uploading") {
      this.setState({ uploading: true });
      return;
    }

    if (info.file.status === "done") {
      message.success(`${info.file.name} 上传成功`);
      if (info.file.response && info.file.response.file_name) {
        this.setState({
          uploading: false,
        });
        set(info.file.response.file_name);
        return;
      }
    }
    if (status === "error") {
      this.setState({
        uploading: false,
      });
      message.error(`${info.file.name} ${info.file.response}.`);
    }
  };

  FormItemPropsConfigurator = () => {
    const { chosen, schemaProps, setPropertyValue } = this.props;
    if (!chosen.formItemProps) {
      return null;
    }
    const colon =
      typeof chosen.formItemProps.colon === "boolean"
        ? chosen.formItemProps.colon
        : true;
    return [
      <Panel header="标签名称" key="formItemProps.label">
        <Input
          value={chosen.formItemProps.label}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("formItemProps.label", value);
          }}
        />
      </Panel>,
      <Panel header="冒号" key="formItemProps.colon">
        <Radio.Group
          value={colon}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("formItemProps.colon", value);
          }}
        >
          <Radio.Button value={false}>关闭</Radio.Button>
          <Radio.Button value={true}>开启</Radio.Button>
        </Radio.Group>
      </Panel>,
      schemaProps.layout !== "horizontal"
        ? null
        : [
            <Panel header="标签对齐方式" key="formItemProps.labelAlign">
              <Radio.Group
                value={chosen.formItemProps.labelAlign}
                onChange={(e) => {
                  const { value } = e.target;
                  setPropertyValue(chosen.name)(
                    "formItemProps.labelAlign",
                    value
                  );
                }}
              >
                <Radio.Button value="left">左对齐</Radio.Button>
                <Radio.Button value="right">右对齐</Radio.Button>
              </Radio.Group>
            </Panel>,
            <Panel header="标签布局" key="formItemProps.labelCol">
              <Row>
                <Col span={12} style={{ padding: 5 }}>
                  <InputNumber
                    min={0}
                    max={24}
                    value={chosen.formItemProps.labelCol.span}
                    onChange={(value) => {
                      setPropertyValue(chosen.name)(
                        "formItemProps.labelCol.span",
                        value
                      );
                    }}
                  />
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Span
                  </Text>
                </Col>
                <Col span={12} style={{ padding: 5 }}>
                  <InputNumber
                    min={0}
                    max={24}
                    value={chosen.formItemProps.labelCol.offset}
                    onChange={(value) => {
                      setPropertyValue(chosen.name)(
                        "formItemProps.labelCol.offset",
                        value
                      );
                    }}
                  />
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Offset
                  </Text>
                </Col>
              </Row>
            </Panel>,
          ],
      <Panel header="组件布局" key="formItemProps.wrapperCol">
        <Row>
          <Col span={12} style={{ padding: 5 }}>
            <InputNumber
              min={0}
              max={24}
              value={chosen.formItemProps.wrapperCol.span}
              onChange={(value) => {
                setPropertyValue(chosen.name)(
                  "formItemProps.wrapperCol.span",
                  value
                );
              }}
            />
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Span
            </Text>
          </Col>
          <Col span={12} style={{ padding: 5 }}>
            <InputNumber
              min={0}
              max={24}
              value={chosen.formItemProps.wrapperCol.offset}
              onChange={(value) => {
                setPropertyValue(chosen.name)(
                  "formItemProps.wrapperCol.offset",
                  value
                );
              }}
            />
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Offset
            </Text>
          </Col>
        </Row>
      </Panel>,
    ];
  };

  ChildrenConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.children === undefined) {
      return null;
    }
    return (
      <Panel header="内容" key="props.children">
        <Input
          value={chosen.props.children}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.children", value);
          }}
        />
      </Panel>
    );
  };

  OptionConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (!chosen.options) {
      return null;
    }
    const { options } = chosen;

    if (chosen.tagName === "CheckboxGroup") {
      return (
        <Panel header="选项" key="options">
          <Checkbox.Group
            onChange={(value) => {
              setPropertyValue(chosen.name)("props.defaultValue", value);
            }}
          >
            {options.map((option, index) => (
              <Checkbox
                value={option}
                key={`option_${option}`}
                style={{ margin: 0 }}
              >
                <Input
                  style={{ marginBottom: 2, width: "85%" }}
                  defaultValue={option}
                  suffix={
                    <Button
                      onClick={() => {
                        const value = options.filter(
                          (_option) => _option !== option
                        );
                        setPropertyValue(chosen.name)("options", value);
                      }}
                    >
                      <Icon type="delete" theme="filled" />
                    </Button>
                  }
                  onBlur={(e) => {
                    let value = options.concat([]);
                    value[index] = e.target.value;
                    setPropertyValue(chosen.name)("options", value);
                  }}
                />
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Panel>
      );
    }
    return (
      <Panel header="选项" key="options">
        <Radio.Group>
          {options.map((option, index) => (
            <Radio value={option} key={`option_${option}`}>
              <Input
                style={{ marginBottom: 2, width: "85%" }}
                defaultValue={option}
                suffix={
                  <Button
                    onClick={() => {
                      const value = options.filter(
                        (_option) => _option !== option
                      );
                      setPropertyValue(chosen.name)("options", value);
                    }}
                  >
                    <Icon type="delete" theme="filled" />
                  </Button>
                }
                onBlur={(e) => {
                  let value = options.concat([]);
                  value[index] = e.target.value;
                  setPropertyValue(chosen.name)("options", value);
                }}
              />
            </Radio>
          ))}
        </Radio.Group>
        <a
          style={{ marginLeft: 25 }}
          onClick={() => {
            const value = options.concat([`新选项${options.length + 1}`]);
            setPropertyValue(chosen.name)("options", value);
          }}
        >
          添加选项
        </a>
      </Panel>
    );
  };
  RowCountConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.rowCount === undefined) {
      return null;
    }
    return (
      <Panel header="列数" key="props.rowCount">
        <InputNumber
          min={1}
          max={4}
          value={chosen.props.rowCount}
          onChange={(value) => {
            setPropertyValue(chosen.name)("props.rowCount", value);
          }}
        />
      </Panel>
    );
  };
  PlaceholderConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.placeholder === undefined) {
      return null;
    }
    return (
      <Panel header="占位文本" key="props.placeholder">
        <Input
          value={chosen.props.placeholder}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.placeholder", value);
          }}
        />
      </Panel>
    );
  };

  DisabledConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.disabled === undefined) {
      return null;
    }
    return (
      <Panel header="禁用" key="props.disabled">
        <Radio.Group
          value={chosen.props.disabled}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.disabled", value);
          }}
        >
          <Radio.Button value={false}>否</Radio.Button>
          <Radio.Button value={true}>是</Radio.Button>
        </Radio.Group>
      </Panel>
    );
  };
  ButtonGroupConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.buttonGroup === undefined) {
      return null;
    }

    return (
      <Panel header="按钮样式" key="props.buttonGroup">
        <Radio.Group
          value={chosen.props.buttonGroup}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.buttonGroup", value);
          }}
        >
          <Radio.Button value={false}>关闭</Radio.Button>
          <Radio.Button value={true}>启用</Radio.Button>
        </Radio.Group>
      </Panel>
    );
  };
  PickerConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.picker === undefined) {
      return null;
    }

    return (
      <Panel header="日期类型" key="rops.picker">
        <Radio.Group
          value={chosen.props.picker}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.picker", value);
          }}
        >
          <Radio.Button value="date">日期</Radio.Button>
          <Radio.Button value="week">周</Radio.Button>
          <Radio.Button value="month">月</Radio.Button>
          <Radio.Button value="year">年</Radio.Button>
        </Radio.Group>
      </Panel>
    );
  };

  ShowTimeConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.showTime === undefined) {
      return null;
    }
    return (
      <Panel header="显示时间" key="props.showTime">
        <Radio.Group
          value={chosen.props.showTime}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.showTime", value);
          }}
        >
          <Radio.Button value={false}>否</Radio.Button>
          <Radio.Button value={true}>是</Radio.Button>
        </Radio.Group>
      </Panel>
    );
  };

  OrientationConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.orientation === undefined) {
      return null;
    }
    return (
      <Panel header="文字位置" key="props.orientation">
        <Radio.Group
          value={chosen.props.orientation}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.orientation", value);
          }}
        >
          <Radio.Button value="left">居右</Radio.Button>
          <Radio.Button value="center">居中</Radio.Button>
          <Radio.Button value="right">居左</Radio.Button>
        </Radio.Group>
      </Panel>
    );
  };

  DashedConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.dashed === undefined) {
      return null;
    }
    return (
      <Panel header="虚线" key="props.dashed">
        <Radio.Group
          value={chosen.props.dashed}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.dashed", value);
          }}
        >
          <Radio.Button value={false}>否</Radio.Button>
          <Radio.Button value={true}>是</Radio.Button>
        </Radio.Group>
      </Panel>
    );
  };

  SrcConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    const { logoUrl } = this.state;
    if (chosen.props.src === undefined) {
      return null;
    }
    const uploadButton = (
      <div>
        {this.state.uploading ? <Icon type="loading" /> : <Icon type="plus" />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = chosen.props.src;
    this.getImage(imageUrl);
    return (
      <Panel header="文件" key="props.src">
        <Upload
          showUploadList={false}
          accept="image/*"
          action={_util.getServerUrl(`/upload/auth/`)}
          headers={{ Authorization: "JWT " + _util.getStorage("token") }}
          listType="picture-card"
          beforeUpload={beforeUpload}
          onChange={(info) => {
            this.handleUpload(info, (url) => {
              setPropertyValue(chosen.name)("props.src", url);
            });
          }}
        >
          {imageUrl ? (
            <img src={logoUrl} alt="logo" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Panel>
    );
  };

  AltConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.props.src === undefined) {
      return null;
    }
    return (
      <Panel header="替代文本" key="props.alt">
        <Input
          value={chosen.props.alt}
          onChange={(e) => {
            const { value } = e.target;
            setPropertyValue(chosen.name)("props.alt", value);
          }}
        />
      </Panel>
    );
  };

  RulesConfigurator = () => {
    const { chosen, setPropertyValue } = this.props;
    if (chosen.formItemProps.rules === undefined) {
      return null;
    }

    const { rules } = chosen.formItemProps;

    const getRuleValueElement = (key, rule, update = () => {}) => {
      switch (key) {
        case "required":
          return (
            <Switch
              checked={rule[key]}
              onChange={(value) => {
                update(value);
              }}
            />
          );
        case "len":
        case "min":
        case "max":
          return (
            <InputNumber
              value={rule[key]}
              onChange={(value) => {
                update(value);
              }}
            ></InputNumber>
          );
        default:
          return (
            <Input
              value={rule[key]}
              onChange={(e) => {
                const { value } = e.target;
                update(value);
              }}
            />
          );
      }
    };
    const getDefaultRule = (key) => {
      switch (key) {
        case "len":
          return {
            [key]: 11,
            message: "长度必须为11位",
          };
        case "min":
          return {
            [key]: 6,
            message: "长度最低为6位",
          };
        case "max":
          return {
            [key]: 18,
            message: "长度最大为18位",
          };
        case "pattern":
          return {
            [key]: "/^1[3456789]d{9}$/",
            message: "手机号码格式不正确",
          };
        default:
          return {
            [key]: false,
            message: "必填项",
          };
      }
    };
    const elements = rules.map((rule, index) => {
      const ruleKey = Object.keys(rule)[0];
      return (
        <Card
          size="small"
          key={ruleKey + index}
          style={{ marginBottom: "1px" }}
          title={
            <>
              <Select
                value={ruleKey}
                style={{ width: "120px" }}
                onChange={(value) => {
                  let newRules = rules;
                  newRules[index] = getDefaultRule(value);
                  setPropertyValue(chosen.name)(
                    "formItemProps.rules",
                    newRules
                  );
                }}
              >
                <Select.Option value="required">必填</Select.Option>
                {/* <Select.Option value="enum">枚举类型</Select.Option> */}
                <Select.Option value="len">字段长度</Select.Option>
                <Select.Option value="max">最大长度</Select.Option>
                <Select.Option value="min">最小长度</Select.Option>
                <Select.Option value="pattern">正则校验</Select.Option>
              </Select>

              <Button
                style={{ float: "right" }}
                onClick={() => {
                  let newRules = rules;
                  newRules.splice(index, 1);
                  setPropertyValue(chosen.name)(
                    "formItemProps.rules",
                    newRules
                  );
                }}
              >
                <Icon type="delete" />
              </Button>
            </>
          }
        >
          {getRuleValueElement(ruleKey, rule, (value) => {
            setPropertyValue(chosen.name)(
              `formItemProps.rules[${index}].${ruleKey}`,
              value
            );
          })}
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            校验值
          </Text>
          <Input
            value={rule.message}
            onChange={(e) => {
              const { value } = e.target;
              setPropertyValue(chosen.name)(
                `formItemProps.rules[${index}].message`,
                value
              );
            }}
          />
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            提示信息
          </Text>
        </Card>
      );
    });

    return (
      <Panel header="规则" key="props.rules">
        {elements}
        <Button
          type="link"
          onClick={() => {
            let newRules = rules;
            newRules.push(getDefaultRule("required"));
            setPropertyValue(chosen.name)("formItemProps.rules", newRules);
          }}
        >
          <Icon type="plus" />
          增加规则
        </Button>
      </Panel>
    );
  };

  render() {
    return (
      <Collapse bordered={false} style={{ background: "#fff" }}>
        {this.FormItemPropsConfigurator()}
        {this.ChildrenConfigurator()}
        {this.OptionConfigurator()}
        {this.RowCountConfigurator()}
        {this.PlaceholderConfigurator()}
        {this.DisabledConfigurator()}
        {this.ButtonGroupConfigurator()}
        {this.ShowTimeConfigurator()}
        {this.OrientationConfigurator()}
        {this.DashedConfigurator()}
        {this.SrcConfigurator()}
        {this.AltConfigurator()}
        {this.RulesConfigurator()}
      </Collapse>
    );
  }
}
export default PropertyConfigurator;
