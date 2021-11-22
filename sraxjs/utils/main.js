"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.error = exports.each = exports["default"] = void 0;

var each = function each(value, fn) {
  if (value) {
    if (value instanceof Array) {
      for (var i = 0, len = value.length; i < len; i++) {
        if (fn(value[i], i) === false) {
          break;
        }
      }
    } else {
      for (var e in value) {
        if (fn(value[e], e) === false) {
          break;
        }
      }
    }
  }
};

exports.each = each;

var error = function error(text) {
  throw new Error(text);
};

exports.error = error;
var _default = {
  each: each,
  error: error
};
exports["default"] = _default;