import React from 'react'
import {
    Form,
    Select,
    Button
} from 'antd'
import {
    observer,
    inject
} from 'mobx-react'
import {FormattedMessage, injectIntl, defineMessages} from 'react-intl'
import CommonUtil from '@utils/common'
import styles from './index.css';
import {UserProject} from "@apis/system/project";
// import projectList from '@utils/project'
const Option = Select.Option;

let _util = new CommonUtil()

@inject('appState','menuState') @observer @injectIntl
class WelcomeForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            project_id:null,
            projectList: []
        }
    }


    componentDidUpdate() {
    }

    componentDidMount() {
        UserProject().then((res) => {
            this.setState({
              projectList: res.data
            });
        });
    }

    handleChange = (value) => {
        const{projectList} = this.state;
        var project = projectList.find(item => {
            return item.id == value
        })
        this.setState({project_id:value});
        _util.setStorage('project', project);
        _util.setStorage('project_id', value);
    }

    goToHomepage = () => {
        const {project_id} = this.state;
        if(project_id){
            this.props.history.push({
                pathname: '/',
                state:{
                    id:project_id
                }
            }) 
        }else{
            alert('请选择项目！')
        }   
    }

    render() {
        const projectOptions = this.state.projectList instanceof Array && this.state.projectList.length ? this.state.projectList.map(d =>
            <Option key={d.id} value={d.id}>{d.name}</Option>) : [];

        return (
            <div className={styles.bjcover}>
                <div className={styles.info_box}>
                    <p>欢迎使用ECMS2020</p>
                    <Select  style={{ width: 300 }} onChange={this.handleChange} placeholder='请选择项目' size='large'>
                        {projectOptions}
                    </Select>
                    <Button type="primary" style={{width:'300px'}} size='large' onClick={() => this.goToHomepage()}>进入</Button>
                </div>
            </div>
        )
    }
}

const WelcomePage = Form.create()(WelcomeForm)

export default WelcomePage
