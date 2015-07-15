// Yammer Group Functionlity.

SPOC.Yam.prototype.Group = function(feedId) {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a Yammer Group and returns feed items
     * @return  jQuery Deferred Object
     */
    methods.query = function(forceNoCache) {
        var promise = $.Deferred();

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yamgroup' + feedId);

        // Return cached version if available
        if (cache && !forceNoCache) {
            promise.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            _this.checkLogin().then(function() {
                yam.platform.request({
                    url: "messages/in_group/" + feedId + ".json",
                    method: "GET",
                    success: function(data) {
                        // Format response to combine references with messages
                        data = SPOC.Utils.Yammer.formatFeedResponse(data);
                        SPOC.Utils.Storage.set('SPOCC-yamgroup' + feedId, data);
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