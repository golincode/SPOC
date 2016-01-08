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
    methods.query = function(settings, forceNoCache) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/';

        listUrl += settings ? '?' + SPOC.Utils.Conversion.convertObjToQueryString(settings) : '';

        return SPOC.Utils.Request.get(listUrl, forceNoCache);
    };

    /**
     * Creates a new SharePoint List
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
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

    return methods;
};