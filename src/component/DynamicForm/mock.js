export const data =  {
  'formObject': {
      'phone': '',
      'password': '',
      'checkPassword': '',
      'radioExample': '',
      'checkboxExample': [],
      'selectExample': '',
      'selectMultipleExample': [],
      'selectSearchExample': [] if selectMultiple else '',
      'cascaderExample': [],
      'switchExample': False,
      'timeExample': '',
      'dateExample': '',
      'rateExample': None,
      'transferExample': [],
      'uploadExample': []
  },
  'formName': 'formObject',
  'labelWidth': '100px',
  'statusIcon': False,
  'disabled': False,
  'inline': False,
  'formContent': [
      {
          'component': 'input',
          'type': 'text',
          'field': 'phone',
          'label': '手机',
          'placeholder': '手机',
          'prefix': 'iconfont icon-yidongduanicon-',
          'suffix': '',
          'clearable': True,
          'disabled': False,
          'readonly': False,
          'autofocus': False,
          'autocomplete': 'off',

      },
      {
          'component': 'input',
          'type': 'password',
          'field': 'password',
          'label': '',
          'placeholder': '密码',
          'prefix': 'iconfont icon-mima',
          'suffix': 'iconfont icon-mimayincang',
          'clearable': False,
          'disabled': False,
          'readonly': False,
          'autofocus': False,
          'autocomplete': 'off',
      },
      {
          'component': 'input',
          'type': 'password',
          'field': 'checkPassword',
          'label': '',
          'placeholder': '确认密码',
          'prefix': 'iconfont icon-mima',
          'suffix': 'iconfont icon-mimayincang',
          'clearable': False,
          'disabled': False,
          'readonly': False,
          'autofocus': False,
          'autocomplete': 'off',
      },
      {
          'component': 'radio',
          'field': 'radioExample',
          'options': [
              {
                  'id': 1,
                  'title': 'aa',
                  'disabled': False
              },
              {
                  'id': 2,
                  'title': 'bb',
                  'disabled': False
              }
          ]
      },
      {
          'component': 'checkbox',
          'field': 'checkboxExample',
          # 'min': None,
          # 'max': None,
          'disabled': False,
          'readonly': False,
          'options': [
              {
                  'id': 1,
                  'title': 'cc',
                  'disabled': False
              },
              {
                  'id': 2,
                  'title': 'dd',
                  'disabled': False
              },
              {
                  'id': 3,
                  'title': 'ee',
                  'disabled': False
              },
          ]
      },
      {
          'component': 'selectSingle',
          'field': 'selectExample',
          'placeholder': '请选择。。',
          'noMatchText': '无匹配数据..',
          'noDataText': '暂无数据',
          'disabled': False,
          'options': [
              {
                  'id': 1,
                  'title': 'ff',
                  'disabled': True
              },
              {
                  'id': 2,
                  'title': 'gg',
                  'disabled': False
              },
              {
                  'id': 3,
                  'title': 'hh',
                  'disabled': False
              },
          ]
      },
      {
          'component': 'selectMultiple',
          'field': 'selectMultipleExample',
          'placeholder': '请选择。。',
          'noMatchText': '无匹配数据..',
          'noDataText': '暂无数据',
          'disabled': False,
          'options': [
              {
                  'id': 1,
                  'title': 'ff',
                  'disabled': False
              },
              {
                  'id': 2,
                  'title': 'gg',
                  'disabled': False
              },
              {
                  'id': 3,
                  'title': 'hh',
                  'disabled': False
              },
          ]
      },
      {
          'component': 'selectSearch',
          'field': 'selectSearchExample',
          'placeholder': '请选择。。',
          'noMatchText': '无匹配数据..',
          'noDataText': '暂无数据',
          'multiple': True,
          'disabled': False,
          'url': '/account/test/search/'
      },
      {
          'component': 'cascader',
          'field': 'cascaderExample',
          'expandTrigger': 'hover',
          'showAllLevels': True,
          'changeOnSelect': False,
          'filterable': True,
          'props': {
              'value': 'value',
              'label': 'title',
              'children': 'children',
              'disabeld': 'disabled'
          },
          'separator': '/',
          'clearable': True,
          'options': [
              {
                  'value': 1,
                  'title': '江苏省',
                  'disabled': False,
                  'children': [
                      {
                          'value': 2,
                          'title': '苏州市',
                          'disabled': False,
                          'children': [
                              {
                                  'value': 3,
                                  'title': '同里',
                                  'disabled': False
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          'component': 'switch',
          'field': 'switchExample',
          'activeColor': '#13ce66',
          'inactiveColor': '#ff4949',
          'activeText': '',
          'inactiveText': '',
          'disabled': False
      },
      {
          'component': 'time',
          'field': 'timeExample',
          'isRange': True,
          'pickerOptions': {
              'selectableRange': '18:30:00 - 20:30:00',
              'format': 'HH:MM'
          },
          'rangeSeparator': "至",
          'startPlaceholder': "开始时间",
          'endPlaceholder': "结束时间",
          'placeholder': "选择时间范围",
          'clearable': True
      },
      {
          'component': 'date',
          'field': 'dateExample',
          'placeholder': "选择日期范围",
          'clearable': True,
          'rangeSeparator': "至",
          'startPlaceholder': "开始日期",
          'endPlaceholder': "结束日期",
          'type': 'daterange'
      },
      {
          'component': 'rate',
          'field': 'rateExample',
          'placeholder': "选择评分",
          'showText': True,
          'text': ['极差', '失望', '一般', '满意', '惊喜'],
          'colors': ['#99A9BF', '#F7BA2A', '#FF9900'],
          'disabled': False,
          'textColor': '#ff9900'
      },
      {
          'component': 'transfer',
          'field': 'transferExample',
          'filterPlaceholder': '请搜索',
          'props': {
              'key': 'value',
              'label': 'title'
          },
          'titles': ['Source', 'Target'],
          'buttonTexts': [],
          'options': [
              {
                  'value': 1,
                  'title': 'aa',
                  'disabled': False
              },
              {
                  'value': 2,
                  'title': 'bb',
                  'disabled': False
              },
              {
                  'value': 3,
                  'title': 'cc',
                  'disabled': True
              },
          ]
      },
      {
          'component': 'upload',
          'field': 'uploadExample',
          'url': '/account/test/upload/',
          'multiple': True,
          'limit': 5,
          'buttonText': '点击上传',
          'tip': '只能上传jpg/png文件，且不超过500kb',
          'type': '',
          'maxSize': '2',
          'accept': 'image/png,image/jpeg,image/*,.doc,.docx'
      },
  ],
  'button': [
      {
          'type': 'primary',
          'className': {'login-btn': True},
          'method': 'submit',
          'title': '登陆',
          'url': '/api/account/login/'
      }
  ],
  'rules': {
      'phone': [
          {'required': True, 'message': '请输入手机'},
          {
              'pattern': '^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01345678]|18[0-9]|19[89])\d{8}$',
              'message': '手机格式错误',
              'trigger': 'blur'
          }
      ],
      'password': [
          {'required': True, 'message': '请输入密码'},
          {
              'pattern': '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%\^&*\(\)\-\_\=\+\[\];:\'\"\<\,\>\.\/\?\\\|\{\}\~\`])[A-Za-z\d!@#$%\^&*\(\)\-\_\=\+\[\];:\'\"\<\,\>\.\/\?\\\|\{\}\~\`]{10,16}$',
              'message': '密码应由大小写, 特殊字符, 10-16位组成',
              'trigger': 'blur'
          }
      ],
      'checkPassword': [
          {'required': True, 'message': '请再次输入密码'},
          {
              'pattern': '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%\^&*\(\)\-\_\=\+\[\];:\'\"\<\,\>\.\/\?\\\|\{\}\~\`])[A-Za-z\d!@#$%\^&*\(\)\-\_\=\+\[\];:\'\"\<\,\>\.\/\?\\\|\{\}\~\`]{10,16}$',

              'message': '密码应由大小写, 特殊字符, 10-16位组成',
              'trigger': 'blur'
          },
          {
              'validator': 'checkPassord', 'trigger': 'blur'
          }
      ],
      'radioExample': [
          {'required': True, 'message': '请选择单选框'},
      ],
      'checkboxExample': [
          {'required': True, 'message': '请选择多选框'}
      ],
      'selectExample': [
          {'required': True, 'message': '请选择下啦单选'}
      ],
      'selectMultipleExample': [
          {'required': True, 'message': '请选择下啦多选'}
      ],
      'selectSearchExample': [
          {'required': True, 'message': '请选择下啦搜索'}
      ],
      'cascaderExample': [
          {'required': True, 'message': '请选择及联'}
      ],
      'switchExample': [
          {'required': True, 'message': '请选择switch'}
      ],
      'timeExample': [
          {'required': True, 'message': '请选择time'}
      ],
      'dateExample': [
          {'required': True, 'message': '请选择日期'}
      ],
      'rateExample': [
          {'required': True, 'message': '请选择评分'}
      ],
      'transferExample': [
          {'required': True, 'message': '请选择transfer', 'trigger': 'blur'}
      ]
  },
}