module.exports = class formModuleBase {
    constructor(form, options, it) {
        this.form = form;
        this.options = options;
        this.it = it;
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
}