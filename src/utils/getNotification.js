import { notificationInfo, NoticeMessage, todoList } from "@apis/system/push-message";
import CommonUtil from '@utils/common'
let _util = new CommonUtil()
// 重要通知
const getNotification = ctx => {
  console.log(_util.getStorage('project_id'))
  todoList({project_id: _util.getStorage('project_id')}).then(res => {
    const { need_handle_list, message_list } = res.data.results;

    if (ctx.props.menuState) {
      if (message_list) {
        ctx.props.menuState.changeMessageList(message_list);
      }
      if (need_handle_list) {
        ctx.props.menuState.changeNeedList(need_handle_list);
      }
    }
  });
};

export default getNotification;
