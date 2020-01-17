module.exports = class dataWork {
    constructor(form, it){
        this.form = form;
        this.it = it;

        //Obsolete, to remove
        this.airportFinderData = this.airportFinderData();
        this.airportFinderData.initialize();

        this.airportsCitiesFinderDataTimer = undefined;

        this.carriersData = this.carriersData();
        this.carriersData.initialize();
    }

    //Obsolete, to remove
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
    airportsCitiesFinderData(query, asyncResults) {
        this.airportsCitiesFinderDataTimer && clearTimeout(this.airportsCitiesFinderDataTimer);

        let url = this.it.extra.remoteUrl() + '/HelperAsync/Lookup?query=';
        if (window.ab === 'b') {
            url = this.it.extra.remoteUrl() + '/HelperAsync/Lookup2?query=';
        }
        
        this.airportsCitiesFinderDataTimer = setTimeout(function() {
            $.ajax({
                url : url + encodeURIComponent(query),
                dataType: 'json',
                success: function(data) {
                    asyncResults(data);
                }
            });
        }, 200);

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