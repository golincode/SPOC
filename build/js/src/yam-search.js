// Yammer Group Functionlity.

SPOC.Yam.Search = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // Default api endpoint to search
    var apiUrl = "search.json";

    /**
     * Queries a Yammer Group and returns feed items
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var deferred = $.Deferred();

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-yamsearch-' + JSON.stringify(settings));

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.resolve(cache);
        } else {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function(result) {
                if (result) {
                    yam.platform.request({
                        url: apiUrl,
                        method: "GET",
                        data: settings ? settings : null,
                        success: function(data) {
                            // Format response to combine references with messages
                            data = SPOC.Utils.Yammer.formatSearchResponse(data);
                            SPOC.Utils.Storage.set('SPOCC-yamsearch-' + JSON.stringify(settings), data);
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    });
                } else {
                    deferred.resolve(data);
                }
            });

        }
        return deferred.promise();

    };


    return methods;

};