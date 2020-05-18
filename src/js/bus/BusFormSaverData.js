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
            
            this.date = super.dateTimeToString(busOptions.Date);
            this.dateBack = super.dateTimeToString(busOptions.BackDate);
            this.formType = busOptions.formType;
        }
    }

    IsSame(obj) {
        return obj.locationFrom.Id === this.locationFrom.Id
            && obj.locationTo.Id === this.locationTo.Id;
    }
    get IsValidForSave() {
        return super.parseDateTime(this.date) > new Date();
    }

    Select() {
        
        let busOptions = this.formModule.options.buses;
        
        busOptions.LocationFrom = new BusLocation(this.locationFrom);
        busOptions.LocationTo = new BusLocation(this.locationTo);
        
        busOptions.formType = this.formType;
        
        busOptions.Date = this.parseDateTime(this.date);
        if (this.formType.value === 'roundtrip') {
            busOptions.dateBack = this.parseDateTime(this.dateBack);
        }
    }
}