import CommonUtil from "@utils/common";
import { GetTemporaryKey } from "@apis/account/index";

const _util = new CommonUtil();

export const fieldMapNormalizer = (widgetMap) => {
  const fields = Object.entries(widgetMap).map(([name, widget]) => {
    const options = widget.options || undefined;
    const children = widget.children || undefined;
    let field = {
      ...widget,
      tagName: name,
      key: name,
    };
    if (options) {
      field = {
        ...field,
        options,
      };
    }
    if (children) {
      field = {
        ...field,
        children,
      };
    }

    if (widget.fieldConvertor) {
      const convertedField = widget.fieldConvertor(field);
      if (!convertedField) {
        throw new Error(`fieldConvertor of '${name}' must return a field`);
      }
      return convertedField;
    }
    return field;
  });
  return fields;
};

export const filterProperties = (name, properties) => {
  let propertiesValue = [];
  for (let i = 0; i < properties.length; i++) {
    if (properties[i].name !== name) {
      if (properties[i].properties) {
        const subPropertiesValue = filterProperties(
          name,
          properties[i].properties
        );
        if (subPropertiesValue) {
          propertiesValue.push({
            ...properties[i],
            properties: subPropertiesValue,
          });
        }
      } else {
        propertiesValue.push(properties[i]);
      }
    }
  }
  return propertiesValue;
};

export const getProperty = (name, properties) => {
  for (let i = 0; i < properties.length; i++) {
    if (properties[i].name === name) {
      return properties[i];
    }
    if (properties[i].properties && properties[i].properties.length > 0) {
      const subProperty = getProperty(name, properties[i].properties);
      if (Object.keys(subProperty).length !== 0) {
        return subProperty;
      }
    }
  }
  return {};
};

export const styleEnum = {
  width: "宽度",
  height: "高度",
  fontSize: "字号",
  lineHeight: "行高",
  fontWeight: "字重",
  textAlign: "文本对齐",
  textIndent: "文本缩进",
  wordSpacing: "字间距",
  letterSpacing: "字间距",
  textDecoration: "文本修饰",
  backgroundColor: "背景色",
  color: "颜色",
  margin: "外边距",
  marginTop: "上外边距",
  marginRight: "右外边距",
  marginBottom: "下外边距",
  marginLeft: "左外边距",
  padding: "内边距",
  paddingTop: "上内边距",
  paddingRight: "右内边距",
  paddingBottom: "下内边距",
  paddingLeft: "左内边距",
  position: "定位",
  top: "上",
  right: "右",
  bottom: "下",
  left: "左",
  zIndex: "堆叠顺序",
};

export const getStyleName = (key) => {
  if (styleEnum[key]) {
    return styleEnum[key];
  }
  return key;
};


export const getBase64ByUrl = (src, callback, outputFormat) =>  {
  const xhr = new XMLHttpRequest();
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  xhr.open('GET', proxyUrl + src, true);

  xhr.responseType = 'arraybuffer';

  xhr.onload = () => {
    if (xhr.status == 200) {
      const uInt8Array = new Uint8Array(xhr.response);
      let i = uInt8Array.length;
      const binaryString = new Array(i);
      while (i--) {
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
      }
      const data = binaryString.join('');
      const base64 = window.btoa(data);
      const dataUrl = "data:" + (outputFormat || "image/png") + ";base64," + base64;
      callback(dataUrl);
    }
  };

  xhr.send();
}

export const getCosUrl = (url) => {
  const cos = _util.getCos(null, GetTemporaryKey);
  return new Promise((resolve, reject) => {
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
          reject(null);
        }
      }
    );
  })
}