import {observable,action,set} from 'mobx';
import { EditorState, convertToRaw, ContentState,convertFromHTML } from 'draft-js';
import CommonUtil from "@utils/common";
let _util = new CommonUtil();

export default class Store {
  editField;
  form;
  index=0;
  
  @observable editorState=EditorState.createEmpty();
  @observable submitUrl = ''; //测试提交|提交地址
  @observable data = []; //元素
  @observable config = {labelWidth:4,labelPosition:'right'}; //表单配置
  @observable count=0;
  @observable design=false; //设计者模式
  @observable developer=false; //开发者模式
  @observable editingData = {}; //元素
  @observable editing=true;//编辑状态
  @observable elementTypes = [//元素类型
    {
      type: `input`,
      name: `单行文本`,
      demo: true,
      icon:'edit',
      level:1,
      // value:'',
    },
    {
      type: `textarea`,
      name: `多行文本`,
      demo: true,
      icon:'ordered-list',
      level:1
    },
    {
      type: `radio`,
      name: `单选框组`,
      demo: true,
      icon:'check-circle',
      level:1,
      // value:"",
    },
    // {
    //   type: `checkbox`,
    //   name: `多选框`,
    //   demo: true,
    //   icon:'edit'
    // },
    {
      type: `checkboxGroup`,
      name: `多选框组`,
      demo: true,
      icon:'check-square',
      level:1
    },
      {
      type: `datePicker`,
      name: `日期选择器`,
      demo: true,
      icon:'calendar',
        level:1
    },
      {
      type: `timePicker`,
      name: `时间选择器`,
      demo: true,
      icon:'hourglass',
        level:1
    },
    {
      type: `select`,
      name: `下拉选择框`,
      demo: true,
      icon:'down-square',
      level:1
    },
      {
      type: `inputNumber`,
      name: `数字`,
      demo: true,
      icon:'calculator',
        level:1
    },
      {
      type: `tag`,
      name: `标签`,
      demo: true,
      icon:'tag',
        tag_name:'标签名',
        tag_color:"",
        level:1
    },
    // {
    //   type: `transfer`,
    //   name: `穿梭框`,
    //   demo: true,
    //   icon:'double-right',
    //   level:1
    // },
      {
      type: `typography`,
      name: `文本`,
      demo: true,
      icon:'file-text',
        level:2,
        title_name:"标题",
        title_level:1,
        title_position:'center'
    },
    //   {
    //   type: `logo`,
    //   name: 'logo',
    //   demo: true,
    //   icon:'smile',
    //   level:2,
    //   pic_address:[],
    //     pic_position:'right'
    // },
      {
      type: `logo`,
      name: 'logo',
      demo: true,
      icon:'smile',
      level:2,
      pic_address:[],
        pic_position:'right'
    },
      {
      type: `upload`,
      name: `附件`,
      demo: true,
      icon:'picture',
        level:2,
        value:[],
    },
    //   {
    //   type: `input`,
    //   name: 'logo',
    //   demo: true,
    //   icon:'sketch',
    //     level:2
    // },
    //   {
    //   type: `input`,
    //   name: `级联区域`,
    //   demo: true,
    //   icon:'pull-request',
    //     level:2
    // },
      {
      type: `grid`,
      name: `栅格布局`,
      demo: true,
      icon:'table',
      columns:undefined,
      //columns:[{span:12,list:[]},{span:12,list:[]}],
      level:3
    },
  ];

  @observable upperTypes = [//元素类型
    {
      type: `input`,
      name: `图片`,
      demo: true,
      icon:'picture'
    },
      {
      type: `input`,
      name: `文本`,
      demo: true,
      icon:'file-text'
    },
      {
      type: `input`,
      name: 'logo',
      demo: true,
      icon:'sketch'
    },
      {
      type: `input`,
      name: `级联区域`,
      demo: true,
      icon:'pull-request',
    },
];

  @observable gridTypes = [//元素类型
    {
      type: `grid`,
      name: `栅格布局`,
      demo: true,
      icon:'table'
    },
];

  @action checkType=(item)=>{//检查元素类型赋予功能
    const {
      type,
    }=item;
    set(item,'required',false);
    set(item,'requiredMessage','');
    if(type==`checkboxGroup`||type==`radio`||type==`select`){
      set(item,'options',[
        {label: 'default1', value: 'default1Value'},
        {label: 'default2', value: 'default2Value'}
      ]);
      if(type==`checkboxGroup`||type==`radio`){
        set(item,'optionRowShow',3);
      }
    }
  };

  getIndex=(data)=>{//获取元素索引
    return this.data.indexOf(data);
  };

  getGridIndex=(data)=>{
    console.log(data);
    let gridIndex=[];
    this.data.map((items,i)=>{
      if(items.columns&&items.columns.length>0){
        items.columns.map((item,j)=>{
          if(item.list[0]&&item.list[0].fieldName===data.fieldName){
            gridIndex.push(i,j)
          }
        })
      }
    });
    return gridIndex
  };

  @action setDownElement=(element)=>{//稳定元素
    console.log('setDown',element);
    if(element&&element.demo){
      // console.log('demo')
      delete element.demo;
      const newDemo={...element,demo:true};
      const index=this.elementTypes.indexOf(element);
      this.elementTypes.splice(index,1);
      this.elementTypes.splice(index,0,newDemo);
      this.elementTypes=[...this.elementTypes];
    }
  };

  checkName=(str,type,l=0)=>{
    const exsit=this.data.filter(e=>e.fieldName==str).length>l;
    if(exsit){
      this.index++;
      str=`${type}${this.index}`;
      str=this.checkName(str,type);
    }
    return str;
  };

  @action addElement=(item)=>{//点击添加元素
    console.log('addE',item);
    const flC=`${item.type}${this.index}`;
    const fl=this.checkName(flC,item.type);
    const copyItem=observable({...item,fieldName:fl,label:fl,demo:false});
    this.checkType(copyItem);
    // console.log(copyItem);
	this.data=[...this.data,copyItem];
	this.editingShow(copyItem);
    this.index++;
  };

  @action createElement=(dragItem,hoverIndex,hoverItem)=>{//生成元素
    const flC=`${dragItem.type}${this.index}`;
    const fl=this.checkName(flC,dragItem.type);
    set(dragItem,'fieldName',fl);
    set(dragItem,'label',fl);
     console.log('dragItem',dragItem);
     console.log('hoverItem',hoverItem);
     console.log('data',this.data);
    this.checkType(dragItem);
    this.index++;
    console.log('dataFilter',this.data.filter(a=>a.fieldName===hoverItem.fieldName)[0]);
    // this.data.splice(hoverIndex, 0, dragItem);
    // this.data.splice(hoverIndex, 1);
    if(hoverItem.type==='grid'){
      if(dragItem.type!=='grid'){
          let minArray=[];
          this.data.filter(a=>a.fieldName===hoverItem.fieldName)[0].columns&&
          this.data.filter(a=>a.fieldName===hoverItem.fieldName)[0].columns.map((val,index)=>{
            if (!val.list[0]) {
              minArray.push(index)
            }
          });

          let exist=false;
          this.data.filter(a=>a.fieldName===hoverItem.fieldName)[0].columns&&
          this.data.filter(a=>a.fieldName===hoverItem.fieldName)[0].columns.map((val,index)=>{
            if (val.list[0] &&  val.list[0].fieldName===dragItem.fieldName) {
              exist=true;
              return false
            }
          });

          if(minArray.length>0&&!exist){
            this.data.filter(a=>a.fieldName===hoverItem.fieldName)[0].columns[minArray[0]].list[0]=dragItem;
            // let newDemo={
            //   type: `grid`,
            //   name: `栅格布局`,
            //   demo: true,
            //   icon:'table',
            //   columns:[{span:12,list:[]},{span:12,list:[]}],
            //   level:3
            // };
            // this.elementTypes.splice(this.elementTypes.map(a=>a.type).indexOf('grid'),1,newDemo);

            //this.elementTypes=[...this.elementTypes];
            //this.elementTypes.filter(a=>a.type==='grid')[0].columns=[{span:12,list:[]},{span:12,list:[]}];
            this.editingShow(dragItem);
          }
      }else{
        this.data.splice(hoverIndex, 0, dragItem);
        this.editingShow(dragItem);
      }
    }else{
      this.data.splice(hoverIndex, 0, dragItem);
      this.editingShow(dragItem);
    }

  };

  @action moveElement=( dragIndex, hoverIndex)=>{//移动元素
    const { data } = this;
	const dragCard = data[dragIndex];
    const hoverCard = data[hoverIndex];
    data.splice(dragIndex, 1);
    data.splice(hoverIndex, 0, dragCard);
  };

  @action editingShow=(data)=>{
    console.log('editingShow',data);
    this.editing=true;
    this.editingData=data;
    this.setEditState(data)
  };

  @action deleteItem=(item)=>{
    const i=this.getIndex(item);
    this.data.splice(i,1);
    console.log(this.data)
  };

  @action deleteGridItem=(name,index)=>{
    this.data.filter(a=>a.fieldName===name)[0].columns[index].list=[];
    this.count+=1;
    //set(this.data.filter(a=>a.fieldName===name)[0].columns[index],'list',undefined)
    //this.editingData.columns.splice(index,1);
    // splice(index,1);
    // const i=this.getIndex(item);
    // this.data.indexOf(data);
    // this.data.splice(i,1);
  };

  @action setDataValue=(value,field,item)=>{
    if(item){
      this.data[this.data.map(a=>a.fieldName).indexOf(item[1])].columns[item[0]].list[0].value=value;
    }else{
      // 上传格式
      // if(value&&value[0].uid){
      //   this.data[this.data.map(a=>a.fieldName).indexOf(field)].fileList=value;
      //   this.data[this.data.map(a=>a.fieldName).indexOf(field)].value=JSON.stringify(_util.setSourceList(value));
      // }else{
        this.data[this.data.map(a=>a.fieldName).indexOf(field)].value=value;
      // }
    }
    this.count+=1;
    console.log(this.data);
    //this.data[this.data.map(a=>a.fieldName).indexOf(field)].value=value;

    //const i=this.getIndex(item);
    //this.data.splice(i,1,item);
    //this.data.pop();
    //this.editingData[field]=value;
    //this.data.filter(a=>a.fieldName===field)[0].value=value;
  };

   @action setUploadValue=(value,field,item)=>{
    if(item){
      this.data[this.data.map(a=>a.fieldName).indexOf(item[1])].columns[item[0]].list[0].fileList=value;
      this.data[this.data.map(a=>a.fieldName).indexOf(item[1])].columns[item[0]].list[0].value=_util.setSourceList(value);
       //this.data[this.data.map(a=>a.fieldName).indexOf(item[1])].columns[item[0]].list[0].value=JSON.stringify(_util.setSourceList(value));
    }else{
         this.data[this.data.map(a=>a.fieldName).indexOf(field)].fileList=value;
         this.data[this.data.map(a=>a.fieldName).indexOf(field)].value=_util.setSourceList(value);
         // this.data[this.data.map(a=>a.fieldName).indexOf(field)].value=JSON.stringify(_util.setSourceList(value));
    }
    this.count+=1;
    console.log(this.data);
  };

  @action setEditingData=(field,value)=>{
    this.editingData[field]=value;
  };

  @action setInfoData=(data,field,val)=>{
    const i=this.getIndex(data);
    //set(this.data[i],'tag_name',val)
    this.data[i][field]=val;
    // this.editingData[field]=val;
  };

  @action setEditState=(data)=>{//富文本
    let editorState;
    const newContent=convertFromHTML(data.label);
    if (!newContent.contentBlocks) {
      editorState = EditorState.createEmpty();
    }else{
      const contentState = ContentState.createFromBlockArray(newContent);
      editorState=EditorState.createWithContent(contentState);
    }
    this.editorState=editorState;
  }

  @action setGroupData=(data,field,index,gpfield,value)=>{
    const i=this.getIndex(data);
    const j=this.getGridIndex(data);
    if(i>-1){
      this.data[i][field][index][gpfield]=value;
    }else if(j.length>-1){
      this.data[j[0]].columns[j[1]].list[0][field][index][gpfield]=value
    }
  };

  // 修改grid的column
  @action setGridData=(data,value)=>{
    const i=this.getIndex(data);
    this.data.splice(i,1,data);

    //this.data[i].columns=value;
    //this.editingData=data;
    // data.columns=value;
    //set(this.data[i],'columns',value);
    //this.data=[...this.data];
  };

  @action addGroupData=(data,field,index,insertData)=>{
    const i=this.getIndex(data);
    const j=this.getGridIndex(data);
    console.log(i);
    if(i>-1){
       this.data[i][field].splice(index+1,0,insertData)
    }else if(j.length>-1){
      this.data[j[0]].columns[j[1]].list[0][field].splice(index+1,0,insertData)
    }
  };

  @action deleteGroupData=(data,field,index)=>{
    const i=this.getIndex(data);
    const j=this.getGridIndex(data);
    if(i>-1){
      this.data[i][field].splice(index,1)
    }else if(j.length>-1){
      this.data[j[0]].columns[j[1]].list[0][field].splice(index,1)
    }
  };

  @action init({design,data:{data=[],submitUrl,index=0,config},developer}){
    this.design=design;
    this.developer=developer;
    this.data=data;
    this.submitUrl=submitUrl;
    this.index=Number(index);
    this.config=config
  }

  // @action init({design,data:{data=[],submitUrl,index=0},developer}){
  //   this.design=design;
  //   this.developer=developer;
  //   this.data=data;
  //   this.submitUrl=submitUrl;
  //   this.index=Number(index);
  // }
}
