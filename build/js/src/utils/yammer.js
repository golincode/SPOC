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
    // var loginStatus = SPOC.Utils.Storage.get('loginRegister');

    // if (!loginStatus) {
    //     var ua = window.navigator.userAgent;
    //     var msie = ua.indexOf("MSIE ");
    //     var ieVersion = "";

    //     if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    //         // If Internet Explorer, return version number
    //         ieVersion = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
    //     }

    //     if (ieVersion == 9) {
    //         var iframe = document.createElement("iframe");
    //         iframe.src = "https://www.yammer.com/platform_embed/feed?network=architect365.co.uk&config%5Buse_sso%5D=true&config%5Bheader%5D=false&config%5Bfooter%5D=false&config%5BshowOpenGraphPreview%5D=false&config%5BdefaultToCanonical%5D=false&config%5BhideNetworkName%5D=false&container=%23embedded-feed&network_permalink=architect365.co.uk&bust=1442836822385";
    //         iframe.onload = function() {
    //             SPOC.Utils.Storage.set('loginRegister', true);
    //             location.reload();
    //         };

    //         $('#hidZone').append(iframe);
    //     } else {
    //         yam.getLoginStatus(function(response) {
    //             if (!response.authResponse) {
    //                 var iframe = document.createElement("iframe");
    //                 iframe.src = "https://www.yammer.com/platform_embed/feed?network=architect365.co.uk&config%5Buse_sso%5D=true&config%5Bheader%5D=false&config%5Bfooter%5D=false&config%5BshowOpenGraphPreview%5D=false&config%5BdefaultToCanonical%5D=false&config%5BhideNetworkName%5D=false&container=%23embedded-feed&network_permalink=architect365.co.uk&bust=1442836822385";
    //                 iframe.onload = function() {
    //                     $('.loginContainer iframe').remove();
    //                     yam.platform.login(function(user) {
    //                         if (user) {
    //                             SPOC.Utils.Storage.set('loginRegister', true);
    //                             promise.resolve(user);
    //                         }
    //                     });
    //                 };
    //             } else {
    //                 promise.resolve(response);
    //             }
    //         });
    //     }
    // }

    return deferred.promise().resolve(true);
};