function DirectionType(value, text) {
    this.value = value;
    this.text = text;
};
function AirportItem(iataCode, countryCode, countryName, airport) {
    this.Airport = airport;
    this.CountryCode = countryCode;
    this.CountryName = countryName;
    this.IataCode = iataCode;
};
function CarrierItem(label, code) {
    this.label = label;
    this.code = code;
}
function PassItem(name, text, desc, count, disabled, hidden) {
    this.name = name;
    this.text = text;
    this.desc = desc;
    this.count = count !== undefined ? count : 0;
    this.disabled = disabled !== undefined ? disabled : false;
    this.hidden = hidden !== undefined ? hidden : false;
}
function EmptyRouteItem() {
    this.aviFrom = new AirportItem();
    this.aviTo = new AirportItem();
    this.defaultDateThere = undefined;
    this.aviFromTime = 0;
}
function StationItem(code, name, countryCode, countryName) {
    this.Code = code;
    this.Name = name;
    this.CountryCode = countryCode;
    this.CountryName = countryName;
}
function CityItem(id, name, countryCode, countryName) {
    this.Id = id;
    this.Name = name;
    this.CountryCode = countryCode;
    this.CountryName = countryName;
}
function HotelCityItem(id, name, countryCode) {
    this.Id = id;
    this.Name = name;
    this.CountryCode = countryCode;
}
var types = [new DirectionType('oneway', 'ONE_WAY'), new DirectionType('roundtrip', 'ROUND_TRIP'), new DirectionType('route', 'MULTY_ROUTE')];
var passTypes = [
    new PassItem('psgInfantsNSCnt', 'PASS_CAT_INF', 'PASS_CAT_INF_NS_DESC'),
    new PassItem('psgInfantsCnt', 'PASS_CAT_INF', 'PASS_CAT_INF_WS_DESC'),
    new PassItem('psgKidsCnt', 'PASS_CAT_CNN', 'PASS_CAT_CNN_DESC'),
    new PassItem('psgYouthCnt', 'PASS_CAT_YTH', 'PASS_CAT_YTH_DESC'),
    new PassItem('psgAdultsCnt', 'PASS_CAT_ADT', 'PASS_CAT_ADT_DESC', 1),
    new PassItem('psgOldCnt', 'PASS_CAT_SNN', 'PASS_CAT_SNN_DESC')
];

var rezOnForm = function (form, o) {
    rezOnForm.prototype._form = undefined;
    rezOnForm.prototype._aviaForm = undefined;
    rezOnForm.prototype._railwayForm = undefined;
    rezOnForm.prototype._busesForm = undefined;
    rezOnForm.prototype._hotelForm = undefined;

    rezOnForm.prototype._locale = {};
    rezOnForm.prototype._o = {
        animationDelay: 300,
        dates: {
            plusDaysShift: -1,
            maxSearchDayDepth: 0,
            today: null,
            airMinDate: null,
            airMaxDate: null,
            trainsMinDate: null,
            trainsMaxDate: null,
            busesMinDate: null,
            busesMaxDate: null,
            hotelMinDate: null,
            hotelMaxDate: null
        },

        projectUrl: "/",
        defaultLang: "ru",
        formType: "all", //avia|railway|buses|all
        formTarget: "_blank",
        defaultFormTab: undefined,
        avia: {
            //recAirportsFrom: [ "TLV" ],
            //recAirportsTo: [],
            defaultRouteType: null, // [oneway/roundtrip/multy]
            defaultAirportFrom: null, // IATA code, ex. IEV 
            defaultAirportTo: null, // IATA code, ex. IEV
            onlySpecificAirportsInDropdown: false, //bool indicator, that says to use only specific airports list in dropdown (search of airports will be deactivated)
            enabledCabinClasses: '1,2', // string cabinClasses, ex. "1,2" (Economy,Business)
            enabledPassengerTypes: '0,1,2,3,4,5',// string enabledPassengerTypes, ex. "1,2,3,4" (InfantNoSeat,Infant,Child,Young)
            defaultDateThere: undefined, // dd.MM.yyyy
            defaultDateBack: undefined, // dd.MM.yyyy
            plusDaysShift: 1, // -1 - 10
            maxDaysSearch: 360, // 1 - 360
            //temp
            formTypes: types,
            formType: types[1],
            aviFrom: new AirportItem(),
            aviFromTime: 0,
            aviTo: new AirportItem(),
            aviToTime: 0,
            passengers: {
                types: passTypes,
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
            historyGuid: ''
            //end temp
        },
        railway: {
            recStationsFrom: [],
            recStationsTo: [],
            historyGuid: '',
            dateThere: undefined,
            dateBack: undefined,
            stationFrom: new StationItem(),
            stationTo: new StationItem(),
            timeThere: 0,
            timeBack: 0,
            dateRange: 0,
            formTypes: [types[0], types[1]],
            formType: types[0],
            formExtended: false,
            maxSearchDayDepth: 0
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
            formTypes: [types[0], types[1]],
            formType: types[0],
            formExtended: false
        },
        hotel: {
            recCity: [],
            historyGuid: "",
            adults: 1,
            checkIn: null,
            checkOut: null,
            city: new HotelCityItem(),
            formExtended: false,
            childs: [],
            nationality: ""
        }

    }
    rezOnForm.prototype._initialized = false;

    //-----------------------------------------
    // Конструктор
    //-----------------------------------------
    rezOnForm.prototype.constructor = function () {
        this._locale = {
            ru: {
                "ONE_WAY": "В одну сторону",
                "ROUND_TRIP": "Туда и обратно",
                "MULTY_ROUTE": "Сложный маршрут",
                "JANUARY": "Январь",
                "FEBRUARY": "Февраль",
                "MARCH": "Март",
                "APRIL": "Апрель",
                "MAY": "Май",
                "JUNE": "Июнь",
                "JULY": "Июль",
                "AUGUST": "Август",
                "SEPTEMPER": "Сентябрь",
                "OCTOBER": "Октябрь",
                "NOVEMBER": "Ноябрь",
                "DECEMBER": "Декабрь",
                "JANUARY_SHORT": "Янв",
                "FEBRUARY_SHORT": "Фев",
                "MARCH_SHORT": "Мар",
                "APRIL_SHORT": "Апр",
                "MAY_SHORT": "Май",
                "JUNE_SHORT": "Июн",
                "JULY_SHORT": "Июл",
                "AUGUST_SHORT": "Авг",
                "SEPTEMPER_SHORT": "Сен",
                "OCTOBER_SHORT": "Окт",
                "NOVEMBER_SHORT": "Ноя",
                "DECEMBER_SHORT": "Дек",
                "SUNDAY": "воскресенье",
                "MONDAY": "понедельник",
                "TUESDAY": "вторник",
                "WEDNESDAY": "среда",
                "THURSDAY": "четверг",
                "FRIDAY": "пятница",
                "SATURDAY": "суббота",
                "SUNDAY_SHORT": "вск",
                "MONDAY_SHORT": "пнд",
                "TUESDAY_SHORT": "втр",
                "WEDNESDAY_SHORT": "срд",
                "THURSDAY_SHORT": "чтв",
                "FRIDAY_SHORT": "птн",
                "SATURDAY_SHORT": "сбт",
                "SUNDAY_MIN": "Вс",
                "MONDAY_MIN": "Пн",
                "TUESDAY_MIN": "Вт",
                "WEDNESDAY_MIN": "Ср",
                "THURSDAY_MIN": "Чт",
                "FRIDAY_MIN": "Пт",
                "SATURDAY_MIN": "Сб",
                "CLOSE_TEXT": "Закрыть",
                "TODAY_TEXT": "Сегодня",
                "WEEK_HEADER": "Нед",
                "FIRST_DAY": "1",
                "AIRTICKETS": "Авиабилеты",
                "RAILWAYTICKETS": "ЖД билеты",
                "PLACEHOLDER_AIRPORT2": "Введите аэропорт, город или код ИАТА",
                "SELECT_AIRPORT": "Выбрать аэропорт",
                "COUNTRY": "Страна",
                "SELECT_COUNTRY": "Выберите страну...",
                "AIRPORT": "Аэропорт",
                "SELECT_AIRPORT2": "Выберите аэропорт...",
                "REMOVE_LEG": "Удалить перелет",
                "BY_EXACT_DATE": "по точной дате",
                "FIND": "Найти",
                "RAILWAY_PLACEHOLDER": "Введите название города или станции",
                "BUSES_PLACEHOLDER": "Введите название города",
                "SELECT_AIRPORT_FROM_LIST": "Выберите аэропорт из списка...",
                "NEED_TO_SELECT_DIFFERENT_AIRPORTS": "Необходимо указать разные аэропорты для пунктов вылета и прилета...",
                "SELECT_STATION_FROM_LIST": "Выберите станцию из списка...",
                "SELECT_CITY_FROM_LIST": "Выберите город из списка...",
                "NEED_TO_SELECT_DIFFERENT_STATIONS": "Необходимо указать разные станции для пунктов отправления и прибытия...",
                "NEED_TO_SELECT_DIFFERENT_CITIES": "Необходимо указать разные города для пунктов отправления и прибытия...",
                "NOTHING_FOUND": "Ничего не найдено",
                "PASS_CAT_INF": "Младенец",
                "PASS_CAT_INF_NS_DESC": "без места до 2 лет",
                "PASS_CAT_INF_NS_1": "младенец б.м.",
                "PASS_CAT_INF_NS_0": "младенецов б.м.",
                "PASS_CAT_INF_NS_4": "младенца б.м.",
                "PASS_CAT_INF_WS_DESC": "с местом до 2 лет",
                "PASS_CAT_INF_WS_1": "младенец",
                "PASS_CAT_INF_WS_0": "младенецов",
                "PASS_CAT_INF_WS_4": "младенца",
                "PASS_CAT_CNN": "Дети",
                "PASS_CAT_CNN_DESC": "2 – 11",
                "PASS_CAT_CNN_1": "ребенок",
                "PASS_CAT_CNN_0": "детей",
                "PASS_CAT_CNN_4": "ребенка",
                "PASS_CAT_YTH": "Молодежь",
                "PASS_CAT_YTH_DESC": "12 – 25",
                "PASS_CAT_YTH_1": "молодежный",
                "PASS_CAT_YTH_0": "молодежи",
                "PASS_CAT_ADT": "Взрослые",
                "PASS_CAT_ADT_DESC": "26 – 60",
                "PASS_CAT_ADT_1": "взрослый",
                "PASS_CAT_ADT_0": "взрослых",
                "PASS_CAT_SNN": "Пожилые",
                "PASS_CAT_SNN_DESC": "старше 60",
                "PASS_CAT_SNN_1": "пожилой",
                "PASS_CAT_SNN_0": "пожилых",
                "SPECIFY_PASSENGERS": "Укажите пассажиров...",
                "FORM_CLASS_ANY": "Любой",
                "FORM_CLASS_E": "Эконом",
                "FORM_CLASS_B": "Бизнес",
                "FORM_CLASS_F": "Первый",
                "FORM_CLASS_P": "Премиум",
                "C_PASSENGER": "пассажир",
                "C_PASSENGERS": "пассажиров",
                "C_PASSEGNERS2": "пассажира",
                "DAY": "день",
                "DAYS": "дня",
                "CLASS": "Класс",
                "AIRCOMPANY": "Авиакомпания",
                "ANY_AVIACOMPANY": "Любая авиакомпания",
                "SELECT_AVIACOMPANY": "Выберите авиакомпанию",
                "ONLY_DIRECT_FLIGHTS": "только прямые рейсы",
                "VALIDATE_FORM_SEARCH_MESSAGE_2": "Кто-то все же должен лететь.",
                "VALIDATE_FORM_SEARCH_MESSAGE_3": "Младенцев не должно быть больше, чем молодежи, взрослых и пожилых в сумме.",
                "SELECT_STATE_PROVINCE": "Выберите штат/провинцию",
                "HIDE": "Скрыть",
                "AT_ANY_TIME": "В любое время",
                "IN_THE_MORNING": "Утром",
                "IN_THE_AFTERNOON": "Днем",
                "IN_THE_EVENING": "Вечером",
                "FROM": "Откуда",
                "TO": "Куда",
                "CONTINUE_ROUTE": "Продолжить маршрут",
                "PASSENGERS": "Пассажиры",
                "CLEAR_ALL": "Очистить все",
                "SEARCH": "Поиск",
                "OR": "или",
                "STATE": "Штат",
                "FORM_CLASS_W": "Премиум эконом",
                "BACK": "Обратно",
                "THERE": "Туда",
                "TIME_FLY_THERE": "Время вылета туда",
                "TIME_FLY_BACK": "Время вылета обратно",
                "SORTIE": "Вылет",
                "SIMPLE_SEARCH": "Простой поиск",
                "ADVANCED_SEARCH": "Расширенный поиск",
                "DEPARTURE_TIME": "Время отправления",
                "ARRIVAL_TIME": "Время прибытия",
                "SELECT_DATE": "Выберите дату",
                "OPEN_AVIA_ADDITIONAL_FORM": "Открыть расширенную форму",
                "CONFIRM": "Подтвердить"
            },
            en: {
                "ONE_WAY": "One-Way",
                "ROUND_TRIP": "Round Trip",
                "MULTY_ROUTE": "Multi-City",
                "JANUARY": "January",
                "FEBRUARY": "February",
                "MARCH": "March",
                "APRIL": "April",
                "MAY": "May",
                "JUNE": "June",
                "JULY": "July",
                "AUGUST": "August",
                "SEPTEMPER": "September",
                "OCTOBER": "October",
                "NOVEMBER": "November",
                "DECEMBER": "December",
                "JANUARY_SHORT": "Jan",
                "FEBRUARY_SHORT": "Feb",
                "MARCH_SHORT": "Mar",
                "APRIL_SHORT": "Apr",
                "MAY_SHORT": "May",
                "JUNE_SHORT": "Jun",
                "JULY_SHORT": "Jul",
                "AUGUST_SHORT": "Aug",
                "SEPTEMPER_SHORT": "Sep",
                "OCTOBER_SHORT": "Oct",
                "NOVEMBER_SHORT": "Nov",
                "DECEMBER_SHORT": "Dec",
                "SUNDAY": "Sunday",
                "MONDAY": "Monday",
                "TUESDAY": "Tuesday",
                "WEDNESDAY": "Wednesday",
                "THURSDAY": "Thursday",
                "FRIDAY": "Friday",
                "SATURDAY": "Saturday",
                "SUNDAY_SHORT": "Sun",
                "MONDAY_SHORT": "Mon",
                "TUESDAY_SHORT": "Tue",
                "WEDNESDAY_SHORT": "Wed",
                "THURSDAY_SHORT": "Thu",
                "FRIDAY_SHORT": "Fri",
                "SATURDAY_SHORT": "Sat",
                "SUNDAY_MIN": "Su",
                "MONDAY_MIN": "Mo",
                "TUESDAY_MIN": "Tu",
                "WEDNESDAY_MIN": "We",
                "THURSDAY_MIN": "Th",
                "FRIDAY_MIN": "Fr",
                "SATURDAY_MIN": "Sa",
                "CLOSE_TEXT": "Done",
                "TODAY_TEXT": "Today",
                "WEEK_HEADER": "Wk",
                "FIRST_DAY": "0",
                "AIRTICKETS": "Airtickets",
                "RAILWAYTICKETS": "Railway tickets",
                "PLACEHOLDER_AIRPORT2": "Enter the airport, city or IATA code",
                "SELECT_AIRPORT": "Select airport",
                "COUNTRY": "Country",
                "SELECT_COUNTRY": "Select country...",
                "AIRPORT": "Airport",
                "SELECT_AIRPORT2": "Select airport...",
                "REMOVE_LEG": "Remove flight",
                "BY_EXACT_DATE": "by exact date",
                "FIND": "Search",
                "RAILWAY_PLACEHOLDER": "Enter the name of the city or station",
                "BUSES_PLACEHOLDER": "Enter the name of the city",
                "SELECT_AIRPORT_FROM_LIST": "Select an airport from the list...",
                "NEED_TO_SELECT_DIFFERENT_AIRPORTS": "You must specify different airports for departure and arrival points...",
                "SELECT_STATION_FROM_LIST": "Select a station from the list...",
                "SELECT_CITY_FROM_LIST": "Select a city from the list...",
                "NEED_TO_SELECT_DIFFERENT_STATIONS": "You must specify different stations for departure and arrival points...",
                "NEED_TO_SELECT_DIFFERENT_CITIES": "You must specify different cities for departure and arrival points...",
                "NOTHING_FOUND": "Nothing found",
                "PASS_CAT_INF": "Infant",
                "PASS_CAT_INF_NS_DESC": "below 2 yrs without seat",
                "PASS_CAT_INF_NS_1": "infant w./s.",
                "PASS_CAT_INF_NS_0": "infants w./s.",
                "PASS_CAT_INF_NS_4": "infants w./s.",
                "PASS_CAT_INF_WS_DESC": "below 2 yrs with seat",
                "PASS_CAT_INF_WS_1": "infant",
                "PASS_CAT_INF_WS_0": "infants",
                "PASS_CAT_INF_WS_4": "infants",
                "PASS_CAT_CNN": "Children",
                "PASS_CAT_CNN_DESC": "2 – 11 yrs",
                "PASS_CAT_CNN_1": "child",
                "PASS_CAT_CNN_0": "children",
                "PASS_CAT_CNN_4": "children",
                "PASS_CAT_YTH": "Youth",
                "PASS_CAT_YTH_DESC": "12 – 25 yrs",
                "PASS_CAT_YTH_1": "youth",
                "PASS_CAT_YTH_0": "youth",
                "PASS_CAT_ADT": "Adults",
                "PASS_CAT_ADT_DESC": "26 – 60 yrs",
                "PASS_CAT_ADT_1": "adult",
                "PASS_CAT_ADT_0": "adults",
                "PASS_CAT_SNN": "Senior",
                "PASS_CAT_SNN_DESC": "over 60 yrs",
                "PASS_CAT_SNN_1": "senior",
                "PASS_CAT_SNN_0": "senior",
                "SPECIFY_PASSENGERS": "Specify the passengers ...",
                "FORM_CLASS_ANY": "Any",
                "FORM_CLASS_E": "Economy",
                "FORM_CLASS_B": "Business",
                "FORM_CLASS_F": "First",
                "FORM_CLASS_P": "Premium",
                "C_PASSENGER": "passenger",
                "C_PASSENGERS": "passengers",
                "C_PASSEGNERS2": "passengers",
                "DAY": "day",
                "DAYS": "days",
                "CLASS": "Class",
                "AIRCOMPANY": "Preferred Airline",
                "ANY_AVIACOMPANY": "Any airline",
                "SELECT_AVIACOMPANY": "Select carrier",
                "ONLY_DIRECT_FLIGHTS": "only direct flights",
                "VALIDATE_FORM_SEARCH_MESSAGE_2": "Someone still should fly.",
                "VALIDATE_FORM_SEARCH_MESSAGE_3": "There should not be more infants than youths, adults and seniors in total.",
                "SELECT_STATE_PROVINCE": "Select state/province",
                "HIDE": "Hide",
                "AT_ANY_TIME": "At any time",
                "IN_THE_MORNING": "In the morning",
                "IN_THE_AFTERNOON": "In the afternoon",
                "IN_THE_EVENING": "In the evening",
                "FROM": "From",
                "TO": "To",
                "CONTINUE_ROUTE": "Continue route",
                "PASSENGERS": "Passengers",
                "CLEAR_ALL": "Clear all",
                "SEARCH": "Search",
                "OR": "or",
                "STATE": "State",
                "FORM_CLASS_W": "Premium economy",
                "BACK": "Return on",
                "THERE": "Depart on",
                "TIME_FLY_THERE": "Departure time to",
                "TIME_FLY_BACK": "Departure time back",
                "SORTIE": "Departure",
                "SIMPLE_SEARCH": "Simple search",
                "ADVANCED_SEARCH": "More options",
                "DEPARTURE_TIME": "Departure time",
                "ARRIVAL_TIME": "Arrival time",
                "SELECT_DATE": "Select date",
                "OPEN_AVIA_ADDITIONAL_FORM": "Open additional form",
                "CONFIRM": "Confirm"
            },
            ua: {
                "ONE_WAY": "В одну сторону",
                "ROUND_TRIP": "Туди і назад",
                "MULTY_ROUTE": "Складний маршрут",
                "JANUARY": "Січень",
                "FEBRUARY": "Лютий",
                "MARCH": "Березень",
                "APRIL": "Квітень",
                "MAY": "Травень",
                "JUNE": "Червень",
                "JULY": "Липень",
                "AUGUST": "Серпень",
                "SEPTEMPER": "Вересень",
                "OCTOBER": "Жовтень",
                "NOVEMBER": "Листопад",
                "DECEMBER": "Грудень",
                "JANUARY_SHORT": "Січ",
                "FEBRUARY_SHORT": "Лют",
                "MARCH_SHORT": "Бер",
                "APRIL_SHORT": "Кві",
                "MAY_SHORT": "Тра",
                "JUNE_SHORT": "Чер",
                "JULY_SHORT": "Лип",
                "AUGUST_SHORT": "Сер",
                "SEPTEMPER_SHORT": "Вер",
                "OCTOBER_SHORT": "Жов",
                "NOVEMBER_SHORT": "Лис",
                "DECEMBER_SHORT": "Гру",
                "SUNDAY": "Неділя",
                "MONDAY": "Понеділок",
                "TUESDAY": "Вівторок",
                "WEDNESDAY": "Середа",
                "THURSDAY": "Четвер",
                "FRIDAY": "П`ятниця",
                "SATURDAY": "Субота",
                "SUNDAY_SHORT": "нед",
                "MONDAY_SHORT": "пнд",
                "TUESDAY_SHORT": "втр",
                "WEDNESDAY_SHORT": "срд",
                "THURSDAY_SHORT": "чтв",
                "FRIDAY_SHORT": "птн",
                "SATURDAY_SHORT": "сбт",
                "SUNDAY_MIN": "Нд",
                "MONDAY_MIN": "Пн",
                "TUESDAY_MIN": "Вт",
                "WEDNESDAY_MIN": "Ср",
                "THURSDAY_MIN": "Чт",
                "FRIDAY_MIN": "Пт",
                "SATURDAY_MIN": "Сб",
                "CLOSE_TEXT": "Закрити",
                "TODAY_TEXT": "Сьогодні",
                "WEEK_HEADER": "Тижд",
                "FIRST_DAY": "1",
                "AIRTICKETS": "Авіаквитки",
                "RAILWAYTICKETS": "ЖД квитки",
                "PLACEHOLDER_AIRPORT2": "Введіть аеропорт, місто або код ІАТА",
                "SELECT_AIRPORT": "Вибрати аеропорт",
                "COUNTRY": "Країна",
                "SELECT_COUNTRY": "Оберіть країну...    ",
                "AIRPORT": "Аеропорт",
                "SELECT_AIRPORT2": "Оберіть аеропорт...",
                "REMOVE_LEG": "Видалити переліт",
                "BY_EXACT_DATE": "за точною датою",
                "FIND": "Знайти",
                "RAILWAY_PLACEHOLDER": "Введіть назву міста або станції",
                "BUSES_PLACEHOLDER": "Введіть назву міста",
                "SELECT_AIRPORT_FROM_LIST": "Виберіть аеропорт зі списку...",
                "NEED_TO_SELECT_DIFFERENT_AIRPORTS": "Необхідно вказати різні аеропорти для пунктів вильоту і прильоту...",
                "SELECT_STATION_FROM_LIST": "Виберіть станцію зі списку...",
                "SELECT_CITY_FROM_LIST": "Виберіть місто зі списку...",
                "NEED_TO_SELECT_DIFFERENT_STATIONS": "Необхідно вказати різні станції для пунктів відправлення та прибуття...",
                "NEED_TO_SELECT_DIFFERENT_CITIES": "Необхідно вказати різні міста для пунктів відправлення та прибуття...",
                "NOTHING_FOUND": "Нічого не знайдено",
                "PASS_CAT_INF": "Немовля",
                "PASS_CAT_INF_NS_DESC": "без місця до 2 років",
                "PASS_CAT_INF_NS_1": "немовля б.м.",
                "PASS_CAT_INF_NS_0": "немовлят б.м.",
                "PASS_CAT_INF_NS_4": "немовлят б.м.",
                "PASS_CAT_INF_WS_DESC": "з місцем до 2 років",
                "PASS_CAT_INF_WS_1": "немовля",
                "PASS_CAT_INF_WS_0": "немовлят",
                "PASS_CAT_INF_WS_4": "немовлят",
                "PASS_CAT_CNN": "Діти",
                "PASS_CAT_CNN_DESC": "2 – 11",
                "PASS_CAT_CNN_1": "дитина",
                "PASS_CAT_CNN_0": "дітей",
                "PASS_CAT_CNN_4": "дитини",
                "PASS_CAT_YTH": "Молодь",
                "PASS_CAT_YTH_DESC": "12 – 25",
                "PASS_CAT_YTH_1": "молодіжний",
                "PASS_CAT_YTH_0": "молодіжних",
                "PASS_CAT_ADT": "Дорослі",
                "PASS_CAT_ADT_DESC": "26 – 60",
                "PASS_CAT_ADT_1": "дорослий",
                "PASS_CAT_ADT_0": "дорослих",
                "PASS_CAT_SNN": "Літні",
                "PASS_CAT_SNN_DESC": "старші 60",
                "PASS_CAT_SNN_1": "літній",
                "PASS_CAT_SNN_0": "літніх",
                "SPECIFY_PASSENGERS": "Вкажіть пасажирів...",
                "FORM_CLASS_ANY": "Будь який",
                "FORM_CLASS_E": "Економ",
                "FORM_CLASS_B": "Бізнес",
                "FORM_CLASS_F": "Перший",
                "FORM_CLASS_P": "Премiум",
                "C_PASSENGER": "пасажир",
                "C_PASSENGERS": "пасажирів",
                "C_PASSEGNERS2": "пасажира",
                "DAY": "день",
                "DAYS": "дня",
                "CLASS": "Клас",
                "AIRCOMPANY": "Авіакомпанія",
                "ANY_AVIACOMPANY": "Будь-яка авіакомпанія",
                "SELECT_AVIACOMPANY": "Виберіть авіакомпанію",
                "ONLY_DIRECT_FLIGHTS": "тільки прямі рейси",
                "VALIDATE_FORM_SEARCH_MESSAGE_2": "Хтось все ж повинен летіти.",
                "VALIDATE_FORM_SEARCH_MESSAGE_3": "Немовлят не повинно бути більше, ніж молоді, дорослих і літніх в сумі.",
                "SELECT_STATE_PROVINCE": "Виберіть штат / провінцію",
                "HIDE": "Сховати",
                "AT_ANY_TIME": "У будь-який час",
                "IN_THE_MORNING": "Вранці",
                "IN_THE_AFTERNOON": "Вдень",
                "IN_THE_EVENING": "Ввечері",
                "FROM": "Звідки",
                "TO": "Куди",
                "CONTINUE_ROUTE": "Продовжити маршрут",
                "PASSENGERS": "Пасажири",
                "CLEAR_ALL": "Очистити все",
                "SEARCH": "Пошук",
                "OR": "або",
                "STATE": "Штат",
                "FORM_CLASS_W": "Преміум економ",
                "BACK": "Зворотно",
                "THERE": "Туди",
                "TIME_FLY_THERE": "Час вильоту туди",
                "TIME_FLY_BACK": "Час вильоту назад",
                "SORTIE": "Виліт",
                "SIMPLE_SEARCH": "Простий пошук",
                "ADVANCED_SEARCH": "Розширений пошук",
                "DEPARTURE_TIME": "Час відправлення",
                "ARRIVAL_TIME": "Час прибуття",
                "SELECT_DATE": "Оберіть дату",
                "OPEN_AVIA_ADDITIONAL_FORM": "Відкрити розширену форму",
                "CONFIRM": "Підтвердити"
            }
        };

        if (typeof (window.rezOnFormAddLanguages) != 'undefined' && window.rezOnFormAddLanguages.length > 0) {
            while (window.rezOnFormAddLanguages.length) {
                var addLang = window.rezOnFormAddLanguages.pop();
                this._locale[addLang.lang] = addLang.dict;
            }
        }
        return this;
    }
    var it = this.constructor();


    //-----------------------------------------
    // Дополнительные методы
    //-----------------------------------------
    rezOnForm.prototype.extra = {};

    rezOnForm.prototype.extra.parseDateTime = function (strs) {
        if (strs == undefined || strs.len < 10) return undefined;
        var checkDateParts = function (day, month, year) {
            if (year < 1500 || year > 2500) return false;
            if (month <= 0 || month > 12) return false;

            var maxDayInMonth = new Date(year, month, 0).getDate();
            if (day <= 0 || day > maxDayInMonth) return false;

            return true;
        }

        var dateParts = strs.split(".");


        var day = dateParts.length > 2 ? dateParts[0] : -1;
        var month = dateParts.length > 2 ? dateParts[1] : -1;
        var year = dateParts.length > 2 ? dateParts[2] : -1;

        return checkDateParts(day, month, year) ? new Date(year, month - 1, day) : undefined;
    };

    rezOnForm.prototype.extra.mobileAndTabletcheck = function () {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    rezOnForm.prototype.extra.onResizeEvent = function () {
        var width = $(window).width();
        if (width <= 575) {
            $('input.book-date.datepicker').prop('readonly', true);
        } else {
            $('input.book-date.datepicker').prop('readonly', false);
        }
    }

    rezOnForm.prototype.extra.dateTimeToString = function (dateTime) {
        if (!dateTime) return "";
        var dd = dateTime.getDate();
        var mm = dateTime.getMonth() + 1;

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return dd + '.' + mm + '.' + dateTime.getFullYear();
    };

    rezOnForm.prototype.extra.remoteUrl = function () {
        return it._o.projectUrl + it._o.defaultLang;
    }

    rezOnForm.prototype.extra.locale = function (str, locale) {
        if (locale == undefined && window.main != undefined && window.main.locale != undefined) return window.main.locale(str);
        locale = locale || it._o.defaultLang;
        if (it._locale.hasOwnProperty(locale) && typeof it._locale[locale] == 'object') {
            if (it._locale[locale].hasOwnProperty(str)) {
                return it._locale[locale][str];
            }
        }
        return str;
    };

    rezOnForm.prototype.extra.scrollToOn = false;
    rezOnForm.prototype.extra.scrollTo = function (el, offsetTop) {
        rezOnForm.prototype.extra.abortScroll();
        if (!el) return;
        var offset = el.offset();
        if (!offset) return;
        rezOnForm.prototype.extra.scrollToOn = true;
        $('html, body').animate({
            scrollTop: offset.top + (offsetTop || 0)
        }, 1000, function () {
            rezOnForm.prototype.extra.scrollToOn = false;
        });
    }
    rezOnForm.prototype.extra.abortScroll = function () {
        if (rezOnForm.prototype.extra.scrollToOn) {
            rezOnForm.prototype.extra.scrollToOn = false;
            $('html,body').stop();
        }
    }

    rezOnForm.prototype.extra.openField = function (el) {
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
            if (iOS) {
                $(window).scrollTop($(window).scrollTop() + 1).scrollTop($(window).scrollTop() - 1);
            }

            $('body').addClass('m-no-scroll');
            field.addClass('opened');
            field.find('.link-left, .link-right').removeClass('hidden');
        }
        return false;
    }
    rezOnForm.prototype.extra.closeField = function (el) {
        if (el === undefined || el === null) return false;
        var field = el.closest('.field');
        if (field.length > 0) {
            var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;

            $('body').removeClass('m-no-scroll');
            field.removeClass('opened');
            field.find('.link-left, .link-right').addClass('hidden');
            if (isMobile) {

            }
        }
        return false;
    }

    rezOnForm.prototype.extra.swipeDetect = function (el, callback) {
        var touchsurface = el,
            swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = 150, //min distance
            restraint = 100, // max distance 
            allowedTime = 300, // max time 
            elapsedTime,
            startTime,
            handleswipe = callback || function (swipedir) { }

        touchsurface.addEventListener('touchstart',
            function (e) {
                var touchobj = e.changedTouches[0];
                swipedir = 'none';
                dist = 0;
                startX = touchobj.pageX;
                startY = touchobj.pageY;
                startTime = new Date().getTime();
                // e.preventDefault();
            },
            false);

        touchsurface.addEventListener('touchmove',
            function (e) {
                e.preventDefault(); // prevent scrolling when inside DIV
            },
            false);

        touchsurface.addEventListener('touchend',
            function (e) {
                var touchobj = e.changedTouches[0];
                distX = touchobj.pageX - startX;
                distY = touchobj.pageY - startY;
                elapsedTime = new Date().getTime() - startTime;
                if (elapsedTime <= allowedTime) {
                    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint
                    ) {
                        swipedir =
                            (distX < 0) ? 'left' : 'right';
                    } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint
                    ) {
                        swipedir = (distY < 0) ? 'up' : 'down';
                    }
                }
                handleswipe(swipedir);
                // e.preventDefault();
            },
            false);
    };

    //-----------------------------------------
    // Работа с данными
    //-----------------------------------------
    rezOnForm.prototype.dataWork = {};

    rezOnForm.prototype.dataWork.airporFinderData = function () {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: it.extra.remoteUrl() + '/HelperAsync/Lookup?query=',
                rateLimitWait: 10,
                replace: function (url, query) {
                    return url + encodeURIComponent(query.replace(/[^a-zA-Zа-яА-ЯіїІЇ0-9\s,]{1}/g, "_"));
                },
                filter: function (data) {
                    return data;
                }
            }
        });
    };

    rezOnForm.prototype.dataWork.countriesData = function () {
        return rezOnForm.staticCountriesData(it.extra.remoteUrl());
    }

    rezOnForm.prototype.dataWork.carriersData = function () {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.label + " " + datum.code);
            },
            limit: 1000,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: it.extra.remoteUrl() + '/HelperAsync/GetAirCompanies?v=2',
                filter: function (list) {
                    return list;
                }
            }
        });
    }

    rezOnForm.prototype.dataWork.stationsFinderData = function () {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: it.extra.remoteUrl() + '/HelperAsync/LookupStations?query=',
                rateLimitWait: 10,
                replace: function (url, query) {
                    return url + encodeURIComponent(query.replace(/[^a-zA-Zа-яА-ЯіїІЇ0-9]{1}/g, "_"));
                },
                filter: function (data) {
                    return data;
                }
            }
        });
    };

    rezOnForm.prototype.dataWork.busCitiesFinderData = function () {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: it.extra.remoteUrl() + '/HelperAsync/LookupBusStations?query=',
                rateLimitWait: 10,
                replace: function (url, query) {
                    return url + encodeURIComponent(query.replace(/[^a-zA-Zа-яА-ЯіїІЇ0-9]{1}/g, "_"));
                },
                filter: function (data) {
                    return data;
                }
            }
        });
    };

    rezOnForm.prototype.dataWork.hotelCityFinderData = function () {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: it.extra.remoteUrl() + '/HelperAsync/LookupHotels?query=',
                rateLimitWait: 10,
                replace: function (url, query) {
                    return url + encodeURIComponent(query.replace(/[^a-zA-Zа-яА-ЯіїІЇ0-9]{1}/g, "_"));
                },
                filter: function (data) {
                    return data;
                }
            }
        });
    };


    //Установка значений по-умолчанию
    rezOnForm.prototype.dataWork.setDefaults = function (o) {
        o = o || {};

        /* Смысл метода в том, что бы установить флаг об успешной инициализации
         * формы только после того, как подгрузятся все значения по-умолчанию,
         * а они могут подгружаться с некоторой задержкой
         */
        var setInitializedProperty = function () {
            it._initialized = true;
        }
        setInitializedProperty();

    }

    //-----------------------------------------
    // Валидации
    //-----------------------------------------
    rezOnForm.prototype.validation = {};

    //Валидация формы поиска авиабилетов
    rezOnForm.prototype.validation.airForm = function () {

        var ret = rezOnForm.prototype.validation.departure_arrival();
        ret = rezOnForm.prototype.validation.dateRange(it._aviaForm) && ret;
        ret = rezOnForm.prototype.validation.passengers(it._aviaForm) && ret;

        if (ret && typeof main !== 'undefined' && main.airtickets != undefined && main.airtickets.searchForm != undefined && main.airtickets.searchForm.send != undefined) return main.airtickets.searchForm.send(it._aviaForm);
        return ret;
    }

    //Проверка пунктов вылета / прилета
    rezOnForm.prototype.validation.departure_arrival = function () {
        var ret = true;

        it._aviaForm.find(".book-from").closest(".fields-container").each(function () {

            var inpFrom = $(this).find(".book-from").parent().siblings("input[type='hidden']").first();
            var inpTo = $(this).find(".book-to").parent().siblings("input[type='hidden']").first();

            if ($.trim(inpFrom.val()) == "" || inpFrom.val() == "&nbsp;") {
                inpFrom.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("SELECT_AIRPORT_FROM_LIST")).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
                ret = false;
            }

            if ($.trim(inpTo.val()) == "" || inpTo.val() == "&nbsp;") {
                inpTo.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("SELECT_AIRPORT_FROM_LIST")).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
                ret = false;
            } else if ($.trim(inpFrom.val()) == $.trim(inpTo.val())) {
                inpTo.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("NEED_TO_SELECT_DIFFERENT_AIRPORTS")).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
                ret = false;
            }
        });
        return ret;
    };

    //Проверка даты вылета туда / обратно
    rezOnForm.prototype.validation.dateRange = function (form) {
        var ret = true;
        form.find(".date-wrapper.with-error").removeClass("with-error");
        form.find(".book-date").each(function () {
            if ($(this).closest(".date-wrapper").length === 0) return;

            if ($.trim($(this).val()) === "" || $(this).val() === "__.__.201_") {
                $(this).closest(".date-wrapper").addClass("with-error");
                ret = false;
            }
        });
        return ret;
    }
    //Валидация пассажиров
    rezOnForm.prototype.validation.passengers = function (form) {
        var errorsCount = form.find('.passengers .error-box label').length;
        var ret = errorsCount === 0;
        return ret;
    }
    //Валидация формы поиска ЖД билетов
    rezOnForm.prototype.validation.railForm = function () {

        var ret = it.validation.stations();
        ret = rezOnForm.prototype.validation.dateRange(it._railwayForm) && ret;
        if (ret && typeof main !== 'undefined' && main.traintickets != undefined && main.traintickets.searchForm != undefined && main.traintickets.searchForm.send != undefined) return main.traintickets.searchForm.send(it._railwayForm);
        return ret;
    }
    //Валидация формы поиска автобусов
    rezOnForm.prototype.validation.busForm = function () {

        var ret = it.validation.cities();
        ret = rezOnForm.prototype.validation.dateRange(it._busesForm) && ret;
        //TODO!!!
        if (ret && typeof main !== 'undefined' && main.bustickets != undefined && main.bustickets.searchForm != undefined && main.bustickets.searchForm.send != undefined)
            return main.bustickets.searchForm.send(it._busesForm);
        return ret;
    }
    //Валидация формы поиска автобусов
    rezOnForm.prototype.validation.hotelForm = function () {

        var ret = it.validation.hotelCity();
        ret = rezOnForm.prototype.validation.dateRange(it._hotelForm) && ret;
        //TODO!!!
        if (ret && typeof main !== "undefined" && main.hotel != undefined && main.hotel.searchForm != undefined && main.hotel.searchForm.send != undefined)
            return main.hotel.searchForm.send(it._hotelForm);
        return ret;
    }

    //Проверка станций отправления / прибытия
    rezOnForm.prototype.validation.stations = function () {
        var ret = true;
        var inpFrom = it._railwayForm.find("input[name='tshi_station_from']").first();
        var inpTo = it._railwayForm.find("input[name='tshi_station_to']").first();

        if ($.trim(inpFrom.val()) == "" || inpFrom.val() == "&nbsp;") {
            inpFrom.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("SELECT_STATION_FROM_LIST")).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
            ret = false;
        }
        if ($.trim(inpTo.val()) == "" || inpTo.val() == "&nbsp;") {
            inpTo.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("SELECT_STATION_FROM_LIST")).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
            ret = false;
        } else if ($.trim(inpFrom.val()) == $.trim(inpTo.val())) {
            inpTo.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("NEED_TO_SELECT_DIFFERENT_STATIONS")).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
            ret = false;
        }
        return ret;
    }

    //Проверка городов отправления / прибытия
    rezOnForm.prototype.validation.cities = function () {
        var ret = true;
        var inpFrom = it._busesForm.find("input[name='CityIdFrom']").first();
        var inpTo = it._busesForm.find("input[name='CityIdTo']").first();

        if ($.trim(inpFrom.val()) === "" || inpFrom.val() === "&nbsp;") {
            inpFrom.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("SELECT_CITY_FROM_LIST", it._o.defaultLang)).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
            ret = false;
        }
        if ($.trim(inpTo.val()) === "" || inpTo.val() === "&nbsp;") {
            inpTo.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("SELECT_CITY_FROM_LIST", it._o.defaultLang)).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
            ret = false;
        } else if ($.trim(inpFrom.val()) === $.trim(inpTo.val())) {
            inpTo.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("NEED_TO_SELECT_DIFFERENT_CITIES", it._o.defaultLang)).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
            ret = false;
        }
        return ret;
    }

    //Validation hotel city
    rezOnForm.prototype.validation.hotelCity = function () {
        var city = it._hotelForm.find("input[name='CityId']").first();

        if ($.trim(city.val()) === "" || city.val() === "&nbsp;") {
            city.closest(".field").addClass("has-error").find(".error-box").text(it.extra.locale("SELECT_HOTEL_CITY_FROM_LIST", it._o.defaultLang)).append($("<div/>").addClass("close")).slideDown(it._o.animationDelay);
            return false;
        }
        return true;
    }

    rezOnForm.prototype.bind = function () {
        //Если это не страница проекта (т.е. форма не внешнем ресурсе, не подключен файл main.js)
        if (window.main == undefined) {
            it._form.on("click", ".selectpicker .options, .selectpicker .option, .selected-value", function () {
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
                        if (rezOnForm.static.isInIframe()) {
                            rezOnForm.static.recalculateHeightOnClose();
                            typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
                        if (rezOnForm.static.isInIframe()) {
                            rezOnForm.static.recalculateHeightOnOpen(el);
                            typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
                return false;
            });

            it._form.on("blur click focusout", ".selectpicker.opened", function () {
                var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
                var selectpicker = $(this);
                var updatingCloseSelect = function () {
                    selectpicker.removeClass("opened");
                    if (rezOnForm.static.isInIframe()) {
                        rezOnForm.static.recalculateHeightOnClose();
                        typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
                if ($(this).attr("tabindex") != "-1") {
                    $(this).attr("tabindex", "-1");
                    var radio = $(this).find("input:radio:checked");
                    if (radio.length == 0) radio = $(this).find("input:radio:first");

                    var selectedValue = $(this).find(".selected-value");
                    if (selectedValue.length === 0) selectedValue = $("<div/>").prependTo($(this)).addClass("selected-value clear_after");

                    selectedValue.html("").append($("<span/>").html(radio.prev("span:first").html()));
                }
            });
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
        $(window).on('focus', function () {
            var activeEl = $(document.activeElement);
            if (activeEl.length > 0 && activeEl.closest(".rez-forms").length > 0) {
                activeEl.trigger('blur').trigger('focus');
            }
        });


        typeof (updatingHeight) !== 'undefined' && updatingHeight(); //Обновление высоты, если фрейм

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
    }

    rezOnForm.prototype.aviaBind = function () {

        //Отправка формы поиска авиабилетов
        it._aviaForm.submit(function () {
            return it.validation.airForm();
        });

        it._aviaForm.bindAirportTypeahead = function (el) {
            el = el || it._aviaForm.find('.book-from, .book-to');
            var typeaheadOptions = {
                minLength: 2
            };

            if (it._o.avia.onlySpecificAirportsInDropdown) {
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
            el.typeahead(typeaheadOptions, {
                name: "airports-" + it._o.defaultLang,
                displayKey: 'value',
                source: it.dataWork.airporFinderData.ttAdapter(),
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
            }).click(function () {
                $(this).select();
            }).blur(function () {
                $(this).closest('.field.focused').removeClass('focused');
                if ($.trim($(this).val()) == "") $(this).trigger("typeahead:queryChanged");
                var item = $(this).closest('.field');
                it.extra.closeField(item);


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

                if (rezOnForm.static.isInIframe()) {
                    rezOnForm.static.recalculateHeightOnClose();
                }
                return false;
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
                            $(this).closest(".fields-container").find(".book-to.tt-input").trigger("click");
                        } else if ($(this).is(".book-to") && vue.avia.formType.value === "roundtrip") {
                            var dp = $(this).closest(".fields-container").find('.date.from').find("input[name='book_from_date']");
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

                if (rezOnForm.static.isInIframe()) {
                    var dropdown = item.find('.tt-dropdown-menu');
                    var offset = dropdown.parent().offset().top;
                    var height = parseFloat(dropdown.css('max-height'));
                    var currHeight = parseFloat($(this).css('height'));
                    var totalHeight = height + currHeight;

                    rezOnForm.static.recalculateHeightOnOpen(dropdown, offset, totalHeight);
                    typeof (updatingHeight) !== 'undefined' && updatingHeight();
                }
            }).on("typeahead:dropup", function (its) {
                if (rezOnForm.static.isInIframe()) {
                    rezOnForm.static.recalculateHeightOnClose();
                    typeof (updatingHeight) !== 'undefined' && updatingHeight();
                }
                var item = $(this).closest(".field");
                it.extra.closeField(item);
            }).on("typeahead:queryChanged", function (it, query) {

            }).on("typeahead:updateHint", function (a, b) {
                if (b) $(this).data("lastHist", b);
                else $(this).removeData("lastHist");
            });
        };
        it._aviaForm.bindAirportTypeahead();

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
            it._aviaForm.bindAirportTypeahead(inputs);
        });

        //Список авиакомпаний
        it._aviaForm.find(".galileo-aircompany-select").typeahead({
            hint: true,
            highlight: true,
            minLength: 0,
            isSelectPicker: true
        },
            {
                name: 'carriers-' + it._o.defaultLang,
                source: it.dataWork.carriersData.ttAdapter(),
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
                if (rezOnForm.static.isInIframe()) {
                    var dropdown = item.find('.tt-dropdown-menu');
                    var offset = dropdown.parent().offset().top;
                    var height = parseFloat(dropdown.css('height'));
                    var currHeight = parseFloat($(this).css('height'));
                    var totalHeihgt = height + currHeight;

                    rezOnForm.static.recalculateHeightOnOpen(dropdown, offset, totalHeihgt);
                    typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
                    var values = $.map(it._aviaForm.find(".carriers .carriers-finder input[type='hidden']"), function (val, i) {
                        return ".iata-code[data-iata='" + $(val).val() + "']";
                    });
                    dropDown.find(values.join(", ")).each(function () {
                        $(this).closest(".tt-suggestion").addClass("g-hide");
                    });
                }, 100);
            });

        //Passengers menu
        it._aviaForm.find(".passengers > .switch-box .switch").click(function () {
            var selectAge = it._aviaForm.find(".select-age");
            var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
            var field = $(this).closest('.field');

            if ($(this).is(".opened")) {
                $(this).removeClass("opened");
                it.extra.closeField(field);

                var updatingClosedSelect = function (el) {
                    el.addClass("g-hide");
                    if (rezOnForm.static.isInIframe()) {
                        rezOnForm.static.recalculateHeightOnClose();
                        typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
                    if (rezOnForm.static.isInIframe()) {
                        rezOnForm.static.recalculateHeightOnOpen(el);
                        typeof (updatingHeight) !== 'undefined' && updatingHeight();
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

        it._aviaForm.find(".select-age").focusin(function () {
            if ($(this).data('focusTimer')) clearTimeout($(this).data('focusTimer'));
            return false;
        }).on('blur focusout', function () {
            var selectAge = $(this);
            var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
            var field = $(this).closest('.field');

            var updateClosedSelect = function (el) {
                el.addClass("g-hide").siblings(".switch-box").find(".switch.opened").removeClass("opened");
                it.extra.closeField(field);
                if (rezOnForm.static.isInIframe()) {
                    rezOnForm.static.recalculateHeightOnClose();
                    typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
        it._aviaForm.find(".select-age .button-hide").click(function (e) {
            $(this).closest(".select-age").focus().blur();
            return false;
        });

        //Carriers menu
        it._aviaForm.find(".carriers").focusin(function () {
            var carriersItem = $(this).is(".carriers") ? $(this) : $(this).closest(".carriers");
            var carriersInput = carriersItem.find('input.tt-input');

            if (carriersItem.data('focusTimer')) clearTimeout(carriersItem.data('focusTimer'));

            if (carriersItem.find(".carriers-finder.g-hide").length > 0) {
                var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
                var field = $(this).closest('.field');
                var updateOpenedSelect = function (el) {
                    el.removeClass("g-hide").closest(".carriers").removeClass("z-100");
                    if (rezOnForm.static.isInIframe()) {
                        rezOnForm.static.recalculateHeightOnOpen(el);
                        typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
                if (rezOnForm.static.isInIframe()) {
                    rezOnForm.static.recalculateHeightOnClose();
                    typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
        it._aviaForm.find(".carriers .button-hide").click(function () {
            $(this).closest(".carriers").blur();
            return false;
        });

        //Кнопка Х на сообщении с ошибкой
        it._aviaForm.off("click", ".field.has-error .error-box .close");
        it._aviaForm.on("click", ".field.has-error .error-box .close", function () {
            $(this).closest(".error-box").slideUp(it._o.animationDelay, function () {
                $(this).html("").closest(".has-error").removeClass("has-error");
            });
            typeof (updatingHeight) !== 'undefined' && updatingHeight();
            return false;
        });


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
    }

    rezOnForm.prototype.railwayBind = function () {
        var typeaheadOptions = {
            minLength: 2
        };

        //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
        if (it.extra.mobileAndTabletcheck()) {
            typeaheadOptions.minLength = 0;
        }

        // Поиск станций / городов в основной форме
        it._railwayForm.find('.book-from, .book-to').typeahead(typeaheadOptions, {
            name: "stations-" + it._o.defaultLang,
            displayKey: 'value',
            source: it.dataWork.stationsFinderData.ttAdapter(),
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
                var fromStation = it._railwayForm.find("[name='tshi_station_from']").val();
                $.trim(fromStation) !== "" && $(this).typeahead('query', "fromstation_" + fromStation);
            }
        }).click(function () {
            $(this).select();
        }).blur(function () {
            $(this).closest('.field.focused').removeClass('focused');
            if ($.trim($(this).val()) == "") $(this).trigger("typeahead:queryChanged");
            var item = $(this).closest('.field');
            it.extra.closeField(item);
            return false;
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
                            var dp = $(this).closest(".fields-container").find('.date.from').find("input[name='book_from_date']")
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

            if (rezOnForm.static.isInIframe()) {
                var dropdown = item.find('.tt-dropdown-menu');
                var offset = dropdown.parent().offset().top;
                var height = parseFloat(dropdown.css('max-height'));
                var currHeight = parseFloat($(this).css('height'));
                var totalHeight = height + currHeight;

                rezOnForm.static.recalculateHeightOnOpen(dropdown, offset, totalHeight);
                typeof (updatingHeight) !== 'undefined' && updatingHeight();
            }
        }).on("typeahead:dropup", function (its) {
            if (rezOnForm.static.isInIframe()) {
                rezOnForm.static.recalculateHeightOnClose();
                typeof (updatingHeight) !== 'undefined' && updatingHeight();
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

        //Отправка формы поиска ЖД билетов
        it._railwayForm.submit(function () {
            return it.validation.railForm();
        });
    }

    rezOnForm.prototype.busesBind = function () {
        var typeaheadOptions = {
            minLength: 2
        };

        //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
        if (it.extra.mobileAndTabletcheck()) {
            typeaheadOptions.minLength = 0;
        }

        // Поиск городов в основной форме
        it._busesForm.find('.book-from, .book-to').typeahead(typeaheadOptions, {
            name: "bus-cities-" + it._o.defaultLang,
            displayKey: 'value',
            source: it.dataWork.busCitiesFinderData.ttAdapter(),
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
                var fromCity = it._busesForm.find("[name='CityIdFrom']").val();
                $.trim(fromCity) !== "" && $(this).typeahead('query', "fromCity_" + fromCity);
            }
        }).click(function () {
            $(this).select();
        }).blur(function () {
            $(this).closest('.field.focused').removeClass('focused');
            if ($.trim($(this).val()) == "") $(this).trigger("typeahead:queryChanged");
            var item = $(this).closest('.field');
            it.extra.closeField(item);
            return false;
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

            if (rezOnForm.static.isInIframe()) {
                var dropdown = item.find('.tt-dropdown-menu');
                var offset = dropdown.parent().offset().top;
                var height = parseFloat(dropdown.css('max-height'));
                var currHeight = parseFloat($(this).css('height'));
                var totalHeight = height + currHeight;

                rezOnForm.static.recalculateHeightOnOpen(dropdown, offset, totalHeight);
                typeof (updatingHeight) !== 'undefined' && updatingHeight();
            }
        }).on("typeahead:dropup", function (its) {
            if (rezOnForm.static.isInIframe()) {
                rezOnForm.static.recalculateHeightOnClose();
                typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
        it._busesForm.find(".passengers > .switch-box .switch").click(function () {
            var selectAge = it._busesForm.find(".select-age");
            var isMobile = it.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
            var field = $(this).closest('.field');

            if ($(this).is(".opened")) {
                $(this).removeClass("opened");
                it.extra.closeField(field);

                var updatingClosedSelect = function (el) {
                    el.addClass("g-hide");
                    if (rezOnForm.static.isInIframe()) {
                        rezOnForm.static.recalculateHeightOnClose();
                        typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
                    if (rezOnForm.static.isInIframe()) {
                        rezOnForm.static.recalculateHeightOnOpen(el);
                        typeof (updatingHeight) !== 'undefined' && updatingHeight();
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
        //Отправка формы поиска автобусов
        it._busesForm.submit(function () {
            return it.validation.busForm();
        });
    }


    rezOnForm.prototype.hotelBind = function () {
        var typeaheadOptions = {
            minLength: 2
        };

        // Отели select
        it._hotelForm.find('.select_box').click(function () {
            $(document).bind('click', HandlerClick);
        });

        function HandlerClick(e) {
            if (!$(e.target).hasClass("select_box") && $(e.target).parents(".select_box").length === 0) {
                $('.option_box').removeClass('open');
                $('.children_age').removeClass('open');
                $('.value_tag').removeClass('rotate');
                $('.children_input').removeClass('rotate');
                $(document).unbind('click', HandlerClick);
            }
        }

        $('.num_children .button-hide').click(function () {
            $(".option_box").removeClass('open');
            $('.value_tag').removeClass('rotate');
        });

        $('.num_children .option').click(function () {
            var text = $(this).text();
            var value = text.replace(/[^-0-9]/gim, '');
            $(this).closest('.children_box-item').find('.input_val').val(value);

            var sum = 0;
            $('.children_box-item .input_val').each(function () {
                if ($(this).val() != 0) {
                    sum++;
                }
            });
            $('.quantity_val').text(sum);
        });



        //Для мобильных делаем минимальную длинну 0, что бы всегда отображалось на весь экран, а не только при наличии 2х символов
        if (it.extra.mobileAndTabletcheck()) {
            typeaheadOptions.minLength = 0;
        }

        // Поиск городa в основной форме
        it._hotelForm.find('.book-from, .book-to').typeahead(typeaheadOptions, {
            name: "hotel-city-" + it._o.defaultLang,
            displayKey: "value",
            source: it.dataWork.hotelCityFinderData.ttAdapter(),
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
                    if (!!data.countryCode) {
                        ret.push(
                            {
                                key: $("<span class='country-separator'><small>" + data.countryCode + "</small><span>"),
                                value: undefined
                            });
                    }
                    for (var iHotel = 0; iHotel < data.hotels.length; iHotel++) {
                        ret.push({
                            key: data.hotels[iHotel].CityName + " <small class='express-code'>" + data.hotels[iHotel].CountryCode + "</small>",
                            value: {
                                Id: data.hotels[iHotel].Id,
                                Name: data.hotels[iHotel].CityName,
                                CountryCode: data.hotels[iHotel].CountryCode
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
            if ($(this).is(".book-to") && $(this).val() === "") {
                var city = it._busesForm.find("[name='CityId']").val();
                $.trim(city) !== "" && $(this).typeahead("query", "city_" + city);
            }
        }).click(function () {
            $(this).select();
        }).blur(function () {
            $(this).closest(".field.focused").removeClass("focused");
            if ($.trim($(this).val()) === "") $(this).trigger("typeahead:queryChanged");
            var item = $(this).closest(".field");
            it.extra.closeField(item);
            return false;
        }).on("typeahead:selected typeahead:autocompleted", function (e, datum) {
            if (datum != undefined) {
                var field = $(this).closest(".field.station");
                var name = field.find(".inside input[type='hidden']").attr("name");

                it.extra.closeField(field);
                vue.updateCityTypeAhead(name, datum);
                if (!it.extra.mobileAndTabletcheck()) {
                    var sib = field.closest("form").find("input[name='CityId']");
                    if (sib.val() === "") sib.siblings(".twitter-typeahead").find(".tt-input").click();
                }
                //Hide mobile keyboard
                $(this).blur();
            }
        }).on("typeahead:dropdown", function () {
            var item = $(this).closest(".field");
            it.extra.openField(item);

            if (rezOnForm.static.isInIframe()) {
                var dropdown = item.find(".tt-dropdown-menu");
                var offset = dropdown.parent().offset().top;
                var height = parseFloat(dropdown.css("max-height"));
                var currHeight = parseFloat($(this).css("height"));
                var totalHeight = height + currHeight;

                rezOnForm.static.recalculateHeightOnOpen(dropdown, offset, totalHeight);
                typeof (updatingHeight) !== 'undefined' && updatingHeight();
            }
        }).on("typeahead:dropup", function () {
            if (rezOnForm.static.isInIframe()) {
                rezOnForm.static.recalculateHeightOnClose();
                typeof (updatingHeight) !== "undefined" && updatingHeight();
            }

            //TODO First selected
            var item = $(this).closest(".field");
            it.extra.closeField(item);
            if (item.find(".inside input[type='hidden']").val() === "" && $(this).val().length > 1 && $(this).data("lastHist")) {
                $(this).val($(this).data("lastHist").Name);
                $(this).trigger("typeahead:autocompleted", [$(this).data("lastHist")]);
            }

        }).on("typeahead:queryChanged", function (it) {

        }).on("typeahead:updateHint", function (a, b) {
            if (b) $(this).data("lastHist", b);
            else $(this).removeData("lastHist");
        });

        //Отправка формы поиска автобусов
        it._hotelForm.submit(function () {
            return it.validation.hotelForm();
        });
    }

    // Установка всех локализаций
    rezOnForm.prototype.localeBind = function () {
        it._form.find("*[data-local='true']").each(function () {
            if (!!$(this).attr("data-localText")) {
                $(this).html(it.extra.locale($(this).attr("data-localText")));
            }
            if (!!$(this).attr("data-localPlaceholder")) {
                $(this).attr("placeholder", it.extra.locale($(this).attr("data-localPlaceholder")));
            }
            if (!!$(this).attr("data-localTitle")) {
                $(this).attr("title", it.extra.locale($(this).attr("data-localTitle")));
            }
        });
    }

    //-----------------------------------------
    // Инициализация
    //-----------------------------------------
    rezOnForm.prototype.extendOptions = function (o) {
        for (var optionKey in (o || {})) {
            if (this._o.hasOwnProperty(optionKey) && typeof (o[optionKey]) !== 'object') {
                this._o[optionKey] = o[optionKey];
            } else {
                for (var objKey in o[optionKey]) {
                    if (this._o[optionKey].hasOwnProperty(objKey) && o[optionKey][objKey] !== null) {
                        this._o[optionKey][objKey] = o[optionKey][objKey];
                    }
                }
            }
        }
    }

    rezOnForm.prototype.init = function (form) {
        this._form = form;
        this._aviaForm = this._form.find("#avia-form-shoot");
        this._railwayForm = this._form.find("#railway-form-shoot");
        this._busesForm = this._form.find("#buses-form-shoot");
        this._hotelForm = this._form.find("#hotel-form-shoot");

        if (this._o.avia) for (var optionKey in this._o.avia) {
            if (this._aviaForm.attr("data-" + optionKey)) this._o.avia[optionKey] = this._aviaForm.attr("data-" + optionKey);
        }
        if (this._o.railway) for (var optionKey in this._o.railway) {
            if (this._railwayForm.attr("data-" + optionKey)) this._o.railway[optionKey] = this._railwayForm.attr("data-" + optionKey);
        }
        if (this._o.buses) for (var optionKey in this._o.buses) {
            if (this._busesForm.attr("data-" + optionKey)) this._o.buses[optionKey] = this._busesForm.attr("data-" + optionKey);
        }
        if (this._o.hotel) for (var optionKey in this._o.hotel) {
            if (this._hotelForm.attr("data-" + optionKey)) this._o.hotel[optionKey] = this._hotelForm.attr("data-" + optionKey);
        }

        var timeOutId;
        $(window).resize(function () {
            !!timeOutId && clearTimeout(timeOutId);
            timeOutId = setTimeout(rezOnForm.prototype.extra.onResizeEvent, 200);
        });
        $('html').on('DOMMouseScroll mousewheel touchmove', function (e) {
            rezOnForm.prototype.extra.scrollToOn && rezOnForm.prototype.extra.abortScroll();
        });


        $.mask.definitions['~'] = '[0123]';
        $.mask.definitions['#'] = '[0123456789]';
        $.mask.definitions['$'] = '[01]';

        this._o.projectUrl !== "/" && this.localeBind();

        var neededTabs = [];
        if (this._o.formType !== "all") neededTabs.push(this._o.formType);
        else neededTabs = ["avia", "railway", "buses", "hotel"];

        if (neededTabs.length > 1) {
            this._form.find(".rez-forms-links").removeClass("g-hide");
            var frstTab = this._o.defaultFormTab || neededTabs[0];
        }

        for (var n = 0; n < neededTabs.length; n++) {
            switch (neededTabs[n]) {
                case "avia":
                    this._form.find(".rez-forms-links a.rez-form-link[href='#" + this._aviaForm.attr("id") + "']").removeClass("g-hide").addClass(frstTab == neededTabs[n] ? "active" : "");
                    if (neededTabs.length == 1 || frstTab == neededTabs[n]) this._aviaForm.removeClass("g-hide");

                    this.dataWork.airporFinderData = this.dataWork.airporFinderData();
                    this.dataWork.airporFinderData.initialize();

                    this.dataWork.countriesData = this.dataWork.countriesData();
                    this.dataWork.countriesData.initialize();

                    this.dataWork.carriersData = this.dataWork.carriersData();
                    this.dataWork.carriersData.initialize();

                    this.aviaBind();

                    if (this._o.projectUrl != "/")
                        this._aviaForm.attr("method", "POST")
                            .attr("action", this.extra.remoteUrl() + "/AirTickets/ModuleSearch")
                            .attr("target", this._o.formTarget || "_blank");
                    break;
                case "railway":
                    this._form.find(".rez-forms-links a.rez-form-link[href='#" + this._railwayForm.attr("id") + "']").removeClass("g-hide").addClass(frstTab == neededTabs[n] ? "active" : "");
                    if (neededTabs.length == 1 || frstTab == neededTabs[n]) this._railwayForm.removeClass("g-hide");

                    this.dataWork.stationsFinderData = this.dataWork.stationsFinderData();
                    this.dataWork.stationsFinderData.initialize();

                    this.railwayBind();

                    if (this._o.projectUrl != "/")
                        this._railwayForm.attr("method", "POST")
                            .attr("action", this.extra.remoteUrl() + "/RailwayTickets/ModuleSearch")
                            .attr("target", this._o.formTarget || "_blank");
                    break;
                case "buses":
                    this._form.find(".rez-forms-links a.rez-form-link[href='#" + this._busesForm.attr("id") + "']").removeClass("g-hide").addClass(frstTab == neededTabs[n] ? "active" : "");
                    if (neededTabs.length === 1 || frstTab === neededTabs[n]) this._busesForm.removeClass("g-hide");

                    this.dataWork.busCitiesFinderData = this.dataWork.busCitiesFinderData();
                    this.dataWork.busCitiesFinderData.initialize();

                    this.busesBind();

                    if (this._o.projectUrl !== "/")
                        this._busesForm.attr("method", "POST")
                            .attr("action", this.extra.remoteUrl() + "/BusTickets/ModuleSearch")
                            .attr("target", this._o.formTarget || "_blank");
                    break;
                case "hotel":
                    this._form.find(".rez-forms-links a.rez-form-link[href='#" + this._hotelForm.attr("id") + "']").removeClass("g-hide").addClass(frstTab == neededTabs[n] ? "active" : "");
                    if (neededTabs.length === 1 || frstTab === neededTabs[n]) this._hotelForm.removeClass("g-hide");

                    this.dataWork.hotelCityFinderData = this.dataWork.hotelCityFinderData();
                    this.dataWork.hotelCityFinderData.initialize();

                    this.hotelBind();

                    if (this._o.projectUrl !== "/")
                        this._hotelForm.attr("method", "POST")
                            .attr("action", this.extra.remoteUrl() + "/Hotels/ModuleSearch")
                            .attr("target", this._o.formTarget || "_blank");
                    break;
            }
        }
        this.bind();

        this.dataWork.setDefaults(this._o);
    }
    //-----------------------------------------
};
(function ($) {
    $.fn.rezOnForm = function (o) {
        var form = this;
        var object = form.data('rezOnForm');
        if (!object) {
            object = new rezOnForm();

            object.extendOptions(o);
            form.data('rezOnForm', object);
        }
        rezOnForm.ModelInitialize(this, object, function (bindedForm) {
            form = $(bindedForm);
            form.data('rezOnForm', object);
            object.init(form, o || window.rezonOpt);
        });
    };
})(jQuery);

//-----------------------------------------
// Статические свойства / методы
//----------------------------------------
rezOnForm.static = {};

rezOnForm.static.prepareAviaSearchParams = function (params) {
    if (params.defaultDateThere != undefined && params.defaultDateThere != null && params.defaultDateThere.trim() != '') {
        var dateThere = new Date(params.defaultDateThere);
        params.defaultDateThere = dateThere;
    }
    if (params.defaultDateBack != undefined && params.defaultDateBack != null && params.defaultDateBack.trim() != '') {
        var dateBack = new Date(params.defaultDateBack);
        params.defaultDateBack = dateBack;
    }
    if (params.multyRoutes !== undefined && params.multyRoutes !== null && params.multyRoutes.length > 0) {
        for (var i = 0; i < params.multyRoutes.length; i++) {
            if (params.multyRoutes[i].defaultDateThere !== undefined && params.multyRoutes[i].defaultDateThere !== null && params.multyRoutes[i].defaultDateThere.trim() != '') {
                var dateThere = new Date(params.multyRoutes[i].defaultDateThere);
                params.multyRoutes[i].defaultDateThere = dateThere;
            }
            if (params.multyRoutes[i].minDate !== undefined && params.multyRoutes[i].minDate !== null && params.multyRoutes[i].minDate.trim() != '') {
                var minDate = new Date(params.multyRoutes[i].minDate);
                params.multyRoutes[i].minDate = minDate;
            }

        }
    }
    return params;
}

rezOnForm.static.prepareRailSearchParams = function (params) {
    if (params.dateThere !== undefined && params.dateThere !== null && params.dateThere.trim() !== '') {
        var dateThere = new Date(params.dateThere);
        params.dateThere = dateThere;
    }
    if (params.dateBack !== undefined && params.dateBack !== null && params.dateBack.trim() !== '') {
        var dateBack = new Date(params.dateBack);
        params.dateBack = dateBack;
    }
    return params;
}

rezOnForm.static.prepareBusSearchParams = function (params) {
    if (!!params.dateThere && params.dateThere.trim() !== '')
        params.dateThere = new Date(params.dateThere);

    if (!!params.dateBack && params.dateBack.trim() !== '')
        params.dateBack = new Date(params.dateBack);

    if (!!params.CityFrom)
        params.cityFrom = new CityItem(params.CityFrom.Id, params.CityFrom.Name, params.CityFrom.CountryCode, params.CityFrom.CountryName);

    if (!!params.CityTo)
        params.cityTo = new CityItem(params.CityTo.Id, params.CityTo.Name, params.CityTo.CountryCode, params.CityTo.CountryName);

    if (!!params.ticketCount) {
        params.passenger = new PassItem("psgAdultsCnt", "PASS_CAT_ADT", "PASS_CAT_ADT_DESC", params.ticketCount);
    }
    if (!!params.formType)
        if (params.formType.Value === "roundTrip")
            params.formType = types[1];
        else
            params.formType = types[0];

    return params;
}


rezOnForm.static.prepareHotelSearchParams = function (params) {
    if (!!params.CheckIn && params.CheckIn.trim() !== "")
        params.checkIn = new Date(params.CheckIn);

    if (!!params.CheckOut && params.CheckOut.trim() !== "")
        params.checkOut = new Date(params.CheckOut);

    if (!!params.City)
        params.city = new HotelCityItem(params.City.Id, params.City.Name, params.City.CountryCode);

    if (!!params.Adults)
        params.adults = params.Adults;

    if (!!params.HistoryGuid && params.HistoryGuid.trim() !== "")
        params.historyGuid = params.HistoryGuid;

    return params;
}

rezOnForm.staticCountriesData = function (remoteUrl) {
    return new Bloodhound({
        datumTokenizer: function (datum) {
            return Bloodhound.tokenizers.whitespace(datum.label + " " + datum.code);
        },
        limit: 1000,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url: remoteUrl + '/HelperAsync/LookupCountries?v=3',
            filter: function (list) {
                return list;
            }
        }
    });
}

rezOnForm.staticGalSubstringMatcher = function (strs) {
    return function findMatches(q, cb) {
        var matches, substrRegex;
        matches = [];
        substrRegex = new RegExp(q, 'i');
        $.each(strs, function (i, str) {
            for (var key in str) {
                if (str.hasOwnProperty(key)) {
                    if (substrRegex.test(str[key])) {
                        matches.push(str);
                        break;
                    }
                }
            }
        });
        cb(matches);
    };
};

rezOnForm.static.isInIframe = function () {
    var isInIframe = window.parent != undefined && window.parent != window && window.parent.postMessage;
    return isInIframe;
}
rezOnForm.static.recalculateHeightOnOpen = function (el, offset, height) {
    var elHeight = height || el.height();
    var topOffset = offset || el.offset().top;
    var bodyHeight = elHeight + topOffset;
    $('body').css({ 'min-height': bodyHeight + 'px' });
}
rezOnForm.static.recalculateHeightOnClose = function () {
    $('body').css({ 'min-height': 'inherit' });
}

//-----------------------------------------

rezOnForm.ModelInitialize = function (form, formObject, callback) {

    var options = formObject._o;
    var localeDict = formObject._locale;
    options.localeDict = localeDict;

    //Decode default IATA codes
    var aviData = [options.avia.defaultAirportFrom, options.avia.defaultAirportTo];

    var iataToDecode = $.map(aviData, function (val, i) {
        if (val !== undefined && val !== null && val.trim() !== '') {
            return val;
        }
    });
    $.unique(iataToDecode);

    if (iataToDecode.length > 0) {
        var dataToSend = iataToDecode.join();
        var params = { iata_codes: dataToSend };
        $.getJSON(options.projectUrl + options.defaultLang + '/HelperAsync/GetAirport?' + $.param(params), function (data) {
            var result = JSON.parse(data);

            $.each(result, function (index, value) {

                if (value !== undefined && value !== null) {
                    var aviItem = new AirportItem(value.IataCode, value.CountryCode, value.CountryName, value.Airport);
                    if (aviItem.IataCode.substring(0, 3) == options.avia.defaultAirportFrom) {
                        options.avia.aviFrom = aviItem;

                    }
                    if (aviItem.IataCode.substring(0, 3) == options.avia.defaultAirportTo) {
                        options.avia.aviTo = aviItem;
                    }
                }
            });
        });
    }

    //Get defaultDatepickerSettings settings for Datepicker from Datepicker.js
    var datepickerSetting = defaultDatepickerSettings;
    var defaultComp =
    {
        template: datepickerSetting.template,
        props: datepickerSetting.props,
        data: datepickerSetting.data,
        mounted: datepickerSetting.mounted,
        watch: datepickerSetting.watch,
        computed: datepickerSetting.computed,
        methods: datepickerSetting.methods
    }

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
                    this.item = newValue;

                    var comp = this;
                    Vue.nextTick(function () {
                        //Update typeahead
                        var el = comp.$el;
                        var selector = comp.inputClass;
                        $(el).find('.' + selector).typeahead('val', newValue.Airport);
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
            updateAviItem: function (newValue) {
                this.item = newValue;
                this.$emit('input', this.item);
            },
            bridgeClearMapPoint: function () {
                if (this.inputClass == "book-from") {
                    $(document).trigger("StartPtChange.MapBridge", [undefined])
                } else {
                    $(document).trigger("EndPtChange.MapBridge", [undefined])
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
                    $(el).find('.' + selector).typeahead('val', '');
                    comp.bridgeClearMapPoint();
                });
            },
            checkItem: function (event) {
                if (event.key !== "Enter" && event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") {
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

    Vue.component('railwayInput', {
        template:
            '<div class="inside">' +
            '<input type="text" :class="inputClasses" v-model="item.Name" data-local="true" @keyup="checkItem" data-localPlaceholder="RAILWAY_PLACEHOLDER" :placeholder="placeholder"/>' +
            '<div v-if="item.Code != 0" class="express">' + '{{item.Code}}' + '</div>' +
            '<span href="#" class="delete" :class="{\'no-visiblity\':item.Name==null}" v-on:click="clearItem()"></span>' +
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
                    $(el).find('.' + selector).typeahead('val', '');
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

    Vue.component('busesInput', {
        template: ' <div class="inside">' +
            '<input type="text" :class="inputClasses" v-model="item.Name" data-local="true" data-localPlaceholder="BUSES_PLACEHOLDER" :placeholder="placeholder"/>' +
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
                    $(el).find('.' + selector).typeahead('val', '');
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
            vue.$on("cityUpdate", function (name, city) {
                if (comp.name === name) {
                    comp.updateBusItem(city);
                }
            });
        }
    });

    Vue.component("hotelInput", {
        template: ' <div class="inside">' +
            '<input type="text" :class="inputClasses" v-model="item.Name" data-local="true" data-localPlaceholder="HOTEL_PLACEHOLDER" :placeholder="placeholder"/>' +
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
                this.item = new CityItem();
                this.$emit("input", this.item);
                var comp = this;
                Vue.nextTick(function () {
                    //Update typeahead
                    var el = comp.$el;
                    var selector = comp.inputClass;
                    $(el).find("." + selector).typeahead("val", "");
                });
            },
            checkItem: function (event) {
                if (event.key !== "Enter" && event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                    this.item.Code = "";
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


    //Datepicker component
    Vue.component('datepicker', {
        mixins: [defaultComp],
        computed: {
            highlighted: function () {
                var highlighted = {};

                switch (vue.formType) {
                    case "avia":
                        if (vue.avia.formType.value === 'roundtrip') {
                            highlighted = {
                                from: this.dateFrom,
                                to: this.dateTo
                            }
                        }
                        break;
                    case "railway":
                        if (vue.railway.formType.value === 'roundtrip') {
                            highlighted = {
                                from: this.dateFrom,
                                to: this.dateTo
                            }
                        }
                        break;
                    case "buses":
                        if (vue.buses.formType.value === "roundtrip") {
                            highlighted = {
                                from: this.dateFrom,
                                to: this.dateTo
                            }
                        }
                        break;
                    case "hotel":
                        highlighted = {
                            from: this.dateFrom,
                            to: this.dateTo
                        }
                        break;
                }
                return highlighted;
            },
            disabled: function () {
                var disabled = {};
                switch (vue.formType) {
                    case "avia":
                        disabled = {
                            to: this.minDate !== undefined ? this.minDate : vue.dates.airMinDate,
                            from: this.maxDate !== undefined ? this.maxDate : vue.dates.airMaxDate
                        }
                        break;
                    case "railway":
                        disabled = {
                            to: this.minDate !== undefined ? this.minDate : vue.dates.trainsMinDate,
                            from: this.maxDate !== undefined ? this.maxDate : vue.dates.trainsMaxDate
                        }
                        break;
                    case "buses":
                        disabled = {
                            to: this.minDate !== undefined ? this.minDate : vue.dates.busesMinDate,
                            from: this.maxDate !== undefined ? this.maxDate : vue.dates.busesMaxDate
                        }
                        break;
                    case "hotel":
                        disabled = {
                            to: this.minDate !== undefined ? this.minDate : vue.dates.hotelMinDate,
                            from: this.maxDate !== undefined ? this.maxDate : vue.dates.hotelMaxDate
                        }
                        break;
                }
                return disabled;
            }
        },
        props: {
            dateFrom: {
                type: Date
            },
            dateTo: {
                type: Date
            },
            minDate: {
                type: Date
            },
            maxDate: {
                type: Date
            }
        },
        created: function () {
            var comp = this;
            this.$on('opened', function () {
                var el = $(comp.$el);
                formObject.extra.openField(el);
                var calendarClass = 'vdp-datepicker__calendar';
                Vue.nextTick(function () {
                    var popup = el.find('.' + calendarClass + ":visible");
                    rezOnForm.static.recalculateHeightOnOpen(popup);
                    typeof (updatingHeight) !== 'undefined' && updatingHeight();
                });
            });
            this.$on('closed', function () {
                var el = $(comp.$el);
                formObject.extra.closeField(el);
                rezOnForm.static.recalculateHeightOnClose();
                typeof (updatingHeight) !== 'undefined' && updatingHeight();
            });

            this.$on('selected', function () {
                comp.initialViewRewrited = !!comp.selectedDate ? "day" : comp.initialView;

                Vue.nextTick(function () {
                    var isMobile = formObject.extra.mobileAndTabletcheck() && window.innerWidth <= 575;
                    if (comp.name === 'book_from_date' && comp.highlighted.to !== undefined && comp.highlighted.to !== null && !isMobile) {
                        var el = $(comp.$el);
                        var nextDatePick = el.closest('.fields-container').find('.date.to').find("input[name='book_to_date']");

                        setTimeout(function () {
                            nextDatePick.focus();
                        }, 100);
                    }
                });
            });

        },
        mounted: function () {
            var el = this.$el;
            var comp = this;
            var datePicker = $(el).closest('.control-field')[0];
            formObject.extra.swipeDetect(datePicker, function (swipedir) {
                switch (swipedir) {
                    case 'left':
                        if (comp.showDayView) {
                            comp.nextMonth();
                        }
                        else if (comp.showMonthView) {
                            comp.nextYear();
                        }
                        else if (comp.showYearView) {
                            comp.nextDecade();
                        }
                        break;
                    case 'right':
                        if (comp.showDayView) {
                            comp.previousMonth();
                        }
                        else if (comp.showMonthView) {
                            comp.previousYear();
                        }
                        else if (comp.showYearView) {
                            comp.previousDecade();
                        }
                        break;
                }
            });
            Vue.nextTick(function () {
                // DOM updated
                $(comp.$el).find("[name='" + comp.name + "']").keydown(function (e) {
                    //Tab press
                    if (e.keyCode == 9) comp.close();
                });
            });
        }
    });
    var mixin = {
        data: options
    };
    var formBind = new Vue({
        el: form[0],
        mixins: [mixin],
        //data: options,
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
            trainsMinDate: function () {
                var trainsMinDate = new Date(this.today.getTime());
                return trainsMinDate;
            },
            trainsMaxDate: function () {
                var trainsMaxDate = new Date(this.today.getTime());
                trainsMaxDate.setDate(trainsMaxDate.getDate() + this.railway.maxSearchDayDepth);
                return trainsMaxDate;
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
            hotelMinDate: function () {
                return new Date(this.today.getTime());
            },
            hotelMaxDate: function () {
                var maxDate = new Date(this.today.getTime());
                maxDate.setDate(maxDate.getDate() + 30);
                return maxDate;
            },
            hotelDefaultCheckIn: function () {
                var defaultCheckIn = new Date();
                defaultCheckIn.setDate(defaultCheckIn.getDate() + 7);
                return defaultCheckIn;
            },
            hotelDefaultCheckOut: function () {
                var defaultCheckOut = new Date();
                defaultCheckOut.setDate(defaultCheckOut.getDate() + 14);
                return defaultCheckOut;
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
            //Avia methods
            typeChanged: function (index) {
                //0-oneway,1-roundtrip,2-route
                this.avia.formType = types[index];
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
            },
            updateHtmlElements: function () {
                //Update displayed value for selectpickers
                $('.selectpicker').each(function () {
                    var option = $(this).find("input:radio:checked").closest('.option');
                    $(this).find(".selected-value:first").find("span:first").html(
                        option.find("span:first").html()
                    );
                });
                //Disable checkbox
                $('input[type="checkbox"]:checked').trigger('click');
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
                    model.updateHtmlElements();
                });
            },
            locale: function (str) {
                var loc = this.localeDict[this.defaultLang] !== undefined && this.localeDict[this.defaultLang] !== null ? this.localeDict[this.defaultLang][str] : this.localeDict['en'][str];
                return loc || str;
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
            removeBusPassenger: function () {
                this.buses.passenger.count--;
                if (this.buses.passenger.count <= 0)
                    this.buses.passenger.count = 1;
            },
            addBusPassenger: function () {
                this.buses.passenger.count++;
            },
            toggleClass: function (e) {
                $(e.currentTarget).children('.option_box').toggleClass('open');
                $(e.currentTarget).children('.value_tag').toggleClass('rotate');
            },
            toggleClassChild: function (e) {
                $(e.currentTarget).next().toggleClass('open');
                $(e.currentTarget).toggleClass('rotate');
            },
            fieldOption: function (e) {
                var num = $(e.target).text();
                this.hotel.adults = parseInt(num);
            },
            stopClick: function (e) {
                e.stopPropagation();
            },
            childOption: function (e) {
                var text = $(e.target).text();
                var value = text.replace(/[^-0-9]/gim, '');

                var child = $(e.currentTarget).closest('.children_box-item').find('.number_val').attr('child');
                this.hotel.childs[parseInt(child) - 1] = value;

                $(e.currentTarget).closest('.children_box-item').find('.number_val').html(text);
                $('.children_age').removeClass('open');
                $('.children_input').removeClass('rotate');

                $('.select_box .input_quantity').val(this.hotel.childs);
            },
            passUpdate: function () {
                var currCount = 0;
                var adultCnt = 0;
                var infantCnt = 0;
                this.avia.passengers.messages = [];
                this.avia.passengers.hasError = false;
                var adultsCat = ["psgAdultsCnt", "psgOldCnt", "psgYouthCnt"];
                var infantsCat = ["psgInfantsCnt", "psgInfantsNSCnt"];
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

                $(document).trigger("StartPtChange.MapBridge", [from])
                $(document).trigger("EndPtChange.MapBridge", [to])
            },
            //Railway methods
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
            //Buses methods
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

            //Hotel methods
            changeHotelFormExtended: function () {
                this.hotel.formExtended = !this.hotel.formExtended;
            },
            updateHotelCityTypeAhead: function (name, data) {
                var cityItem = new HotelCityItem(data.Id, data.Name, data.CountryCode);
                vue.$emit("hotelCityUpdate", name, cityItem);
            },
            clearHotelForm: function () {
                this.hotel.checkIn = this.hotelDefaultCheckIn;
                this.hotel.checkOut = this.hotelDefaultCheckOut;
                this.hotel.cityFrom = new HotelCityItem();
                this.hotel.cityTo = new HotelCityItem();
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
            }
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
            },
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
            }
        },
        created: function () {
            //Global variable
            this.dates.airMinDate = this.airMinDate;
            this.dates.airMaxDate = this.airMaxDate;
            this.dates.trainsMinDate = this.trainsMinDate;
            this.dates.trainsMaxDate = this.trainsMaxDate;
            this.dates.busesMinDate = this.busesMinDate;
            this.dates.busesMaxDate = this.busesMaxDate;
            this.dates.hotelMinDate = this.hotelMinDate;
            this.dates.hotelMaxDate = this.hotelMaxDate;
            if (this.formType === 'avia') {
                if (!this.avia.defaultDateThere) this.avia.defaultDateThere = this.aviaDefaultDateThere;
                if (!this.avia.defaultDateBack) this.avia.defaultDateBack = this.aviaDefaultDateBack;
            }
            if (this.formType === 'railway' && !this.hasRailResult()) {
                this.railway.dateThere = this.railwayDateThere;
                this.railway.dateBack = this.railwayDateBack;
            }
            if (this.formType === 'buses') {
                if (!this.buses.dateThere) this.buses.dateThere = this.busesDefaultDateThere;
                if (!this.buses.dateBack) this.buses.dateBack = this.busesDefaultDateBack;
                else if (this.buses.dateBack < this.buses.dateThere)
                    this.buses.dateBack = this.buses.dateThere;
            }
            if (this.formType === "hotel") {
                if (!this.hotel.checkIn) this.hotel.checkIn = this.hotelDefaultCheckIn;
                if (!this.hotel.checkOut) this.hotel.checkOut = this.hotelDefaultCheckOut;
                else if (this.hotel.checkOut < this.hotel.checkIn)
                    this.hotel.checkOut = this.hotel.checkIn;
            }

            window.vue = this;
            this.passUpdate();
        },
        mounted: function () {
            var el = this.$el;
            Vue.nextTick(function () {
                !!callback && typeof (callback) === "function" && callback(el);
                typeof (updatingHeight) !== 'undefined' && updatingHeight();
                $('.unload').removeClass('unload');
            });
        },
        updated: function () {
            Vue.nextTick(function () {
                typeof (updatingHeight) !== 'undefined' && updatingHeight();
            });
        }
    });
};
