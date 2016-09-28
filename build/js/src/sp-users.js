// SharePoint List Functionlity

SPOC.SP.User.prototype.Profile = function() {

    // save reference to this
    var user = this;

    // Create object to store public methods
    var methods = {};

    var loginNamePrefix = 'i:0%23.f|membership|';

    /**
     * Queries a SharePont User via REST API
     * @params  Object query filter paramators in obj format
     * @return  promise
     */
    methods.query = function(cache) {
        var listUrl = window._spPageContextInfo.webAbsoluteUrl;

        if (user.loginName){
            listUrl += "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=%27" + loginNamePrefix + user.loginName + "%27";
        } else {
            listUrl += "/_api/SP.UserProfiles.PeopleManager/GetMyProperties/UserProfileProperties";
        }
        // return promise
        return SPOC.Utils.Request.get(listUrl, cache);
    };


    /**
     * Returns if a SP user is a member of a security group
     * @params  groupName to check
     * @params  user Id to check (optional)
     * @return  bool
     */
    methods.isMemberOfGroup = function(site, groupName, userId, cache) {
        var user = userId ? userId : window._spPageContextInfo.userId;
        var listUrl = site.url +  "/_api/web/sitegroups/getByName('" + groupName + "')/Users?$filter=Id eq " + user;

        // return promise
        return SPOC.Utils.Request.get(listUrl, cache);
    };

    return methods;
};
