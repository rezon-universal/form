const AirportItem = require('./AirportItem');
const DirectionType = require('./DirectionType');
const PassItem = require('./PassItem');
const CarrierItem = require('./CarrierItem');
const EmptyRouteItem = require('./EmptyRouteItem');

const validator = require('./validator');
const dataWork = require('./dataWork');

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
                //recAirportsFrom: [ "TLV" ],
                //recAirportsTo: [],
                defaultRouteType: null, // [oneway/roundtrip/multy]
                defaultAirportFrom: null, // IATA code, ex. IEV 
                defaultAirportTo: null, // IATA code, ex. IEV
                onlySpecificAirportsInDropdown: false, //bool indicator, that says to use only specific airports list in dropdown (search of airports will be deactivated)
                enabledCabinClasses: '1,2', // string cabinClasses, ex. "1,2" (Economy,Business)
                enabledPassengerTypes: 'psgAdultsCnt,psgKidsCnt,psgInfantsNSCnt,psgOldCnt,psgYouthCnt,psgInfantsCnt',// string enabledPassengerTypes, 
                enabledDateRange: 3,
                defaultDateThere: null, // dd.MM.yyyy
                defaultDateBack: null, // dd.MM.yyyy
                plusDaysShift: 1, // -1 - 10
                maxDaysSearch: 360, // 1 - 360
                disabledDatesFrom: [],
                disabledDatesTo: [],


                //temp
                formTypes: routeTypes,
                formType: routeTypes[1],
                aviFrom: new AirportItem(),
                aviFromTime: 0,
                aviTo: new AirportItem(),
                aviToTime: 0,
                passengers: {
                    types: defaultPassItems,
                    additionalTypes: additionalPassItems,
                    hasError: false,
                    messages: []
                },
                formExtended: false,
                maxPassangersCount: 6,
                multyRoutes: [],
                maxRoutesCount: 3,
                segmentsCount: 2,
                bookClass: 0,
                airCompanies: [],
                maxAirCompaniesCount: 3,
                intervalCount: 0,
                onlyDirect: false,
                historyGuid: '',
                isHotelSearchEnabled: false,
                hotelSearch: routeTypes[1].value === 'roundtrip',
                initByUser: false
                //end temp
            }
        };
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        return this.it.extra.remoteUrl() + "/AirTickets/ModuleSearch";
    }
    datepickerGetHighlight(datepicker) {
        if (this.options.avia.formType.value === 'roundtrip') {
            return {
                from: datepicker.dateFrom,
                to: datepicker.dateTo
            }
        }
        return {};
    }
    datepickerGetDisabled(datepicker) {
        return {
            to: datepicker.minDate !== undefined ? datepicker.minDate : vue.dates.airMinDate,
            from: datepicker.maxDate !== undefined ? datepicker.maxDate : vue.dates.airMaxDate,
            dates: datepicker.disabledDates
        }
    }
    //Датапикер - выбрано значение (ивент)
    datepickerSelected(datepicker) {
        var isMobile = this.it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
        if (datepicker.name === 'book_from_date' && datepicker.highlighted.to !== undefined && datepicker.highlighted.to !== null && !isMobile) {
            var el = $(datepicker.$el);
            var nextDatePick = el.closest('.fields-container').find('.date.to').find("input[name='book_to_date']");

            setTimeout(function () {
                nextDatePick.focus();
            }, 100);
        }
    }

    //Подключение Vue
    bindVue(bindTo, mountedCallback) {
        var local = this;

        //Airport typeahead input component
        Vue.component('airportInput', {
            template:
                '<div class="inside">' +
                '<input type="text" :placeholder="placeholder" :class="inputClasses" v-model="item.Airport" data-local="true" @keyup="checkItem" :data-localPlaceholder="placeholder"/>' +
                '<div class="iata" v-bind:class="{\'no-visiblity\': item.IataCode==null}">{{item.IataCode}}</div>' +
                '<div class="country hidden">{{item.CountryName}} {{item.CountryCode}}</div>' +
                '<span href="#" class="delete" v-bind:class="{\'no-visiblity\': item.Airport==null}" v-on:click="clearItem()"></span>' +
                '<input type="hidden" :name="name" v-model="item.IataCode"/>' +
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
                    disabledDates: undefined
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
                }
            },
            created: function () {
                var comp = this;

                vue.$on('airportUpdate', function (name, airport) {
                    if (comp.name === name) {
                        comp.updateAviItem(airport);
                    }
                });
                vue.$on('clearItem', function (name) {
                    if (comp.name === name) {
                        comp.clearItem();
                    }
                });
            }
        });

        Vue.directive('click-outside', {
            bind: function (el, binding, vnode) {
                el.event = function (event) {
                    if (!(el == event.target || el.contains(event.target))) {
                        vnode.context[binding.expression](event);
                    }
                };
                
                window.addEventListener('click', el.event);
            },
            unbind: function (el) {
                window.removeEventListener('click', el.event);
            }
        });

        var formBind = new Vue({
            el: bindTo[0],
            mixins: [{
                data: this.options
            }],
            data: () => ({
                Items: [],
                isActive: false
            }),
            computed: {
                allAirCompanies: function () {
                    var str = [];
                    if (this.avia.airCompanies.length === 0) {
                        str = this.locale('ANY_AVIACOMPANY');
                    } else {
                        str = $.map(this.avia.airCompanies, function (n) {
                            if (n !== undefined && n !== null && n.label != undefined && n.label != null) {
                                return n.label;
                            }
                        }).join(', ');
                    }
                    return str;
                },
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
                    defaultDateThere.setDate(defaultDateThere.getDate() + 7);
                    return defaultDateThere;
                },
                aviaDefaultDateBack: function () {
                    var defaultDateBack = new Date();
                    defaultDateBack.setDate(defaultDateBack.getDate() + 14);
                    return defaultDateBack;
                }
            },
            methods: {
                locale: this.it.extra.locale,
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
                },
                deleteAdditionalPassenger(passenger, index) {
                    this.avia.passengers.types.splice(index, 1);
                    passenger.count = 0;
                    this.avia.passengers.additionalTypes.push(passenger);
                },
                filterAdditional() {
                    let filterTypes = []

                    this.avia.passengers.additionalTypes.filter(additional => {
                        if(this.avia.enabledPassengerTypes.indexOf(additional.name) > -1) {
                            filterTypes.push(additional)
                        }
                    })

                    return filterTypes;
                },

                //Avia methods
                typeChanged: function (index) {
                    //0-oneway,1-roundtrip,2-route
                    this.avia.formType = routeTypes[index];
                    if (this.avia.formType.value === 'roundtrip') {
                        this.avia.segmentsCount = 2;
                        this.avia.defaultDateBack = new Date(this.avia.defaultDateBack);
                    } else {
                        this.avia.segmentsCount = 1;
                    }
                    if (this.avia.multyRoutes.length > 0) {
                        this.avia.multyRoutes = [];
                    }
                    $(document).trigger("RouteTypeChange.MapBridge", [this.avia.formType]);
                    
                    Vue.nextTick(function () {
                        $(document).find(".select-route-type").trigger("redraw");
                    });
                    
                },
                clearForm: function () {
                    this.avia.aviFrom = new AirportItem();
                    this.avia.defaultDateThere = this.aviaDefaultDateThere;
                    this.avia.aviFromTime = 0;
                    this.avia.aviTo = new AirportItem();
                    this.avia.defaultDateBack = this.aviaDefaultDateBack;
                    this.avia.aviToTime = 0;
                    this.avia.formExtended = false;
                    //this.avia.multyRoutes = [];
                    //this.avia.segmentsCount = 0; //??  = 2
                    this.avia.bookClass = 0;
                    this.avia.airCompanies = [];
                    this.avia.intervalCount = 0;
                    this.avia.onlyDirect = false;
                    this.avia.passengers.types.forEach(function (value, index) {
                        if (value.name === 'psgAdultsCnt') {
                            value.count = 1;
                        } else {
                            value.count = 0;
                        }
                    });
                    this.avia.passengers.hasError = false;
                    this.avia.passengers.messages = [];

                    var model = this;
                    Vue.nextTick(function () {
                        // DOM updated
                        //Update displayed value for selectpickers
                        local.it._form.find('.selectpicker').each(function () {
                            var option = $(this).find("input:radio:checked").closest('.option');
                            $(this).find(".selected-value:first").find("span:first").html(
                                option.find("span:first").html()
                            );
                        });
                        //Disable checkbox
                        local.it._form.find('input[type="checkbox"]:checked').trigger('click');
                    });
                },
                changeAviaFormExtended: function () {
                    this.avia.formExtended = !this.avia.formExtended;
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
                    this.avia.passengers.types.forEach(function (value) {
                        value.disabled = availablePassCount < 1;

                        if (infantsCat.indexOf(value.name) >= 0 && (adultCnt === 0 || adultCnt < infantCnt + 1)) {
                            value.disabled = true;
                        }
                    });
                    if (adultCnt === 0) {
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
                    if (data == null) return vue.$emit('clearItem', name);
                    var airportItem = new AirportItem(data.IataCode, data.CountryCode, data.CountryName, data.Name);
                    vue.$emit('airportUpdate', name, airportItem);
                },
                addCarrier: function (label, code) {
                    var carrier = new CarrierItem(label, code);
                    this.avia.airCompanies.push(carrier);
                },
                removeCarrier: function (index) {
                    this.avia.airCompanies.splice(index, 1);
                },
                addSegment: function () {
                    if (this.avia.multyRoutes.length < this.avia.maxRoutesCount) {
                        var length = this.avia.multyRoutes.length;
                        var obj = new EmptyRouteItem();
                        obj.defaultDateThere = this.avia.defaultDateThere;
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
                        Vue.nextTick(function () {
                            // DOM updated                        
                            //index+2 for selector
                            $(document).trigger('addSegment', index + 2);
                        });
                    }
                },
                updateSegmentsDates: function (index) {
                    var length = this.avia.multyRoutes.length;
                    var nextRoute = index + 1 < length ? this.avia.multyRoutes[index + 1] : null;
                    var currRoute = this.avia.multyRoutes[index];

                    if (index === 0) {
                        currRoute.minDate = this.avia.defaultDateThere;
                        if (currRoute.minDate > currRoute.defaultDateThere) {
                            currRoute.defaultDateThere = currRoute.minDate;
                        }
                    }
                    if (nextRoute != null) {
                        nextRoute.minDate = currRoute.defaultDateThere;
                        if (nextRoute.minDate > nextRoute.defaultDateThere) {
                            nextRoute.defaultDateThere = nextRoute.minDate;
                        }
                    }
                },
                removeSegment: function () {
                    this.avia.multyRoutes.pop();
                    this.avia.segmentsCount -= 1;
                },
                swapAviaDest: function () {
                    var to = this.avia.aviFrom;
                    var from = this.avia.aviTo;
                    this.avia.aviFrom = from;
                    this.avia.aviTo = to;

                    $(document).trigger("StartPtChange.MapBridge", [from]);
                    $(document).trigger("EndPtChange.MapBridge", [to]);
                },
                clickTimeFrom: function(e) {
                    this.avia.aviFromTime = parseInt(e.target.dataset.fromTime);
                },
                clickTimeTo: function(e) {
                    this.avia.aviToTime = parseInt(e.target.dataset.toTime);
                },
            },
            watch: {
                'avia.defaultDateThere': function (value) {
                    if (value > this.avia.defaultDateBack) {
                        this.avia.defaultDateBack = value;
                    }
                    if (value > this.dates.airMaxDate) {
                        this.avia.defaultDateThere = this.dates.airMaxDate;
                    }
                    if (value < this.dates.airMinDate) {
                        this.avia.defaultDateThere = this.dates.airMinDate;
                    }
                },
                'avia.defaultDateBack': function (value) {
                    if (value < this.avia.defaultDateThere) {
                        if (this.avia.formType.value === 'roundtrip') {
                            this.avia.defaultDateThere = value;
                        } else if (this.avia.formType.value === 'oneway') {
                            this.avia.defaultDateBack = this.avia.defaultDateThere;
                            return;
                        }
                    }
                    if (value > this.dates.airMaxDate) {
                        this.avia.defaultDateBack = this.dates.airMaxDate;
                    }
                    if (value < this.dates.airMinDate) {
                        this.avia.defaultDateBack = this.dates.airMinDate;
                    }
                },
               
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
                if (!this.avia.defaultDateThere) this.avia.defaultDateThere = this.aviaDefaultDateThere;
                if (!this.avia.defaultDateBack) this.avia.defaultDateBack = this.aviaDefaultDateBack;

                this.passUpdate();

                window.vue = this;

            },
            mounted: function () {
                var el = this.$el;
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
        let form = this.form;
        let it = this.it;
        let options = this.options;

        let dw = new dataWork(form, it);

        this.initializeDefaultAirportsIfNeed();

        //Отправка формы поиска авиабилетов
        form.submit(function () {
            var checker = new validator($(this), it);
            var isValid = checker.isValid();
            if (!isValid) return false;

            
            if (options.projectUrl.startsWith("/") && typeof main !== 'undefined' && main.airtickets != undefined && main.airtickets.searchForm != undefined && main.airtickets.searchForm.send != undefined) return main.airtickets.searchForm.send(form);
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
            //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
            if (it.extra.mobileAndTabletcheck()) {
                typeaheadOptions.minLength = 0;
            }
            //let airportsSource = dw.airportFinderData.ttAdapter();
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

                    vue.updateAirportTypeAhead(name, datum);
                    it.extra.closeField(item);

                    //Меняем фокус только когда форма инициализирована (что бы фокус не плясал при инициализации полей по-умолчанию)
                    if (it._initialized && !it.extra.mobileAndTabletcheck()) {
                        //Меняем фокус
                        if ($(this).is(".book-from")) {
                            //Фокус на аэропорт прибытия
                            $(this).closest(".fields-container").find(".book-to.tt-input").trigger("click");
                        } else if ($(this).is(".book-to")) {
                            //Фокус на дату вылета
                            var dp = $(this).closest(".multy-route, .fields-container").find('.date:first').find("input[name^='book_from_']");

                            setTimeout(function () {
                                dp.focus();
                            }, 100);
                        }
                    }
                    if ($(this).is(".book-from")) {
                        $(document).trigger("StartPtChange.MapBridge", [datum]);
                    } else {
                        $(document).trigger("EndPtChange.MapBridge", [datum]);
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

        //Список авиакомпаний
        form.find(".galileo-aircompany-select").typeahead({
            hint: true,
            highlight: true,
            minLength: 0,
            isSelectPicker: true
        },
            {
                name: 'carriers-' + it._o.defaultLang,
                source: dw.carriersData.ttAdapter(),
                valueKey: 'label',
                templates: {
                    suggestion: function (data) {
                        return data.label + " <small class='iata-code' data-iata='" + data.code + "'>" + data.code + "</small>";
                    }
                }
            }).on("typeahead:selected typeahead:autocompleted", function (e, datum) {
                //Выбор элемента - подставляем иата код
                if (datum != undefined) {
                    vue.addCarrier(datum.label, datum.code);
                    $(this).closest(".twitter-typeahead").next().val(datum.code);
                }
                $(this).trigger("change");
            }).on("typeahead:opened", function (e, datum) {
                //Открыли
                var item = $(this).closest('.field');
                if (it.extra.isInIframe()) {
                    var dropdown = item.find('.tt-dropdown-menu');
                    var offset = dropdown.parent().offset().top;
                    var height = parseFloat(dropdown.css('height'));
                    var currHeight = parseFloat($(this).css('height'));
                    var totalHeihgt = height + currHeight;

                    it.extra.recalculateHeightOnOpen(dropdown, offset, totalHeihgt);
                }
                $(this).trigger("typeahead:queryChanged");
            }).on("typeahead:queryCleared", function (e, datum) {
                //Очистили поле - кнопка Х.
                var item = $(this);
                item.closest(".twitter-typeahead").next().val('');
                item.trigger("typeahead:filterIt");
                setTimeout(function () {
                    //После очистки, находим первый пестой элемент и устанавливаем на него фокус.
                    //Ищем т.к. все значения съезжают к верхнему
                    item.closest(".carriers-finder").find("input[type='hidden']").filter(function () { return this.value == ""; }).first().prev().find(".tt-input").focus();
                }, 100);
            }).on("typeahead:selected typeahead:queryChanged", function (e, datum) {
                //Изменили строку запроса
                $(this).trigger("typeahead:filterIt");
            }).on("typeahead:filterIt", function () {
                //Фильтрация выпадающего меню. Не отображаем выбранные в других меню значения
                var dropDown = $(this).siblings(".tt-dropdown-menu");
                dropDown.find(".tt-suggestion.g-hide").removeClass("g-hide");

                setTimeout(function () {
                    var values = $.map(form.find(".carriers .carriers-finder input[type='hidden']"), function (val, i) {
                        return ".iata-code[data-iata='" + $(val).val() + "']";
                    });
                    dropDown.find(values.join(", ")).each(function () {
                        $(this).closest(".tt-suggestion").addClass("g-hide");
                    });
                }, 100);
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

        form.find(".select-age").focusin(function () {
            if ($(this).data('focusTimer')) clearTimeout($(this).data('focusTimer'));
            return false;
        }).on('blur focusout', function () {
            var selectAge = $(this);
            var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
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

        //Carriers menu
        form.find(".carriers").focusin(function () {
            var carriersItem = $(this).is(".carriers") ? $(this) : $(this).closest(".carriers");
            var carriersInput = carriersItem.find('input.tt-input');

            if (carriersItem.data('focusTimer')) clearTimeout(carriersItem.data('focusTimer'));

            if (carriersItem.find(".carriers-finder.g-hide").length > 0) {
                var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
                var field = $(this).closest('.field');
                var updateOpenedSelect = function (el) {
                    el.removeClass("g-hide").closest(".carriers").removeClass("z-100");
                    if (it.extra.isInIframe()) {
                        it.extra.recalculateHeightOnOpen(el);
                    }
                }

                var focusOnFirst = function () {
                    var finder = carriersItem.find(".carriers-finder");
                    if (finder.is(".g-hide")) return;
                    if (!finder.find("[name='selectedAirCompany1']").val()) {
                        carriersItem.find(".tt-input").first().focus();
                    }
                }

                if (isMobile) {
                    $(this).removeClass("g-hide").closest(".carriers").removeClass("z-100");
                    carriersItem.addClass("z-100").find(".carriers-finder.g-hide").show();
                    updateOpenedSelect(carriersItem.find(".carriers-finder"));
                    focusOnFirst();
                } else {
                    carriersItem.addClass("z-100").find(".carriers-finder.g-hide").slideDown(it._o.animationDelay, function () {
                        $(this).removeClass("g-hide").closest(".carriers").removeClass("z-100");
                        updateOpenedSelect($(this));
                        focusOnFirst();
                    });
                }
                it.extra.openField(field);
            }
        }).focusout(function () {
            var carriersItem = $(this).is(".carriers") ? $(this) : $(this).closest(".carriers");
            var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
            var field = $(this).closest('.field');

            var updateClosedSelect = function (el) {
                el.addClass("g-hide");
                if (it.extra.isInIframe()) {
                    it.extra.recalculateHeightOnClose();
                };
                it.extra.closeField(field);
            }

            if (isMobile) {
                carriersItem.data('focusTimer', setTimeout(function () {
                    carriersItem.find(".carriers-finder").fadeOut(300, function () {
                        updateClosedSelect($(this));
                    });
                }, 100));
            } else {
                carriersItem.data('focusTimer', setTimeout(function () {
                    carriersItem.find(".carriers-finder").slideUp(it._o.animationDelay, function () {
                        updateClosedSelect($(this));
                    });
                }, 100));
            }

            return false;
        }).find(".inside").click(function () {
            var carriersItem = $(this).closest(".carriers");
            if (!carriersItem.find(".carriers-finder").is(".g-hide")) {
                carriersItem.blur();
            }
        });
        form.find(".carriers .button-hide").click(function () {
            $(this).closest(".carriers").blur();
            return false;
        });

        //Кнопка Х на сообщении с ошибкой
        form.off("click", ".field.has-error .error-box .close");
        form.on("click", ".field.has-error .error-box .close", function () {
            $(this).closest(".error-box").slideUp(it._o.animationDelay, function () {
                $(this).html("").closest(".has-error").removeClass("has-error");
            });
            it.extra.updateIframeHeight();
            return false;
        });

        //TODO валидация времени вылета если выбраны одни и те же даты
        //var timeSelectpicker = document.querySelectorAll('.time .selectpicker');
        //Array.prototype.forEach.call(timeSelectpicker, function(select) {
        //    select.addEventListener('click', function(e) {
        //        if(rezOnForm.prototype._o.avia.defaultDateThere.setHours(0,0,0,0) === rezOnForm.prototype._o.avia.defaultDateBack.setHours(0,0,0,0)) {
        //            var aviaTimeFrom = rezOnForm.prototype._o.avia.aviFromTime;
        //            var aviaTimeTo = rezOnForm.prototype._o.avia.aviToTime;
        //            var bookToTime = document.querySelectorAll('[name="book_to_time"]');
        //            var selectedValue = document.querySelector('.book-time-to .selected-value')

        //            if(aviaTimeFrom >= aviaTimeTo) {
        //                rezOnForm.prototype._o.avia.aviToTime = aviaTimeFrom;
        //                selectedValue.firstElementChild.innerHTML = e.target.innerText;
        //            }

        //            Array.prototype.forEach.call(bookToTime, function(item) {
        //                if(item.value < aviaTimeFrom) {
        //                    item.closest('.option').classList.add('hidden');
        //                }

        //                if(item.value >= aviaTimeFrom) {
        //                    item.closest('.option').classList.remove('hidden');
        //                }
        //            });
        //        }
        //    });
        //});


        //Интеграция с картой
        $(document).on("StartPtChange.Map EndPtChange.Map", function (e, data) {

            var itemName = e.type == "StartPtChange"
                ? "from_iata"
                : "to_iata";

            if (!data) return vue.updateAirportTypeAhead(itemName);
            vue.updateAirportTypeAhead(itemName,
                {
                    IataCode: data.iata + "·",
                    CountryCode: data.countryCode,
                    CountryName: '',
                    Name: data.name
                });
        });

        //Disabled dates на календарях в зависимости от направления
        if (it._o.avia.onlySpecificAirportsInDropdown) {
            $(document).on("StartPtChange.MapBridge EndPtChange.MapBridge", function (e, datum) {
                $(document).trigger("DisabledDates.MapBridge");
            });
            $(document).on("DisabledDates.MapBridge", function (e) {
                Vue.nextTick(function () {
                    //Если жестко фиксированный список аэропортов - подгружаем список доступных дат

                    var iataFrom = $("[name='from_iata']").val();
                    var iataTo = $("[name='to_iata']").val();


                    it._o.avia.disabledDatesFrom = [];
                    it._o.avia.disabledDatesTo = [];
                    
                    if (iataFrom !== "" && iataTo !== "") {
                        $.ajax({
                            url: it.extra.remoteUrl() + "/HelperAsync/GetDisabledDates?IATAFrom={FROM}&IATATo={TO}"
                                .replace("{FROM}", iataFrom)
                                .replace("{TO}", iataTo),
                            cache: false,
                            success: function (json) {
                                it._o.avia.disabledDatesFrom = [];
                                for (var i = 0; i < json.there.length; i++) {
                                    var date = new Date(parseInt(json.there[i].substr(6)));
                                    it._o.avia.disabledDatesFrom.push(date);
                                }
                                it._o.avia.disabledDatesTo = [];
                                for (var i = 0; i < json.back.length; i++) {
                                    var date = new Date(parseInt(json.back[i].substr(6)));
                                    it._o.avia.disabledDatesTo.push(date);
                                }
                                //Check if selected date is disabled and change it
                                var defaultDateFrom = it._o.avia.defaultDateThere.getDate() + '.' + (it._o.avia.defaultDateThere.getMonth() + 1) + '.' + it._o.avia.defaultDateThere.getFullYear();
                                var defaultDateTo = it._o.avia.defaultDateBack.getDate() + '.' + (it._o.avia.defaultDateBack.getMonth() + 1) + '.' + it._o.avia.defaultDateBack.getFullYear();
                                var calendarFrom = document.querySelector('#avia-form-shoot .from .vdp-datepicker__calendar');
                                var calendarTo = document.querySelector('#avia-form-shoot .to .vdp-datepicker__calendar');
                                var calendarDays = document.querySelectorAll('#avia-form-shoot .date .day');
                                
                                Array.prototype.forEach.call(calendarDays, function(day) {
                                    day.addEventListener('click', function() {
                                        if(day.closest('.vdp-datepicker__calendar').lastElementChild.classList.contains('error-box')) {
                                            if(!day.classList.contains('disabled')) {
                                                day.closest('.vdp-datepicker__calendar').lastElementChild.remove();
                                            }
                                        }
                                    });
                                });

                                function BoxError(disabledDates, defaultDate, calendar) {
                                    Array.prototype.forEach.call(disabledDates, function(date) {
                                        var dates = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear(); 
                                        if(defaultDate === dates) {
                                            var boxError = document.createElement('div');
                                            boxError.classList.add('error-box');
                                            boxError.innerHTML = main.locale("DISABLED_DATE");
                                            calendar.appendChild(boxError);
                                        }
                                    });
                                }
                                
                                if(!!calendarFrom) {
                                    BoxError(it._o.avia.disabledDatesFrom, defaultDateFrom, calendarFrom);
                                }
                                
                                if(!!calendarTo) {
                                    BoxError(it._o.avia.disabledDatesTo, defaultDateTo, calendarTo);  
                                }
                            }
                        });
                    } else {
                        var datepickerCalendar = document.querySelectorAll('.date .vdp-datepicker__calendar');

                        Array.prototype.forEach.call(datepickerCalendar, function(calendar) {
                            if(calendar.lastElementChild.classList.contains('error-box')) {
                                calendar.lastElementChild.remove();
                            }
                        })
                    }
                });
            }).trigger("DisabledDates.MapBridge");
        }
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
            var dataToSend = iataToDecode.join();
            var params = { iata_codes: dataToSend };
            $.getJSON(this.it.extra.remoteUrl() + '/HelperAsync/GetAirport?' + $.param(params), function (data) {
                var result = JSON.parse(data);

                $.each(result, function (index, value) {

                    if (value !== undefined && value !== null) {
                        var aviItem = new AirportItem(value.IataCode, value.CountryCode, value.CountryName, value.Airport);
                        if (aviItem.IataCode.substring(0, 3) === local.options.avia.defaultAirportFrom) {
                            local.options.avia.aviFrom = aviItem;

                        }
                        if (aviItem.IataCode.substring(0, 3) === local.options.avia.defaultAirportTo) {
                            local.options.avia.aviTo = aviItem;
                        }
                    }
                });
            });
        }
    }
}