const validatorBase = require('./../validatorBase');
module.exports = class validator extends validatorBase {
    validateChilds() {
        var ret = true;
        if (this.it._o.hotel.childs.length > 0) {
                 
            var chilVal = document.querySelectorAll('.childs_flex .number_val');
            var childLable = document.querySelector('.childs_flex .menu-title');

            for(var i = 0; i < chilVal.length; i++) {
                if(chilVal[i].innerText === '') {
                    childLable.classList.add('has-error');
                    chilVal[i].closest('.child_box').classList.add('has-error');
                    this.it._o.hotel.isActive = true;

                    ret = false;
                }
            }    
        }
        return ret;
    }
    validateInput() {
        var city = this.form.find("input[name='CityId']").first();
        var nationality = this.form.find("input[name='Nationality']").first();
        var errorBox = this.form.find("input[name='CheckOut']").first();

        if ($.trim(city.val()) === "" || city.val() === "&nbsp;") {
            city.closest(".field").addClass("has-error").find(".error-box").text(this.it.extra.locale("BUSES_PLACEHOLDER")).append($("<div/>").addClass("close")).slideDown(this.it._o.animationDelay);
            return false;
        }
        if ($.trim(nationality.val()) === "" || nationality.val() === "&nbsp;" || nationality.val() === null) {
            nationality.closest(".field").addClass("has-error").find(".error-box").text(this.it.extra.locale("ENTER_NATIONALITY")).append($("<div/>").addClass("close")).slideDown(this.it._o.animationDelay);
            return false;
        }
        if(this.it._o.hotel.Reservations) {
            errorBox.closest(".date.to").addClass("has-error").find(".error-box").text(this.it.extra.locale("RESERVATIONS_LONGER")).append($("<div/>").addClass("close")).slideDown(this.it._o.animationDelay);
            return false;
        }
        return true;
    }
    isValid() {
        var ret = this.validateInput();
        ret = this.validateChilds() && ret;
        ret = this.dateRange() && ret;
        
        return ret;
    }
};