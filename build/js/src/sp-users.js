// SharePoint List Functionlity

SPOC.SPSite.prototype.Users = function() {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont User via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(account) {
        var listUrl = site.url;
        var cache = SPOC.Utils.Storage.get('SPOCC-Users');

        listUrl += account ? "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=%27" + account + "%27" : "/_api/SP.UserProfiles.PeopleManager/GetMyProperties";

        // else get data and return promise.
        return $.ajax({
            type: "GET",
            url: listUrl,
            dataType: 'json',
            complete: function() {
                // On complete, cache results
                SPOC.Utils.Storage.set('SPOCC-Users', data);
            }
        });
    };

    methods.getUserId = function(){
        // Returns logged in users id
        return _spPageContextInfo.userId;
    };

    methods.getUserLoginName = function(){
        // Returns logged in users id
        return _spPageContextInfo.userLoginName;
    };

    return methods;
};