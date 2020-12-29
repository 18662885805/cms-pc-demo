export const data =  [
  {
    row: [
      {
        col: '',
        colWidth: '100%',
        form: {
          type: 'text',
          field: 'phone',
          label: '手机',
          placeholder: '请输入手机号',
          disabled: false,
          clearable: false,
          autofocus: false,
          autocomplete: 'off',
          rules: [
            { 'required': true, 'message': '请输入手机' },
            {
              'pattern': '^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01345678]|18[0-9]|19[89])\d{8}$',
              'message': '手机格式错误',
              'trigger': 'blur'
            }
          ]
        }
      }
    ]
  }
  [
    {
      row: [
        {
          type: 'text',
          field: 'phone',
          label: '手机',
          placeholder: '请输入手机号',
          disabled: false,
          clearable: false,
          autofocus: false,
          autocomplete: 'off',
          rules: [
            { 'required': true, 'message': '请输入手机' },
            {
              'pattern': '^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01345678]|18[0-9]|19[89])\d{8}$',
              'message': '手机格式错误',
              'trigger': 'blur'
            }
          ]
        }
      ]
    }
  ]
  {
    key: 'goods',
    form: [
      {
        type: 'text',
        field: 'name',
        label: '设备名称',
        placeholder: '请输入设备名称',
        disabled: false,
        clearable: false,
        autofocus: false,
        autocomplete: 'off'
      },
      {
        type: 'text',
        field: 'name',
        label: '设备编号',
        placeholder: '请输入设备编号',
        disabled: false,
        clearable: false,
        autofocus: false,
        autocomplete: 'off'
      },
    ]
  }
]