const pricesCalendarBase = require('./../pricesCalendarBase');
module.exports = class pricesCalendar extends pricesCalendarBase {
    get Url(){
        return this.it.extra.remoteUrl() + '/HelperAsync/GetAirCalendar';
    }
    get CityFrom (){
        return this.options.avia.aviFrom ? this.options.avia.aviFrom.IataCode : undefined;
    }
    get CityTo(){
        return this.options.avia.aviTo ? this.options.avia.aviTo.IataCode : undefined;
    }
    get RouteType(){
        return this.options.avia.formType.value;
    }
    load (type) {
        this.type = type;

        this.clear();
        if (!this.CityFrom || !this.CityTo) return;
        if (this.RouteType !== "oneway" && this.RouteType !== "roundtrip") return;
        this.setLoading(type, true);
        
        if (type === 'there') {
            this.fetchCached({
                From: this.CityFrom,
                To: this.CityTo,
                OnlyDirect: this.options.avia.filters.onlyDirectFlights
            }).then((value)=>{
                this.setLoading(type, false);
                this.setAttributes(type, value);
            });

        }else if (type === 'back'){
            this.fetchCached({
                From: this.CityFrom,
                To: this.CityTo,
                DateThere: new Intl.DateTimeFormat('ru-Ru').format(this.options.avia.dateThere[0])
                    .replace(/[^\.\d]/g, ''),
                OnlyDirect: this.options.avia.filters.onlyDirectFlights
            }).then((value)=>{
                this.setLoading(type, false);
                this.setAttributes(type, value);
            });
        }
    }
    /**
     * Перезагрузка последнего типа календаря
     */
    reload() {
        this.type && this.load(this.type);
    }
    clear(type) {
        //Очищаем цены
        this.setAttributes(type, {});
    }
    setLoading(type, isLoading){
        if (type === 'there') {
            this.vue.dateAttributesThereLoading = isLoading;
        }else{
            this.vue.dateAttributesBackLoading = isLoading;
        }
    }
    setAttributes(type, data, isLoading){
        //Устанавливаем новый объект через $set, что бы заработала реактивность
        if (type === 'there') {
            this.vue.$set(this.vue, 'dateAttributesThere', data);
        }else{
            this.vue.$set(this.vue, 'dateAttributesBack', data);
        }
    }
}