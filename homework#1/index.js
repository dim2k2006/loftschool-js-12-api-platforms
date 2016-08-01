var list = {
    menu: document.querySelector('.menu'),
    container: document.querySelector('.container'),
    list: document.querySelector('.container__list'),
    input: document.querySelector('.field__input'),
    inputValue: '',
    data: [],
    dataLength: 0,

    setupListener: function() {
        var __this = this;

        this.input.addEventListener('keyup', function(event) {
            var value = event.target.value;

            __this.inputValue = value;

            __this.render();
        });
    },
    setupHandleBar: function() {
        var __this = this;

        Handlebars.registerHelper('sortData', function(data) {
            var result = '';

            if (__this.inputValue !== '') {

                if (data.toLowerCase().indexOf(__this.inputValue.toLowerCase()) !== -1) {

                    result = new Handlebars.SafeString('<li>' + data + '</li>');

                } else {

                    result = '';

                }

            } else {

                result = new Handlebars.SafeString('<li>' + data + '</li>');

            }

            return result;
        });
    },
    load: function() {
        var __this = this,
            request = this.request('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');

        request.then(
            function(responseText) {
                var data = JSON.parse(responseText),
                    dataArray = [];

                for (key in data) {
                    dataArray.push(data[key].name);
                }

                __this.data = __this.sort(dataArray);

                __this.render();
            },
            function() {
                console.log('Ошибка');
            }
        )
    },
    request: function(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.send();

            xhr.addEventListener('load', function() {
                resolve(xhr.responseText);
            });

            xhr.addEventListener('error', function() {
                reject();
            });
        });
    },
    sort: function(data) {
        return data.sort();
    },
    render: function() {
        var __this = this,
            source = document.getElementById('citiesTemplate').innerHTML,
            templateFn = Handlebars.compile(source),
            template = templateFn({list: __this.data});

        this.container.innerHTML = template;
    },
    init: function() {
        this.setupHandleBar();
        this.load();
        this.setupListener();
    }
};

list.init();