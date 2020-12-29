import React, { Component } from "react";
import styles from "./index.module.css";
import {Spin, Select, Modal, Popconfirm, message} from "antd";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import { interviewee } from "@apis/event/interviewee/";
import {SearchProjectUser} from "@apis/system/user";
import debounce from "lodash/debounce";
import CommonUtil from "@utils/common";
const _util = new CommonUtil();
const { Option } = Select;

const messages = defineMessages({
  not_select: {
    id: "app.component.user_wrapper.not_select",
    defaultMessage: "不可选择!"
  }
});

@injectIntl
class UserWrapper extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    const { auditUsers } = this.props;
    let selectedLists = [];
    if (Array.isArray(auditUsers)) {
      selectedLists = auditUsers;
    }
    this.state = {
      popconVisible: false,
      modalVisible: false,
      fetching: false,
      searchText: "",
      selectedLists: selectedLists,
      searchOptions: [],
      repeatItem: {},
      searchId: "",
      infos: []
    };

    this.closeModal = this.closeModal.bind(this);
    this.closePopcon = this.closePopcon.bind(this);
    this.openPopcon = this.openPopcon.bind(this);
    this.openModal = this.openModal.bind(this);
    this.fetchUser = debounce(this.fetchUser, 500).bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.addRepeatItem = this.addRepeatItem.bind(this);
  }
  componentDidMount() {
    const { remarks } = this.props;
    const { infos } = this.state;
    if (Array.isArray(remarks)) {
      let { prevUsers, nextUsers } = this.props;
      remarks.forEach(r => {
        infos.push({
          info: r
        });
      });
      if (!prevUsers) {
        prevUsers = [];
      }
      if (!nextUsers) {
        nextUsers = [];
      }
      [...prevUsers, ...nextUsers].forEach((u, uIndex) => {
        infos[uIndex].name = u.name;
      });
    }
    this.setState({infos});
  }
  componentWillReceiveProps(nextProps) {
    const { auditUsers } = nextProps;
    if (Array.isArray(auditUsers)) {
      this.setState({
        selectedLists: auditUsers
      });
    }
  }
  openModal() {
    this.setState({
      searchText: "",
      modalVisible: true
    });
  }

  closeModal() {
    this.setState({
      modalVisible: false
    });
  }

  openPopcon() {
    this.setState({
      popconVisible: true
    });
  }

  closePopcon() {
    this.setState({
      popconVisible: false
    });
  }

  fetchUser(value) {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    const { searchType } = this.props;

    this.setState({
      fetching: true,
      searchOptions: []
    });

    SearchProjectUser({
      q: value,
      project_id: _util.getStorage('project_id')
    }).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const searchOptions = res.data.map(user => ({
        name: user.name,
        tel: user.tel,
        org:user.org,
        id_num: user.id_num,
        value: user.name,
        id: user.id,
        phone: user.phone
      }));
      this.setState({
        searchOptions,
        fetching: false
      });
    });
  }

  handleChange(value) {
    this.setState({
      searchText: value,
      searchOptions: [],
      fetching: false
    });
  }
  handleSelect(value, obj) {
    const {formatMessage} = this.props.intl;
    const { selectedLists, infos } = this.state;
    const { getSelectedLists, remarks } = this.props;

    if (Array.isArray(remarks)) {
      let {prevUsers, nextUsers} = this.props;
      if (!prevUsers) {
        prevUsers = [];
      }
      if (!nextUsers) {
        nextUsers = [];
      }
      if (selectedLists.length >= (remarks.length - prevUsers.length - nextUsers.length)) {
        message.error(formatMessage(messages.not_select)); //不可选择!
        this.closeModal();
        return;
      }
    }

    for (let i = 0, len = selectedLists.length; i < len; i++) {
      if (selectedLists[i].id === value) {
        this.closeModal();
        this.setState({
          searchId: "",
          searchText: "",
          repeatItem: {
            name: obj.props.name,
            id: value
          }
        });
        this.openPopcon();
        return;
      }
    }

    selectedLists.push({
      name: obj.props.name,
      id: value
    });

    if (Array.isArray(remarks) && remarks.length > 0) {
      let {prevUsers, nextUsers} = this.props;
      if (!prevUsers) {
        prevUsers = [];
      }
      if (!nextUsers) {
        nextUsers = [];
      }
      [...prevUsers, ...selectedLists, ...nextUsers].forEach((s, sIndex) => {
        infos[sIndex].name = s.name;
      });
    }

    this.setState({
      selectedLists,
      searchText: "",
      // searchOptions: [],
      searchId: "",
      infos
    });

    this.closeModal();
    if (getSelectedLists && typeof getSelectedLists === "function") {
      getSelectedLists(selectedLists);
    }
  }

  addRepeatItem(e) {
    const { repeatItem, selectedLists, infos } = this.state;

    const { getSelectedLists, remarks } = this.props;

    selectedLists.push(repeatItem);

    if (Array.isArray(remarks) && remarks.length > 0) {
      let {prevUsers, nextUsers} = this.props;
      if (!prevUsers) {
        prevUsers = [];
      }
      if (!nextUsers) {
        nextUsers = [];
      }
      [...prevUsers, ...selectedLists, ...nextUsers].forEach((s, sIndex) => {
        infos[sIndex].name = s.name;
      });
    }

    this.setState({
      selectedLists,
      infos
    });
    this.closePopcon();
    if (getSelectedLists && typeof getSelectedLists === "function") {
      getSelectedLists(selectedLists);
    }

  }

  handleRemove(e) {
    let { selectedLists, infos } = this.state;

    const { getSelectedLists, remarks } = this.props;

    selectedLists.splice(e.target.name, 1);

    if (Array.isArray(infos) && infos.length > 0) {
      infos.forEach(i => {
        i.name = "";
      });
      let { prevUsers, nextUsers } = this.props;
      if (!prevUsers) {
        prevUsers = [];
      }
      if (!nextUsers) {
        nextUsers = [];
      }
      [...prevUsers, ...selectedLists, ...nextUsers].forEach((s, sIndex) => {
        infos[sIndex].name = s.name;
      });
    }

    this.setState({
      selectedLists,
      infos
    });

    if (getSelectedLists && typeof getSelectedLists === "function") {
      getSelectedLists(selectedLists);
    }

  }

    handleFocus = e => {
      this.setState({
        searchOptions: []
      });
    }

    render() {
      const { infos } = this.state;

      return (
        <div>
          <Modal
            title={this.props.modalTitle}
            visible={this.state.modalVisible}
            onCancel={this.closeModal}
            footer={null}>
            <Select
              allowClear
              showSearch
              placeholder={this.props.searchPlaceholder}
              notFoundContent={this.state.fetching ? <Spin size="small"/> : <FormattedMessage id="global.nodata" defaultMessage="暂无数据" /> }
              filterOption={false}
              onSearch={this.fetchUser}
              onSelect={this.handleSelect}
              style={{width: "100%"}}
              value=''
            >
              {this.state.searchOptions.map((option, index) => {
                return (
                  <Option
                    // title={option.id}
                    // value={option.id}
                    name={option.name}
                    title={_util.searchConcat(option)}
                    key={option.id}
                  >{_util.searchConcat(option)}</Option>
                );
              })
              }
            </Select>
          </Modal>
          {
            infos.length > 0
              ? <div className={styles.wrapper}>
                <div className={styles.boxAdd} style={{opacity: 0}}>
                  <div className={styles.avatarAdd}>+</div>
                </div>
                {
                  this.state.infos.map((value, index) => {
                    return (
                      <div
                        className={styles.box}
                        key={index}
                        style={{
                          marginBottom: 1
                        }}>
                        <div
                          className={styles.avatar}
                          style={{
                            color: index < this.state.selectedLists.length ? "#87d068" : "#333",
                            background: "transparent"
                          }}>
                          {
                            value.name
                              ? <div style={{height: 0, opacity: 0}}>{value.name}</div>
                              : null
                          }
                          <div>{value.info}</div>
                        </div>

                      </div>
                    );
                  })
                }
              </div>
              : null
          }

          <div className={styles.wrapper}>
            {/* {
                        this.props.noAdd ? null : <div className={styles.boxAdd}>
                        <Popconfirm
                            placement="top"
                            visible={this.state.popconVisible}
                            title={"所选项已在列表中"}
                            okText="添加"
                            cancelText="取消"
                            onCancel={this.closePopcon}
                            onConfirm={this.addRepeatItem}>
                            <div
                                className={styles.avatarAdd}
                                onClick={this.openModal}>+</div>
                        </Popconfirm>
                        </div>
                    } */}

            {
              this.props.noAdd ? null : <div className={styles.boxAdd}>
                <Popconfirm
                  placement="top"
                  visible={this.state.popconVisible}
                  title={<FormattedMessage id="app.component.user_wrapper.item_in_list" defaultMessage="所选项已在列表中" />}
                  okText={<FormattedMessage id="app.component.user_wrapper.add" defaultMessage="添加" />}
                  cancelText={<FormattedMessage id="app.component.user_wrapper.cancel" defaultMessage="取消" />}
                  onCancel={this.closePopcon}
                  onConfirm={this.addRepeatItem}>
                  <div
                    className={styles.avatarAdd}
                    onClick={
                      this.props.disabled
                        ? () => false
                        : this.openModal
                    }
                    style={
                      this.props.disabled ? {
                        color: "rgba(0,0,0,.25)",
                        backgroundColor: "#f5f5f5",
                        borderColor: "#d9d9d9",
                        cursor: "not-allowed"
                      }
                        : null
                    }
                  >+</div>
                </Popconfirm>
              </div>
            }

            {
              this.props.prevUsers && this.props.prevUsers.map((value, index) => {
                return (
                  <div
                    className={styles.box}
                    key={index}>
                    <div
                      className={styles.avatar}
                      style={{
                        background: this.props.prevBgColor ? this.props.prevBgColor : "#1890ff",
                        color: this.props.prevColor ? this.props.prevColor : "#fff"
                      }}>
                      {
                        infos[index]
                          ? <div style={{height: 0, opacity: 0}}>{infos[index].info}</div>
                          : null
                      }
                      <div>{value.name}</div>
                    </div>

                  </div>
                );
              })
            }
            {
              this.state.selectedLists.map((value, index) => {
                return (
                  <div
                    className={styles.box}
                    key={index}>
                    <div className={styles.avatar} style={{background: "#87d068"}}>
                      <a
                        className={styles.removeButton}
                        name={index}
                        onClick={this.handleRemove}>×</a>
                      {
                        infos[index]
                          ? <div style={{height: 0, opacity: 0}}>{infos[index].info}</div>
                          : null
                      }
                      <div>{value.name}</div>
                    </div>

                  </div>
                );
              })
            }

            {
              this.props.nextUsers && this.props.nextUsers.map((value, index) => {
                return (
                  <div
                    className={(this.props.noAdd && (index === (this.props.nextUsers.length - 1))) ? styles.boxNoArrow : styles.box}
                    key={index}>
                    <div className={styles.avatar} style={{background: "#eee", color: "#999"}}>
                      {
                        infos[index]
                          ? <div style={{height: 0, opacity: 0}}>{infos[index].info}</div>
                          : null
                      }
                      <div>{value.name}</div>
                    </div>

                  </div>
                );
              })
            }


          </div>
        </div>
      );
    }
}

export default UserWrapper;