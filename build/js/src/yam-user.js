// Yammer User Functionlity.

SPOC.Yam.User.prototype.Profile = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a Yammer User Profile and returns properties
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var defer = $.Deferred();

        //Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yamuser' + _this.id);

        // Return cached version if available
        if (cache && !forceNoCache) {
            deferred.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function() {
                yam.platform.request({
                    url: "users/" + _this.id + ".json",
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        SPOC.Utils.Storage.set('SPOCC-yamuser' + _this.id, data);
                        defer.resolve(data);
                    },
                    error: function(data) {
                        defer.reject(data);
                    }
                });
            });

        }
        return defer.promise();

    };

    return methods;

};