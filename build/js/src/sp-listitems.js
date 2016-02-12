// SharePoint List Items Functionlity

SPOC.SP.Site.prototype.ListItems = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return promise
     */
    methods.query = function(settings, forceNoCache, headers) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items';

        listUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';

        return SPOC.Utils.Request.get(listUrl, forceNoCache);
    };


    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  promise
     */
    methods.create = function(data) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (data) {
            defaults = SPOC.Utils.Objects.merge(defaults, data);
        }

        return SPOC.Utils.Request.post(listUrl, defaults);
    };


    /**
     * Updates a list item
     * @params  Object ID, Update list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return promise
     */
    methods.update = function(id, data) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items(' + id + ')';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (data) {
            defaults = SPOC.Utils.Objects.merge(defaults, data);
        }

        return SPOC.Utils.Request.put(listUrl, defaults);
    };

    /**
     * Deletes a list item
     * @params  Object ID
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return promise
     */
    methods.delete = function(id) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items(' + id + ')';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        return SPOC.Utils.Request.delete(listUrl, defaults);
    };

    return methods;
};
