"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _utils = _interopRequireDefault(require("./utils"));

var _main = _interopRequireDefault(require("../../utils/main"));

var NO_VALUE_ATTR = ['disabled', 'checked', 'selected', 'readonly', 'controls']; // {borderWidth: 0} => border-width: 0;

var StyleToCssString = function StyleToCssString(style) {
  var ss = [];

  _main["default"].each(style, function (v, e) {
    ss.push(e.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + v);
  });

  return ss.join('; ');
}; // 属性以 on 并且大写开头处理


var IsEvent = function IsEvent(eventName) {
  return eventName.search(/^on[A-Z]/g) === 0;
};

var _default = function _default(node, attributes) {
  _main["default"].each(attributes, function (v, e) {
    if (IsEvent(e)) {
      // 事件处理
      // 属性以 on 并且大写开头处理
      node.addEventListener(e.substring(2).toLowerCase(), function (event) {
        return v(event);
      }, false);
    } else if ((0, _indexOf["default"])(NO_VALUE_ATTR).call(NO_VALUE_ATTR, e) > -1) {
      // 这些属性需要直接赋值布尔量
      // 用 setAttrubite 是不生效的
      node[e] = _utils["default"].listenChange(v, function (newValue) {
        node[e] = newValue;
      });
    } else if (e === 'style') {
      // style 是个对象，但在赋值操作的时候会直接转成 cssText
      // 并且对象是驼峰命名，所以需要转换一下
      // {borderWidth: 0} => border-width: 0;
      node.style.cssText = StyleToCssString(_utils["default"].listenChange(v, function (newValue) {
        if (node.getAttribute('style') !== newValue) {
          node.style.cssText = StyleToCssString(newValue);
        }
      }));
    } else if (v) {
      // 正常属性赋值操作
      // 如果属性的值是 null 或者 undefined 则删除属性
      node.setAttribute(e, _utils["default"].listenChange(v, function (newValue) {
        if (newValue === null || newValue === undefined) {
          node.removeAttribute(e);
        } else if (node.getAttribute(e) !== newValue) {
          node.setAttribute(e, newValue);
        }
      }));
    }
  });

  return node;
};

exports["default"] = _default;