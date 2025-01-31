"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _react = require("react");
var _createFactory = _interopRequireDefault(require("./utils/createFactory"));
var _setDisplayName = _interopRequireDefault(require("./setDisplayName"));
var _wrapDisplayName = _interopRequireDefault(require("./wrapDisplayName"));
var withContext = function withContext(childContextTypes, _getChildContext) {
  return function (BaseComponent) {
    var factory = (0, _createFactory["default"])(BaseComponent);
    var WithContext = /*#__PURE__*/function (_Component) {
      (0, _inheritsLoose2["default"])(WithContext, _Component);
      function WithContext() {
        return _Component.apply(this, arguments) || this;
      }
      var _proto = WithContext.prototype;
      _proto.getChildContext = function getChildContext() {
        return _getChildContext(this.props);
      };
      _proto.render = function render() {
        return factory(this.props);
      };
      return WithContext;
    }(_react.Component);
    WithContext.childContextTypes = childContextTypes;
    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName["default"])((0, _wrapDisplayName["default"])(BaseComponent, 'withContext'))(WithContext);
    }
    return WithContext;
  };
};
var _default = withContext;
exports["default"] = _default;