﻿import '../../../Content/css/src/forms/shoot.air.scss';
/*
 * Это скрипт файл Jquery плагина rezOnForm только для авиа формы
 * Т.е. используя этот файл можно инициализировать только авиа форму!
 *
 * Сделано для перфоманса, что бы не грузился лишний js код.
 */
const localizator = require('./localizations');
const formAir = require('./form.air');

(function ($) {
    $.fn.rezOnForm = function (o) {
        this[0].classList.add('rezon-forms');
        let form = this.find("form");
        let object = this.data('RezOnForm');
        if (!object) {
            object = new formAir(localizator.load());
            this.data('RezOnForm', object);
            object.init(form, o || window.rezonOpt);
        }
    };
})(window.jQuery);