import React,{Component,Fragment} from 'react';
import {
  Drawer,
  Radio,
  Row,
  Col,
  Divider,
  Affix,
  Checkbox,
  Input,
  Button,
  Slider,
  Form,
  Icon,
  InputNumber,
  Select, message,Upload,Tooltip
} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState,convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import update from 'immutability-helper';
import {SpanLH32,RowMB10} from '../../styled';
import {FormConsume} from '../../Context';
import LabelEditor from './LabelEditor';//编辑label
import FieldNameInput from './FieldNameInput';//编辑fieldName
import RequiredCheckBox from './RequiredCheckBox';//必填复选框
import DataOptions from './DataOptions';//特殊元素选项
import OptionRowShow from './OptionRowShow';//特殊元素选项
import {inject,observer} from 'mobx-react';
import {action,set} from "mobx";
import styles from '../style.css'
import CommonUtil from "@utils/common";

const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
let _util = new CommonUtil();

@inject('store')
@observer
export default class EditingContent extends Component{
  state={
    position:`right`,
    grid_columns:this.props.store.editingData.columns?this.props.store.editingData.columns:[{span:12,list:[]},{span:12,list:[]}],
    fileList2:[]
  };

  positionChange=(e)=>{
    this.setState({position:e.target.value})
  };

  onClose=()=>{
    const {
      props:{
        store,
      }
    }=this;
    store.editing=false;
  };

  componentWillMount() {
    // let {
    //       props:{
    //         store,
    //         store:{
    //           editing:visible,
    //           editingData:{columns,},
    //         },
    //       },
    //     }=this;
    //
    //   let column_info=columns?columns:[{span:12,list:[]},{span:12,list:[]}];
    //
    //   store.editingData.columns=columns?columns:[{span:12,list:[]},{span:12,list:[]}];
  }


    @action handleChange=(e,param)=>{
      const {store}=this.props;
      if(param==='required'){
        store.editingData[param]=e.target.checked;
      }else{
        store.editingData[param]=e.target.value;
      }
    };

  @action handleInfoChange=(e,param)=>{
      const {
      store,
      store:{
        editingData,
        data,
        setInfoData,
      }
    }=this.props;

      console.log('e',e);
      console.log('param',param);

      switch (param) {
        case 'tag_name':
          store.editingData['tag_name']=e.target.value;
          //setInfoData(store.editingData,'tag_name',e.target.value);
        break;
        case 'min':
          store.editingData['min']=e;
          //setInfoData(store.editingData,'min',e);
        break;
        case 'max':
          store.editingData['max']=e;
          //setInfoData(store.editingData,'max',e);
        break;
        case 'tag_color':
          store.editingData['tag_color']=e;
          //setInfoData(store.editingData,'tag_color',e);
        break;
        case 'title_name':
          e.persist();
          store.editingData['title_name']=e.target.value;
          //setInfoData(store.editingData,'title_name',e.target.value);
        break;
        case 'title_level':
          store.editingData['title_level']=e;
          //setInfoData(store.editingData,'title_level',e);
          break;
        case 'title_position':
          store.editingData['title_position']=e;
          //setInfoData(store.editingData,'title_position',e);
          break;
        case 'pic_position':
          store.editingData['pic_position']=e;
          store.count+=1;
          //setInfoData(store.editingData,'title_position',e);
          break;
      }
    };

  @action handleColumnChange=(type,val,index)=>{
      const {store,store:{editingData:{columns},setGridData,}}=this.props;
      let grid_columns=columns?columns:[];

      if(type==='add'){
        grid_columns.push({span:12,list:[]})
      }else if(type==='change'){
        grid_columns[index].span=val
      }else if(type==='minus'){
        grid_columns.splice(val,1)
      }

     setGridData(store.editingData,grid_columns);
      // store.count+=1;

      // setGridData(store.editingData,grid_columns);

      //this.setState(grid_columns);
      //console.log('grid',grid_columns);
      // store.editingData['label']='1';
      store.editingData.columns=grid_columns;
      // const {store:{setGridData}}=this.props;



      //set(store.editingData,'columns',grid_columns)
      // store.editingData.label='2222';
    };

  @action handleBlur=()=>{
    const {
      store:{
        editingData,
        editingData:{
          fieldName
        },
        checkName,
      }
    }=this.props;
    editingData.fieldName=checkName(fieldName,editingData.type,1);
  };

  @action handleFormWidthChange=(param,field)=>{
    const {store}=this.props;
    store.config[field]=param;
    store.count+=1
    //store.config['labelPosition']='left';
  };

  @action orgUpload = (info) => {
      let {fileList} = info;
      const status = info.file.status;
      const {store}=this.props
      //const { formatMessage } = this.props.intl;
      if (status === 'done') {
          message.success(`${info.file.name} 上传成功`)

      } else if (status === 'error') {
          message.error(`${info.file.name} ${info.file.response}.`)
      }
      console.log([fileList[fileList.length-1]]);
      store.editingData['fileList']=[fileList[fileList.length-1]];
      store.editingData['pic_address']=_util.setSourceList([fileList[fileList.length-1]]);
      // store.editingData['pic_address']=_util.setSourceList(fileList);
      // store.editingData['value']=_util.setSourceList([fileList[fileList.length-1]]);
      store.count+=1;
      this.setState({fileList2: fileList})
  };

  render(){
    const {
      props:{
        form,
        store,
        store:{
          editing:visible,
          editingData:{
              type,
              fieldName,
              label,
              required,
              //columns,
              tag_name,
              tag_color,
              title_name,
              title_level,
              title_position,
              min,
              max,
              pic_position,
              fileList
          },
            config
        },
      },
      state:{
        position,
          fileList2
      },
      positionChange,
      setGroupData,
      addGroupData,
      deleteGroupData,
        setGridData,
    }=this;

    let {
      props:{
        store:{
          editingData:{columns,},
        },
      },
    }=this;

    const props2 = {
        multiple: true,
        accept: "image/*",
        action: _util.getServerUrl(`/upload/auth/`),
        headers: {
            Authorization: 'JWT ' + _util.getStorage('token')
        },
      };

    console.log(store.editingData);

    //columns=columns?columns:[{span:12,list:[]},{span:12,list:[]}]

    // this.setState({grid_columns:columns})
    // store.editingData.columns=store.editingData.columns?store.editingData.columns:[{span:12,list:[]},{span:12,list:[]}]
    //
    // const {
    //   props:{
    //     store:{
    //       editingData:{columns,},
    //     },
    //   },
    // }=this;

    return (
      <div
        style={{background:`white`}}
        onClose={this.onClose}
        // mask={false}
        // title={
        //   <RadioGroup
        //     onChange={positionChange}
        //     value={position}
        //     >
        //     <RadioButton value="top">top</RadioButton>
        //     <RadioButton value="right">right</RadioButton>
        //     <RadioButton value="bottom">bottom</RadioButton>
        //     <RadioButton value="left">left</RadioButton>
        //   </RadioGroup>
        // }
        // width={100}
        // height={350}
        // visible={visible}
        // placement={position}
      >
        <p className={styles.editTitle}>表单属性</p>
        <Form
          layout={'vertical'}
          form={form}
          className={styles.formStyle}
        >
          <Form.Item label={'标签对齐方式'}>
            <Radio.Group value={config&&config.labelPosition} buttonStyle="solid" size={'small'} onChange={(e)=>this.handleFormWidthChange(e.target.value,'labelPosition')}>
              <Radio.Button value="left">左对齐</Radio.Button>
              <Radio.Button value="right">右对齐</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="标签宽度">
            <InputNumber min={1} max={12} style={{width:'103px'}} value={config&&config.labelWidth} onChange={(value)=>this.handleFormWidthChange(value,'labelWidth')}/>
          </Form.Item>
        </Form>

        <p className={styles.editTitle}>字段属性</p>
        <Form
          layout={'vertical'}
          form={form}
          className={styles.formStyle}
          // initialValues={{ layout: 'vertical' }}
          // onValuesChange={onFormLayoutChange}
        >
        {/*<Form.Item label="Form Layout" name="layout">*/}
          {/*<Radio.Group value={formLayout}>*/}
            {/*<Radio.Button value="horizontal">Horizontal</Radio.Button>*/}
            {/*<Radio.Button value="vertical">Vertical</Radio.Button>*/}
            {/*<Radio.Button value="inline">Inline</Radio.Button>*/}
          {/*</Radio.Group>*/}
        {/*</Form.Item>*/}

        {/*<Form.Item label="传值字段">*/}
          {/*<Input placeholder="输入传入后台字段名称" value={fieldName} onChange={(e)=>this.handleChange(e,'fieldName')}*/}
        {/*onBlur={this.handleBlur}/>*/}
        {/*</Form.Item>*/}

          {
            type!=='typography'&&type!=='logo'?
                <Fragment>
                  <Form.Item label="标签">
                    <Input style={{width:'103px'}} placeholder="输入标签" value={label} onChange={(e)=>this.handleChange(e,'label')}/>
                  </Form.Item>

                  <Form.Item label="是否必填">
                      <Checkbox
                        checked={required}
                        onChange={(e)=>this.handleChange(e,'required')}>
                        必填
                      </Checkbox>
                  </Form.Item>
                </Fragment>:null
          }

          {type===`checkboxGroup`||type===`radio`||type===`select`?
            <Fragment>
              <Form.Item label="选项">
                <DataOptions />
              </Form.Item>

              {type == `checkboxGroup` || type == `radio` ?
                  <Fragment>
                    <Form.Item label="每行展示数量" style={{marginTop:'-10px'}}>
                      <OptionRowShow/>
                    </Form.Item>
                  </Fragment>:null
              }
            </Fragment> :

            type==='grid'?
            <Form.Item label={
                <span>
              列配置项&nbsp;
              <Tooltip title="总和不超过24">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
            } name="layout">
              {columns&&columns.map((val,index)=>{
                if(val){
                  return(<Row key={index}>
                    <Col span={20}><InputNumber value={val.span} style={{width:'90%'}} onChange={(val)=>this.handleColumnChange('change',val,index)}/></Col>
                    <Col span={4}><Icon type={'minus'} onClick={()=>this.handleColumnChange('minus',index)}/></Col>
                  </Row>)
                }
              })}

              {/*<Tooltip title="列数总和不超过24">*/}
                  <Button type="link" onClick={()=>this.handleColumnChange('add')}>添加列</Button>
              {/*</Tooltip>*/}
                  {/*<Radio.Group value={formLayout}>*/}
                {/*<Radio.Button value="horizontal">Horizontal</Radio.Button>*/}
                {/*<Radio.Button value="vertical">Vertical</Radio.Button>*/}
                {/*<Radio.Button value="inline">Inline</Radio.Button>*/}
              {/*</Radio.Group>*/}
            </Form.Item>:
            type==='tag'?
            <Fragment>
               <Form.Item label="标签名称">
                 <Input placeholder="请输入" value={tag_name} onChange={(e)=>this.handleInfoChange(e,'tag_name')}/>
               </Form.Item>
              <Form.Item label="标签颜色">
                <Select value={tag_color} onChange={(value)=>this.handleInfoChange(value,'tag_color')}>
                  <Option value="#f50">红色</Option>
                  <Option value="#2db7f5">浅蓝</Option>
                  <Option value="#87d068">绿色</Option>
                  <Option value="#108ee9">深蓝</Option>
                </Select>
              </Form.Item>
            </Fragment>:
            type==='inputNumber'?
            <Fragment>
               {/*<Form.Item label="最小值">*/}
                 {/*<InputNumber value={min} onChange={(e)=>this.handleInfoChange(e,'min')}/>*/}
               {/*</Form.Item>*/}
               {/*<Form.Item label="最大值">*/}
                 {/*<InputNumber value={max} onChange={(e)=>this.handleInfoChange(e,'max')}/>*/}
               {/*</Form.Item>*/}
            </Fragment>:
            type==='typography'?
            <Fragment>
                 <Form.Item label="文本内容">
                   <Input placeholder="请输入" value={title_name} onChange={(e)=>this.handleInfoChange(e,'title_name')}/>
                 </Form.Item>

                <Form.Item label="字号">
                  <Select value={title_level} onChange={(value)=>this.handleInfoChange(value,'title_level')}>
                    <Option value={1}>h1</Option>
                    <Option value={2}>h2</Option>
                    <Option value={3}>h3</Option>
                    <Option value={4}>h4</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="标题对齐方式">
                  <Select value={title_position} onChange={(value)=>this.handleInfoChange(value,'title_position')}>
                    <Option value={'left'}>靠左</Option>
                    <Option value={'center'}>居中</Option>
                    <Option value={'right'}>靠右</Option>
                  </Select>
                </Form.Item>
            </Fragment>:
            type==='logo'?
            <Fragment>
              <FormItem
                  label={'logo'}
                  extra={'请最多上传一张图片'}
              >
                  <Upload
                    {...props2}
                      fileList={fileList}
                    // fileList={fileList2}
                    beforeUpload={_util.beforeUpload}
                    onChange={this.orgUpload}
                    //customRequest={this.fileUpload}
                    accept='image/*'
                    //onRemove={this.handleRemove}
                  >
                  <Button>
                      <Icon type="upload" />上传
                  </Button>
                  </Upload>
              </FormItem>

              <Form.Item label="logo对齐方式">
                  <Select value={pic_position} onChange={(value)=>this.handleInfoChange(value,'pic_position')}>
                    <Option value={'left'}>靠左</Option>
                    <Option value={'center'}>居中</Option>
                    <Option value={'right'}>靠右</Option>
                  </Select>
                </Form.Item>
            </Fragment>:
                null
          }

        </Form>
      </div>
    )
  }
}
