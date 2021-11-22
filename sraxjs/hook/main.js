"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _main = _interopRequireDefault(require("./state/main"));

var _main2 = _interopRequireDefault(require("./effect/main"));

var _main3 = require("./render/main");

var _default = {
  state: _main["default"],
  effect: _main2["default"],
  createFunctionParamInterceptor: _main3.CreateFunctionParamInterceptor,
  createFunctionContext: _main3.CreateFunctionContext,
  createJSXExpression: _main3.CreateJSXExpression
};
exports["default"] = _default;