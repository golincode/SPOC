/**
 * Define Sp Site Object constructor
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.SP.Site = function(url) {

    // Set URL to current site if no url passed in.
    this.url = url ? url : _spPageContextInfo.webAbsoluteUrl;
};


/**
 * Define Sp User Object constructor
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.SP.User = function(username) {

    // Set URL to current site if no url passed in.
    this.id = username ? username : _spPageContextInfo.userId;
    this.loginName = username ? username : _spPageContextInfo.userLoginName;
    this.isAdmin = username ? false : _spPageContextInfo.isSiteAdmin;
};


/**
 * Define Yam Object constructor & ensure login
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.Yam.User = function(userId) {

    if (!window.yam) {
        //@todo: Update error messages to SP notifications?
        console.log('Please ensure that you have included Yammer SDK and added a valid Client Id');
    }

    this.id = userId ? userId : 'current';
};




/**
 * Define Yam Object constructor & ensure login
 * @params  url  url of Sharepoint site
 * @author  Martin Pomeroy <mpomeroy@wearearchitect.com>
 * @return  void
 */
SPOC.Yam.Messages = function(feedId, feedType) {

    if (!window.yam) {
        //@todo: Update error messages to SP notifications?
        console.log('Please ensure that you have included Yammer SDK and added a valid Client Id');
    }

    this.feedId = feedId;
    this.feedType = feedType;

};
