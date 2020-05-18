const FormSaverDataBase = require('./../FormSaverDataBase');

const StationItem = require('./StationItem');

module.exports = class RailFormSaverData extends FormSaverDataBase {
    constructor(formModule) {
        super(formModule);

        if (formModule) {
            let railOptions = formModule.options.railway;

            this.stationFrom = new StationItem(railOptions.stationFrom.Code, railOptions.stationFrom.Name, railOptions.stationFrom.CountryCode, railOptions.stationFrom.CountryName);
            this.stationTo = new StationItem(railOptions.stationTo.Code, railOptions.stationTo.Name, railOptions.stationTo.CountryCode, railOptions.stationTo.CountryName);
            
            this.formType = railOptions.formType;

            this.dateThere = super.dateTimeToString(railOptions.dateThere);
            if (this.formType.value === 'roundtrip') {
                this.dateBack = super.dateTimeToString(railOptions.dateBack);
            }
        }
    }

    IsSame(obj) {
        return obj.stationFrom.Code === this.stationFrom.Code
            && obj.stationTo.Code === this.stationTo.Code;
    }
    get IsValidForSave() {
        return super.parseDateTime(this.dateThere) > new Date();
    }
    
    formatStation(stationName) {
        return stationName.split(" (")[0] || stationName;
    }
    Select() {
        
        let railOptions = this.formModule.options.railway;
        
        railOptions.stationFrom = new StationItem(this.stationFrom.Code, this.stationFrom.Name, this.stationFrom.CountryCode, this.stationFrom.CountryName);
        railOptions.stationTo = new StationItem(this.stationTo.Code, this.stationTo.Name, this.stationTo.CountryCode, this.stationTo.CountryName);

        railOptions.formType = this.formType;
        railOptions.dateThere = this.parseDateTime(this.dateThere);
        if (this.formType.value === 'roundtrip') {
            railOptions.dateBack = this.parseDateTime(this.dateBack);
        }

    }
}