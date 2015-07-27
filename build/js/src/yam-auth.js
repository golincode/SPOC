// Yammer Group Functionlity.

SPOC.Yam.prototype.Auth = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Checks that user is logged into Yammer. If not, Logins user and fetches access token.
     * @return  jQuery Deferred Object
     */
    methods.checkLogin = function() {
        var promise = $.Deferred();

        yam.getLoginStatus(function(response) {
            if (!response.authResponse) {
                yam.platform.login(function(user) {
                    if (user) {
                        promise.resolve(user);
                    }
                });
            } else {
                promise.resolve(response);
            }
        });

        return promise;
    };


    return methods;

};