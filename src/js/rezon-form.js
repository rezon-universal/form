﻿import '../../../Content/css/src/forms/shoot.scss';
/*
 * Это скрипт файл Jquery плагина rezOnForm со всеми возможными поисковыми формами
 * Т.е. используя этот файл можно инициализировать любую форму (авиа/жд/автобусы/отели и т.д.)
 */
const localizator = require('./localizations');
const formAll = require('./form.all');

(function ($) {
    $.fn.rezOnForm = function (o) {
        let form = this;
        let object = form.data('RezOnForm');
        if (!object) {
            object = new formAll(localizator.load());
            form.data('RezOnForm', object);
            object.init(form, o || window.rezonOpt);
        }
    };
})(window.jQuery);