import tablepage from "./en-US/component.tablepage";
import table from "./en-US/component.table";
import systemUser from "./en-US/page.system.user";
import bread from "./en-US/component.bread";
import eventFit from "./en-US/page.event.fit";
import construct from "./zh-CN/page.construct.project";

export default {
  "global.logout": "Logout",
  "global.help": "Help",
  "global.notice": "Notice",
  "global.center": "Account Center",
  "global.password": "Change Password",
  "global.message": "Message",
  "global.read": "read",
  "global.delete": "delete",
  "global.todo": "Todo",
  "global.clear-message": "Clear Message",
  "global.clear-all": "Clear All",
  "global.nodata": "No Data",
  "global.bug": "Bug/Advise Submit",
  "global.upload": "Upload",
  ...tablepage,
  ...table,
  ...systemUser,
  ...bread,
  ...eventFit,
  ...construct
};
