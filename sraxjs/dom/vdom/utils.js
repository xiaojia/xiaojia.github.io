"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _options = require("../../options");

var _default = {
  // 表单元素
  isFormElements: function isFormElements(v) {
    switch (v) {
      case 'input':
      case 'select':
      case 'textarea':
      case 'button':
        return true;
    }

    ;
    return false;
  },
  // 获取DOM下的所有元素, 移除所有空格
  getChildren: function getChildren(element) {
    var child = [];
    var childNodes = element.childNodes;

    for (var i = 0, len = childNodes.length; i < len; i++) {
      switch (childNodes[i].nodeType) {
        case 3:
          if (childNodes[i].nodeValue || childNodes[i].textContent) {
            child.push(childNodes[i]);
          }

          break;

        case 1:
          child.push(childNodes[i]);
          break;

        default:
      }
    }

    return child;
  },
  // 获取元素的唯一标识
  getItemSign: function getItemSign(item) {
    if (item && item.nodeType === 1) {
      return item.getAttribute(_options.VDOM_LIST_KEY);
    }

    return undefined;
  },
  // 是否跳过diff
  getSkip: function getSkip(item) {
    var skip;

    if (item && item.nodeType === 1) {
      skip = item.getAttribute(_options.VDOM_SKIP_KEY);
      return skip !== null && skip === 'true';
    }

    return undefined;
  },
  // 设置元素的属性
  setAttr: function setAttr(node, key, value) {
    var _this = this;

    var tagName;

    var setValue = function setValue() {
      tagName = node.tagName || '';
      tagName = tagName.toLowerCase(); // 如果是表单元素

      if (_this.isFormElements(tagName)) {
        node.value = value;
      } // 表单元素除了赋值给 .value 属性外，还要更新 attribute


      node.setAttribute(key, value);
    };

    switch (key) {
      case 'style':
        node.style.cssText = value;
        break;

      case 'class':
        node.className = value;
        break;

      case 'value':
        setValue();
        break;

      default:
        node.setAttribute(key, value);
    }
  }
};
exports["default"] = _default;