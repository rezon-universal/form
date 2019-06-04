module.exports = class AirportItem {
    constructor(iataCode, countryCode, countryName, airport){
        this.Airport = airport;
        this.CountryCode = countryCode;
        this.CountryName = countryName;
        this.IataCode = iataCode;
    }
};