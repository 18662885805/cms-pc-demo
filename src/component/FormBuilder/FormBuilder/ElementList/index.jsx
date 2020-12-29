import React,{Component} from 'react';
import {List} from 'antd';
import Element from './Element';
import {FormConsume} from '../../Context';
import styles from '../style.css'
import {
  inject,
  observer,
} from 'mobx-react';

@inject('store')
@observer
export default class ElementList extends Component{
  componentDidMount(){
      this.getInfo=()=>{
          
      }
  };

  render(){
    const {
      store:{
          elementTypes:data,
          upperTypes:upper,
          gridTypes:grid
      },
    }=this.props;

    console.log('elementType',data);

    return (
        <div className={styles.componentsList}>
           <div className={styles.widgetCate}>基础字段</div>
           <ul>
               {
                   data.slice().filter(a=>a.level===1).map((item)=>{
                       return (<li className={styles.formEditWidgetLabel} key={item.name}><Element item={item}/></li>)
                   })
               }
           </ul>

            <div className={styles.widgetCate}>高级字段</div>
               <ul>
                   {
                       data.filter(a=>a.level===2).map((item)=>{
                           return (<li className={styles.formEditWidgetLabel} key={item.name}><Element item={item}/></li>)
                       })
                   }
               </ul>

               <div className={styles.widgetCate}>布局字段</div>
               <ul>
                   {
                       data.filter(a=>a.level===3).map((item)=>{
                           return (<li className={styles.formEditWidgetLabel} key={item.name}><Element item={item}/></li>)
                       })
                   }
               </ul>
            </div>

    )
  }
}

 {/*<List*/}
        {/*header={*/}
          {/*<div>*/}
            {/*基础字段*/}
          {/*</div>}*/}
        {/*bordered*/}
        {/*dataSource={data}*/}
        {/*renderItem={*/}
          {/*item =>*/}
                {/*(*/}
                  {/*<List.Item>*/}
                    {/*<Element*/}
                      {/*item={item}*/}
                    {/*/>*/}
                  {/*</List.Item>*/}
                {/*)*/}
        {/*}*/}
      {/*/>*/}
