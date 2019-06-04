module.exports = class validatorBase {
    constructor(form, it){
        this.form = form;
        this.it = it;
    }
    isValid() {
        console.log('Validator base\\ Is Valid\\True');
        return true;
    }
    
    //Проверка даты вылета туда / обратно
    dateRange() {
        var ret = true;

        this.form.find(".date-wrapper.with-error").removeClass("with-error");
        this.form.find(".book-date").each(function () {
            if ($(this).closest(".date-wrapper").length === 0) return;

            if ($.trim($(this).val()) === "" || $(this).val() === "__.__.201_") {
                $(this).closest(".date-wrapper").addClass("with-error");
                ret = false;
            }
        });
        
        var datepickerCalendar = this.form.find('.date .vdp-datepicker__calendar');
        datepickerCalendar.each(function() {
            if ($(this).is(".error-box")) {
                $(this).closest('.vdp-datepicker').firstElementChild.firstElementChild.focus();
                ret = false;
            }
        });

        return ret;
    }
};