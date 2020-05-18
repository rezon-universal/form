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
    datepickerGetHighlight(datepicker) {
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
}