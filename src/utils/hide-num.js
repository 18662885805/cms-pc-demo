const replace_str = (old_str, front_len, end_len) => {
  let length = old_str.length - front_len - end_len;
  let sub_str = "";
  for (let i = 0; i < length; i++) {
    sub_str += "*";
  }
  return old_str.substring(0, front_len) + sub_str + old_str.substring(front_len + length);
};

const hide_id_num = (id_num) => {
  if (id_num) {
    const length = id_num.length;
    if (length > 14) {
      return replace_str(id_num, 6, length - 14);
    }
    if (length > 7) {
      return replace_str(id_num, 7, 0);
    }
    if (length > 5) {
      return replace_str(id_num, 5, 0);
    }
  }
  return id_num;
};

export { hide_id_num };
