"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _utils = _interopRequireDefault(require("./utils"));

var _attribute = _interopRequireDefault(require("./attribute"));

var _mian = require("../vdom/mian");

var SetDOM = function SetDOM(jsx, element) {
  jsx._DOM = {
    element: element
  };
  return element;
};

var CreateNode = function CreateNode(value) {
  return document.createTextNode(value);
}; // 生成标签节点


var CreateElement = function CreateElement(jsx) {
  var _context;

  if ((jsx === null || jsx === void 0 ? void 0 : jsx.type) !== 'tag') {
    return document.createTextNode(jsx);
  }

  var node = document.createElement(jsx.name);
  var attributes = jsx.attributes; // 属性处理

  (0, _attribute["default"])(node, attributes); // 节点遍历

  (0, _forEach["default"])(_context = CreateChildren(jsx.children)).call(_context, function (v) {
    if (v instanceof HTMLElement) {
      node.appendChild(v);
    } else if (v instanceof Text) {
      node.appendChild(v);
    } else {
      node.append(_utils["default"].renderNode(v));
    }
  });
  return node;
}; // 遍历子节点


var CreateChildren = function CreateChildren(children) {
  var childList = [];
  children === null || children === void 0 ? void 0 : (0, _forEach["default"])(children).call(children, function (v) {
    var _v;

    var element;

    if (typeof v === 'function') {
      v = v();
    }

    switch ((_v = v) === null || _v === void 0 ? void 0 : _v.type) {
      // 正常标签
      case 'tag':
        element = SetDOM(v, CreateElement(v));
        break;
      // 动态标签

      case 'cynamicTag':
      case 'variable':
        element = CreateElement(_utils["default"].listenChange(v, function (newTag) {
          // 如果是 DOM 结构的更新，则引入 diff 操作，用新生产的节点和页面上的节点做对比
          var newElement = CreateElement(newTag);
          var patches = (0, _mian.Diff)(newElement, element);
          (0, _mian.Patch)(element, patches); // 如果第一个节点就改变了

          if (patches[0] && patches[0][0] && patches[0][0].type === _mian.Patch.REPLACE) {
            element = newElement;
          }
        }));
        break;
      // 字符串

      default:
        element = v;
    }

    childList.push(element);
  });
  return childList;
};

var _default = function _default(jsx, root) {
  var jsxThen = jsx;
  var element;

  if (jsxThen) {
    element = SetDOM(jsxThen, CreateElement(jsxThen));
    root === null || root === void 0 ? void 0 : root.appendChild(element);
  }
};

exports["default"] = _default;