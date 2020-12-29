import React,{Component} from 'react';
import {FormConsume} from '../../Context';
import {
	CursorIcon
} from '../../styled';
import {
	DragSource,
	DropTarget,
	ConnectDragSource,
	ConnectDropTarget,
	DragSourceMonitor,
	DropTargetMonitor,
} from 'react-dnd';
import {
	Form,
	Input,
	InputNumber,
	Icon,
	Row,
	Col,
	Drawer, Button,Modal
} from 'antd';
import update from 'immutability-helper';
import {
  observer,
  inject
} from 'mobx-react';
import {toJS} from 'mobx';
import styled from 'styled-components';
import PriviewItem from './PriviewItem';//预览单个元素
import styles from '../style.css'
import common from '../../../../view/common.css'
import GoBackButton from "@component/go-back";
import {FormattedMessage} from "react-intl";
import html2pdf from "html2pdf.js";
// import creatHistory from 'history/createHashHistory'  //返回上一页这段代码
// const history = creatHistory();//返回上一页这段代码

const NoneElement=styled.div`
	// height:100px;
	// text-align: center;
	// border: 3px dashed #d3d3d3;
	// color:#d3d3d3;
	// text-overflow: ellipsis;
	// overflow: hidden;
	// white-space: nowrap;
	// font-size: 20px;
	// border-radius: 5px;
	// line-height: 100px;
	
	
	  // background: url('form_empty.png') no-repeat;
	  // background-position: 50%;
	  // height:500px
	
`;

const FormItem = Form.Item;

const dragType='ELEMENT';
const source={
	canDrag(props){
		return true;
	},
	beginDrag(props,monitor,component) {
		return props;
	},
	endDrag(props){
		// console.log(props);
	}
};

const type=[`ELEMENT`];
//放置目标处理集合
const target={
	canDrop(props){
		return props.store.data.length==0;
	},
	drop(props,monitor,component){
        const {item:element}=monitor.getItem();
		const {
			store:{
				addElement,
				setDownElement,
			},
		}=props;
		addElement(element);
		// setDownElement(monitor.getItem().item)
	}
};

@DragSource(
	dragType,
	source,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
		connectDragPreview: connect.dragPreview(),
	}),
)

@DropTarget(
    type,
	target,
	(connect,monitor) =>{
    return ({
  		connectDropTarget: connect.dropTarget(),
  		isOver: monitor.isOver(),
  })
})


@observer
export default class Priview extends Component{
	state={
       visible:false,
    };

	saveFormDesign=()=>{
		const {
		  store:{
			  data,
			  submitUrl,
			  index,
			  config,
		  }
		}=this.props;

		//console.log('developer',this.props.store.data);
		const param={data,submitUrl,index,config};
		this.props.showModal(param);
		// Modal.info({title:`保存表单`,content:<pre>{JSON.stringify(param,null,2)}</pre>})
	};

	// goBack=()=>{
	// 	history.goBack()
	// };

	handlePreviewShow=()=>{
        this.setState({visible:true})
    };

	handleCancel=()=>{
		this.props.closeModal(false);
		//this.setState({visible:false})
	};

	printPage() {
         window.print();
    }

    genPDF = () => {
        const printHtml = this.refs.print.innerHTML;
        // const { formatMessage } = this.props.intl;
        let _this=this;
        const opt = {
            margin:       0.3,
            // filename:     '施工预约.pdf',
            filename:     '表单配置',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2,
                proxy:"http://ecms-1256637595.cos.ap-shanghai.myqcloud.com/source/0d30bf4a3c423b82b7aa3d022d423c88.png?q-sign-algorithm=sha1&q-ak=AKIDys0Hrvj3hi_SVIB-uJaydJid8XrsZzCGIH2PIBWSWa87pjYosLBSSiR1qPazs65s&q-sign-time=1586589853;1586591653&q-key-time=1586589853;1586591653&q-header-list=&q-url-param-list=&q-signature=944631f640d4eed63699c82d19c7f312856814b5&x-cos-security-token=8iRNt6WVYWVmrsjKjMddG8G2tIsVjtFg6628f3c485b363403250720e922e873fRHXI7cR-U1YvmOgz19sF9eO8KXhieFuT5lVZbvFFnA6UFh9rLaxQPLOdhO-nzH2Con7JO34j5sp80_FQlrhd_UpkU5oJFMSyld5HOFKciQ1TsWGbLl7hA7yEyrnBIAR68IXI5ac2ljGrLiBjEWf8Uy1ICaT89bygrPgc_BW0M6Eh4i8v0tlSrAuw-YSWFz2ByBNR2ZAmpO2QgDIrxrSasQ",
                useCORS:true,
                allowTaint:false
                //imageTimeout:10
                // logging:true,
                //  onrendered: function (canvas) {
                //      var url = canvas.toDataURL();
                //      console.log(url)
                //      var image = new Image();
                //      image.src = url;
                //      let pic_info=_this.refs.print.append(image)
                //      console.log(pic_info)
                //      // printHtml.append(image);
                //    }

            },
            jsPDF:        { unit: 'in', orientation: 'portrait', format: 'a4', },
			pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            // pagebreak:    { mode: ['avoid-all'] }
        };
        html2pdf().set(opt).from(printHtml).save()
    };

	genPDF2 = () => {
        const printHtml = this.refs.print2.innerHTML;
        // const { formatMessage } = this.props.intl;
        const opt = {
            margin:       0.3,
            // filename:     '施工预约.pdf',
            filename:     '表单配置',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', orientation: 'portrait', format: 'a4', },
			pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            // pagebreak:    { mode: ['avoid-all'] }
        };
        html2pdf().set(opt).from(printHtml).save()
    };

  render(){
	const {
		connectDropTarget,
		connectDragSource,
		store,
		store:{//Dnd的原因，store必须通过props传入不能注入
			editingData:{
				required=false,
				label,
				options,
				optionRowShow,
				fieldName,
				columns,
				tag_name,
				tag_color,
				title_name,
				title_level,
				title_position
			},
			data,
			data:{
				length,
			},
			config,
			count
		},
		form,
		type,
		visible
	}=this.props;
	const a=[];
	options&&options.forEach(e=>a.push(e.label));
	//console.log('dataLength',length);
	console.log('store2',visible);

    const form_preview=
     <Form labelAlign={config&&config.labelPosition} className={styles.formWithoutBorder}>
							  {data.map((e, i) => {
							  		return (
									  <PriviewItem
										  key={i}
										  form={form}
										  item={e}
										  store={store}
										  required={e&&e.required}
										  label={e&&e.label}
										  options={toJS(e&&e.options)}
										  optionRowShow={e&&e.optionRowShow}
										  fieldName={e&&e.fieldName}
										  a={a}
										  type={type}
										  config={config}
									  />)
							  })}
							  </Form>

    return (
    	<div>
			{connectDropTarget&&
			  connectDropTarget(
				<div style={{minHeight:'500px'}}>
				  {/*<Form>*/}
					  {length === 0 ?
						  <NoneElement className={styles.noElementPic}>
							  {/*{*/}
								{/*type===1?<p className={styles.noElementWord}>*/}
											  {/*☜从左侧点击/拖拽字段至此处<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
											  {/*在右侧对属性进行编辑☞*/}
										 {/*</p>:null*/}
							  {/*}*/}
						  </NoneElement>:
						  <div>
							  <div>
							     {form_preview}
							  </div>

							  <div style={{marginLeft:'40%'}}>
								  {/*{type === 2 ? <div>*/}
										  {/*<Button*/}
										  {/*onClick={this.saveFormDesign}*/}
										  {/*className={styles.formButtonStyle}*/}
										  {/*type="primary"*/}
									  {/*>保存</Button>*/}
								  {/*</div>*/}
									  {/*: type === 4 ? <div>*/}
										{/*<Button*/}
										  {/*onClick={this.saveFormDesign}*/}
										  {/*className={styles.formButtonStyle}*/}
										  {/*type="primary"*/}
										  {/*>修改</Button>*/}
									  {/*</div>:*/}
									  {/*null}*/}

							  {/*{type === 1 ? <div><Button*/}
									  {/*onClick={this.saveFormDesign}*/}
									  {/*className={styles.formButtonStyle}*/}
									  {/*type="primary"*/}
								  {/*>保存</Button><Button*/}
									  {/*onClick={this.handlePreviewShow}*/}
									  {/*className={styles.formButtonStyle}*/}
									  {/*style={{marginLeft:'20px'}}*/}
									  {/*type="default"*/}
								  {/*>预览</Button></div> :*/}
								  {/*type === 2 ? <div><Button*/}
										  {/*onClick={this.saveFormDesign}*/}
										  {/*className={styles.formButtonStyle}*/}
										  {/*type="primary"*/}
									  {/*>保存</Button>*/}
								  {/*</div>*/}
									  {/*:*/}
									  {/*type === 4 ? <div>*/}
										{/*<Button*/}
										  {/*onClick={this.saveFormDesign}*/}
										  {/*className={styles.formButtonStyle}*/}
										  {/*type="primary"*/}
										  {/*>修改</Button>*/}
									  {/*</div>:*/}
									  {/*null}*/}
								   </div>
							       <span style={{display:"none"}}>{count}</span>
						  </div>
					  }
				  {/*</Form>*/}
				</div>
			  )}

			<Modal
			  title="预览"
			  visible={visible}
			  // visible={this.state.visible}
			  okText={''}
			  footer={null}
			  // onOk={this.handleOk}
			  onCancel={this.handleCancel}
			  width={650}
			>
				<div className={common.printarea}>
					  <Form id='root' labelAlign={config&&config.labelPosition} style={{marginBottom:'60px'}}>
						  {data.map((e, i) => {
							  //console.log('e', e)
							  return (
								  <PriviewItem
									  key={i}
									  form={form}
									  item={e}
									  store={store}
									  required={e&&e.required}
									  label={e&&e.label}
									  options={toJS(e&&e.options)}
									  optionRowShow={e&&e.optionRowShow}
									  fieldName={e&&e.fieldName}
									  a={a}
									  type={3}
									  config={config}
								  />
							  )
						  })}
					  </Form>
				</div>

				<div ref='print' className={common.printarea} style={{display:'none'}}>
					  <Form id='root' labelAlign={config&&config.labelPosition} style={{marginBottom:'60px',padding:'20px 0',border:'1px solid #b1d1e0'}}>
						  {data.map((e, i) => {
							  //console.log('e', e)
							  return (
								  <PriviewItem
									  key={i}
									  form={form}
									  item={e}
									  store={store}
									  required={e&&e.required}
									  label={e&&e.label}
									  options={toJS(e&&e.options)}
									  optionRowShow={e&&e.optionRowShow}
									  fieldName={e&&e.fieldName}
									  a={a}
									  type={3}
									  config={config}

								  />
							  )
						  })}
					  </Form>
				</div>

				{/*<div style={{textAlign:'center'}}>*/}
					{/*<Button type="primary" style={{marginRight: '10px'}} onClick={this.printPage}>*/}
							{/*<FormattedMessage id="component.tablepage.print" defaultMessage="打印" />*/}
					  {/*</Button>*/}
					  {/*<Button type="primary" style={{marginRight: '10px'}} onClick={this.genPDF}>*/}
							{/*导出pdf*/}
					  {/*</Button>*/}
				{/*</div>*/}
			</Modal>
		</div>
    )
  }
}
