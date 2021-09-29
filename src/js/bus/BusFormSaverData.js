const FormSaverDataBase = require('./../FormSaverDataBase');

const BusLocation = require('./BusLocation');

module.exports = class BusFormSaverData extends FormSaverDataBase {
    constructor(formModule) {
        super(formModule);

        if (formModule) 
        {
            let busOptions = formModule.options.buses;

            this.locationFrom = new BusLocation(busOptions.LocationFrom);
            this.locationTo = new BusLocation(busOptions.LocationTo);
            
            this.date = super.dateTimesToString(busOptions.Date);
            this.dateBack = super.dateTimesToString(busOptions.BackDate);
            this.formType = busOptions.formType;
        }
    }

    IsSame(obj) {
        return obj.locationFrom.Id === this.locationFrom.Id
            && obj.locationTo.Id === this.locationTo.Id;
    }
    get IsValidForSave() {
        return super.parseDateTimes(this.date)[0] > new Date();
    }

    Select() {
        
        let busOptions = this.formModule.options.buses;
        
        busOptions.LocationFrom = new BusLocation(this.locationFrom);
        busOptions.LocationTo = new BusLocation(this.locationTo);
        
        busOptions.formType = this.formType;
        
        busOptions.Date = this.parseDateTimes(this.date);
        if (this.formType.value === 'roundtrip') {
            busOptions.dateBack = this.parseDateTimes(this.dateBack);
        }
    }
}