module.exports = class dataWork {
    constructor(form, it){
        this.form = form;
        this.it = it;

        this.airportsCitiesFinderDataTimer = undefined;

        this.carriersData = this.carriersData();
        this.carriersData.initialize();
    }

    airportsCitiesFinderData(query, asyncResults) {
        this.airportsCitiesFinderDataTimer && clearTimeout(this.airportsCitiesFinderDataTimer);

        let url = this.it.extra.remoteUrl() + '/HelperAsync/Lookup?query=';
        
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