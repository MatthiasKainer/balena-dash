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
var key = "nextcloud-gallery";
var nextcloudUrl = "/".concat(key, "/next");
clockTemplate.innerHTML = "\n  <style>\n  .background {\n    width: 100%;\n    height: 100%;\n    background: no-repeat center center fixed;\n    background-size: contain;\n    background-image: url(\"/".concat(key, "/random.jpg\");\n    -webkit-transition-property: background-image 1.5s ease-in 1.5s;\n    -moz-transition-property: background-image 1.5s ease-in 1.5s;\n    -o-transition-property: background-image 1.5s ease-in 1.5s;\n    transition: background-image 1.5s ease-in 1.5s;\n    will-change: transition;\n\n}\n  </style>\n  <div class=\"background\"></div>\n");

var NextCloudGallery = /*#__PURE__*/function (_HTMLElement) {
  _inherits(NextCloudGallery, _HTMLElement);

  function NextCloudGallery() {
    var _this;

    _classCallCheck(this, NextCloudGallery);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NextCloudGallery).call(this));
    _this._backgroundImage = "/".concat(key, "/random.jpg");
    registerHandler("nextcloud-gallery", {
      ticks: 1500,
      duration: 1500,
      run: function run() {
        return _this._changeBackgroundImage();
      }
    });
    ["click", "touchstart", "touchend", "touchmove"].forEach(function (eventType) {
      _this.addEventListener(eventType, function () {
        registeredHandlers["nextcloud-gallery"].ticks = 0;
      });
    });
    _this.root = _this.attachShadow({
      mode: "open"
    });

    _this.root.appendChild(clockTemplate.content.cloneNode(true));

    return _this;
  }

  _createClass(NextCloudGallery, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this._updateRendering();
    }
  }, {
    key: "_changeBackgroundImage",
    value: function _changeBackgroundImage() {
      var _this2 = this;

      try {
        fetch(nextcloudUrl).then(function (response) {
          return response.json();
        }).then(function (myJson) {
          _this2._backgroundImage = myJson.result;

          _this2._updateRendering();
        });
      } catch (err) {}
    }
  }, {
    key: "_updateRendering",
    value: function _updateRendering() {
      var div = this.root.querySelector(".background");
      div.style.backgroundImage = "url(\"".concat(this._backgroundImage, "\")");
    }
  }]);

  return NextCloudGallery;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

window.customElements.define(key, NextCloudGallery);