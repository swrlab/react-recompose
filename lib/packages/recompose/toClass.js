"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _react = _interopRequireWildcard(require("react"));
var _getDisplayName = _interopRequireDefault(require("./getDisplayName"));
var _isClassComponent = _interopRequireDefault(require("./isClassComponent"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var toClass = function toClass(baseComponent) {
  var _class;
  return (0, _isClassComponent["default"])(baseComponent) ? baseComponent : (_class = /*#__PURE__*/function (_Component) {
    (0, _inheritsLoose2["default"])(ToClass, _Component);
    function ToClass() {
      return _Component.apply(this, arguments) || this;
    }
    var _proto = ToClass.prototype;
    _proto.render = function render() {
      if (typeof baseComponent === 'string') {
        return /*#__PURE__*/_react["default"].createElement(baseComponent, this.props);
      }
      return baseComponent(this.props, this.context);
    };
    return ToClass;
  }(_react.Component), _class.displayName = (0, _getDisplayName["default"])(baseComponent), _class.propTypes = baseComponent.propTypes, _class.contextTypes = baseComponent.contextTypes, _class.defaultProps = baseComponent.defaultProps, _class);
};
var _default = toClass;
exports["default"] = _default;