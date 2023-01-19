"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _createFactory = _interopRequireDefault(require("./utils/createFactory"));
var _setDisplayName = _interopRequireDefault(require("./setDisplayName"));
var _wrapDisplayName = _interopRequireDefault(require("./wrapDisplayName"));
var fromRenderProps = function fromRenderProps(RenderPropsComponent, propsMapper, renderPropName) {
  if (renderPropName === void 0) {
    renderPropName = 'children';
  }
  return function (BaseComponent) {
    var baseFactory = (0, _createFactory["default"])(BaseComponent);
    var renderPropsFactory = (0, _createFactory["default"])(RenderPropsComponent);
    var FromRenderProps = function FromRenderProps(ownerProps) {
      var _renderPropsFactory;
      return renderPropsFactory((_renderPropsFactory = {}, _renderPropsFactory[renderPropName] = function () {
        return baseFactory((0, _extends2["default"])({}, ownerProps, propsMapper.apply(void 0, arguments)));
      }, _renderPropsFactory));
    };
    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName["default"])((0, _wrapDisplayName["default"])(BaseComponent, 'fromRenderProps'))(FromRenderProps);
    }
    return FromRenderProps;
  };
};
var _default = fromRenderProps;
exports["default"] = _default;