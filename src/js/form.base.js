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
            //if (typeof(this._mobileAndTabletCheckResult) !== 'undefined') return this._mobileAndTabletCheckResult;
            //var check = false;
            //(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
            //return (this._mobileAndTabletCheckResult = check);
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
                var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
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
                var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
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