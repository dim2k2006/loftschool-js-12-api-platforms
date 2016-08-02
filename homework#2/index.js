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
    compare: function(a, b) {
        a = a.bdate || undefined;
        b = b.bdate || undefined;

        if (a && b) {

            a.split('.').reverse().join(', ');
            console.log(a);

        }

        // a.split('.').reverse().join(', ');


        // if (a > b) return 1;
        // if (a < b) return -1;
    },
    render: function(data) {
        var dataHasDate = data.filter(function(item) {
            return item.bdate;
        });

        

        // console.log(data);
        // data.sort(this.compare);

        var source = document.getElementById('listTemplate').innerHTML,
            templateFn = Handlebars.compile(source),
            template = templateFn({list: dataHasDate});

        this.content.innerHTML = template;
    },
    init: function() {
        this.setupHandleBar();
        this.getData();
    }
};

list.init();