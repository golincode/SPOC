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
    methods.query = function(settings, cache, headers) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items';

        listUrl += settings ? '?' + SPOC.Utils.Conversion.objToQueryString(settings) : '';

        return SPOC.Utils.Request.get(listUrl, cache);
    };


    /**
     * Queries a SharePont list via the CSOM
     * @params  camlQuery string CAML query to filter
     * @return promise
     */
    methods.queryCSOM = function(camlQuery) {
        return new Promise(function(resolve, reject) {
            var ctx = new SP.ClientContext(site.url);
            var list = ctx.get_web().get_lists().getByTitle(listTitle);
            var query,
                currentItem = {},
                pageItem;

            if (camlQuery) {
                query = new SP.CamlQuery();
                query.set_viewXml(camlQuery);
            } else {
                query = SP.CamlQuery.createAllItemsQuery();
            }

            var items = list.getItems(query);
            ctx.load(items);
            ctx.executeQueryAsync(function() {
                var result = items.get_data().map(function(i){
                    return i.get_fieldValues();   
                });

                resolve(result);

            }, function(err) {
                reject(err);
            });
        });
    };

    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  promise
     */
    methods.create = function(data, library) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle, library)
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
    methods.update = function(id, data, library) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items(' + id + ')';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle, library)
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
    methods.delete = function(id, library) {
        var listUrl = site.url + '/_api/web/lists/getByTitle%28%27' + listTitle + '%27%29/items(' + id + ')';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle, library)
            }
        };

        return SPOC.Utils.Request.delete(listUrl, defaults);
    };

    return methods;
};
