// Yammer User Functionlity.

SPOC.Yam.prototype.User = function(userId) {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // If not user id is passed in, set as current.
    userId = userId ? userId : 'current';

    /**
     * Queries a Yammer User Profile and returns properties
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var promise = $.Deferred();

        //Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yamuser' + userId);

        // Return cached version if available
        if (cache && !forceNoCache) {
            promise.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            _this.Auth.checkLogin().then(function() {
                yam.platform.request({
                    url: "users/" + userId + ".json",
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        SPOC.Utils.Storage.set('SPOCC-yamuser' + userId, data);
                        promise.resolve(data);
                    },
                    error: function(data) {
                        promise.reject(data);
                    }
                });
            });
        }

        return promise;
    };

    return methods;

};