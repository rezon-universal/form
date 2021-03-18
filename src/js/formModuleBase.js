const FormSaver = require('./formSaver');
module.exports = class formModuleBase {
    constructor(form, options, it) {
        this.form = form;
        this.options = options;
        this.it = it;
        this.formSaver = new FormSaver(this);
    }
    //Получить настройки по-умолчанию
    getExtendedOptions()
    {
        return {};
    }
    //Получение ссылки на внешнюю форму, куда отправлять данные
    getFormRemoteUrl() {
        throw new Error("Please, provide form remote url.");
    }
    //Получить объект для сохранения формы
    getFormSaver() {

    }
    //Получить подсвеченные даты в датапикере
    datepickerGetHighlight() {
        return {};
    }
    //Установка запрещенных дат в датапикере
    datepickerGetDisabled(datepicker) {
        return {};
    }
    //Датапикер - выбрано значение (event)
    datepickerSelected(datepicker) {

    }

    //Подключение Vue
    bindVue(bindTo, mountedCallback) {

    }
    //Инициализация модуля, вызывается после подключения Vue
    bind() {

    }
    //Загрузка данных в FormSaver-e
    bindFormSaver() {
        this.formSaver.loadAllFromStorage();
    }
    //Получение текущего объекта с формой (для сохранения формы)
    getCurrentFormData() {
        return undefined;
    }
    //Получение название типа для сохранения формы
    getCurrentFormDataName() {
        //.constructor.name имя класса нельзя использовать, т.к. при минификации имя класса превращается в тыкву
        return 'undefined';
    }
    //Получение объекта Vue при инициализации (используется как миксин)
    getVueBase(mountedCallback){
        var local = this;
        //Vue-js по-умолчанию для всех форм
        return {
            data: this.options,
            computed: {
            },
            methods: {
                locale: this.it.extra.locale
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
                Vue.nextTick(() => {
                    local.it.extra.updateIframeHeight();
                });
            }
        };
    }
}