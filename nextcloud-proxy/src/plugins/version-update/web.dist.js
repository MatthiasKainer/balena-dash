"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var versionUpgrade = "version-upgrade";
var versionUrl = "/".concat(versionUpgrade, "/version");

var timeElapsed = function timeElapsed(a) {
  return Math.floor((a - new Date(Date.now())) / 1000 * 60 * 60 * 24);
};

var nextRefresh = function nextRefresh() {
  var result = new Date(Date.now().getFullYear(), Date.now().getMonth(), Date.now().getDay(), 0, 0, 0);
  result.setDate(result.getDate() + 1);
  return result;
};

var doRefresh = function doRefresh(date) {
  return new Date(Date.now()) > date;
};

var VersionUpgrade = /*#__PURE__*/function (_HTMLElement) {
  _inherits(VersionUpgrade, _HTMLElement);

  function VersionUpgrade() {
    var _this;

    _classCallCheck(this, VersionUpgrade);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VersionUpgrade).call(this));

    _defineProperty(_assertThisInitialized(_this), "currentVersion", undefined);

    _defineProperty(_assertThisInitialized(_this), "nextPlannedRefresh", undefined);

    registerHandler(versionUpgrade, {
      ticks: 1500,
      duration: 1500,
      run: function run() {
        return _this._compare();
      }
    });
    return _this;
  }

  _createClass(VersionUpgrade, [{
    key: "_compare",
    value: function _compare() {
      var _this2 = this;

      fetch(versionUrl).then(function (response) {
        return response.json();
      }).then(function (_ref) {
        var version = _ref.version;

        if (!_this2.currentVersion) {
          _this2.nextPlannedRefresh = nextRefresh();
          _this2.currentVersion = version;
        }

        if (_this2.currentVersion !== version) {
          window.location.reload();
        } else if (doRefresh(_this2.nextPlannedRefresh)) {
          window.location.reload();
        }
      });
    }
  }]);

  return VersionUpgrade;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

window.customElements.define(versionUpgrade, VersionUpgrade);