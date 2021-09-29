﻿const AirportItem = require('./AirportItem');

module.exports = class EmptyRouteItem {
    constructor() {
        this.aviFrom = new AirportItem();
        this.aviTo = new AirportItem();
        this.dateThere = undefined;
    }
};