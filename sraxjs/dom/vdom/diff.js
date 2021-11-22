"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _utils = _interopRequireDefault(require("./utils"));

var _patch = _interopRequireDefault(require("./patch"));

var _list = require("./list");

// 判断是否是同元素
var CompareNode = function CompareNode(newElmeent, oldElement) {
  var newTagName = newElmeent.tagName || '';
  var oldTagName = oldElement.tagName || '';
  return newTagName === oldTagName && _utils["default"].getItemSign(newElmeent) === _utils["default"].getItemSign(oldElement);
};

var AttributeToObject = function AttributeToObject(element) {
  var attr = element.attributes;
  var props = {};
  var tagName = (element.tagName || '').toLowerCase();
  var privateAttrs = ['complete'];

  for (var i = 0, len = attr.length; i < len; i++) {
    var name = attr[i].name;

    if ((0, _indexOf["default"])(privateAttrs).call(privateAttrs, name) === -1) {
      props[name] = attr[i].value;
    }
  }

  if (element.style.cssText) {
    props.style = element.style.cssText;
  } // 如果是表单元素


  if (_utils["default"].isFormElements(tagName)) {
    props.value = element.value;
  }

  return props;
};

var DiffAttribute = function DiffAttribute(newElement, oldElement) {
  var newAttributes = AttributeToObject(newElement);
  var oldAttributes = AttributeToObject(oldElement);
  var value;
  var count = 0;
  var propsPatches = {};

  for (var key in oldAttributes) {
    value = oldAttributes[key];

    if (newAttributes[key] !== value) {
      count++;
      propsPatches[key] = newAttributes[key];
    }
  }

  for (var _key in newAttributes) {
    value = newAttributes[_key];

    if (!oldAttributes.hasOwnProperty(_key)) {
      count++;
      propsPatches[_key] = newAttributes[_key];
    }
  }

  if (count === 0) {
    return null;
  }

  return propsPatches;
}; // 获取所有节点


var GetNodesLength = function GetNodesLength(nodes) {
  var count = 0;

  var childNodes = _utils["default"].getChildren(nodes);

  for (var i = 0, len = childNodes.length; i < len; i++) {
    count++;
    count += GetNodesLength(childNodes[i]);
  }

  return count;
}; // diff子元素, 进行排序, 删除, 添加操作


var DiffChildren = function DiffChildren(newChildren, oldChildren, patches, index, currentPatch) {
  var diffs = (0, _list.DiffList)(newChildren, oldChildren);
  var reorderPatch;
  var count = 0;
  var leftNode = null;
  var currentNodeIndex = index;
  newChildren = diffs.children;

  if (diffs.moves.length) {
    reorderPatch = {
      type: _patch["default"].REORDER,
      moves: diffs.moves
    };
    currentPatch.push(reorderPatch);
  }

  for (var i = 0, len = oldChildren.length; i < len; i++) {
    var newChild = newChildren[i];
    var oldChild = oldChildren[i];
    /* eslint-disable no-cond-assign */

    if (leftNode && (count = GetNodesLength(leftNode))) {
      currentNodeIndex += count + 1;
    } else {
      currentNodeIndex += 1;
    } // 是否跳过diff


    var newSkip = _utils["default"].getSkip(newChild);

    var oldSkip = _utils["default"].getSkip(oldChild);

    if (oldSkip && newSkip) {
      leftNode = oldChild;
      continue;
    }

    Walk(newChild, oldChild, patches, currentNodeIndex);
    leftNode = oldChild;
  }
};

var Walk = function Walk(newElement, oldElement, patches, index) {
  if (!newElement) {
    return patches;
  }

  var currentPatch = [];
  var newNodeType = newElement.nodeType;
  var oldNodeType = oldElement.nodeType; // text 替换

  if (newNodeType === 3 && oldNodeType === 3) {
    var newElementValue = newElement.nodeValue || newElement.textContent;
    var oldElementValue = oldElement.nodeValue || oldElement.textContent;

    if (oldElementValue !== newElementValue) {
      currentPatch.push({
        type: _patch["default"].TEXT,
        content: newElementValue
      });
    }
  } else if (CompareNode(newElement, oldElement)) {
    // 是否跳过diff
    var newSkip = _utils["default"].getSkip(newElement);

    var oldSkip = _utils["default"].getSkip(newElement); // DIFF子元素


    if (!(oldSkip && newSkip)) {
      // 判断属性
      var patchAttribute = DiffAttribute(newElement, oldElement);

      if (patchAttribute) {
        currentPatch.push({
          type: _patch["default"].PROPS,
          props: patchAttribute
        });
      }

      DiffChildren(_utils["default"].getChildren(newElement), _utils["default"].getChildren(oldElement), patches, index, currentPatch);
    }
  } else {
    // 做替换操作
    currentPatch.push({
      type: _patch["default"].REPLACE,
      node: newElement
    });
  }

  if (currentPatch.length) {
    patches[index] = currentPatch;
  }

  return patches;
};

var _default = function _default(newElement, oldElement) {
  return Walk(newElement, oldElement, {}, 0);
};

exports["default"] = _default;