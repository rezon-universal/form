const FormSaverDataBase = require('./../FormSaverDataBase');

const InsuranceLocation = require('./InsuranceLocation');

module.exports = class InsurancesFormSaverData extends FormSaverDataBase {
    constructor(formModule) {
        super(formModule);

        if (formModule) 
        {
            let insurancesOptions = formModule.options.insurances;
            
            this.location = new InsuranceLocation(insurancesOptions.Location);
            this.dateFrom = super.dateTimesToString(insurancesOptions.DateFrom);
            this.dateTo = super.dateTimesToString(insurancesOptions.DateTo);
        }
    }

    IsSame(obj) {
        return obj.location.CountryCode === this.location.CountryCode;
    }
    get IsValidForSave() {
        return super.parseDateTimes(this.dateFrom)[0] > new Date();
    }

    Select() {
        
        let insurancesOptions = this.formModule.options.insurances;
        
        insurancesOptions.Location = new InsuranceLocation(this.location);
        insurancesOptions.DateFrom = this.parseDateTimes(this.dateFrom);
        insurancesOptions.DateTo = this.parseDateTimes(this.dateTo);
    }
}