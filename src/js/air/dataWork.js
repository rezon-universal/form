module.exports = class dataWork {
    constructor(form, it){
        this.form = form;
        this.it = it;

        this.airportsCitiesFinderDataTimer = undefined;

        this.cacheAllowed = typeof (Storage) !== "undefined" && navigator.cookieEnabled;
    }

    airportsCitiesFinderData(query, asyncResults) {
        this.airportsCitiesFinderDataTimer && clearTimeout(this.airportsCitiesFinderDataTimer);
        if (query === "" && !this.it._o.avia.onlySpecificAirportsInDropdown) {
            //Не отправляем пустой запрос на сервер (при открытии на мобильном устройстве)
            return;
        }
        const url = this.it.extra.remoteUrl() + '/HelperAsync/Lookup?query=';
        const route = this.it._o.avia.formType.value;
        const path = encodeURIComponent(query) + "&route=" + encodeURIComponent(route);

        this.airportsCitiesFinderDataTimer = setTimeout(() => {
            let cacheDic;
            if (this.cacheAllowed) {
                cacheDic = this.loadCacheDictionary(url);
                if (!cacheDic) cacheDic = {};
                if (cacheDic[path]) {
                    asyncResults(cacheDic[path]);
                    return;
                }
            }

            $.ajax({
                url : url + path,
                dataType: 'json',
                cache: true,
                success: (data) => {
                    if (this.cacheAllowed) {
                        cacheDic[path] = data;
                        cacheDic = this.resetCacheDictionatyIfNeed(cacheDic);
                        this.saveCacheDictionary(url, cacheDic);
                    }
                    asyncResults(data);
                }
            });
        }, 200);
    }
    loadCacheDictionary(key) {
        try {
            let d = localStorage[key];
            return !!d ? $.parseJSON(localStorage[key]) : undefined;
        } catch (e) {
            console.log("Local storage error:", e);
        }
        return {};
    }
    resetCacheDictionatyIfNeed(object) {
        if (Object.keys(object).length > 500) return {};
        return object;
    }
    saveCacheDictionary(key, object) {
        try {
            localStorage.setItem(key, JSON.stringify(object));
        } catch (e) {
            console.log("Local storage error:", e);
        }
    }
}