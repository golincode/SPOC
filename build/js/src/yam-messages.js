// Yammer Group Functionlity.

SPOC.Yam.Messages = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // Default api endpoint to all messages
    var apiUrl = "messages.json";

    // If an id is passed and feedtype, formuate new endpoint
    if (_this.feedId && _this.feedType) {
        apiUrl = "messages/" + _this.feedType === 'group' ? "in_group" : "from_user" + "/" + _this.feedId + ".json";
    }

    /**
     * Queries a Yammer Group and returns feed items
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var deferred = $.Deferred();

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yammessage' + _this.feedId + _this.feedType);

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.promise().resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function() {
                yam.platform.request({
                    url: apiUrl,
                    method: "GET",
                    data: settings ? settings : null,
                    success: function(data) {
                        // Format response to combine references with messages
                        data = SPOC.Utils.Yammer.formatFeedResponse(data);
                        SPOC.Utils.Storage.set('SPOCC-yammessage' + _this.feedId + _this.feedType, data);
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                });
            });

            return deferred.promise();
        }

    };


    return methods;

};