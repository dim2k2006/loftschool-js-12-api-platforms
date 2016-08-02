var list = {
    container: document.querySelector('.container'),
    list: document.querySelector('.container__list'),

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
        var load = this.load(),
            login = load.then(this.login());

        login.then(function() {
            return new Promise(function(resolve, reject) {
                VK.api('friends.get', {'name_case': 'nom', 'fields': 'bdate, photo_100', 'version': 5.53}, function(response) {
                    if (response.error) {
                        reject(new Error(response.error.error_msg));
                    } else {
                        console.log(response);

                        resolve();
                    }
                });
            })
        });
    },
    init: function() {
        this.getData();
    }
};

list.init();