// Yammer User Functionlity.

SPOC.Yam.User.prototype.Subscriptions = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a Yammer User Profile and returns properties
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var deferred = $.Deferred();

        //Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOC-yam-subs-' + _this.id);

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function(result) {
                if (result) {
                    yam.platform.request({
                        url: "subscriptions/to_user/" + _this.id + ".json",
                        method: "GET",
                        data: settings ? settings : null,
                        success: function(data) {
                            SPOC.Utils.Storage.set('SPOC-yam-subs-' + _this.id, data);
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    });
                } else {
                    deferred.resolve(false);
                }
            });

        }
        return deferred.promise();

    };

    return methods;

};