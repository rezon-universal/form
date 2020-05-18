const FormSaverDataBase = require('./../FormSaverDataBase');

const InsuranceLocation = require('./InsuranceLocation');

module.exports = class InsurancesFormSaverData extends FormSaverDataBase {
    constructor(formModule) {
        super(formModule);

        if (formModule) 
        {
            let insurancesOptions = formModule.options.insurances;
            
            this.location = new InsuranceLocation(insurancesOptions.Location);
            this.dateFrom = super.dateTimeToString(insurancesOptions.DateFrom);
            this.dateTo = super.dateTimeToString(insurancesOptions.DateTo);
        }
    }

    IsSame(obj) {
        return obj.location.CountryCode === this.location.CountryCode;
    }
    get IsValidForSave() {
        return super.parseDateTime(this.dateFrom) > new Date();
    }

    Select() {
        
        let insurancesOptions = this.formModule.options.insurances;
        
        insurancesOptions.Location = new InsuranceLocation(this.location);
        insurancesOptions.DateFrom = this.parseDateTime(this.dateFrom);
        insurancesOptions.DateTo = this.parseDateTime(this.dateTo);
    }
}