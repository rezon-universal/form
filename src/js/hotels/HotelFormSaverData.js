const FormSaverDataBase = require('./../FormSaverDataBase');

const HotelCityItem = require('./HotelCityItem');

module.exports = class HotelFormSaverData extends FormSaverDataBase {
    constructor(formModule) {
        super(formModule);

        if (formModule) 
        {
            let hotelOptions = formModule.options.hotel;
            
            this.city = new HotelCityItem(hotelOptions.city.Id, hotelOptions.city.Name, hotelOptions.city.CountryName);
            this.adults = hotelOptions.adults;
            this.checkIn = super.dateTimeToString(hotelOptions.checkIn);
            this.checkOut = super.dateTimeToString(hotelOptions.checkOut);
            this.childs = hotelOptions.childs;
            this.quantityChilds = hotelOptions.quantityChilds;
            this.rooms = hotelOptions.rooms;
            this.nationalityName = hotelOptions.nationalityName;
            this.nationalityCode = hotelOptions.nationalityCode;
        }
    }

    IsSame(obj) {
        return obj.city.Id === this.city.Id;
    }
    get IsValidForSave() {
        return super.parseDateTime(this.checkIn) > new Date();
    }

    Select() {
        
        let hotelOptions = this.formModule.options.hotel;
        
        hotelOptions.city = new HotelCityItem(this.city.Id, this.city.Name, this.city.CountryName);
        hotelOptions.adults = this.adults;
        hotelOptions.checkIn = this.parseDateTime(this.checkIn);
        hotelOptions.checkOut = this.parseDateTime(this.checkOut);
        hotelOptions.childs = this.childs;
        hotelOptions.quantityChilds = this.quantityChilds;
        hotelOptions.rooms = this.rooms;
        hotelOptions.nationalityName = this.nationalityName;
        hotelOptions.nationalityCode = this.nationalityCode;
        
    }
}