module.exports = class BusLocation {
    constructor(location) {
        if (!location)
            return;
        this.Id = location.Id;
        this.TypeShortName = location.TypeShortName;
        this.TypeName = location.TypeName;
        this.Name = location.Name;
        this.RegionName = location.RegionName;
        this.CountryName = location.CountryName;
    }
};