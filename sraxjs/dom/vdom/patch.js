"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _utils = _interopRequireDefault(require("./utils"));

var REPLACE = 'replace';
var REORDER = 'reorder';
var PROPS = 'props';
var TEXT = 'text';
var REMOVE = 'remove';
var INSERT = 'insert'; // 对子元素的排序

var ReorderChildren = function ReorderChildren(node, moves) {
  var staticNodeList = _utils["default"].getChildren(node);

  var maps = {};

  for (var i = 0, len = staticNodeList.length; i < len; i++) {
    var nodeItem = staticNodeList[i];

    if (nodeItem.nodeType === 1) {
      var key = _utils["default"].getItemSign(nodeItem);

      if (key) {
        maps[key] = nodeItem;
      }
    }
  }

  for (var _i = 0, _len = moves.length; _i < _len; _i++) {
    var move = moves[_i];
    var index = move.index;

    var childNodes = _utils["default"].getChildren(node);

    var insertNode = void 0;

    if (move.type === REMOVE) {
      if (staticNodeList[index] === childNodes[index]) {
        node.removeChild(childNodes[index]);
      }

      (0, _splice["default"])(staticNodeList).call(staticNodeList, index, 1);
    } else if (move.type === INSERT) {
      var _key = _utils["default"].getItemSign(move.item);

      if (maps[_key]) {
        insertNode = maps[_key];
      } else {
        insertNode = move.item;
      }

      (0, _splice["default"])(staticNodeList).call(staticNodeList, index, 0, insertNode);
      node.insertBefore(insertNode, childNodes[index] || null);
    }
  }
}; // 设置属性, 如果为 undefined 则移除属性


var SetProps = function SetProps(node, props) {
  for (var key in props) {
    if (props[key] === undefined) {
      node.removeAttribute(key);
    } else {
      _utils["default"].setAttr(node, key, props[key]);
    }
  }
}; // 针对DOM做对应的修改


var ApplyPatches = function ApplyPatches(node, currentPatches, walker) {
  for (var i = 0, len = currentPatches.length; i < len; i++) {
    var currentPatch = currentPatches[i];

    switch (currentPatch.type) {
      case REPLACE:
        var newNode = currentPatch.node;
        var replaceChild = newNode;
        node.parentNode.replaceChild(replaceChild, node);

        if (walker.oldNode === node) {
          walker.newNode = replaceChild;
        }

        replaceChild = null;
        break;

      case REORDER:
        ReorderChildren(node, currentPatch.moves);
        break;

      case PROPS:
        SetProps(node, currentPatch.props);
        break;

      case TEXT:
        if (node.nodeValue) {
          node.nodeValue = currentPatch.content;
        } else {
          node.textContent = currentPatch.content;
        }

        break;

      default:
        throw new Error('Unknown patch type ' + currentPatch.type);
    }
  }
}; // 找到需要修改的DOM元素和修改内容


var Walk = function Walk(node, walker, patches) {
  var child;
  var currentPatches = patches[walker.index];

  var childNodes = _utils["default"].getChildren(node);

  var len = childNodes ? childNodes.length : 0;

  for (var i = 0; i < len; i++) {
    child = childNodes[i];
    walker.index++;

    if (child) {
      switch (child.nodeType) {
        case 8:
          break;

        default:
          Walk(child, walker, patches);
      }
    }
  }

  if (currentPatches) {
    ApplyPatches(node, currentPatches, walker);
  }

  return walker;
};

var Patch = function Patch(node, patches) {
  return Walk(node, {
    index: 0,
    newNode: null,
    oldNode: node,
    remove: [],
    create: []
  }, patches);
};

Patch.REPLACE = REPLACE;
Patch.REORDER = REORDER;
Patch.PROPS = PROPS;
Patch.TEXT = TEXT;
Patch.REMOVE = REMOVE;
Patch.INSERT = INSERT;
var _default = Patch;
exports["default"] = _default;