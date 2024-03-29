﻿const validator = require('./validator');
const dataWork = require('./dataWork');
const ApiService = require('../../insurances/servises/api.service.js').default;

const InsuranceLocation = require('./InsuranceLocation');
const InsurancesFormSaverData = require('./InsurancesFormSaverData');

const formModuleBase = require('../formModuleBase');
module.exports = class insurancesModule extends formModuleBase {
    //Получить настройки по-умолчанию
    getExtendedOptions()
    {
        return {
            dates: {
                insurancesMinDate: null,
                insurancesMaxDate: null
            },
            insurances: {
                DateFrom: null,
                DateTo: null,
                Location: new InsuranceLocation(),
                DaysShift: 0,
                MinimumPeriod: 1,
                FormTabs: ''
            },
            selectedPeriod: 0,
            periods: [30, 45, 60, 90, 180, 270, 365],
            availablePeriod: 0,
            // "Жестко" привязанный код виджета. Необходимо, например, что бы оставить только Украину в поисковой форме
            widgetCode: null,
            Tabs: {}
        };  
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        return this.it.extra.remoteUrl() + "/Insurances/ModuleSearch";
    }
    //Получить подсвеченные даты в датапикере
    datepickerGetHighlight() {
        return {
            from: this.options.insurances.DateFrom[0],
            to: this.options.insurances.DateTo[0]
        };
    }
    //Установка запрещенных дат в датапикере
    datepickerGetDisabled(datepicker) {
        return {
            to: datepicker.minDate !== undefined ? datepicker.minDate : this.vue.dates.insurancesMinDate,
            from: datepicker.maxDate !== undefined ? datepicker.maxDate : this.vue.dates.insurancesMaxDate
        };
    }
    //Датапикер - выбрано значение (ивент)
    datepickerSelected(datepicker) {
        var isMobile = this.it.extra.mobileAndTabletcheck();
        if (datepicker.name === 'DateFrom' && datepicker.highlighted.to !== undefined && datepicker.highlighted.to !== null && !isMobile) {
            var el = $(datepicker.$el);
            var nextDatePick = el.closest('.fields-container').find('.date.to').find("input[name='DateTo']").siblings(".book-date");

            setTimeout(function () {
                nextDatePick.focus();
            }, 100);
        }
    }

    //Подключение Vue
    bindVue(bindTo, mountedCallback) {
        var local = this;

        Vue.component('selectPeriod', {
            template: '<div class="select-holder">' +
                '<div :class="[`select-period`, {active: isActive}]" v-on:click="toggleClass">' +
                '<div v-if="value != 0" class="value">{{ value }}</div>' +
                '<div v-else class="placeholder">{{ placeholder }}</div>' +
                '</div>' +
                '<div class="options" v-if="isActive" v-click-outside="outsideSelect">' +
                '<div class="option" v-for="value in range" v-on:click="selectOption(value)" :disabled="value > availablePeriod">{{ value }}</div>' +
                '</div>' +
                '</div>',
            props: {
                value: {
                    type: Number,
                    default: 0
                },
                range: {
                    type: Array,
                    default: () => ([30, 45, 60, 90, 180, 270, 365])
                },
                availablePeriod: {
                    type: Number,
                    default: 0
                },
                placeholder: {
                    type: String,
                    default: "Select period"
                }
            },
            watch: {
                isActive: function (val) {
                    var field = $(document).find(".field.period");
                    if (val) field.addClass("opened");
                    else field.removeClass("opened").find(".select-holder").blur();
                }
            },
            data() {
                return {
                    isActive: false
                }
            },
            methods: {
                toggleClass() {
                    this.isActive = !this.isActive;
                },
                selectOption(value) {
                    if (value > this.availablePeriod) return false;
                    this.$emit('select', value);
                    this.$emit('input', value);
                    this.isActive = false;
                },
                outsideSelect() {
                    this.isActive = false;
                }
            },
            created: function () {
                if (!this.value) this.selectOption(this.range[0]);
            }
        });
        
        Vue.component('insurancesInput', {
            template: '<div class="inside" v-if="item" :class="{\'with-region\' : item.Name !== null && item.Name !== undefined}">' +
                          '<input type="text" :class="inputClasses" v-model="item.Name" data-local="true" @keyup="checkItem" data-localPlaceholder="insurances_PLACEHOLDER" :placeholder="placeholder"/>' +
                          '<div class="express">{{item.CountryCode}}</div>' +
                          '<span href="#" class="delete" :class="{\'no-visiblity\':item.Name==null}" v-on:click="clearItem()"></span>' +
                          '<input type="hidden" :name="name" v-model="item.CountryCode"/>' +
                      '</div>',
            props: {
                name: {
                    type: String
                },
                value: {
                    type: Object
                },
                inputClass:
                {
                    type: String
                },
                placeholder: {
                    type: String,
                    default: "insurances_PLACEHOLDER"
                }
            },
            computed: {
                inputClasses: function () {
                    var input = $(this.$el).find('input:not(.tt-hint).' + this.inputClass)[0];
                    var classes = [this.inputClass];

                    if (input !== undefined && input !== null) {
                        classes = input.className.split(' ');
                    }

                    if (this.item.Name === null || this.item.Name === undefined || this.item.Name.trim() === '') {
                        if (classes.indexOf('isEmpty') <= 0) {
                            classes.push('isEmpty');
                        }
                    } else {
                        var index = classes.indexOf('isEmpty');
                        if (index >= 0) {
                            classes.splice(index, 1);
                        }
                    }
                    $.unique(classes);

                    return classes.join(' ');
                }
            },
            watch: {
                value: {
                    handler: function (newValue) {
                        if (this.item !== newValue) {
                            this.item = newValue;

                            var comp = this;
                            Vue.nextTick(function () {
                                //Update typeahead
                                var el = comp.$el;
                                var selector = comp.inputClass;
                                $(el).find('.' + selector).typeahead('val', newValue.Name);
                            });
                        }
                    },
                    deep: true
                }
            },
            data: function () {
                return {
                    item: this.value,
                    arrRegion: null
                }
            },
            methods: {
                updateInsuranceItem: function (newValue) {
                    this.item = newValue;
                    this.$emit('input', this.item);
                },
                clearItem: function () {
                    this.arrRegion = null;
                    this.item = new InsuranceLocation();
                    this.$emit('input', this.item);
                    var comp = this;
                    Vue.nextTick(function () {
                        //Update typeahead
                        var el = comp.$el;
                        var selector = comp.inputClass;
                        $(el).find('.' + selector).typeahead('val', '').focus();
                    });
                },
                checkItem: function (event) {
                    if (event.key !== "Enter" && event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Shift" && event.key !== "Tab") {
                        this.item.CountryCode = '';
                        this.$emit('input', this.item);
                    }
                }
            },
            created: function () {
                var comp = this;
                local.vue.$on("cityUpdate", function (name, city) {
                    if (comp.name === name) {
                        comp.updateInsuranceItem(city);
                    }
                });
            }
        });

        new Vue({
            el: bindTo[0],
            mixins: [this.getVueBase(mountedCallback)],
            computed: {
                today: function () {
                    var todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    return todayDate;
                },
                insurancesMinDate: function () {
                    // конвертируем в милисекунды и обратно чтобы отвязать от переменной
                    var insurancesMinDate = new Date(this.today.getTime());
                    return new Date(insurancesMinDate.setDate(insurancesMinDate.getDate() + this.insurances.DaysShift));
                    //return new Date(this.today.getTime());
                },
                insurancesMaxDate: function () {
                    var insurancesMaxDate = new Date(this.today.getTime());
                    insurancesMaxDate.setDate(insurancesMaxDate.getDate() + 365 + this.insurances.DaysShift);
                    return insurancesMaxDate;
                },
                insurancesDefaultDate: function () {
                    var defaultDate = new Date();
                    defaultDate.setDate(defaultDate.getDate() + this.insurances.DaysShift);
                    return defaultDate;
                },
                insurancesDefaultBackDate: function () {
                    var defaultBackDate = new Date();
                    var backAfter = 7;
                    if (this.insurances.MinimumPeriod > 7) backAfter = this.insurances.MinimumPeriod;
                    // минус один день потому что выбранные даты считаются включительно
                    defaultBackDate.setDate(defaultBackDate.getDate() + this.insurances.DaysShift + backAfter - 1);
                    return defaultBackDate;
                },    

                insurancesDateThere: function () {
                    var insurancesDate = new Date(this.today.getTime());
                    return insurancesDate;
                },
                insurancesDateBack: function () {
                    var insurancesDateBack = new Date(this.today.getTime());
                    insurancesDateBack.setDate(insurancesDateBack.getDate() + 2);
                    return insurancesDateBack;
                }
            },
            methods: {
                updateLocationTypeAhead: function (name, data) {
                    var cityItem = new InsuranceLocation(data);
                    this.$emit("cityUpdate", name, cityItem);
                },
                setDateTo: function (period) {
                    // Для kmj устанавливаем дату окончания страхового периода по выбранном количеству дней
                    const milisecondsInDay = 86400000;
                    this.$set(this.insurances.DateTo, 0, new Date(
                        this.insurances.DateFrom[0].getTime() + (period - 1) * milisecondsInDay
                    ));
                },
                // Пересчитываем доступный период для kmj
                setAvailablePeriod: function () {
                    // устананавливаем availablePeriod не зависимо от типа формы
                    // иначе при переходе на kmj выбор периода будет недоступный
                    const milisecondsInDay = 86400000;
                    var dateFrom = new Date(this.insurances.DateFrom[0].getTime());
                    dateFrom.setHours(0, 0, 0, 0);
                    this.availablePeriod = (this.dates.insurancesMaxDate.getTime() - dateFrom.getTime()) / milisecondsInDay;

                    if (this.widgetCode !== 'kmj') return;

                    // Сбрасываем выбранный период если дата начала исключает выбранный период
                    if (this.selectedPeriod > this.availablePeriod) this.selectedPeriod = 0;

                    // Если выбран период устанавливаем дату окончания страхового периода
                    if (this.selectedPeriod > 0) this.setDateTo(this.selectedPeriod);
                },
                async submitHandler(e) {
                    let checker = new validator(local.form, local.it);
                    let isValid = checker.isValid();
                    if (!isValid) {
                        e.preventDefault();
                        return false;
                    }
                                        
                    let data = local.getCurrentFormData();
                    local.formSaver.saveNewItem(data);

                    let options = {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                    };

                    // в IE функция Intl.DateTimeFormat возвращает строку со спецсимволами, убираем лишнее регуляркой
                    let dateFrom = new Intl.DateTimeFormat('ru-Ru', options).format(this.insurances.DateFrom[0]).replace(/[^\.\d]/g, '');
                    let dateTo = new Intl.DateTimeFormat('ru-Ru', options).format(this.insurances.DateTo[0]).replace(/[^\.\d]/g, '');


                    if (local.options.projectUrl.startsWith("/") && typeof window.main != undefined) {
                        e.preventDefault();
                        
                        //TODO Remove access to MAIN.js file!!

                        main.extra.startWait();
						$(document).trigger('RezOn.Insurances.SearchFormSended');

                        const formData = {
                            CountryCode: this.insurances.Location.CountryCode,
                            DateFrom: dateFrom,
                            DateTo: dateTo
                        };

                        const searchPage = document.getElementById('insurances-search');
                        const apiService = new ApiService(encodeURI(searchPage.getAttribute('Url')));
                        const fbData = await apiService.createData(formData);

                        await window.main.insurancesSearch.newSearch(fbData);
                        return;
                    }
                },
                selectHistoryItem : function(history) {
                    local.formSaver.selectItem(history);
                }
            },
            watch: {
                'insurances.DateFrom': function (value) {
                    const milisecondsInDay = 86400000;
                    var minDiffInMiliseconds = milisecondsInDay * (this.insurances.MinimumPeriod - 1);
                    var maxDateFrom = new Date(this.insurances.DateTo[0].getTime() - minDiffInMiliseconds);

                    value.forEach((x, index)=> {
                        if (x > maxDateFrom) {
                            this.$set(this.insurances.DateTo, 0, new Date(x.getTime() + minDiffInMiliseconds));
                        }
                        if (x > this.dates.insurancesMaxDate) {
                            this.$set(this.insurances.DateFrom, index, new Date(insurancesMaxDate.getTime() - minDiffInMiliseconds));
                        }
                        if (x < this.dates.insurancesMinDate) {
                            this.$set(this.insurances.DateFrom, index, this.dates.insurancesMinDate);
                        }
                    });

                    this.setAvailablePeriod();
                },
                'insurances.DateTo': function (value) {
                    const milisecondsInDay = 86400000;
                    var minDiffInMiliseconds = milisecondsInDay * (this.insurances.MinimumPeriod - 1);
                    var minDateTo = new Date(this.insurances.DateFrom[0].getTime() + minDiffInMiliseconds);

                    value.forEach((x, index)=> {
                        if (x < minDateTo) {
                            this.$set(this.insurances.DateFrom, 0, new Date(x.getTime() - minDiffInMiliseconds));
                        }
                        if (x > this.dates.insurancesMaxDate) {
                            this.$set(this.insurances.DateTo, index, this.dates.insurancesMaxDate);
                        }
                        if (x < this.dates.insurancesMinDate) {
                            this.$set(this.insurances.DateTo, index, new Date(insurancesMinDate.getTime() + minDiffInMiliseconds));
                        }
                    });
                },
                widgetCode: {
                    immediate: true,
                    handler : function (value) {
                        if (value === 'kmu') {
                            console.log('widget code changed', value);
                            local.options.insurances.Location = new InsuranceLocation({
                                Name: 'Ukraine',
                                CountryCode: 'UA'
                            });
                        } else if (value) {
                            console.log('widget code changed', value);
                            local.options.insurances.Location = new InsuranceLocation();

                            // При переходе на kmj, если выбран период, устанавливаем дату окончания страхового периода
                            if (value === 'kmj' && this.selectedPeriod > 0) this.setDateTo(this.selectedPeriod);
                        }
                        if (local.it.dw) {
                            local.it.dw.insuranceLocationFinderData.clearPrefetchCache();
                            local.it.dw.insuranceLocationFinderData.clearRemoteCache();
                        }
                    }
                }
            },
            created: function () {
                if (!!this.insurances.FormTabs) {
                    var parseTabs = this.insurances.FormTabs.split(',');

                    // удаляем пробельные символы и фильтруем пустые значения
                    for (let item of parseTabs) {
                        if (!!item.trim()) this.Tabs[item.trim().toLowerCase()] = true;
                    }
                }

                //Global variable
                this.dates.insurancesMinDate = this.insurancesMinDate;
                this.dates.insurancesMaxDate = this.insurancesMaxDate;
              
                if (!this.insurances.DateFrom) {
                    this.insurances.DateFrom = [this.insurancesDefaultDate];
                }
                if (!this.insurances.DateTo) {
                    this.insurances.DateTo = [this.insurancesDefaultBackDate];
                }

                this.setAvailablePeriod();

                local.vue = this;
                window.insurancesFormVue = this;

                // Устанавливаем widgetCode по умолчанию, кроме страницы истории поиска
                // TODO! для страницы истории поиска widgetCode необходимо хранить в базе, иначе установка widgetCode обнулит Location
                if (!this.insurances.Location.CountryCode && Object.keys(this.Tabs).length > 1) this.widgetCode = Object.keys(this.Tabs)[0];
            }
        });
    }
    //Инициализация модуля, вызывается после подключения Vue
    bind() {
        let module = this;
        let it = this.it;
        let form = this.form;
        let options = this.options;

        //В хеше может быть передан код виджета, km, kmu, kmj
        if (window.location.hash !== '') {
            options.widgetCode = window.location.hash.substring(1);
        }

        it.dw = new dataWork(form, it);

        var typeaheadOptions = {
            minLength: 0
        };

        //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
        if (it.extra.mobileAndTabletcheck()) {
            typeaheadOptions.minLength = 0;
        }

        // Поиск городов в основной форме
        form.find('.book-from').typeahead(typeaheadOptions, {
            name: "insurance-location-" + it._o.defaultLang,
            displayKey: 'value',
            source: it.dw.insuranceLocationFinderData.ttAdapter(),
            display: function (data) {
                return data != undefined ? data.Name : null;
            },
            templates: {
                empty: [
                    '<div class="templ-message">',
                    it.extra.locale("NOTHING_FOUND") + '...',
                    '</div>'
                ].join('\n'),
                suggestion: function (data) {
                    var ret = [];
                    if (!!data.Name && !!data.CountryCode) {
                        ret.push(
                            {
                                key: "<div class='city'><span class='city-name'>" +  " " + data.Name + "</span><span class='city-region'>" +  "</span></div>",
                                value: {
                                    Name: data.Name,
                                    CountryCode: data.CountryCode
                                }
                            });
                    } 
                    return ret;
                }
            } 
        }).keyup(function (e) {

        }).focus(function () {
            var item = $(this).closest('.field');

            it.extra.openField(item);
            item.addClass('focused').removeClass("has-error").find(".error-box").slideUp(it._o.animationDelay);
            item.closest(".fields-container").find(".field.has-error").removeClass("has-error").find(".error-box").slideUp(it._o.animationDelay);
            if ($(this).is(".book-to") && $(this).val() === "") {
                var fromCity = form.find("[name='CountryCode']").val();
                $.trim(fromCity) !== "" && $(this).typeahead('query', "fromCity_" + fromCity);
            }
        }).blur(function () {
            $(this).closest('.field.focused').removeClass('focused');
        })
        .click(function () {
            $(this).select();
        }).on("typeahead:selected typeahead:autocompleted", function (e, datum) {
            if (datum != undefined) {
                var field = $(this).closest('.field.station');
                var name = field.find(".inside input[type='hidden']").attr('name');
                it.extra.closeField(field);
                module.vue.updateLocationTypeAhead(name, datum);
                
                if (!it.extra.mobileAndTabletcheck()) {
                    if (name === "CountryCode") {
                        var sib = field.closest("form").find("input[name='CountryCode']");
                        if (sib.val() === "") sib.siblings(".twitter-typeahead").find(".tt-input").click();

                        var dp = $(this).closest(".fields-container").find('.date.from').find("input[name='DateFrom']").siblings(".book-date");
                        setTimeout(function () {
                            dp.focus();
                        }, 100);
                    }
                }
                //Hide mobile keyboard
                $(this).blur();
            }
        }).on("typeahead:dropdown", function (its) {
            var item = $(this).closest('.field');
            it.extra.openField(item);

            if (it.extra.isInIframe()) {
                var dropdown = item.find('.tt-dropdown-menu');
                var offset = dropdown.parent().offset().top;
                var height = parseFloat(dropdown.css('max-height'));
                var currHeight = parseFloat($(this).css('height'));
                var totalHeight = height + currHeight;

                it.extra.recalculateHeightOnOpen(dropdown, offset, totalHeight);
            }
            
        }).on("typeahead:dropup", function (its) {
            //Просто очистили поле ввода - схлопнулась выпадашка, но мы по прежнему в фокусе
            if ($(this).is(":focus")) return;

            if (it.extra.isInIframe()) {
                it.extra.recalculateHeightOnClose();
            }

            
            var item = $(this).closest(".field");
            it.extra.closeField(item);
            if (item.find(".inside input[type='hidden']").val() === "" && $(this).val().length > 1 && $(this).data("lastHist")) {
                $(this).val($(this).data("lastHist").Name);
                $(this).trigger("typeahead:autocompleted", [$(this).data("lastHist")]);
            }

        }).on("typeahead:queryChanged", function (it, query) {

        }).on("typeahead:updateHint", function (a, b) {
            if (b) $(this).data("lastHist", b);
            else $(this).removeData("lastHist");
        });
    }
    //Получение текущего объекта с формой
    getCurrentFormData() {
        return new InsurancesFormSaverData(this);
    }
    getCurrentFormDataName() {
        if (!!this.options.widgetCode) return undefined;
        return 'InsurancesFormSaverData';
    }
}