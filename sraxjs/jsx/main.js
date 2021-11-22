"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _main = _interopRequireDefault(require("../utils/main"));

var _options = require("../options");

// 创建节点
var CreateNode = function CreateNode(node) {
  return (0, _assign["default"])(node, {
    // 设置父级
    _setParent: function _setParent(p) {
      this.parent = p;
    }
  });
}; // 设置父级


var SetParent = function SetParent(children, parent) {
  children === null || children === void 0 ? void 0 : (0, _forEach["default"])(children).call(children, function (v) {
    if (v !== null && v !== void 0 && v._setParent) {
      v._setParent(parent);
    }
  });
};

var _default = {
  // 创建标签节点
  createElement: function createElement(tagName, attributes) {
    var node;

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (typeof tagName === 'function') {
      // 处理 {...attrs}
      // 可能是多个
      for (var e in attributes) {
        if ((0, _indexOf["default"])(e).call(e, _options.SRAX_JSX_SPREAD_ATTRIBUTE_NAME) === 0) {
          (0, _assign["default"])(attributes, attributes[e]);
          delete attributes[e];
        }
      }

      return tagName(attributes, children);
    } // 处理 {...attrs}
    // 可能是多个


    for (var _e in attributes) {
      if ((0, _indexOf["default"])(_e).call(_e, _options.SRAX_JSX_SPREAD_ATTRIBUTE_NAME) === 0) {
        (function () {
          var spreadAttributes = attributes[_e];

          _main["default"].each(spreadAttributes.value, function (v, e) {
            attributes[e] = {
              type: 'variable',
              value: v,
              change: function change(fn) {
                spreadAttributes.change(function (newValue) {
                  fn(newValue[e]);
                });
              }
            };
          });

          delete attributes[_e];
        })();
      }
    } // 处理异步属性


    for (var _e2 in attributes) {
      if (attributes[_e2] instanceof _promise["default"]) {
        attributes[_e2] = attributes[_e2];
      }
    }

    for (var i = 0, len = children === null || children === void 0 ? void 0 : children.length; i < len; i++) {
      // 节点可能是个数组
      if (children[i] instanceof Array) {
        var _context;

        (0, _splice["default"])(children).apply(children, (0, _concat["default"])(_context = [i, 1]).call(_context, (0, _toConsumableArray2["default"])(children[i])));
        i--;
        len -= 1;
      } // 处理异步节点


      if (children[i] instanceof _promise["default"]) {
        children[i] = children[i];
      }
    }

    node = CreateNode({
      type: 'tag',
      name: tagName,
      attributes: attributes,
      children: children,
      parent: null
    });
    SetParent(children, node);
    return node;
  }
};
exports["default"] = _default;