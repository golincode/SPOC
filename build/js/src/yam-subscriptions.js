// Yammer User Functionlity.

SPOC.Yam.User.prototype.Subscriptions = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a Yammer User Profile and returns properties
     * @return  promise
     */
    methods.query = function(settings, forceNoCache) {
        return new Promise(function(resolve, reject) {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function(result) {
                if (result) {
                    yam.platform.request({
                        url: "subscriptions/to_user/" + _this.id + ".json",
                        method: "GET",
                        data: settings ? settings : null,
                        success: function(data) {
                            SPOC.Utils.Storage.set('SPOC-yam-subs-' + _this.id, data);
                            resolve(data);
                        },
                        error: function(data) {
                            reject(data);
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        });
    };

    return methods;

};
