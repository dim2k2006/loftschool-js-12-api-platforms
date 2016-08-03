var list = {
    container: document.querySelector('.container'),
    content: document.querySelector('.container__content'),

    setupHandleBar: function() {
        var __this = this;

        Handlebars.registerHelper('getAge', function(data) {
            var birthdate = '',
                cur = '',
                diff = '',
                age = '',
                dataArray = '',
                year = '',
                month = '',
                day = '';

            if (data) {

                dataArray = data.split('.');
                year = dataArray[2];
                month = dataArray[1];
                day = dataArray[0];

                if (year) {

                    birthdate = new Date(year, month, day);
                    cur = new Date();
                    diff = cur - birthdate;
                    age = Math.floor(diff/31536000000);
                    return `Возраст: ${age}`;

                }

            }
        });
    },
    load: function() {
        return new Promise(function(resolve) {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.onload = resolve;
            }
        });
    },
    login: function() {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: 5569579
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, 8);
        });
    },
    getData: function() {
        var __this = this,
            load = this.load(),
            login = load.then(this.login());

        login.then(function() {
            return new Promise(function(resolve, reject) {
                VK.api('friends.get', {'name_case': 'nom', 'fields': 'bdate, photo_100', 'version': 5.53}, function(response) {
                    if (response.error) {
                        reject(new Error(response.error.error_msg));
                    } else {
                        __this.render(response.response);

                        resolve();
                    }
                });
            })
        });
    },
    sortData: function(a, b) {
        var currentYear = new Date().getFullYear(),
            arrayA = a.bdate.split('.'),
            arrayB = b.bdate.split('.');

        arrayA.length = 3;
        arrayB.length = 3;

        arrayA[2] = currentYear;
        arrayB[2] = currentYear;

        a = new Date(arrayA.reverse().join(', '));
        b = new Date(arrayB.reverse().join(', '));

        if (a.getMonth() > b.getMonth()) {

            return 1;

        } else if (a.getMonth() < b.getMonth()) {

            return -1;

        } else {

            if (a.getDate() > b.getDate()) {

                return 1;

            } else if (a.getDate() < b.getDate()) {

                return -1;

            } else {

                return 0;

            }
        }
    },
    compare: function(data) {
        var dataHasDate = data.filter(function(item) {
                return item.bdate;
            }),
            dataHasDateLength = dataHasDate.length,
            i = 0,
            next = [],
            last = [],
            now = new Date(),
            currentYear = now.getFullYear(),
            itemDate = [];

        for (i; i < dataHasDateLength; i++) {

            itemDate = dataHasDate[i].bdate.split('.');
            itemDate.length = 3;
            itemDate[2] = currentYear;
            itemDate = itemDate.reverse().join(', ');
            itemDate = new Date(itemDate);

            if(itemDate.getMonth() >= now.getMonth() && itemDate.getDate() > now.getDate())

                next.push(dataHasDate[i]);

            else {

                last.push(dataHasDate[i]);

            }

        }

        next = next.sort(this.sortData);
        last = last.sort(this.sortData);

        return next.concat(last);
    },
    render: function(data) {
        var filteredData = this.compare(data),
            source = document.getElementById('listTemplate').innerHTML,
            templateFn = Handlebars.compile(source),
            template = templateFn({list: filteredData});

        this.content.innerHTML = template;
    },
    init: function() {
        this.setupHandleBar();
        this.getData();
    }
};

list.init();