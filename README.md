## RezOn форма поиска ![build](https://img.shields.io/badge/build-success-brightgreen.svg)




На страницу Вашего сайта встраивается HTML+CSS+JS формы поиска. После заполнения формы открывается новая вкладка с результатами выдачи. Дальнейшие этапы бронирования происходят на проекте RezOn.

При необходимости Вы можете изменять стили/скрипты/разметку формы.


- [Демо формы поиска авиа билетов](https://github.com/rezon-universal/form/blob/master/demo/air/demo.html)
- [Демо формы поиска ЖД билетов](https://github.com/rezon-universal/form/blob/master/demo/rail/demo.html)
- [Демо формы поиска автобусов](https://github.com/rezon-universal/form/blob/master/demo/buses/demo.html)
- [Демо формы поиска отелей](https://github.com/rezon-universal/form/blob/master/demo/hotels/demo.html)
- [Демо формы поиска страховок](https://github.com/rezon-universal/form/blob/master/demo/insurances/demo.html)


Для подключения формы необходимо произвести следующие действия:

Html разметку из файла с формой [`\src\html\air\form.html`](https://raw.githubusercontent.com/rezon-universal/form/master/src/html/air/form.html) необходимо скопировать (или подключить) в блок контейнера, размещенный на странице Вашего сайта.

Пример контейнера html кода:

```html
<div id="rezon-forms">
    <div class="rez-forms container">
        <!-- Содержимое файла form.html -->
    </div>
</div>
```

В теге `head` на странице, где размещается форма, необходимо подключить файлы стилей и скриптов.

```html
<link href="https://cdn.jsdelivr.net/gh/rezon-universal/form@latest/assets/css/rezon-form.min.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/gh/rezon-universal/form@latest/assets/js/jquery-2.1.4.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/rezon-universal/form@latest/assets/js/typeahead.bundle.js"></script>
<script src="https://cdn.jsdelivr.net/gh/rezon-universal/form@latest/assets/js/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/rezon-universal/form@latest/assets/js/vuejs-datepicker.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/rezon-universal/form@latest/assets/js/rezon-form.min.js"></script>
```

_(обратите внимание, что если у вас на странице уже подключена какая-либо библиотека, например jQuery, то повторно её подключать не нужно)_

В собственный файл скриптов (или прямо на странице) добавьте скрипт инициализации формы

```javascript
$(document).ready(function(){
    $("#rezon-forms").rezOnForm({
        projectUrl: "https://YOUR_DOMAIN_FOR_REZON.COM/",
        defaultLang: "ru", // ua|ru|en
        formType: "all", // avia|railway|buses|hotels,
        formTarget: "_blank" // '_blank' - загружает поисковую выдачу в новое окно браузера., '_self' - в текущее окно.
    });
});
```
**Внимание!** Замените ``YOUR_DOMAIN_FOR_REZON.COM`` на url адрес вашего проекта RezOn!

Для авиа формы есть возможность предустановить поля формы

```javascript
$(document).ready(function () {
    $("#rezon-forms").rezOnForm({
        projectUrl: "https://YOUR_DOMAIN_FOR_REZON.COM/",
        defaultLang: "ru",
        formType: "avia",
        avia: {
            defaultRouteType: 'roundtrip', // [oneway/roundtrip/route]
            defaultAirportFrom: 'IEV',     // IATA код или строка поиска аэропорта отправления
            defaultAirportTo: 'TLV',       // IATA код или строка поиска аэропорта прибытия
            defaultDateThere: new Date('2020-05-03'),//Дата вылета туда
            defaultDateBack: new Date('2020-05-11')  // Дата вылета обратно
        }
    });
});
```

Пример кода полной страницы со всеми подключенными стилями и скриптами можно просмотреть [здесь](https://github.com/rezon-universal/form/blob/master/demo/air/demo.html)


