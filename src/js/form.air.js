
const airFormModule = require('./air/airModule');
const formBase = require('./form.base');
module.exports = class formAir extends formBase {
    getCurrentModule(formType) {
        switch(formType) {
            case "avia":
            case "air":
                return new airFormModule(this._form, this._o, this);
            default:
                throw new Error(`Form type ${formType} is not allowed for this form plugin.`);
        }
    }
}