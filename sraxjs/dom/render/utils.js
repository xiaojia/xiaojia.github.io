"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var listenChange = function listenChange(value, fn) {
  if (value.onChange) {
    value.onChange(function (newValue) {
      fn(newValue);
    });
    return renderNode(value.value);
  }

  return value;
};

var renderNode = function renderNode(v) {
  if (v === null || v === undefined) {
    return '';
  }

  return v;
};

var _default = {
  listenChange: listenChange,
  renderNode: renderNode
};
exports["default"] = _default;