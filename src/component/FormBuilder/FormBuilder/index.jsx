import React,{Component,Fragment} from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import update from 'immutability-helper';
import {
  Form,
  Row,
  Col,
  Affix,
} from 'antd';
import {observer} from 'mobx-react';

import Store from '../Store';
import {Provider} from 'mobx-react';
import styled from 'styled-components';
import Priview from './Priview';//预览
import ElementList from './ElementList';//元素列表
import EditingContent from './EditingContent';//编辑抽屉
import DeveloperContent from './DeveloperContent';//开发者视图
import styles from'./style.css'

const store=new Store();

const ElementListContainer=styled.div`
  ${'' /* margin-left: 5px; */}
`;

let num=1;

@DragDropContext(HTML5Backend,{window })

@Form.create({
  onValuesChange:(props, fields)=>{
      store.editField=Object.keys(fields)[0];
  }
})

export default class FormBuilder extends Component{
    constructor(props) {
       super(props);
    }

      componentWillMount(){
        console.log('store',this.props);
        if(this.props.type===3){
            store.init({
              ...this.props
            })
        }
      }

    componentWillReceiveProps (nextProps) {
        console.log(nextProps);
      if(num<2){
          store.init({
            ...nextProps
          });
          num++
      }else if(parseInt(num)===2&&nextProps.type!==1){
          store.init({
            ...nextProps
          });
          num++
      }
      // if(num<=2){
      //     store.init({
      //       ...nextProps
      //     });
      //     num++
      // }
      }

      componentWillUnmount() {
        store.init({
            developer:true,
            design:true,
            data:{"data":[],'submitUrl':''}
        });
        num=1;
      }

    showModal=val=>{
    // console.log(val)
    };

  render(){
    const {design}=this.props;

    // type:
    //   1:表单配置-新建
    //   5:表单配置-预览
    //   2:工作流发起-新增
    //   4:工作流发起-修改
    //   6.工作流发起-查看
    //   3:工作流审批

    return (
      <Provider store={store}>
        <Fragment>
            <style>
               {`p,ol{margin:0}`}
            </style>

          <Row
            style={{
              // width:800,
              margin:`auto`
            }}
            gutter={8}
          >
              {this.props.type === 1 ? <Col span={4}>
                      <Affix>
                          <ElementListContainer>
                              <ElementList/>
                          </ElementListContainer>
                      </Affix>
                  </Col>:
                  [2,3,4,6].indexOf(this.props.type)>-1?<Col span={4}/>:
                   null
              }

            <Col
                // span={16}
                span={this.props.type === 3?24:16}
            >
              <div className={this.props.type===1?styles.PreviewCreateStyle:styles.PreviewEditStyle}>
                  {/*{design&&this.props.type!==2?*/}
                    {/*<Affix style={{ position: 'relative', top: -11}}  >*/}
                      {/*<DeveloperContent*/}
                        {/*form={this.props.form}*/}
                        {/*showModal={this.props.getForm}*/}
                        {/*type={this.props.type}*/}
                        {/*//showModal={this.showModal}*/}
                      {/*/>*/}
                    {/*</Affix>*/}
                  {/*:null }*/}

                <Priview
                  form={this.props.form}
                  store={store}
                  type={this.props.type}
                  ref={this.props.Mref}
                  showModal={this.props.getForm}
                  closeModal={this.props.closeModal}
                  visible={this.props.previewModal}
                />
              </div>
            </Col>

              {this.props.type === 1 ?
                <Col span={4}>
                      <EditingContent
                          form={this.props.form}
                          store={store}
                      />
                </Col>:
                [2,4,6].indexOf(this.props.type)>-1?<Col span={4}/>:
                   null
              }
          </Row>

          {/*<EditingContent*/}
            {/*form={this.props.form}*/}
          {/*/>*/}
        </Fragment>
      </Provider>
    )
  }
}