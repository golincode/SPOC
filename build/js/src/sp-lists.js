// SharePoint List Functionlity

SPOC.SP.Site.prototype.Lists = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache) {
        var deferred = $.Deferred();
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/';
        var cache = SPOC.Utils.Storage.get('SPOCC-list' + listTitle);

        listUrl += settings ? '?' + SPOC.Utils.Conversion.convertObjToQueryString(settings) : '';

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.resolve(cache);
        } else {

            // else get data and return promise.
            $.ajax({
                type: "GET",
                url: listUrl,
                dataType: 'json',
                success: function(data) {
                    // On complete, cache results
                    SPOC.Utils.Storage.set('SPOCC-list' + listTitle, data);
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            });

            return deferred.promise();
        }

    };

    /**
     * Creates a new SharePoint List
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.create = function(settings) {
        var deferred = $.Deferred();
        var defaults = {
            __metadata: {
                'type': 'SP.List'
            },
            BaseTemplate: 100,
            Description: '',
        };

        if (settings) {
            $.extend(defaults, settings);
        }

        $.ajax({
            type: "POST",
            url: site.url + '/_api/web/lists',
            data: JSON.stringify(defaults),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            },
            success: function(data) {
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