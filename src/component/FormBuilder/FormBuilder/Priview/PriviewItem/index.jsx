import React,{Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Map, is} from 'immutable';
import {
	DragSource,
	DropTarget,
	ConnectDragSource,
	ConnectDropTarget,
	DragSourceMonitor,
	DropTargetMonitor,
} from 'react-dnd';
import {
	Form, Input, InputNumber,
	Icon,
	Select,
	Row,
	Col,
	Drawer,
	Checkbox,
	Radio,
	DatePicker,
	TimePicker,
	Tag,
	Transfer, Upload, Button, Typography, message
} from 'antd';
import {
  observer,
  inject
} from 'mobx-react';
import {FormConsume} from '../../../Context';
import {CursorIcon} from '../../../styled';
import update from 'immutability-helper';
import styles from '../../style.css'
import CommonUtil from "@utils/common";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import moment from 'moment';
import {GetTemporaryKey} from "@apis/account/index"
let _util = new CommonUtil();

const PRIVIEW_ELEMENT=`PRIVIEW_ELEMENT`;

const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { Title } = Typography;

const dropType=[
  `ELEMENT`,
  PRIVIEW_ELEMENT,
];
const dragType=PRIVIEW_ELEMENT;

//拖拽目标处理集合
const source={
	canDrag(props){
		return true;
	},
	beginDrag(props,monitor,component) {
		return props;
	},
	endDrag(props,monitor){
		console.log('monitor',monitor);
	}
};

//放置目标处理集合
const target={
	canDrop(props){
		return true;
	},

	 hover(props, monitor, component) {
			const dragItem = monitor.getItem().item;
			const is_over=monitor.isOver({ shallow: true });
			//console.log('is_over',is_over)
		    const {
				item:hoverItem,
				store:{
					createElement,
					moveElement,
					setDownElement,
					data,
				}
			}=props;
		    // console.log('props',props);
		    setDownElement(monitor.getItem().item)
			const dragIndex = data.indexOf(dragItem);
			const hoverIndex = data.indexOf(hoverItem);
			console.log('hoverhover',hoverItem);
			if (dragIndex === hoverIndex) {
				return;
			}
			if (dragIndex === -1) {
				  //createElement(dragItem,hoverIndex,hoverItem);
				  return false;
			}
			// Determine rectangle on screen
			const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
			// Determine mouse position
			const clientOffset = monitor.getClientOffset()
			// Get pixels to the top
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;
			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%
			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return
			}
			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return
			}
			// Time to actually perform the action
			moveElement(dragIndex, hoverIndex)
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			//item.index = hoverIndex
		},

	 drop(props,monitor,component){
		const dragItem = monitor.getItem().item;
		const tp=monitor.getItemType();
		const {
			item:hoverItem,
			store:{
				createElement,
				data,
			}
		}=props;
		console.log('dragItem',dragItem);
		console.log('data',data);
		const hoverIndex = data.indexOf(hoverItem);
		const dragIndex = data.indexOf(dragItem);
		// if (hoverItem.type==='grid') {
		 if (dragIndex === -1) {
			 console.log(1)
			 createElement(dragItem, hoverIndex, hoverItem);
		 }
			// return;
		// }
		const dragData=monitor.getItem().data;
	}
};

let fileList2=[];

let img_url2=undefined;
let img_url3=[];

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
	dropType,
	target,
	(connect,monitor) =>{
    return ({
  		connectDropTarget: connect.dropTarget(),
  		isOver: monitor.isOver(),
  })
  } )

@injectIntl
export default class PriviewItem extends Component{
	constructor(props) {
    super(props);
    this.state = {
      //img_url:"",
		img_url:{},
    };
    this.handleShowLogo=this.handleShowLogo.bind(this)
  }

	shouldComponentUpdate(nextProps,nextState){
		return (
			true
			// (this.props.store.editField===nextProps.item.fieldName)
			// ||(this.props.item!==nextProps.item)
			// ||(this.props.required!==nextProps.required)
			// ||(this.props.label!==nextProps.label)
			// ||(this.props.fieldName!==nextProps.fieldName)
			// ||(this.props.optionRowShow!==nextProps.optionRowShow)
			// ||(JSON.stringify(this.props.options)!=JSON.stringify(nextProps.options))
			// ||(this.props.item.fieldName!==nextProps.item.fieldName)
		)
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if(this.props.store.editingData&&this.props.store.editingData.type==='logo'){
			console.log(this.props.store.editingData);
			this.handleShowLogo(this.props.store.editingData.pic_address,this.props.store.editingData.fieldName)
		}
		// if(nextProps.item&&nextProps.item.type==='logo'){
		// 	this.handleShowLogo(nextProps.item.pic_address)
		// }
	}

	componentWillMount() {
		let {item}=this.props;
		console.log(item.fieldName);
		if(item.type==='upload'){
			if(item.value) {
				item.fileList = [];
				//转换前端格式
				var that = this;
				var cos = _util.getCos(null, GetTemporaryKey);
				let source_list = [];
				if (typeof (item.value) === 'string') {
					source_list = JSON.parse(item.value);
				}
				console.log(source_list);
				if (source_list && source_list.length) {
					//this.setState({file_loading:true})
					source_list.map((obj, index) => {
						const key = obj.url;
						var url = cos.getObjectUrl({
							Bucket: 'ecms-1256637595',
							Region: 'ap-shanghai',
							Key: key,
							Sign: true,
						}, function (err, data) {
							console.log(data);
							if (data && data.Url) {
								const file_obj = {
									url: data.Url,
									name: obj.name,
									uid: -(index + 1),
									status: "done",
									cosKey: obj.url
								};
								item.fileList.push(file_obj);
								return item;
								//return fileList2
								//const new_list = [...that.state.fileList2,file_obj];

								// if(index === source_list.length - 1){
								//    //that.setState({file_loading:false});
								// }
							}
						});
					});
				}
			}else{
				item.value=[]
			}
		}

		if(item.type==='logo'){
			this.handleShowLogo(item.pic_address,item.fieldName)
		}else{
			if(item.type==='grid'){
				item.columns&&item.columns.length&&item.columns.map((val)=>{
					if(val.list&&val.list.length&&val.list[0].type==='logo'){
						this.handleShowLogo(val.list[0].pic_address,val.list[0].fieldName)
					}
				})
			}
		}
	}

	orgUpload = (info,param1,param2) => {
		let {fileList} = info;
		console.log(info);
		const status = info.file.status;
		const { formatMessage } = this.props.intl;
		if (status === 'done') {
			message.success(`${info.file.name} ${formatMessage({id:"app.message.upload_success",defaultMessage:"上传成功"})}`)
		} else if (status === 'error') {
			message.error(`${info.file.name} ${info.file.response}.`)
		}
		this.props.store.setUploadValue(fileList,param1,param2)
		//fileList2=fileList;
		//this.props.store.setDataValue(fileList,param1,param2)
		//this.props.store.setDataValue(JSON.stringify(_util.setSourceList(fileList)),param1,param2)
		//this.setState({fileList2: fileList})
	};

	valueToFileList=(source)=>{
			if (source) {
			   //转换前端格式
			   var that = this;
			   var cos = _util.getCos(null,GetTemporaryKey);
			   const source_list = JSON.parse(source);
			   if(source_list&&source_list.length){
				   //this.setState({file_loading:true})
				   source_list.map((obj, index) => {
					   const key = obj.url;
					   var url = cos.getObjectUrl({
						   Bucket: 'ecms-1256637595',
						   Region: 'ap-shanghai',
						   Key:key,
						   Sign: true,
					   }, function (err, data) {
					   	   console.log(data);
						   if(data && data.Url){
							   const file_obj =  {thumbUrl:data.Url,url:data.Url,name:obj.name,uid:-(index+1),status: "done",cosKey:obj.url};
							   fileList2.push(file_obj);
							   console.log(fileList2);
							   return fileList2;
							   //return fileList2
							   //const new_list = [...that.state.fileList2,file_obj];

							   if(index == source_list.length - 1){
								   //that.setState({file_loading:false});
							   }
							   //return file_obj
							   //return new_list;
							   //that.setState({fileList2:new_list});
						   }
					   });
				   });
			   }
			}else{
				return []
		    }
	};

	handleShowLogo=(source,field)=>{
		console.log(source);
		console.log(field);
		const {img_url}=this.state;
        var cos = _util.getCos(null,GetTemporaryKey);
        if (source&&source.length>0) {
            //转换前端格式
			new Promise(
				function (resolve, reject) {
					cos.getObjectUrl({
					Bucket: 'ecms-1256637595',
					Region: 'ap-shanghai',
					Key:source[source.length-1].url,
					//Key:key,
					Sign: true,
				}, function (err, data) {
					console.log(data);
					if(data && data.Url){
						resolve(data.Url)
					}
				});
				}
			).then((res)=>{
                img_url[field]=res;
                console.log(img_url);
                this.setState(img_url);
				//this.setState({img_url:res});
				return res
			});
		}
	};

	// handleShowLogo=(source)=>{
	// 	console.log(source);
    //     var cos = _util.getCos(null,GetTemporaryKey);
    //     if (source&&source.length>0) {
    //         //转换前端格式
	// 		  //let url_pic=''
	// 		  // source.map((obj, index) => {
	// 			// const key = obj.url;
	// 		let _this = this;
	// 		new Promise(
	// 			function (resolve, reject) {
	// 				cos.getObjectUrl({
	// 				Bucket: 'ecms-1256637595',
	// 				Region: 'ap-shanghai',
	// 				Key:source[source.length-1].url,
	// 				//Key:key,
	// 				Sign: true,
	// 			}, function (err, data) {
	// 				console.log(data);
	// 				if(data && data.Url){
	// 					// url_pic=data.Url;
	// 					// return data.Url;
	// 					resolve(data.Url)
	// 				}
	// 			});
	// 			}
	// 		).then((res)=>{
	// 			//console.log(_this);
	// 			console.log(res);
	// 			this.setState({img_url:res});
	// 			img_url2=res;
	// 			return res
	// 		});
    //           // this.store.count+=1
	// 		  // });
	// 		  //console.log(url_pic)
	// 		  //return source&&source.length>0?'http://ecms-1256637595.cos.ap-shanghai.myqcloud.com/source/rc-upload-1584415417166-11?q-sign-algorithm=sha1&q-ak=AKIDRT4ajwqfqD7ymH0SMz33-Ewisp-tLIRkVqWZFZ8utsK8IiYkyV8qCyCnBrv6fFOg&q-sign-time=1586248072;1586249872&q-key-time=1586248072;1586249872&q-header-list=&q-url-param-list=&q-signature=4fbb67239582bb8d29cc6ad609a10d417d2b5b45&x-cos-security-token=q50IxctXX4DJD9vtPrJUmjJXgqoZIyaoe0220a32895a7b3dc3421a1b1f82e575z6tewcq-OQSYX-JaiQIZZRBYZFhdmp4X2B3Sk0LJklt11aVuP1HogoWRGqaFpZHpSfdRQpMQY0pe4qdRF8KOu2pXostAndpJ0b8P5znOvt8_PxTdKDcF0ho1D982yX3KHCawrosVXodLdFUHxkLpEcRNTtI3PpXb-VyqC_1YWGaoS3ZkvB-k-SOPUYfAqeC3miG1HFuGkp1ZovkJPF6JQQ':'../../../../../assets/logo_cloud.png'
	// 	}
	// };

    getFormItem=(item,props,index)=>{//根据元素类型获取控件
		// if(item.type==='logo'){
		// 	this.handleShowLogo(item.pic_address)
		// }
		// const{fileList2}=this.state;

		const{img_url}=this.state;

		console.log(img_url);
		console.log(item.fieldName);
		console.log(Object.getOwnPropertyNames(img_url));

		const {type,fieldName,value}=item;

		const fileList = [
		  // {
			// uid: '-1',
			// name: 'xxx.png',
			// status: 'done',
			// url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			// thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
		  // },
		  // {
			// uid: '-2',
			// name: 'yyy.png',
			// status: 'error',
		  // },
		];

		const props3 = {
		  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
		  listType: 'picture',
		  defaultFileList: [...fileList],
		};

		 const props2 = {
		  multiple: true,
		  accept: "image/*",
		  action: _util.getServerUrl(`/upload/auth/`),
		  headers: {
			  Authorization: 'JWT ' + _util.getStorage('token')
		  },
		};

		if(type===`input`){
		    return <Input {...props} value={item.value} onChange={(e)=>this.handleInputChange(e.target.value,fieldName,index)}/>
		}
		else if(type===`textarea`){
		  return <TextArea {...props} style={{height:'42px'}} value={item.value} onChange={(e)=>this.handleInputChange(e.target.value,fieldName,index)}/>
		}
		else if(type===`inputNumber`){
		  return <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} style={{width:'100%'}} min={item.min} max={item.max} {...props} value={item.value} onChange={(value)=>this.handleInputChange(value,fieldName,index)}/>
		}
		else if(type===`checkbox`){
		  return <Checkbox {...props} checked={item.value} onChange={(e)=>this.handleInputChange(e.target.value,fieldName,index)}/>
		}
		else if(type===`checkboxGroup`){
		  return (
				<CheckboxGroup value={item.value}  onChange={(value)=>this.handleInputChange(value,fieldName,index)} {...props} style={{width:`100%`,lineHeight:`26px`,position:`relative`,top:7}}>
					<Row>
						{
							item.options.map((e,i)=>(
								<Col
									key={i}
									title={e.label}
									span={24/item.optionRowShow}
									style={{whiteSpace:`nowrap`,textOverflow:`ellipsis`,overflow:`hidden`}}
									>
									<Checkbox value={e.value}>
										{e.label}
									</Checkbox>
								</Col>
							))
						}
					</Row>
				</CheckboxGroup>
			)
    }
		else if(type===`radio`){
			return (
				<RadioGroup {...props} value={item.value} onChange={(e)=>this.handleInputChange(e.target.value,fieldName,index)} style={{width:`100%`,lineHeight:`26px`,position:`relative`,top:7}}>
								<Row>
									{
										item.options.map((e,i)=>(
											<Col
												key={i}
												title={e.label}
												span={24/item.optionRowShow}
												style={{whiteSpace:`nowrap`,textOverflow:`ellipsis`,overflow:`hidden`}}
												>
												<Radio value={e.value}>
													{e.label}
												</Radio>
											</Col>
										))
									}
								</Row>
				</RadioGroup>
			)
		}
		else if(type===`select`){
			return (
				<Select
					// style={{ width: 120 }}
					{...props}
					value={item.value}
					onChange={(value)=>this.handleInputChange(value,fieldName,index)}
					>
					{
						item.options.map((e,i)=>(
							<Option
								key={i}
								value={e.value}>
								{e.label}
							</Option>
						))
					}
		    </Select>
			)
		}
		else if(type===`datePicker`){
		  return <DatePicker style={{width:'100%'}} placeholder={''} {...props} value={item.value?moment(item.value, 'YYYY-MM-DD'):undefined} onChange={(date,dateString)=>this.handleInputChange(dateString,fieldName,index)}/>
		}
		else if(type===`timePicker`){
		  return <TimePicker style={{width:'100%'}} placeholder={''} {...props} value={item.value?moment(item.value, 'HH:mm:ss'):undefined} onChange={(time,timeString)=>this.handleInputChange(time,fieldName,index)}/>
		}
		else if(type===`tag`){
			return <Tag color={item.tag_color} {...props}>{item.tag_name}</Tag>
		}
		else if(type===`transfer`){
		  return <Transfer {...props}/>
		}
		else if(type===`upload`){
		  return<Upload
			  {...props2}
			  //fileList={fileList2}
			  fileList={item.fileList}
			  beforeUpload={_util.beforeUpload}
              onChange={(info)=>this.orgUpload(info,fieldName,index)}
              accept='image/*'
		  >
			  <Button><Icon type="upload" /> 上传</Button>
		  </Upload>;
			{/*<Upload{...props3}>*/}
		}
		else if(type==='typography'){
			return <Title level={item.title_level} style={{textAlign:item.title_position,marginBottom:'8px'}}>{item.title_name}</Title>
		}
		else if(type==='logo'){
			// this.handleShowLogo(item.pic_address);
			return <div style={{textAlign:item.pic_position}} ref={'logoInfo'}>
				<img style={{height:'47px'}}
					 src={img_url[item.fieldName]?img_url[item.fieldName]:require('../../../../../assets/logo_cloud.png')}
					 //src={Object.getOwnPropertyNames(img_url).length?img_url[item.fieldName]:require('../../../../../assets/logo_cloud.png')}
					 // src={img_url?img_url:require('../../../../../assets/logo_cloud.png')}
					 //src={(item)=>this.handleShowLogo(item.pic_address)}
					 //src={item.pic_address&&item.pic_address.length>0?this.handleShowLogo(item.pic_address):require('../../../../../assets/logo_cloud.png')}
					 alt={'logo'}
				/>
			</div>
		}
  };

	edit=()=>{
		this.props.store.editingShow(this.props.item);
	};

	editGrid=(index)=>{
		this.props.store.editingShow(this.props.item.columns[index].list[0]);
	};

	deleteGrid=(index)=>{
		this.props.store.deleteGridItem(this.props.item.fieldName,index);
	};

	delete=()=>{
		this.props.store.deleteItem(this.props.item);
	};

	handleInputChange=(param1,param2,param3)=>{
		const {store}=this.props;
		//store.data[0].value=param1;
		this.props.store.setDataValue(param1,param2,param3)
	};

	handleInitValue=(item)=>{
		const dateFormat = 'YYYY/MM/DD';
		let value_info=undefined;
		if(item.type==='datePicker'&&item.value){
			value_info=moment(item.value, dateFormat)
		}else if(item.type==='timePicker'&&item.value){
			value_info=moment(item.value, 'HH:mm:ss')
		} else{
			value_info=item.value
		}
		return value_info
	};

    render(){
    const {
		store:{
			design,
			count,
			config,
		},
		  item,
		  // item:{
			// name
		  // },
		  connectDropTarget,
		  connectDragSource,
		form:{
			getFieldProps,
			getFieldDecorator
		},
		type,
		// config
    }=this.props;

    const labelStyle={
        cursor:design?`move`:null,
		display:`inline-block`,
		// fontSize:'12px'
    };

    const formItemLayout = {
    	labelCol: { span:config&&config.labelWidth },
        wrapperCol: { span:24-parseInt(config&&config.labelWidth) },
        // labelCol: { span:0},
        // wrapperCol: { span:24},
		// labelCol: { span:this.props.store.config.labelWidth },
       // wrapperCol: { span:24-parseInt(this.props.store.config.labelWidth) },
    };

    const formGridLayout = {
    	labelCol: { span:config&&config.labelWidth*2 },
        wrapperCol: { span:24-2*parseInt(config&&config.labelWidth) },
        // labelCol: { span:0},
        // wrapperCol: { span:24},
		// labelCol: { span:this.props.store.config.labelWidth },
       // wrapperCol: { span:24-parseInt(this.props.store.config.labelWidth) },
    };

    // const formItemLayout = {
    //    labelCol: { span: 5 },
    //    wrapperCol: { span: 19 },
    // };

	console.log('type',type);

	const form_data=<Row gutter={8}>
					<Col span={type!==1&&config.labelPosition==='left'?24:22}>
						{item.type==='grid'?
					// 栅格布局
					connectDragSource &&
					  connectDropTarget &&
						connectDropTarget(
						  connectDragSource(
							<div>
								<Row className={styles.widgetGrid} style={type===1?{border: '1px dashed #999'}:{border:'none'}}>
									{item.columns&&item.columns.length>0?
										item.columns.map((val,index)=>{
											console.log('val',val);
											if(val){
												return (<Col span={val.span} key={index}>
													<div className={styles.widgetGridItem} style={type===1?{borderRight: '1px dashed #999'}:{border:'none'}}>
														{val.list&&val.list.length>0?
															 <Row>
																 {val.list[0].type==='typography'||val.list[0].type==='logo'?
																	 <div>
																		 <div className={type===1?styles.widgetGridWidth:styles.widgetGridWidthActive}>
																			   {this.getFormItem(val.list[0],{},[index,item.fieldName])}
																		 </div>

																		 {type===1?
																			 <span>
																				  <CursorIcon
																					type="edit"
																					onClick={()=>this.editGrid(index)}
																				  />
																				  <CursorIcon
																					type="delete"
																					onClick={()=>this.deleteGrid(index)}
																				  />
																			 </span>
																		  :null}
																	 </div>:
																	 <FormItem
																	  colon={true}
																	  label={val.list[0].label}
																	  labelCol={{ span:config&&config.labelWidth*item.columns.length }}
                                                                      wrapperCol={{ span:24-item.columns.length*parseInt(config&&config.labelWidth) }}
																     >
																	 <div className={type===1?styles.widgetGridWidth:styles.widgetGridWidthActive}>
																	       {getFieldDecorator(val.list[0].fieldName,{
																				initialValue:this.handleInitValue(val.list[0]),
																				rules:[
																					{
																						required:val.list[0].required,
																						message:val.list[0].label+'必填'
																						//message:val.list[0].requiredMessage
																					},
																				]
																			})(
																	       	this.getFormItem(val.list[0],{},[index,item.fieldName]))
																	       }
																	 </div>

																		 {
																		 	type===1?
																				<span>
																					<CursorIcon
																						type="edit"
																						onClick={()=>this.editGrid(index)}
																					/>
																				    <CursorIcon
																						 type="delete"
																						 onClick={()=>this.deleteGrid(index)}
																					/>
																				</span>:null
																		 }

																 </FormItem>
																 }
															  </Row>
															 :null
														}
													</div>
												</Col>)
											}
										}):null
									}
								</Row>
							</div>
						  )):
							item.type==='typography'||item.type==='logo'?
							this.getFormItem(item,{})
							:<FormItem
								{...formItemLayout}
								  // className={'active'}
								  colon={true}
								  label={<span dangerouslySetInnerHTML={{__html: item.label}} style={labelStyle}/>}
							  >
								{
											getFieldDecorator(item.fieldName,{
												initialValue:this.handleInitValue(item),
												rules:[
													{
														required:item.required,
														message:item.label+'必填'
														//message:item.requiredMessage
													},
												]
											})(
												this.getFormItem(item,{})
											)

								}
							</FormItem>
						}
					</Col>

					<Col span={type!==1&&config.labelPosition==='left'?0:1} style={{padding:'10px 4px'}}>
						{
							type===1?<CursorIcon
								type="edit"
								onClick={this.edit}
						    />:null
						}
					</Col>

					<Col span={type!==1&&config.labelPosition==='left'?0:1} style={{padding:'10px 4px'}}>
						{
							type===1?<CursorIcon
								type="delete"
								onClick={this.delete}
							/>:null
						}

					</Col>
				</Row>

    return (
		type===1?
      connectDragSource &&
      connectDropTarget &&
        connectDropTarget(
          connectDragSource(
            <div style={{cursor:`move`}} className={styles.dragStyle}>
				<style>
					{
						`
							.ant-form-item-no-colon .ant-form-item-label label:after{
							}
							.editor{
								height:200px;
							}
							.editor-main{
								height:100px
							}
							.ant-drawer-content-wrapper{
								overflow:auto
							}
						`
					}
				</style>
				{form_data}
            </div>
          )
        ):<div>
				<style>
					{
						`
							.ant-form-item-no-colon .ant-form-item-label label:after{
							}
							.editor{
								height:200px;
							}
							.editor-main{
								height:100px
							}
							.ant-drawer-content-wrapper{
								overflow:auto
							}
						`
					}
				</style>
				{form_data}
            </div>
    )
  }
}
