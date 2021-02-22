﻿import '../../../Content/css/src/forms/shoot.scss';
/*
 * Это скрипт файл Jquery плагина rezOnForm со всеми возможными поисковыми формами
 * Т.е. используя этот файл можно инициализировать любую форму (авиа/жд/автобусы/отели и т.д.)
 */
const localizator = require('./localizations');
const formAll = require('./form.all');

(function ($) {
    
    $.fn.rezOnForm = function (o) {
        let form = this.find("form");
        let object = this.data('RezOnForm');
        if (!object) {
            object = new formAll(localizator.load());
            this.data('RezOnForm', object);
            object.init(form, o || window.rezonOpt);
        }
    };
})(window.jQuery);