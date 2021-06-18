const validatorBase = require('./../validatorBase');
module.exports = class validator extends validatorBase {
    
    //Проверка городов отправления / прибытия
    validateCities() {
        var ret = true;
        var inpFrom = this.form.find("input[name='CountryCode']").first();

        if (inpFrom.length && ($.trim(inpFrom.val()) === "" || inpFrom.val() === "&nbsp;")) {
            inpFrom.closest(".field").addClass("has-error").find(".error-box").text(this.it.extra.locale("SPECIFY_COUNTRY")).append($("<div/>").addClass("close")).slideDown(this.it._o.animationDelay);
            ret = false;
        }
         
        return ret;
    }
    isValid() {
        var ret = this.validateCities();
        ret = this.dateRange() && ret;
        
        return ret;
    }
};