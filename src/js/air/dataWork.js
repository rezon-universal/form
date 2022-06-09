module.exports = class dataWork {
    constructor(form, it){
        this.form = form;
        this.it = it;

        this.airportsCitiesFinderDataTimer = undefined;
    }

    airportsCitiesFinderData(query, asyncResults) {
        this.airportsCitiesFinderDataTimer && clearTimeout(this.airportsCitiesFinderDataTimer);
        if (query === "" && !this.it._o.avia.onlySpecificAirportsInDropdown) {
            //Не отправляем пустой запрос на сервер (при открытии на мобильном устройстве)
            return;
        }
        const url = this.it.extra.remoteUrl() + '/HelperAsync/Lookup?query=';
        const route = this.it._o.avia.formType.value;
        this.airportsCitiesFinderDataTimer = setTimeout(function() {
            $.ajax({
                url : url + encodeURIComponent(query) + "&route=" + encodeURIComponent(route),
                dataType: 'json',
                success: function(data) {
                    asyncResults(data);
                }
            });
        }, 200);
    }
}