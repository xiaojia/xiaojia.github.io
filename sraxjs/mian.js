"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

_Object$defineProperty(exports, "DOM", {
  enumerable: true,
  get: function get() {
    return _main3["default"];
  }
});

_Object$defineProperty(exports, "Hook", {
  enumerable: true,
  get: function get() {
    return _main2["default"];
  }
});

_Object$defineProperty(exports, "JSX", {
  enumerable: true,
  get: function get() {
    return _main["default"];
  }
});

exports.Srax = void 0;

var _main = _interopRequireDefault(require("./jsx/main"));

var _main2 = _interopRequireDefault(require("./hook/main"));

var _main3 = _interopRequireDefault(require("./dom/main"));

var Srax = {
  JSX: _main["default"],
  Hook: _main2["default"],
  DOM: _main3["default"]
};
exports.Srax = Srax;