// Yammer Group Functionlity.

SPOC.Yam.prototype.Messages = function(feedId, feedType) {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // Default api endpoint to all messages
    var apiUrl = "messages.json";

    // If an id is passed and feedtype, formuate new endpoint
    if (feedId && feedType) {
        apiUrl = "messages/" + feedType === 'group' ? "in_group" : "from_user" + "/" + feedId + ".json";
    }

    /**
     * Queries a Yammer Group and returns feed items
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var promise = $.Deferred();

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yammessage' + feedId + feedType);

        // Return cached version if available
        if (cache && !forceNoCache) {
            promise.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            _this.Auth.checkLogin().then(function() {
                yam.platform.request({
                    url: apiUrl,
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        // Format response to combine references with messages
                        data = SPOC.Utils.Yammer.formatFeedResponse(data);
                        SPOC.Utils.Storage.set('SPOCC-yammessage' + feedId + feedType, data);
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