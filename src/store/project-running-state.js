import {
  observable,
  action
} from "mobx";

class ProjectRunningState {
  @observable
  project = {
    type: {
      node: []
    }
  }

  @action
  setProject (project) {
    this.project = project;
  }

}

const projectRunningState = new ProjectRunningState();

export default projectRunningState;
