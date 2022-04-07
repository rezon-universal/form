const dDatePickerComponent = require('./../../../Views/Forms/common/_Datepicker.vue');
const DatePickerLanguage = require('./common/vuejs-datepicker.locale/Language');
const clickOutsideFunction = require('./common/click-outside');

module.exports = class formBase {
    _locale = {};
    _o = {
        animationDelay: 300,
        projectUrl: "/",
        defaultLang: "ru",
        formType: "avia", //avia|railway|bus|hotels
        formTarget: "_blank",

        historyData : []
    };
    _initialized = false;
    constructor(locale) {
        this._locale = locale;

        let it = this;

        this.extra = {};

        this.extra.mobileAndTabletcheck = function () {
            /*
             * Метрики показали что регулярка долго работает. По ширине будет быстрее
             */
            return window.innerWidth <= 575;
        }
        this.extra.remoteUrl = function () {
            return it._o.projectUrl + it._o.defaultLang;
        };
        this.extra.locale = function (str, locale) {
            locale = locale || it._o.defaultLang;
            if (it._locale.hasOwnProperty(locale) && typeof it._locale[locale] == 'object') {
                if (it._locale[locale].hasOwnProperty(str)) {
                    return it._locale[locale][str];
                }
            }
            //Looking for EN localization
            if (it._locale.hasOwnProperty('en') && typeof it._locale['en'] == 'object') {
                if (it._locale['en'].hasOwnProperty(str)) {
                    return it._locale['en'][str];
                }
            }

            return str;
        };
        this.extra.scrollToOn = false;
        this.extra.scrollTo = function (el, offsetTop) {
            it.extra.abortScroll();
            if (!el) return;
            var offset = el.offset();
            if (!offset) return;
            it.extra.scrollToOn = true;
            $('html, body').animate({
                scrollTop: offset.top + (offsetTop || 0)
            }, 1000, function () {
                it.extra.scrollToOn = false;
            });
        };
        this.extra.abortScroll = function () {
            if (it.extra.scrollToOn) {
                it.extra.scrollToOn = false;
                $('html,body').stop();
            }
        };
        this.extra.openField = function (el, scrollAfterShow = true) {
            if (el === undefined || el === null) return false;
            var field = el.closest('.field');
            if (field.length > 0) {
                //fix bug with pulls away cursor in popup inputs for mobile Safari          
                // Detect ios 11_x_x affected  
                // NEED TO BE UPDATED if new versions are affected
                var ua = navigator.userAgent,
                    iOS = /iPad|iPhone|iPod/.test(ua);
                //iOS11 = /OS 11_0|OS 11_1|OS 11_2/.test(ua);

                // ios 11 bug caret position
                if (iOS && scrollAfterShow) {
                    var isMobile = window.innerWidth <= 575;
                    if (isMobile)
                    {
                        //На iPhone Safari на мобильных скроллит при открытии куда то вниз
                        //т.к. мы все равно отображаем блок на всю высоту - скролим вверх
                        //тикет 4294
                        setTimeout(function() {
                            document.documentElement.scrollTop = 0;
                        }, 100);
                    }else {
                        //для айпадов оставляем старый костыль (айпад скроллит к инпуту с фокусом)
                        $(window).scrollTop($(window).scrollTop() + 1).scrollTop($(window).scrollTop() - 1);
                    }
                }
                if (!$('body').is(".m-no-scroll")) {
                    let scroll = document.documentElement.scrollTop;
                    $('body').addClass('m-no-scroll').data("scroll-y", scroll);
                }
                
                field.addClass('opened');
                field.find('.link-left, .link-right').removeClass('hidden');
                return true;
            }
            return false;
        };
        this.extra.closeField = function (el) {
            if (el === undefined || el === null) return false;
            var field = el.closest('.field');
            if (field.length > 0) {
                var isMobile = it.extra.mobileAndTabletcheck();
                
                $('body').removeClass('m-no-scroll');

                if (isMobile) {
                    let scroll = $('body').data("scroll-y");
                    if (scroll) {
                        document.documentElement.scrollTop = scroll;
                        $('body').removeData("scroll-y");
                    }
                }
                
                field.removeClass('opened');
                field.find('.link-left, .link-right').addClass('hidden');
            }
            return false;
        };
        this.extra.isInIframe = function () {
            var isInIframe = window.parent != undefined && window.parent !== window && window.parent.postMessage;
            return isInIframe;
        }
        this.extra.updateIframeHeight = function () {
            typeof (window.updatingHeight) !== 'undefined' && window.updatingHeight();
        }
        this.extra.recalculateHeightOnOpen = function (el, offset, height) {
            var elHeight = height || el.height();
            var topOffset = offset || el.offset().top;
            var bodyHeight = elHeight + topOffset;
            $('body').css({ 'min-height': bodyHeight + 'px' });
            it.extra.updateIframeHeight();
        };
        this.extra.recalculateHeightOnClose = function () {
            $('body').css({ 'min-height': 'inherit' });
            it.extra.updateIframeHeight();
        };
    }

    getCurrentModule(formType) {
        throw new Error(`Form type ${formType} is not implimented.`);
    }
    bindGlobalVue(bindTo) {
        let it = this;
        let module = it._currentModule;

        // Выбранную страницу календаря (выбранный месяц) делаем один, общий для всех
        // что бы при смене страницы календаря она менялась на всех календарях формы
        it._o.pageDateStamp = new Date().getTime();
        Vue.component('d-date-picker', {
            mixins: [dDatePickerComponent.default],
            props: {
                //Для сложного маршрута для датапикера мы вручную передаем минимальную дату лега
                minDate: Date,
                maxDate: Date
            },
            methods: {
            },
            computed: {
                highlighted: function () {
                    return module.datepickerGetHighlight() || {};
                },
                disabled: function () {
                    return  module.datepickerGetDisabled(this) || {};
                },
                lang: function() {
                    return new DatePickerLanguage.default(
                      'Default',
                      [it.extra.locale('JANUARY'), it.extra.locale('FEBRUARY'), it.extra.locale('MARCH'), it.extra.locale('APRIL'), it.extra.locale('MAY'), it.extra.locale('JUNE'), it.extra.locale('JULY'), it.extra.locale('AUGUST'), it.extra.locale('SEPTEMPER'), it.extra.locale('OCTOBER'), it.extra.locale('NOVEMBER'), it.extra.locale('DECEMBER')],
                      [it.extra.locale('JANUARY_SHORT'), it.extra.locale('FEBRUARY_SHORT'), it.extra.locale('MARCH_SHORT'), it.extra.locale('APRIL_SHORT'), it.extra.locale('MAY_SHORT'), it.extra.locale('JUNE_SHORT'), it.extra.locale('JULY_SHORT'), it.extra.locale('AUGUST_SHORT'), it.extra.locale('SEPTEMPER_SHORT'), it.extra.locale('OCTOBER_SHORT'), it.extra.locale('NOVEMBER_SHORT'), it.extra.locale('DECEMBER_SHORT')],
                      [it.extra.locale('SUNDAY_MIN'), it.extra.locale('MONDAY_MIN'), it.extra.locale('TUESDAY_MIN'), it.extra.locale('WEDNESDAY_MIN'), it.extra.locale('THURSDAY_MIN'), it.extra.locale('FRIDAY_MIN'), it.extra.locale('SATURDAY_MIN')]
                    );
                }
            },
            created: function () {
                var comp = this;
                this.$on('opened', function () {
                    var el = $(comp.$el);
                    it.extra.openField(el, false);
                    Vue.nextTick(function () {
                        it.extra.recalculateHeightOnOpen(el.find('.datepicker-popup:visible'));
                    });
                });
                this.$on('closed', function () {
                    var el = $(comp.$el);
                    it.extra.closeField(el);
                    Vue.nextTick(function () {
                        // Если уже не открыт другой календарь, то пересчитываем высоту на стандартную
                        // Починена ошибка в Iframe при переключении фокуса между датой вылета туда/обратно
                        if(!$('.datepicker-popup:visible').length) {
                            it.extra.recalculateHeightOnClose();
                        }
                    });
                });
                this.$on('selected', function (data) {
                    Vue.nextTick(function () {
                        module.datepickerSelected(comp);
                    });
                });
                this.$on('change-page', function (timestamp) {
                    this.$root.pageDateStamp = timestamp;
                });
            }
        });
        clickOutsideFunction.default(Vue);
    }

    //Подключение глобальных скриптов (старая логика, js/jquery)
    bindJQuery() {
        let it = this;
        //Если это не страница проекта (т.е. форма не внешнем ресурсе, не подключен файл main.js)
        
        if (window.main == undefined) {
            it._form.on("click", ".selectpicker .options, .selectpicker .option, .selected-value", function (e) {
                e.preventDefault();

                var selectpicker = $(this).closest(".selectpicker");
                var options = selectpicker.find('.options');
                var isMobile = it.extra.mobileAndTabletcheck();
                if (selectpicker.is(".opened")) {
                    if ($(this).is(".option")) {
                        selectpicker.find(".selected-value:first").find("span:first").html(
                            $(this).find("span:first").html()
                        );
                        $(this).siblings(".option").find("input:radio:checked").removeAttr("checked");
                        $(this).find("input:radio").prop("checked", true).trigger("change");
                    }
                    var updatingClosedSelect = function () {
                        selectpicker.removeClass("opened");
                        if (it.extra.isInIframe()) {
                            it.extra.recalculateHeightOnClose();
                            it.extra.updateIframeHeight();
                        };
                    };
                    if (isMobile) {
                        options.fadeOut(300, function () {
                            $('body').removeClass('m-no-scroll');
                            updatingClosedSelect();
                        });

                    } else {
                        options.slideUp(300, function () {
                            updatingClosedSelect();
                        });
                    }

                } else {
                    options.addClass("z-100");
                    selectpicker.addClass("opened");
                    var updatingOpenSelect = function (el) {
                        if (it.extra.isInIframe()) {
                            it.extra.recalculateHeightOnOpen(el);
                            it.extra.updateIframeHeight();
                        }
                    };
                    if (isMobile) {
                        $('body').addClass('m-no-scroll');
                        var displayStyle = [
                            'display: -webkit-flex',
                            'display: flex'
                        ].join(';');
                        options.fadeIn(300, function () {
                            updatingOpenSelect($(this));
                        }).attr('style', displayStyle);
                    } else {
                        var maxHeight = $(window).height() - (selectpicker[0].getBoundingClientRect().top + selectpicker.height());
                        options.css({
                            'max-height': maxHeight
                        }).slideDown(300, function () {
                            $(this).removeClass("z-100");
                            var realHeight = 0;
                            $(this).children().filter(":visible").each(function () {
                                realHeight += $(this).outerHeight(true);
                            });
                            if (realHeight > maxHeight) {
                                $(this).addClass("overflowing");
                            } else {
                                $(this).removeClass("overflowing");
                            }
                            updatingOpenSelect($(this));
                        });
                    }
                }
            });

            it._form.on("blur click focusout", ".selectpicker.opened", function () {
                var isMobile = it.extra.mobileAndTabletcheck();
                var selectpicker = $(this);
                var updatingCloseSelect = function () {
                    selectpicker.removeClass("opened");
                    if (it.extra.isInIframe()) {
                        it.extra.recalculateHeightOnClose();
                        it.extra.updateIframeHeight();
                    };
                };

                if (isMobile) {
                    selectpicker.find(".options").hide(300, function () {
                        updatingCloseSelect();
                    });
                } else {
                    selectpicker.find(".options").slideUp(300, function () {
                        updatingCloseSelect();
                    });
                }
                return false;
            });

            $(".selectpicker").each(function () {
                $(this).on("redraw", function() {
                    var radio = $(this).find("input:radio:checked");
                    if (radio.length == 0) radio = $(this).find("input:radio:first");

                    var selectedValue = $(this).find(".selected-value");
                    if (selectedValue.length === 0) selectedValue = $("<div/>").prependTo($(this)).addClass("selected-value clear_after");

                    selectedValue.html("").append($("<span/>").html(radio.prev("span:first").html()));
                });
                if ($(this).attr("tabindex") !== "-1") {
                    $(this).attr("tabindex", "-1");
                    $(this).trigger("redraw");
                }
            });
        }else {
            main.bind.selectpicker(it._form);
        }

        it._form.find(".checkbox-item").click(function () {
            //Если это не страница проекта (т.е. форма не внешнем ресурсе, не подключен файл main.js)
            if (window.main == undefined) {
                if ($(this).is(".active")) {
                    $(this).removeClass("active");
                    $(this).find("input:checkbox").removeAttr("checked");
                } else {
                    $(this).addClass("active");
                    $(this).find("input:checkbox").prop("checked", true);
                }
                return false;
            }
        });

        it._form.find(".rez-forms-links a.rez-form-link").click(function () {
            if (!$(this).is(".active")) {
                $(this).siblings(".rez-form-link.active").each(function () {
                    $(this).removeClass("active");
                    it._form.find($(this).attr("href")).addClass("g-hide");
                });

                $(this).addClass("active");
                it._form.find($(this).attr("href")).removeClass("g-hide");
            }
            return false;
        });

        //Кнопки над меню при просмотре на мобильном
        it._form.off("click", ".fields-container .field:not(.pass, .carrier, .date) .menu-title .link-left, .fields-container .field:not(.pass, .carrier, .date) .menu-title .link-right");
        it._form.on("click", ".fields-container .field:not(.pass, .carrier, .date) .menu-title .link-left, .fields-container .field:not(.pass, .carrier, .date) .menu-title .link-right", function () {
            var field = $(this).closest('.field');
            it.extra.closeField(field);
            return false;
        });

        //При переключении вкладок повторно вызывать событие фокуса для активного элемента.
        //$(window).on('focus', function () {
        //    var activeEl = $(document.activeElement);
        //    if (activeEl.length > 0 && activeEl.closest(".rez-forms").length > 0 && !activeEl.is('button')) {
        //        activeEl.trigger('blur').trigger('focus');
        //    }
        //});
            
        //Определяем браузер IE и Edge
        if (document.documentMode || /Edge/.test(navigator.userAgent)) {
            it._form.addClass('form-ie');
        }

        $('html').on('DOMMouseScroll mousewheel touchmove', function (e) {
            it.extra.scrollToOn && it.extra.abortScroll();
        });

        it.extra.updateIframeHeight();

        $(document).ajaxStart(function () {
            var el = it._form.find(".field.focused .twitter-typeahead");
            if (el.length) {
                el.addClass("loading");
            }
        });
        $(document).ajaxStop(function () {
            var el = it._form.find(".field.focused .twitter-typeahead.loading");
            if (el.length) {
                el.removeClass("loading");
            }
        });

        //Кнопка Х на сообщении с ошибкой
        it._form.off("click", ".field.has-error .error-box .close");
        it._form.on("click", ".field.has-error .error-box .close", function () {
            $(this).closest(".error-box").slideUp(it._o.animationDelay, function () {
                $(this).html("").closest(".has-error").removeClass("has-error");
            });
            it.extra.updateIframeHeight();
            return false;
        });
    }

    init(bindTo, o) {
        let it = this;
        //Получаем текущий модуль формы (авиа/жд/отели/автобусы/...)
        it._currentModule = it.getCurrentModule((typeof(o) !== 'undefined' ? o.formType : undefined) || this._o.formType);
        //Переопределяем настройки по-умолчанию
        $.extend(true, this._o, it._currentModule.getExtendedOptions() || {});
        //Переопределяем настройки, который передал пользователь
        $.extend(true, this._o, o);

        this.bindGlobalVue(bindTo);
        
        it._currentModule.bindVue(bindTo, (bindedTo) => {
            it._form = $(bindedTo);
            it._currentModule.form = it._form;

            it.bindJQuery();
            it._currentModule.bind();
            it._currentModule.bindFormSaver();

            
            if (it._o.projectUrl !== "/")
            {
                it._form.attr("method", "POST")
                    .attr("action", it._currentModule.getFormRemoteUrl())
                    .attr("target", it._o.formTarget || "_blank");
            }
            it._initialized = true;
        });

    }
}