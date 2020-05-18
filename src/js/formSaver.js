const AirFormSaverData = require('./air/AirFormSaverData');
const BusFormSaverData = require('./bus/BusFormSaverData');
const HotelFormSaverData = require('./hotels/HotelFormSaverData');
const InsurancesFormSaverData = require('./insurances/InsurancesFormSaverData');
const RailFormSaverData = require('./rail/RailFormSaverData');

module.exports = class formSaverBase {
    constructor(formModule) {
        this.module = formModule;
        this.historyData = this.module.options.historyData;
        this.historyDataForOtherLanguages = [];
    }
    get LocalStorageName() {
        return "historyDataOf" + this.module.getCurrentFormDataName();
    }
    loadAllFromStorage()
    {
        if (typeof(localStorage) === 'undefined') return;
        let data = localStorage.getItem(this.LocalStorageName);
        if (!data) return;
        let arr = JSON.parse(data);
        //Убираем из списка все поиски по прошедним датам

        //Мапим название класса и его тип
        let classes = {
           AirFormSaverData: AirFormSaverData,
           BusFormSaverData: BusFormSaverData,
           HotelFormSaverData: HotelFormSaverData,
           InsurancesFormSaverData: InsurancesFormSaverData,
           RailFormSaverData: RailFormSaverData
        };

        let needToReSave = false;
        arr.forEach(item => {
            //Из обычного объекта JS делаем нужный нам класс Данных (что бы подтянулись кастомные поля класса)
            let cl = new classes[this.module.getCurrentFormDataName()](this.module);
            cl.Assign(JSON.parse(item));

            if (cl.IsValidForSave) {
                if (cl.lang === this.module.options.defaultLang) {
                    //Текущий язык
                    this.historyData.push(cl);
                }else {
                    //Другой язык - оставляем но не отображаем
                    this.historyDataForOtherLanguages.push(cl);
                }
            }  
            else needToReSave = true;
        });
        if (needToReSave) this.saveAllToStorage();
    }
    saveAllToStorage() {
        if (typeof(localStorage) === 'undefined') return;
        
        let data = [];
        this.historyDataForOtherLanguages.concat(this.historyData).forEach(item =>
        {
            data.push(JSON.stringify(item));
        });
        localStorage.setItem(this.LocalStorageName, JSON.stringify(data));
    }
    saveNewItem(item) {
        if (!item || !item.IsValidForSave) return;

        this.historyData.unshift(item);
        //Удаляем дубликаты
        this.historyData.forEach((f, index) => {
            if (f === item) return;
            if (f.IsSame(item)) {
                //console.log('Slice duplicate item at index ' + index);
                this.historyData.splice(index, 1);
            }
        });
        
        if (this.historyData.length > 20) {
            this.historyData.pop();
        }

        this.saveAllToStorage();
    }
    selectItem(item) {
        if (!item || !item.IsValidForSave) return;
        item.Select();
    }
}