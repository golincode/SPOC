
/**
 * Define Sp Site Object constructor
 * @params  url  url of Sharepoint site
 * @return  undefined
 */
SPOC.SP.Site = function(url) {

    // Set URL to current site if no url passed in.
    this.url = url ? url : window._spPageContextInfo.webAbsoluteUrl;
};


/**
 * Define Sp User Object constructor
 * @params  url  url of Sharepoint site
 * @return  object
 */
SPOC.SP.User = function(username) {
    this.id = username ? username : window._spPageContextInfo.userId;
    this.loginName = username ? username : window._spPageContextInfo.userLoginName;
};


/**
 * Define Yam Object constructor & ensure login
 * @params  url  url of Sharepoint site
 * @return object
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
 * @return object
 */
SPOC.Yam.Feed = function(feedId, feedType) {

    if (!window.yam) {
        //@todo: Update error messages to SP notifications?
        console.log('Please ensure that you have included Yammer SDK and added a valid Client Id');
    }

    this.feedId = feedId;
    this.feedType = feedType;

};
