// SharePoint List Items Functionlity



SPOC.SP.Site.prototype.ListItems = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings, forceNoCache, verbose) {
        var deferred = $.Deferred();

        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOC-list-items-' + listTitle);

        // Convert and append query params
        listUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';

        // Return cached version if available
        if (cache && !forceNoCache) {
            return deferred.resolve(cache);
        } else {

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
                    SPOC.Utils.Storage.set('SPOC-list-items-' + listTitle, data);
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
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.create = function(items) {
        var deferred = $.Deferred();

        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var data = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (items) {
            $.extend(data, items);
        }

        $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(data),
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


    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.update = function(id, data) {
        var deferred = $.Deferred();
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items(' + id + ')';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (data) {
            $.extend(defaults, data);
        }

        $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(defaults),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose",
                "X-HTTP-Method": "MERGE",
                "If-Match": "*"
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