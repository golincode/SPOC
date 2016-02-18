// SharePoint List Functionlity

SPOC.SP.Site.prototype.Lists = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  promise
     */
    methods.query = function(settings, cache) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/';

        listUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';

        return SPOC.Utils.Request.get(listUrl, cache);
    };

    /**
     * Creates a new SharePoint List
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  promise
     */
    methods.create = function(settings) {
        var defaults = {
            __metadata: {
                'type': 'SP.List'
            },
            BaseTemplate: 100,
            Description: '',
        };

        if (settings) {
            defaults = SPOC.Utils.Objects.merge(defaults, settings);
        }

        var url = site.url + '/_api/web/lists';

        return SPOC.Utils.Request.post(url, defaults);
    };

    /**
     * Updates a list
     * @params  data object of properties
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return promise
     */
    methods.update = function(data) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29';
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
     * Deletes a list
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return promise
     */
    methods.delete = function() {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29';

        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        return SPOC.Utils.Request.delete(listUrl, defaults);
    };

    return methods;
};
