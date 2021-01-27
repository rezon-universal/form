module.exports = class pricesCalendarBase {
    constructor(it, options, vue) {
        this.it = it;
        this.options = options;
        this.vue = vue;
        this.cache = {};
    }
    async fetchCached(data){
        let cacheHash = this.getHashCodeOfObject(data);
        let d = this.cache[cacheHash];
        if (!d) {
            d = await this.fetch(data); 
            this.cache[cacheHash] = d || {};
        }
        return d;
    }
    async fetch(data) {
        try {
            const request = new Request(this.Url, {
                method: 'POST',
                body: JSON.stringify(data),
                bodyUsed: true
            });
            const response = await fetch(request);
            return await response.json();
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    getHashCodeOfObject(data){
        return this.getHashCode(JSON.stringify(data));
    }
    getHashCode(stringData){
        let hash = 0, i, chr;
        for (i = 0; i < stringData.length; i++) {
            chr   = stringData.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
};