import React from "react";

class TimeDifferenceComponent extends React.Component {
  render () {
    let { time } = this.props;

    let old_timestamp = Date.parse(time);

    let second = (new Date().getTime() - old_timestamp) / 1000;

    let diff = 0;
    if (second < 0) return 0;
    if (second > 60 * 60 * 24 * 30 * 12) {
      diff = Math.ceil(second / 60 / 60 / 24 / 30 / 12) + "年前";
    } else if (second > 60 * 60 * 24 * 30) {
      diff = Math.ceil(second / 60 / 60 / 24 / 30) + "月前";
    } else if (second > 60 * 60 * 24) {
      diff = Math.ceil(second / 60 / 60 / 24) + "天前";
      console.log(second);
    } else if (second > 60 * 60) {
      diff = Math.ceil(second / 60 / 60) + "小时前";
    } else if (second > 60) {
      diff = Math.ceil(second / 60) + "分钟前";
    } else {
      diff = Math.ceil(second) + "秒前";
    }

    return (
      <span>
        {diff}
      </span>
    );
  }
}

export default TimeDifferenceComponent;
