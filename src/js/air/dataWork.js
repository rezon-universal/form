module.exports = class dataWork {
    constructor(form, it){
        this.form = form;
        this.it = it;

        this.airportFinderData = this.airportFinderData();
        this.airportFinderData.initialize();

        this.carriersData = this.carriersData();
        this.carriersData.initialize();
    }

    airportFinderData() {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: this.it.extra.remoteUrl() + '/HelperAsync/Lookup?query=',
                rateLimitWait: 10,
                replace: function (url, query) {
                    return url + encodeURIComponent(query.replace(/[^a-zA-Zа-яА-ЯіїІЇ0-9\s,]{1}/g, "_"));
                },
                filter: function (data) {
                    return data;
                }
            }
        });
    }
    carriersData() {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.label + " " + datum.code);
            },
            limit: 1000,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: this.it.extra.remoteUrl() + '/HelperAsync/GetAirCompanies?v=2',
                filter: function (list) {
                    return list;
                }
            }
        });
    }
}