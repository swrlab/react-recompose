"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports["default"] = void 0;
var _symbolObservable = _interopRequireDefault(require("symbol-observable"));
var Bacon = _interopRequireWildcard(require("baconjs"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var config = {
  fromESObservable: function fromESObservable(observable) {
    return Bacon.fromBinder(function (sink) {
      var _observable$subscribe = observable.subscribe({
          next: function next(val) {
            return sink(new Bacon.Next(val));
          },
          error: function error(err) {
            return sink(new Bacon.Error(err));
          },
          complete: function complete() {
            return sink(new Bacon.End());
          }
        }),
        unsubscribe = _observable$subscribe.unsubscribe;
      return unsubscribe;
    });
  },
  toESObservable: function toESObservable(stream) {
    var _ref;
    return _ref = {
      subscribe: function subscribe(observer) {
        var unsubscribe = stream.subscribe(function (event) {
          if (event.hasValue) {
            observer.next(event.value);
          } else if (event.isError) {
            observer.error(event.error);
          } else if (event.isEnd) {
            observer.complete();
          }
        });
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[_symbolObservable["default"]] = function () {
      return this;
    }, _ref;
  }
};
var _default = config;
exports["default"] = _default;