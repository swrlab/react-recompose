'use strict';

var React = require('react');
var _extends = require('@babel/runtime/helpers/extends');
var _inheritsLoose = require('@babel/runtime/helpers/inheritsLoose');
var reactLifecyclesCompat = require('react-lifecycles-compat');
var _objectDestructuringEmpty = require('@babel/runtime/helpers/objectDestructuringEmpty');
var _objectWithoutPropertiesLoose = require('@babel/runtime/helpers/objectWithoutPropertiesLoose');
var hoistNonReactStatics = require('hoist-non-react-statics');
var changeEmitter = require('change-emitter');
var $$observable = require('symbol-observable');

var createFactory = function createFactory(Type) {
  return React.createElement.bind(null, Type);
};

var setStatic = function setStatic(key, value) {
  return function (BaseComponent) {
    /* eslint-disable no-param-reassign */
    BaseComponent[key] = value;
    /* eslint-enable no-param-reassign */
    return BaseComponent;
  };
};

var setDisplayName = function setDisplayName(displayName) {
  return setStatic('displayName', displayName);
};

var getDisplayName = function getDisplayName(Component) {
  if (typeof Component === 'string') {
    return Component;
  }
  if (!Component) {
    return undefined;
  }
  return Component.displayName || Component.name || 'Component';
};

var wrapDisplayName = function wrapDisplayName(BaseComponent, hocName) {
  return hocName + "(" + getDisplayName(BaseComponent) + ")";
};

var mapProps = function mapProps(propsMapper) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var MapProps = function MapProps(props) {
      return factory(propsMapper(props));
    };
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'mapProps'))(MapProps);
    }
    return MapProps;
  };
};

var withProps = function withProps(input) {
  var hoc = mapProps(function (props) {
    return _extends({}, props, typeof input === 'function' ? input(props) : input);
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withProps'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var pick = function pick(obj, keys) {
  var result = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule shallowEqual
 * @typechecks
 */

/* eslint-disable no-self-compare */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  }
  // Step 6.a: NaN == NaN
  return x !== x && y !== y;
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}

var withPropsOnChange = function withPropsOnChange(shouldMapOrKeys, propsMapper) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var shouldMap = typeof shouldMapOrKeys === 'function' ? shouldMapOrKeys : function (props, nextProps) {
      return !shallowEqual(pick(props, shouldMapOrKeys), pick(nextProps, shouldMapOrKeys));
    };
    var WithPropsOnChange = /*#__PURE__*/function (_Component) {
      _inheritsLoose(WithPropsOnChange, _Component);
      function WithPropsOnChange() {
        var _this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _Component.call.apply(_Component, [this].concat(args)) || this;
        _this.state = {
          computedProps: propsMapper(_this.props),
          prevProps: _this.props
        };
        return _this;
      }
      WithPropsOnChange.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        if (shouldMap(prevState.prevProps, nextProps)) {
          return {
            computedProps: propsMapper(nextProps),
            prevProps: nextProps
          };
        }
        return {
          prevProps: nextProps
        };
      };
      var _proto = WithPropsOnChange.prototype;
      _proto.render = function render() {
        return factory(_extends({}, this.props, this.state.computedProps));
      };
      return WithPropsOnChange;
    }(React.Component);
    reactLifecyclesCompat.polyfill(WithPropsOnChange);
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withPropsOnChange'))(WithPropsOnChange);
    }
    return WithPropsOnChange;
  };
};

var mapValues = function mapValues(obj, func) {
  var result = {};
  /* eslint-disable no-restricted-syntax */
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = func(obj[key], key);
    }
  }
  /* eslint-enable no-restricted-syntax */
  return result;
};

var withHandlers = function withHandlers(handlers) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var WithHandlers = /*#__PURE__*/function (_Component) {
      _inheritsLoose(WithHandlers, _Component);
      function WithHandlers() {
        var _this;
        for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
          _args[_key] = arguments[_key];
        }
        _this = _Component.call.apply(_Component, [this].concat(_args)) || this;
        _this.handlers = mapValues(typeof handlers === 'function' ? handlers(_this.props) : handlers, function (createHandler) {
          return function () {
            var handler = createHandler(_this.props);
            if (process.env.NODE_ENV !== 'production' && typeof handler !== 'function') {
              console.error(
              // eslint-disable-line no-console
              'withHandlers(): Expected a map of higher-order functions. ' + 'Refer to the docs for more info.');
            }
            return handler.apply(void 0, arguments);
          };
        });
        return _this;
      }
      var _proto = WithHandlers.prototype;
      _proto.render = function render() {
        return factory(_extends({}, this.props, this.handlers));
      };
      return WithHandlers;
    }(React.Component);
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withHandlers'))(WithHandlers);
    }
    return WithHandlers;
  };
};

var defaultProps = function defaultProps(props) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    function DefaultProps(ownerProps) {
      return factory(ownerProps);
    }
    DefaultProps.defaultProps = props;
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'defaultProps'))(DefaultProps);
    }
    return DefaultProps;
  };
};

var omit = function omit(obj, keys) {
  var rest = _extends({}, (_objectDestructuringEmpty(obj), obj));
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (rest.hasOwnProperty(key)) {
      delete rest[key];
    }
  }
  return rest;
};

var renameProp = function renameProp(oldName, newName) {
  var hoc = mapProps(function (props) {
    var _extends2;
    return _extends({}, omit(props, [oldName]), (_extends2 = {}, _extends2[newName] = props[oldName], _extends2));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'renameProp'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var keys = Object.keys;
var mapKeys = function mapKeys(obj, func) {
  return keys(obj).reduce(function (result, key) {
    var val = obj[key];
    /* eslint-disable no-param-reassign */
    result[func(val, key)] = val;
    /* eslint-enable no-param-reassign */
    return result;
  }, {});
};
var renameProps = function renameProps(nameMap) {
  var hoc = mapProps(function (props) {
    return _extends({}, omit(props, keys(nameMap)), mapKeys(pick(props, keys(nameMap)), function (_, oldName) {
      return nameMap[oldName];
    }));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'renameProps'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var flattenProp = function flattenProp(propName) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var FlattenProp = function FlattenProp(props) {
      return factory(_extends({}, props, props[propName]));
    };
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'flattenProp'))(FlattenProp);
    }
    return FlattenProp;
  };
};

var withState = function withState(stateName, stateUpdaterName, initialState) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var WithState = /*#__PURE__*/function (_Component) {
      _inheritsLoose(WithState, _Component);
      function WithState() {
        var _this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _Component.call.apply(_Component, [this].concat(args)) || this;
        _this.state = {
          stateValue: typeof initialState === 'function' ? initialState(_this.props) : initialState
        };
        _this.updateStateValue = function (updateFn, callback) {
          return _this.setState(function (_ref) {
            var stateValue = _ref.stateValue;
            return {
              stateValue: typeof updateFn === 'function' ? updateFn(stateValue) : updateFn
            };
          }, callback);
        };
        return _this;
      }
      var _proto = WithState.prototype;
      _proto.render = function render() {
        var _extends2;
        return factory(_extends({}, this.props, (_extends2 = {}, _extends2[stateName] = this.state.stateValue, _extends2[stateUpdaterName] = this.updateStateValue, _extends2)));
      };
      return WithState;
    }(React.Component);
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withState'))(WithState);
    }
    return WithState;
  };
};

var withStateHandlers = function withStateHandlers(initialState, stateUpdaters) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var WithStateHandlers = /*#__PURE__*/function (_Component) {
      _inheritsLoose(WithStateHandlers, _Component);
      function WithStateHandlers() {
        var _this;
        for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
          _args[_key] = arguments[_key];
        }
        _this = _Component.call.apply(_Component, [this].concat(_args)) || this;
        _this.state = typeof initialState === 'function' ? initialState(_this.props) : initialState;
        _this.stateUpdaters = mapValues(stateUpdaters, function (handler) {
          return function (mayBeEvent) {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            // Having that functional form of setState can be called async
            // we need to persist SyntheticEvent
            if (mayBeEvent && typeof mayBeEvent.persist === 'function') {
              mayBeEvent.persist();
            }
            _this.setState(function (state, props) {
              return handler(state, props).apply(void 0, [mayBeEvent].concat(args));
            });
          };
        });
        return _this;
      }
      var _proto = WithStateHandlers.prototype;
      _proto.render = function render() {
        return factory(_extends({}, this.props, this.state, this.stateUpdaters));
      };
      return WithStateHandlers;
    }(React.Component);
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withStateHandlers'))(WithStateHandlers);
    }
    return WithStateHandlers;
  };
};

var noop = function noop() {};
var withReducer = function withReducer(stateName, dispatchName, reducer, initialState) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var WithReducer = /*#__PURE__*/function (_Component) {
      _inheritsLoose(WithReducer, _Component);
      function WithReducer() {
        var _this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _Component.call.apply(_Component, [this].concat(args)) || this;
        _this.state = {
          stateValue: _this.initializeStateValue()
        };
        _this.dispatch = function (action, callback) {
          if (callback === void 0) {
            callback = noop;
          }
          return _this.setState(function (_ref) {
            var stateValue = _ref.stateValue;
            return {
              stateValue: reducer(stateValue, action)
            };
          }, function () {
            return callback(_this.state.stateValue);
          });
        };
        return _this;
      }
      var _proto = WithReducer.prototype;
      _proto.initializeStateValue = function initializeStateValue() {
        if (initialState !== undefined) {
          return typeof initialState === 'function' ? initialState(this.props) : initialState;
        }
        return reducer(undefined, {
          type: '@@recompose/INIT'
        });
      };
      _proto.render = function render() {
        var _extends2;
        return factory(_extends({}, this.props, (_extends2 = {}, _extends2[stateName] = this.state.stateValue, _extends2[dispatchName] = this.dispatch, _extends2)));
      };
      return WithReducer;
    }(React.Component);
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withReducer'))(WithReducer);
    }
    return WithReducer;
  };
};

var identity$1 = function identity(Component) {
  return Component;
};
var branch = function branch(test, left, right) {
  if (right === void 0) {
    right = identity$1;
  }
  return function (BaseComponent) {
    var leftFactory;
    var rightFactory;
    var Branch = function Branch(props) {
      if (test(props)) {
        leftFactory = leftFactory || createFactory(left(BaseComponent));
        return leftFactory(props);
      }
      rightFactory = rightFactory || createFactory(right(BaseComponent));
      return rightFactory(props);
    };
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'branch'))(Branch);
    }
    return Branch;
  };
};

var renderComponent = function renderComponent(Component) {
  return function (_) {
    var factory = createFactory(Component);
    var RenderComponent = function RenderComponent(props) {
      return factory(props);
    };
    if (process.env.NODE_ENV !== 'production') {
      RenderComponent.displayName = wrapDisplayName(Component, 'renderComponent');
    }
    return RenderComponent;
  };
};

var Nothing = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Nothing, _Component);
  function Nothing() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = Nothing.prototype;
  _proto.render = function render() {
    return null;
  };
  return Nothing;
}(React.Component);
var renderNothing = function renderNothing(_) {
  return Nothing;
};

var shouldUpdate = function shouldUpdate(test) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var ShouldUpdate = /*#__PURE__*/function (_Component) {
      _inheritsLoose(ShouldUpdate, _Component);
      function ShouldUpdate() {
        return _Component.apply(this, arguments) || this;
      }
      var _proto = ShouldUpdate.prototype;
      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return test(this.props, nextProps);
      };
      _proto.render = function render() {
        return factory(this.props);
      };
      return ShouldUpdate;
    }(React.Component);
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'shouldUpdate'))(ShouldUpdate);
    }
    return ShouldUpdate;
  };
};

var pure = function pure(BaseComponent) {
  var hoc = shouldUpdate(function (props, nextProps) {
    return !shallowEqual(props, nextProps);
  });
  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'pure'))(hoc(BaseComponent));
  }
  return hoc(BaseComponent);
};

var onlyUpdateForKeys = function onlyUpdateForKeys(propKeys) {
  var hoc = shouldUpdate(function (props, nextProps) {
    return !shallowEqual(pick(nextProps, propKeys), pick(props, propKeys));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForKeys'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var onlyUpdateForPropTypes = function onlyUpdateForPropTypes(BaseComponent) {
  var propTypes = BaseComponent.propTypes;
  if (process.env.NODE_ENV !== 'production') {
    if (!propTypes) {
      /* eslint-disable */
      console.error('A component without any `propTypes` was passed to ' + '`onlyUpdateForPropTypes()`. Check the implementation of the ' + ("component with display name \"" + getDisplayName(BaseComponent) + "\"."));
      /* eslint-enable */
    }
  }

  var propKeys = Object.keys(propTypes || {});
  var OnlyUpdateForPropTypes = onlyUpdateForKeys(propKeys)(BaseComponent);
  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForPropTypes'))(OnlyUpdateForPropTypes);
  }
  return OnlyUpdateForPropTypes;
};

var withContext = function withContext(childContextTypes, _getChildContext) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var WithContext = /*#__PURE__*/function (_Component) {
      _inheritsLoose(WithContext, _Component);
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
    }(React.Component);
    WithContext.childContextTypes = childContextTypes;
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withContext'))(WithContext);
    }
    return WithContext;
  };
};

var getContext = function getContext(contextTypes) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var GetContext = function GetContext(ownerProps, context) {
      return factory(_extends({}, ownerProps, context));
    };
    GetContext.contextTypes = contextTypes;
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(GetContext);
    }
    return GetContext;
  };
};

var lifecycle = function lifecycle(spec) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    if (process.env.NODE_ENV !== 'production' && spec.hasOwnProperty('render')) {
      console.error('lifecycle() does not support the render method; its behavior is to ' + 'pass all props and state to the base component.');
    }
    var Lifecycle = /*#__PURE__*/function (_Component) {
      _inheritsLoose(Lifecycle, _Component);
      function Lifecycle() {
        return _Component.apply(this, arguments) || this;
      }
      var _proto = Lifecycle.prototype;
      _proto.render = function render() {
        return factory(_extends({}, this.props, this.state));
      };
      return Lifecycle;
    }(React.Component);
    Object.keys(spec).forEach(function (hook) {
      return Lifecycle.prototype[hook] = spec[hook];
    });
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'lifecycle'))(Lifecycle);
    }
    return Lifecycle;
  };
};

var isClassComponent = function isClassComponent(Component) {
  return Boolean(Component && Component.prototype && typeof Component.prototype.render === 'function');
};

var toClass = function toClass(baseComponent) {
  var _class;
  return isClassComponent(baseComponent) ? baseComponent : (_class = /*#__PURE__*/function (_Component) {
    _inheritsLoose(ToClass, _Component);
    function ToClass() {
      return _Component.apply(this, arguments) || this;
    }
    var _proto = ToClass.prototype;
    _proto.render = function render() {
      if (typeof baseComponent === 'string') {
        return /*#__PURE__*/React.createElement(baseComponent, this.props);
      }
      return baseComponent(this.props, this.context);
    };
    return ToClass;
  }(React.Component), _class.displayName = getDisplayName(baseComponent), _class.propTypes = baseComponent.propTypes, _class.contextTypes = baseComponent.contextTypes, _class.defaultProps = baseComponent.defaultProps, _class);
};

function toRenderProps(hoc) {
  var RenderPropsComponent = function RenderPropsComponent(props) {
    return props.children(props);
  };
  return hoc(RenderPropsComponent);
}

var fromRenderProps = function fromRenderProps(RenderPropsComponent, propsMapper, renderPropName) {
  if (renderPropName === void 0) {
    renderPropName = 'children';
  }
  return function (BaseComponent) {
    var baseFactory = createFactory(BaseComponent);
    var renderPropsFactory = createFactory(RenderPropsComponent);
    var FromRenderProps = function FromRenderProps(ownerProps) {
      var _renderPropsFactory;
      return renderPropsFactory((_renderPropsFactory = {}, _renderPropsFactory[renderPropName] = function () {
        return baseFactory(_extends({}, ownerProps, propsMapper.apply(void 0, arguments)));
      }, _renderPropsFactory));
    };
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'fromRenderProps'))(FromRenderProps);
    }
    return FromRenderProps;
  };
};

var setPropTypes = function setPropTypes(propTypes) {
  return setStatic('propTypes', propTypes);
};

var compose = function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  }, function (arg) {
    return arg;
  });
};

var createSink = function createSink(callback) {
  var Sink = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Sink, _Component);
    function Sink() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.state = {};
      return _this;
    }
    Sink.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps) {
      callback(nextProps);
      return null;
    };
    var _proto = Sink.prototype;
    _proto.render = function render() {
      return null;
    };
    return Sink;
  }(React.Component);
  reactLifecyclesCompat.polyfill(Sink);
  return Sink;
};

var componentFromProp = function componentFromProp(propName) {
  function Component(props) {
    return /*#__PURE__*/React.createElement(props[propName], omit(props, [propName]));
  }
  Component.displayName = "componentFromProp(" + propName + ")";
  return Component;
};

var _excluded = ["children"];
var nest = function nest() {
  for (var _len = arguments.length, Components = new Array(_len), _key = 0; _key < _len; _key++) {
    Components[_key] = arguments[_key];
  }
  var factories = Components.map(createFactory);
  var Nest = function Nest(_ref) {
    var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);
    return factories.reduceRight(function (child, factory) {
      return factory(props, child);
    }, children);
  };
  if (process.env.NODE_ENV !== 'production') {
    var displayNames = Components.map(getDisplayName);
    Nest.displayName = "nest(" + displayNames.join(', ') + ")";
  }
  return Nest;
};

var hoistStatics = function hoistStatics(higherOrderComponent, blacklist) {
  return function (BaseComponent) {
    var NewComponent = higherOrderComponent(BaseComponent);
    hoistNonReactStatics(NewComponent, BaseComponent, blacklist);
    return NewComponent;
  };
};

var _config = {
  fromESObservable: null,
  toESObservable: null
};
var configureObservable = function configureObservable(c) {
  _config = c;
};
var config = {
  fromESObservable: function fromESObservable(observable) {
    return typeof _config.fromESObservable === 'function' ? _config.fromESObservable(observable) : observable;
  },
  toESObservable: function toESObservable(stream) {
    return typeof _config.toESObservable === 'function' ? _config.toESObservable(stream) : stream;
  }
};

var componentFromStreamWithConfig = function componentFromStreamWithConfig(config) {
  return function (propsToVdom) {
    return /*#__PURE__*/function (_Component) {
      _inheritsLoose(ComponentFromStream, _Component);
      function ComponentFromStream() {
        var _config$fromESObserva;
        var _this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _Component.call.apply(_Component, [this].concat(args)) || this;
        _this.state = {
          vdom: null
        };
        _this.propsEmitter = changeEmitter.createChangeEmitter();
        _this.props$ = config.fromESObservable((_config$fromESObserva = {
          subscribe: function subscribe(observer) {
            var unsubscribe = _this.propsEmitter.listen(function (props) {
              if (props) {
                observer.next(props);
              } else {
                observer.complete();
              }
            });
            return {
              unsubscribe: unsubscribe
            };
          }
        }, _config$fromESObserva[$$observable] = function () {
          return this;
        }, _config$fromESObserva));
        _this.vdom$ = config.toESObservable(propsToVdom(_this.props$));
        return _this;
      }
      var _proto = ComponentFromStream.prototype;
      _proto.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
        var _this2 = this;
        // Subscribe to child prop changes so we know when to re-render
        this.subscription = this.vdom$.subscribe({
          next: function next(vdom) {
            _this2.setState({
              vdom: vdom
            });
          }
        });
        this.propsEmitter.emit(this.props);
      };
      _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
        // Receive new props from the owner
        this.propsEmitter.emit(nextProps);
      };
      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        return nextState.vdom !== this.state.vdom;
      };
      _proto.componentWillUnmount = function componentWillUnmount() {
        // Call without arguments to complete stream
        this.propsEmitter.emit();

        // Clean-up subscription before un-mounting
        this.subscription.unsubscribe();
      };
      _proto.render = function render() {
        return this.state.vdom;
      };
      return ComponentFromStream;
    }(React.Component);
  };
};
var componentFromStream = function componentFromStream(propsToVdom) {
  return componentFromStreamWithConfig(config)(propsToVdom);
};

var identity = function identity(t) {
  return t;
};
var mapPropsStreamWithConfig = function mapPropsStreamWithConfig(config) {
  var componentFromStream = componentFromStreamWithConfig({
    fromESObservable: identity,
    toESObservable: identity
  });
  return function (transform) {
    return function (BaseComponent) {
      var factory = createFactory(BaseComponent);
      var fromESObservable = config.fromESObservable,
        toESObservable = config.toESObservable;
      return componentFromStream(function (props$) {
        var _ref;
        return _ref = {
          subscribe: function subscribe(observer) {
            var subscription = toESObservable(transform(fromESObservable(props$))).subscribe({
              next: function next(childProps) {
                return observer.next(factory(childProps));
              }
            });
            return {
              unsubscribe: function unsubscribe() {
                return subscription.unsubscribe();
              }
            };
          }
        }, _ref[$$observable] = function () {
          return this;
        }, _ref;
      });
    };
  };
};
var mapPropsStream = function mapPropsStream(transform) {
  var hoc = mapPropsStreamWithConfig(config)(transform);
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'mapPropsStream'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var createEventHandlerWithConfig = function createEventHandlerWithConfig(config) {
  return function () {
    var _config$fromESObserva;
    var emitter = changeEmitter.createChangeEmitter();
    var stream = config.fromESObservable((_config$fromESObserva = {
      subscribe: function subscribe(observer) {
        var unsubscribe = emitter.listen(function (value) {
          return observer.next(value);
        });
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _config$fromESObserva[$$observable] = function () {
      return this;
    }, _config$fromESObserva));
    return {
      handler: emitter.emit,
      stream: stream
    };
  };
};
var createEventHandler = createEventHandlerWithConfig(config);

exports.branch = branch;
exports.componentFromProp = componentFromProp;
exports.componentFromStream = componentFromStream;
exports.componentFromStreamWithConfig = componentFromStreamWithConfig;
exports.compose = compose;
exports.createEventHandler = createEventHandler;
exports.createEventHandlerWithConfig = createEventHandlerWithConfig;
exports.createSink = createSink;
exports.defaultProps = defaultProps;
exports.flattenProp = flattenProp;
exports.fromRenderProps = fromRenderProps;
exports.getContext = getContext;
exports.getDisplayName = getDisplayName;
exports.hoistStatics = hoistStatics;
exports.isClassComponent = isClassComponent;
exports.lifecycle = lifecycle;
exports.mapProps = mapProps;
exports.mapPropsStream = mapPropsStream;
exports.mapPropsStreamWithConfig = mapPropsStreamWithConfig;
exports.nest = nest;
exports.onlyUpdateForKeys = onlyUpdateForKeys;
exports.onlyUpdateForPropTypes = onlyUpdateForPropTypes;
exports.pure = pure;
exports.renameProp = renameProp;
exports.renameProps = renameProps;
exports.renderComponent = renderComponent;
exports.renderNothing = renderNothing;
exports.setDisplayName = setDisplayName;
exports.setObservableConfig = configureObservable;
exports.setPropTypes = setPropTypes;
exports.setStatic = setStatic;
exports.shallowEqual = shallowEqual;
exports.shouldUpdate = shouldUpdate;
exports.toClass = toClass;
exports.toRenderProps = toRenderProps;
exports.withContext = withContext;
exports.withHandlers = withHandlers;
exports.withProps = withProps;
exports.withPropsOnChange = withPropsOnChange;
exports.withReducer = withReducer;
exports.withState = withState;
exports.withStateHandlers = withStateHandlers;
exports.wrapDisplayName = wrapDisplayName;
