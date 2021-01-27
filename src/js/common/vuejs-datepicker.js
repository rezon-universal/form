(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.vuejsDatepicker = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var Language =
  /*#__PURE__*/
  function () {
    function Language(language, months, monthsAbbr, days) {
      _classCallCheck(this, Language);

      this.language = language;
      this.months = months;
      this.monthsAbbr = monthsAbbr;
      this.days = days;
      this.rtl = false;
      this.ymd = false;
      this.yearSuffix = '';
    }

    _createClass(Language, [{
      key: "language",
      get: function get() {
        return this._language;
      },
      set: function set(language) {
        if (typeof language !== 'string') {
          throw new TypeError('Language must be a string');
        }

        this._language = language;
      }
    }, {
      key: "months",
      get: function get() {
        return this._months;
      },
      set: function set(months) {
        if (months.length !== 12) {
          throw new RangeError("There must be 12 months for ".concat(this.language, " language"));
        }

        this._months = months;
      }
    }, {
      key: "monthsAbbr",
      get: function get() {
        return this._monthsAbbr;
      },
      set: function set(monthsAbbr) {
        if (monthsAbbr.length !== 12) {
          throw new RangeError("There must be 12 abbreviated months for ".concat(this.language, " language"));
        }

        this._monthsAbbr = monthsAbbr;
      }
    }, {
      key: "days",
      get: function get() {
        return this._days;
      },
      set: function set(days) {
        if (days.length !== 7) {
          throw new RangeError("There must be 7 days for ".concat(this.language, " language"));
        }

        this._days = days;
      }
    }]);

    return Language;
  }(); // eslint-disable-next-line

  var en = new Language('English', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) // eslint-disable-next-line
  ;

  var utils = {
    /**
     * @type {Boolean}
     */
    useUtc: false,

    /**
     * Returns the full year, using UTC or not
     * @param {Date} date
     */
    getFullYear: function getFullYear(date) {
      return this.useUtc ? date.getUTCFullYear() : date.getFullYear();
    },

    /**
     * Returns the month, using UTC or not
     * @param {Date} date
     */
    getMonth: function getMonth(date) {
      return this.useUtc ? date.getUTCMonth() : date.getMonth();
    },

    /**
     * Returns the date, using UTC or not
     * @param {Date} date
     */
    getDate: function getDate(date) {
      return this.useUtc ? date.getUTCDate() : date.getDate();
    },

    /**
     * Returns the day, using UTC or not
     * @param {Date} date
     */
    getDay: function getDay(date) {
      return this.useUtc ? date.getUTCDay() : date.getDay();
    },

    /**
     * Returns the hours, using UTC or not
     * @param {Date} date
     */
    getHours: function getHours(date) {
      return this.useUtc ? date.getUTCHours() : date.getHours();
    },

    /**
     * Returns the minutes, using UTC or not
     * @param {Date} date
     */
    getMinutes: function getMinutes(date) {
      return this.useUtc ? date.getUTCMinutes() : date.getMinutes();
    },

    /**
     * Sets the full year, using UTC or not
     * @param {Date} date
     */
    setFullYear: function setFullYear(date, value, useUtc) {
      return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value);
    },

    /**
     * Sets the month, using UTC or not
     * @param {Date} date
     */
    setMonth: function setMonth(date, value, useUtc) {
      return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value);
    },

    /**
     * Sets the date, using UTC or not
     * @param {Date} date
     * @param {Number} value
     */
    setDate: function setDate(date, value, useUtc) {
      return this.useUtc ? date.setUTCDate(value) : date.setDate(value);
    },

    /**
     * Check if date1 is equivalent to date2, without comparing the time
     * @see https://stackoverflow.com/a/6202196/4455925
     * @param {Date} date1
     * @param {Date} date2
     */
    compareDates: function compareDates(date1, date2) {
      var d1 = new Date(date1.getTime());
      var d2 = new Date(date2.getTime());

      if (this.useUtc) {
        d1.setUTCHours(0, 0, 0, 0);
        d2.setUTCHours(0, 0, 0, 0);
      } else {
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
      }

      return d1.getTime() === d2.getTime();
    },

    /**
     * Validates a date object
     * @param {Date} date - an object instantiated with the new Date constructor
     * @return {Boolean}
     */
    isValidDate: function isValidDate(date) {
      if (Object.prototype.toString.call(date) !== '[object Date]') {
        return false;
      }

      return !isNaN(date.getTime());
    },

    /**
     * Return abbreviated week day name
     * @param {Date}
     * @param {Array}
     * @return {String}
     */
    getDayNameAbbr: function getDayNameAbbr(date, days) {
      if (_typeof(date) !== 'object') {
        throw TypeError('Invalid Type');
      }

      return days[this.getDay(date)];
    },

    /**
     * Return name of the month
     * @param {Number|Date}
     * @param {Array}
     * @return {String}
     */
    getMonthName: function getMonthName(month, months) {
      if (!months) {
        throw Error('missing 2nd parameter Months array');
      }

      if (_typeof(month) === 'object') {
        return months[this.getMonth(month)];
      }

      if (typeof month === 'number') {
        return months[month];
      }

      throw TypeError('Invalid type');
    },

    /**
     * Return an abbreviated version of the month
     * @param {Number|Date}
     * @return {String}
     */
    getMonthNameAbbr: function getMonthNameAbbr(month, monthsAbbr) {
      if (!monthsAbbr) {
        throw Error('missing 2nd paramter Months array');
      }

      if (_typeof(month) === 'object') {
        return monthsAbbr[this.getMonth(month)];
      }

      if (typeof month === 'number') {
        return monthsAbbr[month];
      }

      throw TypeError('Invalid type');
    },

    /**
     * Alternative get total number of days in month
     * @param {Number} year
     * @param {Number} m
     * @return {Number}
     */
    daysInMonth: function daysInMonth(year, month) {
      return /8|3|5|10/.test(month) ? 30 : month === 1 ? !(year % 4) && year % 100 || !(year % 400) ? 29 : 28 : 31;
    },

    /**
     * Get nth suffix for date
     * @param {Number} day
     * @return {String}
     */
    getNthSuffix: function getNthSuffix(day) {
      switch (day) {
        case 1:
        case 21:
        case 31:
          return 'st';

        case 2:
        case 22:
          return 'nd';

        case 3:
        case 23:
          return 'rd';

        default:
          return 'th';
      }
    },

    /**
     * Formats date object
     * @param {Date}
     * @param {String}
     * @param {Object}
     * @return {String}
     */
    formatDate: function formatDate(date, format, translation) {
      translation = !translation ? en : translation;
      var year = this.getFullYear(date);
      var month = this.getMonth(date) + 1;
      var day = this.getDate(date);
      var str = format.replace(/dd/, ('0' + day).slice(-2)).replace(/d/, day).replace(/yyyy/, year).replace(/yy/, String(year).slice(2)).replace(/MMMM/, this.getMonthName(this.getMonth(date), translation.months)).replace(/MMM/, this.getMonthNameAbbr(this.getMonth(date), translation.monthsAbbr)).replace(/MM/, ('0' + month).slice(-2)).replace(/M(?!a|ä|e)/, month).replace(/su/, this.getNthSuffix(this.getDate(date))).replace(/D(?!e|é|i)/, this.getDayNameAbbr(date, translation.days));
      return str;
    },

    /**
     * Creates an array of dates for each day in between two dates.
     * @param {Date} start
     * @param {Date} end
     * @return {Array}
     */
    createDateArray: function createDateArray(start, end) {
      var dates = [];

      while (start <= end) {
        dates.push(new Date(start));
        start = this.setDate(new Date(start), this.getDate(new Date(start)) + 1);
      }

      return dates;
    },

    /**
     * method used as a prop validator for input values
     * @param {*} val
     * @return {Boolean}
     */
    validateDateInput: function validateDateInput(val) {
      return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number';
    },

    /**
     * Return new Date object without day of month and without time
     * @param {*} val
     * @return {Boolean}
     */
    getUtcMonthDate: function getUtcMonthDate(val) {
      return new Date(Date.UTC(val.getUTCFullYear(), val.getUTCMonth(), 1));
    },
    intlFormatter: new Intl.DateTimeFormat('ru-Ru'),
    dateTimeToString: function dateTimeToString(val) {
      return this.intlFormatter.format(val);
    }
  };
  var makeDateUtils = function makeDateUtils(useUtc) {
    return _objectSpread({}, utils, {
      useUtc: useUtc
    });
  };
  var utils$1 = _objectSpread({}, utils) // eslint-disable-next-line
  ;

  var script = {
    props: {
      selectedDate: Date,
      resetTypedDate: [Date],
      format: [String, Function],
      translation: Object,
      inline: Boolean,
      id: String,
      name: String,
      refName: String,
      openDate: Number,
      placeholder: String,
      inputClass: [String, Object, Array],
      clearButton: Boolean,
      clearButtonIcon: String,
      calendarButton: Boolean,
      calendarButtonIcon: String,
      calendarButtonIconContent: String,
      disabled: Boolean,
      required: Boolean,
      typeable: Boolean,
      bootstrapStyling: Boolean,
      useUtc: Boolean,
      showDayView: Boolean
    },
    data: function data() {
      var constructedDateUtils = makeDateUtils(this.useUtc);
      return {
        input: null,
        typedDate: false,
        utils: constructedDateUtils
      };
    },
    computed: {
      formattedValue: function formattedValue() {
        if (!this.selectedDate) {
          return null;
        }

        if (this.typedDate) {
          return this.typedDate;
        }

        return typeof this.format === 'function' ? this.format(this.selectedDate) : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation);
      },
      computedInputClass: function computedInputClass() {
        if (this.bootstrapStyling) {
          if (typeof this.inputClass === 'string') {
            return [this.inputClass, 'form-control'].join(' ');
          }

          return _objectSpread({
            'form-control': true
          }, this.inputClass);
        }

        return this.inputClass;
      }
    },
    watch: {
      resetTypedDate: function resetTypedDate() {
        this.typedDate = false;
      }
    },
    methods: {
      toggleCalendar: function toggleCalendar() {
        this.$emit('toggleCalendar');
      },
      closeCalendar: function closeCalendar() {
        this.$emit('closeCalendar');
      },

      /**
       * Attempt to parse a typed date
       * @param {Event} event
       */
      parseTypedDate: function parseTypedDate(event) {
        // close calendar if escape or enter are pressed
        if ([27, // escape
        13 // enter
        ].includes(event.keyCode)) {
          this.input.blur();
        }

        if (this.typeable) {
          var typedDate = Date.parse(this.input.value);

          if (!isNaN(typedDate)) {
            this.typedDate = this.input.value;
            this.$emit('typedDate', new Date(this.typedDate));
          }
        }
      },

      /**
       * nullify the typed date to defer to regular formatting
       * called once the input is blurred
       */
      inputBlurred: function inputBlurred() {
        if (this.typeable && isNaN(Date.parse(this.input.value))) {
          this.clearDate();
          this.input.value = null;
          this.typedDate = null;
          this.$emit('closeCalendar');
        }
      },
      inputFocused: function inputFocused() {
        var it = this;
        setTimeout(function () {
          if (!it.showDayView) it.$emit('showCalendar');
        }, 100);
      },

      /**
       * emit a clearDate event
       */
      clearDate: function clearDate() {
        this.$emit('clearDate');
      }
    },
    mounted: function mounted() {
      this.input = this.$el.querySelector('input');
    }
  } // eslint-disable-next-line
  ;

  /* script */
              const __vue_script__ = script;
              
  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { class: { "input-group": _vm.bootstrapStyling } },
      [
        _vm.calendarButton
          ? _c(
              "span",
              {
                staticClass: "dvdp-datepicker__calendar-button",
                class: { "input-group-prepend": _vm.bootstrapStyling },
                style: { "cursor:not-allowed;": _vm.disabled },
                on: { click: _vm.toggleCalendar }
              },
              [
                _c(
                  "span",
                  { class: { "input-group-text": _vm.bootstrapStyling } },
                  [
                    _c("i", { class: _vm.calendarButtonIcon }, [
                      _vm._v(
                        "\n        " +
                          _vm._s(_vm.calendarButtonIconContent) +
                          "\n        "
                      ),
                      !_vm.calendarButtonIcon
                        ? _c("span", [_vm._v("…")])
                        : _vm._e()
                    ])
                  ]
                )
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _c("input", {
          ref: _vm.refName,
          class: _vm.computedInputClass,
          attrs: {
            type: _vm.inline ? "hidden" : "text",
            name: _vm.name,
            id: _vm.id,
            placeholder: _vm.placeholder,
            "clear-button": _vm.clearButton,
            disabled: _vm.disabled,
            required: _vm.required,
            readonly: !_vm.typeable,
            autocomplete: "off"
          },
          domProps: { value: _vm.formattedValue },
          on: {
            click: _vm.toggleCalendar,
            keyup: _vm.parseTypedDate,
            focus: _vm.inputFocused,
            blur: _vm.inputBlurred,
            keydown: function($event) {
              if (
                !$event.type.indexOf("key") &&
                _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")
              ) {
                return null
              }
              return _vm.closeCalendar($event)
            }
          }
        }),
        _vm._v(" "),
        _vm.clearButton && _vm.selectedDate
          ? _c(
              "span",
              {
                staticClass: "dvdp-datepicker__clear-button",
                class: { "input-group-append": _vm.bootstrapStyling },
                on: {
                  click: function($event) {
                    return _vm.clearDate()
                  }
                }
              },
              [
                _c(
                  "span",
                  { class: { "input-group-text": _vm.bootstrapStyling } },
                  [
                    _c("i", { class: _vm.clearButtonIcon }, [
                      !_vm.clearButtonIcon ? _c("span", [_vm._v("×")]) : _vm._e()
                    ])
                  ]
                )
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _vm._t("afterDateInput")
      ],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* component normalizer */
    function __vue_normalize__(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      const component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "C:\\Projects\\vuejs-datepicker\\src\\components\\DateInput.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) component.functional = true;
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var DateInput = __vue_normalize__(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__);

  //
  var script$1 = {
    props: {
      selectedDate: Date,
      pageDate: Date,
      pageTimestamp: Number,
      fullMonthName: Boolean,
      disabledDates: Object,
      highlighted: Object,
      translation: Object,
      isRtl: Boolean,
      mondayFirst: Boolean,
      useUtc: Boolean,
      showMonthesSelect: Boolean
    },
    data: function data() {
      var constructedDateUtils = makeDateUtils(this.useUtc);
      return {
        utils: constructedDateUtils
      };
    },
    computed: {
      /**
       * Returns an array of day names
       * @return {String[]}
       */
      daysOfWeek: function daysOfWeek() {
        if (this.mondayFirst) {
          var tempDays = this.translation.days.slice();
          tempDays.push(tempDays.shift());
          return tempDays;
        }

        return this.translation.days;
      },

      /**
       * Returns the day number of the week less one for the first of the current month
       * Used to show amount of empty cells before the first in the day calendar layout
       * @return {Number}
       */
      blankDays: function blankDays() {
        var d = this.pageDate;
        var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());

        if (this.mondayFirst) {
          return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6;
        }

        return this.utils.getDay(dObj);
      },

      /**
       * @return {Object[]}
       */
      days: function days() {
        var d = this.pageDate;
        var days = []; // set up a new date object to the beginning of the current 'page'

        var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
        var daysInMonth = this.utils.daysInMonth(this.utils.getFullYear(dObj), this.utils.getMonth(dObj));

        for (var i = 0; i < daysInMonth; i++) {
          days.push({
            key: this.utils.dateTimeToString(dObj),
            date: this.utils.getDate(dObj),
            timestamp: dObj.getTime(),
            isSelected: this.isSelectedDate(dObj),
            isDisabled: this.isDisabledDate(dObj),
            isHighlighted: this.isHighlightedDate(dObj),
            isHighlightStart: this.isHighlightStart(dObj),
            isHighlightEnd: this.isHighlightEnd(dObj),
            isToday: this.utils.compareDates(dObj, new Date()),
            isWeekend: this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
            isSaturday: this.utils.getDay(dObj) === 6,
            isSunday: this.utils.getDay(dObj) === 0
          });
          this.utils.setDate(dObj, this.utils.getDate(dObj) + 1);
        }

        return days;
      },

      /**
       * Gets the name of the month the current page is on
       * @return {String}
       */
      currMonthName: function currMonthName() {
        var monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr;
        return this.utils.getMonthNameAbbr(this.utils.getMonth(this.pageDate), monthName);
      },

      /**
       * Gets the name of the year that current page is on
       * @return {Number}
       */
      currYearName: function currYearName() {
        var yearSuffix = this.translation.yearSuffix;
        return "".concat(this.utils.getFullYear(this.pageDate)).concat(yearSuffix);
      },

      /**
       * Is this translation using year/month/day format?
       * @return {Boolean}
       */
      isYmd: function isYmd() {
        return this.translation.ymd && this.translation.ymd === true;
      }
    },
    methods: {
      selectDate: function selectDate(date) {
        if (date.isDisabled) {
          this.$emit('selectedDisabled', date);
          return false;
        }

        this.$emit('selectDate', date);
      },

      /**
       * @return {Number}
       */
      getPageMonth: function getPageMonth() {
        return this.utils.getMonth(this.pageDate);
      },

      /**
       * Whether a day is selected
       * @param {Date}
       * @return {Boolean}
       */
      isSelectedDate: function isSelectedDate(dObj) {
        return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj);
      },

      /**
       * Whether a day is disabled
       * @param {Date}
       * @return {Boolean}
       */
      isDisabledDate: function isDisabledDate(date) {
        var _this = this;

        var disabledDates = false;

        if (typeof this.disabledDates === 'undefined') {
          return false;
        }

        if (typeof this.disabledDates.dates !== 'undefined') {
          this.disabledDates.dates.forEach(function (d) {
            if (_this.utils.compareDates(date, d)) {
              disabledDates = true;
              return true;
            }
          });
        }

        if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to && date < this.disabledDates.to) {
          disabledDates = true;
        }

        if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from && date > this.disabledDates.from) {
          disabledDates = true;
        }

        if (typeof this.disabledDates.ranges !== 'undefined') {
          this.disabledDates.ranges.forEach(function (range) {
            if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
              if (date < range.to && date > range.from) {
                disabledDates = true;
                return true;
              }
            }
          });
        }

        if (typeof this.disabledDates.days !== 'undefined' && this.disabledDates.days.indexOf(this.utils.getDay(date)) !== -1) {
          disabledDates = true;
        }

        if (typeof this.disabledDates.daysOfMonth !== 'undefined' && this.disabledDates.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
          disabledDates = true;
        }

        if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
          disabledDates = true;
        }

        return disabledDates;
      },

      /**
       * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
       * @param {Date}
       * @return {Boolean}
       */
      isHighlightedDate: function isHighlightedDate(date) {
        var _this2 = this;

        if (!(this.highlighted && this.highlighted.includeDisabled) && this.isDisabledDate(date)) {
          return false;
        }

        var highlighted = false;

        if (typeof this.highlighted === 'undefined') {
          return false;
        }

        if (typeof this.highlighted.dates !== 'undefined') {
          this.highlighted.dates.forEach(function (d) {
            if (_this2.utils.compareDates(date, d)) {
              highlighted = true;
              return true;
            }
          });
        }

        if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
          highlighted = date >= this.highlighted.from && date <= this.highlighted.to;
        }

        if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(this.utils.getDay(date)) !== -1) {
          highlighted = true;
        }

        if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
          highlighted = true;
        }

        if (typeof this.highlighted.customPredictor === 'function' && this.highlighted.customPredictor(date)) {
          highlighted = true;
        }

        return highlighted;
      },
      dayClasses: function dayClasses(day) {
        return {
          'cell': true,
          'day': true,
          'selected': day.isSelected,
          'disabled': day.isDisabled,
          'highlighted': day.isHighlighted || day.isHighlightStart || day.isHighlightEnd,
          'today': day.isToday,
          'weekend': day.isWeekend,
          'sat': day.isSaturday,
          'sun': day.isSunday,
          'highlight-start': day.isHighlightStart,
          'highlight-end': day.isHighlightEnd
        };
      },

      /**
       * Whether a day is highlighted and it is the first date
       * in the highlighted range of dates
       * @param {Date}
       * @return {Boolean}
       */
      isHighlightStart: function isHighlightStart(date) {
        return this.highlighted && this.highlighted.from instanceof Date && this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date) && this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date) && this.utils.getDate(this.highlighted.from) === this.utils.getDate(date);
      },

      /**
       * Whether a day is highlighted and it is the first date
       * in the highlighted range of dates
       * @param {Date}
       * @return {Boolean}
       */
      isHighlightEnd: function isHighlightEnd(date) {
        return this.highlighted && this.highlighted.to instanceof Date && this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date) && this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date) && this.utils.getDate(this.highlighted.to) === this.utils.getDate(date);
      },

      /**
       * Helper
       * @param  {mixed}  prop
       * @return {Boolean}
       */
      isDefined: function isDefined(prop) {
        return typeof prop !== 'undefined' && prop;
      }
    } // eslint-disable-next-line

  };

  /* script */
              const __vue_script__$1 = script$1;
              
  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c(
        "header",
        [
          _c("div", { staticClass: "day__month_btn" }, [
            _vm._v(
              "\n      " +
                _vm._s(_vm.isYmd ? _vm.currYearName : _vm.currMonthName) +
                " " +
                _vm._s(_vm.isYmd ? _vm.currMonthName : _vm.currYearName) +
                "\n      "
            ),
            _vm.showMonthesSelect
              ? _c(
                  "svg",
                  {
                    attrs: {
                      width: "6",
                      height: "9",
                      fill: "currentColor",
                      xmlns: "http://www.w3.org/2000/svg"
                    }
                  },
                  [
                    _c("path", {
                      attrs: {
                        "fill-rule": "evenodd",
                        "clip-rule": "evenodd",
                        d:
                          "M5 4l1-1-3-3-3 3 1 1 2-2 2 2zM1 5L0 6l3 3 3-3-1-1-2 2-2-2z",
                        fill: "currentColor"
                      }
                    })
                  ]
                )
              : _vm._e()
          ]),
          _vm._v(" "),
          _vm.showMonthesSelect ? _vm._t("monthes-select") : _vm._e()
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "div",
        { class: _vm.isRtl ? "flex-rtl" : "" },
        [
          _vm._l(_vm.daysOfWeek, function(d) {
            return _c(
              "span",
              { key: d.timestamp, staticClass: "cell day-header" },
              [_vm._v(_vm._s(d))]
            )
          }),
          _vm._v(" "),
          _vm.blankDays > 0
            ? _vm._l(_vm.blankDays, function(d) {
                return _c("span", {
                  key: d.timestamp,
                  staticClass: "cell day blank"
                })
              })
            : _vm._e(),
          _vm._l(_vm.days, function(day) {
            return [
              _vm._t(
                "dayCellContent",
                [
                  _c(
                    "span",
                    {
                      class: _vm.dayClasses(day),
                      on: {
                        click: function($event) {
                          return _vm.selectDate(day)
                        }
                      }
                    },
                    [_vm._v(_vm._s(day.date))]
                  )
                ],
                {
                  day: day,
                  classes: _vm.dayClasses(day),
                  dayEvents: {
                    click: function() {
                      _vm.selectDate(day);
                    }
                  }
                }
              )
            ]
          })
        ],
        2
      )
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* component normalizer */
    function __vue_normalize__$1(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      const component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "C:\\Projects\\vuejs-datepicker\\src\\components\\PickerDay.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) component.functional = true;
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var PickerDay = __vue_normalize__$1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1);

  var script$2 = {
    components: {
      PickerDay: PickerDay
    },
    props: {
      calendarClass: [String, Object, Array],
      calendarStyle: Object,
      // To PickerDay
      pageDate: Date,
      selectedDate: Date,
      fullMonthName: Boolean,
      disabledDates: Object,
      highlighted: Object,
      translation: Object,
      pageTimestamp: Number,
      isRtl: Boolean,
      mondayFirst: Boolean,
      useUtc: Boolean,
      cols: Number,
      rows: Number,
      showMonthesSelect: Boolean
    },
    data: function data() {
      var constructedDateUtils = makeDateUtils(this.useUtc);
      return {
        utils: constructedDateUtils
      };
    },
    computed: {
      //Отображаемые блоки с месяцами
      months: function months() {
        var d = this.pageDate;
        var months = []; // set up a new date object to the beginning of the current 'page'

        var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())) : new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());

        for (var i = 0; i < this.cols * this.rows; i++) {
          var timeStamp = dObj.getTime();
          months.push({
            pageDate: new Date(timeStamp),
            timestamp: timeStamp,
            selectedOption: this.utils.getFullYear(dObj) + '-' + this.utils.getMonth(dObj)
          });
          this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1);
        }

        return months;
      },
      //Опции для select-бокса выбора месяца
      monthesSelectOptions: function monthesSelectOptions() {
        var _this = this;

        var d = this.pageDate;
        var maxMonthesInSelect = 13;

        var getOption = function getOption(date) {
          var month = _this.utils.getMonth(date);

          var year = _this.utils.getFullYear(date);

          return {
            name: _this.utils.getMonthName(month, _this.translation.months),
            year: year,
            month: month,
            key: year + '-' + month
          };
        };

        var months = [];
        var dBackwardObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())) : new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
        var dTowardObs = new Date(dBackwardObj.getTime()); //Бежим по датам "назад"

        var disabledToMonthTime = this.disabledDates && this.disabledDates.to ? this.utils.getUtcMonthDate(this.disabledDates.to).getTime() : undefined;

        for (var i = 0; i < maxMonthesInSelect; i++) {
          this.utils.setMonth(dBackwardObj, this.utils.getMonth(dBackwardObj) - 1); //Is date Disabled

          if (disabledToMonthTime && this.utils.getUtcMonthDate(dBackwardObj).getTime() < disabledToMonthTime) break;
          months.unshift(getOption(dBackwardObj));
        } //Добавляем текущий месяц


        months.push(getOption(d)); //Бежим по датам "туда"

        var disabledFromMonthTime = this.disabledDates && this.disabledDates.from ? this.utils.getUtcMonthDate(this.disabledDates.from).getTime() : undefined;

        for (var _i = 0; _i < maxMonthesInSelect; _i++) {
          this.utils.setMonth(dTowardObs, this.utils.getMonth(dTowardObs) + 1); //Is date Disabled

          if (disabledFromMonthTime && this.utils.getUtcMonthDate(dTowardObs).getTime() > disabledFromMonthTime) break;
          months.push(getOption(dTowardObs));
        } //group by year


        var group = months.reduce(function (r, a) {
          r[a.year] = [].concat(_toConsumableArray(r[a.year] || []), [a]);
          return r;
        }, {});
        return group;
      },

      /**
       * Is the left hand navigation button disabled?
       * @return {Boolean}
       */
      isLeftNavDisabled: function isLeftNavDisabled() {
        return this.isRtl ? this.isNextMonthDisabled(this.pageTimestamp) : this.isPreviousMonthDisabled(this.pageTimestamp);
      },

      /**
       * Is the right hand navigation button disabled?
       * @return {Boolean}
       */
      isRightNavDisabled: function isRightNavDisabled() {
        return this.isRtl ? this.isPreviousMonthDisabled(this.pageTimestamp) : this.isNextMonthDisabled(this.pageTimestamp);
      },
      gridStyle: function gridStyle() {
        return {
          'grid-template-columns': 'repeat(' + this.cols + ', 1fr)',
          'grid-template-rows': 'repeat(' + this.rows + ', 1fr)'
        };
      }
    },
    methods: {
      /**
       * Handles a month change from the day picker
       */
      handleChangedMonthFromDayPicker: function handleChangedMonthFromDayPicker(date) {
        this.$emit('changedMonth', date);
      },

      /**
       * @param {Object} date
       */
      selectDate: function selectDate(date) {
        this.$emit('selectDate', date);
      },
      selectDisabledDate: function selectDisabledDate(date) {
        this.$emit('selectDisabledDate', date);
      },

      /**
       * Increment the current page month
       */
      nextMonth: function nextMonth() {
        if (!this.isNextMonthDisabled()) {
          this.changeMonth(+1);
        }
      },

      /**
       * Is the next month disabled?
       * @return {Boolean}
       */
      isNextMonthDisabled: function isNextMonthDisabled() {
        if (!this.disabledDates || !this.disabledDates.from) {
          return false;
        }

        var d = new Date(this.pageDate.getTime()); //Добавляем кол-во отображаемых календарей

        var showingMothesCount = this.cols * this.rows;
        this.utils.setMonth(d, this.utils.getMonth(d) + (showingMothesCount - 1));
        return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d) && this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d);
      },

      /**
       * Decrement the page month
       */
      previousMonth: function previousMonth() {
        if (!this.isPreviousMonthDisabled()) {
          this.changeMonth(-1);
        }
      },

      /**
       * Is the previous month disabled?
       * @return {Boolean}
       */
      isPreviousMonthDisabled: function isPreviousMonthDisabled() {
        if (!this.disabledDates || !this.disabledDates.to) {
          return false;
        }

        var d = this.pageDate;
        return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d) && this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d);
      },

      /**
       * Change the page month
       * @param {Number} incrementBy
       */
      changeMonth: function changeMonth(incrementBy) {
        var date = this.pageDate;
        this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy);
        this.$emit('changedMonth', date);
      },
      //При смене значения селектбокса
      onSelectChange: function onSelectChange(month) {
        var data = this.monthesSelectOptions;
        var option;

        for (var year in data) {
          option = data[year].find(function (x) {
            return x.key == month.selectedOption;
          });
          if (option) break;
        }

        if (!option) return; //Текущий месяц в календаре

        var d1 = new Date(month.pageDate.getTime());
        d1.setUTCHours(0, 0, 0, 0); //Выбранный месяц

        var d2 = new Date(Date.UTC(option.year, option.month, 1)); //Считаем разницу в месяцах между датами

        var diffInMonthes = (d2.getFullYear() - d1.getFullYear()) * 12;
        diffInMonthes -= d1.getMonth();
        diffInMonthes += d2.getMonth();
        this.changeMonth(diffInMonthes);
      }
    }
  };

  /* script */
              const __vue_script__$2 = script$2;
              
  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        class: [_vm.calendarClass, "dvdp-datepicker__calendar"],
        style: _vm.calendarStyle,
        on: {
          mousedown: function($event) {
            $event.preventDefault();
          }
        }
      },
      [
        _vm._t("beforeCalendarHeader"),
        _vm._v(" "),
        _c("header", { staticClass: "navigation" }, [
          _c(
            "div",
            {
              staticClass: "prev",
              class: { disabled: _vm.isLeftNavDisabled },
              on: {
                click: function($event) {
                  _vm.isRtl ? _vm.nextMonth() : _vm.previousMonth();
                }
              }
            },
            [
              _c(
                "svg",
                {
                  attrs: {
                    width: "11",
                    height: "18",
                    fill: "currentColor",
                    xmlns: "http://www.w3.org/2000/svg"
                  }
                },
                [
                  _c("path", {
                    attrs: {
                      "fill-rule": "evenodd",
                      "clip-rule": "evenodd",
                      d: "M10.7,15.8 3.9,9 10.7,2.2 8.9,0.4 0.3,9 8.9,17.6z",
                      fill: "currentColor"
                    }
                  })
                ]
              )
            ]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "next",
              class: { disabled: _vm.isRightNavDisabled },
              on: {
                click: function($event) {
                  _vm.isRtl ? _vm.previousMonth() : _vm.nextMonth();
                }
              }
            },
            [
              _c(
                "svg",
                {
                  attrs: {
                    width: "11",
                    height: "18",
                    fill: "currentColor",
                    xmlns: "http://www.w3.org/2000/svg"
                  }
                },
                [
                  _c("path", {
                    attrs: {
                      "fill-rule": "evenodd",
                      "clip-rule": "evenodd",
                      d: "M0.3,2.2 7.1,9 0.3,15.8 2.1,17.6 10.7,9 2.1,0.4z",
                      fill: "currentColor"
                    }
                  })
                ]
              )
            ]
          )
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "monthes-grid", style: _vm.gridStyle },
          _vm._l(_vm.months, function(month) {
            return _c(
              "div",
              { key: month.timestamp, staticClass: "calendar" },
              [
                _c("picker-day", {
                  attrs: {
                    pageDate: month.pageDate,
                    pageTimestamp: month.timestamp,
                    selectedDate: _vm.selectedDate,
                    fullMonthName: _vm.fullMonthName,
                    disabledDates: _vm.disabledDates,
                    highlighted: _vm.highlighted,
                    translation: _vm.translation,
                    isRtl: _vm.isRtl,
                    mondayFirst: _vm.mondayFirst,
                    "use-utc": _vm.useUtc,
                    "show-monthes-select": _vm.showMonthesSelect
                  },
                  on: {
                    changedMonth: _vm.handleChangedMonthFromDayPicker,
                    selectDate: _vm.selectDate,
                    selectedDisabled: _vm.selectDisabledDate
                  },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "dayCellContent",
                        fn: function(slotData) {
                          return _vm._t("dayCellContent", null, null, slotData)
                        }
                      },
                      {
                        key: "monthes-select",
                        fn: function() {
                          return [
                            _c(
                              "select",
                              {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: month.selectedOption,
                                    expression: "month.selectedOption"
                                  }
                                ],
                                staticClass: "monthes-select",
                                attrs: { tabindex: "-1" },
                                on: {
                                  change: [
                                    function($event) {
                                      var $$selectedVal = Array.prototype.filter
                                        .call($event.target.options, function(o) {
                                          return o.selected
                                        })
                                        .map(function(o) {
                                          var val =
                                            "_value" in o ? o._value : o.value;
                                          return val
                                        });
                                      _vm.$set(
                                        month,
                                        "selectedOption",
                                        $event.target.multiple
                                          ? $$selectedVal
                                          : $$selectedVal[0]
                                      );
                                    },
                                    function($event) {
                                      return _vm.onSelectChange(month)
                                    }
                                  ],
                                  mousedown: function($event) {
                                    $event.stopPropagation();
                                  }
                                }
                              },
                              [
                                _vm._l(_vm.monthesSelectOptions, function(
                                  value,
                                  name
                                ) {
                                  return [
                                    _c("option", { attrs: { disabled: "" } }, [
                                      _vm._v(_vm._s(name))
                                    ]),
                                    _vm._v(" "),
                                    _vm._l(value, function(option) {
                                      return _c(
                                        "option",
                                        {
                                          key: option.key,
                                          domProps: { value: option.key }
                                        },
                                        [
                                          _vm._v(
                                            "\n                " +
                                              _vm._s(option.name) +
                                              "\n              "
                                          )
                                        ]
                                      )
                                    })
                                  ]
                                })
                              ],
                              2
                            )
                          ]
                        },
                        proxy: true
                      }
                    ],
                    null,
                    true
                  )
                })
              ],
              1
            )
          }),
          0
        )
      ],
      2
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* component normalizer */
    function __vue_normalize__$2(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      const component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "C:\\Projects\\vuejs-datepicker\\src\\components\\PickerDayWrap.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) component.functional = true;
      }

      component._scopeId = scope;

      return component
    }
    /* style inject */
    
    /* style inject SSR */
    

    
    var PickerDayWrap = __vue_normalize__$2(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2);

  //
  var clickOutsideEvent;
  var script$3 = {
    components: {
      DateInput: DateInput,
      PickerDayWrap: PickerDayWrap
    },
    props: {
      value: {
        validator: function validator(val) {
          return utils$1.validateDateInput(val);
        }
      },
      name: String,
      refName: String,
      id: String,
      format: {
        type: [String, Function],
        "default": 'dd MMM yyyy'
      },
      language: {
        type: Object,
        "default": function _default() {
          return en;
        }
      },
      openDate: Number,
      fullMonthName: Boolean,
      disabledDates: Object,
      highlighted: Object,
      placeholder: String,
      inline: Boolean,
      calendarClass: [String, Object, Array],
      inputClass: [String, Object, Array],
      wrapperClass: [String, Object, Array],
      mondayFirst: Boolean,
      clearButton: Boolean,
      clearButtonIcon: String,
      calendarButton: Boolean,
      calendarButtonIcon: String,
      calendarButtonIconContent: String,
      bootstrapStyling: Boolean,
      initialView: String,
      disabled: Boolean,
      required: Boolean,
      typeable: Boolean,
      useUtc: Boolean,
      cols: {
        type: Number,
        "default": function _default() {
          return 2;
        }
      },
      rows: {
        type: Number,
        "default": function _default() {
          return 1;
        }
      },
      showMonthesSelect: Boolean
    },
    data: function data() {
      var startDate = this.openDate ? new Date(this.openDate) : new Date();
      var constructedDateUtils = makeDateUtils(this.useUtc);
      var pageTimestamp = constructedDateUtils.setDate(startDate, 1);
      return {
        /*
         * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
         * This represents the first day of the current viewing month
         * {Number}
         */
        pageTimestamp: pageTimestamp,

        /*
         * Selected Date
         * {Date}
         */
        selectedDate: null,

        /*
         * Flags to show calendar views
         * {Boolean}
         */
        showDayView: false,

        /*
         * Positioning
         */
        calendarHeight: 0,
        resetTypedDate: new Date(),
        utils: constructedDateUtils
      };
    },
    watch: {
      value: function value(_value) {
        this.setValue(_value);
      },
      openDate: function openDate() {
        this.setPageDate();
      },
      pageTimestamp: function pageTimestamp(newVal, oldVal) {
        this.$emit('changePage', newVal);
      }
    },
    computed: {
      pageDate: function pageDate() {
        return new Date(this.pageTimestamp);
      },
      translation: function translation() {
        return this.language;
      },
      calendarStyle: function calendarStyle() {
        return {
          position: this.isInline ? 'relative' : undefined,
          "z-index": this.isInline ? 'auto' : undefined
        };
      },
      isOpen: function isOpen() {
        return this.showDayView;
      },
      isInline: function isInline() {
        return !!this.inline;
      },
      isRtl: function isRtl() {
        return this.translation.rtl === true;
      }
    },
    methods: {
      /**
       * Called in the event that the user navigates to date pages and
       * closes the picker without selecting a date.
       */
      resetDefaultPageDate: function resetDefaultPageDate() {
        if (this.selectedDate === null) {
          this.setPageDate();
          return;
        }

        this.setPageDate(this.selectedDate);
      },

      /**
       * Effectively a toggle to show/hide the calendar
       * @return {mixed}
       */
      toggleCalendar: function toggleCalendar() {
        if (this.disabled || this.isInline) {
          return false;
        }

        if (this.isOpen) {
          return this.close(true);
        }

        this.setInitialView();
      },

      /**
       * Effectively a toggle to show/hide the calendar
       * @return {mixed}
       */
      showCalendar: function showCalendar() {
        if (this.disabled || this.isInline) {
          return false;
        }

        if (this.isOpen) return;
        this.setInitialView();
      },

      /**
       * Sets the initial picker page view: day, month or year
       */
      setInitialView: function setInitialView() {
        this.showDayCalendar();
      },

      /**
       * Show the day picker
       * @return {Boolean}
       */
      showDayCalendar: function showDayCalendar() {
        this.close();
        this.showDayView = true;
        return true;
      },

      /**
       * Set the selected date
       * @param {Number} timestamp
       */
      setDate: function setDate(timestamp) {
        var date = new Date(timestamp);
        this.selectedDate = date; //Не меняем дату страницы, т.к. прыгает при нескольких календарях
        //this.setPageDate(date)

        this.$emit('selected', date);
        this.$emit('input', date);
      },

      /**
       * Clear the selected date
       */
      clearDate: function clearDate() {
        this.selectedDate = null;
        this.setPageDate();
        this.$emit('selected', null);
        this.$emit('input', null);
        this.$emit('cleared');
      },

      /**
       * @param {Object} date
       */
      selectDate: function selectDate(date) {
        this.setDate(date.timestamp);

        if (!this.isInline) {
          this.close(true);
        }

        this.resetTypedDate = new Date();
      },

      /**
       * @param {Object} date
       */
      selectDisabledDate: function selectDisabledDate(date) {
        this.$emit('selectedDisabled', date);
      },

      /**
       * Set the datepicker value
       * @param {Date|String|Number|null} date
       */
      setValue: function setValue(date) {
        if (typeof date === 'string' || typeof date === 'number') {
          var parsed = new Date(date);
          date = isNaN(parsed.valueOf()) ? null : parsed;
        }

        if (!date) {
          this.setPageDate();
          this.selectedDate = null;
          return;
        }

        this.selectedDate = date; //Не меняем дату страницы, если установлена общая дата страницы (для нескольких календарей)

        if (!this.openDate) this.setPageDate(date);
      },

      /**
       * Sets the date that the calendar should open on
       */
      setPageDate: function setPageDate(date) {
        if (!date) {
          if (this.openDate) {
            date = new Date(this.openDate);
          } else {
            date = new Date();
          }
        }

        this.pageTimestamp = this.utils.setDate(new Date(date), 1);
      },

      /**
       * Handles a month change from the day picker
       */
      handleChangedMonthFromDayPicker: function handleChangedMonthFromDayPicker(date) {
        this.setPageDate(date);
        this.$emit('changedMonth', date);
      },

      /**
       * Set the date from a typedDate event
       */
      setTypedDate: function setTypedDate(date) {
        this.setDate(date.getTime());
      },

      /**
       * Close all calendar layers
       * @param {Boolean} emitEvent - emit close event
       */
      close: function close(emitEvent) {
        this.showDayView = false;

        if (!this.isInline) {
          if (emitEvent) {
            this.$emit('closed');
          }

          document.removeEventListener('click', this.clickOutside, false);
        }
      },

      /**
       * Initiate the component
       */
      init: function init() {
        if (this.value) {
          this.setValue(this.value);
        }

        if (this.isInline) {
          this.setInitialView();
        }
      }
    },
    mounted: function mounted() {
      var _this = this;

      this.init();

      if (!this.isInline) {
        clickOutsideEvent = function clickOutsideEvent(event) {
          // here I check that click was outside the el and his children
          if (!(_this.$el == event.target || _this.$el.contains(event.target))) {
            if (_this.isOpen) {
              _this.close();
            }
          }
        };

        document.body.addEventListener('click', clickOutsideEvent);
      }
    },
    destroyed: function destroyed() {
      if (!this.isInline) {
        document.removeEventListener('click', clickOutsideEvent);
      }
    }
  } // eslint-disable-next-line
  ;

  /* script */
              const __vue_script__$3 = script$3;
              
  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        staticClass: "dvdp-datepicker",
        class: [_vm.wrapperClass, _vm.isRtl ? "rtl" : ""]
      },
      [
        _c(
          "date-input",
          {
            attrs: {
              selectedDate: _vm.selectedDate,
              resetTypedDate: _vm.resetTypedDate,
              format: _vm.format,
              translation: _vm.translation,
              inline: _vm.inline,
              id: _vm.id,
              name: _vm.name,
              refName: _vm.refName,
              openDate: _vm.openDate,
              placeholder: _vm.placeholder,
              inputClass: _vm.inputClass,
              typeable: _vm.typeable,
              clearButton: _vm.clearButton,
              clearButtonIcon: _vm.clearButtonIcon,
              calendarButton: _vm.calendarButton,
              calendarButtonIcon: _vm.calendarButtonIcon,
              calendarButtonIconContent: _vm.calendarButtonIconContent,
              disabled: _vm.disabled,
              required: _vm.required,
              bootstrapStyling: _vm.bootstrapStyling,
              "use-utc": _vm.useUtc,
              showDayView: _vm.showDayView
            },
            on: {
              showCalendar: _vm.showCalendar,
              toggleCalendar: _vm.toggleCalendar,
              closeCalendar: _vm.close,
              typedDate: _vm.setTypedDate,
              clearDate: _vm.clearDate
            }
          },
          [_vm._t("afterDateInput", null, { slot: "afterDateInput" })],
          2
        ),
        _vm._v(" "),
        _vm.showDayView
          ? _c(
              "picker-day-wrap",
              {
                attrs: {
                  pageDate: _vm.pageDate,
                  selectedDate: _vm.selectedDate,
                  fullMonthName: _vm.fullMonthName,
                  disabledDates: _vm.disabledDates,
                  highlighted: _vm.highlighted,
                  calendarClass: _vm.calendarClass,
                  calendarStyle: _vm.calendarStyle,
                  translation: _vm.translation,
                  pageTimestamp: _vm.pageTimestamp,
                  isRtl: _vm.isRtl,
                  mondayFirst: _vm.mondayFirst,
                  "use-utc": _vm.useUtc,
                  cols: _vm.cols,
                  rows: _vm.rows,
                  "show-monthes-select": _vm.showMonthesSelect
                },
                on: {
                  changedMonth: _vm.handleChangedMonthFromDayPicker,
                  selectDate: _vm.selectDate,
                  selectedDisabled: _vm.selectDisabledDate
                },
                scopedSlots: _vm._u(
                  [
                    {
                      key: "dayCellContent",
                      fn: function(slotData) {
                        return _vm._t("dayCellContent", null, null, slotData)
                      }
                    }
                  ],
                  null,
                  true
                )
              },
              [
                _vm._t("beforeCalendarHeader", null, {
                  slot: "beforeCalendarHeader"
                })
              ],
              2
            )
          : _vm._e()
      ],
      1
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = function (inject) {
      if (!inject) return
      inject("data-v-57274044_0", { source: ".rtl {\n  direction: rtl;\n}\n.dvdp-datepicker {\n  position: relative;\n  text-align: left;\n}\n.dvdp-datepicker * {\n  box-sizing: border-box;\n}\n.dvdp-datepicker:focus {\n  background: #f00;\n}\n.dvdp-datepicker__calendar {\n  position: absolute;\n  z-index: 100;\n  background: #fff;\n  border: 1px solid #ccc;\n  width: max-content;\n  height: max-content;\n  user-select: none;\n}\n.dvdp-datepicker__calendar header {\n  display: block;\n  line-height: 40px;\n  position: relative;\n}\n.dvdp-datepicker__calendar header.navigation {\n  position: static;\n}\n.dvdp-datepicker__calendar header .day__month_btn {\n  text-align: center;\n}\n.dvdp-datepicker__calendar header .monthes-select {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  opacity: 0;\n  width: 100%;\n  cursor: pointer;\n}\n.dvdp-datepicker__calendar header .prev,\n.dvdp-datepicker__calendar header .next {\n  position: absolute;\n  background: #fff;\n  border-radius: 50%;\n  border: 1px solid #ccc;\n  display: flex;\n  width: 40px;\n  height: 40px;\n  top: 150px;\n}\n.dvdp-datepicker__calendar header .prev.disabled,\n.dvdp-datepicker__calendar header .next.disabled {\n  border-color: #dcdcdc;\n}\n.dvdp-datepicker__calendar header .prev.disabled path,\n.dvdp-datepicker__calendar header .next.disabled path {\n  fill: #ddd;\n}\n.dvdp-datepicker__calendar header .prev svg,\n.dvdp-datepicker__calendar header .next svg {\n  margin: auto;\n}\n.dvdp-datepicker__calendar header .prev {\n  left: -20px;\n}\n.dvdp-datepicker__calendar header .prev svg {\n  transform: translateX(-1px);\n}\n.dvdp-datepicker__calendar header .next {\n  right: -20px;\n}\n.dvdp-datepicker__calendar header .next svg {\n  transform: translateX(1px);\n}\n.dvdp-datepicker__calendar header .prev:not(.disabled),\n.dvdp-datepicker__calendar header .next:not(.disabled) {\n  cursor: pointer;\n}\n.dvdp-datepicker__calendar header .prev:not(.disabled):hover,\n.dvdp-datepicker__calendar header .next:not(.disabled):hover {\n  border-color: #4bd;\n}\n.dvdp-datepicker__calendar .disabled {\n  cursor: default;\n}\n.dvdp-datepicker__calendar .flex-rtl {\n  display: flex;\n  width: inherit;\n  flex-wrap: wrap;\n}\n.dvdp-datepicker__calendar .cell {\n  display: inline-block;\n  padding: 0 5px;\n  width: 14.285714285714286%;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid transparent;\n}\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).day,\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).month,\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {\n  cursor: pointer;\n}\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {\n  border: 1px solid #4bd;\n}\n.dvdp-datepicker__calendar .cell.selected {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.selected:hover {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.selected.highlighted {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.highlighted {\n  background: #cae5ed;\n}\n.dvdp-datepicker__calendar .cell.highlighted.disabled {\n  color: #a3a3a3;\n}\n.dvdp-datepicker__calendar .cell.highlighted.highlight-start {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.highlighted.highlight-end {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.grey {\n  color: #888;\n}\n.dvdp-datepicker__calendar .cell.grey:hover {\n  background: inherit;\n}\n.dvdp-datepicker__calendar .cell.day-header {\n  font-size: 75%;\n  white-space: nowrap;\n  cursor: inherit;\n}\n.dvdp-datepicker__calendar .cell.day-header:hover {\n  background: inherit;\n}\n.dvdp-datepicker__calendar .month,\n.dvdp-datepicker__calendar .year {\n  width: 33.333%;\n}\n.dvdp-datepicker__calendar .monthes-grid {\n  display: grid;\n}\n.dvdp-datepicker__calendar .calendar {\n  width: 310px;\n  padding: 5px 20px;\n}\n.dvdp-datepicker__clear-button,\n.dvdp-datepicker__calendar-button {\n  cursor: pointer;\n  font-style: normal;\n}\n.dvdp-datepicker__clear-button.disabled,\n.dvdp-datepicker__calendar-button.disabled {\n  color: #999;\n  cursor: default;\n}\n", map: {"version":3,"sources":["Datepicker.vue"],"names":[],"mappings":"AAAA;EACE,cAAc;AAChB;AACA;EACE,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,YAAY;EACZ,gBAAgB;EAChB,sBAAsB;EACtB,kBAAkB;EAClB,mBAAmB;EACnB,iBAAiB;AACnB;AACA;EACE,cAAc;EACd,iBAAiB;EACjB,kBAAkB;AACpB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,MAAM;EACN,SAAS;EACT,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;;EAEE,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;EAClB,sBAAsB;EACtB,aAAa;EACb,WAAW;EACX,YAAY;EACZ,UAAU;AACZ;AACA;;EAEE,qBAAqB;AACvB;AACA;;EAEE,UAAU;AACZ;AACA;;EAEE,YAAY;AACd;AACA;EACE,WAAW;AACb;AACA;EACE,2BAA2B;AAC7B;AACA;EACE,YAAY;AACd;AACA;EACE,0BAA0B;AAC5B;AACA;;EAEE,eAAe;AACjB;AACA;;EAEE,kBAAkB;AACpB;AACA;EACE,eAAe;AACjB;AACA;EACE,aAAa;EACb,cAAc;EACd,eAAe;AACjB;AACA;EACE,qBAAqB;EACrB,cAAc;EACd,0BAA0B;EAC1B,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,sBAAsB;EACtB,6BAA6B;AAC/B;AACA;;;EAGE,eAAe;AACjB;AACA;;;EAGE,sBAAsB;AACxB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,cAAc;AAChB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,WAAW;AACb;AACA;EACE,mBAAmB;AACrB;AACA;EACE,cAAc;EACd,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,mBAAmB;AACrB;AACA;;EAEE,cAAc;AAChB;AACA;EACE,aAAa;AACf;AACA;EACE,YAAY;EACZ,iBAAiB;AACnB;AACA;;EAEE,eAAe;EACf,kBAAkB;AACpB;AACA;;EAEE,WAAW;EACX,eAAe;AACjB","file":"Datepicker.vue","sourcesContent":[".rtl {\n  direction: rtl;\n}\n.dvdp-datepicker {\n  position: relative;\n  text-align: left;\n}\n.dvdp-datepicker * {\n  box-sizing: border-box;\n}\n.dvdp-datepicker:focus {\n  background: #f00;\n}\n.dvdp-datepicker__calendar {\n  position: absolute;\n  z-index: 100;\n  background: #fff;\n  border: 1px solid #ccc;\n  width: max-content;\n  height: max-content;\n  user-select: none;\n}\n.dvdp-datepicker__calendar header {\n  display: block;\n  line-height: 40px;\n  position: relative;\n}\n.dvdp-datepicker__calendar header.navigation {\n  position: static;\n}\n.dvdp-datepicker__calendar header .day__month_btn {\n  text-align: center;\n}\n.dvdp-datepicker__calendar header .monthes-select {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  opacity: 0;\n  width: 100%;\n  cursor: pointer;\n}\n.dvdp-datepicker__calendar header .prev,\n.dvdp-datepicker__calendar header .next {\n  position: absolute;\n  background: #fff;\n  border-radius: 50%;\n  border: 1px solid #ccc;\n  display: flex;\n  width: 40px;\n  height: 40px;\n  top: 150px;\n}\n.dvdp-datepicker__calendar header .prev.disabled,\n.dvdp-datepicker__calendar header .next.disabled {\n  border-color: #dcdcdc;\n}\n.dvdp-datepicker__calendar header .prev.disabled path,\n.dvdp-datepicker__calendar header .next.disabled path {\n  fill: #ddd;\n}\n.dvdp-datepicker__calendar header .prev svg,\n.dvdp-datepicker__calendar header .next svg {\n  margin: auto;\n}\n.dvdp-datepicker__calendar header .prev {\n  left: -20px;\n}\n.dvdp-datepicker__calendar header .prev svg {\n  transform: translateX(-1px);\n}\n.dvdp-datepicker__calendar header .next {\n  right: -20px;\n}\n.dvdp-datepicker__calendar header .next svg {\n  transform: translateX(1px);\n}\n.dvdp-datepicker__calendar header .prev:not(.disabled),\n.dvdp-datepicker__calendar header .next:not(.disabled) {\n  cursor: pointer;\n}\n.dvdp-datepicker__calendar header .prev:not(.disabled):hover,\n.dvdp-datepicker__calendar header .next:not(.disabled):hover {\n  border-color: #4bd;\n}\n.dvdp-datepicker__calendar .disabled {\n  cursor: default;\n}\n.dvdp-datepicker__calendar .flex-rtl {\n  display: flex;\n  width: inherit;\n  flex-wrap: wrap;\n}\n.dvdp-datepicker__calendar .cell {\n  display: inline-block;\n  padding: 0 5px;\n  width: 14.285714285714286%;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid transparent;\n}\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).day,\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).month,\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {\n  cursor: pointer;\n}\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,\n.dvdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {\n  border: 1px solid #4bd;\n}\n.dvdp-datepicker__calendar .cell.selected {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.selected:hover {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.selected.highlighted {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.highlighted {\n  background: #cae5ed;\n}\n.dvdp-datepicker__calendar .cell.highlighted.disabled {\n  color: #a3a3a3;\n}\n.dvdp-datepicker__calendar .cell.highlighted.highlight-start {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.highlighted.highlight-end {\n  background: #4bd;\n}\n.dvdp-datepicker__calendar .cell.grey {\n  color: #888;\n}\n.dvdp-datepicker__calendar .cell.grey:hover {\n  background: inherit;\n}\n.dvdp-datepicker__calendar .cell.day-header {\n  font-size: 75%;\n  white-space: nowrap;\n  cursor: inherit;\n}\n.dvdp-datepicker__calendar .cell.day-header:hover {\n  background: inherit;\n}\n.dvdp-datepicker__calendar .month,\n.dvdp-datepicker__calendar .year {\n  width: 33.333%;\n}\n.dvdp-datepicker__calendar .monthes-grid {\n  display: grid;\n}\n.dvdp-datepicker__calendar .calendar {\n  width: 310px;\n  padding: 5px 20px;\n}\n.dvdp-datepicker__clear-button,\n.dvdp-datepicker__calendar-button {\n  cursor: pointer;\n  font-style: normal;\n}\n.dvdp-datepicker__clear-button.disabled,\n.dvdp-datepicker__calendar-button.disabled {\n  color: #999;\n  cursor: default;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* component normalizer */
    function __vue_normalize__$3(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      const component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "C:\\Projects\\vuejs-datepicker\\src\\components\\Datepicker.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) component.functional = true;
      }

      component._scopeId = scope;

      {
        let hook;
        if (style) {
          hook = function(context) {
            style.call(this, createInjector(context));
          };
        }

        if (hook !== undefined) {
          if (component.functional) {
            // register for functional component in vue file
            const originalRender = component.render;
            component.render = function renderWithStyleInjection(h, context) {
              hook.call(context);
              return originalRender(h, context)
            };
          } else {
            // inject component registration as beforeCreate hook
            const existing = component.beforeCreate;
            component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
        }
      }

      return component
    }
    /* style inject */
    function __vue_create_injector__() {
      const head = document.head || document.getElementsByTagName('head')[0];
      const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
      const isOldIE =
        typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

      return function addStyle(id, css) {
        if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

        const group = isOldIE ? css.media || 'default' : id;
        const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

        if (!style.ids.includes(id)) {
          let code = css.source;
          let index = style.ids.length;

          style.ids.push(id);

          if (isOldIE) {
            style.element = style.element || document.querySelector('style[data-group=' + group + ']');
          }

          if (!style.element) {
            const el = style.element = document.createElement('style');
            el.type = 'text/css';

            if (css.media) el.setAttribute('media', css.media);
            if (isOldIE) {
              el.setAttribute('data-group', group);
              el.setAttribute('data-next-index', '0');
            }

            head.appendChild(el);
          }

          if (isOldIE) {
            index = parseInt(style.element.getAttribute('data-next-index'));
            style.element.setAttribute('data-next-index', index + 1);
          }

          if (style.element.styleSheet) {
            style.parts.push(code);
            style.element.styleSheet.cssText = style.parts
              .filter(Boolean)
              .join('\n');
          } else {
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index]) style.element.removeChild(nodes[index]);
            if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
            else style.element.appendChild(textNode);
          }
        }
      }
    }
    /* style inject SSR */
    

    
    var Datepicker = __vue_normalize__$3(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__,
      __vue_create_injector__);

  return Datepicker;

}));
