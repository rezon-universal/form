
const airFormModule = require('./air/airModule');
const railFormModule = require('./rail/railModule');
const busFormModule = require('./bus/busModule');
const hotelFormModule = require('./hotels/hotelModule');
const insurancesFormModule = require('./insurances/insurancesModule');

const formBase = require('./form.base');
module.exports = class formAll extends formBase {

    getCurrentModule(formType) {
        switch(formType) {
            case "avia":
            case "air":
                return new airFormModule(this._form, this._o, this);
            case "rail":
            case "railway":
                return new railFormModule(this._form, this._o, this);
            case "bus":
            case "buses":
                return new busFormModule(this._form, this._o, this);
            case "hotels":
            case "hotel":
                return new hotelFormModule(this._form, this._o, this);
            case "insurances":
            case "insurance":
                return new insurancesFormModule(this._form, this._o, this);
            default:
                throw new Error(`Form type ${formType} is not defined.`);
        }
    }
}