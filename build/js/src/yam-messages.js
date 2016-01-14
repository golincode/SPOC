// Yammer Group Functionlity.

SPOC.Yam.Feed.prototype.posts = function() {

    // save reference to this
    var _this = this;

    // Create object to store public methods
    var methods = {};

    // Default api endpoint to all messages
    var apiUrl = "messages.json";

    // If an id is passed and feedtype, formuate new endpoint
    if (_this.feedId) {
        apiUrl = "messages/" + _this.feedType ? "in_group" : "from_user" + "/" + _this.feedId + ".json";
    }

    /**
     * Queries a Yammer Group and returns feed items
     * @return promise
     */
    methods.query = function(settings) {
         return new Promise(function(resolve, reject) {
            // Check user has access token and then then return group feed.
            SPOC.Utils.Yammer.checkLogin().then(function(result) {
                if (result) {
                    yam.platform.request({
                        url: apiUrl,
                        method: "GET",
                        data: settings ? settings : null,
                        success: function(data) {
                            // Format response to combine references with messages
                            data = SPOC.Utils.Yammer.formatFeedResponse(data);
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