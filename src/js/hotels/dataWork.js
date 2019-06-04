module.exports = class dataWork {
    constructor(form, it){
        this.form = form;
        this.it = it;

        this.hotelCityFinderData = this.hotelCityFinderData();
        this.hotelCityFinderData.initialize();

        this.countriesData = this.countriesData();
        this.countriesData.initialize();

    }

    hotelCityFinderData() {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: this.it.extra.remoteUrl() + '/HelperAsync/LookupHotels?query=',
                rateLimitWait: 10,
                replace: function (url, query) {
                    return url + encodeURIComponent(query.replace(/[^a-zA-Zа-яА-ЯіїІЇ0-9]{1}/g, "_"));
                },
                filter: function (data) {
                    return data;
                }
            }
        });
    }
    countriesData () {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.label + " " + datum.code);
            },
            limit: 1000,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: this.it.extra.remoteUrl() +  '/HelperAsync/LookupCountries?v=4',
                filter: function (list) {
                    return list;
                }
            }
        });
    }
}