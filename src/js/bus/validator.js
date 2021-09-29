const validatorBase = require('./../validatorBase');
module.exports = class validator extends validatorBase {
    
    //Проверка городов отправления / прибытия
    validateCities() {
       var ret = true;
        var inpFrom = this.form.find("input[name='LocationFromId']").first();
        var inpTo = this.form.find("input[name='LocationToId']").first();

        if ($.trim(inpFrom.val()) === "" || inpFrom.val() === "&nbsp;") {
            inpFrom.closest(".field").addClass("has-error").find(".error-box").text(this.it.extra.locale("SELECT_CITY_FROM_LIST")).append($("<div/>").addClass("close")).slideDown(this.it._o.animationDelay);
            ret = false;
        }
        if ($.trim(inpTo.val()) === "" || inpTo.val() === "&nbsp;") {
            inpTo.closest(".field").addClass("has-error").find(".error-box").text(this.it.extra.locale("SELECT_CITY_FROM_LIST")).append($("<div/>").addClass("close")).slideDown(this.it._o.animationDelay);
            ret = false;
        } else if ($.trim(inpFrom.val()) === $.trim(inpTo.val())) {
            inpTo.closest(".field").addClass("has-error").find(".error-box").text(this.it.extra.locale("NEED_TO_SELECT_DIFFERENT_CITIES")).append($("<div/>").addClass("close")).slideDown(this.it._o.animationDelay);
            ret = false;
        }
        return ret;
    }
    isValid() {
        var ret = this.validateCities();
        
        return ret;
    }
};