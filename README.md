Html поисковая форма \(рекомендуется\)

На страницу Вашего сайта встраивается HTML + JS код. После заполнения формы открывается новая вкладка с результатами выдачи. Дальнейшие этапы бронирования происходят на проекте RezOn.

| [![](https://help.rezonuniversal.com/assets/2018-02-23_13h01_53.png)](https://help.rezonuniversal.com/assets/2018-02-23_13h01_53.png) | [![](https://help.rezonuniversal.com/assets/2018-02-23_13h06_01.png)](https://help.rezonuniversal.com/assets/2018-02-23_13h06_01.png) | [![](https://help.rezonuniversal.com/assets/2018-02-23_13h07_06.png)](https://help.rezonuniversal.com/assets/2018-02-23_13h07_06.png) |
| :--- | :--- | :--- |

Для подключения формы необходимо произвести следующие действия:

Html разметку из файла [`\src\html\aviaForm.html`](https://raw.githubusercontent.com/rezon-universal/form/master/src/html/aviaForm.html) необходимо скопировать \(или подключить\) в блок контейнера, который следует разместить на странице Вашего сайта.

Пример контейнера html кода:

```html
<div id="rezon-forms">
    <div class="rez-forms container">
        <!-- Содержимое файла aviaForm.html -->
    </div>
</div>
```

Также на странице, где размещается форма, необходимо подключить файлы стилей и скриптов.

```html
<link href="//cdn.rawgit.com/rezon-universal/form/master/src/css/shoot.css" rel="stylesheet"/>

<script src="//cdn.rawgit.com/rezon-universal/form/master/src/js/jquery-2.1.4.min.js"></script>
<script src="//cdn.rawgit.com/rezon-universal/form/master/src/js/jquery.maskedinput.min.js"></script>
<script src="//cdn.rawgit.com/rezon-universal/form/master/src/js/typeahead.bundle.js"></script>
<script src="//cdn.rawgit.com/rezon-universal/form/master/src/js/vue.min.js"></script>
<script src="//cdn.rawgit.com/rezon-universal/form/master/src/js/vue_datepicker/Datepicker.js"></script>
<script src="//cdn.rawgit.com/rezon-universal/form/master/src/js/rezon-form.js"></script>
```

\(обратите внимание, что если у вас на странице уже подключена какая-либо библиотека, например jQuery, то повторно её подключать не нужно.

В собственный файл скриптов \(или прямо на странице\) добавьте скрипт инициализации формы

```javascript
$(document).ready(function(){
    $("#rezon-forms").rezOnForm({
        projectUrl: "https://YOUR_DOMAIN_FOR_REZON.COM/",
        defaultLang: "ru", // ua|ru|en
               formType: "all", // avia|railway|all,
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
            defaultDateThere: '09.03.2018',// Дата вылета туда в формате dd.MM.yyyy
            defaultDateBack: '15.03.2018'  // Дата вылета обратнов формате dd.MM.yyyy
        }
    });
});
```

Пример кода полной страницы со всеми подключенными стилями и скриптами можно просмотреть [здесь](https://raw.githubusercontent.com/rezon-universal/form/master/src/html/Index.html)
[![](/assets/2018-02-23_13h55_03.png)](/assets/2018-02-23_13h55_03.png)

