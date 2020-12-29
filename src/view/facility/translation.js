import React, {Fragment} from 'react'
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";

const translation = defineMessages({
	confirm_title: {
    id: 'app.confirm.title.submit',
    defaultMessage: '确认提交?',
  },
  confirm_content: {
    id: 'app.common.button.content',
    defaultMessage: '单击确认按钮后，将会提交数据',
  },
  okText: {
    id: 'app.button.ok',
    defaultMessage: '确认',
  },
  cancelText: {
    id: 'app.button.cancel',
    defaultMessage: '取消',
  },
  saved: {
    id: 'app.message.walkthrough.saved',
    defaultMessage: '保存成功',
  },
  uploaded: {
    id: 'app.message.parking.uploaded',
    defaultMessage: '上传成功',
  },
  select: {
    id: 'app.placeholder.select',
    defaultMessage: '-- 请选择 --',
  },
  No: {
    id: 'app.table.column.No',
    defaultMessage: '序号',
  },

});


export default translation;