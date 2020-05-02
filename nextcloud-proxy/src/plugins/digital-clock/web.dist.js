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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function getNow() {
  var offset = 2; // create Date object for current location

  var d = new Date(); // convert to msec
  // subtract local time zone offset
  // get UTC time in msec

  var utc = d.getTime() + d.getTimezoneOffset() * 60000; // create new Date object for different city
  // using supplied offset

  return new Date(utc + 3600000 * offset);
}

function create(value) {
  return _toConsumableArray(value.toString()).map(function (character) {
    var element = document.createElement("span");
    element.className = "character";
    element.innerText = character;
    return element;
  });
}

function join() {
  for (var _len = arguments.length, elements = new Array(_len), _key = 0; _key < _len; _key++) {
    elements[_key] = arguments[_key];
  }

  return elements.map(function (current) {
    if (current.toString() === "[object HTMLSpanElement]") return current;
    return document.createTextNode(current);
  });
}

function getCurrentHoursMinutesSeconds() {
  var date = getNow();
  var hours = date.getHours(); // 0 - 23

  var minutes = date.getMinutes(); // 0 - 59

  var seconds = date.getSeconds(); // 0 - 59

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

function getClockDigits() {
  var _getCurrentHoursMinut = getCurrentHoursMinutesSeconds(),
      hours = _getCurrentHoursMinut.hours,
      minutes = _getCurrentHoursMinut.minutes,
      seconds = _getCurrentHoursMinut.seconds; // create elements for each digit to avoid jumping of the ui when the 1 is shorter then the 0


  return join.apply(void 0, _toConsumableArray(create(hours)).concat([":"], _toConsumableArray(create(minutes)), [":"], _toConsumableArray(create(seconds))));
}

var digitalClock = "digital-clock";
var clockTemplate = document.createElement('template');
var digitTemplate = document.createElement('template');
clockTemplate.innerHTML = "\n<style>\n  .clock {\n    position: absolute;\n    bottom: 5px;\n    right: 5px;\n    width: 200px;\n    padding-top: 40px;\n    height: 60px;\n    font-size: 50px;\n    color: white;\n    opacity: 0.7;\n    text-align: right;\n    overflow: visible;\n    vertical-align: text-bottom;\n    z-index: 1000;\n}\nspan {\n    display:inline-block;\n}\n#hours, #minutes, #seconds {\n    margin-right:12px;\n}\n</style>\n<div id=\"clock\" class=\"clock\">\n    <span id=\"hours\">\n        <".concat(digitalClock, "-character digit=\"0\"></").concat(digitalClock, "-character>\n        <").concat(digitalClock, "-character digit=\"0\"></").concat(digitalClock, "-character>\n    </span><span class=\"sep\">:</span><span id=\"minutes\">\n        <").concat(digitalClock, "-character digit=\"0\"></").concat(digitalClock, "-character>\n        <").concat(digitalClock, "-character digit=\"0\"></").concat(digitalClock, "-character>\n    </span><span class=\"sep\">:</span><span id=\"seconds\">\n        <").concat(digitalClock, "-character digit=\"0\"></").concat(digitalClock, "-character>\n        <").concat(digitalClock, "-character digit=\"0\"></").concat(digitalClock, "-character>\n    </span>\n</div>\n");
digitTemplate.innerHTML = "\n<style>\n  .character {\n    display: inline-block;\n    width: 18px;\n    text-align: right;\n    padding: 5px 0;\n    overflow: visible;\n}\n</style>\n<span class=\"character\"></span>\n";

var ClockCharacter = /*#__PURE__*/function (_HTMLElement) {
  _inherits(ClockCharacter, _HTMLElement);

  function ClockCharacter() {
    var _this;

    _classCallCheck(this, ClockCharacter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ClockCharacter).call(this));
    _this.root = _this.attachShadow({
      mode: "closed"
    });

    _this.root.appendChild(digitTemplate.content.cloneNode(true));

    _this.character = _this.root.querySelector(".character");
    return _this;
  }

  _createClass(ClockCharacter, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName === "digit" && oldVal !== newVal) {
        this.setAttribute(attrName, newVal);

        this._showDigit();
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this._showDigit();
    }
  }, {
    key: "_showDigit",
    value: function _showDigit() {
      this.character.innerText = this.getAttribute("digit");
    }
  }, {
    key: "digit",
    get: function get() {
      return this.getAttribute("digit");
    },
    set: function set(value) {
      this.setAttribute("digit", value);
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['digit'];
    }
  }]);

  return ClockCharacter;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

var DigitalClock = /*#__PURE__*/function (_HTMLElement2) {
  _inherits(DigitalClock, _HTMLElement2);

  function DigitalClock() {
    var _this2;

    _classCallCheck(this, DigitalClock);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DigitalClock).call(this));
    _this2.root = _this2.attachShadow({
      mode: "closed"
    });

    _this2.root.appendChild(clockTemplate.content.cloneNode(true));

    _this2.clockContainer = _this2.root.getElementById("clock"); // register in dashboards event loop

    registerHandler(digitalClock, {
      ticks: 5,
      duration: 5,
      run: function run() {
        return _this2._showTime();
      }
    });
    return _this2;
  }

  _createClass(DigitalClock, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this._showTime();
    }
  }, {
    key: "_showTime",
    value: function _showTime() {
      var _this3 = this;

      try {
        var time = getCurrentHoursMinutesSeconds();
        ["hours", "minutes", "seconds"].forEach(function (slot) {
          var clockCharacters = _this3.clockContainer.querySelectorAll("#".concat(slot, " ").concat(digitalClock, "-character"));

          _toConsumableArray(time[slot].toString()).map(function (digit, index) {
            clockCharacters[index].digit = digit;
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }]);

  return DigitalClock;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

window.customElements.define("".concat(digitalClock, "-character"), ClockCharacter);
window.customElements.define(digitalClock, DigitalClock);