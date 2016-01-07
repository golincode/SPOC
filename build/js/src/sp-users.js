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
     * @return  jQuery Deferred Object
     */
    methods.query = function(forceNoCache) {
        var deferred = $.Deferred();
        var listUrl = _spPageContextInfo.webAbsoluteUrl;
        var cache = SPOC.Utils.Storage.set('SPOC-users-' + user.id);

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.resolve(cache);
        } else {

             if (user.loginName){
                listUrl += "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=%27" + loginNamePrefix + user.loginName + "%27";
            } else {
                listUrl += "/_api/SP.UserProfiles.PeopleManager/GetMyProperties/UserProfileProperties";
            }

            // else get data and return promise.
            $.ajax({
                type: "GET",
                url: listUrl,
                dataType: 'json',
                success: function(data) {
                    // On complete, cache results
                    SPOC.Utils.Storage.set('SPOC-users-' + user.id, data);
                    deferred.resolve(data);
                }
            });

            return deferred.promise();
        }
    };


    /**
     * Returns if a SP user is a member of a security group
     * @params  groupName to check
     * @params  user Id to check (optional)
     * @return  bool
     */
    methods.isMemberOfGroup = function(groupName, userId) {
    var deferred = $.Deferred();

    userId = userId ? userId : _spPageContextInfo.userId;

    var listUrl = site.url +  "/_api/web/sitegroups/getByName('" + groupName + "')/Users?$filter=Id eq " + _spPageContextInfo.userId;

        // else get data and return promise.

        $.ajax({
            type: "GET",
            url: listUrl,
            dataType: 'json',
            headers: {
                "Accept": "application/json;odata=verbose"
            },
            success: function(data) {
                // On complete, cache results
                deferred.resolve(data);
            },
            error: function(data) {
                deferred.reject(data);
            }
        });

        return deferred.promise();
};

    return methods;
};