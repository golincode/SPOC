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
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';

        // Get query from cache.
        var cache = SPOC.Utils.Storage.get('SPOCC-listitems' + listTitle);

        // Convert and append query params
        listUrl += settings ? '?' + SPOC.Utils.convertObjToQueryString(settings) : '';

        // Return cached version if available
        if (cache && !forceNoCache) {
            return $.Deferred().resolve(cache);
        } else {

            // else get data and return promise.
            return $.ajax({
                type: "GET",
                url: listUrl,
                dataType: 'json',
                headers: {
                    "Accept": "application/json;odata=verbose" + verbose ? "verbose" : "nometadata"
                },
                complete: function(data) {
                    // On complete, cache results
                    SPOC.Utils.Storage.set('SPOCC-listitems' + listTitle, data);
                }
            });
        }
    };

    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.create = function(items) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var data = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (settings) {
            $.extend(data, items);
        }

        return $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(data),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };


    /**
     * Creates a new list items
     * @params  Object Create list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.update = function(id, data) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var defaults = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            },
            BaseTemplate: 100,
            Description: '',
        };

        if (settings) {
            $.extend(defaults, settings);
        }

        return $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(defaults),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };


    /**
     * Upload document in a document library
     * @params  Upload document: GUID document library, callBack function, setting object for the modal dialog
     * setting: {'width': number, 'height': number, 'title': string}
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
    methods.uploadDocument = function(GUID, settings) {
        var promise = $.Deferred();
        var dialogOptions = {};

        if (settings) {
            $.extend(dialogOptions, settings);
        }

        dialogOptions.url = site.url + "/_layouts/Upload.aspx?List=" + GUID + "&IsDlg=1";
        dialogOptions.dialogReturnValueCallback = Function.createDelegate(null, function(result) {
            promise.resolve(result);
        });

        SP.UI.ModalDialog.showModalDialog(dialogOptions);
        return promise;
    };


    return methods;
};