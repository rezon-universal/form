const FormSaverDataBase = require('./../FormSaverDataBase');

const AirportItem = require('./AirportItem');

module.exports = class AirFormSaverData extends FormSaverDataBase {
    constructor(formModule) {
        super(formModule);

        if (formModule) {
            let airOptions = formModule.options.avia;

            this.aviFrom = new AirportItem(airOptions.aviFrom.IataCode, airOptions.aviFrom.CountryCode, airOptions.aviFrom.CountryName, airOptions.aviFrom.Airport);
            this.aviTo = new AirportItem(airOptions.aviTo.IataCode, airOptions.aviTo.CountryCode, airOptions.aviTo.CountryName, airOptions.aviTo.Airport);
            this.dateThere = super.dateTimesToString(airOptions.dateThere);
            this.dateBack = super.dateTimesToString(airOptions.dateBack);
            this.formType = airOptions.formType;

            this.passengersTypes = { };
            
            airOptions.passengers.types.forEach(type => {
                this.passengersTypes[type.name] = type.count;
            });
        }
    }

    IsSame(obj) {
        return obj.aviFrom.IataCode === this.aviFrom.IataCode
            && obj.aviTo.IataCode === this.aviTo.IataCode;
    }
    get IsValidForSave() {
        return (this.formType.value === 'oneway' || this.formType.value === 'roundtrip')
            && super.parseDateTimes(this.dateThere)[0] > new Date();
    }

    formatAirport(airport) {
        return (airport.split(" (")[0] || airport).split(",")[0] || airport;
    }
    Select() {
        
        let airOptions = this.formModule.options.avia;
        
        airOptions.aviFrom = new AirportItem(this.aviFrom.IataCode, this.aviFrom.CountryCode, this.aviFrom.CountryName, this.aviFrom.Airport);
        airOptions.aviTo = new AirportItem(this.aviTo.IataCode, this.aviTo.CountryCode, this.aviTo.CountryName, this.aviTo.Airport);
        airOptions.formType = this.formType;
        airOptions.dateThere = this.parseDateTimes(this.dateThere);
        if (this.formType.value === 'roundtrip') {
            airOptions.dateBack = this.parseDateTimes(this.dateBack);
        }
        let it = this;
        airOptions.passengers.types.forEach(type => {
            type.count = it.passengersTypes[type.name] || 0;
        });

    }
}