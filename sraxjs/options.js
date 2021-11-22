"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.VDOM_SKIP_KEY = exports.VDOM_LIST_KEY = exports.SRAX_JSX_SPREAD_ATTRIBUTE_NAME = void 0;
// 虚拟 dom 下，循环时的 key
var VDOM_LIST_KEY = 'key'; // 虚拟 dom 下，跳过 diff 的 key

exports.VDOM_LIST_KEY = VDOM_LIST_KEY;
var VDOM_SKIP_KEY = 'skip'; // 处理 {...attrs} 变量时临时存储的值

exports.VDOM_SKIP_KEY = VDOM_SKIP_KEY;
var SRAX_JSX_SPREAD_ATTRIBUTE_NAME = 'srax-jsx-spread-attribute-';
exports.SRAX_JSX_SPREAD_ATTRIBUTE_NAME = SRAX_JSX_SPREAD_ATTRIBUTE_NAME;