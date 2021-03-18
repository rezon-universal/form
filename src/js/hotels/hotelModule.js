const HotelCityItem = require('./HotelCityItem');
const validator = require('./validator');
const dataWork = require('./dataWork');

const HotelFormSaverData = require('./HotelFormSaverData');

const formModuleBase = require('./../formModuleBase');
module.exports = class hotelModule extends formModuleBase {

    //Получить настройки по-умолчанию
    getExtendedOptions()
    {
        return {
            dates: {
                hotelMinDate: null,
                hotelMaxDate: null
            },
            hotel: {
                recCity: [],
                historyGuid: "",
                adults: 2,
                checkIn: null,
                checkOut: null,
                city: new HotelCityItem(),
                formExtended: false,
                childs: [],
                quantityChilds: 0,
                rooms: 1,
                nationalitys: [],
                nationalityName: null,
                nationalityCode: null,
                get inputChilds() {
                    return this.childs.join();
                },
                isActive: false,
                Reservations: false
            }
        };
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        return this.it.extra.remoteUrl() + "/Hotels/ModuleSearch";
    }
    //Получить подсвеченные даты в датапикере
    datepickerGetHighlight() {
        return {
            from: this.options.hotel.checkIn,
            to: this.options.hotel.checkOut
        };
    }
    //Установка запрещенных дат в датапикере
    datepickerGetDisabled(datepicker) {
        return {
            to: datepicker.minDate !== undefined ? datepicker.minDate : vue.dates.hotelMinDate,
            from: datepicker.maxDate !== undefined ? datepicker.maxDate : vue.dates.hotelMaxDate
        };
    }
    //Датапикер - выбрано значение (event)
    datepickerSelected(datepicker) {
        var isMobile = this.it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
        if (datepicker.name === 'CheckIn' && datepicker.highlighted.to !== undefined && datepicker.highlighted.to !== null && !isMobile) {
            var el = $(datepicker.$el);
            var nextDatePick = el.closest('.fields-container').find('.date.to').find("input[name='CheckOut']");

            setTimeout(function () {
                nextDatePick.focus();
            }, 100);
        }
    }

    //Подключение Vue
    bindVue(bindTo, mountedCallback) {
        var local = this;

        Vue.component("hotelInput", {
            template: ' <div class="inside">' +
                '<input type="text" :class="inputClasses" v-model="item.Name" data-local="true" @keyup="checkItem" :placeholder="placeholder"/>' +
                '<div class="express">' +
                "{{item.Code}}" +
                "</div>" +
                '<span href="#" class="delete" :class="{\'no-visiblity\':item.Name==null}" v-on:click="clearItem()"></span>' +
                '<input type="hidden" :name="name" v-model="item.Id"/>' +
                "</div>",
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
                    default: "HOTEL_PLACEHOLDER"
                }
            },
            computed: {
                inputClasses: function () {
                    var input = $(this.$el).find("input:not(.tt-hint)." + this.inputClass)[0];
                    var classes = [this.inputClass];

                    if (input !== undefined && input !== null) {
                        classes = input.className.split(" ");
                    }

                    if (this.item.Name === null || this.item.Name === undefined || this.item.Name.trim() === "") {
                        if (classes.indexOf("isEmpty") <= 0) {
                            classes.push("isEmpty");
                        }
                    } else {
                        var index = classes.indexOf("isEmpty");
                        if (index >= 0) {
                            classes.splice(index, 1);
                        }
                    }
                    $.unique(classes);

                    return classes.join(" ");
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
                            $(el).find("." + selector).typeahead("val", newValue.Name);
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
                    this.$emit("input", this.item);
                },
                clearItem: function () {
                    this.item = new HotelCityItem();
                    this.$emit("input", this.item);
                    var comp = this;
                    Vue.nextTick(function () {
                        //Update typeahead
                        var el = comp.$el;
                        var selector = comp.inputClass;
                        $(el).find("." + selector).typeahead("val", "").focus();
                    });
                },
                checkItem: function (event) {
                    if (event.key !== "Enter" && event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Shift" && event.key !== "Tab") {
                        this.item.Code = "";
                        this.item.CountryName = '';
                        this.item.Id = '';
                        this.$emit("input", this.item);
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
        
        Vue.component('guest-input', {
            props: {
                name: String,
                label: String,
                items: Number,
                num: [Number, Array, String],
                published: Boolean,
            },
            template:
                '<div class="hotel_guest" v-bind:class="{ open: isActive }">' +
                    '<div class="arrow-mobile"></div>' +
                    '<div class="close-mobile"></div>' +
                    '<label class="menu-title" v-show="published">{{ label }}</label>' +
                    '<div class="select_guest" v-click-outside="onClickOutside">' +
                        '<div class="value_guest" v-on:click="toggleClass">' +
                            '<div class="arrow" v-bind:class="{ rotateClass:isActive }"></div>' +
                            '<span class="number_val" v-if="name !== \'ChildAges\'">{{ num }}</span>' +
                            '<span class="number_val" v-if="name === \'ChildAges\'">{{ quantity }}</span>' +
                            '<input class="input_val" type="hidden" :name="name" v-model="num">' +
                        '</div>' +
                        '<ul class="options_guest" v-show="isActive" v-on:click="changeNum">' +
                            '<li class="option_guest" v-if="name === \'quantityChild\'" v-bind:data-num="0">0</li>' +
                            '<li class="option_guest" v-for="item in items" v-bind:data-num="item">{{ item }}</li>' +
                        '</ul>' +
                    '</div>' +
                '</div>',
            data: function () {
                return {
                    isActive: false,
                    rotateClass: 'rotateClass',
                    quantity: null
                }
            },
            methods: {
                toggleClass: function () {
                    this.isActive = !this.isActive;

                    var childBox = document.querySelectorAll('.childs_flex .child_box');
                    
                    childBox.forEach(function(item) {
                        item.addEventListener('click', function() {
                            if(item.classList.contains('has-error')) {
                                item.classList.remove('has-error');
                                item.closest('.childs_flex').firstElementChild.classList.remove('has-error');
                            }
                        })
                    });
                },
                onClickOutside: function () {
                    this.isActive = false;
                },
                changeNum: function (e) {
                    this.isActive = false;
                    var number = e.target.dataset.num;
                    if(!isNaN(number)) {
                        this.quantity = parseInt(number);
                        this.$emit('quantity-change', this.quantity);
                    }
                }
            },
            created: function () {
                this.quantity = this.num;
            }
        });

        Vue.component('national-input', {
            props: {
                items: [String, Array],
                name: String,
                code: String,
                placeholder: String,
                label: String,
            },
            template:
                '<div class="nationality_hotels" v-bind:class="{ open: isActive }">' +
                    '<div class="arrow-mobile"></div>' +
                    '<div class="close-mobile"></div>' +
                    '<div class="select_nationality" v-click-outside="onClickOutside">' +
                        '<div class="nationality_input" v-on:click="toggleClass">' +
                            '<div class="arrow" v-bind:class="{ rotateClass:isActive }"></div>' +
                            '<span>' +
                                '<span class="text-nowrap" v-if="name === null">{{ placeholder }}</span>' +
                                '{{ name }}' +
                            '</span>' +
                            '<input type="hidden" name="Nationality"  v-model="code">' +
                            '<input type="hidden" name="NationalityName"  v-model="name">' +
                        '</div>' +
                        '<div class="nationality_search">' +
                            '<div class="search_input">' +
                                '<input class="nationality_search-input" type="text" v-model="search" :placeholder="label">' +
                                '<span class="delete_search" v-show="isSearch" v-on:click="deleteSearch"></span>' +
                            '</div>' +
                            '<ul class="options">' +
                                '<li class="option" v-for="(item, index) in filteredCountry" v-bind:key="item.id" v-on:click="countryOption(item)">{{ item.label }}</li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>',
            data: function () {
                return {
                    isActive: false,
                    isSearch: false,
                    rotateClass: 'rotateClass',
                    country: null,
                    countryCode: null,
                    search: ''
                }
            },
            methods: {
                toggleClass: function () {
                    this.isActive = !this.isActive;
                },
                onClickOutside: function () {
                    this.isActive = false;
                },
                countryOption: function (o) {
                    this.isActive = false;
                    this.country = o.label;
                    this.countryCode = o.code;
                    this.$emit('country-change', this.country);
                    this.$emit('code-change', this.countryCode);
                },
                deleteSearch: function () {
                    this.search = '';
                }
            },
            computed: {
                filteredCountry: function () {
                    var _this = this;
                    return this.items.filter(function (item) {
                        return item.label.toLowerCase().includes(_this.search.toLowerCase());
                    })
                }
            },
            mounted() {
                document.getElementById('hotel-form-shoot').addEventListener('keydown', (event) => {
                    if(event.keyCode === 9) {
                        if(event.target.name === 'CheckOut') {
                            this.isActive = true;
                            document.querySelector('.search_input .nationality_search-input').focus();
                        } else {
                            this.isActive = false;
                        }
                    }
                })
                    
            },
            watch: {
                search: function (newSearch) {
                    if(newSearch !== '') {
                        this.isSearch = true;
                    } else {
                        this.isSearch = false;
                    }
                }
            }
        });
        

        this.vue = new Vue({
            el: bindTo[0],
            mixins: [this.getVueBase(mountedCallback)],
            computed: {
                today: function () {
                    var todayDate = new Date();
                    todayDate.setHours(0, 0, 0, 0);
                    return todayDate;
                },
             
                hotelMinDate: function () {
                    return new Date(this.today.getTime());
                },
                hotelMaxDate: function () {
                    var maxDate = new Date(this.today.getTime());
                    maxDate.setDate(maxDate.getDate() + 365);
                    return maxDate;
                },
                hotelDefaultCheckIn: function () {
                    var defaultCheckIn = new Date();
                    defaultCheckIn.setDate(defaultCheckIn.getDate() + 14);
                    return defaultCheckIn;
                },
                hotelDefaultCheckOut: function () {
                    var defaultCheckOut = new Date();
                    defaultCheckOut.setDate(defaultCheckOut.getDate() + 21);
                    return defaultCheckOut;
                },
            },
            methods: {
                declensionWords(count, enableIntWord, one_number, zero_number, four_number) {
                    if (count == 0 || (count >= 5 && count <= 20)) {
                        //вариантов
                        return (enableIntWord ? count + " " : "") + zero_number;
                    } else {
                        switch (count % 10) {
                            case 1:
                                //вариант
                                return (enableIntWord ? count + " " : "") + one_number;
                            case 2:
                            case 3:
                            case 4:
                                //варианта
                                return (enableIntWord ? count + " " : "") + four_number;
                            default:
                                return (enableIntWord ? count + " " : "") + zero_number;
                        }
                    }
                },

                removeError: function(el, elemError) {
                    let item = this.$el.querySelector(el);
                    if(item.classList.contains('has-error')) {
                        item.classList.remove('has-error');
                        let boxError = item.querySelector(elemError);
                        boxError.style.display = 'none';
                        while(boxError.firstChild) {
                            boxError.removeChild(boxError.firstChild);
                        }
                    }
                },
                changeHotelFormExtended: function () {
                    this.hotel.formExtended = !this.hotel.formExtended;
                },
                updateHotelCityTypeAhead: function (name, data) {
                    var cityItem = new HotelCityItem(data.Id, data.Name, data.CountryName);
                    vue.$emit("hotelCityUpdate", name, cityItem);
                },
                clearHotelForm: function () {
                    this.hotel.checkIn = this.hotelDefaultCheckIn;
                    this.hotel.checkOut = this.hotelDefaultCheckOut;
                    this.hotel.cityFrom = new HotelCityItem();
                    this.hotel.cityTo = new HotelCityItem();
                    this.hotel.nationalityName = this.hotel.defaultNationalityName;
                    this.hotel.nationalityCode = this.hotel.defaultNationalityCode;
                    this.hotel.timeThere = 0;
                    this.hotel.timeBack = 0;
                    this.hotel.dateRange = 0;
                    this.hotel.adults = 1;
                    var model = this;
                    Vue.nextTick(function () {
                        // DOM updated
                        model.updateHtmlElements();
                    });
                },
                hotelTypeChanged: function (index) {
                    this.hotel.formType = this.hotel.formTypes[index];
                },
                hasHotelResult: function () {
                    return this.hotel.historyGuid !== undefined &&
                        this.hotel.historyGuid !== null &&
                        this.hotel.historyGuid.trim() !== "";
                },
                onClickOutside: function () {
                    local.options.hotel.isActive = false;
                },
                toggleClass: function () {
                    local.options.hotel.isActive = !local.options.hotel.isActive;
                },
                hotelResetSearch: function () {
                    $("#IsNewSearch").val("true");
                },
                
                updateCityTypeAhead: function (name, data) {
                    var cityItem = new HotelCityItem(data.Id, data.Name, data.CountryName);
                    vue.$emit("cityUpdate", name, cityItem);
                },
                async submitHandler(e) {
                    let checker = new validator(local.form, local.it);
                    let isValid = checker.isValid();
                    if (!isValid) {
                        e.preventDefault();
                        return;
                    } else {

                        let data = local.getCurrentFormData();
                        local.formSaver.saveNewItem(data);

                        let options = {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric'
                        };
    
                        let checkIn = new Intl.DateTimeFormat('ru-Ru', options).format(this.hotel.checkIn);
                        let checkOut = new Intl.DateTimeFormat('ru-Ru', options).format(this.hotel.checkOut);
    
    
                        const formData = {
                            CityId: this.hotel.city.Id,
                            CheckIn: checkIn,
                            CheckOut: checkOut,
                            AdultCount: this.hotel.adults,
                            RoomCount: this.hotel.rooms,
                            ChildAges: this.hotel.childs,
                            Nationality: this.hotel.nationalityCode,
                        }
    
                        if (local.options.projectUrl.startsWith("/") && typeof window.main != undefined && window.main.hotel != undefined) {
                            e.preventDefault();
                            return window.main.hotel.searchResult.sendForm(formData);
                        }
                    }
                },
                selectHistoryItem : function(history) {
                    local.formSaver.selectItem(history);
                }
            },
            watch: {
                'hotel.checkIn': function (value) {
                    var tempDate = new Date(this.dates.hotelMaxDate);
                    tempDate.setDate(this.dates.hotelMaxDate.getDate() - 1);

                    if (value > tempDate)
                        this.hotel.checkIn = tempDate;

                    if (value < this.dates.hotelMinDate)
                        this.hotel.checkIn = this.dates.hotelMinDate;

                    if (this.hotel.checkIn >= this.hotel.checkOut) {
                        tempDate = new Date(this.hotel.checkIn);
                        tempDate.setDate(this.hotel.checkIn.getDate() + 1);
                        this.hotel.checkOut = tempDate;
                    }
                },
                'hotel.checkOut': function (value) {
                    var tempDate = new Date(this.dates.hotelMinDate);
                    tempDate.setDate(this.dates.hotelMinDate.getDate() + 1);

                    if (value > this.dates.hotelMaxDate)
                        this.hotel.checkOut = this.dates.hotelMaxDate;

                    if (value < tempDate)
                        this.hotel.checkOut = tempDate;

                    if (this.hotel.checkOut <= this.hotel.checkIn) {
                        tempDate = new Date(this.hotel.checkOut);
                        tempDate.setDate(this.hotel.checkOut.getDate() - 1);
                        this.hotel.checkIn = tempDate;
                    }
                   
                    let checkInDate = new Date(this.hotel.checkIn);
                    if(checkInDate.setDate(this.hotel.checkIn.getDate() + 30) < this.hotel.checkOut) {
                        this.hotel.Reservations = true;
                        let errorBox = $("input[name='CheckOut']").first();
                        errorBox.closest(".date.to").addClass("has-error").find(".error-box").text(this.locale("RESERVATIONS_LONGER")).append($("<div/>").addClass("close")).slideDown();
                    } else {
                        this.hotel.Reservations = false;
                        this.removeError(".date.to", ".error-box");
                    }

                },
                'hotel.nationalityName': function(value) {
                    if(value !== null || value !== '') {
                        this.removeError(".nationality", ".error-box");
                    }
                }
            },
            created: function () {
                //Global variable
                this.dates.hotelMinDate = this.hotelMinDate;
                this.dates.hotelMaxDate = this.hotelMaxDate;
              
                if (!this.hotel.checkIn) this.hotel.checkIn = this.hotelDefaultCheckIn;
                if (!this.hotel.checkOut) this.hotel.checkOut = this.hotelDefaultCheckOut;
                else if (this.hotel.checkOut < this.hotel.checkIn)
                    this.hotel.checkOut = this.hotel.checkIn;

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

        var typeaheadOptions = {
            minLength: 2
        };

        dw.countriesData.initPromise.done(function() {
            it._o.hotel.nationalitys = dw.countriesData.index.datums;
            if(!!it._o.hotel.nationalityCode && it._o.hotel.nationalityCode.length === 2) {
                //Выбираем национальность из списка
                for(var i = 0; i < it._o.hotel.nationalitys.length; i++) {
                    if(it._o.hotel.nationalitys[i].code === it._o.hotel.nationalityCode) {
                        it._o.hotel.nationalityName = it._o.hotel.nationalitys[i].label;
                        break;
                    }
                }
            }
        });

        if (it.extra.isInIframe()) {

            var guest = document.querySelector('.guest_result');
            guest.addEventListener('click', function() {
                var field = document.querySelector('.hotel_guests .control-field');
                var fieldHeight = field.scrollHeight;
                var fieldTopOffset = field.offsetTop;
                var bodyHeight = fieldHeight + fieldTopOffset;

                $('body').css({ 'min-height': bodyHeight + 'px' });
                it.extra.updateIframeHeight();

                var selectGuest = document.querySelectorAll('.select_guest');
                selectGuest.forEach(function(item) {
                    item.addEventListener('click', function() {
                        var itemHeight = item.scrollHeight;
                        var bodyHeight = fieldHeight + fieldTopOffset + itemHeight;

                        $('body').css({ 'min-height': bodyHeight + 'px' });
                        it.extra.updateIframeHeight();
                    });
                });
                
                var selectNationality = document.querySelector('.select_nationality');
                selectNationality.addEventListener('click', function() {
                    var nationalityHeight = selectNationality.scrollHeight;
                    var bodyHeight = fieldHeight + fieldTopOffset + nationalityHeight;

                    $('body').css({ 'min-height': bodyHeight + 'px' });
                    it.extra.updateIframeHeight();
                });
                
            });

            window.addEventListener('mouseup',function(event) {
                var select = document.querySelector('.select_box');

                if(event.target != select && event.target.parentNode != select) {
                    $('body').css({ 'min-height': 'inherit' });
                }
            }); 
        }

        //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
        if (it.extra.mobileAndTabletcheck()) {
            typeaheadOptions.minLength = 0;
        }

        // Поиск городa в основной форме
        form.find('.book-from, .book-to').typeahead(typeaheadOptions, {
            name: "hotel-city-" + it._o.defaultLang,
            displayKey: "value",
            source: dw.hotelCityFinderData.ttAdapter(),
            display: function (data) {
                return data != undefined ? data.Name : null;
            },
            templates: {
                empty: [
                    '<div class="templ-message">',
                    it.extra.locale("NOTHING_FOUND") + "...",
                    "</div>"
                ].join("\n"),
                suggestion: function (data) {
                    var ret = [];
                    if (!!data.CountryName) {
                        ret.push(
                            {
                                key: $("<span class='country-separator'><small>" + data.CountryName + "</small><span>"),
                                value: undefined
                            });
                    }
                    for (var iHotel = 0; iHotel < data.length; iHotel++) {
                        ret.push({
                            key: data[iHotel].Name + " <small class='express-code'>" + data[iHotel].CountryName + "</small>",
                            value: {
                                Id: data[iHotel].Id,
                                Name: data[iHotel].Name,
                                CountryName: data[iHotel].CountryName
                            }
                        });
                    }
                    return ret;
                }
            }
        }).keyup(function () {

        }).focus(function () {
            var item = $(this).closest(".field");

            it.extra.openField(item);
            item.addClass("focused").removeClass("has-error").find(".error-box").slideUp(it._o.animationDelay);
            item.closest(".fields-container").find(".field.has-error").removeClass("has-error").find(".error-box").slideUp(it._o.animationDelay);
            if ($(this).is(".book-from") && $(this).val() === "") {
                var city = form.find("[name='CityId']").val();
                $.trim(city) !== "" && $(this).typeahead("query", "city_" + city);
            }
        }).blur(function () {
            $(this).closest('.field.focused').removeClass('focused');
        }).click(function () {
            $(this).select();
        }).on("typeahead:selected typeahead:autocompleted", function (e, datum) {
            if (datum != undefined) {
                var field = $(this).closest(".field.station");
                var name = field.find(".inside input[type='hidden']").attr("name");

                it.extra.closeField(field);
                vue.updateCityTypeAhead(name, datum);
                if (!it.extra.mobileAndTabletcheck()) {
                    var dp = $(this).closest(".fields-container").find('.date.from').find("input[name='CheckIn']")
                    setTimeout(function () {
                        dp.focus();
                    }, 100);
                }
                //Hide mobile keyboard
                $(this).blur();
            }
        }).on("typeahead:dropdown", function () {
            var item = $(this).closest(".field");
            it.extra.openField(item);

            if (it.extra.isInIframe()) {
                var dropdown = item.find(".tt-dropdown-menu");
                var offset = dropdown.parent().offset().top;
                var height = parseFloat(dropdown.css("max-height"));
                var currHeight = parseFloat($(this).css("height"));
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
        return new HotelFormSaverData(this);
    }
    getCurrentFormDataName() {
        return 'HotelFormSaverData';
    }
}