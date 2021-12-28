module.exports = class dataWork {
    constructor(form, it){
        this.form = form;
        this.it = it;

        this.insuranceLocationFinderData = this.insuranceLocationFinderData();
        this.insuranceLocationFinderData.initialize();
    }

    insuranceLocationFinderData() {
        return new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: `${this.it.extra.remoteUrl()}/HelperAsync/LookupInsurancesLocations?product=${this.it._o.widgetCode}&query=`,
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
}