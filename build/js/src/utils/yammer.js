
SPOC.Utils.Yammer = {};

/**
 * Matches references with messages and returns tidier data object
 * @params  array obj Yammer feed Object
 * @return  array
 */
SPOC.Utils.Yammer.formatFeedResponse = function(data) {
    var i;
    var cleanFeed = [];

    for (i = 0; i < data.messages.length; i++) {
        if (!data.messages[i].replied_to_id) {
            if (data.messages[i].sender_type && data.messages[i].sender_type === 'user') {
                data.messages[i].user = SPOC.Utils.Objects.findObjectByProperty(data.references, 'id', data.messages[i].sender_id);
                cleanFeed.push(data.messages[i]);
            }
        }
    }
    return cleanFeed;
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
                message.user = SPOC.Utils.Objects.findObjectByProperty(data.messages.references, 'id', message.sender_id);
            }
        }
    }

    return data;
};


/**
 * Checks that user is logged into Yammer. If not, Logins user and fetches access token.
 * @return  jQuery Deferred Object
 */
SPOC.Utils.Yammer.checkLogin = function(promptLogin) {
     return new Promise(function(resolve, reject) {
         yam.getLoginStatus(function(response) {
            if (response.authResponse) {
                resolve(response);
            } else {
                if (promptLogin) {
                    yam.platform.login(function(user) {
                        if (user) {
                            resolve(user);
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    resolve(response);
                }
            }
        });
    });
};
