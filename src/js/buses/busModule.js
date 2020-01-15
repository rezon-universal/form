const PassItem = require('./PassItem');
const CityItem = require('./CityItem');
const DirectionType = require('./DirectionType');
const validator = require('./validator');
const dataWork = require('./dataWork');

let routeTypes = [
    new DirectionType('oneway', 'ONE_WAY')
    , new DirectionType('roundtrip', 'ROUND_TRIP')
];

const formModuleBase = require('./../formModuleBase');
module.exports = class busModule extends formModuleBase {
    //Получить настройки по-умолчанию
    getExtendedOptions()
    {
        return {
            dates: {
                busesMinDate: null,
                busesMaxDate: null
            },
            buses: {
                recCityFrom: [],
                recCityTo: [],
                passenger: new PassItem("psgAdultsCnt", 'PASS_CAT_ADT', 'PASS_CAT_ADT_DESC', 1),
                historyGuid: '',
                dateThere: new Date(),
                dateBack: new Date(),
                cityFrom: new CityItem(),
                cityTo: new CityItem(),
                timeThere: 0,
                timeBack: 0,
                dateRange: 0,
                formTypes: routeTypes,
                formType: routeTypes[0],
                formExtended: false
            }
        };
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        return this.it.extra.remoteUrl() + "/BusTickets/ModuleSearch";
    }
    //Получить подсвеченные даты в датапикере
    datepickerGetHighlight(datepicker) {
        if (this.options.buses.formType.value === "roundtrip") {
            return {
                from: datepicker.dateFrom,
                to: datepicker.dateTo
            }
        }
        return {};
    }
    //Установка запрещенных дат в датапикере
    datepickerGetDisabled(datepicker) {
        return {
            to: datepicker.minDate !== undefined ? datepicker.minDate : vue.dates.busesMinDate,
            from: datepicker.maxDate !== undefined ? datepicker.maxDate : vue.dates.busesMaxDate
        };
    }

    //Подключение Vue
    bindVue(bindTo, mountedCallback) {
        var local = this;
        
        Vue.component('busesInput', {
            template: ' <div class="inside">' +
                '<input type="text" :class="inputClasses" v-model="item.Name" data-local="true" @keyup="checkItem" data-localPlaceholder="BUSES_PLACEHOLDER" :placeholder="placeholder"/>' +
                '<div class="express">' +
                '{{item.Code}}' +
                '</div>' +
                '<span href="#" class="delete" :class="{\'no-visiblity\':item.Name==null}" v-on:click="clearItem()"></span>' +
                '<input type="hidden" :name="name" v-model="item.Id"/>' +
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
                    default: "BUSES_PLACEHOLDER"
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
                        this.item = newValue;

                        var comp = this;
                        Vue.nextTick(function () {
                            //Update typeahead
                            var el = comp.$el;
                            var selector = comp.inputClass;
                            $(el).find('.' + selector).typeahead('val', newValue.Name);
                        });
                    },
                    deep: true
                }
            },
            data: function () {
                return {
                    item: this.value
                }
            },
            methods: {
                updateBusItem: function (newValue) {
                    this.item = newValue;
                    this.$emit('input', this.item);
                },
                clearItem: function () {
                    this.item = new CityItem();
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
                    if (event.key !== "Enter" && event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                        this.item.CountryCode = '';
                        this.item.CountryName = '';
                        this.item.Id = '';
                        this.$emit('input', this.item);
                    }
                }
            },
            created: function () {
                var comp = this;
                vue.$on("cityUpdate", function (name, city) {
                    if (comp.name === name) {
                        comp.updateBusItem(city);
                    }
                });
            }
        });

        var formBind = new Vue({
            el: bindTo[0],
            mixins: [{
                data: this.options
            }],
            computed: {
                passStringBuses: function () {
                    var count = this.buses.passenger.count;

                    var str = "";
                    var oneNumber = "PASS_CAT_ADT_1";
                    var zeroNumber = "PASS_CAT_ADT_0";
                    var fourNumber = "PASS_CAT_ADT_0";

                    if (count >= 5 && count <= 20) {
                        //вариантов
                        str += zeroNumber;
                    } else {
                        switch (count % 10) {
                            case 1:
                                //вариант
                                str += oneNumber;
                                break;
                            case 2:
                            case 3:
                            case 4:
                                //варианта
                                str += fourNumber;
                                break;
                            default:
                                str += zeroNumber;
                                break;
                        }
                    }
                    return count + " " + this.locale(str);
                },
                today: function () {
                    var todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    return todayDate;
                },
             
                busesMinDate: function () {
                    var busesMinDate = new Date(this.today.getTime());
                    return busesMinDate;
                },
                busesMaxDate: function () {
                    var busesMaxDate = new Date(this.today.getTime());
                    busesMaxDate.setDate(busesMaxDate.getDate() + 200);
                    return busesMaxDate;
                },
                busesDefaultDateThere: function () {
                    var defaultDateThere = new Date();
                    defaultDateThere.setDate(defaultDateThere.getDate() + 7);
                    return defaultDateThere;
                },
                busesDefaultDateBack: function () {
                    var defaultDateBack = new Date();
                    defaultDateBack.setDate(defaultDateBack.getDate() + 14);
                    return defaultDateBack;
                },

                busesDateThere: function () {
                    var busesDateThere = new Date(this.today.getTime());
                    return busesDateThere;
                },
                busesDateBack: function () {
                    var busesDateBack = new Date(this.today.getTime());
                    busesDateBack.setDate(busesDateBack.getDate() + 2);
                    return busesDateBack;
                }
            },
            methods: {
                locale: this.it.extra.locale,

                changeBusFormExtended: function () {
                    this.buses.formExtended = !this.buses.formExtended;
                },
                updateCityTypeAhead: function (name, data) {
                    var cityItem = new CityItem(data.Id, data.Name, data.CountryCode, data.CountryName);
                    vue.$emit("cityUpdate", name, cityItem);
                },
                swapBusDest: function () {
                    var to = this.buses.cityFrom;
                    var from = this.buses.cityTo;
                    this.buses.cityFrom = from;
                    this.buses.cityTo = to;
                },
                clearBusForm: function () {
                    this.buses.dateThere = this.busesDefaultDateThere;
                    this.buses.dateBack = this.busesDefaultDateBack;
                    this.buses.cityFrom = new CityItem();
                    this.buses.cityTo = new CityItem();
                    this.buses.timeThere = 0;
                    this.buses.timeBack = 0;
                    this.buses.dateRange = 0;
                    this.buses.passenger.count = 1;
                    var model = this;
                    Vue.nextTick(function () {
                        // DOM updated
                        model.updateHtmlElements();
                    });
                },
                busTypeChanged: function (index) {
                    this.buses.formType = this.buses.formTypes[index];
                },
                hasBusResult: function () {
                    return this.buses.historyGuid !== undefined &&
                        this.buses.historyGuid !== null &&
                        this.buses.historyGuid.trim() !== '';
                },
                    
                removeBusPassenger: function () {
                    this.buses.passenger.count--;
                    if (this.buses.passenger.count <= 0)
                        this.buses.passenger.count = 1;
                },
                addBusPassenger: function () {
                    this.buses.passenger.count++;
                }
            },
            watch: {
                'buses.dateThere': function (value) {
                    if (value > this.buses.dateBack) {
                        this.buses.dateBack = value;
                    }
                    if (value > this.dates.busesMaxDate) {
                        this.buses.dateThere = this.dates.busesMaxDate;
                    }
                    if (value < this.dates.busesMinDate) {
                        this.buses.dateThere = this.dates.busesMinDate;
                    }
                },
                'buses.dateBack': function (value) {
                    if (value < this.buses.dateThere) {
                        this.buses.dateThere = value;
                    }
                    if (value > this.dates.busesMaxDate) {
                        this.buses.dateBack = this.dates.busesMaxDate;
                    }
                    if (value < this.dates.busesMinDate) {
                        this.buses.dateBack = this.dates.busesMinDate;
                    }
                }
            },
            created: function () {
                //Global variable
                this.dates.busesMinDate = this.busesMinDate;
                this.dates.busesMaxDate = this.busesMaxDate;
              
                if (!this.buses.dateThere) this.buses.dateThere = this.busesDefaultDateThere;
                if (!this.buses.dateBack) this.buses.dateBack = this.busesDefaultDateBack;
                else if (this.buses.dateBack < this.buses.dateThere)
                    this.buses.dateBack = this.buses.dateThere;
           

                window.vue = this;

            },
            mounted: function () {
                var el = this.$el;
                Vue.nextTick(function () {
                    !!mountedCallback && typeof (mountedCallback) === "function" && mountedCallback(el);
                    local.it.extra.updateIframeHeight();
                    $('.unload').removeClass('unload');
                });
            },
            updated: function () {
                Vue.nextTick(function () {
                    local.it.extra.updateIframeHeight();
                });
            }
        });
    }
    //Инициализация модуля, вызывается после подключения Vue
    bind() {
        let it = this.it;
        let form = this.form;
        let options = this.options;
        
        let dw = new dataWork(form, it);

        //При переходе по истории пассажиры приходят не как объекты, а как кол-во
        if(typeof(it._o.buses.ticketCount) !== 'undefined') {
            it._o.buses.passenger.count = it._o.buses.ticketCount;
        }

        //Отправка формы поиска автобусов
        form.submit(function () {
            var checker = new validator($(this), it);
            var isValid = checker.isValid();
            if (!isValid) return false;

            if (options.projectUrl.startsWith("/") && typeof main !== 'undefined' && main.bustickets != undefined && main.bustickets.searchForm != undefined && main.bustickets.searchForm.send != undefined) return main.bustickets.searchForm.send(form);
            return true;
        });

        var typeaheadOptions = {
            minLength: 2
        };

        //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
        if (it.extra.mobileAndTabletcheck()) {
            typeaheadOptions.minLength = 0;
        }

        // Поиск городов в основной форме
        form.find('.book-from, .book-to').typeahead(typeaheadOptions, {
            name: "bus-cities-" + it._o.defaultLang,
            displayKey: 'value',
            source: dw.busCitiesFinderData.ttAdapter(),
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
                    if (!!data.countryName && !!data.countryCode) {
                        ret.push(
                            {
                                key: $("<span class='country-separator'><small>" + data.countryName + " (" + data.countryCode + ")</small><span>"),
                                value: undefined
                            });
                    }
                    for (var cityIt = 0; cityIt < data.cities.length; cityIt++) {
                        ret.push({
                            key: data.cities[cityIt].CityName + " <small class='express-code'>" + data.cities[cityIt].CountryName + "</small>",
                            value: {
                                Id: data.cities[cityIt].Id,
                                Name: data.cities[cityIt].CityName,
                                CountryCode: data.cities[cityIt].CountryName,
                                CountryName: data.cities[cityIt].CountryCode
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
                var fromCity = form.find("[name='CityIdFrom']").val();
                $.trim(fromCity) !== "" && $(this).typeahead('query', "fromCity_" + fromCity);
            }
        }).click(function () {
            $(this).select();
        }).on("typeahead:selected typeahead:autocompleted", function (e, datum) {
            if (datum != undefined) {
                var field = $(this).closest('.field.station');
                var name = field.find(".inside input[type='hidden']").attr('name');

                it.extra.closeField(field);
                vue.updateCityTypeAhead(name, datum);
                if (!it.extra.mobileAndTabletcheck()) {
                    switch (name) {
                        case "CityIdFrom":
                            var sib = field.closest("form").find("input[name='CityIdTo']");
                            if (sib.val() === "") sib.siblings(".twitter-typeahead").find(".tt-input").click();
                            break;
                        case "CityIdTo":
                            //Focus TODO
                            var dp = $(this).closest(".fields-container").find('.date.from').find("input[name='DateThere']");
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
            if (it.extra.isInIframe()) {
                it.extra.recalculateHeightOnClose();
            }

            //TODO First selected
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

        //Passengers menu
        form.find(".passengers > .switch-box .switch").click(function () {
            var selectAge = form.find(".select-age");
            var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
            var field = $(this).closest('.field');

            if ($(this).is(".opened")) {
                $(this).removeClass("opened");
                it.extra.closeField(field);

                var updatingClosedSelect = function (el) {
                    el.addClass("g-hide");
                    if (it.extra.isInIframe()) {
                        it.extra.recalculateHeightOnClose();
                    }
                };
                if (isMobile) {
                    selectAge.fadeOut(it._o.animationDelay, function () {
                        updatingClosedSelect($(this));
                    });
                } else {
                    selectAge.slideUp(it._o.animationDelay, function () {
                        updatingClosedSelect($(this));
                    });
                }

            } else {
                it.extra.openField(field);
                $(this).addClass("opened");

                var updatingOpenSelect = function (el) {
                    el.removeClass("g-hide");
                    if (it.extra.isInIframe()) {
                        it.extra.recalculateHeightOnOpen(el);
                    }
                    el.focus();
                };

                if (isMobile) {
                    selectAge.fadeIn(it._o.animationDelay, function () {
                        updatingOpenSelect($(this));
                    });
                } else {
                    selectAge.slideDown(it._o.animationDelay, function () {
                        updatingOpenSelect($(this));
                    });
                }
            }
        });
    }
}