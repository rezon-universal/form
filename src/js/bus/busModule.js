const PassItem = require('./PassItem');
const DirectionType = require('./DirectionType');
const BusLocation = require('./BusLocation');
const validator = require('./validator');
const dataWork = require('./dataWork');

const BusFormSaverData = require('./BusFormSaverData');

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
                formTypes: routeTypes,
                formType: routeTypes[0],
                Date: null,
                //BackDate: null,
                LocationFrom: new BusLocation(),
                LocationTo: new BusLocation()
            }
        };
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        return this.it.extra.remoteUrl() + "/Bus/ModuleSearch";
    }
    //Получить подсвеченные даты в датапикере
    datepickerGetHighlight() {
        if (this.options.buses.formType.value === 'roundtrip') {
            return {
                from: this.options.buses.Date.length ? this.options.buses.Date[0] : undefined,
                //to: this.options.buses.BackDate.length ? this.options.buses.BackDate[0] : undefined
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
            template: ' <div class="inside" v-if="item" :class="{\'with-region\' : item.RegionName !== null && item.RegionName !== undefined}">' +
                '<input type="text" :class="inputClasses" v-model="item.Name" data-local="true" @keyup="checkItem" data-localPlaceholder="BUSES_PLACEHOLDER" :placeholder="placeholder"/>' +
                '<div class="express">' +
                '{{item.Code}}' +
                '</div>' +
                '<div class="location-region">' +
                '<template>{{item.RegionName}}</template>' +
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
                updateBusItem: function (newValue) {
                    this.item = newValue;
                    this.$emit('input', this.item);

                    if(this.item.RegionName !== undefined && this.item.RegionName !== null) {
                        this.arrRegion = this.item.RegionName.split(' ,');
                        this.item.RegionName = this.arrRegion[0];
                    }
                },
                clearItem: function () {
                    this.arrRegion = null;
                    this.item = new BusLocation();
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
                        this.item.CountryName = '';
                        this.item.Id = '';
                        this.item.RegionName = '';
                        this.arrRegion = null;
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

        this.vue = new Vue({
            el: bindTo[0],
            mixins: [this.getVueBase(mountedCallback)],
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
                busesDefaultDate: function () {
                    var defaultDate = new Date();
                    defaultDate.setDate(defaultDate.getDate() + 7);
                    return defaultDate;
                },
                busesDefaultBackDate: function () {
                    var defaultBackDate = new Date();
                    defaultBackDate.setDate(defaultBackDate.getDate() + 14);
                    return defaultBackDate;
                },    

                busesDateThere: function () {
                    var busesDate = new Date(this.today.getTime());
                    return busesDate;
                },
                busesDateBack: function () {
                    var busesDateBack = new Date(this.today.getTime());
                    busesDateBack.setDate(busesDateBack.getDate() + 2);
                    return busesDateBack;
                }
            },
            methods: {
                updateLocationTypeAhead: function (name, data) {
                    var cityItem = new BusLocation(data);
                    vue.$emit("cityUpdate", name, cityItem);
                },    
                swapBusDest: function () {
                    var to = this.buses.LocationFrom;
                    var from = this.buses.LocationTo;
                    this.buses.LocationFrom = from;
                    this.buses.LocationTo = to;

                },
                clearBusForm: function () {
                    this.buses.Date = [this.busesDefaultDate];
                    //this.buses.BackDate = this.busesDefaultBackDate;
                    this.buses.cityFrom = new BusLocation();
                    this.buses.cityTo = new BusLocation();
                    var model = this;
                    Vue.nextTick(function () {
                        // DOM updated
                        model.updateHtmlElements();
                    });
                },
                busTypeChanged: function (index) {
                    this.buses.formType = this.buses.formTypes[index];
                },
                submitHandler(e) {
                    let checker = new validator(local.form, local.it);
                    let isValid = checker.isValid();
                    if (!isValid) {
                        e.preventDefault();
                        return false;
                    }
                    
                    let data = local.getCurrentFormData();
                    local.formSaver.saveNewItem(data);

                    const formData = {
                        LocationFromId: this.buses.LocationFrom.Id,
                        LocationToId: this.buses.LocationTo.Id,
                        Date: this.buses.Date[0]
                    }

                    if (local.options.projectUrl.startsWith("/") && typeof window.main !== 'undefined' && window.main.bus != undefined && window.main.bus.searchForm != undefined) {
                        e.preventDefault();
                        return window.main.busesSearch.newSearch(formData);
                    }

                    return true;
                },
                selectHistoryItem : function(history) {
                    local.formSaver.selectItem(history);
                }
            },
            watch: {
                'buses.Date': function (value) {
                    value.forEach((x, index)=> {
                        //if (x > this.buses.BackDate) {
                        //    this.buses.BackDate = value;
                        //}
                        if (x > this.dates.busesMaxDate) {
                            this.$set(this.buses.Date, index, this.dates.busesMaxDate);
                        }
                        if (x < this.dates.busesMinDate) {
                            this.$set(this.buses.Date, index, this.dates.busesMinDate);
                        }
                    });
                },
                //'buses.BackDate': function (value) {
                //    if (value < this.buses.Date) {                        
                //        this.buses.Date = value;
                //    }
                //    if (value > this.dates.busesMaxDate) {
                //        this.buses.BackDate = this.dates.busesMaxDate;
                //    }
                //    if (value < this.dates.busesMinDate) {
                //        this.buses.BackDate = this.dates.busesMinDate;
                //    }
                //}
            },
            created: function () {
                //Global variable
                this.dates.busesMinDate = this.busesMinDate;
                this.dates.busesMaxDate = this.busesMaxDate;
              
                if (!this.buses.Date || !this.buses.Date.length)
                {
                    this.buses.Date = [this.busesDefaultDate];
                }
                //if (!this.buses.BackDate && this.buses.formType === "roundtrip")
                //{
                //    this.buses.BackDate = this.busesDefaultBackDate;
                //}
                //else if (this.buses.BackDate < this.buses.Date)
                //    this.buses.BackDate = this.buses.Date;


                window.vue = this;
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
        if (typeof(it._o.buses.ticketCount) !== 'undefined') {
            it._o.buses.passenger.count = it._o.buses.ticketCount;
        }
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
            source: dw.busLocationFinderData.ttAdapter(),
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
                    if (data.length > 0) {
                        ret.push(
                            {
                                key: $("<span class='country-separator'><small>" + data[0].CountryCode + "</small><span>"),
                                value: undefined
                            });
                    }
                    for (let i = 0; i < data.length; i++) {
                        var region = data[i].RegionName || "";
                        ret.push({
                            key: "<div class='city'><span class='city-name'>" + data[i].TypeShortName + " " + data[i].Name + "</span><span class='city-region'>" + region.split(' ,').join(' ,') + "</span></div>",
                            value: {
                                Id: data[i].Id,
                                Name: data[i].Name,
                                TypeShortName: data[i].TypeShortName,
                                TypeName: data[i].TypeName,
                                RegionName: data[i].RegionName,
                                CountryName: data[i].CountryName
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
                vue.updateLocationTypeAhead(name, datum);
                if (!it.extra.mobileAndTabletcheck()) {
                    switch (name) {
                        case "LocationFromId":
                            var sib = field.closest("form").find("input[name='LocationToId']");
                            if (sib.val() === "") sib.siblings(".twitter-typeahead").find(".tt-input").click();
                            break;
                        case "LocationToId":
                            //Focus TODO
                            var dp = $(this).closest(".fields-container").find('.date.from').find("input[name='Date']").siblings(".book-date");
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
        return new BusFormSaverData(this);
    }
    getCurrentFormDataName() {
        return 'BusFormSaverData';
    }
}