const validator = require('./validator');
const dataWork = require('./dataWork');
const ApiService = require('../../insurances/servises/api.service.js').default;

function InsuranceLocation(location) {
    if (!location) return;   
    
    this.Name = location.Name;
    this.CountryCode = location.CountryCode;
}


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
                Location: new InsuranceLocation()
            }
        };  
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        return this.it.extra.remoteUrl() + "/Insurances/History";
    }
    //Установка запрещенных дат в датапикере
    datepickerGetDisabled(datepicker) {
        return {
            to: datepicker.minDate !== undefined ? datepicker.minDate : vue.dates.insurancesMinDate,
            from: datepicker.maxDate !== undefined ? datepicker.maxDate : vue.dates.insurancesMaxDate
        };
    }

    //Подключение Vue
    bindVue(bindTo, mountedCallback) {
        var local = this;
        
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
                        this.item.Name = '';
                        this.arrRegion = null;
                        this.$emit('input', this.item);
                    }
                }
            },
            created: function () {
                var comp = this;
                vue.$on("cityUpdate", function (name, city) {
                    if (comp.name === name) {
                        comp.updateInsuranceItem(city);
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
             
                insurancesMinDate: function () {
                    var insurancesMinDate = new Date(this.today.getTime());
                    return insurancesMinDate;
                },
                insurancesMaxDate: function () {
                    var insurancesMaxDate = new Date(this.today.getTime());
                    insurancesMaxDate.setDate(insurancesMaxDate.getDate() + 200);
                    return insurancesMaxDate;
                },
                insurancesDefaultDate: function () {
                    var defaultDate = new Date();
                    defaultDate.setDate(defaultDate.getDate() + 7);
                    return defaultDate;
                },
                insurancesDefaultBackDate: function () {
                    var defaultBackDate = new Date();
                    defaultBackDate.setDate(defaultBackDate.getDate() + 14);
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
                locale: this.it.extra.locale,

                updateLocationTypeAhead: function (name, data) {
                    var cityItem = new InsuranceLocation(data);
                    vue.$emit("cityUpdate", name, cityItem);
                },
                async submitHandler() {
                    let checker = new validator(local.form, local.it);
                    let isValid = checker.isValid();
                    if (!isValid) return false;

                    let options = {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                    };

                    let dateFrom = new Intl.DateTimeFormat('ru-Ru', options).format(this.insurances.DateFrom);
                    let dateTo = new Intl.DateTimeFormat('ru-Ru', options).format(this.insurances.DateTo);

                    main.extra.startWait();

                    const formData = {
                        CountryCode: this.insurances.Location.CountryCode,
                        DateFrom: dateFrom,
                        DateTo: dateTo
                    };

                    const searchPage = document.getElementById('insurances-search');
                    const apiService = new ApiService(encodeURI(searchPage.getAttribute('Url')));
                    const fbData = await apiService.createData(formData);

                    await window.main.insurancesSearch.newSearch(fbData);
                }
            },
            watch: {
                'insurances.DateFrom': function (value) {
                    if (value > this.insurances.DateTo) {
                        this.insurances.DateTo = value;
                    }
                    if (value > this.dates.insurancesMaxDate) {
                        this.insurances.DateFrom = this.dates.insurancesMaxDate;
                    }
                    if (value < this.dates.insurancesMinDate) {
                        this.insurances.DateFrom = this.dates.insurancesMinDate;
                    }
                },
                'insurances.DateTo': function (value) {
                    if (value < this.insurances.DateFrom) {                        
                        this.insurances.DateFrom = value;
                    }
                    if (value > this.dates.insurancesMaxDate) {
                        this.insurances.DateTo = this.dates.insurancesMaxDate;
                    }
                    if (value < this.dates.insurancesMinDate) {
                        this.insurances.DateTo = this.dates.insurancesMinDate;
                    }
                }
            },
            created: function () {
                //Global variable
                this.dates.insurancesMinDate = this.insurancesMinDate;
                this.dates.insurancesMaxDate = this.insurancesMaxDate;
              
                if (!this.insurances.DateFrom) {
                    this.insurances.DateFrom = this.insurancesDefaultDate;
                }
                if (!this.insurances.DateTo) {
                    this.insurances.DateTo = this.insurancesDefaultBackDate;
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

        var typeaheadOptions = {
            minLength: 2
        };

        //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
        if (it.extra.mobileAndTabletcheck()) {
            typeaheadOptions.minLength = 0;
        }

        // Поиск городов в основной форме
        form.find('.book-from').typeahead(typeaheadOptions, {
            name: "insurance-location-" + it._o.defaultLang,
            displayKey: 'value',
            source: dw.insuranceLocationFinderData.ttAdapter(),
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
                vue.updateLocationTypeAhead(name, datum);
                
                if (!it.extra.mobileAndTabletcheck()) {
                    if (name === "CountryCode") {
                        var sib = field.closest("form").find("input[name='CountryCode']");
                        if (sib.val() === "") sib.siblings(".twitter-typeahead").find(".tt-input").click();
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
}