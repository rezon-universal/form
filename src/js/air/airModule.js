const AirportItem = require('./AirportItem');
const DirectionType = require('./DirectionType');
const PassItem = require('./PassItem');
const EmptyRouteItem = require('./EmptyRouteItem');

const validator = require('./validator');
const dataWork = require('./dataWork');
const pricesCalendar = require('./pricesCalendar');

const AirFormSaverData = require('./AirFormSaverData');


let routeTypes = [
    new DirectionType('oneway', 'ONE_WAY')
    , new DirectionType('roundtrip', 'ROUND_TRIP')
    , new DirectionType('route', 'MULTY_ROUTE')
];
let defaultPassItems = [
    new PassItem('psgAdultsCnt', 'PASS_CAT_ADT', 'PASS_CAT_ADT_DESC', 1),
    new PassItem('psgKidsCnt', 'PASS_CAT_CNN', 'PASS_CAT_CNN_DESC'),
    new PassItem('psgInfantsNSCnt', 'PASS_CAT_INF', 'PASS_CAT_INF_NS_DESC'),
    new PassItem('psgOldCnt', 'PASS_CAT_SNN', 'PASS_CAT_SNN_DESC'),
    new PassItem('psgYouthCnt', 'PASS_CAT_YTH', 'PASS_CAT_YTH_DESC'),
    new PassItem('psgInfantsCnt', 'PASS_CAT_INF', 'PASS_CAT_INF_WS_DESC')
];
let additionalPassItems = [];

const formModuleBase = require('./../formModuleBase');
module.exports = class airModule extends formModuleBase {
    getExtendedOptions()
    {
        return {
            dates: {
                airMinDate: null,
                airMaxDate: null
            },
            avia: {
                defaultRouteType: null, // [oneway/roundtrip/multy]
                defaultAirportFrom: null, // IATA code, ex. IEV 
                defaultAirportTo: null, // IATA code, ex. IEV
                onlySpecificAirportsInDropdown: false, //bool indicator, that says to use only specific airports list in dropdown (search of airports will be deactivated)
                
                enabledPassengerTypes: 'psgAdultsCnt,psgKidsCnt,psgInfantsNSCnt,psgOldCnt,psgYouthCnt,psgInfantsCnt',// string enabledPassengerTypes, 
                
                // Разрешенный к выбору +-3 дня
                enabledDateRange: 0,
                // Выбранный интервал +-N дней
                intervalCount: 0,

                dateThere: null, // [dd.MM.yyyy]
                dateBack: null, // [dd.MM.yyyy]
                // Минимально дней до вылета
                plusDaysShift: 1, // -1 - 10
                // Максимально дней до вылета
                maxDaysSearch: 360, // 1 - 360
                disabledDatesFrom: [],
                disabledDatesTo: [],
                pricesCalendarEnabled: false,

                //temp
                formTypes: routeTypes,
                formType: routeTypes[1],
                //Является ли форма - промо формой (вычисляемое свойство)
                isAirPromo: false,
                //Жестко переопределить, что текущая форма всегда является промо формой (для промо страницы), даже когда выбраны только пары городов
                isAirPromoRewrited: undefined,
                //Признак, что промо форма разрешена, необходим для того, что бы на главной странице отобразить надпись "искать везде"
                isAirPromoAllowed: undefined,
                aviFrom: new AirportItem(),
                aviTo: new AirportItem(),
                passengers: {
                    types: defaultPassItems,
                    additionalTypes: additionalPassItems,
                    storageTypes: [],
                    hasError: false,
                    messages: []
                },
                maxPassangersCount: 9,
                maxCategoriesCount: 6,
                multyRoutes: [],
                maxRoutesCount: 3,
                segmentsCount: 2,
                historyGuid: '',
                //end temp
                
                
                //Новые фильтра, которые применяются как фильтра после совершения поиска
                filters: {
                    onlyDirectFlights: false
                }
            }
        };
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        return this.it.extra.remoteUrl() + "/AirTickets/ModuleSearch";
    }
    datepickerGetHighlight() {
        // Если вылет туда -- диапазон --- подсвечиваем диапазон "туда"
        if (this.options.avia.dateThere.length > 1) {
            return {
                from: this.options.avia.dateThere[0],
                to: this.options.avia.dateThere[1]
            }
        }
        if (this.options.avia.formType.value === 'roundtrip') {
            return {
                from: this.options.avia.dateThere[0],
                to: this.options.avia.dateBack[0]
            }
        }
        return {};
    }
    datepickerGetDisabled(datepicker) {
        return {
            to: datepicker.minDate !== undefined ? datepicker.minDate : this.vue.dates.airMinDate,
            from: datepicker.maxDate !== undefined ? datepicker.maxDate : this.vue.dates.airMaxDate,
            dates: datepicker.disabledDates
        }
    }
    //Датапикер - выбрано значение (ивент)
    datepickerSelected(datepicker) {
        var isMobile = this.it.extra.mobileAndTabletcheck();
        //Не меняем фокус для мобильных устройств
        if (isMobile) return;

        if (datepicker.name === 'book_from_date') {
            if (datepicker.highlighted.to !== undefined && datepicker.highlighted.to !== null) {
                var el = $(datepicker.$el);
                var nextDatePick = el.closest('.fields-container').find('.date.to').find("input[name='book_to_date']").siblings(".book-date");

                setTimeout(function () {
                    nextDatePick.focus();
                }, 100);
            }else {
                this.it._form.find(":submit").focus();
            }
        }else if(datepicker.name === 'book_to_date') {
            this.it._form.find(":submit").focus();
        }
    }

    //Подключение Vue
    bindVue(bindTo, mountedCallback) {
        var local = this;
        //Airport typeahead input component
        Vue.component('airportInput', {
            template:
                '<div class="inside">' +
                '<input type="text" :placeholder="placeholder" :class="inputClasses" v-model="item.Airport" data-local="true" @keyup="checkItem" :data-localPlaceholder="placeholder" @focus="focus" @blur="blur" />' +
                '<div class="iata" v-bind:class="{\'no-visiblity\': item.IataCode==null}">{{item.IataCode}}</div>' +
                '<div class="country hidden">{{item.CountryName}} {{item.CountryCode}}</div>' +
                '<span href="#" class="delete" v-bind:class="{\'no-visiblity\': item.Airport==null}" v-on:click="clearItem()"></span>' +
                '<input type="hidden" :name="name" v-model="item.IataCode"/>' +
                '<div v-if="focused && suggestions.length > 0" class="suggestions">' +
                '   <a v-for="sugg in suggestions" href="#" :class="[\'suggestion\', \'suggestion-\'+sugg.code.replace(\'!\',\'\')]" v-on:click.prevent="selectSuggestion(sugg)">' +
                '       <span v-html="sugg.text"></span>' +
                '   </a>' +
                '</div>' +
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
                    default: "PLACEHOLDER_AIRPORT2"
                }
            },
            computed: {
                inputClasses: function () {
                    var input = $(this.$el).find('input:not(.tt-hint).' + this.inputClass)[0];
                    var classes = [this.inputClass];

                    if (input !== undefined && input !== null) {
                        classes = input.className.split(' ');
                    }

                    if (this.item.IataCode === null || this.item.IataCode === undefined || this.item.IataCode.trim() === '') {
                        if (classes.indexOf('isEmpty') < 0) {
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
                },
                suggestions: function() {
                    if (this.name === "to_iata" && local.options.avia.isAirPromoAllowed && !this.value.IataCode && local.options.avia.formType.value !== 'route') {
                        return [
                        {
                            code: '!WR',
                            text: '<span class="q">' + local.it.extra.locale('CANNT_DECIDE_WHERE') + '</span><span>' + local.it.extra.locale('CLICK_HERE_TO_SEARCH_EVERYWHERE') + '</span>',
                            name: local.it.extra.locale('EVERYWHERE')
                        }];
                    }
                    return [];
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
                                $(el).find('.' + selector).typeahead('val', newValue.Airport);

                            });
                        }
                    },
                    deep: true
                }
            },
            data: function () {
                return {
                    item: this.value,
                    disabledDates: undefined,
                    focused: false,
                    blurTimeout: undefined
                }
            },
            methods: {
                updateAviItem: function (newValue) {
                    this.item = newValue;
                    this.$emit('input', this.item);
                },
                bridgeClearMapPoint: function () {
                    if (this.inputClass === "book-from") {
                        $(document).trigger("StartPtChange.MapBridge", [undefined]);
                    } else {
                        $(document).trigger("EndPtChange.MapBridge", [undefined]);
                    }
                },
                clearItem: function () {
                    this.item = new AirportItem();
                    this.$emit('input', this.item);
                    
                    var comp = this;
                    Vue.nextTick(function () {
                        //Update typeahead
                        var el = comp.$el;
                        var selector = comp.inputClass;
                        $(el).find('.' + selector).typeahead('val', '').focus();
                        comp.bridgeClearMapPoint();
                        local.vue.checkAirPromoSelection();
                    });
                },
                checkItem: function (event) {
                    if (event.key !== "Enter" && event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Shift" && event.key !== "Tab") {
                        this.item.CountryCode = '';
                        this.item.CountryName = '';
                        this.item.IataCode = '';
                        this.$emit('input', this.item);
                        this.bridgeClearMapPoint();
                    }
                },
                focus: function() {
                    this.blurTimeout && clearTimeout(this.blurTimeout);
                    this.focused = true;
                },
                blur: function() {
                    this.blurTimeout = setTimeout(()=>{
                        this.focused = false;
                    },100);
                },
                selectSuggestion: function(sugg) {
                    local.vue.$emit('airportUpdate', this.name, new AirportItem(sugg.code, sugg.code, sugg.name, sugg.name));
                }
            },
            created: function () {
                var comp = this;
                
                local.vue.$on('airportUpdate', function (name, airport) {
                    if (comp.name === name) {
                        var item = $(comp.$el).closest(".control-field");

                        local.it.extra.closeField(item);

                        //Меняем фокус только когда форма инициализирована (что бы фокус не плясал при инициализации полей по-умолчанию)
                        if (local.it._initialized && !local.it.extra.mobileAndTabletcheck()) {
                            //Меняем фокус
                            if (name === "from_iata") {
                                //Фокус на аэропорт прибытия
                                $(comp.$el).closest(".fields-container").find(".book-to.tt-input").trigger("click");
                            } else if (name === "to_iata") {
                                //Фокус на дату вылета
                                var dp = $(comp.$el).closest(".multy-route, .fields-container").find('.date:first').find("input[name^='book_from_']").siblings(".book-date");

                                setTimeout(function () {
                                    dp.focus();
                                }, 100);
                            }else {
                                //Hide mobile keyboard
                                $(':focus').blur();
                            }
                        }else {
                            //Hide mobile keyboard
                            $(':focus').blur();
                        }
                        if (name === "from_iata") {
                            $(document).trigger("StartPtChange.MapBridge", [airport]);
                        } else {
                            $(document).trigger("EndPtChange.MapBridge", [airport]);
                        }


                        comp.updateAviItem(airport);

                        local.vue.checkAirPromoSelection();
                    }
                });
                local.vue.$on('clearItem', function (name) {
                    if (comp.name === name) {
                        comp.clearItem();
                    }
                });
            }
        });
        new Vue({
            el: bindTo[0],
            mixins: [this.getVueBase(mountedCallback)],
            data: () => ({
                Items: [],
                isActive: false,

                dateAttributesThere: {},
                dateAttributesThereLoading: false,
                dateAttributesBack: {},
                dateAttributesBackLoading: false,
            }),
            computed: {
                passString: function () {
                    var str = "";
                    var oneCategory = true;
                    var cat = "";
                    var count = 0;

                    this.avia.passengers.types.forEach(function (value) {
                        count += value.count;
                        if (value.count > 0) {
                            if (cat === "") {
                                cat = value.name;
                            } else {
                                oneCategory = cat === value.name;
                            }
                        }
                    });

                    str = "";
                    var oneNumber = cat, zeroNumber = cat, fourNumber = cat;
                    if (oneCategory) {
                        switch (cat) {
                            case "psgInfantsCnt":
                                oneNumber = "PASS_CAT_INF_NS_1";
                                zeroNumber = "PASS_CAT_INF_NS_0";
                                fourNumber = "PASS_CAT_INF_NS_4";
                                break;
                            case "psgInfantsNSCnt":
                                oneNumber = "PASS_CAT_INF_WS_1";
                                zeroNumber = "PASS_CAT_INF_WS_0";
                                fourNumber = "PASS_CAT_INF_WS_4";
                                break;
                            case "psgKidsCnt":
                                oneNumber = "PASS_CAT_CNN_1";
                                zeroNumber = "PASS_CAT_CNN_0";
                                fourNumber = "PASS_CAT_CNN_4";
                                break;
                            case "psgYouthCnt":
                                oneNumber = "PASS_CAT_YTH_1";
                                zeroNumber = "PASS_CAT_YTH_0";
                                fourNumber = "PASS_CAT_YTH_0";
                                break;
                            case "psgAdultsCnt":
                                oneNumber = "PASS_CAT_ADT_1";
                                zeroNumber = "PASS_CAT_ADT_0";
                                fourNumber = "PASS_CAT_ADT_0";
                                break;
                            case "psgOldCnt":
                                oneNumber = "PASS_CAT_SNN_1";
                                zeroNumber = "PASS_CAT_SNN_0";
                                fourNumber = "PASS_CAT_SNN_0";
                                break;
                            default:
                                oneNumber = "C_PASSENGER";
                                zeroNumber = "C_PASSENGERS";
                                fourNumber = "C_PASSEGNERS2";        
                        }
                    } else {
                        oneNumber = "C_PASSENGER";
                        zeroNumber = "C_PASSENGERS";
                        fourNumber = "C_PASSEGNERS2";
                    }
                    if (count == 0 || (count >= 5 && count <= 20)) {
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
                    if (count == 0) {
                        str = "SPECIFY_PASSENGERS";
                        return this.locale(str);
                    }
                    return count + " " + this.locale(str);
                },
                today: function () {
                    var todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    return todayDate;
                },
                airMinDate: function () {
                    var airMinDate = new Date(this.today.getTime());
                    airMinDate.setDate(this.today.getDate() + parseInt(this.avia.plusDaysShift));
                    return airMinDate;
                },
                airMaxDate: function () {
                    var airMaxDate = new Date(this.today.getTime());
                    airMaxDate.setDate(this.today.getDate() + parseInt(this.avia.maxDaysSearch));
                    return airMaxDate;
                },
                aviaDefaultDateThere: function () {
                    var defaultDateThere = new Date();
                    defaultDateThere.setHours(0, 0, 0, 0);
                    defaultDateThere.setDate(defaultDateThere.getDate() + 7);
                    return defaultDateThere;
                },
                aviaDefaultDateBack: function () {
                    var defaultDateBack = new Date();
                    defaultDateBack.setHours(0, 0, 0, 0);
                    defaultDateBack.setDate(defaultDateBack.getDate() + 14);
                    return defaultDateBack;
                }
            },
            methods: {
                onClickOutside: function () {
                    this.isActive = false;
                },
                toggleClass: function () {
                    this.isActive = !this.isActive;
                },
                addAdditionalPassenger(type, index) {
                    this.avia.passengers.types.push(type);
                    this.avia.passengers.additionalTypes.splice(index, 1);
                    this.isActive = false;

                    this.avia.passengers.storageTypes.push(type);
                    typeof(localStorage) !== 'undefined' && localStorage.setItem('AdditionalPassenger', JSON.stringify(this.avia.passengers.storageTypes));
                },
                deleteAdditionalPassenger(passenger, index) {
                    this.avia.passengers.types.splice(index, 1);
                    passenger.count = 0;
                    this.avia.passengers.additionalTypes.push(passenger);

                    this.avia.passengers.storageTypes.forEach((type, index) => {
                        if(type.standartPTC === passenger.standartPTC) {
                            this.avia.passengers.storageTypes.splice(index, 1);
                        }
                    })
                    typeof(localStorage) !== 'undefined' && localStorage.setItem('AdditionalPassenger', JSON.stringify(this.avia.passengers.storageTypes));
                },
                filterAdditional() {
                    let filterTypes = [];

                    this.avia.passengers.additionalTypes.filter(additional => {
                        if(this.avia.enabledPassengerTypes.indexOf(additional.name) > -1) {
                            filterTypes.push(additional);
                        }
                    });

                    return filterTypes;
                },

                //Avia methods
                typeChanged: function (index) {
                    //0-oneway,1-roundtrip,2-route
                    this.avia.formType = routeTypes[index];
                    if (this.avia.formType.value === 'roundtrip') {
                        this.avia.segmentsCount = 2;
                        //Добавляем +6 дней от даты туда
                        this.avia.dateBack = [...this.avia.dateThere].map(d=> {
                            var newDate = new Date(d.getTime());
                            newDate.setDate(newDate.getDate() + 6);
                            return newDate;
                        });
                    } else {
                        this.avia.segmentsCount = 1;
                    }
                    if (this.avia.multyRoutes.length > 0) {
                        this.avia.multyRoutes = [];
                    }
                    $(document).trigger("RouteTypeChange.MapBridge", [this.avia.formType]);
                    if (this.avia.formType.value === 'route') {
                        //Для сложного маршрута сразу добавляем второй лег, иначе в сложном маршруте нет смысла
                        this.addSegment();
                    }

                    //Vue.nextTick(function () {
                    //    $(document).find(".select-route-type").trigger("redraw");
                    //});
                    
                },
                removePassenger: function (type) {
                    this.avia.passengers.types.forEach(function (value) {
                        if (value.name === type && value.count > 0) {
                            value.count--;
                        }
                    });
                    this.passUpdate();
                },
                addPassenger: function (type) {
                    this.avia.passengers.types.forEach(function (value) {
                        if (value.name === type && !value.disabled) {
                            value.count++;
                        }
                    });
                    this.passUpdate();
                },
              
                passUpdate: function () {
                    var currCount = 0;
                    var adultCnt = 0;
                    var infantCnt = 0;
                    this.avia.passengers.messages = [];
                    this.avia.passengers.hasError = false;
                    var adultsCat = this.avia.passengers.adultsCat || ["psgAdultsCnt", "psgOldCnt", "psgYouthCnt"];
                    var infantsCat = this.avia.passengers.infantsCat || ["psgInfantsCnt", "psgInfantsNSCnt"]; 
                    this.avia.passengers.types.forEach(function (value) {
                        currCount += value.count;
                        if (adultsCat.indexOf(value.name) >= 0) {
                            adultCnt += value.count;
                        }
                        if (infantsCat.indexOf(value.name) >= 0) {
                            infantCnt += value.count;
                        }
                    });

                    var availablePassCount = this.avia.maxPassangersCount - currCount;
                    var categoriesCount = 0;
                    const maxCategoriesCount = this.avia.maxCategoriesCount;
                    this.avia.passengers.types.forEach(function (value) {
                        value.disabled = availablePassCount < 1;

                        if (value.count > 0) categoriesCount++;
                        if (categoriesCount >= maxCategoriesCount
                            || infantsCat.indexOf(value.name) >= 0 && (adultCnt === 0 || adultCnt < infantCnt + 1)) {
                            value.disabled = true;
                        }
                    });
                    if (currCount === 0) {
                        this.addPassenger('psgAdultsCnt');
                        //this.avia.passengers.hasError = true;
                        //this.avia.passengers.messages.push("VALIDATE_FORM_SEARCH_MESSAGE_2");
                    }
                    if (adultCnt < infantCnt) {
                        this.avia.passengers.hasError = true;
                        this.avia.passengers.messages.push("VALIDATE_FORM_SEARCH_MESSAGE_3");
                    }
                },
                updateAirportTypeAhead: function (name, data) {
                    if (data == null) {
                        this.$emit('clearItem', name);
                        return;
                    }
                    var airportItem = new AirportItem(data.IataCode, data.CountryCode, data.CountryName, data.Name);
                    this.$emit('airportUpdate', name, airportItem);
                },
                //Проверяем, указал ли человек в поисковой форме страну в качестве вылета или назначения (AirPromo функционал)
                checkAirPromoSelection: function() {
                    //На странице с промо форма является промо всегда, что бы можно было выбрать пары городов
                    if (local.options.avia.isAirPromoRewrited) {
                        local.options.avia.isAirPromo = true;
                        return;
                    }
                    const countryRegex = /^!?[A-Z]{2}$/g;
                    if((local.options.avia.aviFrom && local.options.avia.aviFrom.IataCode && local.options.avia.aviFrom.IataCode.match(countryRegex))
                        || (local.options.avia.aviTo && local.options.avia.aviTo.IataCode && local.options.avia.aviTo.IataCode.match(countryRegex))
                        ) {
                        local.options.avia.isAirPromo = true;
                    }else {
                        local.options.avia.isAirPromo = false;
                    }
                },
              
                addSegment: function () {
                    if (this.avia.multyRoutes.length < this.avia.maxRoutesCount) {
                        var length = this.avia.multyRoutes.length;
                        var obj = new EmptyRouteItem();
                        obj.dateThere = [...this.avia.dateThere];
                        if (length === 0) {
                            var avi = $.extend({}, this.avia.aviTo);
                            obj.aviFrom = avi;
                        } else {
                            if (this.avia.multyRoutes[length - 1].aviTo !== undefined && this.avia.multyRoutes[length - 1].aviTo !== null) {
                                var avi = $.extend({}, this.avia.multyRoutes[length - 1].aviTo);
                                obj.aviFrom = avi;
                            }
                        }
                        this.avia.multyRoutes.push(obj);
                        this.avia.segmentsCount += 1;
                        var index = this.avia.multyRoutes.length - 1;
                        this.updateMultyDates();
                        Vue.nextTick(function () {
                            // DOM updated                        
                            //index+2 for selector
                            $(document).trigger('addSegment', index + 2);
                        });
                    }
                },
                updateMultyDates: function () {
                    if (this.avia.formType.value !== 'route') return;
                    
                    const length = this.avia.multyRoutes.length;
                    for(let i = -1; i < length; i++) {
                        let currRoute = this.avia.multyRoutes[i];
                        //Первый маршрут не числится как маршрут :(
                        if (i === -1) {
                            currRoute = new EmptyRouteItem();
                            currRoute.dateThere = [...this.avia.dateThere];
                        }
                        let nextRoute = (i + 1) < length ? this.avia.multyRoutes[i + 1] : null;
                        if (nextRoute) {
                            nextRoute.minDate = currRoute.dateThere[0];
                            if (nextRoute.minDate > nextRoute.dateThere[0]) {
                                nextRoute.dateThere = [nextRoute.minDate];
                            }
                        }
                    }

                },
                removeSegment: function (index) {
                    this.avia.multyRoutes.splice(index, 1);
                    this.avia.segmentsCount -= 1;
                    this.updateMultyDates();
                    //Если удалили все сегменты, то в сложном маршруте нет смысла. Делаем OW
                    if(this.avia.multyRoutes.length === 0) {
                        this.typeChanged(0);
                    }
                },
                swapAviaDest: function () {
                    var to = this.avia.aviFrom;
                    var from = this.avia.aviTo;
                    this.avia.aviFrom = from;
                    this.avia.aviTo = to;

                    $(document).trigger("StartPtChange.MapBridge", [from]);
                    $(document).trigger("EndPtChange.MapBridge", [to]);
                },
                selectHistoryItem : function(history) {
                    local.formSaver.selectItem(history);
                    this.passUpdate();
                    
                    this.checkAirPromoSelection();
                },
                selectDateToCalendar : function() {
                    Vue.nextTick(function () {
                        $('[name="book_to_date"]').siblings(".book-date").focus();
                    });
                },
                //Загрузка цен для календаря
                loadPrices: function(type) {
                    if (!local.it.pricesCalendar) return;
                    if (local.options.avia.isAirPromo) {
                        local.it.pricesCalendar.clear(type);
                        return;
                    }
                    local.it.pricesCalendar.load(type);                    
                },
                //Получить большую дату из диапазона
                getMaxDateRange: function(datesArray) {
                    if (datesArray == undefined || !datesArray.length) return undefined;
                    if (datesArray.length === 1) return datesArray[0];
                    return datesArray[1];
                },
                //Получить меньшую дату из диапазона
                getMinDateRange: function(datesArray) {
                    if (datesArray == undefined || !datesArray.length) return undefined;
                    if (datesArray.length === 1) return datesArray[0];
                    return datesArray[0];
                },
                getFirstDateAttributeCurrency: function(datesAttributes){
                    if (!datesAttributes) return [undefined];
                    const keys = Object.keys(datesAttributes);
                    if (!keys.length) return [undefined];
                    return [datesAttributes[keys[0]].currency];
                },
                clickOnDateRange: function(clickedDateRange) {
                    if (this.avia.intervalCount === clickedDateRange) {
                        this.avia.intervalCount = undefined;
                    } else {
                        this.avia.intervalCount = clickedDateRange;
                    }
                }
            },
            watch: {
                'avia.dateThere': function (value) {
                    var currentMinValue = this.getMinDateRange(value);
                    
                    this.avia.dateBack.forEach((v, index)=> {
                        if (currentMinValue > v) {
                            this.$set(this.avia.dateBack, index, currentMinValue);
                        }
                    });
                    value.forEach((v, index)=> {
                        if (v > this.dates.airMaxDate) {
                            this.$set(this.avia.dateThere, index, this.dates.airMaxDate);
                        }
                        if (v < this.dates.airMinDate) {
                            this.$set(this.avia.dateThere, index, this.dates.airMinDate);
                        }
                    });
                },
                'avia.dateBack': function (value) {
                    var currentMaxValue = this.getMaxDateRange(value);
                    if (this.avia.dateThere[0] > currentMaxValue) {
                        if (this.avia.formType.value === "roundtrip") {
                            this.$set(this.avia.dateThere, 0, currentMaxValue);
                        } else {
                            this.avia.dateBack = [...this.avia.dateThere];
                        }
                    }
                    value.forEach((dateBack, indexBack) => {
                        if (dateBack > this.dates.airMaxDate) {
                            this.$set(this.avia.dateBack, indexBack, this.dates.airMaxDate);
                        }
                        if (dateBack < this.dates.airMinDate) {
                            this.$set(this.avia.dateBack, indexBack, this.dates.airMinDate);
                        }
                    });
                },
                'avia.passengers.pricePTCOnly': function(value) {
                    typeof(localStorage) !== 'undefined' && localStorage.setItem('pricePTCOnly', JSON.stringify(value));
                },
                'avia.isAirPromo': function(newvalue, oldvalue) {
                    if (newvalue) {
                        if (this.avia.dateThere.length === 1) this.avia.dateThere.push(this.avia.dateThere[0]);
                        if (this.avia.dateBack.length === 1) this.avia.dateBack.push(this.avia.dateBack[0]);
                        //Оставляем только 1 взрослого
                        this.avia.passengers.types.forEach(function (value) {
                            value.count = value.name === "psgAdultsCnt" ? 1 : 0;
                        });
                    }else {
                        this.avia.dateThere = [this.avia.dateThere[0]];
                        this.avia.dateBack = [this.avia.dateBack[0]];
                    }
                },
                'avia.filters.onlyDirectFlights': function(newvalue, oldvalue) {
                    local.it.pricesCalendar && local.it.pricesCalendar.reload();
                }
            },
            created: function () {
                //Global variable
                this.dates = {};
                this.dates.airMinDate = this.airMinDate;
                this.dates.airMaxDate = this.airMaxDate;
                
                if (!!this.avia.defaultRouteType) {
                    for(let r = 0; r < routeTypes.length; r++) {
                        if (routeTypes[r].value === this.avia.defaultRouteType) {
                            this.avia.formType = routeTypes[r];
                            break;
                        }
                    }
                }
                if (!this.avia.dateThere || !this.avia.dateThere.length || !this.avia.dateThere[0]) this.avia.dateThere = [this.aviaDefaultDateThere];
                if (!this.avia.dateBack || !this.avia.dateBack.length || !this.avia.dateBack[0]) this.avia.dateBack = [this.aviaDefaultDateBack];
                
                local.vue = this;
                window.airFormVue = this;

            },
            mounted: function () {
                let filterTypes = [];
                this.avia.passengers.additionalTypes = this.filterAdditional();

                this.avia.passengers.additionalTypes.forEach(type => {
                    if(type.count > 0) {
                        this.avia.passengers.types.push(type);
                    }
                    if(type.count === 0) {
                        filterTypes.push(type);
                    }
                })

                this.avia.passengers.additionalTypes = filterTypes;


                if (typeof(localStorage) !== 'undefined' && localStorage.getItem("AdditionalPassenger") !== null) {
                    let history = JSON.parse(localStorage.getItem("AdditionalPassenger"));
                    for (let item of history) {    
                        if (this.avia.passengers.types.some(t=> t.name === item.name)) continue;
                        this.avia.passengers.types.push(item);
                        this.avia.passengers.storageTypes.push(item);

                        this.avia.passengers.additionalTypes.forEach((type, index) => {
                            if(item.standartPTC === type.standartPTC) {
                                this.avia.passengers.additionalTypes.splice(index, 1);
                            }
                        });
                    }
                }
                if (typeof(localStorage) !== 'undefined' && localStorage.getItem("pricePTCOnly") !== null) {
                    this.avia.passengers.pricePTCOnly = JSON.parse(localStorage.getItem("pricePTCOnly"));
                }

                this.passUpdate();
            }
        });
    }
    //Инициализация модуля, вызывается после подключения Vue
    bind() {
        let module = this;
        let form = this.form;
        let it = this.it;
        let options = this.options;
		
		it.dw = new dataWork(form, it);
		let dw = it.dw;

        //Инициализация модуля для календаря с ценами
        if (options.avia.pricesCalendarEnabled)
            it.pricesCalendar = new pricesCalendar(it, options, this.vue);
        

        this.initializeDefaultAirportsIfNeed();

        //Отправка формы поиска авиабилетов
        form.submit(function () {
            var checker = new validator($(this), it);
            var isValid = checker.isValid();
            if (!isValid) return false;

            let data = module.getCurrentFormData();
            module.formSaver.saveNewItem(data);
            
            if (options.projectUrl.startsWith("/") && typeof main !== 'undefined' && main.airtickets != undefined && main.airtickets.searchForm != undefined && main.airtickets.searchForm.send != undefined) return main.airtickets.searchForm.send(form, options);
            return true;
        });

        form.bindAirportTypeahead = function (el) {
            el = el || form.find('.book-from, .book-to');
            var typeaheadOptions = {
                minLength: 2
            };
            if (options.avia.onlySpecificAirportsInDropdown) {
                typeaheadOptions = {
                    hint: true,
                    highlight: true,
                    minLength: 0,
                    isSelectPicker: true
                };
            }
            //Для мобильных делаем минимальную длину 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
            if (it.extra.mobileAndTabletcheck()) {
                typeaheadOptions.minLength = 0;
            }
            let airportsSource = dw.airportsCitiesFinderData.bind(dw);

            el.typeahead(typeaheadOptions, {
                name: "airports-" + options.defaultLang,
                displayKey: 'value',
                source: airportsSource,
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
                        ret.push(
                            {
                                key: $("<span class='country-separator'><small>" + data.countryName + " (" + data.countryCode + ")</small><span>"),
                                value: undefined
                            });
                        for (var airpIt = 0; airpIt < data.airports.length; airpIt++) {
                            ret.push({
                                key: data.airports[airpIt].airpName + (data.airports[airpIt].airpStateCode ? (", [" + data.airports[airpIt].airpStateCode + "]") : "") + " <small class='iata-code'>" + data.airports[airpIt].airpCode + "</small>",
                                value: {
                                    IataCode: data.airports[airpIt].airpCode,
                                    Name: data.airports[airpIt].airpName,
                                    CountryCode: data.countryCode,
                                    CountryName: data.countryName
                                }
                            });
                            if (data.airports[airpIt].includeItems && data.airports[airpIt].includeItems.length > 0)
                                for (var inclAirp = 0; inclAirp < data.airports[airpIt].includeItems.length; inclAirp++) {
                                    ret.push(
                                        {
                                            key: "<span class='item-child" + (inclAirp == 0 ? '-first' : '') + "'></span>" +
                                                "<span class='item-text'>" + data.airports[airpIt].includeItems[inclAirp].inclName + "</span>" +
                                                " <small class='iata-code'>" + data.airports[airpIt].includeItems[inclAirp].inclCode + "</small>",
                                            value: {
                                                IataCode: data.airports[airpIt].includeItems[inclAirp].inclCode,
                                                Name: data.airports[airpIt].includeItems[inclAirp].inclName,
                                                CountryCode: data.countryCode,
                                                CountryName: data.countryName
                                            }
                                        });
                                }
                        }
                        return ret;
                    }
                }
            }).focus(function () { 
                var item = $(this).closest('.field');
                it.extra.openField(item);
                item.addClass('focused').removeClass("has-error").find(".error-box").slideUp(it._o.animationDelay);
                item.closest(".fields-container").find(".field.has-error").removeClass("has-error").find(".error-box").slideUp(it._o.animationDelay);

                if (it._o.avia.onlySpecificAirportsInDropdown && $(this).is(".book-to")) {
                    //Если жестко фиксированный список аэропортов - подгружаем список доступных аэропортов для выбранного аэропорта "Туда"
                    var dp = $(this);
                    Vue.nextTick(function () {
                        dp.typeahead('query', "from_iata_" + dp.closest(".fields-container").find("[name='from_iata']").val());
                    });
                }
            }).blur(function () {
                $(this).closest('.field.focused').removeClass('focused');
            })
            .click(function () {
                $(this).select();
            }).on("typeahead:selected typeahead:autocompleted", function (e, datum, e2) {
                if (datum != undefined) {
                    var item = $(this).closest(".control-field");
                    var name = item.find(".inside input[type='hidden']").attr('name');
                    module.vue.updateAirportTypeAhead(name, datum);
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
                if ($.trim($(this).val()) === "") {
                    $(this).trigger("typeahead:queryChanged");
                } else {
                    if (item.hasClass("has-error")) {
                        item.removeClass("has-error").find(".error-box").slideUp(it._o.animationDelay);
                    }
                }


                if ($(this).val() !== "" && $(this).data("lastHist")) {
                    var _this = $(this);
                    var lastHint = $(this).data("lastHist");
                    var iata = item.find(".inside input[type='hidden']");
                    Vue.nextTick(function () {
                        if ($.trim(iata.val()) === "" && lastHint) {
                            //Обновляем последним запомненным только если клиент ничего не выбрал из выпадашки
                            _this.trigger("typeahead:autocompleted", [lastHint]);
                        }
                    });
                }

                it.extra.closeField(item);
            }).on("typeahead:queryChanged", function (it, query) {
            }).on("typeahead:updateHint", function (a, b) {
                if (b) $(this).data("lastHist", b);
                else $(this).removeData("lastHist");
            });
        };
        form.bindAirportTypeahead();

        $(document).on('addSegment', function (e, index) {
            var el = $('input[name="from_iata' + index + '"], input[name="to_iata' + index + '"]').closest('.multy-route');
            var inputs = $('input[name="from_iata' + index + '"], input[name="to_iata' + index + '"]').closest('.inside').find('.book-to, .book-from');

            //Init selectpicker for added segment field
            el.find(".selectpicker").each(function () {
                $(this).attr("tabindex", "-1");
                var radio = $(this).find("input:radio:checked");
                if (radio.length == 0) radio = $(this).find("input:radio:first");

                var selectedValue = $(this).find(".selected-value");
                if (selectedValue.length === 0) {
                    $("<div/>").prependTo($(this)).addClass("selected-value").append($("<span/>").html(radio.prev("span").html()));
                }
            });
            //Init Typeahead for added segment field
            form.bindAirportTypeahead(inputs);
        });


        //Passengers menu
        form.find(".passengers > .switch-box .switch").click(function () {
            if ($(this).is(".disabled")) return false;
            var selectAge = form.find(".select-age");
            var isMobile = it.extra.mobileAndTabletcheck();
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

        form.find(".select-age").focusin(function () {
            if ($(this).data('focusTimer')) clearTimeout($(this).data('focusTimer'));
            return false;
        }).on('blur focusout', function () {
            var selectAge = $(this);
            var isMobile = it.extra.mobileAndTabletcheck();
            var field = $(this).closest('.field');

            var updateClosedSelect = function (el) {
                el.addClass("g-hide").siblings(".switch-box").find(".switch.opened").removeClass("opened");
                it.extra.closeField(field);
                if (it.extra.isInIframe()) {
                    it.extra.recalculateHeightOnClose();
                }
            };
            if (isMobile) {
                $(this).fadeOut(300, function () {
                    updateClosedSelect($(this));
                });
            }
            else {
                $(this).data('focusTimer', setTimeout(function () {
                    selectAge.slideUp(it._o.animationDelay, function () {
                        updateClosedSelect($(this));
                    });
                }, 100));
            }
            return false;
        });
        form.find(".select-age .button-hide").click(function (e) {
            $(this).closest(".select-age").focus().blur();
            return false;
        });



        //Интеграция с картой
        $(document).on("StartPtChange.Map EndPtChange.Map", function (e, data) {

            var itemName = e.type == "StartPtChange"
                ? "from_iata"
                : "to_iata";

            if (!data) return module.vue.updateAirportTypeAhead(itemName);
            module.vue.updateAirportTypeAhead(itemName,
                {
                    IataCode: data.iata + "·",
                    CountryCode: data.countryCode,
                    CountryName: '',
                    Name: data.name
                });
        });


    }
    //Подгрузить данные (названия) аэропортов
    loadAirports(iataToDecode, callback) {
        var dataToSend = iataToDecode.join();
        var params = { iata_codes: dataToSend };
        $.getJSON(this.it.extra.remoteUrl() + '/HelperAsync/GetAirport?' + $.param(params), function (data) {
            var result = JSON.parse(data);
            var out = [];
            $.each(result, function (index, value) {
                if (value !== undefined && value !== null) {
                    out.push(new AirportItem(value.IataCode, value.CountryCode, value.CountryName, value.Airport));
                }
            });
            callback(out);
        });
    }
    //Подгрузить данные (названия) аэропортов, если в параметрах передали их как IATA коды
    initializeDefaultAirportsIfNeed() {
        var local = this;
        //Decode default IATA codes
        var aviData = [this.options.avia.defaultAirportFrom, this.options.avia.defaultAirportTo];

        var iataToDecode = $.map(aviData, function (val, i) {
            if (val !== undefined && val !== null && val.trim() !== '') {
                return val;
            }
        });
        $.unique(iataToDecode);

        if (iataToDecode.length > 0) {
            this.loadAirports(iataToDecode, function(result) {
                $.each(result, function (index, aviItem) {
                    if (aviItem.IataCode.substring(0, 3) === local.options.avia.defaultAirportFrom) {
                        local.options.avia.aviFrom = aviItem;
                    }
                    if (aviItem.IataCode.substring(0, 3) === local.options.avia.defaultAirportTo) {
                        local.options.avia.aviTo = aviItem;
                    }
                });
                local.vue.checkAirPromoSelection();
            });
        }
    }
    //Получение текущего объекта с формой
    getCurrentFormData() {
        return new AirFormSaverData(this);
    }
    getCurrentFormDataName() {
        return 'AirFormSaverData';
    }
}