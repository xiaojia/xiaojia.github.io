"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.RenderContext = exports.CreateJSXExpression = exports.CreateFunctionParamInterceptor = exports.CreateFunctionContext = void 0;

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _main = _interopRequireDefault(require("../../utils/main"));

// 全局上下文
var FunctionContext = {}; // 链表形式的上下文

var RenderContext = {
  list: [],
  currentIndex: 0,
  initial: function initial(value) {
    this.list[this.currentIndex] = value;
    return this;
  },
  get: function get() {
    return FunctionContext[this.list[this.currentIndex]];
  },
  next: function next() {
    this.currentIndex++;
    return this;
  },
  prev: function prev() {
    this.currentIndex--;
    return this;
  }
};
exports.RenderContext = RenderContext;

var CreateFunctionParamInterceptor = function CreateFunctionParamInterceptor(value, fn) {
  _main["default"].each(value, function (v, i) {
    if (v.context && v.onChange) {
      value[i] = v.value;
      v.onChange(function (newValue) {
        fn(value);
        value[i] = newValue;
      });
    }
  });

  return value;
}; // srax 函数上下文


exports.CreateFunctionParamInterceptor = CreateFunctionParamInterceptor;

var CreateFunctionContext = function CreateFunctionContext() {
  var key = (0, _symbol["default"])(); // 防止出现第一位是空值

  if (RenderContext.list.length) {
    RenderContext.next();
  } // 初始化


  RenderContext.initial(key);
  return FunctionContext[key] = {
    key: key,
    type: 'SraxFunctionContext',
    state: [],
    variable: [],
    JSX: function JSX(jsx) {
      // 执行完则返回上一层
      RenderContext.prev(); // 保存上下文

      jsx.context = this;
      return jsx;
    },
    change: function change() {
      var _context;

      (0, _forEach["default"])(_context = this.variable).call(_context, function (fn) {
        fn();
      });
    },
    onChange: function onChange(fn) {
      this.variable.push(fn);
    }
  };
}; // JSX 标签内的 {} 表达式


exports.CreateFunctionContext = CreateFunctionContext;

var CreateJSXExpression = function CreateJSXExpression(fn) {
  var value = fn();
  var context = RenderContext.get(); // 如果没有上下文

  if (!context) {
    return value;
  } // 兼容以下写法
  // <div>{() => {return value;}}</div>


  if (typeof value === 'function') {
    return CreateJSXExpression(value);
  } // 防止嵌套


  if ((value === null || value === void 0 ? void 0 : value.type) === 'variable') {
    return value;
  }

  if (value !== null && value !== void 0 && value.context) {
    _main["default"].error('### 这是一个有状态的函数，请用标签形式调用 <FunctationName attr="" {...attrs} />');
  }

  return {
    type: 'variable',
    onChange: function onChange(callback) {
      var _this = this;

      context.onChange(function () {
        return callback(_this.value = fn());
      });
    },
    context: context,
    value: value
  };
};

exports.CreateJSXExpression = CreateJSXExpression;