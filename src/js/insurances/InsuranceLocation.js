module.exports = class InsuranceLocation {
    constructor(location) {
        if (!location) return;   
        
        this.Name = location.Name;
        this.CountryCode = location.CountryCode;
    }
};