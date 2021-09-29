const validatorBase = require('./../validatorBase');
module.exports = class validator extends validatorBase {
    validatePassengers() {
        var errorsCount = this.form.find('.passengers .error-box label').length;
        var ret = errorsCount === 0;
        return ret;
    }
    validateDepartureArrival() {
        var ret = true;
        var local = this;
        this.form.find(".book-from").closest(".fields-container").each(function () {

            var inpFrom = $(this).find(".book-from").parent().siblings("input[type='hidden']").first();
            var inpTo = $(this).find(".book-to").parent().siblings("input[type='hidden']").first();

            if ($.trim(inpFrom.val()) == "" || inpFrom.val() == "&nbsp;") {
                inpFrom.closest(".field").addClass("has-error").find(".error-box").text(local.it.extra.locale("SELECT_AIRPORT_FROM_LIST")).append($("<div/>").addClass("close")).slideDown(local.it._o.animationDelay);
                ret = false;
            }

            if ($.trim(inpTo.val()) == "" || inpTo.val() == "&nbsp;") {
                inpTo.closest(".field").addClass("has-error").find(".error-box").text(local.it.extra.locale("SELECT_AIRPORT_FROM_LIST")).append($("<div/>").addClass("close")).slideDown(local.it._o.animationDelay);
                ret = false;
            } else if ($.trim(inpFrom.val()) == $.trim(inpTo.val())) {
                inpTo.closest(".field").addClass("has-error").find(".error-box").text(local.it.extra.locale("NEED_TO_SELECT_DIFFERENT_AIRPORTS")).append($("<div/>").addClass("close")).slideDown(local.it._o.animationDelay);
                ret = false;
            }
        });
        return ret;
    }
    isValid() {
        var ret = this.validateDepartureArrival();
        ret = this.validatePassengers() && ret;

        return ret;
    }
};