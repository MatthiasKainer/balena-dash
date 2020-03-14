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

var clockTemplate = document.createElement('template');
var id = "date-set-reminder";
var reminderBasePath = "/".concat(id);
var reminderUrl = "".concat(reminderBasePath, "/reminder");
clockTemplate.innerHTML = "\n<link media=\"all\" rel=\"stylesheet\" href=\"".concat(reminderBasePath, "/css\">\n  <div id=\"container\">\n        <div id=\"error-box\">\n            <div class=\"dot\"></div>\n            <div class=\"dot two\"></div>\n            <div class=\"face2\">\n                <div class=\"eye\"></div>\n                <div class=\"eye right\"></div>\n                <div class=\"mouth sad\"></div>\n            </div>\n            <div class=\"shadow move\"></div>\n            <div class=\"message\">\n                <h1 class=\"alert\">This is the headline</h1>\n                <p>This is the text</p>\n            </div>\n            <button class=\"button-box\">\n                <h1 class=\"red\">YES I DID</h1>\n            </button>\n        </div>\n    </div>\n");

var DateSetReminder = /*#__PURE__*/function (_HTMLElement) {
  _inherits(DateSetReminder, _HTMLElement);

  function DateSetReminder() {
    var _this;

    _classCallCheck(this, DateSetReminder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateSetReminder).call(this));
    registerHandler(id, {
      ticks: 1500,
      duration: 1500,
      run: function run() {
        return _this._reminders();
      }
    });
    _this.root = _this.attachShadow({
      mode: "open"
    });

    _this.root.appendChild(clockTemplate.content.cloneNode(true));

    _this.container = _this.root.querySelector("#container");
    ["click", "touchstart", "touchend", "touchmove"].forEach(function (eventType) {
      _this.container.addEventListener(eventType, function () {
        _this.container.style.display = "none";
        fetch(reminderUrl, {
          method: "DELETE"
        });
        registeredHandlers[id].stopped = false;
      });
    });
    return _this;
  }

  _createClass(DateSetReminder, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this._reminders();
    }
  }, {
    key: "_reminders",
    value: function _reminders() {
      var _this2 = this;

      fetch(reminderUrl).then(function (response) {
        return response.json();
      }).then(function (activeReminder) {
        if (activeReminder !== null && !activeReminder.__empty) {
          var headline = activeReminder.headline,
              text = activeReminder.text;
          _this2.container.querySelector(".message h1").innerText = headline;
          _this2.container.querySelector(".message p").innerText = text;
          _this2.container.style.display = "block";
          registeredHandlers[id].stopped = true;
        }
      });
    }
  }]);

  return DateSetReminder;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

window.customElements.define(id, DateSetReminder);