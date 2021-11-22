"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

_Object$defineProperty(exports, "Diff", {
  enumerable: true,
  get: function get() {
    return _diff["default"];
  }
});

_Object$defineProperty(exports, "Patch", {
  enumerable: true,
  get: function get() {
    return _patch["default"];
  }
});

var _diff = _interopRequireDefault(require("./diff"));

var _patch = _interopRequireDefault(require("./patch"));