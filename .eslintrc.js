module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "plugins": ['react'],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "legacyDecorators": true
    }
  },
  "rules": {
    "indent": ["error", 2],   // 使用两个空格作缩进
    "linebreak-style": [0, "windows"],  // 换行风格
    "quotes": [1, "double"],// 推荐双引号（引号类型 `` "" ''）
    "semi": ["error", "always"], // 以分号结尾
    "no-dupe-args": 2,           // 函数参数不能重复
    "no-labels": 2,              // 禁止标签声明
    "no-eq-null": 2,             // 禁止对null使用==或!=运算符
    "no-eval": 1,                // 禁止使用eval
    "no-extra-boolean-cast": 1,  // 禁止不必要的bool转换
    "no-fallthrough": 1,         // 禁止switch穿透
    "no-func-assign": 2,         // 禁止重复的函数声明
    "no-implied-eval": 2,        // 禁止使用隐式eval
    "no-irregular-whitespace": 1,// 不规则的空白不允许
    "no-trailing-spaces": 1,     // 一行结束后面有空格就发出警告
    "no-mixed-spaces-and-tabs": 0, // 禁止混用tab和空格
    "no-multi-spaces": 1,        // 不允许键和值之间存在多个空格
    "no-multiple-empty-lines": [1, {"max": 2}],
    "no-redeclare": 2,          // 禁止重复声明变量
    "no-self-compare": 2,       // 不能比较自身
    "no-undef": 1,              // 不能有未定义的变量
    "no-unneeded-ternary": 2,   // 禁止不必要的嵌套
    "no-use-before-define": 2,  // 未定义前不能使用
    "no-var": 0,                // 对var警告
    "eqeqeq": 2,                // 必须使用全等
    "import/no-amd": 0,         // 允许 amd 导入风格
    "import/no-commonjs": 0,    // 允许 commonjs 风格
    "react/jsx-key": 2,         // 循环元素必须有key
    "no-console": 1,            // 上线的代码里不允许有 console
    "no-alert": 2,              // 上线版本禁止alert confirm prompt
    "no-debugger": 2,           // 上线版本禁止debugger
    "no-empty-function": ['error', {allow: ['arrowFunctions']}], // 不允许空函数
    "react/no-render-return-value": 2,      // render 必须有返回值
    "react/prop-types": 0,      // 防止在React组件定义中丢失props验证
    "react/display-name": 0,    // 防止在React组件定义中丢失displayName
    "react/no-deprecated": 1,   // 不使用弃用的方法
    "no-unreachable": 1,        // 不能有无法执行的代码
    "comma-dangle": 2,          // 对象字面量项尾不能有逗号
    "no-unused-vars": [1, { "vars": "all", "args": "after-used" }]  // 不能有声明后未被使用的变量或参数
  }
}
