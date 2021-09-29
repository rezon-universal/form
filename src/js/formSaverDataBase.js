module.exports = class FormSaverDataBase {
    constructor (formModule) {
        this.lang = formModule.options.defaultLang;

        //https://stackoverflow.com/a/7437817/2114398
        //Делаем свойство formModule приватным, что бы нельзя было экспортировать
        Object.defineProperty(this, 'formModule', {
            value: formModule,
            writable:true,
            configurable:true
        });
    }
    //Распарсить дату
    parseDateTime (strs) {
        let checkDateParts = function(day, month, year) {
            if (year < 1500 || year > 2500) return false;
            if (month <= 0 || month > 12) return false;

            var maxDayInMonth = new Date(year, month, 0).getDate();
            if (day <= 0 || day > maxDayInMonth) return false;

            return true;
        }
        if (strs == undefined) return undefined;
        if (strs.length < 10) return undefined;
        //31.10.2014
        var dateParts = strs.split(".");
        
        var day = dateParts.length > 2 ? dateParts[0] : -1;
        var month = dateParts.length > 2 ? dateParts[1] : -1;
        var year = dateParts.length > 2 ? dateParts[2] : -1;

        return checkDateParts(day, month, year) ? new Date(year, month - 1, day) : undefined;
    }
    parseDateTimes (strs) {
        return [...new Set((strs || "").split('|'))].map(x=> this.parseDateTime(x)).filter(x=> !!x);
    }
    //Преобразовать дату в dd.MM.yyyy
    dateTimeToString (dateTime) {
        var dd = dateTime.getDate();
        var mm = dateTime.getMonth() + 1;

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return dd + '.' + mm + '.' + dateTime.getFullYear();
    }
    dateTimesToString (array) {
        if (!array) return undefined;
        return array.map(x=> this.dateTimeToString(x)).join("|");
    }
    formatDate(date) {
        let aliases = ["JANUARY_SHORT", "FEBRUARY_SHORT", "MARCH_SHORT", "APRIL_SHORT", "MAY_SHORT", "JUNE_SHORT", "JULY_SHORT", "AUGUST_SHORT", "SEPTEMPER_SHORT", "OCTOBER_SHORT", "NOVEMBER_SHORT", "DECEMBER_SHORT"];
        return date.getDate() + " " + this.formModule.it.extra.locale(aliases[date.getMonth()]).toLowerCase();
    }
    //Является ли элемент истории "таким же"
    IsSame(obj) {
        return obj === this;
    }
    //Скопировать все поля из кастомного объекта в этот
    Assign(fromObject) {
        Object.assign(this, fromObject);
    }
    //Заполнить этим элементом форму
    Select() {

    }
    //Валиден ли элемент истории (дата не прошла)
    get IsValidForSave() {
        return true;
    }
};