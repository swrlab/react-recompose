(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Recompose = {}, global.React));
})(this, (function (exports, React) { 'use strict';

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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'mapProps'))(MapProps);
      }
    };
  };

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  var withProps = function withProps(input) {
    var hoc = mapProps(function (props) {
      return _extends({}, props, typeof input === 'function' ? input(props) : input);
    });
    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withProps'))(hoc(BaseComponent));
      };
    }
  };

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  function componentWillMount() {
    // Call this.constructor.gDSFP to support sub-classes.
    var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
    if (state !== null && state !== undefined) {
      this.setState(state);
    }
  }

  function componentWillReceiveProps(nextProps) {
    // Call this.constructor.gDSFP to support sub-classes.
    // Use the setState() updater to ensure state isn't stale in certain edge cases.
    function updater(prevState) {
      var state = this.constructor.getDerivedStateFromProps(nextProps, prevState);
      return state !== null && state !== undefined ? state : null;
    }
    // Binding "this" is important for shallow renderer support.
    this.setState(updater.bind(this));
  }

  function componentWillUpdate(nextProps, nextState) {
    try {
      var prevProps = this.props;
      var prevState = this.state;
      this.props = nextProps;
      this.state = nextState;
      this.__reactInternalSnapshotFlag = true;
      this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
        prevProps,
        prevState
      );
    } finally {
      this.props = prevProps;
      this.state = prevState;
    }
  }

  // React may warn about cWM/cWRP/cWU methods being deprecated.
  // Add a flag to suppress these warnings for this special case.
  componentWillMount.__suppressDeprecationWarning = true;
  componentWillReceiveProps.__suppressDeprecationWarning = true;
  componentWillUpdate.__suppressDeprecationWarning = true;

  function polyfill(Component) {
    var prototype = Component.prototype;

    if (!prototype || !prototype.isReactComponent) {
      throw new Error('Can only polyfill class components');
    }

    if (
      typeof Component.getDerivedStateFromProps !== 'function' &&
      typeof prototype.getSnapshotBeforeUpdate !== 'function'
    ) {
      return Component;
    }

    // If new component APIs are defined, "unsafe" lifecycles won't be called.
    // Error if any of these lifecycles are present,
    // Because they would work differently between older and newer (16.3+) versions of React.
    var foundWillMountName = null;
    var foundWillReceivePropsName = null;
    var foundWillUpdateName = null;
    if (typeof prototype.componentWillMount === 'function') {
      foundWillMountName = 'componentWillMount';
    } else if (typeof prototype.UNSAFE_componentWillMount === 'function') {
      foundWillMountName = 'UNSAFE_componentWillMount';
    }
    if (typeof prototype.componentWillReceiveProps === 'function') {
      foundWillReceivePropsName = 'componentWillReceiveProps';
    } else if (typeof prototype.UNSAFE_componentWillReceiveProps === 'function') {
      foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps';
    }
    if (typeof prototype.componentWillUpdate === 'function') {
      foundWillUpdateName = 'componentWillUpdate';
    } else if (typeof prototype.UNSAFE_componentWillUpdate === 'function') {
      foundWillUpdateName = 'UNSAFE_componentWillUpdate';
    }
    if (
      foundWillMountName !== null ||
      foundWillReceivePropsName !== null ||
      foundWillUpdateName !== null
    ) {
      var componentName = Component.displayName || Component.name;
      var newApiName =
        typeof Component.getDerivedStateFromProps === 'function'
          ? 'getDerivedStateFromProps()'
          : 'getSnapshotBeforeUpdate()';

      throw Error(
        'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
          componentName +
          ' uses ' +
          newApiName +
          ' but also contains the following legacy lifecycles:' +
          (foundWillMountName !== null ? '\n  ' + foundWillMountName : '') +
          (foundWillReceivePropsName !== null
            ? '\n  ' + foundWillReceivePropsName
            : '') +
          (foundWillUpdateName !== null ? '\n  ' + foundWillUpdateName : '') +
          '\n\nThe above lifecycles should be removed. Learn more about this warning here:\n' +
          'https://fb.me/react-async-component-lifecycle-hooks'
      );
    }

    // React <= 16.2 does not support static getDerivedStateFromProps.
    // As a workaround, use cWM and cWRP to invoke the new static lifecycle.
    // Newer versions of React will ignore these lifecycles if gDSFP exists.
    if (typeof Component.getDerivedStateFromProps === 'function') {
      prototype.componentWillMount = componentWillMount;
      prototype.componentWillReceiveProps = componentWillReceiveProps;
    }

    // React <= 16.2 does not support getSnapshotBeforeUpdate.
    // As a workaround, use cWU to invoke the new lifecycle.
    // Newer versions of React will ignore that lifecycle if gSBU exists.
    if (typeof prototype.getSnapshotBeforeUpdate === 'function') {
      if (typeof prototype.componentDidUpdate !== 'function') {
        throw new Error(
          'Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype'
        );
      }

      prototype.componentWillUpdate = componentWillUpdate;

      var componentDidUpdate = prototype.componentDidUpdate;

      prototype.componentDidUpdate = function componentDidUpdatePolyfill(
        prevProps,
        prevState,
        maybeSnapshot
      ) {
        // 16.3+ will not execute our will-update method;
        // It will pass a snapshot value to did-update though.
        // Older versions will require our polyfilled will-update value.
        // We need to handle both cases, but can't just check for the presence of "maybeSnapshot",
        // Because for <= 15.x versions this might be a "prevContext" object.
        // We also can't just check "__reactInternalSnapshot",
        // Because get-snapshot might return a falsy value.
        // So check for the explicit __reactInternalSnapshotFlag flag to determine behavior.
        var snapshot = this.__reactInternalSnapshotFlag
          ? this.__reactInternalSnapshot
          : maybeSnapshot;

        componentDidUpdate.call(this, prevProps, prevState, snapshot);
      };
    }

    return Component;
  }

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
      polyfill(WithPropsOnChange);
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withPropsOnChange'))(WithPropsOnChange);
      }
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
              if (typeof handler !== 'function') {
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withHandlers'))(WithHandlers);
      }
    };
  };

  var defaultProps = function defaultProps(props) {
    return function (BaseComponent) {
      var factory = createFactory(BaseComponent);
      function DefaultProps(ownerProps) {
        return factory(ownerProps);
      }
      DefaultProps.defaultProps = props;
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'defaultProps'))(DefaultProps);
      }
    };
  };

  function _objectDestructuringEmpty(obj) {
    if (obj == null) throw new TypeError("Cannot destructure " + obj);
  }

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
    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'renameProp'))(hoc(BaseComponent));
      };
    }
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
    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'renameProps'))(hoc(BaseComponent));
      };
    }
  };

  var flattenProp = function flattenProp(propName) {
    return function (BaseComponent) {
      var factory = createFactory(BaseComponent);
      var FlattenProp = function FlattenProp(props) {
        return factory(_extends({}, props, props[propName]));
      };
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'flattenProp'))(FlattenProp);
      }
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withState'))(WithState);
      }
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withStateHandlers'))(WithStateHandlers);
      }
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withReducer'))(WithReducer);
      }
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'branch'))(Branch);
      }
    };
  };

  var renderComponent = function renderComponent(Component) {
    return function (_) {
      var factory = createFactory(Component);
      var RenderComponent = function RenderComponent(props) {
        return factory(props);
      };
      {
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'shouldUpdate'))(ShouldUpdate);
      }
    };
  };

  var pure = function pure(BaseComponent) {
    var hoc = shouldUpdate(function (props, nextProps) {
      return !shallowEqual(props, nextProps);
    });
    {
      return setDisplayName(wrapDisplayName(BaseComponent, 'pure'))(hoc(BaseComponent));
    }
  };

  var onlyUpdateForKeys = function onlyUpdateForKeys(propKeys) {
    var hoc = shouldUpdate(function (props, nextProps) {
      return !shallowEqual(pick(nextProps, propKeys), pick(props, propKeys));
    });
    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForKeys'))(hoc(BaseComponent));
      };
    }
  };

  var onlyUpdateForPropTypes = function onlyUpdateForPropTypes(BaseComponent) {
    var propTypes = BaseComponent.propTypes;
    {
      if (!propTypes) {
        /* eslint-disable */
        console.error('A component without any `propTypes` was passed to ' + '`onlyUpdateForPropTypes()`. Check the implementation of the ' + ("component with display name \"" + getDisplayName(BaseComponent) + "\"."));
        /* eslint-enable */
      }
    }

    var propKeys = Object.keys(propTypes || {});
    var OnlyUpdateForPropTypes = onlyUpdateForKeys(propKeys)(BaseComponent);
    {
      return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForPropTypes'))(OnlyUpdateForPropTypes);
    }
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'withContext'))(WithContext);
      }
    };
  };

  var getContext = function getContext(contextTypes) {
    return function (BaseComponent) {
      var factory = createFactory(BaseComponent);
      var GetContext = function GetContext(ownerProps, context) {
        return factory(_extends({}, ownerProps, context));
      };
      GetContext.contextTypes = contextTypes;
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(GetContext);
      }
    };
  };

  var lifecycle = function lifecycle(spec) {
    return function (BaseComponent) {
      var factory = createFactory(BaseComponent);
      if (spec.hasOwnProperty('render')) {
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'lifecycle'))(Lifecycle);
      }
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
      {
        return setDisplayName(wrapDisplayName(BaseComponent, 'fromRenderProps'))(FromRenderProps);
      }
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
    polyfill(Sink);
    return Sink;
  };

  var componentFromProp = function componentFromProp(propName) {
    function Component(props) {
      return /*#__PURE__*/React.createElement(props[propName], omit(props, [propName]));
    }
    Component.displayName = "componentFromProp(" + propName + ")";
    return Component;
  };

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }

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
    {
      var displayNames = Components.map(getDisplayName);
      Nest.displayName = "nest(" + displayNames.join(', ') + ")";
    }
    return Nest;
  };

  var reactIsExports = {};
  var reactIs$1 = {
    get exports(){ return reactIsExports; },
    set exports(v){ reactIsExports = v; },
  };

  var reactIs_development = {};

  /** @license React v16.13.1
   * react-is.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var hasRequiredReactIs_development;

  function requireReactIs_development () {
  	if (hasRequiredReactIs_development) return reactIs_development;
  	hasRequiredReactIs_development = 1;



  	{
  	  (function() {

  	// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  	// nor polyfill, then a plain number is used for performance.
  	var hasSymbol = typeof Symbol === 'function' && Symbol.for;
  	var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  	var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  	var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  	var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  	var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  	var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  	var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
  	// (unstable) APIs that have been removed. Can we remove the symbols?

  	var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
  	var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  	var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  	var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  	var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
  	var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  	var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
  	var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
  	var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
  	var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
  	var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

  	function isValidElementType(type) {
  	  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  	  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
  	}

  	function typeOf(object) {
  	  if (typeof object === 'object' && object !== null) {
  	    var $$typeof = object.$$typeof;

  	    switch ($$typeof) {
  	      case REACT_ELEMENT_TYPE:
  	        var type = object.type;

  	        switch (type) {
  	          case REACT_ASYNC_MODE_TYPE:
  	          case REACT_CONCURRENT_MODE_TYPE:
  	          case REACT_FRAGMENT_TYPE:
  	          case REACT_PROFILER_TYPE:
  	          case REACT_STRICT_MODE_TYPE:
  	          case REACT_SUSPENSE_TYPE:
  	            return type;

  	          default:
  	            var $$typeofType = type && type.$$typeof;

  	            switch ($$typeofType) {
  	              case REACT_CONTEXT_TYPE:
  	              case REACT_FORWARD_REF_TYPE:
  	              case REACT_LAZY_TYPE:
  	              case REACT_MEMO_TYPE:
  	              case REACT_PROVIDER_TYPE:
  	                return $$typeofType;

  	              default:
  	                return $$typeof;
  	            }

  	        }

  	      case REACT_PORTAL_TYPE:
  	        return $$typeof;
  	    }
  	  }

  	  return undefined;
  	} // AsyncMode is deprecated along with isAsyncMode

  	var AsyncMode = REACT_ASYNC_MODE_TYPE;
  	var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
  	var ContextConsumer = REACT_CONTEXT_TYPE;
  	var ContextProvider = REACT_PROVIDER_TYPE;
  	var Element = REACT_ELEMENT_TYPE;
  	var ForwardRef = REACT_FORWARD_REF_TYPE;
  	var Fragment = REACT_FRAGMENT_TYPE;
  	var Lazy = REACT_LAZY_TYPE;
  	var Memo = REACT_MEMO_TYPE;
  	var Portal = REACT_PORTAL_TYPE;
  	var Profiler = REACT_PROFILER_TYPE;
  	var StrictMode = REACT_STRICT_MODE_TYPE;
  	var Suspense = REACT_SUSPENSE_TYPE;
  	var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

  	function isAsyncMode(object) {
  	  {
  	    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
  	      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

  	      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
  	    }
  	  }

  	  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
  	}
  	function isConcurrentMode(object) {
  	  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
  	}
  	function isContextConsumer(object) {
  	  return typeOf(object) === REACT_CONTEXT_TYPE;
  	}
  	function isContextProvider(object) {
  	  return typeOf(object) === REACT_PROVIDER_TYPE;
  	}
  	function isElement(object) {
  	  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  	}
  	function isForwardRef(object) {
  	  return typeOf(object) === REACT_FORWARD_REF_TYPE;
  	}
  	function isFragment(object) {
  	  return typeOf(object) === REACT_FRAGMENT_TYPE;
  	}
  	function isLazy(object) {
  	  return typeOf(object) === REACT_LAZY_TYPE;
  	}
  	function isMemo(object) {
  	  return typeOf(object) === REACT_MEMO_TYPE;
  	}
  	function isPortal(object) {
  	  return typeOf(object) === REACT_PORTAL_TYPE;
  	}
  	function isProfiler(object) {
  	  return typeOf(object) === REACT_PROFILER_TYPE;
  	}
  	function isStrictMode(object) {
  	  return typeOf(object) === REACT_STRICT_MODE_TYPE;
  	}
  	function isSuspense(object) {
  	  return typeOf(object) === REACT_SUSPENSE_TYPE;
  	}

  	reactIs_development.AsyncMode = AsyncMode;
  	reactIs_development.ConcurrentMode = ConcurrentMode;
  	reactIs_development.ContextConsumer = ContextConsumer;
  	reactIs_development.ContextProvider = ContextProvider;
  	reactIs_development.Element = Element;
  	reactIs_development.ForwardRef = ForwardRef;
  	reactIs_development.Fragment = Fragment;
  	reactIs_development.Lazy = Lazy;
  	reactIs_development.Memo = Memo;
  	reactIs_development.Portal = Portal;
  	reactIs_development.Profiler = Profiler;
  	reactIs_development.StrictMode = StrictMode;
  	reactIs_development.Suspense = Suspense;
  	reactIs_development.isAsyncMode = isAsyncMode;
  	reactIs_development.isConcurrentMode = isConcurrentMode;
  	reactIs_development.isContextConsumer = isContextConsumer;
  	reactIs_development.isContextProvider = isContextProvider;
  	reactIs_development.isElement = isElement;
  	reactIs_development.isForwardRef = isForwardRef;
  	reactIs_development.isFragment = isFragment;
  	reactIs_development.isLazy = isLazy;
  	reactIs_development.isMemo = isMemo;
  	reactIs_development.isPortal = isPortal;
  	reactIs_development.isProfiler = isProfiler;
  	reactIs_development.isStrictMode = isStrictMode;
  	reactIs_development.isSuspense = isSuspense;
  	reactIs_development.isValidElementType = isValidElementType;
  	reactIs_development.typeOf = typeOf;
  	  })();
  	}
  	return reactIs_development;
  }

  (function (module) {

  	{
  	  module.exports = requireReactIs_development();
  	}
  } (reactIs$1));

  var reactIs = reactIsExports;

  /**
   * Copyright 2015, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */
  var REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromError: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
  };
  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
  };
  var FORWARD_REF_STATICS = {
    '$$typeof': true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var MEMO_STATICS = {
    '$$typeof': true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

  function getStatics(component) {
    // React v16.11 and below
    if (reactIs.isMemo(component)) {
      return MEMO_STATICS;
    } // React v16.12 and above


    return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
  }

  var defineProperty = Object.defineProperty;
  var getOwnPropertyNames = Object.getOwnPropertyNames;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectPrototype = Object.prototype;
  function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
      // don't hoist over string (html) components
      if (objectPrototype) {
        var inheritedComponent = getPrototypeOf(sourceComponent);

        if (inheritedComponent && inheritedComponent !== objectPrototype) {
          hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
        }
      }

      var keys = getOwnPropertyNames(sourceComponent);

      if (getOwnPropertySymbols) {
        keys = keys.concat(getOwnPropertySymbols(sourceComponent));
      }

      var targetStatics = getStatics(targetComponent);
      var sourceStatics = getStatics(sourceComponent);

      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];

        if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
          var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

          try {
            // Avoid failures from read-only properties
            defineProperty(targetComponent, key, descriptor);
          } catch (e) {}
        }
      }
    }

    return targetComponent;
  }

  var hoistNonReactStatics_cjs = hoistNonReactStatics;

  var hoistStatics = function hoistStatics(higherOrderComponent, blacklist) {
    return function (BaseComponent) {
      var NewComponent = higherOrderComponent(BaseComponent);
      hoistNonReactStatics_cjs(NewComponent, BaseComponent, blacklist);
      return NewComponent;
    };
  };

  var lib = {};

  var createChangeEmitter_1;

  Object.defineProperty(lib, "__esModule", {
    value: true
  });
  createChangeEmitter_1 = lib.createChangeEmitter = function createChangeEmitter() {
    var currentListeners = [];
    var nextListeners = currentListeners;

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }

    function listen(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.');
      }

      var isSubscribed = true;

      ensureCanMutateNextListeners();
      nextListeners.push(listener);

      return function () {
        if (!isSubscribed) {
          return;
        }

        isSubscribed = false;

        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
      };
    }

    function emit() {
      currentListeners = nextListeners;
      var listeners = currentListeners;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].apply(listeners, arguments);
      }
    }

    return {
      listen: listen,
      emit: emit
    };
  };

  function symbolObservablePonyfill(root) {
  	var result;
  	var Symbol = root.Symbol;

  	if (typeof Symbol === 'function') {
  		if (Symbol.observable) {
  			result = Symbol.observable;
  		} else {

  			if (typeof Symbol.for === 'function') {
  				// This just needs to be something that won't trample other user's Symbol.for use
  				// It also will guide people to the source of their issues, if this is problematic.
  				// META: It's a resource locator!
  				result = Symbol.for('https://github.com/benlesh/symbol-observable');
  			} else {
  				// Symbol.for didn't exist! The best we can do at this point is a totally 
  				// unique symbol. Note that the string argument here is a descriptor, not
  				// an identifier. This symbol is unique.
  				result = Symbol('https://github.com/benlesh/symbol-observable');
  			}
  			try {
  				Symbol.observable = result;
  			} catch (err) {
  				// Do nothing. In some environments, users have frozen `Symbol` for security reasons,
  				// if it is frozen assigning to it will throw. In this case, we don't care, because
  				// they will need to use the returned value from the ponyfill.
  			}
  		}
  	} else {
  		result = '@@observable';
  	}

  	return result;
  }

  /* global window */

  var root;

  if (typeof self !== 'undefined') {
    root = self;
  } else if (typeof window !== 'undefined') {
    root = window;
  } else if (typeof global !== 'undefined') {
    root = global;
  } else if (typeof module !== 'undefined') {
    root = module;
  } else {
    root = Function('return this')();
  }

  var result = symbolObservablePonyfill(root);

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
          _this.propsEmitter = createChangeEmitter_1();
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
          }, _config$fromESObserva[result] = function () {
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
          }, _ref[result] = function () {
            return this;
          }, _ref;
        });
      };
    };
  };
  var mapPropsStream = function mapPropsStream(transform) {
    var hoc = mapPropsStreamWithConfig(config)(transform);
    {
      return function (BaseComponent) {
        return setDisplayName(wrapDisplayName(BaseComponent, 'mapPropsStream'))(hoc(BaseComponent));
      };
    }
  };

  var createEventHandlerWithConfig = function createEventHandlerWithConfig(config) {
    return function () {
      var _config$fromESObserva;
      var emitter = createChangeEmitter_1();
      var stream = config.fromESObservable((_config$fromESObserva = {
        subscribe: function subscribe(observer) {
          var unsubscribe = emitter.listen(function (value) {
            return observer.next(value);
          });
          return {
            unsubscribe: unsubscribe
          };
        }
      }, _config$fromESObserva[result] = function () {
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

}));
