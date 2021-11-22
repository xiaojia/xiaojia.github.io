"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.DiffList = void 0;

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _patch = _interopRequireDefault(require("./patch"));

var _utils = _interopRequireDefault(require("./utils"));

var MakeKeyIndexAndFree = function MakeKeyIndexAndFree(list) {
  var keyIndex = {};
  var free = [];

  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i];

    var itemKey = _utils["default"].getItemSign(item);

    if (itemKey) {
      keyIndex[itemKey] = i;
    } else {
      free.push(item);
    }
  }

  return {
    keyIndex: keyIndex,
    free: free
  };
};

var DiffList = function DiffList(newList, oldList) {
  var newMap = MakeKeyIndexAndFree(newList);
  var oldMap = MakeKeyIndexAndFree(oldList);
  var newFree = newMap.free;
  var oldKeyIndex = oldMap.keyIndex;
  var newKeyIndex = newMap.keyIndex;
  var moves = [];
  var children = [];
  var i = 0;
  var item;
  var itemKey;
  var freeIndex = 0;
  var simulateListItem;
  var newItemIndex;
  var freeItem;
  var simulateList;
  var j;
  var nextItemKey;
  var simulateItem;
  var simulateItemKey;

  var remove = function remove(index, item) {
    moves.push({
      index: index,
      item: item,
      type: _patch["default"].REMOVE
    });
  };

  var insert = function insert(index, item) {
    moves.push({
      index: index,
      item: item,
      type: _patch["default"].INSERT
    });
  };

  var removeSimulate = function removeSimulate(index) {
    (0, _splice["default"])(simulateList).call(simulateList, index, 1);
  };

  while (i < oldList.length) {
    item = oldList[i];
    itemKey = _utils["default"].getItemSign(item);

    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null);
      } else {
        newItemIndex = newKeyIndex[itemKey];
        children.push(newList[newItemIndex]);
      }
    } else {
      freeItem = newFree[freeIndex++];
      children.push(freeItem || null);
    }

    i++;
  }

  simulateList = (0, _slice["default"])(children).call(children, 0);
  i = 0;

  while (i < simulateList.length) {
    simulateListItem = simulateList[i];

    if (simulateListItem === null) {
      remove(i);
      removeSimulate(i);
    } else {
      i++;
    }
  }

  j = i = 0;

  while (i < newList.length) {
    item = newList[i];
    itemKey = _utils["default"].getItemSign(item);
    simulateItem = simulateList[j];
    simulateItemKey = _utils["default"].getItemSign(simulateItem);

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++;
      } else if (!oldKeyIndex.hasOwnProperty(itemKey)) {
        insert(i, item);
      } else {
        nextItemKey = _utils["default"].getItemSign(simulateList[j + 1]);

        if (nextItemKey === itemKey) {
          remove(i, item);
          removeSimulate(j);
          j++;
        } else {
          insert(i, item);
        }
      }
    } else {
      insert(i, item);
    }

    i++;
  }

  return {
    moves: moves,
    children: children
  };
};

exports.DiffList = DiffList;