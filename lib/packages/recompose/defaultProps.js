"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _createFactory = _interopRequireDefault(require("./utils/createFactory"));
var _setDisplayName = _interopRequireDefault(require("./setDisplayName"));
var _wrapDisplayName = _interopRequireDefault(require("./wrapDisplayName"));
var defaultProps = function defaultProps(props) {
  return function (BaseComponent) {
    var factory = (0, _createFactory["default"])(BaseComponent);
    function DefaultProps(ownerProps) {
      return factory(ownerProps);
    }
    DefaultProps.defaultProps = props;
    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName["default"])((0, _wrapDisplayName["default"])(BaseComponent, 'defaultProps'))(DefaultProps);
    }
    return DefaultProps;
  };
};
var _default = defaultProps;
exports["default"] = _default;