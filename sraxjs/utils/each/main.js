"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _default = function _default(value, fn) {
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

exports["default"] = _default;