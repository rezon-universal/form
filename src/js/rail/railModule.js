const DirectionType = require('./DirectionType');
const StationItem = require('./StationItem');
const validator = require('./validator');
const dataWork = require('./dataWork');

let routeTypes = [
    new DirectionType('oneway', 'ONE_WAY')
    , new DirectionType('roundtrip', 'ROUND_TRIP')
];

const formModuleBase = require('./../formModuleBase');
module.exports = class railModule extends formModuleBase {

    //Получить настройки по-умолчанию
    getExtendedOptions()
    {
        return {
            dates: {
                trainsMinDate: null,
                trainsMaxDate: null
            },
            railway: {
                recStationsFrom: [],
                recStationsTo: [],
                historyGuid: '',
                dateThere: null,
                dateBack: null,
                stationFrom: new StationItem(),
                stationTo: new StationItem(),
                timeThere: 0,
                timeBack: 0,
                dateRange: 0,
                formTypes: routeTypes,
                formType: routeTypes[0],
                formExtended: false,
                maxSearchDayDepth: 44
            }
        };
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        return this.it.extra.remoteUrl() + "/RailwayTickets/ModuleSearch";
    }
    //Получить подсвеченные даты в датапикере
    datepickerGetHighlight(datepicker) {
        if (this.options.railway.formType.value === 'roundtrip') {
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
            to: datepicker.minDate !== undefined ? datepicker.minDate : vue.dates.trainsMinDate,
            from: datepicker.maxDate !== undefined ? datepicker.maxDate : vue.dates.trainsMaxDate
        };
    }

    //Подключение Vue
    bindVue(bindTo, mountedCallback) {
        var local = this;


        Vue.component('railwayInput', {
            template:
                '<div class="inside">' +
                '<input type="text" :class="inputClasses" v-model="item.Name" data-local="true" @keyup="checkItem" data-localPlaceholder="RAILWAY_PLACEHOLDER" :placeholder="placeholder"/>' +
                '<div v-if="item.Code != 0" class="express">' + '{{item.Code}}' + '</div>' +
                '<span class="delete" :class="{\'no-visiblity\':item.CountryName==null}" v-on:click="clearItem()"></span>' +
                '<input type="hidden" :name="name" v-model="item.Code"/>' +
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
                    default: "RAILWAY_PLACEHOLDER"
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
                updateRailItem: function (newValue) {
                    this.item = newValue;
                    this.$emit('input', this.item);
                },
                clearItem: function () {
                    this.item = new StationItem();
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
                        this.item.Code = '';
                        this.$emit('input', this.item);
                    }
                }
            },
            created: function () {
                var comp = this;
                vue.$on('stationUpdate', function (name, station) {
                    if (comp.name === name) {
                        comp.updateRailItem(station);
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
                today: function () {
                    var todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    return todayDate;
                },
             
                trainsMinDate: function () {
                    var trainsMinDate = new Date(this.today.getTime());
                    return trainsMinDate;
                },
                trainsMaxDate: function () {
                    var trainsMaxDate = new Date(this.today.getTime());
                    trainsMaxDate.setDate(trainsMaxDate.getDate() + this.railway.maxSearchDayDepth);
                    return trainsMaxDate;
                },

                railwayDateThere: function () {
                    var railwayDateThere = new Date(this.today.getTime());
                    return railwayDateThere;
                },
                railwayDateBack: function () {
                    var railwayDateBack = new Date(this.today.getTime());
                    railwayDateBack.setDate(railwayDateBack.getDate() + 2);
                    return railwayDateBack;
                },
            },
            methods: {
                locale: this.it.extra.locale,
                
                changeRailFormExtended: function () {
                    this.railway.formExtended = !this.railway.formExtended;
                },
                updateStationTypeAhead: function (name, data) {
                    var stationItem = new StationItem(data.ExpressCode, data.Name, data.CountryCode, data.CountryName);
                    vue.$emit('stationUpdate', name, stationItem);
                },
                swapRailDest: function () {
                    var to = this.railway.stationFrom;
                    var from = this.railway.stationTo;
                    this.railway.stationFrom = from;
                    this.railway.stationTo = to;
                },
                clearRailForm: function () {
                    this.railway.dateThere = new Date();
                    this.railway.dateBack = new Date();
                    this.railway.stationFrom = new StationItem();
                    this.railway.stationTo = new StationItem();
                    this.railway.timeThere = 0;
                    this.railway.timeBack = 0;
                    this.railway.dateRange = 0;
                    var model = this;
                    Vue.nextTick(function () {
                        // DOM updated
                        model.updateHtmlElements();
                    });
                },
                railTypeChanged: function (index) {
                    this.railway.formType = this.railway.formTypes[index];
                },
                hasRailResult: function () {
                    return this.railway.historyGuid !== undefined &&
                        this.railway.historyGuid !== null &&
                        this.railway.historyGuid.trim() !== '';
                },
            },
            watch: {
                'railway.dateThere': function (value) {
                    if (value > this.railway.dateBack) {
                        this.railway.dateBack = value;
                    }
                    if (value > this.dates.trainsMaxDate) {
                        this.railway.dateThere = this.dates.trainsMaxDate;
                    }
                    if (value < this.dates.trainsMinDate) {
                        this.railway.dateThere = this.dates.trainsMinDate;
                    }
                },
                'railway.dateBack': function (value) {
                    if (value < this.railway.dateThere) {
                        this.railway.dateThere = value;
                    }
                    if (value > this.dates.trainsMaxDate) {
                        this.railway.dateBack = this.dates.trainsMaxDate;
                    }
                    if (value < this.dates.trainsMinDate) {
                        this.railway.dateBack = this.dates.trainsMinDate;
                    }
                },
            },
            created: function () {
                //Global variable
                
                this.dates.trainsMinDate = this.trainsMinDate;
                this.dates.trainsMaxDate = this.trainsMaxDate;
                
             
              
                if (!this.hasRailResult()) {
                    this.railway.dateThere = this.railwayDateThere;
                    this.railway.dateBack = this.railwayDateBack;
                }
      

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

        
        //Отправка формы поиска ЖД билетов
        form.submit(function () {
            var checker = new validator($(this), it);
            var isValid = checker.isValid();
            if (!isValid) return false;

            if (options.projectUrl.startsWith("/") && typeof main !== 'undefined' && main.traintickets != undefined && main.traintickets.searchForm != undefined && main.traintickets.searchForm.send != undefined) return main.traintickets.searchForm.send(form);
            return true;
        });


        var typeaheadOptions = {
            minLength: 2
        };
        //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
        if (it.extra.mobileAndTabletcheck()) {
            typeaheadOptions.minLength = 0;
        }

        // Поиск станций / городов в основной форме
        form.find('.book-from, .book-to').typeahead(typeaheadOptions, {
            name: "stations-" + it._o.defaultLang,
            displayKey: 'value',
            source: dw.stationsFinderData.ttAdapter(),
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
                    for (var stationIt = 0; stationIt < data.stations.length; stationIt++) {
                        ret.push({
                            key: data.stations[stationIt].stationName + " <small class='express-code'>" + data.stations[stationIt].stationCode + "</small>",
                            value: {
                                ExpressCode: data.stations[stationIt].stationCode,
                                Name: data.stations[stationIt].stationName,
                                CountryCode: data.countryCode,
                                CountryName: data.countryName
                            }
                        });
                        if (data.stations[stationIt].includeItems && data.stations[stationIt].includeItems.length > 0)
                            for (var inclStat = 0; inclStat < data.stations[stationIt].includeItems.length; inclStat++) {
                                ret.push(
                                    {
                                        key: "<span class='item-child" + (inclStat == 0 ? '-first' : '') + "'></span>" +
                                            "<span class='item-text'>" + data.stations[stationIt].includeItems[inclStat].inclName + "</span>" +
                                            " <small class='express-code'>" + data.stations[stationIt].includeItems[inclStat].inclCode + "</small>",
                                        value: {
                                            ExpressCode: data.stations[stationIt].includeItems[inclStat].inclCode,
                                            Name: data.stations[stationIt].includeItems[inclStat].inclName,
                                            CountryCode: data.countryCode,
                                            CountryName: data.countryName
                                        }
                                    });
                            }
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
                var fromStation = form.find("[name='tshi_station_from']").val();
                $.trim(fromStation) !== "" && $(this).typeahead('query', "fromstation_" + fromStation);
            }
        }).click(function () {
            $(this).select();
        }).on("typeahead:selected typeahead:autocompleted", function (e, datum) {
            if (datum != undefined) {
                var field = $(this).closest('.field.station');
                var name = field.find(".inside input[type='hidden']").attr('name');

                it.extra.closeField(field);
                vue.updateStationTypeAhead(name, datum);
                if (!it.extra.mobileAndTabletcheck()) {
                    switch (name) {
                        case "tshi_station_from":
                            var sib = field.closest("form").find("input[name='tshi_station_to']");
                            if (sib.val() == "") sib.siblings(".twitter-typeahead").find(".tt-input").click();
                            break;
                        case "tshi_station_to":
                            //Focus TODO
                            var dp = $(this).closest(".fields-container").find('.date.from').find("input[name='book_from_date']");
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
}