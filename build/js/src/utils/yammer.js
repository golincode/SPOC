// Create objects for Utils conversion
SPOC.Utils.Yammer = {};

/**
 * Matches references with messages and returns tidier data object
 * @params  array obj Yammer feed Object
 * @return  array
 */
SPOC.Utils.Yammer.formatFeedResponse = function(data) {
    var i;
    for (i = 0; i < data.messages.length; i++) {
        if (data.messages[i].sender_type && data.messages[i].sender_type === 'user') {
            data.messages[i].user = SPOC.Utils.Arrays.findByProperty(data.references, 'id', data.messages[i].sender_id);
        }
    }
    return data.messages;
};

/**
 * Checks that user is logged into Yammer. If not, Logins user and fetches access token.
 * @return  jQuery Deferred Object
 */
SPOC.Utils.Yammer.checkLogin = function() {
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