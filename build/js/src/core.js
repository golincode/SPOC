/**
 * Define Sp Site Object constructor
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.SPSite = function(url) {

    // Set URL to current site if no url passed in.
    this.url = url ? url : _spPageContextInfo.webAbsoluteUrl;
};


/**
 * Define Yam Object constructor & ensure login
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.Yam = function() {

    /**
     * Checks that user is logged into Yammer. If not, Logins user and fetches access token.
     * @return  jQuery Deferred Object
     */
    this.checkLogin = function() {
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
};