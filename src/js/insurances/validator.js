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
    //Проверка выбранного периода для kmj
    validatePeriod() {
        var ret = true;
        if (this.it._o.widgetCode == "kmj" && this.it._o.selectedPeriod == 0) {
            var inpPeriod = $(document).find(".select-holder").first();
            inpPeriod.closest(".field").addClass("has-error").find(".error-box").text(this.it.extra.locale("SELECT_PERIOD")).append($("<div/>").addClass("close")).slideDown("fast");
            ret = false;
        }
        return ret;
    }
    isValid() {
        var ret = this.validateCities();
        ret = this.validatePeriod() && ret;
        return ret;
    }
};