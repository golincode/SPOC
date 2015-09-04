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
 * Matches references with messages and returns tidier data object
 * @params  array obj Yammer feed Object
 * @return  array
 */
SPOC.Utils.Yammer.formatSearchResponse = function(data) {
    var i;

    if (data.messages && data.messages.messages) {
        for (i = 0; i < data.messages.messages.length; i++) {
            var message = data.messages.messages[i];
            if (message.sender_type && message.sender_type === 'user') {
                message.user = SPOC.Utils.Arrays.findByProperty(data.messages.references, 'id', message.sender_id);
            }
        }
    }

    return data;
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