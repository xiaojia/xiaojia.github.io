"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _main = _interopRequireDefault(require("../../utils/main"));

var _default = function _default(defaultValue, context) {
  var state = defaultValue;
  var changeFn = [];
  var ret = [state, function (changeValue) {
    (0, _assign["default"])(state, changeValue);

    _main["default"].each(changeFn, function (v, i) {
      v(state);
    });

    context.change();
  }];

  if ((0, _typeof2["default"])(defaultValue) !== 'object') {
    _main["default"].error('### Hook.state 必须传入一个 object');
  }

  (0, _defineProperties["default"])(state, {
    _$type: {
      value: 'HookState'
    },
    _$change: {
      value: function value(fn) {
        changeFn.push(fn);
      }
    }
  });
  context.state.push(state);
  return ret;
};

exports["default"] = _default;