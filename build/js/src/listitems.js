// SharePoint List Items Functionlity

SPOC.SPSite.prototype.list = function(listTitle) {

    // save reference to this
    var site = this;

    // Create object to store public methods
    var methods = {};

    /**
     * Queries a SharePont list via REST API
     * @params  Object query filter paramators in obj format
     * @return  jQuery Deferred Object
     */
    methods.query = function(settings) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        listUrl += settings ? '?' + SPOC.Utils.convertObjToQueryString(settings) : '';

        return $.ajax({
            type: "GET",
            url: listUrl,
            dataType: 'json',
            complete: function(data) {
                // On complete, cache results
                SPOC.Utils.storage.set('SPOCC-listitems' + listTitle, data);
            }
        });

    };

    methods.getCached = function(listTitle) {
        return SPOC.Utils.storage.get('SPOCC-listitems' + listTitle);
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
            $.extend(defaults, settings);
        }

        return $.ajax({
            type: "POST",
            url: site.url + '/_api/web/lists',
            data: JSON.stringify(defaults),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };


    return methods;
};
