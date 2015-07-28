// SharePoint List Items Functionlity



SPOC.SPSite.prototype.ListItems = function(listTitle) {

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
            return cache;
        }

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
     * Deletes a list items
     * @params  Object Delete list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
     methods.delete = function(item) {
        var listUrl = item.__metadata.uri;

        if (settings) {
            $.extend(data, settings);
        }

        return $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(data),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": "*",
                'Content-Type': "application/json;odata=verbose"
            }
        });
    };

    /**
     * Deletes a list items get by Id
     * @params  Object Delete list settings
     * List of options can be found at https://msdn.microsoft.com/en-us/library/office/dn292552.aspx
     * @return  jQuery Deferred Object
     */
     methods.deleteById = function(id) {
        var listUrl = site.url + '/_api/lists/getByTitle%28%27' + listTitle + '%27%29/items';
        var data = {
            __metadata: {
                'type': SPOC.Utils.SP.getListItemType(listTitle)
            }
        };

        if (settings) {
            $.extend(data, settings);
        }

        return $.ajax({
            type: "POST",
            url: listUrl,
            data: JSON.stringify(data),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": "*",
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
     methods.uploadDocument = function(GUID, settings, callback) {
        var dialogOptions = {};

            if(settings){
                dialogOptions = settings;
            }

            dialogOptions.url = site.url + "/_layouts/Upload.aspx?List=" + GUID + "&IsDlg=1";
            dialogOptions.dialogReturnValueCallback = Function.createDelegate(null, callback);
            SP.UI.ModalDialog.showModalDialog(dialogOptions);
            $('iframe').last().contents().find('#ctl00_PlaceHolderMain_UploadDocumentSection_ctl05_OpenWithExplorerLink').hide();
        });
    };


    return methods;
};