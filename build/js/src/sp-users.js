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
        var cache = SPOC.Utils.Storage.set('SPOCC-Users-' + user.id);

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.promise().resolve(cache);
        } else {

            listUrl += "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=%27" + loginNamePrefix + user.loginName + "%27";

            // else get data and return promise.
            $.ajax({
                type: "GET",
                url: listUrl,
                dataType: 'json',
                success: function(data) {
                    // On complete, cache results
                    SPOC.Utils.Storage.set('SPOCC-Users-' + user.id, data);
                    deferred.resolve(data);
                }
            });

            return deferred.promise();
        }
    };

    return methods;
};