import tablepage from "./zh-CN/component.tablepage";
import table from "./zh-CN/component.table";
import systemUser from "./zh-CN/page.system.user";
import bread from "./zh-CN/component.bread";
import eventFit from "./zh-CN/page.event.fit";
import construct from "./zh-CN/page.construct.project";

export default {
  "global.logout": "注销",
  "global.help": "帮助",
  "global.notice": "重要通知",
  "global.center": "个人中心",
  "global.password": "修改密码",
  "global.message": "消息",
  "global.read": "已读",
  "global.delete": "删除",
  "global.todo": "待办",
  "global.clear-message": "全部已读",
  "global.clear-all": "全部删除",
  "global.nodata": "暂无数据",
  "global.bug": "Bug/意见提交",
  "global.upload": "附件上传",
  ...tablepage,
  ...table,
  ...systemUser,
  ...bread,
  ...eventFit,
  ...construct
};
